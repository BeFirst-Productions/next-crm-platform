"use client";

import * as React from "react";
import Link from "next/link";

import {
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Pencil,
  Check,
  X,
  Save,
  Loader2,
  AlertCircle,
  Eye,
  Download,
} from "lucide-react";
import { useProposalStore, ALL_ADDONS } from "@/stores";
import { ProposalDeckView, ProposalDeckData } from "@/components/proposal/ProposalDeckView";
import {
  fetchPackages,
  fetchAddons,
  fetchCategories,
  saveClientProposal,
  type PackageItem,

  type AddonItem,
  type ServiceCategory,
  type SavedProposalResult,
  type SaveClientProposalPayload,
} from "@/lib/catalog-api";

// Map package tiers to their display name, price, and deliverable features
interface PackageMeta {
  id?: string;
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
    price: 799,
    features: [
      "Google Business Profile Optimisation",
      "Local Keyword Research",
      "On-Page SEO",
      "Basic Technical SEO",
      "Local Citation Strategy",
      "Google Maps Optimisation",
      "Monthly Ranking Monitoring",
      "Monthly Report",
    ],
  },
  "growth-seo": {
    name: "GROWTH SEO",
    price: 1499,
    features: [
      "Everything in LOCAL SEO",
      "Advanced Keyword Research",
      "Technical SEO",
      "On-Page Optimisation",
      "Content Optimisation",
      "Internal Linking",
      "Competitor SEO Analysis",
      "Local SEO",
      "Google Business Profile Management",
      "Monthly SEO Strategy",
      "Ranking Monitoring",
      "Monthly SEO Report",
    ],
  },
  "authority-seo": {
    name: "AUTHORITY SEO",
    price: 2499,
    features: [
      "Everything in GROWTH SEO",
      "Advanced Technical SEO",
      "High-value Keyword Strategy",
      "Content Strategy",
      "Competitor Gap Analysis",
      "Backlink Strategy",
      "Advanced Local SEO",
      "Conversion-Focused SEO",
      "Schema Optimisation",
      "Monthly SEO Consultation",
      "Detailed SEO Dashboard",
    ],
  },

  // Branding Packages
  "brand-starter": {
    name: "BRAND STARTER",
    price: 999,
    features: [
      "Logo Design",
      "2 Logo Concepts",
      "Colour Palette",
      "Typography Selection",
      "Business Card Design",
      "Social Media Profile Setup",
      "Basic Brand Guide",
    ],
  },
  "business-identity": {
    name: "BUSINESS IDENTITY",
    price: 1999,
    features: [
      "Everything in BRAND STARTER",
      "4 Logo Concepts",
      "Logo Variations",
      "Complete Colour System",
      "Typography System",
      "Business Card",
      "Letterhead",
      "Email Signature",
      "Social Media Templates",
      "Brand Guidelines",
      "Brand Presentation",
    ],
  },
  "complete-brand": {
    name: "COMPLETE BRAND",
    price: 3499,
    features: [
      "Everything in BUSINESS IDENTITY",
      "Advanced Logo System",
      "Brand Guidelines",
      "Stationery Package",
      "Social Media Brand Kit",
      "Marketing Templates",
      "Presentation Template",
      "Corporate Profile Design",
      "Advertisement Templates",
      "Brand Application Examples",
      "Complete Brand Assets Package",
    ],
  },
  "content-starter": {
    name: "CONTENT STARTER",
    price: 799,
    features: [
      "1 Content Shoot",
      "4 Reels",
      "10 Edited Photos",
      "Basic Video Editing",
      "Social Media Formats",
      "Basic Creative Direction",
    ],
  },
  "content-growth": {
    name: "CONTENT GROWTH",
    price: 1499,
    features: [
      "2 Content Shoots",
      "8 Reels",
      "20 Edited Photos",
      "Creative Direction",
      "Script / Concept Planning",
      "Professional Editing",
      "Motion Graphics",
      "Social Media Formats",
      "Content Calendar",
    ],
  },
  "content-pro": {
    name: "CONTENT PRO",
    price: 2499,
    features: [
      "4 Content Shoots",
      "12 Reels",
      "40 Edited Photos",
      "Advanced Video Production",
      "Creative Direction",
      "Script Development",
      "Motion Graphics",
      "Product / Brand Videos",
      "Professional Editing",
      "Content Strategy",
      "Multiple Social Formats",
    ],
  },
  "lead-starter": {
    name: "LEAD STARTER",
    price: 1499,
    features: [
      "Meta Ads Management",
      "1 Lead Generation Campaign",
      "Audience Targeting",
      "Ad Creative Strategy",
      "Lead Form Setup",
      "WhatsApp Integration",
      "Basic Conversion Tracking",
      "Monthly Optimisation",
      "Lead Report",
    ],
  },
  "lead-growth": {
    name: "LEAD GROWTH",
    price: 2499,
    features: [
      "Everything in LEAD STARTER",
      "Meta Ads",
      "Google Ads",
      "Multiple Campaigns",
      "Retargeting",
      "Landing Page Strategy",
      "Lead Form Optimisation",
      "WhatsApp Lead Flow",
      "Conversion Tracking",
      "A/B Testing",
      "Campaign Optimisation",
      "Detailed Lead Report",
    ],
  },
  "lead-scale": {
    name: "LEAD SCALE",
    price: 3999,
    features: [
      "Everything in LEAD GROWTH",
      "Advanced Meta Campaigns",
      "Advanced Google Campaigns",
      "Multiple Funnels",
      "Retargeting & Remarketing",
      "Landing Page Optimisation",
      "Conversion Rate Optimisation",
      "Advanced Audience Segmentation",
      "Lead Quality Tracking",
      "Campaign A/B Testing",
      "Advanced Analytics",
      "Weekly Optimisation",
      "Strategy Consultation",
    ],
  },
  "growth-360": {
    name: "GROWTH 360",
    price: 4999,
    features: [
      "Digital Marketing",
      "Social Media Management",
      "16 Premium Creatives",
      "12 Reels",
      "Meta Ads Management",
      "Google Ads Management",
      "Lead Generation",
      "SEO Management",
      "Google Business Profile",
      "Content Strategy",
      "Competitor Analysis",
      "Monthly Marketing Strategy",
      "Conversion Strategy",
      "Monthly Performance Report",
      "Dedicated Account Manager",
      "Monthly Strategy Meeting",
    ],
  },

  // Video Production Packages
  "video-starter": {
    name: "REELS & SHORTS STARTER",
    price: 999,
    features: [
      "1 On-location Shoot Day",
      "6 Edited Reels / TikTok Videos",
      "Concept & Script Ideation",
      "Sound Design & Viral Audio",
      "Dynamic Captions & Subtitles",
      "1080p / 4K UHD Output",
      "1 Round of Revisions per Reel",
    ],
  },
  "video-growth": {
    name: "COMMERCIAL & BRAND GROWTH",
    price: 2499,
    features: [
      "2 On-location Shoot Days",
      "12 Edited Reels / Short Videos",
      "1 High-End Brand Promo (60s)",
      "Professional Lighting & Audio Rig",
      "Creative Director & Scriptwriter",
      "Drone Aerial Footage Included",
      "Color Grading & Sound Mastering",
      "Thumbnail & Cover Designs",
    ],
  },
  "video-pro": {
    name: "CINEMATIC ENTERPRISE SUITE",
    price: 4999,
    features: [
      "Full Production Crew & Dedicated DP",
      "20 Edited Reels / Short Videos",
      "2 Full Brand Films / TV Commercials",
      "Voiceover Recording & Licensing",
      "Cinema Camera 6K RAW Capture",
      "2D Motion Graphics & Animation",
      "Dedicated Video Editor & Colorist",
      "Multi-platform Formats (16:9, 9:16, 1:1)",
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
    setIsSaved,
  } = useProposalStore();

  const [isSuccessModalOpen, setIsSuccessModalOpen] = React.useState(false);

  // Backend packages & addons integration
  const [dbPackages, setDbPackages] = React.useState<PackageItem[]>([]);
  const [dbAddons, setDbAddons] = React.useState<AddonItem[]>([]);
  const [dbCategories, setDbCategories] = React.useState<ServiceCategory[]>([]);

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

  // Format delivery date
  const formattedDeliveryDate = React.useMemo(() => {
    if (!companyDetails.expectedDeliveryDate) return undefined;
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

  // Active category derived directly from proposalStore packageSelection.category
  const activeCategory = React.useMemo(() => {
    const storeCat = packageSelection.category;

    if (storeCat) {
      const directMatch = dbCategories.find((c) => c.id === storeCat);
      if (directMatch) return directMatch;

      const nameMatch = dbCategories.find(
        (c) => c.name.toLowerCase() === storeCat.toLowerCase()
      );
      if (nameMatch) return nameMatch;

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

  // Selected package details dynamically resolved from DB matching active category
  const packageInfo = React.useMemo(() => {
    const targetKey = (
      packageSelection.ecommerce ||
      packageSelection.tier ||
      "professional"
    ).toLowerCase();

    const activeCatId = activeCategory?.id;
    const activeCatName = activeCategory?.name?.toLowerCase() || "";

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

    if (pool.length > 0) {
      const match =
        pool.find((p) => {
          const id = p.id.toLowerCase();
          const name = p.name.toLowerCase();
          return id === targetKey || id === `pkg-${targetKey}` || name === targetKey;
        }) ||
        pool.find((p) => {
          const id = p.id.toLowerCase();
          const name = p.name.toLowerCase();
          const parts = id.replace("pkg-", "").split("-");
          return parts.includes(targetKey) || id.endsWith(`-${targetKey}`) || name.includes(targetKey);
        }) ||
        pool.find((p) => p.id.toLowerCase().includes(targetKey));

      if (match) {
        const feats =
          match.features && match.features.length > 0
            ? match.features.filter((f) => f.included).map((f) => f.featureName)
            : PACKAGE_METADATA[targetKey]?.features || [];

        return {
          id: match.id,
          name: match.name,
          price: Number(match.price) || 0,
          features: feats,
        };
      }
    }

    if (packageSelection.ecommerce && PACKAGE_METADATA[packageSelection.ecommerce]) {
      return PACKAGE_METADATA[packageSelection.ecommerce];
    }
    if (packageSelection.tier && PACKAGE_METADATA[packageSelection.tier]) {
      return PACKAGE_METADATA[packageSelection.tier];
    }
    return PACKAGE_METADATA.professional;
  }, [packageSelection, dbPackages, activeCategory]);

  // Selected Add-ons list dynamically resolved from DB (matching active package category)
  const selectedAddonsList = React.useMemo(() => {
    // Legacy mock add-on IDs that should never be shown unless explicitly supported
    const legacyMockAddonIds = new Set([
      "regular-content",
      "social-video",
      "photo-shoot",
      "technical-consultation",
      "photography",
      "social-posts",
      "drone-shoot",
      "extra-videos",
    ]);

    const activeCatId = activeCategory?.id;

    return selectedAddonIds
      .filter((id) => !legacyMockAddonIds.has(id))
      .map((id) => {
        const dbMatch = dbAddons.find((a) => a.id === id);
        if (dbMatch) {
          if (activeCatId && dbMatch.categoryId && dbMatch.categoryId !== activeCatId) {
            return null;
          }
          return {
            id: dbMatch.id,
            name: dbMatch.name,
            price: Number(dbMatch.price) || 0,
          };
        }
        const staticMatch = ALL_ADDONS.find((a) => a.id === id);
        if (staticMatch) {
          return {
            id: staticMatch.id,
            name: staticMatch.name,
            price: staticMatch.price,
          };
        }
        return null;
      })
      .filter(Boolean) as { id: string; name: string; price: number }[];
  }, [selectedAddonIds, dbAddons, activeCategory]);

  // Pricing calculations
  const packagePrice = packageInfo.price;
  const addonsTotal = React.useMemo(() => {
    return selectedAddonsList.reduce((sum, item) => sum + item.price, 0);
  }, [selectedAddonsList]);

  const subTotal = packagePrice + addonsTotal;
  const vatAmount = subTotal * 0.05;
  const grandTotal = subTotal + vatAmount;

  const [savedProposal, setSavedProposal] = React.useState<SavedProposalResult | null>(null);
  const [saveSuccessNotice, setSaveSuccessNotice] = React.useState<string | null>(null);
  const [saveError, setSaveError] = React.useState<string | null>(null);
  const [isPreviewDeckOpen, setIsPreviewDeckOpen] = React.useState(false);

  const proposalDeckData: ProposalDeckData = React.useMemo(() => ({
    clientName: companyDetails.contactPerson || "Client",
    companyName: companyDetails.companyName || "Client Company",
    email: companyDetails.emailAddress || "info@client.com",
    phone: companyDetails.contactNumber || "—",
    location: companyDetails.location || "UAE",
    industry: companyDetails.industry || "General",
    packageName: packageInfo.name,
    packagePrice: packagePrice,
    packageFeatures: packageInfo.features,
    selectedAddons: selectedAddonsList,
    subTotal,
    vatAmount,
    grandTotal,
    proposalNumber: savedProposal?.proposalNumber || "PROP-2026-0001",
    proposalDate: new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    expectedDeliveryDate: formattedDeliveryDate || undefined,
    projectDescription: companyDetails.projectDescription,
    additionalNotes: companyDetails.additionalNotes,
    serviceCategory: activeCategory?.name || packageSelection.category || "Website Development",
  }), [
    companyDetails,
    packageInfo,
    packagePrice,
    selectedAddonsList,
    subTotal,
    vatAmount,
    grandTotal,
    savedProposal,
    formattedDeliveryDate,
    activeCategory,
    packageSelection.category,
  ]);


  // Handle saving proposal to database (DRAFT or SUBMITTED)
  const handleSaveProposal = async (status: "DRAFT" | "SUBMITTED" = "DRAFT") => {
    setIsSubmitting(true);
    setSaveError(null);
    setSaveSuccessNotice(null);

    try {
      const payload: SaveClientProposalPayload = {
        companyDetails: {
          companyName: companyDetails.companyName || "Client Proposal Prospect",
          contactPerson: companyDetails.contactPerson || "Lead Contact",
          emailAddress: companyDetails.emailAddress || undefined,
          contactNumber: companyDetails.contactNumber || undefined,
          location: companyDetails.location || undefined,
          industry: companyDetails.industry || undefined,
          requiredServices: companyDetails.requiredServices || undefined,
          expectedDeliveryDate: companyDetails.expectedDeliveryDate || undefined,
          projectDescription: companyDetails.projectDescription || undefined,
          additionalNotes: companyDetails.additionalNotes || undefined,
        },
        packageSelection: {
          category: packageSelection.category,
          tier: packageSelection.tier,
          ecommerce: packageSelection.ecommerce,
        },
        packageId: packageInfo.id,
        packageName: packageInfo.name,
        packagePrice: packageInfo.price,
        selectedAddons: selectedAddonsList.map((a) => ({
          id: a.id,
          name: a.name,
          price: a.price,
        })),
        subTotal,
        vatAmount,
        grandTotal,
        status,
        notes: companyDetails.additionalNotes || undefined,
      };

      const result = await saveClientProposal(payload);
      setSavedProposal(result);
      setIsSaved(true);

      if (status === "SUBMITTED") {
        setIsSuccessModalOpen(true);
      } else {
        setSaveSuccessNotice(
          `Proposal saved successfully to the database! Proposal Number: #${result.proposalNumber}`
        );
      }
    } catch (err: any) {
      console.error("Failed to save proposal:", err);
      setSaveError(err.message || "Failed to save proposal to the database. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Enhance Your Package
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Review all prospect, package and add-on details before final submission.
              </p>
            </div>

            {/* Action button: View Full 24-Page Official Proposal Deck */}
            <button
              type="button"
              onClick={() => setIsPreviewDeckOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-sky-400/60 bg-sky-950/40 hover:bg-sky-900/60 text-sky-300 hover:text-white font-bold text-xs shadow-lg transition-all cursor-pointer"
            >
              <Eye className="w-4 h-4 text-sky-400" />
              <span>Preview Official Proposal Deck (24 Pages)</span>
            </button>
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

                {/* Items Breakdown */}
                <div className="space-y-3.5 text-xs">
                  {/* Selected Package */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      PACKAGE
                    </span>
                    <div className="flex justify-between items-center text-slate-200">
                      <span className="font-bold text-white uppercase">{packageInfo.name}</span>
                      <span className="font-mono font-bold text-white">
                        AED {packagePrice.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-[#14233c]" />

                  {/* Selected Add-ons (only show if any selected) */}
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
                            className="flex justify-between items-center text-slate-300"
                          >
                            <span className="truncate pr-2 font-medium">{addon.name}</span>
                            <span className="font-mono text-slate-200 shrink-0">
                              AED {addon.price.toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="border-t border-[#14233c] my-3.5" />

                {/* Sub Total & VAT */}
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between items-center text-slate-400">
                    <span>Sub Total:</span>
                    <span className="font-mono text-slate-200">
                      AED {subTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-slate-400">
                    <span>VAT (5%):</span>
                    <span className="font-mono text-slate-200">
                      AED {vatAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                <div className="border-t border-[#14233c] my-3.5" />

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
          {/* FEEDBACK NOTICES (SUCCESS OR ERROR)                              */}
          {/* ================================================================ */}
          {saveSuccessNotice && (
            <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs flex items-center justify-between shadow-lg animate-in fade-in duration-200">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-semibold text-emerald-200">{saveSuccessNotice}</span>
              </div>
              <button
                onClick={() => setSaveSuccessNotice(null)}
                className="text-emerald-400 hover:text-white p-1 rounded-full hover:bg-emerald-900/50 transition cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {saveError && (
            <div className="p-4 rounded-2xl bg-rose-950/60 border border-rose-500/40 text-rose-200 text-xs flex items-center justify-between shadow-lg animate-in fade-in duration-200">
              <div className="flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span className="font-semibold text-rose-200">{saveError}</span>
              </div>
              <button
                onClick={() => setSaveError(null)}
                className="text-rose-400 hover:text-white p-1 rounded-full hover:bg-rose-900/50 transition cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* ================================================================ */}
          {/* BOTTOM ACTIONS BAR                                               */}
          {/* ================================================================ */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#14233e]">
            {/* Back Button */}
            <Link
              href="/client-portal/add-ons"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-[#182f54] hover:border-slate-500 bg-[#0a1628] hover:bg-[#0d1c33] text-slate-300 hover:text-white text-xs font-semibold transition-all cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </Link>

            {/* Actions: Save Proposal & Send For Proposal */}
            <div className="w-full sm:w-auto flex flex-col sm:flex-row items-center justify-end gap-3">
              {/* Save Proposal Button (Stores in DB as DRAFT) */}
              <button
                type="button"
                onClick={() => handleSaveProposal("DRAFT")}
                disabled={isSubmitting}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-[#00a3ff]/40 hover:border-[#00a3ff] bg-sky-950/40 hover:bg-sky-900/60 text-[#00a3ff] hover:text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin text-[#00a3ff]" />
                ) : (
                  <Save className="w-4 h-4 text-[#00a3ff]" />
                )}
                <span>Save Proposal</span>
              </button>

              {/* Send For Proposal Button (Stores in DB as SUBMITTED & Opens Modal) */}
              <button
                type="button"
                onClick={() => handleSaveProposal("SUBMITTED")}
                disabled={isSubmitting}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-[#00a3ff] hover:bg-[#0092e0] active:bg-[#0080e0] text-white font-bold text-xs sm:text-sm shadow-lg shadow-sky-500/25 transition-all cursor-pointer disabled:opacity-50"
              >
                <span>
                  {isSubmitting ? "Saving..." : "Send For Proposal"}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
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
                Proposal Saved & Generated Successfully!
              </h3>
              <p className="text-xs sm:text-sm text-slate-300">
                The proposal for{" "}
                <span className="text-sky-400 font-bold">
                  {companyDetails.companyName || "Acme International Ltd"}
                </span>{" "}
                has been stored in the database and compiled into official proposal format.
              </p>
            </div>

            {/* Proposal Details Box */}
            <div className="bg-[#091527] border border-[#172b4c] rounded-2xl p-4 text-left space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Proposal ID:</span>
                <span className="font-mono text-cyan-400 font-bold">
                  #{savedProposal?.proposalNumber || "PROP-2026-0001"}
                </span>
              </div>
              {savedProposal?.lead?.customLeadId && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Lead ID:</span>
                  <span className="font-mono text-emerald-400 font-bold">
                    #{savedProposal.lead.customLeadId}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-400">Status:</span>
                <span className="font-semibold text-sky-400">
                  {savedProposal?.status || "SUBMITTED"}
                </span>
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
                onClick={() => setIsPreviewDeckOpen(true)}
                className="flex-1 py-3 px-4 rounded-xl bg-[#00a3ff] hover:bg-[#0092e0] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-sky-500/25 transition cursor-pointer"
              >
                <Eye className="w-4 h-4" />
                <span>Preview Proposal Deck</span>
              </button>

              <Link
                href="/client-portal/proposal"
                target="_blank"
                className="flex-1 py-3 px-4 rounded-xl border border-sky-500/40 hover:border-sky-400 bg-sky-950/40 hover:bg-sky-900/60 text-sky-300 font-bold text-xs flex items-center justify-center gap-2 transition"
              >
                <Download className="w-4 h-4" />
                <span>Download / Print</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 24-Page Official Proposal Deck Interactive Modal */}
      {isPreviewDeckOpen && (
        <ProposalDeckView
          data={proposalDeckData}
          onClose={() => setIsPreviewDeckOpen(false)}
        />
      )}
    </div>
  );
}


