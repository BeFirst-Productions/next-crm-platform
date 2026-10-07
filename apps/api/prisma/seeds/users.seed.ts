import { PrismaClient } from "@prisma/client";
import * as argon2 from "argon2";

const ROLE_DEFAULT_PERMISSIONS = {
  SUPER_ADMIN: ["*"],
  ADMIN: [
    "leads:list", "leads:create", "leads:edit", "leads:delete", "leads:export",
    "clients:list", "clients:create", "clients:edit", "clients:delete", "clients:export",
    "proposals:list", "proposals:create", "proposals:edit", "proposals:approve", "proposals:export",
    "contracts:list", "contracts:create", "contracts:edit", "contracts:export",
    "invoices:list", "invoices:create", "invoices:edit", "invoices:export",
    "payments:list", "payments:create", "payments:edit", "payments:export",
    "commissions:list", "commissions:edit",
    "targets:list", "targets:edit",
    "services:list", "services:create", "services:edit",
    "reports:list", "reports:export",
    "marketing:list", "marketing:analytics",
    "audit:list",
  ],
  SALES_STAFF: [
    "leads:list", "leads:create", "leads:edit",
    "clients:list", "clients:create", "clients:edit",
    "proposals:list", "proposals:create", "proposals:edit",
    "contracts:list",
    "invoices:list",
    "commissions:list",
    "targets:list",
    "services:list",
  ],
  MARKETING_TEAM: [
    "marketing:list", "marketing:create", "marketing:edit", "marketing:delete", "marketing:analytics",
    "leads:list", "leads:create",
    "services:list",
    "reports:list",
  ],
};

async function seedDepartments(prisma: PrismaClient) {
  console.log("  ↳ Seeding departments...");
  const depts = ["Management", "Administration", "Sales", "Marketing", "Engineering"];
  const map: Record<string, string> = {};

  for (const name of depts) {
    const d = await prisma.department.upsert({
      where: { name },
      update: {},
      create: { name, description: `${name} department` },
    });
    map[name] = d.id;
  }
  return map;
}

export async function seedUsers(prisma: PrismaClient) {
  console.log("  ↳ Seeding users for all 4 enterprise roles...");

  // Seed departments first
  const deptIds = await seedDepartments(prisma);

  // 1. Super Admin (Total Controller) — no department, no sales target
  const superAdminEmail = process.env.SUPERADMIN_EMAIL || "superadmin@next.com";
  const superAdminPlainPassword = process.env.SUPERADMIN_PASSWORD || "Superadmin@123";
  const superAdminPassword = await argon2.hash(superAdminPlainPassword, { type: argon2.argon2id });

  const superAdmin = await prisma.user.upsert({
    where: { employeeId: "USR-0001" },
    update: {
      email: superAdminEmail,
      passwordHash: superAdminPassword,
      permissions: ROLE_DEFAULT_PERMISSIONS.SUPER_ADMIN,
    },
    create: {
      employeeId: "USR-0001",
      name: "Super Admin",
      email: superAdminEmail,
      passwordHash: superAdminPassword,
      role: "SUPER_ADMIN",
      status: "ACTIVE",
      permissions: ROLE_DEFAULT_PERMISSIONS.SUPER_ADMIN,
      settings: {
        theme: "dark",
        notifications: { email: true, inApp: true },
        dashboardView: "global_command_center",
      },
    },
  });

  // 2. Operations Admin
  const adminPassword = await argon2.hash("Admin@12345", { type: argon2.argon2id });
  const admin = await prisma.user.upsert({
    where: { employeeId: "USR-0002" },
    update: {
      email: "admin@next.com",
      passwordHash: adminPassword,
      permissions: ROLE_DEFAULT_PERMISSIONS.ADMIN,
    },
    create: {
      employeeId: "USR-0002",
      name: "Sarah (Operations Admin)",
      email: "admin@next.com",
      passwordHash: adminPassword,
      role: "ADMIN",
      status: "ACTIVE",
      departmentId: deptIds["Administration"],
      joiningDate: new Date("2025-01-10"),
      permissions: ROLE_DEFAULT_PERMISSIONS.ADMIN,
      settings: {
        theme: "dark",
        notifications: { email: true, inApp: true },
        dashboardView: "operations_overview",
      },
    },
  });

  // 3. Sales Staff
  const staffPassword = await argon2.hash("Staff@12345", { type: argon2.argon2id });
  const staff = await prisma.user.upsert({
    where: { employeeId: "USR-0003" },
    update: {
      email: "staff@nextdigital.com",
      passwordHash: staffPassword,
      permissions: ROLE_DEFAULT_PERMISSIONS.SALES_STAFF,
    },
    create: {
      employeeId: "USR-0003",
      name: "Anaz (Sales Staff)",
      email: "staff@nextdigital.com",
      passwordHash: staffPassword,
      role: "SALES_STAFF",
      status: "ACTIVE",
      departmentId: deptIds["Sales"],
      joiningDate: new Date("2025-02-15"),
      salesTarget: 50000,
      commissionPercentage: 10,
      permissions: ROLE_DEFAULT_PERMISSIONS.SALES_STAFF,
      settings: {
        theme: "dark",
        notifications: { email: true, inApp: true },
        dashboardView: "personal_sales_cockpit",
      },
    },
  });

  // 4. Marketing Team
  const marketingPassword = await argon2.hash("Market@12345", { type: argon2.argon2id });
  const marketing = await prisma.user.upsert({
    where: { employeeId: "USR-0004" },
    update: {
      email: "marketing@nextdigital.crm",
      passwordHash: marketingPassword,
      permissions: ROLE_DEFAULT_PERMISSIONS.MARKETING_TEAM,
    },
    create: {
      employeeId: "USR-0004",
      name: "Elena (Marketing Lead)",
      email: "marketing@nextdigital.crm",
      passwordHash: marketingPassword,
      role: "MARKETING_TEAM",
      status: "ACTIVE",
      departmentId: deptIds["Marketing"],
      joiningDate: new Date("2025-03-12"),
      salesTarget: 30000,
      commissionPercentage: 7,
      permissions: ROLE_DEFAULT_PERMISSIONS.MARKETING_TEAM,
      settings: {
        theme: "dark",
        notifications: { email: true, inApp: true },
        dashboardView: "marketing_growth_hub",
      },
    },
  });

  return { superAdmin, admin, staff, marketing };
}
