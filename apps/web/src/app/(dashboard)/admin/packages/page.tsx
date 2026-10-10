"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  RotateCcw,
  Eye,
  Edit2,
  Trash2,
  Globe,
  ShoppingCart,
  TrendingUp,
  Share2,
  Video,
  CheckCircle2,
  Package as PackageIcon,
  Layers,
  Sparkles,
  X,
  AlertCircle,
  HelpCircle,
  Upload,
  FileText,
  Loader2,
} from "lucide-react";
import {
  fetchPackages,
  fetchAddons,
  uploadCategoryTemplate,
  createPackage,
  updatePackage,
  deletePackage,
  createAddon,
  updateAddon,
  deleteAddon,
  ServiceCategory,
  PackageItem,
  AddonItem,
  PackageFeature,
} from "@/lib/catalog-api";
import { cn } from "@/lib/utils";
import { useCategoryStore } from "@/stores";
import { useToast } from "@/hooks/useToast";

// Category color badges matching modern design aesthetic
const CATEGORY_COLORS: Record<string, string> = {
  Website: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  "E-commerce & Mini Website": "bg-purple-500/15 text-purple-400 border-purple-500/30",
  "Digital Marketing": "bg-amber-500/15 text-amber-400 border-amber-500/30",
  "Social Media": "bg-pink-500/15 text-pink-400 border-pink-500/30",
  "Video Production": "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  SEO: "bg-indigo-500/15 text-indigo-400 border-indigo-500/30",
};

const CATEGORY_ICONS: Record<string, typeof Globe> = {
  Website: Globe,
  "E-commerce & Mini Website": ShoppingCart,
  "Digital Marketing": TrendingUp,
  "Social Media": Share2,
  "Video Production": Video,
  SEO: Sparkles,
};

export default function PackageAddonManagerPage() {
  const {
    categories,
    fetchCategories: storeFetchCategories,
    createCategory: storeCreateCategory,
    updateCategory: storeUpdateCategory,
    deleteCategory: storeDeleteCategory,
  } = useCategoryStore();
  const toast = useToast();
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [addons, setAddons] = useState<AddonItem[]>([]);

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"packages" | "addons" | "overview">("packages");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  // Filter Bar state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "INACTIVE">("ALL");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");

  // Modal States
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ServiceCategory | null>(null);

  const [isPackageModalOpen, setIsPackageModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<PackageItem | null>(null);

  const [isAddonModalOpen, setIsAddonModalOpen] = useState(false);
  const [editingAddon, setEditingAddon] = useState<AddonItem | null>(null);
  const [isSubmittingAddon, setIsSubmittingAddon] = useState(false);

  const [viewItem, setViewItem] = useState<{ type: "package" | "addon"; data: PackageItem | AddonItem } | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    type: "category" | "package" | "addon";
    id: string;
    name: string;
  } | null>(null);

  // Form Fields State
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    description: "",
    hasAddons: false,
    status: true,
  });

  const [packageForm, setPackageForm] = useState({
    categoryId: "",
    name: "",
    description: "",
    price: "",
    billingType: "ONE_TIME",
    duration: "1 Month",
    status: true,
    isPopular: false,
    features: [] as PackageFeature[],
  });

  const [addonForm, setAddonForm] = useState({
    categoryId: "",
    name: "",
    description: "",
    price: "",
    taxPercentage: "5.0",
    pricingType: "ONE_TIME",
    status: true,
  });

  const [formError, setFormError] = useState<string | null>(null);
  const [addonErrors, setAddonErrors] = useState<{
    categoryId?: string;
    name?: string;
    price?: string;
    taxPercentage?: string;
  }>({});
  const [categoryErrors, setCategoryErrors] = useState<{
    name?: string;
  }>({});
  const [packageErrors, setPackageErrors] = useState<{
    categoryId?: string;
    name?: string;
    price?: string;
  }>({});

  // Load initial data
  const loadData = async () => {
    try {
      setLoading(true);
      const [, pkgList, addonList] = await Promise.all([
        storeFetchCategories(true),
        fetchPackages(),
        fetchAddons(),
      ]);
      setPackages(pkgList);
      setAddons(addonList);
    } catch (err: unknown) {
      // Error handles in UI toast or inline
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filtered packages
  const filteredPackages = useMemo(() => {
    return packages.filter((pkg) => {
      const matchCat =
        categoryFilter === "ALL"
          ? selectedCategory === "ALL" || pkg.categoryId === selectedCategory
          : pkg.categoryId === categoryFilter;

      const matchSearch =
        !searchQuery ||
        pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (pkg.description && pkg.description.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchStatus =
        statusFilter === "ALL"
          ? true
          : statusFilter === "ACTIVE"
          ? pkg.status
          : !pkg.status;

      return matchCat && matchSearch && matchStatus;
    });
  }, [packages, selectedCategory, categoryFilter, searchQuery, statusFilter]);

  // Filtered addons
  const filteredAddons = useMemo(() => {
    return addons.filter((addon) => {
      const matchCat =
        categoryFilter === "ALL"
          ? selectedCategory === "ALL" || addon.categoryId === selectedCategory
          : addon.categoryId === categoryFilter;

      const matchSearch =
        !searchQuery ||
        addon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (addon.description && addon.description.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchStatus =
        statusFilter === "ALL"
          ? true
          : statusFilter === "ACTIVE"
          ? addon.status
          : !addon.status;

      return matchCat && matchSearch && matchStatus;
    });
  }, [addons, selectedCategory, categoryFilter, searchQuery, statusFilter]);

  // Categories that have Add-ons enabled
  const addonEnabledCategories = useMemo(() => {
    return categories.filter((c) => c.hasAddons);
  }, [categories]);

  // Determine currently active category and whether it supports add-ons
  const activeCategoryId = categoryFilter !== "ALL" ? categoryFilter : selectedCategory;
  const currentCategory = useMemo(() => {
    if (activeCategoryId === "ALL") return null;
    return categories.find((c) => c.id === activeCategoryId) || null;
  }, [categories, activeCategoryId]);

  const hasAddonsForSelectedCategory = useMemo(() => {
    if (!currentCategory) {
      return addonEnabledCategories.length > 0;
    }
    return Boolean(currentCategory.hasAddons);
  }, [currentCategory, addonEnabledCategories]);

  // If the selected category doesn't have add-ons and user is on addons tab, automatically switch to packages
  useEffect(() => {
    if (!hasAddonsForSelectedCategory && activeTab === "addons") {
      setActiveTab("packages");
    }
  }, [hasAddonsForSelectedCategory, activeTab]);

  // Handlers for Category Modal
  const openAddCategoryModal = () => {
    setEditingCategory(null);
    setCategoryForm({ name: "", description: "", hasAddons: false, status: true });
    setFormError(null);
    setCategoryErrors({});
    setIsCategoryModalOpen(true);
  };

  const openEditCategoryModal = (cat: ServiceCategory) => {
    setEditingCategory(cat);
    setCategoryForm({
      name: cat.name,
      description: cat.description || "",
      hasAddons: cat.hasAddons,
      status: cat.status,
    });
    setFormError(null);
    setCategoryErrors({});
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = async () => {
    const errors: { name?: string } = {};
    if (!categoryForm.name.trim()) {
      errors.name = "Category name is required";
    } else if (categoryForm.name.trim().length < 2) {
      errors.name = "Category name must be at least 2 characters";
    }

    if (Object.keys(errors).length > 0) {
      setCategoryErrors(errors);
      setFormError("Please fix the validation error(s) below");
      return;
    }

    setCategoryErrors({});
    setFormError(null);

    try {
      if (editingCategory) {
        await storeUpdateCategory(editingCategory.id, categoryForm);
      } else {
        await storeCreateCategory(categoryForm);
      }
      setIsCategoryModalOpen(false);
      loadData();
    } catch (err: unknown) {
      setFormError((err as Error).message || "Failed to save category");
    }
  };

  const handleToggleCategoryStatus = async (cat: ServiceCategory) => {
    try {
      const newStatus = !cat.status;
      await storeUpdateCategory(cat.id, { status: newStatus });
      toast.success(
        `Category ${newStatus ? "Enabled" : "Disabled"}`,
        `"${cat.name}" is now ${newStatus ? "active" : "disabled"}.`
      );
      await loadData();
    } catch (err: unknown) {
      console.error("Failed to toggle category status:", err);
      toast.error("Status Update Failed", "Could not update category status.");
    }
  };

  // Handlers for Package Modal
  const openAddPackageModal = () => {
    setEditingPackage(null);
    const defaultCatId =
      selectedCategory !== "ALL" ? selectedCategory : categories[0]?.id || "";
    setPackageForm({
      categoryId: defaultCatId,
      name: "",
      description: "",
      price: "",
      billingType: "ONE_TIME",
      duration: "1 Month",
      status: true,
      isPopular: false,
      features: [
        { featureName: "Responsive Design", included: true },
        { featureName: "SEO Basics", included: true },
      ],
    });
    setFormError(null);
    setPackageErrors({});
    setIsPackageModalOpen(true);
  };
  void openAddPackageModal;

  const openEditPackageModal = (pkg: PackageItem) => {
    setEditingPackage(pkg);
    setPackageForm({
      categoryId: pkg.categoryId,
      name: pkg.name,
      description: pkg.description || "",
      price: String(pkg.price),
      billingType: pkg.billingType || "ONE_TIME",
      duration: pkg.duration || "1 Month",
      status: pkg.status,
      isPopular: pkg.isPopular,
      features: pkg.features ? [...pkg.features] : [],
    });
    setFormError(null);
    setPackageErrors({});
    setIsPackageModalOpen(true);
  };
  void openEditPackageModal;

  const handleSavePackage = async () => {
    const errors: { categoryId?: string; name?: string; price?: string } = {};
    if (!packageForm.categoryId) {
      errors.categoryId = "Please select a category";
    }
    if (!packageForm.name.trim()) {
      errors.name = "Package name is required";
    } else if (packageForm.name.trim().length < 2) {
      errors.name = "Package name must be at least 2 characters";
    }
    if (!packageForm.price.trim()) {
      errors.price = "Price is required";
    } else {
      const parsedPrice = parseFloat(packageForm.price);
      if (isNaN(parsedPrice)) {
        errors.price = "Price must be a valid number";
      } else if (parsedPrice < 0) {
        errors.price = "Price cannot be negative";
      }
    }

    if (Object.keys(errors).length > 0) {
      setPackageErrors(errors);
      setFormError("Please fix the validation error(s) below");
      return;
    }

    setPackageErrors({});
    setFormError(null);

    try {
      const payload = {
        ...packageForm,
        price: parseFloat(packageForm.price),
      };
      if (editingPackage) {
        await updatePackage(editingPackage.id, payload);
      } else {
        await createPackage(payload);
      }
      setIsPackageModalOpen(false);
      loadData();
    } catch (err: unknown) {
      setFormError((err as Error).message || "Failed to save package");
    }
  };

  // Handlers for Addon Modal
  const openAddAddonModal = () => {
    setEditingAddon(null);
    // Auto-select category: if the currently selected category in sidebar/filter has add-ons enabled, use it!
    const activeEnabledCat =
      activeCategoryId !== "ALL" && categories.find((c) => c.id === activeCategoryId && c.hasAddons)
        ? activeCategoryId
        : addonEnabledCategories[0]?.id || "";

    setAddonForm({
      categoryId: activeEnabledCat,
      name: "",
      description: "",
      price: "",
      taxPercentage: "5.0",
      pricingType: "ONE_TIME",
      status: true,
    });
    setFormError(null);
    setAddonErrors({});
    setIsAddonModalOpen(true);
  };

  const openEditAddonModal = (addon: AddonItem) => {
    setEditingAddon(addon);
    setAddonForm({
      categoryId: addon.categoryId || "",
      name: addon.name,
      description: addon.description || "",
      price: String(addon.price),
      taxPercentage: String(addon.taxPercentage ?? "5.0"),
      pricingType: addon.pricingType || "ONE_TIME",
      status: addon.status,
    });
    setFormError(null);
    setAddonErrors({});
    setIsAddonModalOpen(true);
  };

  const handleSaveAddon = async () => {
    const errors: {
      categoryId?: string;
      name?: string;
      price?: string;
      taxPercentage?: string;
    } = {};

    if (!addonForm.categoryId) {
      errors.categoryId = "Please select a category";
    }

    if (!addonForm.name.trim()) {
      errors.name = "Add-on name is required";
    } else if (addonForm.name.trim().length < 2) {
      errors.name = "Add-on name must be at least 2 characters";
    }

    if (!addonForm.price.trim()) {
      errors.price = "Price is required";
    } else {
      const parsedPrice = parseFloat(addonForm.price);
      if (isNaN(parsedPrice)) {
        errors.price = "Price must be a valid number";
      } else if (parsedPrice < 0) {
        errors.price = "Price cannot be negative";
      }
    }

    if (!addonForm.taxPercentage.trim()) {
      errors.taxPercentage = "Tax / VAT percentage is required";
    } else {
      const parsedTax = parseFloat(addonForm.taxPercentage);
      if (isNaN(parsedTax)) {
        errors.taxPercentage = "Tax percentage must be a valid number";
      } else if (parsedTax < 0 || parsedTax > 100) {
        errors.taxPercentage = "Tax percentage must be between 0 and 100%";
      }
    }

    if (Object.keys(errors).length > 0) {
      setAddonErrors(errors);
      setFormError("Please fix the validation error(s) below");
      return;
    }

    const parsedPrice = parseFloat(addonForm.price);
    const parsedTax = parseFloat(addonForm.taxPercentage);

    setAddonErrors({});
    setIsSubmittingAddon(true);
    setFormError(null);

    try {
      const payload = {
        categoryId: addonForm.categoryId,
        name: addonForm.name.trim(),
        description: addonForm.description?.trim() || undefined,
        price: parsedPrice,
        taxPercentage: isNaN(parsedTax) ? 5.0 : parsedTax,
        pricingType: (addonForm.pricingType || "ONE_TIME") as "ONE_TIME" | "MONTHLY" | "YEARLY" | "CUSTOM",
        status: addonForm.status,
      };

      if (editingAddon) {
        await updateAddon(editingAddon.id, payload);
        toast.success("Add-on updated", `"${payload.name}" was successfully updated.`);
      } else {
        const created = await createAddon(payload);
        toast.success("Add-on saved to database", `"${created.name}" was saved in the database.`);
      }

      setIsAddonModalOpen(false);

      // Auto-switch to addons tab so user immediately sees their new/updated add-on
      setActiveTab("addons");

      // Set category to the saved addon's category so it shows in the table
      if (selectedCategory !== "ALL" && selectedCategory !== payload.categoryId) {
        setSelectedCategory(payload.categoryId);
        setCategoryFilter(payload.categoryId);
      }

      await loadData();
    } catch (err: unknown) {
      const errorMsg = (err as Error).message || "Failed to save add-on to database";
      setFormError(errorMsg);
      toast.error("Database Save Failed", errorMsg);
    } finally {
      setIsSubmittingAddon(false);
    }
  };

  // Delete Handler
  const handleConfirmDelete = async () => {
    if (!deleteConfirmation) return;
    try {
      if (deleteConfirmation.type === "category") {
        await storeDeleteCategory(deleteConfirmation.id);
      } else if (deleteConfirmation.type === "package") {
        await deletePackage(deleteConfirmation.id);
      } else if (deleteConfirmation.type === "addon") {
        await deleteAddon(deleteConfirmation.id);
      }
      setDeleteConfirmation(null);
      loadData();
    } catch (err: unknown) {
      // error notice
    }
  };

  // Feature list helper for Package Modal
  const addFeatureRow = () => {
    setPackageForm((prev) => ({
      ...prev,
      features: [...prev.features, { featureName: "", included: true }],
    }));
  };

  const removeFeatureRow = (index: number) => {
    setPackageForm((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const updateFeatureRow = (index: number, field: string, value: unknown) => {
    setPackageForm((prev) => {
      const updated = [...prev.features];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, features: updated };
    });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-surface-100 tracking-tight flex items-center gap-2">
            <PackageIcon className="w-5 h-5 text-brand-400" />
            Package & Add-ons Manager
          </h1>
          <p className="text-xs text-surface-400 mt-1">
            Dashboard &gt; Package & Add-ons Manager
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/admin/packages/manage?type=${
              selectedCategory === "ALL"
                ? "website"
                : categories
                    .find((c) => c.id === selectedCategory)
                    ?.name.toLowerCase()
                    .includes("market")
                ? "digital-marketing"
                : categories
                    .find((c) => c.id === selectedCategory)
                    ?.name.toLowerCase()
                    .includes("seo")
                ? "seo"
                : "website"
            }`}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-medium text-xs shadow-glow transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Package</span>
          </Link>
          {hasAddonsForSelectedCategory && (
            <button
              onClick={openAddAddonModal}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-glow transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Add-on</span>
            </button>
          )}
        </div>
      </div>

      {/* Grid Layout: Left Sidebar Categories + Right Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Categories List (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="p-4 rounded-2xl bg-surface-950/80 border border-surface-800/80 backdrop-blur-xl">
            <div className="flex items-center justify-between pb-3 border-b border-surface-800/60 mb-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-surface-300">
                Categories
              </h2>
              <button
                onClick={openAddCategoryModal}
                className="p-1.5 rounded-lg text-surface-400 hover:text-brand-300 hover:bg-surface-800 transition-colors"
                title="Add New Category"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1.5">
              {/* All Categories item */}
              <button
                onClick={() => {
                  setSelectedCategory("ALL");
                  setCategoryFilter("ALL");
                }}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all group",
                  selectedCategory === "ALL"
                    ? "bg-brand-600/20 text-brand-300 border border-brand-500/40 font-semibold shadow-glow"
                    : "text-surface-300 hover:bg-surface-900/80 border border-transparent",
                )}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-surface-800 flex items-center justify-center text-surface-400">
                    <Layers className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-semibold">All Categories</span>
                </div>
                <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-surface-800/80 text-surface-400 font-bold">
                  {String(packages.length).padStart(2, "0")}
                </span>
              </button>

              {/* Dynamic Categories */}
              {categories.map((cat) => {
                const IconComp = CATEGORY_ICONS[cat.name] || PackageIcon;
                const catPkgCount = packages.filter((p) => p.categoryId === cat.id).length;
                const isSelected = selectedCategory === cat.id;

                return (
                  <div key={cat.id} className="group/item relative flex items-center">
                    <button
                      onClick={() => {
                        setSelectedCategory(cat.id);
                        setCategoryFilter(cat.id);
                      }}
                      className={cn(
                        "w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left pr-28",
                        isSelected
                          ? "bg-brand-600/20 text-brand-300 border border-brand-500/40 font-semibold shadow-glow"
                          : "text-surface-300 hover:bg-surface-900/80 border border-transparent",
                        !cat.status && "opacity-60",
                      )}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <div
                          className={cn(
                            "w-7 h-7 rounded-lg flex items-center justify-center border shrink-0",
                            CATEGORY_COLORS[cat.name] || "bg-surface-800 text-surface-400 border-surface-700",
                          )}
                        >
                          <IconComp className="w-4 h-4" />
                        </div>
                        <span className="truncate text-sm font-medium">{cat.name}</span>
                      </div>
                    </button>

                    <div className="absolute right-2 flex items-center gap-1.5">
                      {/* Category Status Toggle Switch */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleCategoryStatus(cat);
                        }}
                        className={cn(
                          "relative inline-flex h-[18px] w-8 shrink-0 cursor-pointer rounded-full border border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                          cat.status
                            ? "bg-emerald-500 shadow-sm shadow-emerald-500/40"
                            : "bg-surface-700/80 hover:bg-surface-600"
                        )}
                        title={cat.status ? "Status: Active (Click to disable)" : "Status: Disabled (Click to enable)"}
                      >
                        <span
                          className={cn(
                            "pointer-events-none inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out my-auto ml-[1px]",
                            cat.status ? "translate-x-3.5" : "translate-x-0"
                          )}
                        />
                      </button>

                      {cat.hasAddons && (
                        <span
                          className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-1.5 py-0.5 rounded hidden sm:inline-block"
                          title="Add-ons enabled for this category"
                        >
                          +Addons
                        </span>
                      )}
                      <button
                        onClick={() => openEditCategoryModal(cat)}
                        className="opacity-0 group-hover/item:opacity-100 p-1 text-surface-400 hover:text-surface-100 transition-opacity"
                        title="Edit Category"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-surface-800/80 text-surface-400 font-bold">
                        {String(catPkgCount).padStart(2, "0")}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Main Content Table Area (9 cols) */}
        <div className="lg:col-span-9 space-y-5">
          {/* Main Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-surface-800/80 pb-2">
            <button
              onClick={() => setActiveTab("packages")}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2",
                activeTab === "packages"
                  ? "bg-brand-600/20 text-brand-300 border border-brand-500/40 shadow-glow"
                  : "text-surface-400 hover:text-surface-200 hover:bg-surface-900/50",
              )}
            >
              <PackageIcon className="w-4 h-4" />
              <span>Packages ({filteredPackages.length})</span>
            </button>
            {hasAddonsForSelectedCategory && (
              <button
                onClick={() => setActiveTab("addons")}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2",
                  activeTab === "addons"
                    ? "bg-brand-600/20 text-brand-300 border border-brand-500/40 shadow-glow"
                    : "text-surface-400 hover:text-surface-200 hover:bg-surface-900/50",
                )}
              >
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>Add-ons ({filteredAddons.length})</span>
              </button>
            )}
          </div>

          {/* Filter Bar */}
          <div className="p-4 rounded-2xl bg-surface-950/80 border border-surface-800/80 backdrop-blur-xl flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-1 min-w-[260px]">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-3 text-surface-500" />
                <input
                  type="text"
                  placeholder={
                    activeTab === "packages" ? "Search packages by name..." : "Search add-ons by name..."
                  }
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-surface-900/80 border border-surface-800 rounded-xl text-sm text-surface-100 placeholder-surface-500 focus:outline-none focus:border-brand-500"
                />
              </div>

              {/* Category Dropdown Filter */}
              <select
                value={categoryFilter}
                onChange={(e) => {
                  setCategoryFilter(e.target.value);
                  setSelectedCategory(e.target.value);
                }}
                className="bg-surface-900/80 border border-surface-800 text-surface-200 text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-brand-500"
              >
                <option value="ALL">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} {!c.status ? "[Disabled]" : ""}
                  </option>
                ))}
              </select>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as "ALL" | "ACTIVE" | "INACTIVE")}
                className="bg-surface-900/80 border border-surface-800 text-surface-200 text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-brand-500"
              >
                <option value="ALL">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("ALL");
                  setCategoryFilter("ALL");
                  setSelectedCategory("ALL");
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-surface-900/80 hover:bg-surface-800 border border-surface-800 text-surface-400 hover:text-surface-100 text-sm font-medium transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          {/* TAB 1: PACKAGES TABLE */}
          {activeTab === "packages" && (
            <div className="rounded-2xl bg-surface-950/80 border border-surface-800/80 backdrop-blur-xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-surface-800/80 bg-surface-900/40 text-surface-400 font-semibold uppercase tracking-wider text-xs">
                      <th className="py-3.5 px-4">Package</th>
                      <th className="py-3.5 px-4">Category</th>
                      <th className="py-3.5 px-4">Price (AED)</th>
                      <th className="py-3.5 px-4">Duration</th>
                      <th className="py-3.5 px-4">Features</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-800/40 text-surface-200">
                    {loading ? (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-surface-400 text-sm">
                          Loading packages...
                        </td>
                      </tr>
                    ) : filteredPackages.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-surface-400 text-sm">
                          No packages found. Click "Add New Package" to create one.
                        </td>
                      </tr>
                    ) : (
                      filteredPackages.map((pkg) => {
                        const catName = pkg.category?.name || "Unassigned";
                        return (
                          <tr key={pkg.id} className="hover:bg-surface-900/40 transition-colors group">
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600/30 to-indigo-600/30 border border-brand-500/30 flex items-center justify-center text-brand-300 font-bold shrink-0">
                                  <PackageIcon className="w-5 h-5" />
                                </div>
                                <div>
                                  <span className="font-bold text-surface-100 block text-sm">
                                    {pkg.name}
                                  </span>
                                  <span className="text-xs text-surface-400 block line-clamp-1">
                                    {pkg.description || "No description"}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="py-3.5 px-4">
                              <span
                                className={cn(
                                  "inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border",
                                  CATEGORY_COLORS[catName] || "bg-surface-800 text-surface-300 border-surface-700",
                                )}
                              >
                                {catName}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 font-mono font-bold text-surface-100 text-sm">
                              {Number(pkg.price).toLocaleString()}
                            </td>
                            <td className="py-3.5 px-4 text-surface-300 font-medium text-sm">
                              {pkg.duration || "N/A"}
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-900 border border-surface-800 text-surface-300 font-mono text-xs">
                                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                                {pkg.features?.length || 0} Features
                              </span>
                            </td>
                            <td className="py-3.5 px-4">
                              {pkg.status ? (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 text-xs font-semibold">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                  Active
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-950/60 text-rose-400 border border-rose-500/30 text-xs font-semibold">
                                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                                  Inactive
                                </span>
                              )}
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => setViewItem({ type: "package", data: pkg })}
                                  className="p-2 rounded-lg bg-surface-900 border border-surface-800 text-surface-400 hover:text-surface-100 hover:border-surface-700 transition-colors"
                                  title="View Details"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <Link
                                  href={`/admin/packages/manage?id=${pkg.id}&type=${
                                    pkg.category?.name?.toLowerCase().includes("market")
                                      ? "digital-marketing"
                                      : pkg.category?.name?.toLowerCase().includes("seo")
                                      ? "seo"
                                      : "website"
                                  }`}
                                  className="p-2 rounded-lg bg-surface-900 border border-surface-800 text-blue-400 hover:text-blue-300 hover:border-blue-500/40 transition-colors"
                                  title="Edit Package Manager"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </Link>
                                <button
                                  onClick={() =>
                                    setDeleteConfirmation({
                                      type: "package",
                                      id: pkg.id,
                                      name: pkg.name,
                                    })
                                  }
                                  className="p-2 rounded-lg bg-surface-900 border border-surface-800 text-rose-400 hover:text-rose-300 hover:border-rose-500/40 transition-colors"
                                  title="Delete Package"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: ADD-ONS TABLE */}
          {activeTab === "addons" && (
            <div className="rounded-2xl bg-surface-950/80 border border-surface-800/80 backdrop-blur-xl overflow-hidden shadow-2xl space-y-4 p-4">
              <div className="flex items-center justify-between border-b border-surface-800/80 pb-3">
                <h3 className="text-base font-bold text-surface-100 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  Add-ons Catalog
                </h3>
                <span className="text-xs text-surface-400">
                  Showing {filteredAddons.length} category-specific add-ons
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-surface-800/80 bg-surface-900/40 text-surface-400 font-semibold uppercase tracking-wider text-xs">
                      <th className="py-3.5 px-4">Add-on Name</th>
                      <th className="py-3.5 px-4">Category</th>
                      <th className="py-3.5 px-4">Description</th>
                      <th className="py-3.5 px-4">Price (AED)</th>
                      <th className="py-3.5 px-4">Tax / VAT</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-800/40 text-surface-200">
                    {loading ? (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-surface-400 text-sm">
                          Loading add-ons...
                        </td>
                      </tr>
                    ) : filteredAddons.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-surface-400 text-sm">
                          No add-ons found for selected category. Click "Add New Add-on" to create one.
                        </td>
                      </tr>
                    ) : (
                      filteredAddons.map((addon) => {
                        const catName = addon.category?.name || "General";
                        return (
                          <tr key={addon.id} className="hover:bg-surface-900/40 transition-colors">
                            <td className="py-3.5 px-4 font-bold text-surface-100 text-sm">
                              <div className="flex items-center gap-2.5">
                                <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
                                <span>{addon.name}</span>
                              </div>
                            </td>
                            <td className="py-3.5 px-4">
                              <span
                                className={cn(
                                  "inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border",
                                  CATEGORY_COLORS[catName] || "bg-surface-800 text-surface-300 border-surface-700",
                                )}
                              >
                                {catName}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-surface-400 text-xs max-w-xs truncate">
                              {addon.description || "N/A"}
                            </td>
                            <td className="py-3.5 px-4 font-mono font-bold text-surface-100 text-sm">
                              {Number(addon.price).toLocaleString()}
                            </td>
                            <td className="py-3.5 px-4 font-mono text-surface-300 text-sm">
                              {addon.taxPercentage}%
                            </td>
                            <td className="py-3.5 px-4">
                              {addon.status ? (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 text-xs font-semibold">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                  Active
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-950/60 text-rose-400 border border-rose-500/30 text-xs font-semibold">
                                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                                  Inactive
                                </span>
                              )}
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => setViewItem({ type: "addon", data: addon })}
                                  className="p-2 rounded-lg bg-surface-900 border border-surface-800 text-surface-400 hover:text-surface-100 hover:border-surface-700 transition-colors"
                                  title="View Details"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => openEditAddonModal(addon)}
                                  className="p-2 rounded-lg bg-surface-900 border border-surface-800 text-blue-400 hover:text-blue-300 hover:border-blue-500/40 transition-colors"
                                  title="Edit Add-on"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() =>
                                    setDeleteConfirmation({
                                      type: "addon",
                                      id: addon.id,
                                      name: addon.name,
                                    })
                                  }
                                  className="p-2 rounded-lg bg-surface-900 border border-surface-800 text-rose-400 hover:text-rose-300 hover:border-rose-500/40 transition-colors"
                                  title="Delete Add-on"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MODAL 1: CREATE / EDIT CATEGORY */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 bg-surface-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-surface-900 border border-surface-800 rounded-2xl w-full max-w-md p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-surface-800 pb-3">
              <h3 className="text-sm font-bold text-surface-100">
                {editingCategory ? "Edit Category" : "Add New Category"}
              </h3>
              <button
                onClick={() => setIsCategoryModalOpen(false)}
                className="p-1 text-surface-400 hover:text-surface-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-surface-300 mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Website, SEO, Mobile App"
                  value={categoryForm.name}
                  onChange={(e) => {
                    setCategoryForm({ ...categoryForm, name: e.target.value });
                    if (categoryErrors.name) setCategoryErrors((prev) => ({ ...prev, name: undefined }));
                  }}
                  className={cn(
                    "w-full px-3 py-2 bg-surface-950 border rounded-xl text-xs text-surface-100 focus:outline-none transition-colors",
                    categoryErrors.name
                      ? "border-rose-500/80 focus:border-rose-500 bg-rose-950/10"
                      : "border-surface-800 focus:border-brand-500"
                  )}
                />
                {categoryErrors.name && (
                  <p className="mt-1.5 text-xs text-rose-400 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{categoryErrors.name}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-surface-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Brief summary of packages in this category"
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                  className="w-full px-3 py-2 bg-surface-950 border border-surface-800 rounded-xl text-xs text-surface-100 focus:outline-none focus:border-brand-500"
                />
              </div>

              {/* CRITICAL FEATURE: Enable Add-ons Toggle */}
              <div className="p-3.5 rounded-xl bg-surface-950 border border-surface-800 flex items-center justify-between">
                <div>
                  <label className="text-xs font-bold text-surface-100 block">
                    Enable Add-ons for this Category
                  </label>
                  <span className="text-[10px] text-surface-400 block mt-0.5">
                    When enabled, add-ons can be created &amp; linked specifically under this category.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={categoryForm.hasAddons}
                  onChange={(e) => setCategoryForm({ ...categoryForm, hasAddons: e.target.checked })}
                  className="w-4 h-4 rounded border-surface-700 text-brand-600 focus:ring-brand-500 bg-surface-900"
                />
              </div>

              {/* Category Status Toggle (Active / Disabled) */}
              <div className="p-3.5 rounded-xl bg-surface-950 border border-surface-800 flex items-center justify-between">
                <div>
                  <label className="text-xs font-bold text-surface-100 flex items-center gap-1.5">
                    <span className={cn("w-2 h-2 rounded-full", categoryForm.status ? "bg-emerald-400" : "bg-rose-400")} />
                    Category Status ({categoryForm.status ? "Active" : "Disabled"})
                  </label>
                  <span className="text-[10px] text-surface-400 block mt-0.5">
                    {categoryForm.status
                      ? "Category is active and visible across catalog and proposals."
                      : "Category is disabled and marked as inactive."}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setCategoryForm({ ...categoryForm, status: !categoryForm.status })}
                  className={cn(
                    "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                    categoryForm.status ? "bg-emerald-500" : "bg-surface-800"
                  )}
                >
                  <span
                    className={cn(
                      "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out",
                      categoryForm.status ? "translate-x-4" : "translate-x-0"
                    )}
                  />
                </button>
              </div>

              {/* PDF Proposal Template Upload Section */}
              {editingCategory && (
                <div className="p-4 rounded-xl bg-surface-950/90 border border-surface-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-xs font-bold text-surface-100 flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-indigo-400" />
                        Proposal Design Template (PDF)
                      </label>
                      <span className="text-[10px] text-surface-400 block mt-0.5">
                        Upload custom graphic design PDF. Auto-compresses background to WebP via Cloudinary.
                      </span>
                    </div>
                  </div>

                  {editingCategory.templatePdfUrl && (
                    <div className="p-2 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-[11px] flex items-center justify-between">
                      <span className="truncate">Active Template Configured</span>
                      <a
                        href={editingCategory.templatePdfUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="underline text-emerald-400 font-semibold"
                      >
                        View Original
                      </a>
                    </div>
                  )}

                  <label className="flex items-center justify-center gap-2 w-full p-2.5 rounded-xl border border-dashed border-indigo-500/40 hover:border-indigo-500 bg-indigo-950/20 text-indigo-300 text-xs font-semibold cursor-pointer transition-all">
                    <Upload className="w-4 h-4" />
                    <span>Upload New PDF Template</span>
                    <input
                      type="file"
                      accept=".pdf"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file || !editingCategory) return;
                        try {
                          setFormError(null);
                          await uploadCategoryTemplate(editingCategory.id, file);
                          loadData();
                          setIsCategoryModalOpen(false);
                        } catch (err: unknown) {
                          setFormError((err as Error).message || "Failed to upload template");
                        }
                      }}
                    />
                  </label>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-surface-800 pt-4">
              <button
                onClick={() => setIsCategoryModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs text-surface-400 hover:bg-surface-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCategory}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-500 text-white shadow-glow transition-all"
              >
                {editingCategory ? "Update Category" : "Create Category"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: CREATE / EDIT PACKAGE */}
      {isPackageModalOpen && (
        <div className="fixed inset-0 z-50 bg-surface-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-surface-900 border border-surface-800 rounded-2xl w-full max-w-lg p-6 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-surface-800 pb-3">
              <h3 className="text-sm font-bold text-surface-100">
                {editingPackage ? "Edit Package" : "Add New Package"}
              </h3>
              <button
                onClick={() => setIsPackageModalOpen(false)}
                className="p-1 text-surface-400 hover:text-surface-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-surface-300 mb-1">
                  Category *
                </label>
                <select
                  value={packageForm.categoryId}
                  onChange={(e) => {
                    setPackageForm({ ...packageForm, categoryId: e.target.value });
                    if (packageErrors.categoryId) setPackageErrors((prev) => ({ ...prev, categoryId: undefined }));
                  }}
                  className={cn(
                    "w-full px-3 py-2 bg-surface-950 border rounded-xl text-xs text-surface-100 focus:outline-none transition-colors",
                    packageErrors.categoryId
                      ? "border-rose-500/80 focus:border-rose-500 bg-rose-950/10"
                      : "border-surface-800 focus:border-brand-500"
                  )}
                >
                  <option value="">Select Category...</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                {packageErrors.categoryId && (
                  <p className="mt-1.5 text-xs text-rose-400 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{packageErrors.categoryId}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-surface-300 mb-1">
                  Package Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Static Website, Professional SEO"
                  value={packageForm.name}
                  onChange={(e) => {
                    setPackageForm({ ...packageForm, name: e.target.value });
                    if (packageErrors.name) setPackageErrors((prev) => ({ ...prev, name: undefined }));
                  }}
                  className={cn(
                    "w-full px-3 py-2 bg-surface-950 border rounded-xl text-xs text-surface-100 focus:outline-none transition-colors",
                    packageErrors.name
                      ? "border-rose-500/80 focus:border-rose-500 bg-rose-950/10"
                      : "border-surface-800 focus:border-brand-500"
                  )}
                />
                {packageErrors.name && (
                  <p className="mt-1.5 text-xs text-rose-400 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{packageErrors.name}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-surface-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Subtitle or short description"
                  value={packageForm.description}
                  onChange={(e) => setPackageForm({ ...packageForm, description: e.target.value })}
                  className="w-full px-3 py-2 bg-surface-950 border border-surface-800 rounded-xl text-xs text-surface-100 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-surface-300 mb-1">
                    Price (AED) *
                  </label>
                  <input
                    type="number"
                    placeholder="2999"
                    value={packageForm.price}
                    onChange={(e) => {
                      setPackageForm({ ...packageForm, price: e.target.value });
                      if (packageErrors.price) setPackageErrors((prev) => ({ ...prev, price: undefined }));
                    }}
                    className={cn(
                      "w-full px-3 py-2 bg-surface-950 border rounded-xl text-xs text-surface-100 focus:outline-none transition-colors",
                      packageErrors.price
                        ? "border-rose-500/80 focus:border-rose-500 bg-rose-950/10"
                        : "border-surface-800 focus:border-brand-500"
                    )}
                  />
                  {packageErrors.price && (
                    <p className="mt-1.5 text-xs text-rose-400 flex items-center gap-1 font-medium">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{packageErrors.price}</span>
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-surface-300 mb-1">
                    Duration
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 1 Month, 3 Months"
                    value={packageForm.duration}
                    onChange={(e) => setPackageForm({ ...packageForm, duration: e.target.value })}
                    className="w-full px-3 py-2 bg-surface-950 border border-surface-800 rounded-xl text-xs text-surface-100 focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              {/* Dynamic Features List */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-surface-200">
                    Included Features ({packageForm.features.length})
                  </label>
                  <button
                    type="button"
                    onClick={addFeatureRow}
                    className="text-[11px] text-brand-400 hover:text-brand-300 font-semibold"
                  >
                    + Add Feature
                  </button>
                </div>

                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {packageForm.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Feature name..."
                        value={feat.featureName}
                        onChange={(e) => updateFeatureRow(idx, "featureName", e.target.value)}
                        className="flex-1 px-3 py-1.5 bg-surface-950 border border-surface-800 rounded-lg text-xs text-surface-100"
                      />
                      <button
                        type="button"
                        onClick={() => removeFeatureRow(idx)}
                        className="p-1 text-rose-400 hover:text-rose-300"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-surface-800 pt-4">
              <button
                onClick={() => setIsPackageModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs text-surface-400 hover:bg-surface-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePackage}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-500 text-white shadow-glow transition-all"
              >
                {editingPackage ? "Update Package" : "Create Package"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: CREATE / EDIT ADD-ON (FILTERED TO ADDON-ENABLED CATEGORIES ONLY) */}
      {isAddonModalOpen && (
        <div className="fixed inset-0 z-50 bg-surface-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-surface-900 border border-surface-800 rounded-2xl w-full max-w-2xl p-7 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-surface-800 pb-4">
              <h3 className="text-base font-bold text-surface-100 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                {editingAddon ? "Edit Add-on" : "Add New Add-on"}
              </h3>
              <button
                onClick={() => setIsAddonModalOpen(false)}
                className="p-1.5 text-surface-400 hover:text-surface-100 rounded-lg hover:bg-surface-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-sm flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {addonEnabledCategories.length === 0 ? (
              <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-300 text-sm space-y-2">
                <div className="flex items-center gap-2 font-bold">
                  <HelpCircle className="w-4 h-4" />
                  <span>No Add-on Enabled Categories Found</span>
                </div>
                <p>
                  Per workflow rules, Add-ons can only be added to categories that have "Enable Add-ons" checked.
                  Please edit a Category first to enable add-ons.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-surface-300 mb-1.5">
                    Category *
                  </label>
                  <select
                    value={addonForm.categoryId}
                    onChange={(e) => {
                      setAddonForm({ ...addonForm, categoryId: e.target.value });
                      if (addonErrors.categoryId) setAddonErrors((prev) => ({ ...prev, categoryId: undefined }));
                    }}
                    className={cn(
                      "w-full px-3.5 py-2.5 bg-surface-950 border rounded-xl text-sm text-surface-100 focus:outline-none transition-colors",
                      addonErrors.categoryId
                        ? "border-rose-500/80 focus:border-rose-500 bg-rose-950/10"
                        : "border-surface-800 focus:border-brand-500"
                    )}
                  >
                    <option value="">Select Category...</option>
                    {addonEnabledCategories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  {addonErrors.categoryId && (
                    <p className="mt-1.5 text-xs text-rose-400 flex items-center gap-1 font-medium">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{addonErrors.categoryId}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-surface-300 mb-1.5">
                    Add-on Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Additional Page, E-commerce Integration"
                    value={addonForm.name}
                    onChange={(e) => {
                      setAddonForm({ ...addonForm, name: e.target.value });
                      if (addonErrors.name) setAddonErrors((prev) => ({ ...prev, name: undefined }));
                    }}
                    className={cn(
                      "w-full px-3.5 py-2.5 bg-surface-950 border rounded-xl text-sm text-surface-100 focus:outline-none transition-colors",
                      addonErrors.name
                        ? "border-rose-500/80 focus:border-rose-500 bg-rose-950/10"
                        : "border-surface-800 focus:border-brand-500"
                    )}
                  />
                  {addonErrors.name && (
                    <p className="mt-1.5 text-xs text-rose-400 flex items-center gap-1 font-medium">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{addonErrors.name}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-surface-300 mb-1.5">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Add extra page to your website"
                    value={addonForm.description}
                    onChange={(e) => setAddonForm({ ...addonForm, description: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-surface-950 border border-surface-800 rounded-xl text-sm text-surface-100 focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-surface-300 mb-1.5">
                      Price (AED) *
                    </label>
                    <input
                      type="number"
                      placeholder="499"
                      value={addonForm.price}
                      onChange={(e) => {
                        setAddonForm({ ...addonForm, price: e.target.value });
                        if (addonErrors.price) setAddonErrors((prev) => ({ ...prev, price: undefined }));
                      }}
                      className={cn(
                        "w-full px-3.5 py-2.5 bg-surface-950 border rounded-xl text-sm text-surface-100 focus:outline-none transition-colors",
                        addonErrors.price
                          ? "border-rose-500/80 focus:border-rose-500 bg-rose-950/10"
                          : "border-surface-800 focus:border-brand-500"
                      )}
                    />
                    {addonErrors.price && (
                      <p className="mt-1.5 text-xs text-rose-400 flex items-center gap-1 font-medium">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{addonErrors.price}</span>
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-surface-300 mb-1.5">
                      Tax / VAT % *
                    </label>
                    <input
                      type="number"
                      placeholder="5.0"
                      value={addonForm.taxPercentage}
                      onChange={(e) => {
                        setAddonForm({ ...addonForm, taxPercentage: e.target.value });
                        if (addonErrors.taxPercentage) setAddonErrors((prev) => ({ ...prev, taxPercentage: undefined }));
                      }}
                      className={cn(
                        "w-full px-3.5 py-2.5 bg-surface-950 border rounded-xl text-sm text-surface-100 focus:outline-none transition-colors",
                        addonErrors.taxPercentage
                          ? "border-rose-500/80 focus:border-rose-500 bg-rose-950/10"
                          : "border-surface-800 focus:border-brand-500"
                      )}
                    />
                    {addonErrors.taxPercentage && (
                      <p className="mt-1.5 text-xs text-rose-400 flex items-center gap-1 font-medium">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{addonErrors.taxPercentage}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-surface-950 border border-surface-800 flex items-center justify-between">
                  <div>
                    <label className="text-xs font-semibold text-surface-200 block">
                      Add-on Status ({addonForm.status ? "Active" : "Inactive"})
                    </label>
                    <span className="text-[11px] text-surface-400 block mt-0.5">
                      Enable or disable availability for this add-on item
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAddonForm({ ...addonForm, status: !addonForm.status })}
                    className={cn(
                      "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                      addonForm.status ? "bg-emerald-500" : "bg-surface-800"
                    )}
                  >
                    <span
                      className={cn(
                        "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out",
                        addonForm.status ? "translate-x-4" : "translate-x-0"
                      )}
                    />
                  </button>
                </div>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 border-t border-surface-800 pt-4">
              <button
                onClick={() => setIsAddonModalOpen(false)}
                disabled={isSubmittingAddon}
                className="px-4 py-2.5 rounded-xl text-sm text-surface-400 hover:bg-surface-800 disabled:opacity-50 transition-colors"
              >
                Cancel
              </button>
              {addonEnabledCategories.length > 0 && (
                <button
                  onClick={handleSaveAddon}
                  disabled={isSubmittingAddon}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white shadow-glow transition-all flex items-center gap-2"
                >
                  {isSubmittingAddon && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>
                    {isSubmittingAddon
                      ? editingAddon
                        ? "Updating..."
                        : "Saving to DB..."
                      : editingAddon
                      ? "Update Add-on"
                      : "Create Add-on"}
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: DELETE CONFIRMATION */}
      {deleteConfirmation && (
        <div className="fixed inset-0 z-50 bg-surface-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-surface-900 border border-surface-800 rounded-2xl w-full max-w-sm p-6 space-y-4 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-rose-950/60 border border-rose-500/40 text-rose-400 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-surface-100">
                Delete {deleteConfirmation.type.toUpperCase()}?
              </h3>
              <p className="text-xs text-surface-400 mt-1">
                Are you sure you want to delete{" "}
                <span className="text-surface-100 font-semibold">"{deleteConfirmation.name}"</span>?
                This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmation(null)}
                className="px-4 py-2 rounded-xl text-xs text-surface-400 hover:bg-surface-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white shadow-glow transition-all"
              >
                Delete Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: VIEW DETAILS MODAL */}
      {viewItem && (
        <div className="fixed inset-0 z-50 bg-surface-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-surface-900 border border-surface-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-surface-800 pb-3">
              <h3 className="text-sm font-bold text-surface-100">
                {viewItem.type === "package" ? "Package Details" : "Add-on Details"}
              </h3>
              <button onClick={() => setViewItem(null)} className="p-1 text-surface-400 hover:text-surface-100">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-surface-400 block text-[10px] uppercase font-bold">Name</span>
                <span className="font-bold text-surface-100 text-sm">{viewItem.data.name}</span>
              </div>
              <div>
                <span className="text-surface-400 block text-[10px] uppercase font-bold">Category</span>
                <span className="text-surface-200">{viewItem.data.category?.name || "Unassigned"}</span>
              </div>
              <div>
                <span className="text-surface-400 block text-[10px] uppercase font-bold">Price</span>
                <span className="font-mono text-brand-300 font-bold text-sm">
                  AED {Number(viewItem.data.price).toLocaleString()}
                </span>
              </div>
              {viewItem.data.description && (
                <div>
                  <span className="text-surface-400 block text-[10px] uppercase font-bold">Description</span>
                  <span className="text-surface-300">{viewItem.data.description}</span>
                </div>
              )}

              {viewItem.type === "package" && (viewItem.data as PackageItem).features?.length > 0 && (
                <div className="pt-2 border-t border-surface-800">
                  <span className="text-surface-400 block text-[10px] uppercase font-bold mb-2">
                    Included Features
                  </span>
                  <ul className="space-y-1.5">
                    {(viewItem.data as PackageItem).features.map((f, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-surface-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{f.featureName}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="border-t border-surface-800 pt-3 text-right">
              <button
                onClick={() => setViewItem(null)}
                className="px-4 py-2 rounded-xl text-xs bg-surface-800 hover:bg-surface-700 text-surface-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
