import { prisma } from "@/lib/prisma";
import { NotFoundError, ValidationError } from "@/common/errors/AppError";
import { recordAuditLog } from "@/modules/audit/audit.service";

// ----- Service Categories -----
export async function listCategories() {
  return prisma.serviceCategory.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      _count: {
        select: { packages: true, addons: true },
      },
    },
  });
}

export async function createCategory(
  data: { name: string; description?: string; hasAddons?: boolean; status?: boolean; sortOrder?: number },
  actorId: string,
) {
  const category = await prisma.serviceCategory.create({ data });
  await recordAuditLog({
    userId: actorId,
    action: "CREATE",
    module: "service_categories",
    recordId: category.id,
    newValues: category,
  });
  return category;
}

export async function updateCategory(
  id: string,
  data: Partial<{ name: string; description?: string; hasAddons?: boolean; status?: boolean; sortOrder?: number }>,
  actorId: string,
) {
  const before = await prisma.serviceCategory.findUnique({ where: { id } });
  if (!before) throw new NotFoundError("Service category");

  const updated = await prisma.serviceCategory.update({ where: { id }, data });
  await recordAuditLog({
    userId: actorId,
    action: "UPDATE",
    module: "service_categories",
    recordId: id,
    oldValues: before,
    newValues: updated,
  });
  return updated;
}

export async function updateCategoryTemplate(
  id: string,
  data: { templatePdfUrl?: string; templateHtml?: string; bgImageUrls?: string[] },
  actorId: string
) {
  const category = await prisma.serviceCategory.findUnique({ where: { id } });
  if (!category) throw new NotFoundError("Service category");

  const updated = await prisma.serviceCategory.update({
    where: { id },
    data: {
      ...(data.templatePdfUrl !== undefined ? { templatePdfUrl: data.templatePdfUrl } : {}),
      ...(data.templateHtml !== undefined ? { templateHtml: data.templateHtml } : {}),
      ...(data.bgImageUrls !== undefined ? { bgImageUrls: data.bgImageUrls } : {}),
    },
  });

  await recordAuditLog({
    userId: actorId,
    action: "UPDATE",
    module: "service_categories",
    recordId: id,
    newValues: updated,
  });

  return updated;
}

export async function deleteCategory(id: string, actorId: string) {
  const before = await prisma.serviceCategory.findUnique({ where: { id } });
  if (!before) throw new NotFoundError("Service category");

  await prisma.serviceCategory.delete({ where: { id } });
  await recordAuditLog({
    userId: actorId,
    action: "DELETE",
    module: "service_categories",
    recordId: id,
    oldValues: before,
  });
  return { deleted: true };
}

// ----- Packages -----
export async function listPackages(categoryId?: string, search?: string) {
  return prisma.package.findMany({
    where: {
      ...(categoryId ? { categoryId } : {}),
      ...(search
        ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
          ],
        }
        : {}),
    },
    include: {
      features: { orderBy: { sortOrder: "asc" } },
      category: true,
    },
    orderBy: { sortOrder: "asc" },
  });
}

export async function getPackageById(id: string) {
  const pkg = await prisma.package.findUnique({
    where: { id },
    include: { features: true, category: true },
  });
  if (!pkg) throw new NotFoundError("Package");
  return pkg;
}

export async function createPackage(
  data: {
    categoryId: string;
    name: string;
    description?: string;
    price: number;
    billingType?: "ONE_TIME" | "MONTHLY" | "YEARLY" | "CUSTOM";
    duration?: string;
    icon?: string;
    status?: boolean;
    isPopular?: boolean;
    sortOrder?: number;
    features?: Array<{ featureName: string; featureValue?: string; included?: boolean; sortOrder?: number }>;
  },
  actorId: string,
) {
  const category = await prisma.serviceCategory.findUnique({ where: { id: data.categoryId } });
  if (!category) throw new NotFoundError("Service category");

  const { features, ...pkgData } = data;
  const cleanFeatures = features?.map((f) => ({
    featureName: f.featureName,
    featureValue: f.featureValue ?? null,
    included: f.included ?? true,
    sortOrder: f.sortOrder ?? 0,
  }));

  const pkg = await prisma.package.create({
    data: {
      ...pkgData,
      features: cleanFeatures?.length ? { create: cleanFeatures } : undefined,
    },
    include: { features: true, category: true },
  });
  await recordAuditLog({ userId: actorId, action: "CREATE", module: "packages", recordId: pkg.id, newValues: pkg });
  return pkg;
}

export async function updatePackage(id: string, data: Record<string, unknown>, actorId: string) {
  const before = await getPackageById(id);
  const { features, ...pkgData } = data as {
    features?: Array<{ id?: string; featureName: string; featureValue?: string | null; included?: boolean; sortOrder?: number }>;
    [key: string]: unknown;
  };

  if (pkgData.categoryId) {
    const category = await prisma.serviceCategory.findUnique({ where: { id: pkgData.categoryId as string } });
    if (!category) throw new NotFoundError("Service category");
  }

  // Handle features update if provided
  if (features !== undefined) {
    await prisma.packageFeature.deleteMany({ where: { packageId: id } });
    if (features.length > 0) {
      await prisma.packageFeature.createMany({
        data: features.map((f) => ({
          featureName: f.featureName,
          featureValue: f.featureValue ?? null,
          included: f.included ?? true,
          sortOrder: f.sortOrder ?? 0,
          packageId: id,
        })),
      });
    }
  }

  const updated = await prisma.package.update({
    where: { id },
    data: pkgData as never,
    include: { features: true, category: true },
  });

  if (before.price.toString() !== updated.price.toString()) {
    await recordAuditLog({
      userId: actorId,
      action: "PRICE_CHANGE",
      module: "packages",
      recordId: id,
      oldValues: { price: before.price },
      newValues: { price: updated.price },
    });
  } else {
    await recordAuditLog({ userId: actorId, action: "UPDATE", module: "packages", recordId: id, oldValues: before, newValues: updated });
  }

  return updated;
}

export async function deletePackage(id: string, actorId: string) {
  const before = await getPackageById(id);
  await prisma.package.delete({ where: { id } });
  await recordAuditLog({ userId: actorId, action: "DELETE", module: "packages", recordId: id, oldValues: before });
  return { deleted: true };
}

// ----- Addons -----
export async function listAddons(categoryId?: string, search?: string) {
  return prisma.addon.findMany({
    where: {
      ...(categoryId ? { categoryId } : {}),
      ...(search
        ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
          ],
        }
        : {}),
    },
    include: { category: true },
    orderBy: { name: "asc" },
  });
}

export async function createAddon(
  data: {
    name: string;
    description?: string;
    categoryId: string;
    price: number;
    taxPercentage?: number;
    pricingType?: "ONE_TIME" | "MONTHLY" | "YEARLY" | "CUSTOM";
    status?: boolean;
  },
  actorId: string,
) {
  // Enforce Category Addon Rule: Addons can ONLY be added if category hasAddons === true
  const category = await prisma.serviceCategory.findUnique({ where: { id: data.categoryId } });
  if (!category) {
    throw new NotFoundError("Service category");
  }

  if (!category.hasAddons) {
    throw new ValidationError(
      `Add-ons are not enabled for category "${category.name}". Please edit the category and enable Add-ons first.`,
    );
  }

  const addon = await prisma.addon.create({
    data,
    include: { category: true },
  });

  await recordAuditLog({ userId: actorId, action: "CREATE", module: "addons", recordId: addon.id, newValues: addon });
  return addon;
}

export async function updateAddon(id: string, data: Record<string, unknown>, actorId: string) {
  const before = await prisma.addon.findUnique({ where: { id } });
  if (!before) throw new NotFoundError("Addon");

  if (data.categoryId) {
    const category = await prisma.serviceCategory.findUnique({ where: { id: data.categoryId as string } });
    if (!category) throw new NotFoundError("Service category");
    if (!category.hasAddons) {
      throw new ValidationError(
        `Add-ons are not enabled for category "${category.name}". Please edit the category and enable Add-ons first.`,
      );
    }
  }

  const updated = await prisma.addon.update({
    where: { id },
    data: data as never,
    include: { category: true },
  });

  await recordAuditLog({ userId: actorId, action: "UPDATE", module: "addons", recordId: id, oldValues: before, newValues: updated });
  return updated;
}

export async function deleteAddon(id: string, actorId: string) {
  const before = await prisma.addon.findUnique({ where: { id } });
  if (!before) throw new NotFoundError("Addon");

  await prisma.addon.delete({ where: { id } });
  await recordAuditLog({ userId: actorId, action: "DELETE", module: "addons", recordId: id, oldValues: before });
  return { deleted: true };
}
