import { z } from "zod";
import { ROLES, type Role } from "@next-digital-crm/shared-types";

export const userSessionSchema = z.object({
  id: z.string().min(1, "User ID is required"),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  role: z.enum(ROLES as unknown as [Role, ...Role[]]),
  status: z.string().optional(),
  permissions: z.array(z.string()).optional(),
  settings: z.record(z.unknown()).optional(),
  createdAt: z.string().optional(),
});

export type ValidatedUserSession = z.infer<typeof userSessionSchema>;
