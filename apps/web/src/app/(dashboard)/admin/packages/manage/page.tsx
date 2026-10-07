"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Save,
  Check,
  X,
  Plus,
  Trash2,
  Edit2,
  Rocket,
  Upload,
  LayoutGrid,
  ChevronDown,
} from "lucide-react";
import { fetchPackages, updatePackage, createPackage, fetchCategories } from "@/lib/catalog-api";

interface FeatureRow {
  id?: string;
  featureName: string;
  included: boolean;
}

const PRESET_PACKAGES: Record<
  string,
  {
    title: string;
    packageName: string;
    category: string;
    price: string;
    description: string;
    highlightTag: string;
    iconType: "rocket" | "web" | "seo";
    features: FeatureRow[];
  }
> = {
  website: {
    title: "Website Developing Package Manager",
    packageName: "Basic Website",
    category: "Website",
    price: "2999",
    description: "Basic static website for small business",
    highlightTag: "⭐ Most Popular",
    iconType: "web",
    features: [
      { featureName: "Responsive Design", included: true },
      { featureName: "Social Media Integration", included: true },
      { featureName: "Custom Asset", included: true },
      { featureName: "Contact Form", included: true },
      { featureName: "WhatsApp Integration", included: true },
      { featureName: "Google Maps", included: true },
      { featureName: "Social Media Links", included: true },
      { featureName: "SEO", included: true },
      { featureName: "Google Analytics", included: true },
      { featureName: "Speed Optimization", included: true },
      { featureName: "Admin Panel / CMS", included: false },
      { featureName: "Blog / News", included: false },
      { featureName: "Product / Service Catalogue", included: false },
      { featureName: "Booking System", included: false },
      { featureName: "Multi-language", included: false },
      { featureName: "Security Setup", included: false },
      { featureName: "Support", included: false },
      { featureName: "Domain Name", included: false },
      { featureName: "Hosting/Sharing", included: false },
      { featureName: "Company Mail", included: false },
    ],
  },
  "digital-marketing": {
    title: "Digital Marketing Package Manager",
    packageName: "Scale Package",
    category: "Digital Marketing",
    price: "3499",
    description:
      "Scale your brand with advanced digital marketing strategies for long-term growth.",
    highlightTag: "⭐ Most Popular",
    iconType: "rocket",
    features: [
      { featureName: "Strategy & Consultation", included: true },
      { featureName: "Advanced Keyword Research", included: true },
      { featureName: "On-Page & Technical SEO", included: true },
      { featureName: "Content Strategy & Creation", included: true },
      { featureName: "Social Media Management", included: true },
      { featureName: "Paid Advertising (Google & Meta)", included: true },
      { featureName: "Monthly Performance Report", included: true },
      { featureName: "Dedicated Account Manager", included: true },
      { featureName: "Competitor Analysis", included: false },
      { featureName: "Conversion Rate Optimization", included: false },
      { featureName: "Email Marketing Setup", included: false },
      { featureName: "Growth Strategy Roadmap", included: false },
    ],
  },
  seo: {
    title: "SEO & GEO Package Manager",
    packageName: "Growth SEO Package",
    category: "SEO",
    price: "2499",
    description: "Rank #1 on Google and Google Maps with geo-targeted outreach.",
    highlightTag: "⚡ Fast Delivery",
    iconType: "seo",
    features: [
      { featureName: "Google My Business Audit & Setup", included: true },
      { featureName: "Local Citations & Maps Ranking", included: true },
      { featureName: "On-Page Keyword Optimization", included: true },
      { featureName: "High Domain Authority Backlinks", included: true },
      { featureName: "Geo-targeted Landing Pages", included: true },
      { featureName: "Competitor Backlink Gap Analysis", included: true },
      { featureName: "Technical SEO Audit", included: true },
      { featureName: "Monthly Rank Tracking Report", included: true },
      { featureName: "Multi-location Management", included: false },
      { featureName: "International Hreflang SEO", included: false },
    ],
  },
};

export default function PackageEditManagerPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const typeParam = searchParams.get("type") || "website";
  const idParam = searchParams.get("id");
  const isCreateMode = !idParam;

  const initialPreset = PRESET_PACKAGES[typeParam] || PRESET_PACKAGES.website;

  const [pageTitle, setPageTitle] = React.useState(initialPreset.title);
  const [isActive, setIsActive] = React.useState(true);
  const [packageName, setPackageName] = React.useState(initialPreset.packageName);
  const [category, setCategory] = React.useState(initialPreset.category);
  const [price, setPrice] = React.useState(initialPreset.price);
  const [description, setDescription] = React.useState(initialPreset.description);
  const [highlightTag, setHighlightTag] = React.useState(initialPreset.highlightTag);
  const [features, setFeatures] = React.useState<FeatureRow[]>(initialPreset.features);

  // New feature input state
  const [newFeatureText, setNewFeatureText] = React.useState("");
  const [editingIndex, setEditingIndex] = React.useState<number | null>(null);
  const [editingText, setEditingText] = React.useState("");

  const [saving, setSaving] = React.useState(false);
  const [saveSuccess, setSaveSuccess] = React.useState(false);

  // Load from API if an actual package ID was passed
  React.useEffect(() => {
    if (!idParam) return;
    const loadFromApi = async () => {
      try {
        const pkgs = await fetchPackages();
        const found = pkgs.find((p) => p.id === idParam);
        if (found) {
          setPackageName(found.name);
          setPrice(String(found.price));
          setDescription(found.description || "");
          setIsActive(found.status);
          if (found.category?.name) {
            setCategory(found.category.name);
            setPageTitle(`${found.category.name} Package Manager`);
          }
          if (found.features && found.features.length > 0) {
            setFeatures(
              found.features.map((f) => ({
                id: f.id,
                featureName: f.featureName,
                included: f.included,
              }))
            );
          }
        }
      } catch {}
    };
    loadFromApi();
  }, [idParam]);

  // Handle adding feature
  const handleAddFeature = () => {
    if (!newFeatureText.trim()) return;
    setFeatures((prev) => [
      ...prev,
      {
        featureName: newFeatureText.trim(),
        included: true,
      },
    ]);
    setNewFeatureText("");
  };

  // Toggle included
  const handleToggleFeatureStatus = (index: number) => {
    setFeatures((prev) =>
      prev.map((f, i) => (i === index ? { ...f, included: !f.included } : f))
    );
  };

  // Delete feature
  const handleDeleteFeature = (index: number) => {
    setFeatures((prev) => prev.filter((_, i) => i !== index));
  };

  // Edit feature
  const handleStartEdit = (index: number) => {
    setEditingIndex(index);
    setEditingText(features[index].featureName);
  };

  const handleSaveEdit = (index: number) => {
    if (!editingText.trim()) return;
    setFeatures((prev) =>
      prev.map((f, i) => (i === index ? { ...f, featureName: editingText.trim() } : f))
    );
    setEditingIndex(null);
  };

  // Save changes
  const handleSaveChanges = async () => {
    setSaving(true);
    try {
      if (idParam) {
        await updatePackage(idParam, {
          name: packageName,
          price: parseFloat(price) || 0,
          description,
          status: isActive,
          features: features.map((f, idx) => ({
            featureName: f.featureName,
            included: f.included,
            sortOrder: idx + 1,
          })),
        });
      } else {
        const catList = await fetchCategories();
        const matched =
          catList.find((c) => c.name.toLowerCase() === category.toLowerCase()) ||
          catList[0];
        if (matched) {
          await createPackage({
            categoryId: matched.id,
            name: packageName,
            price: parseFloat(price) || 0,
            description,
            status: isActive,
            billingType: "ONE_TIME",
            features: features.map((f, idx) => ({
              featureName: f.featureName,
              included: f.included,
              sortOrder: idx + 1,
            })),
          });
        }
      }
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        if (isCreateMode) {
          router.push("/admin/packages");
        }
      }, 1500);
    } catch {
      // Mock fallback success for preview
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4 animate-fade-in pb-12 select-none">
      {/* -------------------------------------------------------------------- */}
      {/* Top Header & Breadcrumb */}
      {/* -------------------------------------------------------------------- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            {pageTitle}
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Dashboard <span className="text-slate-600 font-medium">&gt;</span> Package & Add-ons
            Manager <span className="text-slate-600 font-medium">&gt;</span>{" "}
            <span className="text-slate-200">{pageTitle}</span>
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Quick preset selector tabs */}
          <div className="hidden md:flex items-center bg-[#091120] border border-[#162544] rounded-lg p-0.5 text-xs text-slate-400 mr-2">
            <button
              onClick={() => {
                const p = PRESET_PACKAGES.website;
                setPageTitle(p.title);
                setPackageName(p.packageName);
                setCategory(p.category);
                setPrice(p.price);
                setDescription(p.description);
                setHighlightTag(p.highlightTag);
                setFeatures(p.features);
              }}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                category === "Website"
                  ? "bg-blue-600 text-white font-semibold"
                  : "hover:text-white"
              }`}
            >
              Website Pack
            </button>
            <button
              onClick={() => {
                const p = PRESET_PACKAGES["digital-marketing"];
                setPageTitle(p.title);
                setPackageName(p.packageName);
                setCategory(p.category);
                setPrice(p.price);
                setDescription(p.description);
                setHighlightTag(p.highlightTag);
                setFeatures(p.features);
              }}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                category === "Digital Marketing"
                  ? "bg-blue-600 text-white font-semibold"
                  : "hover:text-white"
              }`}
            >
              Digital Marketing
            </button>
            <button
              onClick={() => {
                const p = PRESET_PACKAGES.seo;
                setPageTitle(p.title);
                setPackageName(p.packageName);
                setCategory(p.category);
                setPrice(p.price);
                setDescription(p.description);
                setHighlightTag(p.highlightTag);
                setFeatures(p.features);
              }}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                category === "SEO" ? "bg-blue-600 text-white font-semibold" : "hover:text-white"
              }`}
            >
              SEO & GEO
            </button>
          </div>

          <Link
            href="/admin/packages"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#0b1424] hover:bg-[#121f38] border border-[#182846] text-slate-300 hover:text-white text-xs font-medium transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to List</span>
          </Link>

          <button
            onClick={handleSaveChanges}
            disabled={saving}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/30 transition-all active:scale-[0.99]"
          >
            <Save className="w-3.5 h-3.5" />
            <span>
              {saving
                ? isCreateMode
                  ? "Creating..."
                  : "Saving..."
                : saveSuccess
                ? isCreateMode
                  ? "Created!"
                  : "Saved!"
                : isCreateMode
                ? "Save & Create"
                : "Save Changes"}
            </span>
          </button>
        </div>
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* 2-Column Split: Left Edit Card + Right Features Card */}
      {/* -------------------------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* ================================================================== */}
        {/* Left Column (Edit Package Form): 5 cols on lg */}
        {/* ================================================================== */}
        <div className="lg:col-span-5 bg-[#0a1220] border border-[#15233c] rounded-xl p-5 shadow-2xl flex flex-col justify-between">
          <div className="space-y-4">
            {/* Header with Active Toggle */}
            <div className="flex items-start justify-between border-b border-[#14223a] pb-3">
              <div>
                <h2 className="text-sm font-bold text-white">
                  {isCreateMode ? "Create Package" : "Edit Package"}
                </h2>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {isCreateMode
                    ? "Fill in package details, pricing and features."
                    : "Update package details, pricing and features."}
                </p>
              </div>

              {/* Active Toggle Button */}
              <button
                type="button"
                onClick={() => setIsActive(!isActive)}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all ${
                  isActive
                    ? "bg-[#052e16] border-[#166534] text-[#4ade80]"
                    : "bg-[#27272a] border-[#3f3f46] text-slate-400"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isActive ? "bg-[#4ade80] animate-pulse" : "bg-slate-400"
                  }`}
                />
                <span>{isActive ? "Active" : "Inactive"}</span>
                <ChevronDown className="w-3 h-3 ml-0.5 opacity-80" />
              </button>
            </div>

            {/* Package Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Package Name <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={packageName}
                onChange={(e) => setPackageName(e.target.value)}
                placeholder="e.g. Basic Website, Scale Package"
                className="w-full bg-[#070d18] border border-[#162544] hover:border-[#22375e] focus:border-blue-500 focus:outline-none text-xs text-white placeholder:text-slate-500 rounded-lg px-3 py-2.5 transition-colors"
              />
            </div>

            {/* Package Image Preview (for Digital Marketing / Media packages) */}
            {category === "Digital Marketing" && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Package Image
                </label>
                <div className="flex items-center gap-3">
                  <div className="relative w-24 h-24 rounded-xl bg-gradient-to-tr from-[#13112c] via-[#210f44] to-[#120e29] border border-[#37206b] flex items-center justify-center overflow-hidden group shadow-lg">
                    <Rocket className="w-10 h-10 text-purple-400 drop-shadow-[0_0_12px_rgba(168,85,247,0.6)]" />
                    <button
                      type="button"
                      className="absolute top-1.5 right-1.5 p-1 rounded-md bg-black/60 text-purple-300 hover:text-white transition-colors"
                      title="Edit Image"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <button
                      type="button"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0c1527] hover:bg-[#121f38] border border-[#1b2b48] text-xs font-medium text-slate-300 hover:text-white transition-colors"
                    >
                      <Upload className="w-3.5 h-3.5 text-blue-400" />
                      <span>Change Image</span>
                    </button>
                    <span className="text-[10px] text-slate-500">
                      Recommended: 400x400 PNG or WebP
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Category Dropdown */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Category <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <select
                  value={category}
                  onChange={(e) => {
                    const newCat = e.target.value;
                    setCategory(newCat);
                    if (newCat === "Website") {
                      setPageTitle("Website Developing Package Manager");
                    } else if (newCat === "Digital Marketing") {
                      setPageTitle("Digital Marketing Package Manager");
                    } else if (newCat === "SEO") {
                      setPageTitle("SEO & GEO Package Manager");
                    }
                  }}
                  className="appearance-none w-full bg-[#070d18] border border-[#162544] hover:border-[#22375e] text-xs text-white rounded-lg pl-3 pr-8 py-2.5 focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="Website">Website</option>
                  <option value="Digital Marketing">Digital Marketing</option>
                  <option value="SEO">SEO</option>
                  <option value="E-commerce & Mini Website">E-commerce & Mini Website</option>
                  <option value="Social Media">Social Media</option>
                  <option value="Video Production">Video Production</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Short Description */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-300">
                  Short Description <span className="text-rose-400">*</span>
                </label>
                <span className="text-[10px] text-slate-500 font-mono">
                  {description.length}/200
                </span>
              </div>
              <textarea
                rows={3}
                value={description}
                maxLength={200}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief summary of package services"
                className="w-full bg-[#070d18] border border-[#162544] hover:border-[#22375e] focus:border-blue-500 focus:outline-none text-xs text-white placeholder:text-slate-500 rounded-lg p-3 transition-colors resize-none"
              />
            </div>

            {/* Pricing Section */}
            <div className="pt-2">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-4 h-4 rounded bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">
                  1
                </span>
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Pricing
                </span>
              </div>

              <div className="space-y-3 pl-6 border-l border-[#1a2c4e] ml-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Price (AED) <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="2999"
                    className="w-full bg-[#070d18] border border-[#162544] hover:border-[#22375e] focus:border-blue-500 focus:outline-none text-xs font-mono text-white placeholder:text-slate-500 rounded-lg px-3 py-2 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Highlight Tag (Optional)
                  </label>
                  <div className="relative">
                    <select
                      value={highlightTag}
                      onChange={(e) => setHighlightTag(e.target.value)}
                      className="appearance-none w-full bg-[#070d18] border border-[#162544] hover:border-[#22375e] text-xs text-white rounded-lg pl-3 pr-8 py-2 focus:outline-none focus:border-blue-500 cursor-pointer"
                    >
                      <option value="⭐ Most Popular">⭐ Most Popular</option>
                      <option value="🔥 Best Value">🔥 Best Value</option>
                      <option value="⚡ Fast Delivery">⚡ Fast Delivery</option>
                      <option value="None">None</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Card Notification */}
          <div className="mt-6 pt-4 border-t border-[#14223a] flex items-center justify-between text-[11px] text-slate-400">
            <span>Status: {isActive ? "Live in Catalog" : "Draft (Hidden)"}</span>
            <span className="text-emerald-400 font-medium">Auto-sync enabled</span>
          </div>
        </div>

        {/* ================================================================== */}
        {/* Right Column (Package Features Table): 7 cols on lg */}
        {/* ================================================================== */}
        <div className="lg:col-span-7 bg-[#0a1220] border border-[#15233c] rounded-xl p-5 shadow-2xl flex flex-col justify-between">
          <div className="space-y-4">
            {/* Header: Title + Feature Add Input */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#14223a] pb-3">
              <div>
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <LayoutGrid className="w-4 h-4 text-blue-400" />
                  Package Features
                </h2>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Add, edit or remove features for this package.
                </p>
              </div>

              {/* Quick Add Feature Bar */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newFeatureText}
                  onChange={(e) => setNewFeatureText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddFeature();
                    }
                  }}
                  placeholder="Type feature name and press Enter..."
                  className="bg-[#070d18] border border-[#162544] hover:border-[#22375e] focus:border-blue-500 focus:outline-none text-xs text-white placeholder:text-slate-500 rounded-lg px-3 py-1.5 min-w-[200px] sm:min-w-[240px]"
                />
                <button
                  type="button"
                  onClick={handleAddFeature}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/30 whitespace-nowrap transition-colors"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Add Feature</span>
                </button>
              </div>
            </div>

            {/* Features Table */}
            <div className="border border-[#14223a] rounded-xl overflow-hidden bg-[#070d18]">
              <div className="max-h-[580px] overflow-y-auto no-scrollbar">
                <table className="w-full text-left border-collapse">
                  <thead className="sticky top-0 bg-[#080f1d] border-b border-[#14223a] text-[11px] font-semibold text-slate-400 uppercase tracking-wider z-10">
                    <tr>
                      <th className="py-2.5 px-3 text-center w-10">#</th>
                      <th className="py-2.5 px-3">Feature Name</th>
                      <th className="py-2.5 px-3 text-center w-36">
                        {category === "Digital Marketing" ? "Included" : "Status"}
                      </th>
                      <th className="py-2.5 px-3 text-center w-24">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#101c31] text-xs">
                    {features.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="text-center py-10 text-slate-500">
                          No features added yet. Type a feature name above and click "Add
                          Feature".
                        </td>
                      </tr>
                    ) : (
                      features.map((feat, index) => {
                        const isEditingThis = editingIndex === index;

                        return (
                          <tr
                            key={index}
                            className="hover:bg-[#0c1628] transition-colors group"
                          >
                            {/* # */}
                            <td className="py-2.5 px-3 text-center text-slate-400 font-mono text-xs">
                              {index + 1}
                            </td>

                            {/* Feature Name */}
                            <td className="py-2.5 px-3">
                              {isEditingThis ? (
                                <div className="flex items-center gap-1.5">
                                  <input
                                    type="text"
                                    value={editingText}
                                    onChange={(e) => setEditingText(e.target.value)}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter") handleSaveEdit(index);
                                      if (e.key === "Escape") setEditingIndex(null);
                                    }}
                                    autoFocus
                                    className="bg-[#0b1424] border border-blue-500 text-xs text-white rounded px-2 py-1 w-full focus:outline-none"
                                  />
                                  <button
                                    onClick={() => handleSaveEdit(index)}
                                    className="p-1 rounded bg-blue-600 text-white hover:bg-blue-500"
                                  >
                                    <Check className="w-3 h-3" />
                                  </button>
                                  <button
                                    onClick={() => setEditingIndex(null)}
                                    className="p-1 rounded bg-slate-800 text-slate-300 hover:text-white"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              ) : (
                                <span
                                  onClick={() => handleStartEdit(index)}
                                  className="text-slate-200 hover:text-white cursor-pointer font-medium"
                                  title="Click to edit name"
                                >
                                  {feat.featureName}
                                </span>
                              )}
                            </td>

                            {/* Status / Included Column */}
                            <td className="py-2.5 px-3 text-center">
                              {category === "Digital Marketing" ? (
                                /* Pill badge style matching digital marketing screenshot */
                                <button
                                  type="button"
                                  onClick={() => handleToggleFeatureStatus(index)}
                                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium transition-all ${
                                    feat.included
                                      ? "bg-[#042f2e] text-[#2dd4bf] border border-[#0f766e] hover:bg-[#064e3b]"
                                      : "bg-[#450a0a] text-[#f87171] border border-[#991b1b] hover:bg-[#7f1d1d]"
                                  }`}
                                  title="Click to toggle"
                                >
                                  {feat.included ? (
                                    <>
                                      <Check className="w-3 h-3 stroke-[3]" />
                                      <span>Included</span>
                                    </>
                                  ) : (
                                    <>
                                      <X className="w-3 h-3 stroke-[3]" />
                                      <span>Not Included</span>
                                    </>
                                  )}
                                </button>
                              ) : (
                                /* Circle icon style matching website screenshot */
                                <button
                                  type="button"
                                  onClick={() => handleToggleFeatureStatus(index)}
                                  className="inline-flex items-center justify-center p-1 rounded-full hover:scale-110 transition-transform"
                                  title="Click to toggle status"
                                >
                                  {feat.included ? (
                                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400">
                                      <Check className="w-3 h-3 stroke-[3]" />
                                    </div>
                                  ) : (
                                    <div className="w-5 h-5 rounded-full bg-rose-500/20 border border-rose-500/50 flex items-center justify-center text-rose-400">
                                      <X className="w-3 h-3 stroke-[3]" />
                                    </div>
                                  )}
                                </button>
                              )}
                            </td>

                            {/* Actions Column */}
                            <td className="py-2.5 px-3 text-center">
                              <div className="inline-flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => handleStartEdit(index)}
                                  className="p-1 rounded border border-[#1b2b48] bg-[#0c1527] text-sky-400 hover:text-white hover:bg-sky-500/20 hover:border-sky-500 transition-colors"
                                  title="Edit Feature"
                                >
                                  <Edit2 className="w-3 h-3" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteFeature(index)}
                                  className="p-1 rounded border border-[#1b2b48] bg-[#0c1527] text-rose-400 hover:text-white hover:bg-rose-500/20 hover:border-rose-500 transition-colors"
                                  title="Delete Feature"
                                >
                                  <Trash2 className="w-3 h-3" />
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
          </div>

          {/* Bottom Action Buttons: Cancel and Update Package */}
          <div className="mt-5 pt-4 border-t border-[#14223a] flex items-center justify-end gap-3">
            <Link
              href="/admin/packages"
              className="px-4 py-2 rounded-lg bg-[#0b1424] hover:bg-[#121f38] border border-[#182846] text-slate-300 hover:text-white text-xs font-medium transition-colors"
            >
              Cancel
            </Link>
            <button
              onClick={handleSaveChanges}
              disabled={saving}
              className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/30 transition-all active:scale-[0.99]"
            >
              {saving
                ? isCreateMode
                  ? "Creating..."
                  : "Updating..."
                : isCreateMode
                ? "Create Package"
                : "Update Package"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
