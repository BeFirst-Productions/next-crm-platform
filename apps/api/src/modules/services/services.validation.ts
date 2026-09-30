import { z } from "zod";

export const createCategorySchema = z.object({
  body: z.object({
    name: z.string().min(2),
    description: z.string().optional(),
    hasAddons: z.boolean().default(false),
    status: z.boolean().default(true),
    sortOrder: z.number().int().default(0),
  }),
});

export const updateCategorySchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: z.object({
    name: z.string().min(2).optional(),
    description: z.string().optional(),
    hasAddons: z.boolean().optional(),
    status: z.boolean().optional(),
    sortOrder: z.number().int().optional(),
  }),
});

const featureSchema = z.object({
  featureName: z.string().min(1),
  featureValue: z.string().optional(),
  included: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});

export const createPackageSchema = z.object({
  body: z.object({
    categoryId: z.string().uuid(),
    name: z.string().min(2),
    description: z.string().optional(),
    price: z.coerce.number().nonnegative(),
    billingType: z.enum(["ONE_TIME", "MONTHLY", "YEARLY", "CUSTOM"]).default("ONE_TIME"),
    duration: z.string().optional(),
    icon: z.string().optional(),
    status: z.boolean().default(true),
    isPopular: z.boolean().default(false),
    sortOrder: z.number().int().default(0),
    features: z.array(featureSchema).optional(),
  }),
});

export const updatePackageSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: z.object({
    categoryId: z.string().uuid().optional(),
    name: z.string().min(2).optional(),
    description: z.string().optional(),
    price: z.coerce.number().nonnegative().optional(),
    billingType: z.enum(["ONE_TIME", "MONTHLY", "YEARLY", "CUSTOM"]).optional(),
    duration: z.string().optional(),
    icon: z.string().optional(),
    status: z.boolean().optional(),
    isPopular: z.boolean().optional(),
    sortOrder: z.number().int().optional(),
    features: z.array(featureSchema).optional(),
  }),
});

export const createAddonSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    description: z.string().optional(),
    categoryId: z.string().uuid(),
    price: z.coerce.number().nonnegative(),
    taxPercentage: z.coerce.number().nonnegative().default(5.0),
    pricingType: z.enum(["ONE_TIME", "MONTHLY", "YEARLY", "CUSTOM"]).default("ONE_TIME"),
    status: z.boolean().default(true),
  }),
});

export const updateAddonSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: z.object({
    name: z.string().min(2).optional(),
    description: z.string().optional(),
    categoryId: z.string().uuid().optional(),
    price: z.coerce.number().nonnegative().optional(),
    taxPercentage: z.coerce.number().nonnegative().optional(),
    pricingType: z.enum(["ONE_TIME", "MONTHLY", "YEARLY", "CUSTOM"]).optional(),
    status: z.boolean().optional(),
  }),
});

export const idParamSchema = z.object({ params: z.object({ id: z.string().uuid() }) });
