"use client";

import * as React from "react";
import Link from "next/link";
import {
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Sun,
  Moon,
  Pencil,
  Star,
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
    name: "BASIC WEBSITE",
    price: 799,
    features: [
      "1-3 Responsive Pages",
      "Mobile Optimized",
      "Contact Form",
      "Standard Speed Setup",
      "Basic SEO Meta",
    ],
  },
  starter: {
    name: "STARTER WEBSITE",
    price: 1499,
    features: [
      "Up to 5 Pages",
      "Custom Modern Design",
      "WhatsApp & Social Links",
      "Basic Admin Panel",
      "Analytics Integration",
    ],
  },
  business: {
    name: "BUSINESS WEBSITE",
    price: 2499,
    features: [
      "Up to 10 Pages",
      "Custom UI/UX Experience",
      "Dynamic Blog / News",
      "Lead Capture Forms",
      "Speed & Security Optimization",
    ],
  },
  professional: {
    name: "PROFESSIONAL",
    price: 5500,
    features: [
      "Social Media design",
      "6 Creative posts",
      "Basic Branding",
      "Monthly Support",
      "Video Production",
    ],
  },
  premium: {
    name: "PREMIUM WEBSITE",
    price: 6999,
    features: [
      "20+ Bespoke Pages",
      "Full Custom Animation",
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
      "Bi-Weekly Optimization",
    ],
  },
  "lead-growth": {
    name: "LEAD GROWTH",
    price: 2499,
    features: [
      "Multi-Channel Lead Campaigns",
      "High Converting Landing Page",
      "A/B Split Testing",
      "Automated WhatsApp & Email Follow-up",
      "Weekly Performance Review",
    ],
  },
  "lead-scale": {
    name: "LEAD SCALE",
    price: 4999,
    features: [
      "Enterprise Lead Generation Strategy",
      "Custom Interactive Funnels",
      "Full API & CRM Integration",
      "Advanced Audience Retargeting",
      "Dedicated Growth Manager",
    ],
  },
  "growth-360": {
    name: "GROWTH 360",
    price: 8500,
    features: [
      "Full Funnel Digital Marketing",
      "Complete Brand Content Production",
      "Organic SEO & Search Dominance",
      "Conversion Rate Optimization",
      "Executive Growth Dashboard",
    ],
  },
};

export default function ClientPortalReviewPage() {
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

  // Format delivery date nicely
  const formattedDeliveryDate = React.useMemo(() => {
    if (!companyDetails.expectedDeliveryDate) return "23 Jun 2027";
    try {
      const d = new Date(companyDetails.expectedDeliveryDate);
      if (isNaN(d.getTime())) return companyDetails.expectedDeliveryDate;
      return d.toLocaleDateString("en-GB", {
        day: "numeric",
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
  }, [selectedAddonsList]);
  const grandTotal = packagePrice + addonsTotal;

  // Handle final proposal generation
  const handleGenerateProposal = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccessModalOpen(true);
    }, 600);
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

        {/* Center Breadcrumb Stepper */}
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

          {/* Step 3: Add-ons */}
          <Link
            href="/client-portal/add-ons"
            className="flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 transition-colors font-medium px-2 py-0.5"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Add-ons</span>
          </Link>

          <span className="text-slate-600 px-1 font-bold">›</span>

          {/* Step 4: Review (Active) */}
          <div className="flex items-center gap-1.5 text-white font-bold bg-[#00a6ff] px-3.5 py-1 rounded-full shadow-md shadow-sky-500/25">
            <span className="w-4 h-4 rounded-full bg-white text-[#00a6ff] text-[10px] flex items-center justify-center font-black">
              4
            </span>
            <span>Review</span>
          </div>
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
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Dark Container enclosing the Review Cards */}
        <div className="bg-[#071120] border border-[#14233e] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-7">
          {/* Header Title & Subtitle */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Review & Confirm
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Check your package, add-ons, and total before submission.
            </p>
          </div>

          {/* ================================================================ */}
          {/* 3 WHITE CARDS: CLIENT DETAILS, SELECTED PACKAGE, ORDER SUMMARY    */}
          {/* ================================================================ */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {/* -------------------------------------------------------------- */}
            {/* CARD 1: CLIENT DETAILS                                         */}
            {/* -------------------------------------------------------------- */}
            <div className="rounded-2xl overflow-hidden border border-[#162744] shadow-xl flex flex-col bg-white">
              {/* Cyan Header */}
              <div className="bg-[#0099e6] px-5 py-3 text-white font-black text-xs tracking-wider uppercase">
                CLIENT DETAILS
              </div>

              {/* Body */}
              <div className="p-5 flex-1 flex flex-col justify-between text-xs text-slate-700 space-y-4">
                <div className="space-y-2.5">
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-slate-400 font-medium">Company</span>
                    <span className="font-bold text-slate-900 text-right">
                      {companyDetails.companyName || "ABC Technologies"}
                    </span>
                  </div>

                  <div className="flex justify-between items-start gap-2">
                    <span className="text-slate-400 font-medium">Contact Person</span>
                    <span className="font-semibold text-slate-800 text-right">
                      {companyDetails.contactPerson || "Dhasarath kp"}
                    </span>
                  </div>

                  <div className="flex justify-between items-start gap-2">
                    <span className="text-slate-400 font-medium">Contact Number</span>
                    <span className="font-semibold text-slate-800 text-right">
                      {companyDetails.contactNumber || "+971 14 222222"}
                    </span>
                  </div>

                  <div className="flex justify-between items-start gap-2">
                    <span className="text-slate-400 font-medium">Email Address</span>
                    <span className="font-semibold text-slate-800 text-right break-all">
                      {companyDetails.emailAddress || "info@abctechnologies.com"}
                    </span>
                  </div>

                  <div className="flex justify-between items-start gap-2">
                    <span className="text-slate-400 font-medium">Location</span>
                    <span className="font-semibold text-slate-800 text-right">
                      {companyDetails.location || "Dubai, UAE"}
                    </span>
                  </div>

                  <div className="flex justify-between items-start gap-2">
                    <span className="text-slate-400 font-medium">Industry</span>
                    <span className="font-semibold text-slate-800 text-right">
                      {companyDetails.industry || "Real Estate"}
                    </span>
                  </div>

                  {/* Project Description */}
                  <div className="pt-2 border-t border-slate-100">
                    <span className="text-slate-400 font-medium block mb-1">
                      Project Description
                    </span>
                    <p className="text-[11px] text-slate-600 line-clamp-3 leading-relaxed">
                      {companyDetails.projectDescription ||
                        "Donec ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis lectus. Sed dignissim, metus nec fringilla accumsan."}
                    </p>
                  </div>

                  {/* Expected Delivery Date */}
                  <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                    <span className="text-slate-400 font-medium">
                      Expected Delivery Date
                    </span>
                    <span className="font-bold text-slate-900">
                      {formattedDeliveryDate}
                    </span>
                  </div>
                </div>

                {/* Edit Button */}
                <div className="pt-3">
                  <Link
                    href="/client-portal/company-details"
                    className="w-full py-2.5 px-4 rounded-xl border border-sky-400/80 hover:border-sky-500 text-[#0088cc] hover:bg-sky-50/70 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Pencil className="w-3 h-3" />
                    <span>Edit Details</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* -------------------------------------------------------------- */}
            {/* CARD 2: SELECTED PACKAGE                                       */}
            {/* -------------------------------------------------------------- */}
            <div className="rounded-2xl overflow-hidden border border-[#162744] shadow-xl flex flex-col bg-white">
              {/* Cyan Header with Star */}
              <div className="bg-[#0099e6] px-5 py-3 text-white font-black text-xs tracking-wider uppercase flex items-center justify-between">
                <span>SELECTED PACKAGE</span>
                <Star className="w-4 h-4 fill-amber-300 text-amber-300" />
              </div>

              {/* Body */}
              <div className="p-6 flex-1 flex flex-col justify-between items-center text-center space-y-6">
                <div className="space-y-4 w-full">
                  {/* Package Title & Price */}
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight uppercase">
                      {packageInfo.name}
                    </h2>
                    <p className="text-lg sm:text-xl font-black text-[#00a6ff] mt-1">
                      AED {packagePrice.toLocaleString()}
                    </p>
                  </div>

                  {/* Features Deliverable List */}
                  <div className="space-y-2.5 pt-2 text-left w-full max-w-xs mx-auto text-xs text-slate-700">
                    {packageInfo.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2.5">
                        <Check className="w-4 h-4 text-[#00a6ff] stroke-[3] shrink-0" />
                        <span className="font-medium text-slate-800">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Edit Button */}
                <div className="w-full pt-3">
                  <Link
                    href="/client-portal/packages"
                    className="w-full py-2.5 px-4 rounded-xl border border-sky-400/80 hover:border-sky-500 text-[#0088cc] hover:bg-sky-50/70 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Pencil className="w-3 h-3" />
                    <span>Edit Package</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* -------------------------------------------------------------- */}
            {/* CARD 3: ORDER SUMMARY                                          */}
            {/* -------------------------------------------------------------- */}
            <div className="rounded-2xl overflow-hidden border border-[#162744] shadow-xl flex flex-col bg-white">
              {/* Cyan Header */}
              <div className="bg-[#0099e6] px-5 py-3 text-white font-black text-xs tracking-wider uppercase">
                ORDER SUMMARY
              </div>

              {/* Body */}
              <div className="p-5 flex-1 flex flex-col justify-between text-xs text-slate-700 space-y-4">
                <div className="space-y-2.5">
                  <div className="space-y-0.5">
                    <span className="text-[11px] text-slate-400 font-medium">Company</span>
                    <p className="font-bold text-slate-900">
                      {companyDetails.companyName || "ABC Technologies"}
                    </p>
                  </div>

                  <div className="space-y-0.5">
                    <span className="text-[11px] text-slate-400 font-medium">Selected Package</span>
                    <p className="font-semibold text-slate-800">
                      {packageInfo.name}
                    </p>
                  </div>

                  <div className="flex justify-between items-center pt-1 font-semibold">
                    <span className="text-slate-800">Package Price</span>
                    <span className="font-bold text-slate-900">
                      AED {packagePrice.toLocaleString()}
                    </span>
                  </div>

                  {/* Add-ons List */}
                  <div className="pt-2 border-t border-slate-100 space-y-1.5">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
                      Add-ons:
                    </span>
                    {selectedAddonsList.length > 0 ? (
                      selectedAddonsList.map((addon) => (
                        <div
                          key={addon.id}
                          className="flex justify-between items-center text-slate-600"
                        >
                          <span className="truncate pr-2">{addon.name}</span>
                          <span className="font-semibold text-slate-800 shrink-0">
                            AED {addon.price.toLocaleString()}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-slate-400 italic text-[11px]">No add-ons selected</p>
                    )}
                  </div>

                  {/* Add-ons Total */}
                  <div className="flex justify-between items-center pt-2 border-t border-slate-100 font-bold">
                    <span className="text-slate-800">Add-ons Total</span>
                    <span className="text-slate-900">
                      AED {addonsTotal.toLocaleString()}
                    </span>
                  </div>

                  {/* TOTAL */}
                  <div className="flex justify-between items-baseline pt-3 border-t border-slate-100">
                    <span className="font-black text-slate-900 text-sm tracking-wider">
                      TOTAL:
                    </span>
                    <span className="text-2xl font-black text-[#00a6ff]">
                      AED {grandTotal.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Edit Button */}
                <div className="pt-3">
                  <Link
                    href="/client-portal/add-ons"
                    className="w-full py-2.5 px-4 rounded-xl border border-sky-400/80 hover:border-sky-500 text-[#0088cc] hover:bg-sky-50/70 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Pencil className="w-3 h-3" />
                    <span>Edit Add-ons</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* ================================================================ */}
          {/* BOTTOM ACTIONS BAR                                               */}
          {/* ================================================================ */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#14233e]">
            {/* Back Button */}
            <Link
              href="/client-portal/add-ons"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0d1b2e] hover:bg-[#132742] text-slate-300 hover:text-white border border-[#1c3256] text-xs font-semibold transition-all cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </Link>

            {/* Generate Proposal / Submit Button */}
            <button
              onClick={handleGenerateProposal}
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[#00a6ff] hover:bg-[#0092e0] text-white font-bold text-sm shadow-lg shadow-sky-500/25 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            >
              <span>
                {isSubmitting ? "Generating Proposal..." : "Generate Proposal / Submit"}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#071120] border border-[#14233e] rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative space-y-6 text-center text-white">
            <button
              onClick={() => setIsSuccessModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Glowing Icon */}
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-sky-500 to-cyan-400 flex items-center justify-center mx-auto shadow-lg shadow-sky-500/30">
              <Check className="w-8 h-8 text-white stroke-[3]" />
            </div>

            {/* Modal Heading */}
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-white">
                Proposal Generated Successfully!
              </h3>
              <p className="text-sm text-slate-300">
                The proposal for{" "}
                <span className="text-sky-400 font-bold">
                  {companyDetails.companyName || "ABC Technologies"}
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
                <span className="font-bold text-sky-400">
                  AED {grandTotal.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => {
                  alert("Downloading Proposal PDF...");
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-sky-500/25 transition cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF</span>
              </button>

              <Link
                href="/dashboard"
                className="flex-1 py-3 px-4 rounded-xl border border-slate-700 hover:border-slate-600 bg-slate-800/80 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition"
              >
                <FileText className="w-4 h-4" />
                <span>Back to Dashboard</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
