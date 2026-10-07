import { Request, Response } from "express";
import { ApiResponse } from "@/common/utils/ApiResponse";
import * as service from "@/modules/notifications/notifications.service";

export async function list(req: Request, res: Response) {
  const unreadOnly = req.query.unread === "true";
  const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
  const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 50;

  const items = await service.listNotifications(req.user!.sub, { unreadOnly, page, limit });
  return ApiResponse.success(res, items, "Notifications fetched");
}

export async function markRead(req: Request, res: Response) {
  await service.markAsRead(req.user!.sub, req.params.id);
  return ApiResponse.success(res, null, "Notification marked as read");
}

export async function markAllRead(req: Request, res: Response) {
  await service.markAllAsRead(req.user!.sub);
  return ApiResponse.success(res, null, "All notifications marked as read");
}

export async function remove(req: Request, res: Response) {
  await service.deleteNotification(req.user!.sub, req.params.id);
  return ApiResponse.success(res, null, "Notification deleted");
}
