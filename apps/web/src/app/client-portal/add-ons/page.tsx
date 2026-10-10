"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  Trash2,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { useProposalStore, ALL_ADDONS, type AddonItemData } from "@/stores";
import {
  fetchPackages,
  fetchAddons,
  fetchCategories,
  type PackageItem,
  type AddonItem,
  type ServiceCategory,
} from "@/lib/catalog-api";

// Helper fallback to resolve Package details from Zustand packageSelection
const PACKAGE_PRICES: Record<string, { name: string; price: number }> = {
  // Web tiers
  basic: { name: "BASIC", price: 799 },
  starter: { name: "STARTER", price: 1499 },
  business: { name: "BUSINESS", price: 2499 },
  professional: { name: "PROFESSIONAL", price: 3999 },
  premium: { name: "PREMIUM", price: 6999 },
  mini: { name: "MINI E-COMMERCE", price: 3499 },
  standard: { name: "STANDARD E-COMMERCE", price: 5999 },

  // Marketing tiers
  growth: { name: "GROWTH", price: 1999 },
  scale: { name: "SCALE", price: 4499 },

  // SEO tiers
  "local-seo": { name: "LOCAL SEO", price: 799 },
  "growth-seo": { name: "GROWTH SEO", price: 1499 },
  "authority-seo": { name: "AUTHORITY SEO", price: 2499 },

  // Branding tiers
  "brand-starter": { name: "BRAND STARTER", price: 999 },
  "business-identity": { name: "BUSINESS IDENTITY", price: 1999 },
  "complete-brand": { name: "COMPLETE BRAND", price: 3499 },
  "content-starter": { name: "CONTENT STARTER", price: 799 },
  "content-growth": { name: "CONTENT GROWTH", price: 1499 },
  "content-pro": { name: "CONTENT PRO", price: 2499 },
  "lead-starter": { name: "LEAD STARTER", price: 1499 },
  "lead-growth": { name: "LEAD GROWTH", price: 2499 },
  "lead-scale": { name: "LEAD SCALE", price: 3999 },
  "growth-360": { name: "GROWTH 360", price: 4999 },

  // Video tiers
  "video-starter": { name: "REELS & SHORTS STARTER", price: 999 },
  "video-growth": { name: "COMMERCIAL & BRAND GROWTH", price: 2499 },
  "video-pro": { name: "CINEMATIC ENTERPRISE SUITE", price: 4999 },
};

export default function ClientPortalAddonsPage() {
  const router = useRouter();

  // Zustand Store
  const {
    packageSelection,
    selectedAddonIds,
    addAddon,
    removeAddon,
    isDarkMode,
    toggleDarkMode,
    setCurrentStep,
    setIsSaved,
  } = useProposalStore();

  // Backend packages, categories & addons integration
  const [dbPackages, setDbPackages] = React.useState<PackageItem[]>([]);
  const [dbCategories, setDbCategories] = React.useState<ServiceCategory[]>([]);
  const [dbAddons, setDbAddons] = React.useState<AddonItem[]>([]);

  React.useEffect(() => {
    let isMounted = true;
    Promise.all([
      fetchPackages().catch(() => []),
      fetchAddons().catch(() => []),
      fetchCategories().catch(() => []),
    ]).then(([pkgs, addons, cats]) => {
      if (isMounted) {
        if (pkgs && pkgs.length > 0) setDbPackages(pkgs);
        if (addons && addons.length > 0) setDbAddons(addons);
        if (cats && cats.length > 0) setDbCategories(cats);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Active category derived directly from proposalStore packageSelection.category
  const activeCategory = React.useMemo(() => {
    const storeCat = packageSelection.category;

    // 1. Direct ID match from proposalStore packageSelection.category
    if (storeCat) {
      const directMatch = dbCategories.find((c) => c.id === storeCat);
      if (directMatch) return directMatch;

      // 2. Exact name match
      const nameMatch = dbCategories.find(
        (c) => c.name.toLowerCase() === storeCat.toLowerCase()
      );
      if (nameMatch) return nameMatch;

      // 3. Slug / keyword match
      const slug = storeCat.toLowerCase();
      const slugMatch = dbCategories.find((c) => {
        const cn = c.name.toLowerCase();
        if ((slug === "web" || slug === "website") && (cn.includes("web") || cn.includes("site"))) return true;
        if (slug === "seo" && (cn.includes("seo") || cn.includes("geo"))) return true;
        if (slug === "social" && (cn.includes("social") || cn.includes("brand"))) return true;
        if (slug === "ecommerce" && (cn.includes("commerce") || cn.includes("mini") || cn.includes("shop"))) return true;
        if (slug === "marketing" && (cn.includes("market") || cn.includes("digital"))) return true;
        if (slug === "video" && (cn.includes("video") || cn.includes("film") || cn.includes("reel"))) return true;
        return false;
      });
      if (slugMatch) return slugMatch;
    }

    // Fallback heuristic based on tier key
    const targetKey = (
      packageSelection.ecommerce ||
      packageSelection.tier ||
      "professional"
    ).toLowerCase();

    if (targetKey.includes("seo")) {
      const seo = dbCategories.find((c) => c.name.toLowerCase().includes("seo"));
      if (seo) return seo;
    }
    if (
      targetKey.includes("video") ||
      targetKey.includes("reel") ||
      targetKey.includes("cinematic") ||
      targetKey.includes("short")
    ) {
      const vid = dbCategories.find((c) => c.name.toLowerCase().includes("video"));
      if (vid) return vid;
    }
    if (
      targetKey.includes("brand") ||
      targetKey.includes("content") ||
      targetKey.includes("lead")
    ) {
      const sm = dbCategories.find(
        (c) =>
          c.name.toLowerCase().includes("social") ||
          c.name.toLowerCase().includes("brand")
      );
      if (sm) return sm;
    }
    if (
      targetKey.includes("market") ||
      targetKey.includes("growth") ||
      targetKey.includes("scale")
    ) {
      const dm = dbCategories.find((c) => c.name.toLowerCase().includes("market"));
      if (dm) return dm;
    }
    if (targetKey.includes("ecom") || targetKey.includes("mini")) {
      const ecom = dbCategories.find(
        (c) =>
          c.name.toLowerCase().includes("e-com") ||
          c.name.toLowerCase().includes("mini")
      );
      if (ecom) return ecom;
    }

    const web = dbCategories.find((c) => c.name.toLowerCase().includes("web"));
    if (web) return web;

    return dbCategories[0] || null;
  }, [packageSelection, dbCategories]);

  // Selected package details dynamically resolved from DB matching the active category
  const selectedPackage = React.useMemo(() => {
    const targetKey = (
      packageSelection.ecommerce ||
      packageSelection.tier ||
      "professional"
    ).toLowerCase();

    if (dbPackages.length === 0) return null;

    const activeCatId = activeCategory?.id;
    const activeCatName = activeCategory?.name?.toLowerCase() || "";

    // Candidate packages prioritized within the active category
    const categoryPackages = dbPackages.filter((p) => {
      if (activeCatId && (p.categoryId === activeCatId || p.category?.id === activeCatId)) return true;
      if (activeCatName && p.category?.name) {
        const pCatName = p.category.name.toLowerCase();
        if (pCatName === activeCatName) return true;
        if (activeCatName.includes("web") && pCatName.includes("web")) return true;
        if (activeCatName.includes("seo") && pCatName.includes("seo")) return true;
        if (activeCatName.includes("social") && pCatName.includes("social")) return true;
        if (activeCatName.includes("market") && pCatName.includes("market")) return true;
        if (activeCatName.includes("video") && pCatName.includes("video")) return true;
      }
      return false;
    });

    const pool = categoryPackages.length > 0 ? categoryPackages : dbPackages;

    // 1. Exact ID or pkg-{targetKey} match within pool
    const exactMatch = pool.find((p) => {
      const id = p.id.toLowerCase();
      const name = p.name.toLowerCase();
      return (
        id === targetKey ||
        id === `pkg-${targetKey}` ||
        name === targetKey
      );
    });
    if (exactMatch) return exactMatch;

    // 2. Suffix or segment match within pool (e.g. pkg-website-starter matching "starter")
    const segmentMatch = pool.find((p) => {
      const id = p.id.toLowerCase();
      const name = p.name.toLowerCase();
      const parts = id.replace("pkg-", "").split("-");
      return (
        parts.includes(targetKey) ||
        id.endsWith(`-${targetKey}`) ||
        name.includes(targetKey)
      );
    });
    if (segmentMatch) return segmentMatch;

    // 3. Fallback to includes within pool
    return pool.find((p) => p.id.toLowerCase().includes(targetKey)) || null;
  }, [packageSelection, dbPackages, activeCategory]);

  // Package name and base price for display and billing
  const packageInfo = React.useMemo(() => {
    if (selectedPackage) {
      return {
        name: selectedPackage.name,
        price: Number(selectedPackage.price) || 0,
      };
    }

    if (packageSelection.ecommerce && PACKAGE_PRICES[packageSelection.ecommerce]) {
      return PACKAGE_PRICES[packageSelection.ecommerce];
    }
    if (packageSelection.tier && PACKAGE_PRICES[packageSelection.tier]) {
      return PACKAGE_PRICES[packageSelection.tier];
    }
    return { name: "PROFESSIONAL", price: 3999 };
  }, [selectedPackage, packageSelection]);

  // Only show the add-ons created for that particular category from the DB
  const effectiveCategoryAddons: AddonItemData[] = React.useMemo(() => {
    if (dbAddons.length > 0) {
      const targetCatId = activeCategory?.id || selectedPackage?.categoryId;
      const targetCatName = (
        activeCategory?.name ||
        selectedPackage?.category?.name ||
        ""
      ).toLowerCase();

      // Filter addons belonging ONLY to this category from DB
      const matchedAddons = dbAddons.filter((a) => {
        // Direct categoryId or category.id match
        if (targetCatId && (a.categoryId === targetCatId || a.category?.id === targetCatId)) {
          return true;
        }

        // Name match fallback if IDs are uuid variants
        if (targetCatName && a.category?.name) {
          const aCatName = a.category.name.toLowerCase();
          if (aCatName === targetCatName) return true;
          if (targetCatName.includes("seo") && aCatName.includes("seo")) return true;
          if (targetCatName.includes("video") && aCatName.includes("video")) return true;
          if (targetCatName.includes("social") && aCatName.includes("social")) return true;
          if (targetCatName.includes("market") && aCatName.includes("market")) return true;
          if (targetCatName.includes("web") && aCatName.includes("web")) return true;
        }

        return false;
      });

      return matchedAddons.map((a) => {
        const catName = a.category?.name?.toLowerCase() || "";
        let category: "web" | "marketing" | "seo" | "media" | "tech" = "tech";
        if (catName.includes("web") || catName.includes("e-commerce")) category = "web";
        else if (catName.includes("market") || catName.includes("social")) category = "marketing";
        else if (catName.includes("seo")) category = "seo";
        else if (catName.includes("video")) category = "media";

        return {
          id: a.id,
          name: a.name,
          price: Number(a.price) || 0,
          unit:
            a.pricingType === "MONTHLY"
              ? "/ month"
              : a.pricingType === "YEARLY"
              ? "/ year"
              : undefined,
          category,
        };
      });
    }

    // Static fallback if DB is not populated
    const fallbackKey = (
      activeCategory?.name ||
      packageSelection.category ||
      packageSelection.tier ||
      "web"
    ).toLowerCase();
    const fallbackCategory = fallbackKey.includes("seo")
      ? "seo"
      : fallbackKey.includes("video")
      ? "media"
      : fallbackKey.includes("market") ||
        fallbackKey.includes("social") ||
        fallbackKey.includes("brand")
      ? "marketing"
      : "web";

    return ALL_ADDONS.filter((addon) => addon.category === fallbackCategory);
  }, [dbAddons, activeCategory, selectedPackage, packageSelection]);

  // Selected Add-ons items list (only matching the current category)
  const selectedAddonsList = React.useMemo(() => {
    return effectiveCategoryAddons.filter((addon) => selectedAddonIds.includes(addon.id));
  }, [effectiveCategoryAddons, selectedAddonIds]);

  // Available catalogue items (all add-ons in this category not currently selected)
  const availableAddonsList = React.useMemo(() => {
    return effectiveCategoryAddons.filter((addon) => !selectedAddonIds.includes(addon.id));
  }, [effectiveCategoryAddons, selectedAddonIds]);

  // Pricing calculations
  const packagePrice = packageInfo.price;
  const addonsTotal = React.useMemo(() => {
    return selectedAddonsList.reduce((sum, item) => sum + item.price, 0);
  }, [selectedAddonsList]);

  const subTotal = packagePrice + addonsTotal;
  const vatAmount = subTotal * 0.05;
  const grandTotal = subTotal + vatAmount;

  // Navigation handlers
  const handleSaveAndContinue = () => {
    setCurrentStep(4);
    setIsSaved(true);
    router.push("/client-portal/review");
  };

  return (
    <div className="min-h-screen bg-[#050b14] text-slate-100 flex flex-col font-sans select-none antialiased">
      {/* ==================================================================== */}
      {/* TOP HEADER: BRANDING, STEPPER & THEME TOGGLE */}
      {/* ==================================================================== */}
      <header className="w-full border-b border-[#11223b] bg-[#071120] px-4 sm:px-8 py-3.5 flex items-center justify-between sticky top-0 z-30 transition-colors shadow-lg">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2 group">
          <img
            src="/logo.svg"
            alt="nEXT Branding | Marketing"
            className="h-8 sm:h-9 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
          />
        </Link>

        {/* Center Breadcrumb Stepper (Matching Screenshot) */}
        <div className="hidden md:flex items-center gap-4 text-xs font-semibold text-slate-400">
          {/* Step 1: Company Details */}
          <Link
            href="/client-portal/company-details"
            className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Company Details</span>
          </Link>

          <span className="text-slate-600">›</span>

          {/* Step 2: Packages */}
          <Link
            href="/client-portal/packages"
            className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Packages</span>
          </Link>

          <span className="text-slate-600">›</span>

          {/* Step 3: Add-ons (Active Dot) */}
          <div className="flex items-center gap-1.5 text-white font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00a3ff] shadow-[0_0_8px_#00a3ff]" />
            <span className="text-white">Add-ons</span>
          </div>

          <span className="text-slate-600">›</span>

          {/* Step 4: Review */}
          <Link
            href="/client-portal/review"
            className="flex items-center gap-1.5 text-slate-500 hover:text-slate-300 transition-colors"
          >
            <span>Review</span>
          </Link>
        </div>

        {/* Right: Theme Toggle Switch */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleDarkMode}
            className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-[#00a3ff] transition-colors duration-200 ease-in-out focus:outline-none"
            title="Toggle theme"
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                isDarkMode ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </header>

      {/* ==================================================================== */}
      {/* MAIN CONTAINER */}
      {/* ==================================================================== */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Main Card Container */}
        <div className="bg-[#081220] border border-[#142642] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          {/* Header Title & Subtitle */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Enhance Your Package
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Add extra features or custom services to tailor the package to your requirements.
            </p>
          </div>

          {/* 2-COLUMN LAYOUT: TABLES ON LEFT (66%), STICKY SUMMARY ON RIGHT (34%) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* ============================================================== */}
            {/* LEFT COLUMN: SELECTED & AVAILABLE ADD-ONS TABLES               */}
            {/* ============================================================== */}
            <div className="lg:col-span-8 space-y-6">
              {/* UPPER TABLE: SELECTED ADD-ONS */}
              {selectedAddonsList.length > 0 && (
                <div className="bg-[#0a1526] border border-[#162a4a] rounded-2xl overflow-hidden shadow-lg">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-[#162a4a] bg-[#0c192d] text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                          <th className="py-3 px-4">ADD-ONS</th>
                          <th className="py-3 px-4 text-center">PRICE</th>
                          <th className="py-3 px-4 text-right">ACTION</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#13233c]">
                        {selectedAddonsList.map((addon) => (
                          <tr
                            key={addon.id}
                            className="hover:bg-[#0d1c33]/60 transition-colors"
                          >
                            <td className="py-3.5 px-4 font-semibold text-slate-200">
                              {addon.name}
                            </td>
                            <td className="py-3.5 px-4 text-center font-bold text-white font-mono">
                              AED {addon.price.toLocaleString()}
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <div className="inline-flex items-center gap-2">
                                <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded">
                                  1 Month
                                </span>
                                <button
                                  type="button"
                                  onClick={() => removeAddon(addon.id)}
                                  className="w-6 h-6 rounded bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/40 text-rose-400 flex items-center justify-center transition-all cursor-pointer active:scale-95"
                                  title="Remove add-on"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* LOWER TABLE: AVAILABLE ADD-ONS CATALOGUE */}
              <div className="bg-[#0a1526] border border-[#162a4a] rounded-2xl overflow-hidden shadow-lg">
                <div className="overflow-x-auto max-h-[580px] overflow-y-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="sticky top-0 z-10">
                      <tr className="border-b border-[#162a4a] bg-[#0c192d] text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                        <th className="py-3 px-4">ADD-ONS</th>
                        <th className="py-3 px-4 text-center">PRICE</th>
                        <th className="py-3 px-4 text-right">ACTION</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#13233c]">
                      {availableAddonsList.length > 0 ? (
                        availableAddonsList.map((addon) => (
                          <tr
                            key={addon.id}
                            className="hover:bg-[#0d1c33]/60 transition-colors"
                          >
                            <td className="py-3 px-4 text-slate-300 font-medium">
                              {addon.name}
                            </td>
                            <td className="py-3 px-4 text-center font-bold text-slate-200 font-mono">
                              AED {addon.price.toLocaleString()}
                            </td>
                            <td className="py-3 px-4 text-right">
                              <button
                                type="button"
                                onClick={() => addAddon(addon.id)}
                                className="bg-[#00a3ff] hover:bg-[#0092e0] text-white text-[11px] font-bold px-3 py-1 rounded shadow-sm shadow-sky-500/25 transition-all cursor-pointer active:scale-95"
                              >
                                + Add
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={3} className="py-8 text-center text-slate-400 italic">
                            {effectiveCategoryAddons.length === 0
                              ? "No add-ons available for this category."
                              : "All available add-ons for this category have been added."}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Back to Packages Button */}
              <div className="pt-1">
                <Link
                  href="/client-portal/packages"
                  className="inline-flex items-center gap-2 border border-[#182f54] hover:border-slate-500 bg-[#0a1628] hover:bg-[#0d1c33] text-slate-300 hover:text-white px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Packages</span>
                </Link>
              </div>
            </div>

            {/* ============================================================== */}
            {/* RIGHT COLUMN: STICKY ORDER SUMMARY                             */}
            {/* ============================================================== */}
            <div className="lg:col-span-4">
              <div className="bg-[#0a1526] border border-[#162a4a] rounded-2xl p-5 sm:p-6 shadow-xl space-y-5 sticky top-24">
                {/* Title */}
                <h3 className="text-xs font-black tracking-wider uppercase text-white">
                  ORDER SUMMARY
                </h3>

                {/* Items Breakdown */}
                <div className="space-y-3.5 text-xs">
                  {/* Selected Package */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      PACKAGE
                    </span>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white uppercase">{packageInfo.name}</span>
                      <span className="font-mono font-bold text-slate-200">
                        AED {packagePrice.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-[#162a4a]" />

                  {/* Selected Add-ons */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        ADD-ONS {selectedAddonsList.length > 0 ? `(${selectedAddonsList.length})` : ""}
                      </span>
                      {selectedAddonsList.length === 0 && (
                        <span className="text-[11px] text-slate-500 italic">None selected</span>
                      )}
                    </div>

                    {selectedAddonsList.length > 0 ? (
                      <div className="space-y-2 pt-0.5">
                        {selectedAddonsList.map((addon) => (
                          <div
                            key={addon.id}
                            className="flex items-center justify-between text-slate-400"
                          >
                            <span className="truncate pr-2 font-medium text-slate-300">{addon.name}</span>
                            <span className="font-mono text-slate-200 shrink-0 font-semibold">
                              AED {addon.price.toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="border-t border-[#162a4a]" />

                {/* Subtotal & VAT */}
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Sub Total:</span>
                    <span className="font-mono text-slate-200 font-semibold">
                      AED {subTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>VAT (5%):</span>
                    <span className="font-mono text-slate-200 font-semibold">
                      AED {vatAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                <div className="border-t border-[#162a4a]" />

                {/* Total */}
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-slate-400">Total:</span>
                  <div className="text-2xl sm:text-3xl font-black text-[#00a3ff] font-mono tracking-tight">
                    AED {grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>

                {/* Save & Continue Button */}
                <button
                  type="button"
                  onClick={handleSaveAndContinue}
                  className="w-full py-3 px-6 rounded-xl bg-[#00a3ff] hover:bg-[#0092e0] active:bg-[#0080e0] text-white font-bold text-xs sm:text-sm shadow-lg shadow-sky-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
                >
                  <span>Save & Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
