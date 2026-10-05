"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  Trash2,
  Plus,
  Check,
  ArrowLeft,
  ArrowRight,
  Sun,
  Moon,
} from "lucide-react";
import { useProposalStore, ALL_ADDONS } from "@/stores";


// Helper to resolve Package details from Zustand packageSelection
const PACKAGE_PRICES: Record<string, { name: string; price: number }> = {
  // Web tiers
  basic: { name: "Basic Website", price: 799 },
  starter: { name: "Starter Website", price: 1499 },
  business: { name: "Business Website", price: 2499 },
  professional: { name: "Professional", price: 5500 },
  premium: { name: "Premium Website", price: 6999 },
  mini: { name: "Mini E-Commerce", price: 3999 },
  standard: { name: "Standard E-Commerce", price: 5999 },

  // Marketing tiers
  growth: { name: "Growth Marketing", price: 4499 },
  scale: { name: "Scale Marketing", price: 9999 },

  // SEO tiers
  "local-seo": { name: "Local SEO", price: 1800 },
  "growth-seo": { name: "Growth SEO", price: 3200 },
  "authority-seo": { name: "Authority SEO", price: 5500 },

  // Branding tiers
  "brand-starter": { name: "Brand Starter", price: 999 },
  "business-identity": { name: "Business Identity", price: 1999 },
  "complete-brand": { name: "Complete Brand", price: 3499 },
  "content-starter": { name: "Content Starter", price: 799 },
  "content-growth": { name: "Content Growth", price: 1499 },
  "content-pro": { name: "Content Pro", price: 2999 },
  "lead-starter": { name: "Lead Starter", price: 1299 },
  "lead-growth": { name: "Lead Growth", price: 2499 },
  "lead-scale": { name: "Lead Scale", price: 4999 },
  "growth-360": { name: "Growth 360", price: 8500 },
};

export default function ClientPortalAddonsPage() {
  const router = useRouter();

  // Zustand Store
  const {
    companyDetails,
    packageSelection,
    selectedAddonIds,
    addAddon,
    removeAddon,
    isDarkMode,
    toggleDarkMode,
    setCurrentStep,
    setIsSaved,
  } = useProposalStore();

  // Selected package details
  const packageInfo = React.useMemo(() => {
    if (packageSelection.ecommerce) {
      return PACKAGE_PRICES[packageSelection.ecommerce] || { name: "E-Commerce", price: 3999 };
    }
    if (packageSelection.tier) {
      return PACKAGE_PRICES[packageSelection.tier] || { name: "Professional", price: 5500 };
    }
    return { name: "Professional", price: 5500 };
  }, [packageSelection]);

  // Selected Add-ons items list
  const selectedAddonsList = React.useMemo(() => {
    return ALL_ADDONS.filter((addon) => selectedAddonIds.includes(addon.id));
  }, [selectedAddonIds]);

  // Available catalogue items (all add-ons)
  const availableAddonsList = ALL_ADDONS;

  // Pricing calculations
  const packagePrice = packageInfo.price;
  const addonsTotal = React.useMemo(() => {
    return selectedAddonsList.reduce((sum, item) => sum + item.price, 0);
  }, [selectedAddonsList]);
  const grandTotal = packagePrice + addonsTotal;

  // Navigation handlers
  const handleSaveAndContinue = () => {
    setCurrentStep(4);
    setIsSaved(true);
    router.push("/client-portal/review");
  };

  return (
    <div className="min-h-screen bg-[#060e1a] text-slate-100 flex flex-col font-sans select-none antialiased">
      {/* ==================================================================== */}
      {/* TOP HEADER: BRANDING, STEPPER & THEME TOGGLE */}
      {/* ==================================================================== */}
      <header
        className={`w-full border-b px-4 sm:px-8 py-3 flex items-center justify-between sticky top-0 z-30 transition-colors shadow-sm ${
          isDarkMode
            ? "bg-[#071120] border-[#14233e] text-slate-100"
            : "bg-white border-slate-200 text-slate-900"
        }`}
      >
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2 group">
          <img
            src="/logo.svg"
            alt="nEXT Branding | Marketing"
            className="h-9 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
          />
        </Link>

        {/* Center Breadcrumb Stepper (Matching Design) */}
        <div
          className={`hidden md:flex items-center rounded-full px-4 py-1.5 shadow-inner text-xs ${
            isDarkMode
              ? "bg-[#091528] border border-[#172b4c]"
              : "bg-[#071120] border border-[#172b4c] text-slate-200"
          }`}
        >
          {/* Step 1: Company Details */}
          <Link
            href="/client-portal/company-details"
            className="flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 transition-colors font-medium px-2 py-0.5"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Company Details</span>
          </Link>

          <span className="text-slate-600 px-1 font-bold">›</span>

          {/* Step 2: Package */}
          <Link
            href="/client-portal/packages"
            className="flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 transition-colors font-medium px-2 py-0.5"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Package</span>
          </Link>

          <span className="text-slate-600 px-1 font-bold">›</span>

          {/* Step 3: Add-ons (Active) */}
          <div className="flex items-center gap-1.5 text-white font-bold bg-[#00a6ff] px-3.5 py-1 rounded-full shadow-md shadow-sky-500/25">
            <span className="w-4 h-4 rounded-full bg-white text-[#00a6ff] text-[10px] flex items-center justify-center font-black">
              3
            </span>
            <span>Add-ons</span>
          </div>

          <span className="text-slate-600 px-1 font-bold">›</span>

          {/* Step 4: Review */}
          <Link
            href="/client-portal/review"
            className="flex items-center gap-1.5 text-slate-400 hover:text-slate-200 transition-colors px-2 py-0.5 font-medium"
          >
            <span className="w-4 h-4 rounded-full bg-slate-700 text-slate-300 text-[10px] flex items-center justify-center font-bold">
              4
            </span>
            <span>Review</span>
          </Link>
        </div>

        {/* Right: Dark / Light Mode Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleDarkMode}
            className={`flex items-center gap-1.5 border px-2.5 py-1 rounded-full transition-all shadow-sm cursor-pointer ${
              isDarkMode
                ? "bg-[#091528] border-[#162544] text-slate-300 hover:text-white"
                : "bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900"
            }`}
            title="Toggle Light/Dark Display"
          >
            {isDarkMode ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[10px] font-medium text-slate-200">Light</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-slate-600" />
                <span className="text-[10px] font-medium text-slate-700">Dark</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* ==================================================================== */}
      {/* MAIN CONTAINER */}
      {/* ==================================================================== */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* ================================================================== */}
        {/* HERO BANNER: "Enhance Your Package" */}
        {/* ================================================================== */}
        <div className="relative bg-white rounded-3xl p-6 sm:p-8 shadow-xl overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6 border border-slate-100">
          {/* Subtle Decorative Grid Dots (matching reference) */}
          <div className="absolute top-4 left-4 opacity-40 pointer-events-none">
            <div className="grid grid-cols-4 gap-1.5">
              {Array.from({ length: 16 }).map((_, i) => (
                <div key={i} className="w-1.5 h-1.5 rounded-full bg-sky-400" />
              ))}
            </div>
          </div>
          <div className="absolute top-4 right-56 opacity-40 pointer-events-none hidden md:block">
            <div className="grid grid-cols-4 gap-1.5">
              {Array.from({ length: 16 }).map((_, i) => (
                <div key={i} className="w-1.5 h-1.5 rounded-full bg-sky-400" />
              ))}
            </div>
          </div>

          {/* Left Text */}
          <div className="space-y-1 z-10 text-center sm:text-left">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
              Enhance Your <span className="text-[#00a6ff]">Package</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-500 font-medium pt-1">
              Add extra services based on your client's requirements.
            </p>
          </div>

          {/* Right 3D Illustration */}
          <div className="relative shrink-0 flex items-center justify-center z-10">
            <div className="relative w-44 sm:w-56 h-32 sm:h-36 flex items-center justify-center">
              <img
                src="/addons-hero-laptop.png"
                alt="Add-ons Package Illustration"
                className="w-full h-full object-contain filter drop-shadow-xl"
              />
            </div>
          </div>
        </div>

        {/* ================================================================== */}
        {/* 2-COLUMN LAYOUT: TABLES ON LEFT (65%), STICKY SUMMARY ON RIGHT (35%) */}
        {/* ================================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* ================================================================ */}
          {/* LEFT COLUMN: DARK CONTAINER WITH SELECTED & AVAILABLE ADD-ONS    */}
          {/* ================================================================ */}
          <div className="lg:col-span-8 bg-[#071120] border border-[#14233e] rounded-3xl p-5 sm:p-7 shadow-2xl space-y-6">
            {/* -------------------------------------------------------------- */}
            {/* TABLE 1: SELECTED ADD-ONS TABLE                                */}
            {/* -------------------------------------------------------------- */}
            <div className="rounded-2xl overflow-hidden border border-[#162744] shadow-lg">
              {/* Table Cyan Header */}
              <div className="bg-[#0099e6] px-5 py-3 flex items-center justify-between text-white font-black text-xs tracking-wider uppercase">
                <span className="w-1/2">ADD-ONS</span>
                <span className="w-1/4 text-center">PRICE</span>
                <span className="w-1/4 text-right pr-2">ACTION</span>
              </div>

              {/* Table Rows */}
              <div className="bg-white divide-y divide-slate-100">
                {selectedAddonsList.length > 0 ? (
                  selectedAddonsList.map((item) => (
                    <div
                      key={item.id}
                      className="px-5 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors text-xs sm:text-sm"
                    >
                      {/* Name */}
                      <span className="w-1/2 font-semibold text-slate-800">
                        {item.name}
                      </span>

                      {/* Price */}
                      <span className="w-1/4 text-center font-bold text-slate-700">
                        AED {item.price.toLocaleString()}
                        {item.unit ? ` ${item.unit}` : ""}
                      </span>

                      {/* Action: Green Badge + Red Trash Button */}
                      <div className="w-1/4 flex items-center justify-end gap-2 pr-1">
                        <span className="inline-flex items-center gap-1 bg-[#ecfdf5] text-[#059669] border border-[#a7f3d0] font-semibold text-[11px] px-2.5 py-0.5 rounded-full">
                          <Check className="w-3 h-3 stroke-[3]" />
                          Added
                        </span>
                        <button
                          onClick={() => removeAddon(item.id)}
                          className="w-6 h-6 rounded bg-[#ef4444] hover:bg-[#dc2626] text-white flex items-center justify-center transition-all cursor-pointer shadow-sm hover:scale-110 active:scale-95"
                          title={`Remove ${item.name}`}
                          aria-label={`Remove ${item.name}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-8 px-4 text-center text-slate-400 text-sm">
                    <p className="font-medium">No add-ons selected yet.</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Choose extra services from the catalogue below to enhance this package.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* -------------------------------------------------------------- */}
            {/* TABLE 2: AVAILABLE ADD-ONS CATALOGUE                           */}
            {/* -------------------------------------------------------------- */}
            <div className="rounded-2xl overflow-hidden border border-[#162744] shadow-lg">
              {/* Table Cyan Header */}
              <div className="bg-[#0099e6] px-5 py-3 flex items-center justify-between text-white font-black text-xs tracking-wider uppercase">
                <span className="w-1/2">ADD-ONS</span>
                <span className="w-1/4 text-center">PRICE</span>
                <span className="w-1/4 text-right pr-2">ACTION</span>
              </div>

              {/* Table Rows (Catalogue) */}
              <div className="bg-white divide-y divide-slate-100 max-h-[560px] overflow-y-auto">
                {availableAddonsList.map((item) => {
                  const isAdded = selectedAddonIds.includes(item.id);
                  return (
                    <div
                      key={item.id}
                      className="px-5 py-2.5 flex items-center justify-between hover:bg-sky-50/50 transition-colors text-xs sm:text-sm"
                    >
                      {/* Name */}
                      <span className="w-1/2 font-medium text-slate-800">
                        {item.name}
                      </span>

                      {/* Price */}
                      <span className="w-1/4 text-center font-semibold text-slate-700">
                        AED {item.price.toLocaleString()}
                        {item.unit ? ` ${item.unit}` : ""}
                      </span>

                      {/* Action: Add or Added */}
                      <div className="w-1/4 flex items-center justify-end pr-1">
                        {isAdded ? (
                          <button
                            onClick={() => removeAddon(item.id)}
                            className="inline-flex items-center gap-1 bg-[#ecfdf5] hover:bg-rose-50 hover:text-rose-600 hover:border-rose-300 text-[#059669] border border-[#a7f3d0] font-semibold text-[11px] px-3 py-1 rounded-full transition-all cursor-pointer group"
                            title="Click to remove"
                          >
                            <span className="group-hover:hidden flex items-center gap-1">
                              <Check className="w-3 h-3 stroke-[3]" />
                              Added
                            </span>
                            <span className="hidden group-hover:flex items-center gap-1">
                              <Trash2 className="w-3 h-3" />
                              Remove
                            </span>
                          </button>
                        ) : (
                          <button
                            onClick={() => addAddon(item.id)}
                            className="inline-flex items-center gap-1 bg-[#00a6ff] hover:bg-[#0092e0] active:scale-95 text-white font-bold text-xs px-3.5 py-1 rounded-full transition-all shadow-sm hover:shadow-sky-500/25 cursor-pointer"
                          >
                            <Plus className="w-3 h-3 stroke-[3]" />
                            Add
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Navigation inside Left Container */}
            <div className="pt-2 flex items-center justify-between">
              <Link
                href="/client-portal/packages"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0d1b2e] hover:bg-[#132742] text-slate-300 hover:text-white border border-[#1c3256] text-xs font-semibold transition-all cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to package</span>
              </Link>

              <span className="text-xs text-slate-400">
                {selectedAddonsList.length} add-on{selectedAddonsList.length === 1 ? "" : "s"} selected
              </span>
            </div>
          </div>

          {/* ================================================================ */}
          {/* RIGHT COLUMN: STICKY ORDER SUMMARY (MATCHING REFERENCE MOCKUP)   */}
          {/* ================================================================ */}
          <div className="lg:col-span-4 sticky top-24 space-y-4">
            <div className="bg-[#071120] border border-[#14233e] rounded-3xl p-5 sm:p-6 shadow-2xl">
              {/* Inner blue border box */}
              <div className="border border-sky-900/60 rounded-2xl p-5 bg-[#091527]/90 space-y-4">
                {/* Title */}
                <h3 className="text-sm font-bold text-slate-200 tracking-wider uppercase border-b border-[#142646] pb-3">
                  ORDER SUMMARY
                </h3>

                {/* Company Name */}
                <div className="space-y-0.5">
                  <p className="text-[11px] font-medium text-slate-400">Company</p>
                  <p className="text-sm font-bold text-white">
                    {companyDetails.companyName || "ABC Technologies"}
                  </p>
                </div>

                {/* Selected Package */}
                <div className="space-y-0.5">
                  <p className="text-[11px] font-medium text-slate-400">Selected Package</p>
                  <p className="text-sm font-semibold text-slate-200">
                    {packageInfo.name}
                  </p>
                </div>

                {/* Package Price Row */}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs font-bold text-slate-200">Package Price</span>
                  <span className="text-sm font-bold text-white">
                    AED {packagePrice.toLocaleString()}
                  </span>
                </div>

                {/* Add-ons List */}
                <div className="space-y-2 pt-2 border-t border-[#142646]">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
                    Add-ons:
                  </p>

                  {selectedAddonsList.length > 0 ? (
                    <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                      {selectedAddonsList.map((addon) => (
                        <div
                          key={addon.id}
                          className="flex items-center justify-between text-xs text-slate-300"
                        >
                          <span className="truncate pr-2">{addon.name}</span>
                          <span className="font-semibold text-slate-200 shrink-0">
                            AED {addon.price.toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 italic">None selected</p>
                  )}
                </div>

                {/* Add-ons Total Row */}
                <div className="flex items-center justify-between pt-2 border-t border-[#142646]">
                  <span className="text-xs font-bold text-slate-200">Add-ons Total</span>
                  <span className="text-sm font-bold text-sky-400">
                    AED {addonsTotal.toLocaleString()}
                  </span>
                </div>

                {/* Grand Total Row */}
                <div className="pt-3 border-t border-[#142646] space-y-1">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    TOTAL
                  </div>
                  <div className="text-3xl sm:text-4xl font-black text-[#00a6ff] text-right tracking-tight">
                    AED {grandTotal.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Action: Save & Continue Button */}
              <button
                onClick={handleSaveAndContinue}
                className="w-full mt-5 bg-[#00a6ff] hover:bg-[#0092e0] text-white font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-sky-500/25 transition-all cursor-pointer hover:shadow-sky-500/40 hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Save & Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
