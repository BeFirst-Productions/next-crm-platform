import { z } from "zod";
import { paginationSchema } from "@/common/utils/pagination";

const proposalItemInput = z.object({
  itemType: z.enum(["PACKAGE", "ADDON"]),
  packageId: z.string().min(1).optional(),
  addonId: z.string().min(1).optional(),
  quantity: z.number().int().positive().default(1),
}).refine((v) => (v.itemType === "PACKAGE" ? !!v.packageId : !!v.addonId), {
  message: "packageId is required for PACKAGE items, addonId is required for ADDON items",
});

export const createProposalSchema = z.object({
  body: z.object({
    leadId: z.string().uuid().optional(),
    clientId: z.string().uuid().optional(),
    expectedDeliveryDate: z.coerce.date().optional(),
    projectDescription: z.string().optional(),
    notes: z.string().optional(),
    discount: z.coerce.number().nonnegative().default(0),
    taxRatePercent: z.coerce.number().min(0).max(100).default(0),
    items: z.array(proposalItemInput).min(1, "At least one package or add-on is required"),
  }),
});

export const updateProposalItemsSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: z.object({
    items: z.array(proposalItemInput).min(1),
    discount: z.coerce.number().nonnegative().optional(),
    taxRatePercent: z.coerce.number().min(0).max(100).optional(),
  }),
});

export const listProposalsSchema = z.object({
  query: paginationSchema.extend({
    status: z
      .enum(["DRAFT","SUBMITTED","UNDER_REVIEW","APPROVED","SENT_TO_CLIENT","CLIENT_ACCEPTED","CONTRACT_CREATED","REJECTED","CANCELLED","EXPIRED"])
      .optional(),
  }),
});

export const idParamSchema = z.object({ params: z.object({ id: z.string().uuid() }) });

export const transitionSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: z.object({ note: z.string().optional() }),
});

export const saveClientProposalSchema = z.object({
  body: z.object({
    companyDetails: z.object({
      companyName: z.string().min(1, "Company name is required"),
      contactPerson: z.string().min(1, "Contact person is required"),
      emailAddress: z.string().optional(),
      contactNumber: z.string().optional(),
      location: z.string().optional(),
      industry: z.string().optional(),
      requiredServices: z.string().optional(),
      expectedDeliveryDate: z.string().optional(),
      projectDescription: z.string().optional(),
      additionalNotes: z.string().optional(),
    }),
    packageSelection: z.object({
      category: z.string().optional(),
      tier: z.string().nullable().optional(),
      ecommerce: z.string().nullable().optional(),
    }).optional(),
    packageId: z.string().optional(),
    packageName: z.string().optional(),
    packagePrice: z.coerce.number().optional(),
    selectedAddons: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        price: z.coerce.number(),
      })
    ).optional(),
    subTotal: z.coerce.number().optional(),
    vatAmount: z.coerce.number().optional(),
    grandTotal: z.coerce.number().optional(),
    status: z.enum(["DRAFT", "SUBMITTED"]).optional(),
    notes: z.string().optional(),
  }),
});

