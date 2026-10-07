import { appEvents, UserEventPayload, LeadCreatedPayload, LeadStatusChangedPayload } from "@/common/events/app-events";
import { AppEvent } from "@/common/events/event-names";
import { createNotificationAndEmit } from "@/modules/notifications/notifications.service";
import { logger } from "@/config/logger";
import { prisma } from "@/lib/prisma";

/**
 * Registers all application domain event listeners.
 * Implements business notification rules & routing.
 */
export function registerNotificationListeners(): void {
  logger.info("  ↳ Registering real-time notification event listeners...");

  // ─── Case 1: Sales Staff Login Notification ──────────────────────────────────
  appEvents.onEvent<UserEventPayload>(AppEvent.USER_LOGIN, async (payload) => {
    if (payload.user.role === "SALES_STAFF") {
      await createNotificationAndEmit({
        targetRole: "SUPER_ADMIN",
        type: "SYSTEM",
        title: "Sales Staff Signed In",
        message: `${payload.user.name} (${payload.user.email}) logged into the CRM system.`,
      });
    }
  });

  // ─── Case 1b: Sales Staff Logout Notification ────────────────────────────────
  appEvents.onEvent<UserEventPayload>(AppEvent.USER_LOGOUT, async (payload) => {
    if (payload.user.role === "SALES_STAFF") {
      await createNotificationAndEmit({
        targetRole: "SUPER_ADMIN",
        type: "SYSTEM",
        title: "Sales Staff Signed Out",
        message: `${payload.user.name} (${payload.user.email}) logged out of the CRM system.`,
      });
    }
  });

  // ─── Case 2: Lead Created by Sales Staff (Filtered out Marketing) ───────────
  appEvents.onEvent<LeadCreatedPayload>(AppEvent.LEAD_CREATED, async (payload) => {
    // Business Rule: ONLY notify Super Admin if created by Sales Staff.
    // If created by Marketing Team, ignore / do NOT notify.
    if (payload.creator.role === "SALES_STAFF") {
      const leadName = payload.lead.companyName
        ? `${payload.lead.companyName} (${payload.lead.contactName})`
        : payload.lead.contactName;

      await createNotificationAndEmit({
        targetRole: "SUPER_ADMIN",
        type: "NEW_LEAD_ASSIGNED",
        title: "New Lead Added by Sales Staff",
        message: `Sales Staff ${payload.creator.name} created lead "${leadName}".`,
        referenceType: "lead",
        referenceId: payload.lead.id,
      });
    }
  });

  // ─── Case 3: Lead Status Changed / Converted to Client ───────────────────────
  appEvents.onEvent<LeadStatusChangedPayload>(AppEvent.LEAD_STATUS_CHANGED, async (payload) => {
    const isConverted =
      payload.newStatus === "CLIENT" ||
      payload.newStatus === "CONTRACT_SIGNED" ||
      payload.newStatus === "APPROVED";

    if (isConverted) {
      const leadName = payload.lead.companyName
        ? `${payload.lead.companyName} (${payload.lead.contactName})`
        : payload.lead.contactName;

      let clientId = payload.clientId;
      if (!clientId) {
        const client = await prisma.client.findFirst({
          where: { leadId: payload.lead.id },
          select: { id: true },
        });
        clientId = client?.id;
      }

      await createNotificationAndEmit({
        targetRole: "SUPER_ADMIN",
        type: "CONTRACT_SIGNED",
        title: "Lead Converted to Client! 🎉",
        message: `Lead "${leadName}" was converted to Client by ${payload.actor.name}.`,
        referenceType: "client",
        referenceId: clientId || payload.lead.id,
      });
    }
  });
}
