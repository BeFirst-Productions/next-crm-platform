import { prisma } from "@/lib/prisma";
import { logger } from "@/config/logger";
import { NotificationType } from "@prisma/client";
import { emitToRole, emitToUser } from "@/common/socket/socket.server";

export interface NotifyInput {
  userId?: string;
  targetRole?: string;
  type: NotificationType;
  title: string;
  message: string;
  referenceType?: string;
  referenceId?: string;
}

/**
 * Creates in-app notification DB row(s) and broadcasts real-time Socket event.
 */
export async function createNotificationAndEmit(input: NotifyInput): Promise<void> {
  try {
    if (input.userId) {
      // 1. Single target user
      const created = await prisma.notification.create({
        data: {
          userId: input.userId,
          type: input.type,
          title: input.title,
          message: input.message,
          referenceType: input.referenceType,
          referenceId: input.referenceId,
        },
      });

      // Real-time emit to targeted user socket room
      emitToUser(input.userId, "notification:new", created);
    } else if (input.targetRole) {
      // 2. Target role (e.g. SUPER_ADMIN) — create notification for all users holding this role
      const users = await prisma.user.findMany({
        where: { role: input.targetRole as never, status: "ACTIVE" },
        select: { id: true },
      });

      if (users.length > 0) {
        const rows = users.map((u) => ({
          userId: u.id,
          type: input.type,
          title: input.title,
          message: input.message,
          referenceType: input.referenceType,
          referenceId: input.referenceId,
        }));

        await prisma.notification.createMany({ data: rows });
      }

      // Real-time emit to role socket room (e.g. role:SUPER_ADMIN)
      emitToRole(input.targetRole, "notification:new", {
        type: input.type,
        title: input.title,
        message: input.message,
        referenceType: input.referenceType,
        referenceId: input.referenceId,
        createdAt: new Date().toISOString(),
      });
    }
  } catch (err) {
    logger.warn({ err, input }, "Failed to process notification and emit socket event");
  }
}

export async function listNotifications(userId: string, unreadOnly = false) {
  return prisma.notification.findMany({
    where: { userId, ...(unreadOnly ? { isRead: false } : {}) },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
}

export async function markAsRead(userId: string, id: string) {
  return prisma.notification.updateMany({ where: { id, userId }, data: { isRead: true } });
}

export async function markAllAsRead(userId: string) {
  return prisma.notification.updateMany({ where: { userId, isRead: false }, data: { isRead: true } });
}
