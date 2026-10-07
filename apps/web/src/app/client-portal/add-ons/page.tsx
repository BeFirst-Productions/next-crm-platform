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
import { useProposalStore, ALL_ADDONS } from "@/stores";

// Helper to resolve Package details from Zustand packageSelection
const PACKAGE_PRICES: Record<string, { name: string; price: number }> = {
  // Web tiers
  basic: { name: "BASIC", price: 799 },
  starter: { name: "STARTER", price: 1499 },
  business: { name: "BUSINESS", price: 2499 },
  professional: { name: "PROFESSIONAL", price: 5500 },
  premium: { name: "PREMIUM", price: 6999 },
  mini: { name: "MINI E-COMMERCE", price: 3999 },
  standard: { name: "STANDARD E-COMMERCE", price: 5999 },

  // Marketing tiers
  growth: { name: "GROWTH MARKETING", price: 4499 },
  scale: { name: "SCALE MARKETING", price: 9999 },

  // SEO tiers
  "local-seo": { name: "LOCAL SEO", price: 1800 },
  "growth-seo": { name: "GROWTH SEO", price: 3200 },
  "authority-seo": { name: "AUTHORITY SEO", price: 5500 },

  // Branding tiers
  "brand-starter": { name: "BRAND STARTER", price: 999 },
  "business-identity": { name: "BUSINESS IDENTITY", price: 1999 },
  "complete-brand": { name: "COMPLETE BRAND", price: 3499 },
  "content-starter": { name: "CONTENT STARTER", price: 799 },
  "content-growth": { name: "CONTENT GROWTH", price: 1499 },
  "content-pro": { name: "CONTENT PRO", price: 2999 },
  "lead-starter": { name: "LEAD STARTER", price: 1299 },
  "lead-growth": { name: "LEAD GROWTH", price: 2499 },
  "lead-scale": { name: "LEAD SCALE", price: 4999 },
  "growth-360": { name: "GROWTH 360", price: 8500 },
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

  // Selected package details
  const packageInfo = React.useMemo(() => {
    if (packageSelection.ecommerce) {
      return PACKAGE_PRICES[packageSelection.ecommerce] || { name: "E-COMMERCE", price: 3999 };
    }
    if (packageSelection.tier) {
      return PACKAGE_PRICES[packageSelection.tier] || { name: "PROFESSIONAL", price: 5500 };
    }
    return { name: "PROFESSIONAL", price: 5500 };
  }, [packageSelection]);

  // Selected Add-ons items list
  const selectedAddonsList = React.useMemo(() => {
    return ALL_ADDONS.filter((addon) => selectedAddonIds.includes(addon.id));
  }, [selectedAddonIds]);

  // Available catalogue items (all add-ons not currently selected)
  const availableAddonsList = React.useMemo(() => {
    return ALL_ADDONS.filter((addon) => !selectedAddonIds.includes(addon.id));
  }, [selectedAddonIds]);

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
                      {availableAddonsList.map((addon) => (
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
                      ))}
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

                {/* Package Info */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    PACKAGE
                  </span>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white uppercase">{packageInfo.name}</span>
                    <span className="font-mono font-bold text-slate-200">
                      AED {packagePrice.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="border-t border-[#162a4a]" />

                {/* Breakdown List */}
                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Package Base:</span>
                    <span className="font-mono text-slate-200">
                      AED {packagePrice.toLocaleString()}
                    </span>
                  </div>

                  {selectedAddonsList.map((addon) => (
                    <div
                      key={addon.id}
                      className="flex items-center justify-between text-slate-400"
                    >
                      <span className="truncate pr-2">{addon.name}:</span>
                      <span className="font-mono text-slate-200 shrink-0">
                        AED {addon.price.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-[#162a4a]" />

                {/* Subtotal & VAT */}
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Sub Total:</span>
                    <span className="font-mono text-slate-200">
                      AED {subTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>VAT (5%):</span>
                    <span className="font-mono text-slate-200">
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
