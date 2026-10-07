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

  // Handlers for Category Modal
  const openAddCategoryModal = () => {
    setEditingCategory(null);
    setCategoryForm({ name: "", description: "", hasAddons: false, status: true });
    setFormError(null);
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
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = async () => {
    if (!categoryForm.name.trim()) {
      setFormError("Category name is required");
      return;
    }
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
    setIsPackageModalOpen(true);
  };
  void openEditPackageModal;

  const handleSavePackage = async () => {
    if (!packageForm.name.trim() || !packageForm.categoryId || !packageForm.price) {
      setFormError("Category, Name, and Price are required");
      return;
    }
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
    // Auto-select first addon-enabled category
    const firstEnabledCat = addonEnabledCategories[0]?.id || "";
    setAddonForm({
      categoryId: firstEnabledCat,
      name: "",
      description: "",
      price: "",
      taxPercentage: "5.0",
      pricingType: "ONE_TIME",
      status: true,
    });
    setFormError(null);
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
    setIsAddonModalOpen(true);
  };

  const handleSaveAddon = async () => {
    if (!addonForm.name.trim() || !addonForm.categoryId || !addonForm.price) {
      setFormError("Category, Name, and Price are required");
      return;
    }
    try {
      const payload = {
        ...addonForm,
        price: parseFloat(addonForm.price),
        taxPercentage: parseFloat(addonForm.taxPercentage),
      };
      if (editingAddon) {
        await updateAddon(editingAddon.id, payload);
      } else {
        await createAddon(payload);
      }
      setIsAddonModalOpen(false);
      loadData();
    } catch (err: unknown) {
      setFormError((err as Error).message || "Failed to save add-on");
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
          <button
            onClick={openAddAddonModal}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-glow transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Add-on</span>
          </button>
        </div>
      </div>

      {/* Grid Layout: Left Sidebar Categories + Right Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Categories List (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="p-4 rounded-2xl bg-surface-950/80 border border-surface-800/80 backdrop-blur-xl">
            <div className="flex items-center justify-between pb-3 border-b border-surface-800/60 mb-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-surface-400">
                Categories
              </h2>
              <button
                onClick={openAddCategoryModal}
                className="p-1 rounded-lg text-surface-400 hover:text-brand-300 hover:bg-surface-800 transition-colors"
                title="Add New Category"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1">
              {/* All Categories item */}
              <button
                onClick={() => {
                  setSelectedCategory("ALL");
                  setCategoryFilter("ALL");
                }}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all group",
                  selectedCategory === "ALL"
                    ? "bg-brand-600/20 text-brand-300 border border-brand-500/40 font-semibold shadow-glow"
                    : "text-surface-300 hover:bg-surface-900/80 border border-transparent",
                )}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-surface-800 flex items-center justify-center text-surface-400">
                    <Layers className="w-3.5 h-3.5" />
                  </div>
                  <span>All Categories</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-surface-800/80 text-surface-400 font-bold">
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
                        "w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all text-left pr-14",
                        isSelected
                          ? "bg-brand-600/20 text-brand-300 border border-brand-500/40 font-semibold shadow-glow"
                          : "text-surface-300 hover:bg-surface-900/80 border border-transparent",
                      )}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <div
                          className={cn(
                            "w-6 h-6 rounded-lg flex items-center justify-center border",
                            CATEGORY_COLORS[cat.name] || "bg-surface-800 text-surface-400 border-surface-700",
                          )}
                        >
                          <IconComp className="w-3.5 h-3.5" />
                        </div>
                        <span className="truncate">{cat.name}</span>
                      </div>
                    </button>

                    <div className="absolute right-2 flex items-center gap-1.5">
                      {cat.hasAddons && (
                        <span
                          className="text-[9px] font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-1 py-0.2 rounded"
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
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-surface-800/80 text-surface-400 font-bold">
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
                "px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2",
                activeTab === "packages"
                  ? "bg-brand-600/20 text-brand-300 border border-brand-500/40 shadow-glow"
                  : "text-surface-400 hover:text-surface-200 hover:bg-surface-900/50",
              )}
            >
              <PackageIcon className="w-4 h-4" />
              <span>Packages ({filteredPackages.length})</span>
            </button>
            <button
              onClick={() => setActiveTab("addons")}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2",
                activeTab === "addons"
                  ? "bg-brand-600/20 text-brand-300 border border-brand-500/40 shadow-glow"
                  : "text-surface-400 hover:text-surface-200 hover:bg-surface-900/50",
              )}
            >
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>Add-ons ({filteredAddons.length})</span>
            </button>
          </div>

          {/* Filter Bar */}
          <div className="p-4 rounded-2xl bg-surface-950/80 border border-surface-800/80 backdrop-blur-xl flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-1 min-w-[260px]">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-surface-500" />
                <input
                  type="text"
                  placeholder={
                    activeTab === "packages" ? "Search packages by name..." : "Search add-ons by name..."
                  }
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-surface-900/80 border border-surface-800 rounded-xl text-xs text-surface-100 placeholder-surface-500 focus:outline-none focus:border-brand-500"
                />
              </div>

              {/* Category Dropdown Filter */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-surface-900/80 border border-surface-800 text-surface-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-brand-500"
              >
                <option value="ALL">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} {c.hasAddons ? "(+Addons)" : ""}
                  </option>
                ))}
              </select>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as "ALL" | "ACTIVE" | "INACTIVE")}
                className="bg-surface-900/80 border border-surface-800 text-surface-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-brand-500"
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
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-surface-900/80 hover:bg-surface-800 border border-surface-800 text-surface-400 hover:text-surface-100 text-xs font-medium transition-colors"
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
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-surface-800/80 bg-surface-900/40 text-surface-400 font-semibold uppercase tracking-wider text-[10px]">
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
                        <td colSpan={7} className="py-8 text-center text-surface-400">
                          Loading packages...
                        </td>
                      </tr>
                    ) : filteredPackages.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-surface-400">
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
                                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600/30 to-indigo-600/30 border border-brand-500/30 flex items-center justify-center text-brand-300 font-bold">
                                  <PackageIcon className="w-4 h-4" />
                                </div>
                                <div>
                                  <span className="font-bold text-surface-100 block">
                                    {pkg.name}
                                  </span>
                                  <span className="text-[11px] text-surface-400 block line-clamp-1">
                                    {pkg.description || "No description"}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="py-3.5 px-4">
                              <span
                                className={cn(
                                  "inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-semibold border",
                                  CATEGORY_COLORS[catName] || "bg-surface-800 text-surface-300 border-surface-700",
                                )}
                              >
                                {catName}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 font-mono font-bold text-surface-100">
                              {Number(pkg.price).toLocaleString()}
                            </td>
                            <td className="py-3.5 px-4 text-surface-300 font-medium">
                              {pkg.duration || "N/A"}
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-900 border border-surface-800 text-surface-300 font-mono text-[10px]">
                                <Sparkles className="w-3 h-3 text-amber-400" />
                                {pkg.features?.length || 0} Features
                              </span>
                            </td>
                            <td className="py-3.5 px-4">
                              {pkg.status ? (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 text-[10px] font-semibold">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                  Active
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-950/60 text-rose-400 border border-rose-500/30 text-[10px] font-semibold">
                                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                                  Inactive
                                </span>
                              )}
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => setViewItem({ type: "package", data: pkg })}
                                  className="p-1.5 rounded-lg bg-surface-900 border border-surface-800 text-surface-400 hover:text-surface-100 hover:border-surface-700 transition-colors"
                                  title="View Details"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                                <Link
                                  href={`/admin/packages/manage?id=${pkg.id}&type=${
                                    pkg.category?.name?.toLowerCase().includes("market")
                                      ? "digital-marketing"
                                      : pkg.category?.name?.toLowerCase().includes("seo")
                                      ? "seo"
                                      : "website"
                                  }`}
                                  className="p-1.5 rounded-lg bg-surface-900 border border-surface-800 text-blue-400 hover:text-blue-300 hover:border-blue-500/40 transition-colors"
                                  title="Edit Package Manager"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </Link>
                                <button
                                  onClick={() =>
                                    setDeleteConfirmation({
                                      type: "package",
                                      id: pkg.id,
                                      name: pkg.name,
                                    })
                                  }
                                  className="p-1.5 rounded-lg bg-surface-900 border border-surface-800 text-rose-400 hover:text-rose-300 hover:border-rose-500/40 transition-colors"
                                  title="Delete Package"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
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
                <h3 className="text-sm font-bold text-surface-100 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  Add-ons Catalog
                </h3>
                <span className="text-xs text-surface-400">
                  Showing {filteredAddons.length} category-specific add-ons
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-surface-800/80 bg-surface-900/40 text-surface-400 font-semibold uppercase tracking-wider text-[10px]">
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
                        <td colSpan={7} className="py-8 text-center text-surface-400">
                          Loading add-ons...
                        </td>
                      </tr>
                    ) : filteredAddons.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-surface-400">
                          No add-ons found for selected category. Click "Add New Add-on" to create one.
                        </td>
                      </tr>
                    ) : (
                      filteredAddons.map((addon) => {
                        const catName = addon.category?.name || "General";
                        return (
                          <tr key={addon.id} className="hover:bg-surface-900/40 transition-colors">
                            <td className="py-3.5 px-4 font-bold text-surface-100">
                              <div className="flex items-center gap-2.5">
                                <Sparkles className="w-4 h-4 text-purple-400" />
                                <span>{addon.name}</span>
                              </div>
                            </td>
                            <td className="py-3.5 px-4">
                              <span
                                className={cn(
                                  "inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-semibold border",
                                  CATEGORY_COLORS[catName] || "bg-surface-800 text-surface-300 border-surface-700",
                                )}
                              >
                                {catName}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-surface-400 text-[11px] max-w-xs truncate">
                              {addon.description || "N/A"}
                            </td>
                            <td className="py-3.5 px-4 font-mono font-bold text-surface-100">
                              {Number(addon.price).toLocaleString()}
                            </td>
                            <td className="py-3.5 px-4 font-mono text-surface-300">
                              {addon.taxPercentage}%
                            </td>
                            <td className="py-3.5 px-4">
                              {addon.status ? (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 text-[10px] font-semibold">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                  Active
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-950/60 text-rose-400 border border-rose-500/30 text-[10px] font-semibold">
                                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                                  Inactive
                                </span>
                              )}
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => setViewItem({ type: "addon", data: addon })}
                                  className="p-1.5 rounded-lg bg-surface-900 border border-surface-800 text-surface-400 hover:text-surface-100 hover:border-surface-700 transition-colors"
                                  title="View Details"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => openEditAddonModal(addon)}
                                  className="p-1.5 rounded-lg bg-surface-900 border border-surface-800 text-blue-400 hover:text-blue-300 hover:border-blue-500/40 transition-colors"
                                  title="Edit Add-on"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() =>
                                    setDeleteConfirmation({
                                      type: "addon",
                                      id: addon.id,
                                      name: addon.name,
                                    })
                                  }
                                  className="p-1.5 rounded-lg bg-surface-900 border border-surface-800 text-rose-400 hover:text-rose-300 hover:border-rose-500/40 transition-colors"
                                  title="Delete Add-on"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
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
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-surface-950 border border-surface-800 rounded-xl text-xs text-surface-100 focus:outline-none focus:border-brand-500"
                />
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
                  onChange={(e) => setPackageForm({ ...packageForm, categoryId: e.target.value })}
                  className="w-full px-3 py-2 bg-surface-950 border border-surface-800 rounded-xl text-xs text-surface-100 focus:outline-none focus:border-brand-500"
                >
                  <option value="">Select Category...</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-surface-300 mb-1">
                  Package Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Static Website, Professional SEO"
                  value={packageForm.name}
                  onChange={(e) => setPackageForm({ ...packageForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-surface-950 border border-surface-800 rounded-xl text-xs text-surface-100 focus:outline-none focus:border-brand-500"
                />
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
                    onChange={(e) => setPackageForm({ ...packageForm, price: e.target.value })}
                    className="w-full px-3 py-2 bg-surface-950 border border-surface-800 rounded-xl text-xs text-surface-100 focus:outline-none focus:border-brand-500"
                  />
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
          <div className="bg-surface-900 border border-surface-800 rounded-2xl w-full max-w-md p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-surface-800 pb-3">
              <h3 className="text-sm font-bold text-surface-100">
                {editingAddon ? "Edit Add-on" : "Add New Add-on"}
              </h3>
              <button
                onClick={() => setIsAddonModalOpen(false)}
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

            {addonEnabledCategories.length === 0 ? (
              <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-300 text-xs space-y-2">
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
                  <label className="block text-xs font-semibold text-surface-300 mb-1">
                    Category (Only Categories with Add-ons Enabled) *
                  </label>
                  <select
                    value={addonForm.categoryId}
                    onChange={(e) => setAddonForm({ ...addonForm, categoryId: e.target.value })}
                    className="w-full px-3 py-2 bg-surface-950 border border-surface-800 rounded-xl text-xs text-surface-100 focus:outline-none focus:border-brand-500"
                  >
                    <option value="">Select Category...</option>
                    {addonEnabledCategories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} (+Addons Enabled)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-surface-300 mb-1">
                    Add-on Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Additional Page, E-commerce Integration"
                    value={addonForm.name}
                    onChange={(e) => setAddonForm({ ...addonForm, name: e.target.value })}
                    className="w-full px-3 py-2 bg-surface-950 border border-surface-800 rounded-xl text-xs text-surface-100 focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-surface-300 mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Add extra page to your website"
                    value={addonForm.description}
                    onChange={(e) => setAddonForm({ ...addonForm, description: e.target.value })}
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
                      placeholder="499"
                      value={addonForm.price}
                      onChange={(e) => setAddonForm({ ...addonForm, price: e.target.value })}
                      className="w-full px-3 py-2 bg-surface-950 border border-surface-800 rounded-xl text-xs text-surface-100 focus:outline-none focus:border-brand-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-surface-300 mb-1">
                      Tax / VAT %
                    </label>
                    <input
                      type="number"
                      placeholder="5.0"
                      value={addonForm.taxPercentage}
                      onChange={(e) => setAddonForm({ ...addonForm, taxPercentage: e.target.value })}
                      className="w-full px-3 py-2 bg-surface-950 border border-surface-800 rounded-xl text-xs text-surface-100 focus:outline-none focus:border-brand-500"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 border-t border-surface-800 pt-4">
              <button
                onClick={() => setIsAddonModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs text-surface-400 hover:bg-surface-800 transition-colors"
              >
                Cancel
              </button>
              {addonEnabledCategories.length > 0 && (
                <button
                  onClick={handleSaveAddon}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-glow transition-all"
                >
                  {editingAddon ? "Update Add-on" : "Create Add-on"}
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
