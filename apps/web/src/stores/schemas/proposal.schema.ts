import { z } from "zod";

/**
 * Zod Schema for Step 1: Company Details Form
 */
export const companyDetailsSchema = z.object({
  companyName: z
    .string()
    .trim()
    .min(2, "Company name must be at least 2 characters")
    .max(120, "Company name cannot exceed 120 characters"),
  contactNumber: z
    .string()
    .trim()
    .min(6, "Contact number is required")
    .regex(/^[+\d\s\-()]+$/, "Please enter a valid phone number (e.g. +971 4 222222)"),
  contactPerson: z
    .string()
    .trim()
    .min(2, "Contact person name is required"),
  location: z
    .string()
    .trim()
    .min(3, "Location is required"),
  emailAddress: z
    .string()
    .trim()
    .min(1, "Email address is required")
    .email("Please enter a valid email address (e.g. info@company.com)"),
  industry: z
    .string()
    .trim()
    .min(1, "Please select an industry"),
  requiredServices: z
    .string()
    .trim()
    .min(1, "Please select required services"),
  projectDescription: z
    .string()
    .trim()
    .max(2000, "Project description cannot exceed 2000 characters")
    .optional()
    .or(z.literal("")),
  expectedDeliveryDate: z
    .string()
    .trim()
    .min(1, "Expected delivery date is required"),
  additionalNotes: z
    .string()
    .trim()
    .max(1000, "Additional notes cannot exceed 1000 characters")
    .optional()
    .or(z.literal("")),
});

export type CompanyDetailsFormData = z.infer<typeof companyDetailsSchema>;
export type CompanyDetailsField = keyof CompanyDetailsFormData;

/**
 * Zod Schema for Step 2: Package Selection
 */
export const presetPackageTierEnum = z.enum([
  "basic",
  "starter",
  "business",
  "professional",
  "premium",
  "growth",
  "scale",
  "local-seo",
  "growth-seo",
  "authority-seo",
  "brand-starter",
  "business-identity",
  "complete-brand",
  "content-starter",
  "content-growth",
  "content-pro",
  "lead-starter",
  "lead-growth",
  "lead-scale",
  "growth-360",
  "video-starter",
  "video-growth",
  "video-pro",
]);
export const packageTierEnum = z.union([presetPackageTierEnum, z.string()]);
export type PackageTierId = z.infer<typeof packageTierEnum>;

export const serviceCategoryEnum = z.string().min(1);
export type ServiceCategoryId = string;

export const ecommerceTierEnum = z.enum(["mini", "standard"]);
export type EcommerceTierId = z.infer<typeof ecommerceTierEnum>;

export const packageSelectionSchema = z.object({
  category: serviceCategoryEnum,
  tier: packageTierEnum.nullable(),
  ecommerce: ecommerceTierEnum.nullable(),
});

export type PackageSelectionData = z.infer<typeof packageSelectionSchema>;

/**
 * Zod Schema for Step 3: Add-ons
 */
export const addonItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number(),
  unit: z.string().optional(),
});
export type AddonItem = z.infer<typeof addonItemSchema>;

export const addonsSelectionSchema = z.object({
  selectedIds: z.array(z.string()),
});
export type AddonsSelectionData = z.infer<typeof addonsSelectionSchema>;

/**
 * Zod Schema for Full Proposal Draft (combining steps + metadata)
 */
export const clientRoleEnum = z.enum(["SALES_STAFF", "REPORTS"]);
export type ClientRole = z.infer<typeof clientRoleEnum>;

export const proposalDraftSchema = z.object({
  companyDetails: companyDetailsSchema,
  packageSelection: packageSelectionSchema,
  selectedAddonIds: z.array(z.string()).default([]),
  activeRole: clientRoleEnum,
  isDarkMode: z.boolean(),
  currentStep: z.number().int().min(1).max(4),
  updatedAt: z.string().optional(),
});

export type ProposalDraftData = z.infer<typeof proposalDraftSchema>;

