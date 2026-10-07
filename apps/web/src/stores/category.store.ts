import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  fetchCategories as apiFetchCategories,
  createCategory as apiCreateCategory,
  updateCategory as apiUpdateCategory,
  deleteCategory as apiDeleteCategory,
  ServiceCategory,
} from "@/lib/catalog-api";

export interface CategoryState {
  categories: ServiceCategory[];
  isLoading: boolean;
  error: string | null;
  hasLoaded: boolean;
  activeCategoryId: string;
}

export interface CategoryActions {
  fetchCategories: (force?: boolean) => Promise<ServiceCategory[]>;
  setActiveCategoryId: (id: string) => void;
  createCategory: (data: {
    name: string;
    description?: string;
    hasAddons?: boolean;
    status?: boolean;
    sortOrder?: number;
  }) => Promise<ServiceCategory>;
  updateCategory: (
    id: string,
    data: Partial<{
      name: string;
      description?: string;
      hasAddons?: boolean;
      status?: boolean;
      sortOrder?: number;
    }>
  ) => Promise<ServiceCategory>;
  deleteCategory: (id: string) => Promise<void>;
  syncCategories: (categories: ServiceCategory[]) => void;
  getCategoryById: (id: string) => ServiceCategory | undefined;
}

export type CategoryStore = CategoryState & CategoryActions;

export const DEFAULT_DATABASE_CATEGORIES: ServiceCategory[] = [
  {
    id: "5df2b160-f833-4b65-a3e7-9bef76968a4b",
    name: "Website",
    description: "Static, dynamic & custom web application development",
    hasAddons: true,
    status: true,
    sortOrder: 1,
  },
  {
    id: "9e0e93e4-8879-4c61-ba85-8c2979e53448",
    name: "SEO",
    description: "Search engine optimization and content ranking",
    hasAddons: true,
    status: true,
    sortOrder: 2,
  },
  {
    id: "dac854f1-5d82-408d-8339-eda2f0d79dd2",
    name: "Social Media",
    description: "Social media management, branding & community growth",
    hasAddons: true,
    status: true,
    sortOrder: 3,
  },
  {
    id: "cb0374be-cd95-4f96-8546-1b20f2503b6c",
    name: "E-commerce & Mini Website",
    description: "Online storefronts, payment gateways & mini catalogs",
    hasAddons: true,
    status: true,
    sortOrder: 4,
  },
  {
    id: "1d7c6e15-7e0f-4e6e-8f2f-1870c0b75ecf",
    name: "Digital Marketing",
    description: "PPC, search ads, lead generation campaigns",
    hasAddons: false,
    status: true,
    sortOrder: 5,
  },
  {
    id: "a56f8d2b-114d-42b3-8de0-02ba54a02f64",
    name: "Video Production",
    description: "Corporate videos, animations & reels",
    hasAddons: false,
    status: true,
    sortOrder: 6,
  },
];

export const useCategoryStore = create<CategoryStore>()(
  persist(
    (set, get) => ({
      categories: DEFAULT_DATABASE_CATEGORIES,
      isLoading: false,
      error: null,
      hasLoaded: false,
      activeCategoryId: DEFAULT_DATABASE_CATEGORIES[0].id,

      fetchCategories: async (force = false) => {
        if (!force && get().hasLoaded && get().categories.length > 0) {
          return get().categories;
        }
        set({ isLoading: true, error: null });
        try {
          const list = await apiFetchCategories();
          const sorted = Array.isArray(list)
            ? [...list].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
            : [];
          set({
            categories: sorted,
            isLoading: false,
            hasLoaded: true,
            error: null,
            activeCategoryId: get().activeCategoryId || sorted[0]?.id || "",
          });
          return sorted;
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : "Failed to fetch categories";
          set({ isLoading: false, error: message });
          return get().categories;
        }
      },

      setActiveCategoryId: (id: string) => {
        set({ activeCategoryId: id });
      },

      createCategory: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const newCat = await apiCreateCategory(data);
          const updatedList = [...get().categories, newCat].sort(
            (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)
          );
          set({ categories: updatedList, isLoading: false });
          return newCat;
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : "Failed to create category";
          set({ isLoading: false, error: message });
          throw err;
        }
      },

      updateCategory: async (id, data) => {
        set({ isLoading: true, error: null });
        try {
          const updatedCat = await apiUpdateCategory(id, data);
          const updatedList = get().categories
            .map((c) => (c.id === id ? updatedCat : c))
            .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
          set({ categories: updatedList, isLoading: false });
          return updatedCat;
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : "Failed to update category";
          set({ isLoading: false, error: message });
          throw err;
        }
      },

      deleteCategory: async (id) => {
        set({ isLoading: true, error: null });
        try {
          await apiDeleteCategory(id);
          const filtered = get().categories.filter((c) => c.id !== id);
          set({
            categories: filtered,
            isLoading: false,
            activeCategoryId:
              get().activeCategoryId === id ? filtered[0]?.id || "" : get().activeCategoryId,
          });
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : "Failed to delete category";
          set({ isLoading: false, error: message });
          throw err;
        }
      },

      syncCategories: (categories) => {
        const sorted = [...categories].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
        set({ categories: sorted, hasLoaded: true });
      },

      getCategoryById: (id: string) => {
        return get().categories.find((c) => c.id === id);
      },
    }),
    {
      name: "crm_category_store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        categories: state.categories,
        activeCategoryId: state.activeCategoryId,
      }),
    }
  )
);
