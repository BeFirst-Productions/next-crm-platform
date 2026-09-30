/**
 * Central registry of all domain event names emitted across the system.
 * Add new event constants here as the CRM grows.
 */
export enum AppEvent {
  USER_LOGIN = "user.login",
  USER_LOGOUT = "user.logout",
  LEAD_CREATED = "lead.created",
  LEAD_STATUS_CHANGED = "lead.status_changed",
  LEAD_CONVERTED = "lead.converted",
  PROPOSAL_SUBMITTED = "proposal.submitted",
  PROPOSAL_APPROVED = "proposal.approved",
  CONTRACT_SIGNED = "contract.signed",
  INVOICE_GENERATED = "invoice.generated",
  PAYMENT_RECEIVED = "payment.received",
}
