import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  companyDetailsSchema,
  CompanyDetailsFormData,
  CompanyDetailsField,
  packageSelectionSchema,
  PackageSelectionData,
  PackageTierId,
  ServiceCategoryId,
  EcommerceTierId,
  ClientRole,
} from "./schemas/proposal.schema";

export const DEFAULT_COMPANY_DETAILS: CompanyDetailsFormData = {
  companyName: "Abc technologies",
  contactNumber: "+987 14 222222",
  contactPerson: "Dhasarath kp",
  location: "Fujairah, Fujairah Emirate, United Arab Emirates",
  emailAddress: "Info@abctechnologies.com",
  industry: "Real Estate",
  requiredServices: "Social Media + Video Production",
  projectDescription: "we need....................................",
  expectedDeliveryDate: "2026-09-30",
  additionalNotes: "Focus on modern 3d animation website.",
};

export const DEFAULT_PACKAGE_SELECTION: PackageSelectionData = {
  category: "web",
  tier: "business",
  ecommerce: null,
};

export interface ProposalState {
  companyDetails: CompanyDetailsFormData;
  packageSelection: PackageSelectionData;
  selectedAddonIds: string[];
  activeRole: ClientRole;
  isDarkMode: boolean;
  currentStep: number;
  errors: Partial<Record<CompanyDetailsField, string>>;
  isSubmitting: boolean;
  isSaved: boolean;
  hasHydrated: boolean;
}

export interface ProposalActions {
  setCompanyField: (field: CompanyDetailsField, value: string) => void;
  setCompanyDetails: (details: Partial<CompanyDetailsFormData>) => void;
  validateCompanyDetails: () => { isValid: boolean; errors: Partial<Record<CompanyDetailsField, string>> };
  validatePackageSelection: () => { isValid: boolean };
  clearFieldError: (field: CompanyDetailsField) => void;
  clearAllErrors: () => void;
  setCategory: (category: ServiceCategoryId) => void;
  setTier: (tier: PackageTierId | null) => void;
  setEcommerce: (tier: EcommerceTierId | null) => void;
  toggleAddon: (id: string) => void;
  addAddon: (id: string) => void;
  removeAddon: (id: string) => void;
  clearAddons: () => void;
  setActiveRole: (role: ClientRole) => void;
  setIsDarkMode: (isDark: boolean) => void;
  toggleDarkMode: () => void;
  setCurrentStep: (step: number) => void;
  setIsSubmitting: (isSubmitting: boolean) => void;
  setIsSaved: (isSaved: boolean) => void;
  resetProposal: () => void;
  setHasHydrated: (hydrated: boolean) => void;
}

export type ProposalStore = ProposalState & ProposalActions;

export const useProposalStore = create<ProposalStore>()(
  persist(
    (set, get) => ({
      companyDetails: DEFAULT_COMPANY_DETAILS,
      packageSelection: DEFAULT_PACKAGE_SELECTION,
      selectedAddonIds: ["photography", "social-posts", "drone-shoot", "extra-videos"],
      activeRole: "SALES_STAFF",
      isDarkMode: false,
      currentStep: 1,
      errors: {},
      isSubmitting: false,
      isSaved: false,
      hasHydrated: false,

      setCompanyField: (field, value) => {
        const currentDetails = get().companyDetails;
        const updatedDetails = { ...currentDetails, [field]: value };

        // Validate the specific field with Zod on change if there was previously an error
        const currentErrors = { ...get().errors };
        const fieldSchema = companyDetailsSchema.shape[field];

        if (fieldSchema) {
          const result = fieldSchema.safeParse(value);
          if (result.success) {
            delete currentErrors[field];
          }
        }

        set({
          companyDetails: updatedDetails,
          errors: currentErrors,
          isSaved: false,
        });
      },

      setCompanyDetails: (details) => {
        set((state) => ({
          companyDetails: { ...state.companyDetails, ...details },
          isSaved: false,
        }));
      },

      validateCompanyDetails: () => {
        const result = companyDetailsSchema.safeParse(get().companyDetails);

        if (!result.success) {
          const newErrors: Partial<Record<CompanyDetailsField, string>> = {};
          for (const issue of result.error.issues) {
            const field = issue.path[0] as CompanyDetailsField;
            if (field && !newErrors[field]) {
              newErrors[field] = issue.message;
            }
          }
          set({ errors: newErrors });
          return { isValid: false, errors: newErrors };
        }

        set({ errors: {} });
        return { isValid: true, errors: {} };
      },

      validatePackageSelection: () => {
        const result = packageSelectionSchema.safeParse(get().packageSelection);
        return { isValid: result.success };
      },

      clearFieldError: (field) => {
        set((state) => {
          const nextErrors = { ...state.errors };
          delete nextErrors[field];
          return { errors: nextErrors };
        });
      },

      clearAllErrors: () => {
        set({ errors: {} });
      },

      setCategory: (category) => {
        set((state) => ({
          packageSelection: { ...state.packageSelection, category },
        }));
      },

      setTier: (tier) => {
        set((state) => ({
          packageSelection: {
            ...state.packageSelection,
            tier,
            ecommerce: null, // Clear ecommerce so strictly only one package is selected
          },
        }));
      },

      setEcommerce: (ecommerce) => {
        set((state) => ({
          packageSelection: {
            ...state.packageSelection,
            ecommerce,
            tier: null, // Clear matrix tier so strictly only one package is selected
          },
        }));
      },

      toggleAddon: (id) => {
        set((state) => {
          const exists = state.selectedAddonIds.includes(id);
          return {
            selectedAddonIds: exists
              ? state.selectedAddonIds.filter((item) => item !== id)
              : [...state.selectedAddonIds, id],
            isSaved: false,
          };
        });
      },

      addAddon: (id) => {
        set((state) => {
          if (state.selectedAddonIds.includes(id)) return state;
          return {
            selectedAddonIds: [...state.selectedAddonIds, id],
            isSaved: false,
          };
        });
      },

      removeAddon: (id) => {
        set((state) => ({
          selectedAddonIds: state.selectedAddonIds.filter((item) => item !== id),
          isSaved: false,
        }));
      },

      clearAddons: () => set({ selectedAddonIds: [], isSaved: false }),

      setActiveRole: (activeRole) => set({ activeRole }),

      setIsDarkMode: (isDarkMode) => set({ isDarkMode }),

      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),

      setCurrentStep: (currentStep) => set({ currentStep }),

      setIsSubmitting: (isSubmitting) => set({ isSubmitting }),

      setIsSaved: (isSaved) => set({ isSaved }),

      resetProposal: () =>
        set({
          companyDetails: DEFAULT_COMPANY_DETAILS,
          packageSelection: DEFAULT_PACKAGE_SELECTION,
          selectedAddonIds: ["photography", "social-posts", "drone-shoot", "extra-videos"],
          activeRole: "SALES_STAFF",
          currentStep: 1,
          errors: {},
          isSubmitting: false,
          isSaved: false,
        }),

      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
    }),
    {
      name: "crm_proposal_store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        companyDetails: state.companyDetails,
        packageSelection: state.packageSelection,
        selectedAddonIds: state.selectedAddonIds,
        activeRole: state.activeRole,
        isDarkMode: state.isDarkMode,
        currentStep: state.currentStep,
      }),

      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
