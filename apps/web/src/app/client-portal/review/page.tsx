"use client";

import * as React from "react";
import Link from "next/link";
import {
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Pencil,
  Check,
  Download,
  FileText,
  X,
} from "lucide-react";
import { useProposalStore, ALL_ADDONS } from "@/stores";

// Map package tiers to their display name, price, and deliverable features
interface PackageMeta {
  name: string;
  price: number;
  features: string[];
}

const PACKAGE_METADATA: Record<string, PackageMeta> = {
  // Web Packages
  basic: {
    name: "BASIC",
    price: 799,
    features: [
      "1-3 Responsive Web Pages",
      "Mobile First Optimisation",
      "Contact & Enquiry Form",
      "Standard Speed Setup",
      "Basic SEO Meta Tags",
    ],
  },
  starter: {
    name: "STARTER",
    price: 1499,
    features: [
      "Up to 5 Custom Pages",
      "Custom Modern UI/UX",
      "WhatsApp & Social Links",
      "Basic Admin Panel",
      "Google Analytics Setup",
    ],
  },
  business: {
    name: "BUSINESS",
    price: 2499,
    features: [
      "Up to 10 Custom Pages",
      "Interactive UI/UX Experience",
      "Dynamic Blog / News Module",
      "Lead Capture Integration",
      "Speed & Security Optimisation",
    ],
  },
  professional: {
    name: "PROFESSIONAL",
    price: 5500,
    features: [
      "10-15 Social Media Posts",
      "2 Dedicated Video Shoots",
      "Monthly SEO Audit",
      "Dedicated Account Manager",
      "24/7 Priority Support",
    ],
  },
  premium: {
    name: "PREMIUM",
    price: 6999,
    features: [
      "20+ Bespoke Pages",
      "Custom Micro-animations",
      "Advanced CMS & Admin",
      "Multi-language Setup",
      "1 Year Technical Support",
    ],
  },
  mini: {
    name: "MINI E-COMMERCE",
    price: 3999,
    features: [
      "Up to 50 Products",
      "Shopping Cart & Checkout",
      "Payment Gateway Integration",
      "Order Management",
      "Mobile Commerce Ready",
    ],
  },
  standard: {
    name: "STANDARD E-COMMERCE",
    price: 5999,
    features: [
      "Unlimited Products",
      "Advanced Inventory & Variants",
      "Multiple Payment Gateways",
      "Discount & Coupon System",
      "Custom Admin Dashboard",
    ],
  },

  // Marketing Packages
  growth: {
    name: "GROWTH MARKETING",
    price: 4499,
    features: [
      "Meta & Google Ads Management",
      "12 Social Media Creatives",
      "Conversion Tracking Setup",
      "Bi-Weekly Reporting",
      "A/B Ad Testing",
    ],
  },
  scale: {
    name: "SCALE MARKETING",
    price: 9999,
    features: [
      "Omnichannel Ad Strategy",
      "24 Video & Graphic Creatives",
      "Dedicated Media Buyer",
      "Weekly Strategy Calls",
      "Full CRM Funnel Automation",
    ],
  },

  // SEO Packages
  "local-seo": {
    name: "LOCAL SEO",
    price: 1800,
    features: [
      "Google Business Profile Optimization",
      "Local Citation Building",
      "15 Target Keywords",
      "Review Management Strategy",
      "Monthly Local Search Report",
    ],
  },
  "growth-seo": {
    name: "GROWTH SEO",
    price: 3200,
    features: [
      "Comprehensive On-Page SEO",
      "Technical Audit & Fixes",
      "35 Target Keywords",
      "High Authority Backlinks",
      "Monthly Traffic Analysis",
    ],
  },
  "authority-seo": {
    name: "AUTHORITY SEO",
    price: 5500,
    features: [
      "Full Website SEO Architecture",
      "Enterprise Keyword Strategy",
      "Premium Editorial Link Building",
      "Competitor Gap Analysis",
      "Dedicated SEO Strategist",
    ],
  },

  // Branding Packages
  "brand-starter": {
    name: "BRAND STARTER",
    price: 999,
    features: [
      "2 Logo Concepts",
      "Color Palette & Typography",
      "Business Card Design",
      "Social Media Profile Assets",
      "Basic Brand Guidelines",
    ],
  },
  "business-identity": {
    name: "BUSINESS IDENTITY",
    price: 1999,
    features: [
      "3 Custom Logo Concepts",
      "Comprehensive Brand Guidelines",
      "Stationery & Email Signatures",
      "Social Media Templates",
      "Brand Iconography Kit",
    ],
  },
  "complete-brand": {
    name: "COMPLETE BRAND",
    price: 3499,
    features: [
      "Full Visual Identity System",
      "Marketing Collateral Suite",
      "Presentation Deck Templates",
      "Packaging / Merch Guidelines",
      "Dedicated Creative Director",
    ],
  },
  "content-starter": {
    name: "CONTENT STARTER",
    price: 799,
    features: [
      "1 Content Shoot",
      "4 Reels / Short Videos",
      "10 Edited Photos",
      "Basic Video Editing",
      "Social Formats Delivery",
    ],
  },
  "content-growth": {
    name: "CONTENT GROWTH",
    price: 1499,
    features: [
      "2 Content Shoots",
      "8 Reels / Short Videos",
      "20 Edited Photos",
      "Creative Direction & Scripting",
      "Motion Graphics & Captions",
    ],
  },
  "content-pro": {
    name: "CONTENT PRO",
    price: 2999,
    features: [
      "4 Content Shoots",
      "16 Reels / Short Videos",
      "40 Edited High-Res Photos",
      "Drone Footage Included",
      "Advanced Color Grading & Sound",
    ],
  },
  "lead-starter": {
    name: "LEAD STARTER",
    price: 1299,
    features: [
      "1 Targeted Lead Campaign",
      "Custom Landing Page Setup",
      "Ad Copy & Creative Design",
      "CRM Lead Notification",
      "Monthly Lead Report",
    ],
  },
  "lead-growth": {
    name: "LEAD GROWTH",
    price: 2499,
    features: [
      "2 Cross-Platform Ad Campaigns",
      "Conversion Funnel Architecture",
      "Custom Landing Pages & Retargeting",
      "WhatsApp Automated Flow",
      "Bi-Weekly Lead Strategy",
    ],
  },
  "lead-scale": {
    name: "LEAD SCALE",
    price: 4999,
    features: [
      "Multi-Channel Enterprise Funnels",
      "Dedicated Media Buyer & Copywriter",
      "Advanced Audience Segmentation",
      "Continuous A/B Split Testing",
      "Weekly Conversion Optimization",
    ],
  },
  "growth-360": {
    name: "GROWTH 360",
    price: 8500,
    features: [
      "Full 360 Digital Marketing Suite",
      "Social Media + Video Production",
      "Meta & Google Ads Management",
      "SEO Architecture & Rank Tracking",
      "Dedicated Fractional CMO",
    ],
  },
};

export default function ClientPortalReviewPage() {
  // Zustand Store
  const {
    companyDetails,
    packageSelection,
    selectedAddonIds,
    isDarkMode,
    toggleDarkMode,
    isSubmitting,
    setIsSubmitting,
  } = useProposalStore();

  const [isSuccessModalOpen, setIsSuccessModalOpen] = React.useState(false);

  // Format delivery date
  const formattedDeliveryDate = React.useMemo(() => {
    if (!companyDetails.expectedDeliveryDate) return "15 Jan 2025";
    try {
      const date = new Date(companyDetails.expectedDeliveryDate);
      return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return companyDetails.expectedDeliveryDate;
    }
  }, [companyDetails.expectedDeliveryDate]);

  // Selected package details
  const packageInfo = React.useMemo(() => {
    if (packageSelection.ecommerce && PACKAGE_METADATA[packageSelection.ecommerce]) {
      return PACKAGE_METADATA[packageSelection.ecommerce];
    }
    if (packageSelection.tier && PACKAGE_METADATA[packageSelection.tier]) {
      return PACKAGE_METADATA[packageSelection.tier];
    }
    return PACKAGE_METADATA.professional;
  }, [packageSelection]);

  // Selected Add-ons list
  const selectedAddonsList = React.useMemo(() => {
    return ALL_ADDONS.filter((addon) => selectedAddonIds.includes(addon.id));
  }, [selectedAddonIds]);

  // Pricing calculations
  const packagePrice = packageInfo.price;
  const addonsTotal = React.useMemo(() => {
    return selectedAddonsList.reduce((sum, item) => sum + item.price, 0);
  }, [selectedAddonIds]);

  const subTotal = packagePrice + addonsTotal;
  const vatAmount = subTotal * 0.05;
  const grandTotal = subTotal + vatAmount;

  // Handle final proposal generation
  const handleGenerateProposal = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccessModalOpen(true);
    }, 500);
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

          {/* Step 3: Add-ons */}
          <Link
            href="/client-portal/add-ons"
            className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Add-ons</span>
          </Link>

          <span className="text-slate-600">›</span>

          {/* Step 4: Review (Active Dot) */}
          <div className="flex items-center gap-1.5 text-white font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00a3ff] shadow-[0_0_8px_#00a3ff]" />
            <span className="text-white">Review</span>
          </div>
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
              Review all prospect, package and add-on details before final submission.
            </p>
          </div>

          {/* ================================================================ */}
          {/* 3 CARDS: CLIENT DETAILS, SELECTED PACKAGE (HERO), ORDER SUMMARY    */}
          {/* ================================================================ */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
            {/* -------------------------------------------------------------- */}
            {/* CARD 1: CLIENT DETAILS                                         */}
            {/* -------------------------------------------------------------- */}
            <div className="rounded-2xl border border-[#162a4a] bg-[#0a1526] p-5 sm:p-6 shadow-lg flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-black tracking-wider uppercase text-white pb-3 border-b border-[#14233c] mb-4">
                  CLIENT DETAILS
                </h3>

                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      CLIENT NAME
                    </span>
                    <p className="font-semibold text-slate-200 mt-0.5">
                      {companyDetails.contactPerson || "Acme Corp"}
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      COMPANY NAME
                    </span>
                    <p className="font-semibold text-slate-200 mt-0.5">
                      {companyDetails.companyName || "Acme International Ltd"}
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      EMAIL
                    </span>
                    <p className="font-semibold text-slate-200 mt-0.5 break-all">
                      {companyDetails.emailAddress || "contact@acme.com"}
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      PHONE
                    </span>
                    <p className="font-semibold text-slate-200 mt-0.5">
                      {companyDetails.contactNumber || "+971 50 123 4567"}
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      LOCATION
                    </span>
                    <p className="font-semibold text-slate-200 mt-0.5">
                      {companyDetails.location || "Dubai, UAE"}
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      INDUSTRY
                    </span>
                    <p className="font-semibold text-slate-200 mt-0.5">
                      {companyDetails.industry || "Technology"}
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      SERVICES
                    </span>
                    <p className="font-semibold text-slate-200 mt-0.5">
                      {companyDetails.requiredServices || "Social Media + Video Production"}
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      EXPECTED DELIVERY
                    </span>
                    <p className="font-semibold text-slate-200 mt-0.5">
                      {formattedDeliveryDate}
                    </p>
                  </div>
                </div>
              </div>

              {/* Edit Details Button */}
              <div className="pt-5 mt-4 border-t border-[#14233c]">
                <Link
                  href="/client-portal/company-details"
                  className="w-full py-2.5 px-4 rounded-xl border border-sky-600/50 hover:border-sky-400 bg-sky-950/20 hover:bg-sky-900/40 text-sky-400 hover:text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Pencil className="w-3 h-3" />
                  <span>Edit Details</span>
                </Link>
              </div>
            </div>

            {/* -------------------------------------------------------------- */}
            {/* CARD 2: SELECTED PACKAGE (HERO WITH CYAN GLOW BORDER)          */}
            {/* -------------------------------------------------------------- */}
            <div className="rounded-2xl border-2 border-[#00a3ff] shadow-[0_0_25px_rgba(0,163,255,0.18)] bg-[#09172e] p-5 sm:p-6 flex flex-col justify-between relative overflow-hidden">
              <div>
                {/* Selected Package Header with Badge */}
                <div className="flex items-center justify-between pb-3 border-b border-[#142d54] mb-4">
                  <h3 className="text-xs font-black tracking-wider uppercase text-white">
                    SELECTED PACKAGE
                  </h3>
                  <span className="text-[10px] font-bold text-sky-400 bg-sky-950/80 px-2 py-0.5 rounded border border-sky-500/30">
                    &lt; &gt;
                  </span>
                </div>

                {/* Package Name & Price */}
                <div className="text-center py-2 space-y-1">
                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase">
                    {packageInfo.name}
                  </h2>
                  <div className="text-2xl sm:text-3xl font-black text-[#00a3ff] font-mono tracking-tight">
                    AED {packagePrice.toLocaleString()}
                  </div>
                </div>

                {/* Deliverables Feature List */}
                <div className="space-y-2.5 pt-4 text-xs">
                  {packageInfo.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 text-slate-200">
                      <Check className="w-4 h-4 text-[#00a3ff] stroke-[3] shrink-0" />
                      <span className="font-medium text-slate-200">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Edit Package Button */}
              <div className="pt-5 mt-4 border-t border-[#142d54]">
                <Link
                  href="/client-portal/packages"
                  className="w-full py-2.5 px-4 rounded-xl border border-[#00a3ff]/80 hover:border-[#00a3ff] bg-sky-500/10 hover:bg-sky-500/25 text-[#00a3ff] hover:text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Pencil className="w-3 h-3" />
                  <span>Edit Package</span>
                </Link>
              </div>
            </div>

            {/* -------------------------------------------------------------- */}
            {/* CARD 3: ORDER SUMMARY                                          */}
            {/* -------------------------------------------------------------- */}
            <div className="rounded-2xl border border-[#162a4a] bg-[#0a1526] p-5 sm:p-6 shadow-lg flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-black tracking-wider uppercase text-white pb-3 border-b border-[#14233c] mb-4">
                  ORDER SUMMARY
                </h3>

                {/* Package Line */}
                <div className="space-y-1 text-xs mb-3">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    PACKAGE
                  </span>
                  <div className="flex justify-between items-center text-slate-200">
                    <span className="font-bold">{packageInfo.name}</span>
                    <span className="font-mono font-bold text-white">
                      AED {packagePrice.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="border-t border-[#14233c] my-3" />

                {/* Breakdown List */}
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center text-slate-400">
                    <span>Package Base:</span>
                    <span className="font-mono text-slate-200">
                      AED {packagePrice.toLocaleString()}
                    </span>
                  </div>

                  {selectedAddonsList.map((addon) => (
                    <div
                      key={addon.id}
                      className="flex justify-between items-center text-slate-400"
                    >
                      <span className="truncate pr-2">{addon.name}:</span>
                      <span className="font-mono text-slate-200 shrink-0">
                        AED {addon.price.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-[#14233c] my-3" />

                {/* Sub Total & VAT */}
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between items-center text-slate-400">
                    <span>Sub Total:</span>
                    <span className="font-mono text-slate-200">
                      AED {subTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-slate-400">
                    <span>VAT (5%):</span>
                    <span className="font-mono text-slate-200">
                      AED {vatAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                <div className="border-t border-[#14233c] my-3" />

                {/* Grand Total */}
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-slate-400">Total:</span>
                  <div className="text-2xl font-black text-[#00a3ff] font-mono tracking-tight">
                    AED {grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
              </div>

              {/* Edit Add-ons Button */}
              <div className="pt-5 mt-4 border-t border-[#14233c]">
                <Link
                  href="/client-portal/add-ons"
                  className="w-full py-2.5 px-4 rounded-xl border border-sky-600/50 hover:border-sky-400 bg-sky-950/20 hover:bg-sky-900/40 text-sky-400 hover:text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Pencil className="w-3 h-3" />
                  <span>Edit Add-ons</span>
                </Link>
              </div>
            </div>
          </div>

          {/* ================================================================ */}
          {/* BOTTOM ACTIONS BAR                                               */}
          {/* ================================================================ */}
          <div className="pt-4 flex items-center justify-between border-t border-[#14233e]">
            {/* Back Button */}
            <Link
              href="/client-portal/add-ons"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#182f54] hover:border-slate-500 bg-[#0a1628] hover:bg-[#0d1c33] text-slate-300 hover:text-white text-xs font-semibold transition-all cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </Link>

            {/* Generate Proposal / Submit Button */}
            <button
              type="button"
              onClick={handleGenerateProposal}
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-[#00a3ff] hover:bg-[#0092e0] active:bg-[#0080e0] text-white font-bold text-xs sm:text-sm shadow-lg shadow-sky-500/25 transition-all cursor-pointer disabled:opacity-50"
            >
              <span>
                {isSubmitting ? "Generating Proposal..." : "Send For Proposal"}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* SUCCESS CONFIRMATION MODAL                                           */}
      {/* ==================================================================== */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#071120] border border-[#14233e] rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative space-y-6 text-center text-white">
            <button
              onClick={() => setIsSuccessModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Glowing Icon */}
            <div className="w-16 h-16 rounded-full bg-[#00a3ff] flex items-center justify-center mx-auto shadow-lg shadow-sky-500/30">
              <Check className="w-8 h-8 text-white stroke-[3]" />
            </div>

            {/* Modal Heading */}
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-white">
                Proposal Generated Successfully!
              </h3>
              <p className="text-xs sm:text-sm text-slate-300">
                The proposal for{" "}
                <span className="text-sky-400 font-bold">
                  {companyDetails.companyName || "Acme International Ltd"}
                </span>{" "}
                has been generated and compiled into official proposal format.
              </p>
            </div>

            {/* Proposal Details Box */}
            <div className="bg-[#091527] border border-[#172b4c] rounded-2xl p-4 text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Proposal ID:</span>
                <span className="font-mono text-cyan-400 font-bold">#PROP-2026-9842</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Selected Tier:</span>
                <span className="font-semibold text-white">{packageInfo.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Total Investment:</span>
                <span className="font-bold text-sky-400 font-mono">
                  AED {grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  window.print();
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-[#00a3ff] hover:bg-[#0092e0] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-sky-500/25 transition cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download / Print PDF</span>
              </button>

              <Link
                href="/dashboard/leads"
                className="flex-1 py-3 px-4 rounded-xl border border-slate-700 hover:border-slate-600 bg-slate-800/80 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition"
              >
                <FileText className="w-4 h-4" />
                <span>Back to Leads</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
