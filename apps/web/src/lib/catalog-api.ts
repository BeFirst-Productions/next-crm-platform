import { apiClient } from "@/lib/api-client";

export interface ServiceCategory {
  id: string;
  name: string;
  description: string | null;
  hasAddons: boolean;
  templatePdfUrl?: string | null;
  templateHtml?: string | null;
  bgImageUrls?: string[];
  status: boolean;
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
  _count?: {
    packages: number;
    addons: number;
  };
}

export interface PackageFeature {
  id?: string;
  featureName: string;
  featureValue?: string | null;
  included: boolean;
  sortOrder?: number;
}

export interface PackageItem {
  id: string;
  categoryId: string;
  name: string;
  description: string | null;
  price: number | string;
  billingType: "ONE_TIME" | "MONTHLY" | "YEARLY" | "CUSTOM";
  duration: string | null;
  icon: string | null;
  status: boolean;
  isPopular: boolean;
  sortOrder: number;
  features: PackageFeature[];
  category?: ServiceCategory;
  createdAt?: string;
  updatedAt?: string;
}

export interface AddonItem {
  id: string;
  categoryId: string | null;
  name: string;
  description: string | null;
  price: number | string;
  taxPercentage: number | string;
  pricingType: "ONE_TIME" | "MONTHLY" | "YEARLY" | "CUSTOM";
  status: boolean;
  category?: ServiceCategory;
  createdAt?: string;
  updatedAt?: string;
}

// ─── Categories ──────────────────────────────────────────────────────────────

export async function fetchCategories(): Promise<ServiceCategory[]> {
  const res = await apiClient<ServiceCategory[]>("/service-categories", { requiresAuth: false });
  return res.data;
}

export async function createCategory(data: {
  name: string;
  description?: string;
  hasAddons?: boolean;
  status?: boolean;
  sortOrder?: number;
}): Promise<ServiceCategory> {
  const res = await apiClient<ServiceCategory>("/service-categories", {
    method: "POST",
    body: data,
  });
  return res.data;
}

export async function updateCategory(
  id: string,
  data: Partial<{
    name: string;
    description?: string;
    hasAddons?: boolean;
    status?: boolean;
    sortOrder?: number;
  }>,
): Promise<ServiceCategory> {
  const res = await apiClient<ServiceCategory>(`/service-categories/${id}`, {
    method: "PATCH",
    body: data,
  });
  return res.data;
}

export async function deleteCategory(id: string): Promise<{ deleted: boolean }> {
  const res = await apiClient<{ deleted: boolean }>(`/service-categories/${id}`, {
    method: "DELETE",
  });
  return res.data;
}

export async function uploadCategoryTemplate(id: string, file: File): Promise<ServiceCategory> {
  const formData = new FormData();
  formData.append("templatePdf", file);

  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

  const response = await fetch(`${baseUrl}/service-categories/${id}/template`, {
    method: "POST",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to upload category PDF template");
  }

  const res = await response.json();
  return res.data;
}

// ─── Packages ────────────────────────────────────────────────────────────────

export async function fetchPackages(categoryId?: string, search?: string): Promise<PackageItem[]> {
  const query = new URLSearchParams();
  if (categoryId) query.append("categoryId", categoryId);
  if (search) query.append("search", search);
  const endpoint = `/packages${query.toString() ? `?${query.toString()}` : ""}`;
  const res = await apiClient<PackageItem[]>(endpoint, { requiresAuth: false });
  return res.data;
}

export async function createPackage(data: {
  categoryId: string;
  name: string;
  description?: string;
  price: number;
  billingType?: string;
  duration?: string;
  icon?: string;
  status?: boolean;
  isPopular?: boolean;
  features?: PackageFeature[];
}): Promise<PackageItem> {
  const res = await apiClient<PackageItem>("/packages", {
    method: "POST",
    body: data,
  });
  return res.data;
}

export async function updatePackage(
  id: string,
  data: Partial<{
    categoryId: string;
    name: string;
    description?: string;
    price: number;
    billingType?: string;
    duration?: string;
    icon?: string;
    status?: boolean;
    isPopular?: boolean;
    features?: PackageFeature[];
  }>,
): Promise<PackageItem> {
  const res = await apiClient<PackageItem>(`/packages/${id}`, {
    method: "PATCH",
    body: data,
  });
  return res.data;
}

export async function deletePackage(id: string): Promise<{ deleted: boolean }> {
  const res = await apiClient<{ deleted: boolean }>(`/packages/${id}`, {
    method: "DELETE",
  });
  return res.data;
}

// ─── Add-ons ──────────────────────────────────────────────────────────────────

export async function fetchAddons(categoryId?: string, search?: string): Promise<AddonItem[]> {
  const query = new URLSearchParams();
  if (categoryId) query.append("categoryId", categoryId);
  if (search) query.append("search", search);
  const endpoint = `/addons${query.toString() ? `?${query.toString()}` : ""}`;
  const res = await apiClient<AddonItem[]>(endpoint, { requiresAuth: false });
  return res.data;
}

export async function createAddon(data: {
  categoryId: string;
  name: string;
  description?: string;
  price: number;
  taxPercentage?: number;
  pricingType?: string;
  status?: boolean;
}): Promise<AddonItem> {
  const res = await apiClient<AddonItem>("/addons", {
    method: "POST",
    body: data,
  });
  return res.data;
}

export async function updateAddon(
  id: string,
  data: Partial<{
    categoryId: string;
    name: string;
    description?: string;
    price: number;
    taxPercentage?: number;
    pricingType?: string;
    status?: boolean;
  }>,
): Promise<AddonItem> {
  const res = await apiClient<AddonItem>(`/addons/${id}`, {
    method: "PATCH",
    body: data,
  });
  return res.data;
}

export async function deleteAddon(id: string): Promise<{ deleted: boolean }> {
  const res = await apiClient<{ deleted: boolean }>(`/addons/${id}`, {
    method: "DELETE",
  });
  return res.data;
}
