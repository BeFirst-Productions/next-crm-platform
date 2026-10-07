import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword } from "@/common/utils/password";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "@/common/utils/tokens";
import { ConflictError, UnauthorizedError } from "@/common/errors/AppError";
import { LoginInput, RegisterInput } from "@/modules/auth/auth.validation";
import { recordAuditLog } from "@/modules/audit/audit.service";
import { RoleName, ROLE_DEFAULT_PERMISSIONS } from "@/common/constants/roles";
import { appEvents } from "@/common/events/app-events";
import { AppEvent } from "@/common/events/event-names";
import crypto from "crypto";

function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

async function issueTokenPair(user: { id: string; email: string; role: RoleName; permissions?: string[] }) {
  const accessToken = signAccessToken({
    sub: user.id,
    email: user.email,
    role: user.role,
    permissions: user.permissions,
  });
  const refreshToken = signRefreshToken(user.id);

  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      tokenHash: hashToken(refreshToken),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  return { accessToken, refreshToken };
}

export async function registerUser(input: RegisterInput, actorId?: string, actorRole?: RoleName) {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) {
    throw new ConflictError("A user with this email already exists");
  }

  // Count existing users: if 0 users exist in DB, allow first user to bootstrap as SUPER_ADMIN
  const count = await prisma.user.count();
  const isFirstUser = count === 0;

  // Only an existing SUPER_ADMIN or the first user can choose privileged roles
  let role: RoleName = "SALES_STAFF";
  let permissions: string[] | undefined = undefined;

  if (isFirstUser || actorRole === "SUPER_ADMIN") {
    role = (input.role as RoleName) ?? "SALES_STAFF";
    permissions = input.permissions;
  }

  const effectivePermissions = permissions ?? ROLE_DEFAULT_PERMISSIONS[role] ?? [];

  // Generate sequential USR-XXXX employee ID
  const employeeId = `USR-${String(count + 1).padStart(4, "0")}`;

  const passwordHash = await hashPassword(input.password);
  const user = await prisma.user.create({
    data: {
      employeeId,
      name: input.name,
      email: input.email,
      passwordHash,
      role,
      permissions: effectivePermissions,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      permissions: true,
      settings: true,
      createdAt: true,
    },
  });

  await recordAuditLog({
    userId: actorId ?? user.id,
    action: "CREATE",
    module: "users",
    recordId: user.id,
    newValues: user,
  });

  return user;
}

export async function getCurrentUser(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      employeeId: true,
      name: true,
      email: true,
      role: true,
      status: true,
      phone: true,
      avatarUrl: true,
      departmentId: true,
      department: { select: { id: true, name: true } },
      joiningDate: true,
      salesTarget: true,
      commissionPercentage: true,
      permissions: true,
      settings: true,
      canManageUsers: true,
      manageUsersExpiresAt: true,
      lastLoginAt: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new UnauthorizedError("User session no longer exists");
  }

  if (user.status !== "ACTIVE") {
    throw new UnauthorizedError("Account is no longer active");
  }

  return user;
}

export async function loginUser(input: LoginInput, ipAddress?: string) {
  const user = await prisma.user.findUnique({ where: { email: input.email } });

  const passwordMatches = user ? await verifyPassword(user.passwordHash, input.password) : false;

  await prisma.loginLog.create({
    data: { userId: user?.id, email: input.email, success: !!passwordMatches, ipAddress },
  });

  if (!user || !passwordMatches) {
    throw new UnauthorizedError("Invalid email or password");
  }

  if (user.status !== "ACTIVE") {
    throw new UnauthorizedError("Your account is not active. Contact your administrator.");
  }

  const role = user.role as RoleName;
  const permissions = (user.permissions && user.permissions.length > 0)
    ? user.permissions
    : (ROLE_DEFAULT_PERMISSIONS[role] ?? []);

  const tokens = await issueTokenPair({ ...user, role, permissions });
  await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });

  // Emit domain event for real-time notifications
  appEvents.emitEvent(AppEvent.USER_LOGIN, {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role,
    },
    ipAddress,
    timestamp: new Date().toISOString(),
  });

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      permissions,
      settings: user.settings as Record<string, unknown> | null,
    },
    ...tokens,
  };
}

export async function refreshTokens(refreshToken: string) {
  let payload: { sub: string };
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    throw new UnauthorizedError("Invalid or expired refresh token");
  }

  const tokenHash = hashToken(refreshToken);
  const stored = await prisma.refreshToken.findUnique({ where: { tokenHash } });

  if (!stored || stored.revoked || stored.expiresAt < new Date()) {
    throw new UnauthorizedError("Refresh token has been revoked or expired");
  }

  const user = await prisma.user.findUnique({ where: { id: payload.sub } });
  if (!user || user.status !== "ACTIVE") {
    throw new UnauthorizedError("Account no longer active");
  }

  const role = user.role as RoleName;
  const permissions = user.permissions.length > 0 ? user.permissions : ROLE_DEFAULT_PERMISSIONS[role];

  // Rotate: revoke the used refresh token, issue a brand new pair
  await prisma.refreshToken.update({ where: { id: stored.id }, data: { revoked: true } });
  const tokens = await issueTokenPair({ ...user, role, permissions });

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      permissions,
      settings: user.settings as Record<string, unknown> | null,
    },
    ...tokens,
  };
}

export async function logoutUser(refreshToken: string, actorUser?: { id: string; name: string; email: string; role: RoleName }) {
  const tokenHash = hashToken(refreshToken);
  await prisma.refreshToken.updateMany({
    where: { tokenHash },
    data: { revoked: true },
  });

  if (actorUser) {
    appEvents.emitEvent(AppEvent.USER_LOGOUT, {
      user: actorUser,
      timestamp: new Date().toISOString(),
    });
  }
}
