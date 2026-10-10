"use client";

import * as React from "react";
import Link from "next/link";
import {
  Monitor,
  Megaphone,
  Globe,
  TrendingUp,
  Video,
  ArrowLeft,
  ArrowRight,
  Check,
  Star,
  ShoppingCart,
  Moon,
  Sun,
  CheckCircle2,
  ChevronRight,
  MapPin,
  ShieldCheck,
  Palette,
  Camera,
  Target,
  Film,
  Sparkles,
  Share2,
} from "lucide-react";
import { fetchPackages, type PackageItem } from "@/lib/catalog-api";

// ============================================================================
// DATA MODELS FOR THE PACKAGE COMPARISON MATRIX
// ============================================================================

interface PackageTier {
  id: string;
  name: string;
  price: string;
  bestFor: string;
  pages: string;
  isPopular?: boolean;
}

const DEFAULT_PACKAGE_TIERS: PackageTier[] = [
  {
    id: "basic",
    name: "BASIC",
    price: "AED 799",
    bestFor: "Basic Online Presence",
    pages: "1-3",
  },
  {
    id: "starter",
    name: "STARTER",
    price: "AED 1,499",
    bestFor: "Startups",
    pages: "Up to 5",
  },
  {
    id: "business",
    name: "BUSINESS",
    price: "AED 2,499",
    bestFor: "Small & Medium Businesses",
    pages: "Up to 10",
    isPopular: true,
  },
  {
    id: "professional",
    name: "PROFESSIONAL",
    price: "AED 3,999",
    bestFor: "Growing Companies",
    pages: "Up to 15",
  },
  {
    id: "premium",
    name: "PREMIUM",
    price: "From 6,999+",
    bestFor: "Established Brands",
    pages: "20+",
  },
];

interface FeatureRow {
  name: string;
  basic: string | boolean;
  starter: string | boolean;
  business: string | boolean;
  professional: string | boolean;
  premium: string | boolean;
}

// User-specified static frontend fields:
// - Best for, pages (in PackageTier)
// - custom ui/ux, seo, speed otimization, Booking system, multi langauge, support, company mail
const STATIC_FEATURE_VALUES: Record<
  string,
  {
    basic: string | boolean;
    starter: string | boolean;
    business: string | boolean;
    professional: string | boolean;
    premium: string | boolean;
  }
> = {
  "custom ui/ux": {
    basic: false,
    starter: "Basic",
    business: true,
    professional: "Advanced",
    premium: "Premium",
  },
  "seo": {
    basic: false,
    starter: "Basic",
    business: "Basic +",
    professional: "Advanced",
    premium: "Advanced",
  },
  "speed optimization": {
    basic: false,
    starter: "Basic",
    business: true,
    professional: "Advanced",
    premium: "Premium",
  },
  "booking system": {
    basic: false,
    starter: false,
    business: "Add-on",
    professional: true,
    premium: true,
  },
  "multi-language": {
    basic: false,
    starter: false,
    business: "Add-on",
    professional: "Add-on",
    premium: true,
  },
  "support": {
    basic: "7 Days",
    starter: "15 Days",
    business: "30 Days",
    professional: "60 Days",
    premium: "90 Days",
  },
  "company mail": {
    basic: "1",
    starter: "3",
    business: "5",
    professional: "10",
    premium: "20+",
  },
};

const DEFAULT_FEATURE_MATRIX: FeatureRow[] = [
  {
    name: "Responsive Design",
    basic: true,
    starter: true,
    business: true,
    professional: true,
    premium: true,
  },
  {
    name: "Basic UI Design",
    basic: true,
    starter: true,
    business: true,
    professional: true,
    premium: true,
  },
  {
    name: "Custom UI/UX",
    basic: false,
    starter: "Basic",
    business: true,
    professional: "Advanced",
    premium: "Premium",
  },
  {
    name: "Contact Form",
    basic: true,
    starter: true,
    business: true,
    professional: true,
    premium: true,
  },
  {
    name: "WhatsApp Integration",
    basic: true,
    starter: true,
    business: true,
    professional: true,
    premium: true,
  },
  {
    name: "Google Maps",
    basic: true,
    starter: true,
    business: true,
    professional: true,
    premium: true,
  },
  {
    name: "Social Media Links",
    basic: true,
    starter: true,
    business: true,
    professional: true,
    premium: true,
  },
  {
    name: "SEO",
    basic: false,
    starter: "Basic",
    business: "Basic +",
    professional: "Advanced",
    premium: "Advanced",
  },
  {
    name: "Google Analytics",
    basic: false,
    starter: true,
    business: true,
    professional: true,
    premium: true,
  },
  {
    name: "Speed Optimization",
    basic: false,
    starter: "Basic",
    business: true,
    professional: "Advanced",
    premium: "Premium",
  },
  {
    name: "Admin Panel / CMS",
    basic: false,
    starter: false,
    business: true,
    professional: true,
    premium: true,
  },
  {
    name: "Blog / News",
    basic: false,
    starter: false,
    business: true,
    professional: true,
    premium: true,
  },
  {
    name: "Product / Service Catalogue",
    basic: false,
    starter: false,
    business: true,
    professional: true,
    premium: true,
  },
  {
    name: "Booking System",
    basic: false,
    starter: false,
    business: "Add-on",
    professional: true,
    premium: true,
  },
  {
    name: "Multi-language",
    basic: false,
    starter: false,
    business: "Add-on",
    professional: "Add-on",
    premium: true,
  },
  {
    name: "Security Setup",
    basic: true,
    starter: true,
    business: true,
    professional: true,
    premium: true,
  },
  {
    name: "Support",
    basic: "7 Days",
    starter: "15 Days",
    business: "30 Days",
    professional: "60 Days",
    premium: "90 Days",
  },
  {
    name: "Domain name",
    basic: true,
    starter: true,
    business: true,
    professional: true,
    premium: true,
  },
  {
    name: "Hosting/Sharing",
    basic: true,
    starter: true,
    business: true,
    professional: true,
    premium: true,
  },
  {
    name: "Company Mail",
    basic: "1",
    starter: "3",
    business: "5",
    professional: "10",
    premium: "20+",
  },
];

// Fallback categories in left sidebar when loading or offline
const DEFAULT_FALLBACK_CATEGORIES = [
  {
    id: "5df2b160-f833-4b65-a3e7-9bef76968a4b",
    name: "Website",
    description: "Static, dynamic & custom web application development",
    hasAddons: true,
    sortOrder: 1,
    status: true,
  },
  {
    id: "9e0e93e4-8879-4c61-ba85-8c2979e53448",
    name: "SEO",
    description: "Search engine optimization and content ranking",
    hasAddons: true,
    sortOrder: 2,
    status: true,
  },
  {
    id: "dac854f1-5d82-408d-8339-eda2f0d79dd2",
    name: "Social Media",
    description: "Social media management, branding & community growth",
    hasAddons: true,
    sortOrder: 3,
    status: true,
  },
  {
    id: "cb0374be-cd95-4f96-8546-1b20f2503b6c",
    name: "E-commerce & Mini Website",
    description: "Online storefronts, payment gateways & mini catalogs",
    hasAddons: true,
    sortOrder: 4,
    status: true,
  },
  {
    id: "1d7c6e15-7e0f-4e6e-8f2f-1870c0b75ecf",
    name: "Digital Marketing",
    description: "PPC, search ads, lead generation campaigns",
    hasAddons: false,
    sortOrder: 5,
    status: true,
  },
  {
    id: "a56f8d2b-114d-42b3-8de0-02ba54a02f64",
    name: "Video Production",
    description: "Corporate videos, animations & reels",
    hasAddons: false,
    sortOrder: 6,
    status: true,
  },
];

const getCategoryIcon = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes("e-commerce") || n.includes("commerce") || n.includes("shop") || n.includes("cart") || n.includes("mini")) return ShoppingCart;
  if (n.includes("video") || n.includes("film") || n.includes("media") || n.includes("reel")) return Video;
  if (n.includes("social")) return Share2;
  if (n.includes("market") || n.includes("digital")) return TrendingUp;
  if (n.includes("seo") || n.includes("geo")) return Sparkles;
  if (n.includes("brand")) return Palette;
  if (n.includes("web") || n.includes("site")) return Globe;
  return Sparkles;
};

const getCategorySubtitle = (cat: { description?: string | null; name: string }) => {
  if (cat.description && cat.description.trim().length > 0) {
    return cat.description;
  }
  const n = cat.name.toLowerCase();
  if (n.includes("web")) return "Static, dynamic & custom web application development";
  if (n.includes("seo")) return "Search engine optimization and content ranking";
  if (n.includes("social")) return "Social media management, branding & community growth";
  if (n.includes("commerce") || n.includes("shop") || n.includes("mini")) return "Online storefronts, payment gateways & mini catalogs";
  if (n.includes("market") || n.includes("digital")) return "PPC, search ads, lead generation campaigns";
  if (n.includes("video")) return "Corporate videos, animations & reels";
  return "Professional Packages For Your Brand";
};

const getCategorySlug = (cat: { id: string; name: string }): string => {
  const n = cat.name.toLowerCase();
  if (n.includes("commerce") || n.includes("shop") || n.includes("mini")) return "ecommerce";
  if (n.includes("market") || n.includes("digital")) return "marketing";
  if (n.includes("seo") || n.includes("geo")) return "seo";
  if (n.includes("social") || n.includes("brand")) return "social";
  if (n.includes("video") || n.includes("film") || n.includes("reel")) return "video";
  if (n.includes("web") || n.includes("site")) return "web";
  return cat.id;
};

interface VideoPackageItem {
  id: string;
  name: string;
  price: string;
  period: string;
  tagline: string;
  isPopular?: boolean;
  features: string[];
}

const VIDEO_PACKAGES: VideoPackageItem[] = [
  {
    id: "video-starter",
    name: "REELS & SHORTS STARTER",
    price: "AED 999",
    period: "/ Month",
    tagline: "High-impact short form content for TikTok & Instagram Reels",
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
  {
    id: "video-growth",
    name: "COMMERCIAL & BRAND GROWTH",
    price: "AED 2,499",
    period: "/ Month",
    tagline: "Cinematic commercial videos designed for high brand authority",
    isPopular: true,
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
  {
    id: "video-pro",
    name: "CINEMATIC ENTERPRISE SUITE",
    price: "AED 4,999",
    period: "/ Month",
    tagline: "Full-scale corporate production for enterprise campaigns & ads",
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
];

// ============================================================================
// DIGITAL MARKETING PACKAGES DATA MODEL (MATCHING REFERENCE MOCKUP)
// ============================================================================

interface MarketingPackage {
  id: "starter" | "growth" | "business" | "scale";
  name: string;
  price: string;
  period: string;
  tagline: string;
  isPopular?: boolean;
  icon: string;
  featuresCol1: string[];
  featuresCol2: string[];
}

const MARKETING_PACKAGES: MarketingPackage[] = [
  {
    id: "starter",
    name: "STARTER",
    price: "AED 1,250",
    period: "/ Month",
    tagline: "For businesses building their digital presence",
    icon: "/dm-rocket-icon.png",
    featuresCol1: [
      "Social Media Management",
      "10 Static Creative Designs",
      "4 Reels / Short Videos",
      "Content Strategy",
      "Monthly Content Calendar",
    ],
    featuresCol2: [
      "Basic Hashtag & Keyword Strategy",
      "Monthly Performance Report",
      "Basic Competitor Analysis",
      "Instagram & Facebook Management",
    ],
  },
  {
    id: "growth",
    name: "GROWTH",
    price: "AED 1,999",
    period: "/ Month",
    tagline: "For businesses that want more enquiries & customers",
    isPopular: true,
    icon: "/dm-coins-icon.png",
    featuresCol1: [
      "Everything in STARTER",
      "16 Premium Creative Designs",
      "8 Reels / Short Videos",
      "Meta Ads Management",
      "Lead Generation Campaigns",
      "Audience Research & Targeting",
    ],
    featuresCol2: [
      "Google Business Profile Optimisation",
      "Monthly Campaign Optimisation",
      "Lead & Performance Tracking",
      "Detailed Monthly Report",
      "Competitor Analysis",
    ],
  },
  {
    id: "business",
    name: "BUSINESS",
    price: "AED 2,999",
    period: "/ Month",
    tagline: "For businesses focused on consistent lead generation",
    icon: "/dm-handshake-icon.png",
    featuresCol1: [
      "Everything in GROWTH",
      "20 Premium Creative Designs",
      "12 Reels / Short Videos",
      "Meta Ads Management",
      "Google Ads Management",
      "Advanced Lead Generation",
      "Retargeting Campaigns",
    ],
    featuresCol2: [
      "Landing Page Strategy",
      "SEO Optimisation",
      "Conversion Optimisation",
      "Monthly Marketing Strategy",
      "Competitor & Market Analysis",
      "Priority Account Management",
    ],
  },
  {
    id: "scale",
    name: "SCALE",
    price: "AED 4,499",
    period: "/ Month",
    tagline: "For established brands ready to scale",
    icon: "/dm-gear-icon.png",
    featuresCol1: [
      "Everything in BUSINESS",
      "28 Premium Creative Designs",
      "16 Reels / Short Videos",
      "Advanced Meta Advertising",
      "Advanced Google Advertising",
      "Multiple Lead Generation Campaigns",
      "Retargeting & Remarketing",
      "Google Business Profile Management",
    ],
    featuresCol2: [
      "Advanced SEO",
      "Landing Page Optimisation",
      "Conversion Funnel Strategy",
      "Monthly Strategy Meeting",
      "Priority Support",
      "Dedicated Account Manager",
      "Advanced Analytics Dashboard",
    ],
  },
];

// ============================================================================
// SEO & GEO PACKAGES DATA MODEL (MATCHING REFERENCE MOCKUP)
// ============================================================================

interface SeoPackage {
  id: "local-seo" | "growth-seo" | "authority-seo";
  name: string;
  price: string;
  period: string;
  tagline: string;
  isPopular?: boolean;
  iconType: "pin" | "chart" | "shield";
  features: string[];
}

const SEO_PACKAGES: SeoPackage[] = [
  {
    id: "local-seo",
    name: "LOCAL SEO",
    price: "AED 799",
    period: "/ Month",
    tagline: "For businesses targeting customers in their local area.",
    iconType: "pin",
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
  {
    id: "growth-seo",
    name: "GROWTH SEO",
    price: "AED 1,499",
    period: "/ Month",
    tagline: "For businesses targeting customers in their local area.",
    isPopular: true,
    iconType: "chart",
    features: [
      "Everything in LOCAL SEO",
      "Advanced Keyword Research",
      "Technical SEO",
      "Monthly SEO Report",
      "Content Optimisation",
      "Internal Linking",
      "Competitor SEO Analysis",
      "On-Page Optimisation",
      "Google Business Profile Management",
      "Monthly SEO Strategy",
      "Ranking Monitoring",
    ],
  },
  {
    id: "authority-seo",
    name: "AUTHORITY SEO",
    price: "AED 2,499",
    period: "/ Month",
    tagline: "For businesses targeting customers in their local area.",
    iconType: "shield",
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
];

// ============================================================================
// BRANDING & GOOGLE GROWTH PACKAGES DATA MODEL (MATCHING REFERENCE MOCKUP)
// ============================================================================

interface BrandingSubPackage {
  id: PackageTierId;
  name: string;
  price: string;
  period?: string;
  tagline?: string;
  isPopular?: boolean;
  iconType: "palette" | "chart" | "shield" | "camera" | "target";
  features: string[];
}

const BRANDING_CREATIVE_PACKAGES: BrandingSubPackage[] = [
  {
    id: "brand-starter",
    name: "BRAND STARTER",
    price: "AED 999",
    tagline: "Build a professional foundation for your brand.",
    iconType: "palette",
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
  {
    id: "business-identity",
    name: "BUSINESS IDENTITY",
    price: "AED 1,999",
    tagline: "Create a consistent and professional brand identity.",
    isPopular: true,
    iconType: "chart",
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
  {
    id: "complete-brand",
    name: "COMPLETE BRAND",
    price: "AED 3,499",
    tagline: "A complete visual identity designed for serious businesses.",
    iconType: "shield",
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
];

const CONTENT_PRODUCTION_PACKAGES: BrandingSubPackage[] = [
  {
    id: "content-starter",
    name: "CONTENT STARTER",
    price: "AED 799",
    period: "/ Month",
    iconType: "camera",
    features: [
      "1 Content Shoot",
      "4 Reels",
      "10 Edited Photos",
      "Basic Video Editing",
      "Social Media Formats",
      "Basic Creative Direction",
    ],
  },
  {
    id: "content-growth",
    name: "CONTENT GROWTH",
    price: "AED 1,499",
    period: "/ Month",
    isPopular: true,
    iconType: "chart",
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
  {
    id: "content-pro",
    name: "CONTENT PRO",
    price: "AED 2,499",
    period: "/ Month",
    iconType: "shield",
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
];

const LEAD_GENERATION_PACKAGES: BrandingSubPackage[] = [
  {
    id: "lead-starter",
    name: "LEAD STARTER",
    price: "AED 1,499",
    period: "/ Month",
    tagline: "For businesses that want a predictable source of enquiries.",
    iconType: "target",
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
  {
    id: "lead-growth",
    name: "LEAD GROWTH",
    price: "AED 2,499",
    period: "/ Month",
    isPopular: true,
    iconType: "chart",
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
  {
    id: "lead-scale",
    name: "LEAD SCALE",
    price: "AED 3,999",
    period: "/ Month",
    iconType: "shield",
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
];

const GROWTH_360_PACKAGE = {
  id: "growth-360" as PackageTierId,
  name: "GROWTH 360",
  price: "AED 4,999",
  period: "/ Month",
  tagline: "Your complete digital marketing partner.",
  featuresCol1: [
    "Digital Marketing",
    "Social Media Management",
    "16 Premium Creatives",
    "12 Reels",
    "Meta Ads Management",
    "Google Ads Management",
    "Lead Generation",
    "SEO Management",
  ],
  featuresCol2: [
    "Google Business Profile",
    "Content Strategy",
    "Competitor Analysis",
    "Monthly Marketing Strategy",
    "Conversion Strategy",
    "Monthly Performance Report",
    "Dedicated Account Manager",
    "Monthly Strategy Meeting",
  ],
};

import {
  useProposalStore,
  useCategoryStore,
  type PackageTierId,
  type ServiceCategoryId,
  type EcommerceTierId,
} from "@/stores";

export default function PackageSelectionPage() {
  const {
    packageSelection,
    setCategory,
    setTier,
    setEcommerce,
    isDarkMode,
    toggleDarkMode,
  } = useProposalStore();

  const {
    categories: storeCategories,
    isLoading: isCategoriesLoading,
    fetchCategories,
  } = useCategoryStore();

  React.useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Backend packages integration
  const [backendPackages, setBackendPackages] = React.useState<PackageItem[]>([]);

  React.useEffect(() => {
    let isMounted = true;
    async function loadPackages() {
      try {
        const data = await fetchPackages();
        if (isMounted && data) {
          setBackendPackages(data);
        }
      } catch (err) {
        console.error("Failed to load packages from backend:", err);
      }
    }
    loadPackages();
    return () => {
      isMounted = false;
    };
  }, []);

  // Filter packages belonging to Website category
  const websiteBackendPackages = React.useMemo(() => {
    return backendPackages.filter((p) => {
      const catName = p.category?.name?.toLowerCase() || "";
      return catName.includes("web") || p.id.startsWith("pkg-website-");
    });
  }, [backendPackages]);

  // Helper to find a backend package by tier ID (e.g. basic, starter, business, professional, premium)
  const getTierBackendPackage = React.useCallback(
    (tierKey: string): PackageItem | undefined => {
      const k = tierKey.toLowerCase();
      return websiteBackendPackages.find((p) => {
        const id = p.id.toLowerCase();
        const name = p.name.toLowerCase();
        return id.includes(k) || name.includes(k) || name === k;
      });
    },
    [websiteBackendPackages]
  );

  // Dynamic Tiers: merges backend price, name, isPopular with static bestFor, pages
  const displayPackageTiers: PackageTier[] = React.useMemo(() => {
    return DEFAULT_PACKAGE_TIERS.map((tier) => {
      const backendPkg = getTierBackendPackage(tier.id);
      if (!backendPkg) return tier;

      let formattedPrice = tier.price;
      if (backendPkg.price !== undefined && backendPkg.price !== null) {
        const num = Number(backendPkg.price);
        if (!isNaN(num)) {
          formattedPrice =
            tier.id === "premium"
              ? `From ${num.toLocaleString()}+`
              : `AED ${num.toLocaleString()}`;
        }
      }

      return {
        ...tier,
        name: backendPkg.name || tier.name,
        price: formattedPrice,
        isPopular: backendPkg.isPopular !== undefined ? backendPkg.isPopular : tier.isPopular,
        // Static fields preserved:
        bestFor: tier.bestFor,
        pages: tier.pages,
      };
    });
  }, [getTierBackendPackage]);

  // Dynamic Feature Matrix: static fields stay static, all other fields dynamically computed from backend features
  const displayFeatureMatrix: FeatureRow[] = React.useMemo(() => {
    // Helper to get dynamic value of a feature from a tier package
    const getDynamicValue = (featureName: string, tierKey: string): string | boolean => {
      const pkg = getTierBackendPackage(tierKey);
      if (!pkg || !pkg.features) {
        const fallbackRow = DEFAULT_FEATURE_MATRIX.find(
          (r) => r.name.toLowerCase() === featureName.toLowerCase()
        );
        return fallbackRow ? fallbackRow[tierKey as keyof FeatureRow] : false;
      }

      const match = pkg.features.find(
        (f) => f.featureName.trim().toLowerCase() === featureName.trim().toLowerCase()
      );
      if (!match) {
        return false;
      }
      if (match.featureValue !== null && match.featureValue !== undefined && match.featureValue !== "") {
        return match.featureValue;
      }
      return match.included;
    };

    // Standard rows template
    const rows: FeatureRow[] = DEFAULT_FEATURE_MATRIX.map((templateRow) => {
      const lowerName = templateRow.name.trim().toLowerCase();
      // If it's one of the user-specified static fields:
      const staticVals = STATIC_FEATURE_VALUES[lowerName];
      if (staticVals) {
        return {
          name: templateRow.name,
          basic: staticVals.basic,
          starter: staticVals.starter,
          business: staticVals.business,
          professional: staticVals.professional,
          premium: staticVals.premium,
        };
      }

      // Otherwise, dynamic from backend:
      return {
        name: templateRow.name,
        basic: getDynamicValue(templateRow.name, "basic"),
        starter: getDynamicValue(templateRow.name, "starter"),
        business: getDynamicValue(templateRow.name, "business"),
        professional: getDynamicValue(templateRow.name, "professional"),
        premium: getDynamicValue(templateRow.name, "premium"),
      };
    });

    return rows;
  }, [getTierBackendPackage]);

  // E-Commerce Standalone Packages from Backend
  const miniEcomPkg = React.useMemo(() => {
    return backendPackages.find(
      (p) => p.id === "pkg-ecom-mini" || p.name.toLowerCase().includes("mini")
    );
  }, [backendPackages]);

  const standardEcomPkg = React.useMemo(() => {
    return backendPackages.find(
      (p) =>
        (p.id === "pkg-ecom-standard" || p.name.toLowerCase().includes("e-commerce")) &&
        !p.name.toLowerCase().includes("mini")
    );
  }, [backendPackages]);

  const miniEcomPrice = React.useMemo(() => {
    if (miniEcomPkg?.price) {
      const n = Number(miniEcomPkg.price);
      return !isNaN(n) ? `AED ${n.toLocaleString()}` : String(miniEcomPkg.price);
    }
    return "AED 3,499";
  }, [miniEcomPkg]);

  const standardEcomPrice = React.useMemo(() => {
    if (standardEcomPkg?.price) {
      const n = Number(standardEcomPkg.price);
      return !isNaN(n) ? `AED ${n.toLocaleString()}` : String(standardEcomPkg.price);
    }
    return "AED 5,999";
  }, [standardEcomPkg]);

  // Dynamic Digital Marketing Packages from DB
  const displayMarketingPackages: MarketingPackage[] = React.useMemo(() => {
    return MARKETING_PACKAGES.map((def) => {
      const match = backendPackages.find((p) => {
        const id = p.id.toLowerCase();
        const name = p.name.toLowerCase();
        const catName = p.category?.name?.toLowerCase() || "";
        const isMarketing = catName.includes("market") || catName.includes("digital");
        return (
          (isMarketing || id.startsWith("pkg-dm-")) &&
          (id.includes(def.id) || name === def.id || name.includes(def.name.toLowerCase()))
        );
      });
      if (!match) return def;

      let formattedPrice = def.price;
      if (match.price !== undefined && match.price !== null) {
        const n = Number(match.price);
        if (!isNaN(n)) formattedPrice = `AED ${n.toLocaleString()}`;
      }

      let col1 = def.featuresCol1;
      let col2 = def.featuresCol2;
      if (match.features && match.features.length > 0) {
        const featList = match.features.filter((f) => f.included).map((f) => f.featureName);
        if (featList.length > 0) {
          const mid = Math.ceil(featList.length / 2);
          col1 = featList.slice(0, mid);
          col2 = featList.slice(mid);
        }
      }

      return {
        ...def,
        name: match.name || def.name,
        price: formattedPrice,
        period: match.billingType === "MONTHLY" ? "/ Month" : def.period,
        tagline: match.description || def.tagline,
        isPopular: match.isPopular !== undefined ? match.isPopular : def.isPopular,
        featuresCol1: col1,
        featuresCol2: col2,
      };
    });
  }, [backendPackages]);

  // Dynamic SEO Packages from DB
  const displaySeoPackages: SeoPackage[] = React.useMemo(() => {
    return SEO_PACKAGES.map((def) => {
      const key = def.id.replace("-seo", "");
      const match = backendPackages.find((p) => {
        const id = p.id.toLowerCase();
        const name = p.name.toLowerCase();
        const catName = p.category?.name?.toLowerCase() || "";
        const isSeo = catName.includes("seo") || catName.includes("geo");
        return (
          (isSeo || id.startsWith("pkg-seo-")) &&
          (id.includes(key) || name.toLowerCase().includes(key))
        );
      });
      if (!match) return def;

      let formattedPrice = def.price;
      if (match.price !== undefined && match.price !== null) {
        const n = Number(match.price);
        if (!isNaN(n)) formattedPrice = `AED ${n.toLocaleString()}`;
      }

      let feats = def.features;
      if (match.features && match.features.length > 0) {
        const list = match.features.filter((f) => f.included).map((f) => f.featureName);
        if (list.length > 0) feats = list;
      }

      return {
        ...def,
        name: match.name || def.name,
        price: formattedPrice,
        period: match.billingType === "MONTHLY" ? "/ Month" : def.period,
        tagline: match.description || def.tagline,
        isPopular: match.isPopular !== undefined ? match.isPopular : def.isPopular,
        features: feats,
      };
    });
  }, [backendPackages]);

  // Dynamic Branding & Creative Packages from DB
  const displayBrandingPackages: BrandingSubPackage[] = React.useMemo(() => {
    return BRANDING_CREATIVE_PACKAGES.map((def) => {
      const key = def.id.replace("brand-", "").replace("business-", "");
      const match = backendPackages.find((p) => {
        const id = p.id.toLowerCase();
        const name = p.name.toLowerCase();
        return (
          id === `pkg-${def.id}` ||
          id === def.id ||
          (id.startsWith("pkg-brand-") && (id.includes(key) || name.includes(key))) ||
          name === def.name.toLowerCase()
        );
      });
      if (!match) return def;

      let formattedPrice = def.price;
      if (match.price !== undefined && match.price !== null) {
        const n = Number(match.price);
        if (!isNaN(n)) formattedPrice = `AED ${n.toLocaleString()}`;
      }

      let feats = def.features;
      if (match.features && match.features.length > 0) {
        const list = match.features.filter((f) => f.included).map((f) => f.featureName);
        if (list.length > 0) feats = list;
      }

      return {
        ...def,
        name: match.name || def.name,
        price: formattedPrice,
        tagline: match.description || def.tagline,
        isPopular: match.isPopular !== undefined ? match.isPopular : def.isPopular,
        features: feats,
      };
    });
  }, [backendPackages]);

  // Dynamic Content Production Packages from DB
  const displayContentPackages: BrandingSubPackage[] = React.useMemo(() => {
    return CONTENT_PRODUCTION_PACKAGES.map((def) => {
      const key = def.id.replace("content-", "");
      const match = backendPackages.find((p) => {
        const id = p.id.toLowerCase();
        const name = p.name.toLowerCase();
        return (
          id === `pkg-${def.id}` ||
          id === def.id ||
          (id.startsWith("pkg-content-") && (id.includes(key) || name.includes(key)))
        );
      });
      if (!match) return def;

      let formattedPrice = def.price;
      if (match.price !== undefined && match.price !== null) {
        const n = Number(match.price);
        if (!isNaN(n)) formattedPrice = `AED ${n.toLocaleString()}`;
      }

      let feats = def.features;
      if (match.features && match.features.length > 0) {
        const list = match.features.filter((f) => f.included).map((f) => f.featureName);
        if (list.length > 0) feats = list;
      }

      return {
        ...def,
        name: match.name || def.name,
        price: formattedPrice,
        period: match.billingType === "MONTHLY" ? "/ Month" : def.period,
        tagline: match.description || def.tagline,
        isPopular: match.isPopular !== undefined ? match.isPopular : def.isPopular,
        features: feats,
      };
    });
  }, [backendPackages]);

  // Dynamic Lead Generation Packages from DB
  const displayLeadPackages: BrandingSubPackage[] = React.useMemo(() => {
    return LEAD_GENERATION_PACKAGES.map((def) => {
      const key = def.id.replace("lead-", "");
      const match = backendPackages.find((p) => {
        const id = p.id.toLowerCase();
        const name = p.name.toLowerCase();
        return (
          id === `pkg-${def.id}` ||
          id === def.id ||
          (id.startsWith("pkg-lead-") && (id.includes(key) || name.includes(key)))
        );
      });
      if (!match) return def;

      let formattedPrice = def.price;
      if (match.price !== undefined && match.price !== null) {
        const n = Number(match.price);
        if (!isNaN(n)) formattedPrice = `AED ${n.toLocaleString()}`;
      }

      let feats = def.features;
      if (match.features && match.features.length > 0) {
        const list = match.features.filter((f) => f.included).map((f) => f.featureName);
        if (list.length > 0) feats = list;
      }

      return {
        ...def,
        name: match.name || def.name,
        price: formattedPrice,
        period: match.billingType === "MONTHLY" ? "/ Month" : def.period,
        tagline: match.description || def.tagline,
        isPopular: match.isPopular !== undefined ? match.isPopular : def.isPopular,
        features: feats,
      };
    });
  }, [backendPackages]);

  // Dynamic Growth 360 Package from DB
  const displayGrowth360Package = React.useMemo(() => {
    const match = backendPackages.find((p) => {
      const id = p.id.toLowerCase();
      const name = p.name.toLowerCase();
      return id === "pkg-growth-360" || id === "growth-360" || name.includes("growth 360");
    });
    if (!match) return GROWTH_360_PACKAGE;

    let formattedPrice = GROWTH_360_PACKAGE.price;
    if (match.price !== undefined && match.price !== null) {
      const n = Number(match.price);
      if (!isNaN(n)) formattedPrice = `AED ${n.toLocaleString()}`;
    }

    let col1 = GROWTH_360_PACKAGE.featuresCol1;
    let col2 = GROWTH_360_PACKAGE.featuresCol2;
    if (match.features && match.features.length > 0) {
      const featList = match.features.filter((f) => f.included).map((f) => f.featureName);
      if (featList.length > 0) {
        const mid = Math.ceil(featList.length / 2);
        col1 = featList.slice(0, mid);
        col2 = featList.slice(mid);
      }
    }

    return {
      ...GROWTH_360_PACKAGE,
      name: match.name || GROWTH_360_PACKAGE.name,
      price: formattedPrice,
      period: match.billingType === "MONTHLY" ? "/ Month" : GROWTH_360_PACKAGE.period,
      tagline: match.description || GROWTH_360_PACKAGE.tagline,
      featuresCol1: col1,
      featuresCol2: col2,
    };
  }, [backendPackages]);

  // Dynamic Video Production Packages from DB
  const displayVideoPackages: VideoPackageItem[] = React.useMemo(() => {
    return VIDEO_PACKAGES.map((def) => {
      const key = def.id.replace("video-", "");
      const match = backendPackages.find((p) => {
        const id = p.id.toLowerCase();
        const name = p.name.toLowerCase();
        const catName = p.category?.name?.toLowerCase() || "";
        const isVideo =
          catName.includes("video") || catName.includes("film") || catName.includes("reel");
        return (
          (isVideo || id.startsWith("pkg-video-")) &&
          (id.includes(key) || name.includes(key))
        );
      });
      if (!match) return def;

      let formattedPrice = def.price;
      if (match.price !== undefined && match.price !== null) {
        const n = Number(match.price);
        if (!isNaN(n)) formattedPrice = `AED ${n.toLocaleString()}`;
      }

      let feats = def.features;
      if (match.features && match.features.length > 0) {
        const list = match.features.filter((f) => f.included).map((f) => f.featureName);
        if (list.length > 0) feats = list;
      }

      return {
        ...def,
        name: match.name || def.name,
        price: formattedPrice,
        period: match.billingType === "MONTHLY" ? "/ Month" : def.period,
        tagline: match.description || def.tagline,
        isPopular: match.isPopular !== undefined ? match.isPopular : def.isPopular,
        features: feats,
      };
    });
  }, [backendPackages]);

  // Dynamic E-Commerce Features from DB
  const miniEcomFeatures = React.useMemo(() => {
    if (miniEcomPkg?.features && miniEcomPkg.features.length > 0) {
      return miniEcomPkg.features.filter((f) => f.included).map((f) => f.featureName);
    }
    return [
      "Custom E-Commerce Design",
      "Product Catalogue",
      "Product Management",
      "Shopping Cart",
      "Checkout System",
      "Payment Gateway Integration",
      "Order Management",
      "Admin Dashboard",
      "Customer Accounts",
      "Coupon & Discount System",
      "WhatsApp Integration",
      "Google Analytics",
      "Conversion Tracking",
      "Basic SEO",
      "Mobile Optimization",
    ];
  }, [miniEcomPkg]);

  const standardEcomFeatures = React.useMemo(() => {
    if (standardEcomPkg?.features && standardEcomPkg.features.length > 0) {
      return standardEcomPkg.features.filter((f) => f.included).map((f) => f.featureName);
    }
    return [
      "Custom E-Commerce Design",
      "Product Catalogue",
      "Product Management",
      "Shopping Cart",
      "Checkout System",
      "Payment Gateway Integration",
      "Order Management",
      "Admin Dashboard",
      "Customer Accounts",
      "Coupon & Discount System",
      "WhatsApp Integration",
      "Google Analytics",
      "Conversion Tracking",
      "Basic SEO",
      "Mobile Optimization",
    ];
  }, [standardEcomPkg]);

  const displayCategories = React.useMemo(() => {
    const activeFromStore = storeCategories.filter((c) => c.status !== false);
    if (activeFromStore.length > 0) {
      return activeFromStore;
    }
    return DEFAULT_FALLBACK_CATEGORIES;
  }, [storeCategories]);

  const selectedCategory = packageSelection.category;
  const selectedTier = packageSelection.tier;
  const selectedEcommerce = packageSelection.ecommerce;

  const activeCategory = React.useMemo(() => {
    if (!displayCategories.length) return null;
    const byId = displayCategories.find((c) => c.id === selectedCategory);
    if (byId) return byId;
    const byName = displayCategories.find(
      (c) => c.name.toLowerCase() === selectedCategory?.toLowerCase()
    );
    if (byName) return byName;
    const bySlug = displayCategories.find(
      (c) => getCategorySlug(c) === selectedCategory?.toLowerCase()
    );
    if (bySlug) return bySlug;
    return displayCategories[0];
  }, [displayCategories, selectedCategory]);

  const activeSlug = activeCategory ? getCategorySlug(activeCategory) : "web";

  const handleSelectPackage = (tierId: string) => {
    if (activeCategory?.id) {
      setCategory(activeCategory.id as ServiceCategoryId);
    }
    setTier(tierId as PackageTierId);
  };

  const handleChooseEcommerce = (type: string) => {
    if (activeCategory?.id) {
      setCategory(activeCategory.id as ServiceCategoryId);
    }
    setEcommerce(type as EcommerceTierId);
  };

  const renderCellContent = (value: string | boolean) => {
    if (value === true) {
      return (
        <span className="inline-flex items-center justify-center text-emerald-400 font-bold">
          <Check className="w-4 h-4 stroke-[3]" />
        </span>
      );
    }
    if (value === false) {
      return (
        <span className="inline-flex items-center justify-center text-rose-500 font-bold">
          —
        </span>
      );
    }
    return (
      <span className="text-slate-200 text-sm font-semibold">
        {value}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#060e1a] text-slate-100 flex flex-col font-sans select-none antialiased">
      {/* ==================================================================== */}
      {/* TOP HEADER: BRANDING, STEPPER & THEME SWITCH */}
      {/* ==================================================================== */}
      <header
        className={`w-full border-b px-4 sm:px-8 py-3.5 flex items-center justify-between sticky top-0 z-30 transition-colors shadow-sm ${
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
              : "bg-slate-100 border border-slate-200"
          }`}
        >
          {/* Step 1: Company Details */}
          <Link
            href="/client-portal/company-details"
            className="flex items-center gap-1.5 text-cyan-600 hover:text-cyan-700 transition-colors font-semibold px-2 py-0.5"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-500" />
            <span>Company Details</span>
          </Link>

          <span className="text-slate-400 px-1 font-bold">›</span>

          {/* Step 2: Package (Active) */}
          <div className="flex items-center gap-1.5 text-white font-bold bg-[#0284c7] px-3.5 py-1 rounded-full shadow-sm">
            <span className="w-4 h-4 rounded-full bg-white text-[#0284c7] text-[10px] flex items-center justify-center font-extrabold">
              2
            </span>
            <span>Package</span>
          </div>

          <span className="text-slate-400 px-1 font-bold">›</span>

          {/* Step 3: Add-ons */}
          <Link
            href="/client-portal/add-ons"
            className="flex items-center gap-1.5 text-slate-400 hover:text-slate-200 transition-colors px-2 py-0.5 font-medium"
          >
            <span className="w-4 h-4 rounded-full bg-slate-700 text-slate-300 text-[10px] flex items-center justify-center font-bold">
              3
            </span>
            <span>Add-ons</span>
          </Link>

          <span className="text-slate-400 px-1 font-bold">›</span>

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

        {/* Right: Mode Toggle */}
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
                <Moon className="w-3.5 h-3.5 text-sky-600" />
                <span className="text-[10px] font-semibold text-slate-700">Dark</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* ==================================================================== */}
      {/* MAIN CONTENT: SPLIT CATEGORIES & COMPARISON MATRIX */}
      {/* ==================================================================== */}
      <div className="flex-1 flex flex-col lg:flex-row items-start max-w-[1780px] w-full mx-auto p-4 sm:p-6 lg:p-8 gap-6">
        {/* ------------------------------------------------------------------ */}
        {/* Left Categories Sidebar (with Dubai skyline) */}
        {/* ------------------------------------------------------------------ */}
        <aside className="w-full lg:w-72 xl:w-80 bg-[#071120] border border-[#14233e] rounded-3xl p-5 flex flex-col justify-between shrink-0 shadow-2xl relative overflow-hidden lg:sticky lg:top-20 self-start max-h-[calc(100vh-6rem)]">
          <div className="space-y-4 z-10">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block px-1">
                CATEGORIES
              </span>

              <div className="space-y-2.5">
                {isCategoriesLoading && storeCategories.length === 0 ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-full p-3.5 rounded-2xl bg-[#091528]/60 border border-[#162744] animate-pulse flex items-center gap-3"
                    >
                      <div className="w-9 h-9 rounded-xl bg-slate-800/80 shrink-0" />
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="h-3.5 bg-slate-800/80 rounded w-2/3" />
                        <div className="h-2.5 bg-slate-800/50 rounded w-1/2" />
                      </div>
                    </div>
                  ))
                ) : (
                  displayCategories.map((cat) => {
                  const Icon = getCategoryIcon(cat.name);
                  const subtitle = getCategorySubtitle(cat);
                  const isActive = activeCategory?.id === cat.id;

                  return (
                    <button
                      key={cat.id}
                      onClick={() => setCategory(cat.id as ServiceCategoryId)}
                      className={`w-full p-3.5 rounded-2xl flex items-center justify-between gap-3 text-left transition-all cursor-pointer ${
                        isActive
                          ? "bg-[#0284c7] text-white shadow-lg shadow-sky-600/30 border border-sky-400/40"
                          : "bg-[#091528] hover:bg-[#0e1f3a] text-slate-300 border border-[#162744]"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                            isActive
                              ? "bg-white/20 text-white"
                              : "bg-[#0f1d35] text-sky-400"
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <p className="text-sm font-bold truncate">
                              {cat.name}
                            </p>
                          </div>
                          <p
                            className={`text-xs truncate ${
                              isActive ? "text-sky-100" : "text-slate-400"
                            }`}
                          >
                            {subtitle}
                          </p>
                        </div>
                      </div>

                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                          isActive
                            ? "bg-white/20 text-white"
                            : "bg-[#0f1d35] text-slate-400"
                        }`}
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                      </div>
                    </button>
                  );
                }))}
              </div>
            </div>

            {/* Bottom Back Button & Dubai Skyline */}
            <div className="pt-6 mt-8 z-10">
              <Link
                href="/client-portal/company-details"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-transparent border border-[#1a2d4c] hover:bg-[#0d1c33] text-slate-300 text-sm font-semibold transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </Link>
            </div>

            {/* Bottom Graphic: Dubai Skyline */}
            <div className="absolute bottom-0 left-0 right-0 pointer-events-none select-none opacity-40 mix-blend-screen overflow-hidden">
              <img
                src="/dubai-skyline.jpg"
                alt="Dubai Skyline"
                className="w-full h-32 object-cover object-bottom"
              />
            </div>
          </aside>

        {/* ------------------------------------------------------------------ */}
        {/* Right Main Area: Hero Banner + Comparison Matrix */}
        {/* ------------------------------------------------------------------ */}
        <main className="flex-1 space-y-6 min-w-0 w-full">
          {/* HERO SECTION: CHOOSE YOUR PACKAGE (MATCHING REFERENCE MOCKUP) */}
          <div
            className={`w-full rounded-3xl border px-6 sm:px-8 lg:px-10 py-4 sm:py-5 relative overflow-hidden transition-colors shadow-sm ${
              isDarkMode
                ? "bg-[#081325] border-[#14233e]"
                : "bg-white border-slate-200"
            }`}
          >

            <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
              {/* Left Title & Subtitle */}
              <div className="pt-1">
                <h1
                  className={`text-2xl sm:text-3xl lg:text-[40px] font-extrabold tracking-tight leading-tight ${
                    isDarkMode ? "text-white" : "text-black"
                  }`}
                >
                  Choose Your <span className="text-[#0099ff]">Package</span>
                </h1>
                <p
                  className={`text-xs sm:text-sm lg:text-base mt-1.5 max-w-md font-normal leading-relaxed ${
                    isDarkMode ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  Select the package that best fits your client&apos;s requirements.
                </p>
              </div>

              {/* Right: Dot Matrix + 3D Laptop Graphic */}
              <div className="relative flex items-center justify-end shrink-0 select-none pointer-events-none">

                {/* 3D Laptop Graphic matching reference mockup */}
                <div className="w-56 sm:w-72 md:w-80 lg:w-[380px] h-auto shrink-0 relative z-10">
                  <img
                    src="/laptop-growth.png"
                    alt="Choose Your Package - Analytics"
                    className="w-full h-auto object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
          {/* CATEGORY VIEW: DIGITAL MARKETING PACKAGES vs WEBSITE DEVELOPING */}
          {activeSlug === "marketing" ? (
            <div className="bg-[#091527] border border-[#142745] rounded-3xl p-5 sm:p-7 shadow-2xl space-y-6">
              {/* Header */}
              <div className="flex items-center gap-2.5 pb-4 border-b border-[#14233e]">
                <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
                  <Megaphone className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-white uppercase tracking-wider">
                    Digital Marketing Packages
                  </h2>
                  <p className="text-sm text-slate-400 mt-0.5">
                    Select the package that best fits your client&apos;s requirements.
                  </p>
                </div>
              </div>

              {/* Stacked White Package Cards */}
              <div className="space-y-5">
                {displayMarketingPackages.map((pkg) => {
                  const isSelected = selectedTier === pkg.id;

                  return (
                    <div
                      key={pkg.id}
                      className={`bg-white rounded-3xl p-5 sm:p-7 relative shadow-md transition-all border ${
                        isSelected
                          ? "border-[#00a6ff] ring-2 ring-[#00a6ff] shadow-xl shadow-sky-500/10"
                          : "border-slate-200 hover:border-sky-300"
                      }`}
                    >
                      {/* Most Popular Badge */}
                      {pkg.isPopular && (
                        <div className="absolute -top-3 left-6 inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-extrabold uppercase tracking-wider bg-[#00a6ff] text-white shadow-sm">
                          <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                          <span>Most Popular</span>
                        </div>
                      )}

                      <div className="flex flex-col lg:flex-row items-center justify-between gap-6 pt-1">
                        {/* Left: 3D Icon, Title, Price, Tagline */}
                        <div className="flex flex-col items-center text-center w-full lg:w-56 shrink-0">
                          <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
                            <img
                              src={pkg.icon}
                              alt={pkg.name}
                              className="max-w-full max-h-full object-contain"
                            />
                          </div>
                          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-2 uppercase">
                            {pkg.name}
                          </h3>
                          <p className="text-xl sm:text-2xl font-black text-[#0c2242] mt-0.5 tracking-tight">
                            {pkg.price}{" "}
                            <span className="text-xs sm:text-sm font-bold text-slate-600 tracking-normal">
                              {pkg.period}
                            </span>
                          </p>
                          <p className="text-xs text-slate-500 mt-1 max-w-[210px] leading-tight">
                            {pkg.tagline}
                          </p>
                        </div>

                        {/* Center: 2-Column Feature Checklist */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2.5 text-xs sm:text-sm flex-1 w-full border-t lg:border-t-0 lg:border-l border-slate-200 pt-4 lg:pt-0 lg:pl-8">
                          <div className="space-y-2">
                            {pkg.featuresCol1.map((feat) => (
                              <div
                                key={feat}
                                className="flex items-center gap-2.5 text-slate-800 font-medium"
                              >
                                <CheckCircle2 className="w-4 h-4 text-white fill-[#00a6ff] shrink-0" />
                                <span>{feat}</span>
                              </div>
                            ))}
                          </div>
                          <div className="space-y-2">
                            {pkg.featuresCol2.map((feat) => (
                              <div
                                key={feat}
                                className="flex items-center gap-2.5 text-slate-800 font-medium"
                              >
                                <CheckCircle2 className="w-4 h-4 text-white fill-[#00a6ff] shrink-0" />
                                <span>{feat}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Right: Choose Package Button */}
                        <div className="shrink-0 flex items-center justify-end w-full lg:w-auto lg:self-end">
                          <button
                            onClick={() => handleSelectPackage(pkg.id)}
                            className={`w-full lg:w-auto px-6 py-2.5 rounded-xl font-bold text-sm tracking-wide transition-all shadow-md cursor-pointer ${
                              isSelected
                                ? "bg-emerald-600 text-white shadow-emerald-600/30 ring-2 ring-emerald-400/50"
                                : "bg-[#00a6ff] hover:bg-[#0092e0] text-white shadow-sky-500/20"
                            }`}
                          >
                            {isSelected ? "Selected ✓" : "Choose Package"}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Save & Continue */}
              <div className="flex justify-end pt-3">
                <Link
                  href="/client-portal/add-ons"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#00a6ff] hover:bg-[#0092e0] text-white font-bold text-sm shadow-lg shadow-sky-500/25 transition-all"
                >
                  <span>Save & Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ) : activeSlug === "seo" ? (
            <div className="bg-[#091527] border border-[#142745] rounded-3xl p-5 sm:p-7 shadow-2xl space-y-6">
              {/* Header */}
              <div className="flex items-center gap-2.5 pb-4 border-b border-[#14233e]">
                <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-white uppercase tracking-wider">
                    SEO & GEO
                  </h2>
                  <p className="text-sm text-slate-400 mt-0.5">
                    Build a professional foundation for your brand.
                  </p>
                </div>
              </div>

              {/* 3 Vertical Cards Side by Side */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
                {displaySeoPackages.map((pkg) => {
                  const isSelected = selectedTier === pkg.id;

                  return (
                    <div
                      key={pkg.id}
                      className={`bg-white rounded-3xl p-6 sm:p-7 relative shadow-md transition-all border flex flex-col justify-between ${
                        isSelected
                          ? "border-[#00a6ff] ring-2 ring-[#00a6ff] shadow-xl shadow-sky-500/10"
                          : "border-slate-200 hover:border-sky-300"
                      }`}
                    >
                      {/* Most Popular Badge */}
                      {pkg.isPopular && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 px-3 py-1 rounded-md text-[11px] font-extrabold uppercase tracking-wider bg-[#00a6ff] text-white shadow-sm whitespace-nowrap">
                          <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                          <span>Most Popular</span>
                        </div>
                      )}

                      <div>
                        {/* Top Icon Badge */}
                        <div className="w-14 h-14 rounded-full bg-[#0a192f] border border-[#173258] text-[#00a6ff] flex items-center justify-center mx-auto mb-3 shadow-inner">
                          {pkg.iconType === "pin" && <MapPin className="w-6 h-6 text-[#00a6ff]" />}
                          {pkg.iconType === "chart" && <TrendingUp className="w-6 h-6 text-[#00a6ff]" />}
                          {pkg.iconType === "shield" && <ShieldCheck className="w-6 h-6 text-[#00a6ff]" />}
                        </div>

                        {/* Title */}
                        <h3 className="text-xl font-extrabold text-slate-900 tracking-tight text-center uppercase">
                          {pkg.name}
                        </h3>

                        {/* Price */}
                        <p className="text-2xl font-black text-[#0c2242] mt-1 text-center tracking-tight">
                          {pkg.price}{" "}
                          <span className="text-xs font-bold text-slate-500 tracking-normal">
                            {pkg.period}
                          </span>
                        </p>

                        {/* Tagline */}
                        <p className="text-xs text-slate-500 mt-1.5 text-center leading-tight min-h-[28px]">
                          {pkg.tagline}
                        </p>

                        {/* Deliverables Checklist */}
                        <div className="space-y-2.5 my-6 text-xs sm:text-sm border-t border-slate-100 pt-5">
                          {pkg.features.map((feat) => (
                            <div
                              key={feat}
                              className="flex items-start gap-2.5 text-slate-800 font-medium leading-snug"
                            >
                              <CheckCircle2 className="w-4 h-4 text-white fill-[#00a6ff] shrink-0 mt-0.5" />
                              <span>{feat}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Choose Package Button */}
                      <button
                        onClick={() => handleSelectPackage(pkg.id)}
                        className={`w-full py-2.5 px-4 rounded-xl font-bold text-sm transition-all cursor-pointer shadow-sm ${
                          isSelected
                            ? "bg-emerald-600 text-white shadow-emerald-600/30 ring-2 ring-emerald-400/50"
                            : pkg.isPopular
                            ? "bg-[#00a6ff] hover:bg-[#0092e0] text-white shadow-sky-500/20"
                            : "border border-[#00a6ff] text-[#00a6ff] hover:bg-sky-50"
                        }`}
                      >
                        {isSelected ? "Selected ✓" : "Choose Package"}
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Save & Continue */}
              <div className="flex justify-end pt-3">
                <Link
                  href="/client-portal/add-ons"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#00a6ff] hover:bg-[#0092e0] text-white font-bold text-sm shadow-lg shadow-sky-500/25 transition-all"
                >
                  <span>Save & Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ) : activeSlug === "branding" || activeSlug === "social" ? (
            <div className="bg-[#091527] border border-[#142745] rounded-3xl p-5 sm:p-7 shadow-2xl space-y-8">
              {/* -------------------------------------------------------- */}
              {/* SUBSECTION 1: BRANDING & CREATIVE */}
              {/* -------------------------------------------------------- */}
              <div className="space-y-4">
                <div className="pb-3 border-b border-[#14233e]">
                  <h2 className="text-lg sm:text-xl font-bold text-white uppercase tracking-wider">
                    Branding & Creative
                  </h2>
                  <p className="text-sm text-slate-400 mt-0.5">
                    Build a professional foundation for your brand.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch pt-2">
                  {displayBrandingPackages.map((pkg) => {
                    const isSelected = selectedTier === pkg.id;

                    return (
                      <div
                        key={pkg.id}
                        className={`bg-white rounded-3xl p-6 sm:p-7 relative shadow-md transition-all border flex flex-col justify-between ${
                          isSelected
                            ? "border-[#00a6ff] ring-2 ring-[#00a6ff] shadow-xl shadow-sky-500/10"
                            : "border-slate-200 hover:border-sky-300"
                        }`}
                      >
                        {pkg.isPopular && (
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 px-3 py-1 rounded-md text-[11px] font-extrabold uppercase tracking-wider bg-[#00a6ff] text-white shadow-sm whitespace-nowrap">
                            <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                            <span>Most Popular</span>
                          </div>
                        )}

                        <div>
                          <div className="w-14 h-14 rounded-full bg-[#0a192f] border border-[#173258] text-[#00a6ff] flex items-center justify-center mx-auto mb-3 shadow-inner">
                            {pkg.iconType === "palette" && <Palette className="w-6 h-6 text-[#00a6ff]" />}
                            {pkg.iconType === "chart" && <TrendingUp className="w-6 h-6 text-[#00a6ff]" />}
                            {pkg.iconType === "shield" && <ShieldCheck className="w-6 h-6 text-[#00a6ff]" />}
                          </div>

                          <h3 className="text-xl font-extrabold text-slate-900 tracking-tight text-center uppercase">
                            {pkg.name}
                          </h3>

                          <p className="text-2xl font-black text-[#0c2242] mt-1 text-center tracking-tight">
                            {pkg.price}
                          </p>

                          {pkg.tagline && (
                            <p className="text-xs text-slate-500 mt-1.5 text-center leading-tight min-h-[28px]">
                              {pkg.tagline}
                            </p>
                          )}

                          <div className="space-y-2.5 my-6 text-xs sm:text-sm border-t border-slate-100 pt-5">
                            {pkg.features.map((feat) => (
                              <div
                                key={feat}
                                className="flex items-start gap-2.5 text-slate-800 font-medium leading-snug"
                              >
                                <CheckCircle2 className="w-4 h-4 text-white fill-[#00a6ff] shrink-0 mt-0.5" />
                                <span>{feat}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <button
                          onClick={() => handleSelectPackage(pkg.id)}
                          className={`w-full py-2.5 px-4 rounded-xl font-bold text-sm transition-all cursor-pointer shadow-sm ${
                            isSelected
                              ? "bg-emerald-600 text-white shadow-emerald-600/30 ring-2 ring-emerald-400/50"
                              : pkg.isPopular
                              ? "bg-[#00a6ff] hover:bg-[#0092e0] text-white shadow-sky-500/20"
                              : "border border-[#00a6ff] text-[#00a6ff] hover:bg-sky-50"
                          }`}
                        >
                          {isSelected ? "Selected ✓" : "Choose Package"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* -------------------------------------------------------- */}
              {/* SUBSECTION 2: CONTENT PRODUCTION */}
              {/* -------------------------------------------------------- */}
              <div className="space-y-4 pt-4">
                <div className="pb-3 border-b border-[#14233e]">
                  <h2 className="text-lg sm:text-xl font-bold text-white uppercase tracking-wider">
                    Content Production
                  </h2>
                  <p className="text-sm text-slate-400 mt-0.5">
                    Build visibility, Rank higher, Get discovered.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch pt-2">
                  {displayContentPackages.map((pkg) => {
                    const isSelected = selectedTier === pkg.id;

                    return (
                      <div
                        key={pkg.id}
                        className={`bg-white rounded-3xl p-6 sm:p-7 relative shadow-md transition-all border flex flex-col justify-between ${
                          isSelected
                            ? "border-[#00a6ff] ring-2 ring-[#00a6ff] shadow-xl shadow-sky-500/10"
                            : "border-slate-200 hover:border-sky-300"
                        }`}
                      >
                        {pkg.isPopular && (
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 px-3 py-1 rounded-md text-[11px] font-extrabold uppercase tracking-wider bg-[#00a6ff] text-white shadow-sm whitespace-nowrap">
                            <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                            <span>Most Popular</span>
                          </div>
                        )}

                        <div>
                          <div className="w-14 h-14 rounded-full bg-[#0a192f] border border-[#173258] text-[#00a6ff] flex items-center justify-center mx-auto mb-3 shadow-inner">
                            {pkg.iconType === "camera" && <Camera className="w-6 h-6 text-[#00a6ff]" />}
                            {pkg.iconType === "chart" && <TrendingUp className="w-6 h-6 text-[#00a6ff]" />}
                            {pkg.iconType === "shield" && <ShieldCheck className="w-6 h-6 text-[#00a6ff]" />}
                          </div>

                          <h3 className="text-xl font-extrabold text-slate-900 tracking-tight text-center uppercase">
                            {pkg.name}
                          </h3>

                          <p className="text-2xl font-black text-[#0c2242] mt-1 text-center tracking-tight">
                            {pkg.price}{" "}
                            <span className="text-xs font-bold text-slate-500 tracking-normal">
                              {pkg.period}
                            </span>
                          </p>

                          <div className="space-y-2.5 my-6 text-xs sm:text-sm border-t border-slate-100 pt-5">
                            {pkg.features.map((feat) => (
                              <div
                                key={feat}
                                className="flex items-start gap-2.5 text-slate-800 font-medium leading-snug"
                              >
                                <CheckCircle2 className="w-4 h-4 text-white fill-[#00a6ff] shrink-0 mt-0.5" />
                                <span>{feat}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <button
                          onClick={() => handleSelectPackage(pkg.id)}
                          className={`w-full py-2.5 px-4 rounded-xl font-bold text-sm transition-all cursor-pointer shadow-sm ${
                            isSelected
                              ? "bg-emerald-600 text-white shadow-emerald-600/30 ring-2 ring-emerald-400/50"
                              : pkg.isPopular
                              ? "bg-[#00a6ff] hover:bg-[#0092e0] text-white shadow-sky-500/20"
                              : "border border-[#00a6ff] text-[#00a6ff] hover:bg-sky-50"
                          }`}
                        >
                          {isSelected ? "Selected ✓" : "Choose Package"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* -------------------------------------------------------- */}
              {/* SUBSECTION 3: LEAD GENERATION */}
              {/* -------------------------------------------------------- */}
              <div className="space-y-4 pt-4">
                <div className="pb-3 border-b border-[#14233e]">
                  <h2 className="text-lg sm:text-xl font-bold text-white uppercase tracking-wider">
                    Lead Generation
                  </h2>
                  <p className="text-sm text-slate-400 mt-0.5">
                    Build visibility, Rank higher, Get discovered.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch pt-2">
                  {displayLeadPackages.map((pkg) => {
                    const isSelected = selectedTier === pkg.id;

                    return (
                      <div
                        key={pkg.id}
                        className={`bg-white rounded-3xl p-6 sm:p-7 relative shadow-md transition-all border flex flex-col justify-between ${
                          isSelected
                            ? "border-[#00a6ff] ring-2 ring-[#00a6ff] shadow-xl shadow-sky-500/10"
                            : "border-slate-200 hover:border-sky-300"
                        }`}
                      >
                        {pkg.isPopular && (
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 px-3 py-1 rounded-md text-[11px] font-extrabold uppercase tracking-wider bg-[#00a6ff] text-white shadow-sm whitespace-nowrap">
                            <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                            <span>Most Popular</span>
                          </div>
                        )}

                        <div>
                          <div className="w-14 h-14 rounded-full bg-[#0a192f] border border-[#173258] text-[#00a6ff] flex items-center justify-center mx-auto mb-3 shadow-inner">
                            {pkg.iconType === "target" && <Target className="w-6 h-6 text-[#00a6ff]" />}
                            {pkg.iconType === "chart" && <TrendingUp className="w-6 h-6 text-[#00a6ff]" />}
                            {pkg.iconType === "shield" && <ShieldCheck className="w-6 h-6 text-[#00a6ff]" />}
                          </div>

                          <h3 className="text-xl font-extrabold text-slate-900 tracking-tight text-center uppercase">
                            {pkg.name}
                          </h3>

                          <p className="text-2xl font-black text-[#0c2242] mt-1 text-center tracking-tight">
                            {pkg.price}{" "}
                            <span className="text-xs font-bold text-slate-500 tracking-normal">
                              {pkg.period}
                            </span>
                          </p>

                          {pkg.tagline && (
                            <p className="text-xs text-slate-500 mt-1.5 text-center leading-tight min-h-[28px]">
                              {pkg.tagline}
                            </p>
                          )}

                          <div className="space-y-2.5 my-6 text-xs sm:text-sm border-t border-slate-100 pt-5">
                            {pkg.features.map((feat) => (
                              <div
                                key={feat}
                                className="flex items-start gap-2.5 text-slate-800 font-medium leading-snug"
                              >
                                <CheckCircle2 className="w-4 h-4 text-white fill-[#00a6ff] shrink-0 mt-0.5" />
                                <span>{feat}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <button
                          onClick={() => handleSelectPackage(pkg.id)}
                          className={`w-full py-2.5 px-4 rounded-xl font-bold text-sm transition-all cursor-pointer shadow-sm ${
                            isSelected
                              ? "bg-emerald-600 text-white shadow-emerald-600/30 ring-2 ring-emerald-400/50"
                              : pkg.isPopular
                              ? "bg-[#00a6ff] hover:bg-[#0092e0] text-white shadow-sky-500/20"
                              : "border border-[#00a6ff] text-[#00a6ff] hover:bg-sky-50"
                          }`}
                        >
                          {isSelected ? "Selected ✓" : "Choose Package"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* -------------------------------------------------------- */}
              {/* SUBSECTION 4: COMPLETE BUSINESS GROWTH - GROWTH 360 */}
              {/* -------------------------------------------------------- */}
              <div className="space-y-4 pt-4">
                <div className="pb-3 border-b border-[#14233e]">
                  <h2 className="text-lg sm:text-xl font-bold text-white uppercase tracking-wider">
                    Complete Business Growth
                  </h2>
                  <p className="text-sm text-slate-400 mt-0.5">
                    Build visibility, Rank higher, Get discovered.
                  </p>
                </div>

                <div
                  className={`bg-white rounded-3xl p-6 sm:p-8 relative shadow-md transition-all border ${
                    selectedTier === displayGrowth360Package.id
                      ? "border-[#00a6ff] ring-2 ring-[#00a6ff] shadow-xl shadow-sky-500/10"
                      : "border-slate-200 hover:border-sky-300"
                  }`}
                >
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-extrabold uppercase tracking-wider bg-[#00a6ff] text-white shadow-sm whitespace-nowrap">
                    <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                    <span>Most Popular</span>
                  </div>

                  <div className="flex flex-col lg:flex-row items-center justify-between gap-6 pt-1">
                    {/* Left: 3D Icon, Title, Price, Tagline */}
                    <div className="flex flex-col items-center text-center w-full lg:w-56 shrink-0">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
                        <img
                          src="/dm-gear-icon.png"
                          alt="Growth 360"
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                      <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-2 uppercase">
                        {displayGrowth360Package.name}
                      </h3>
                      <p className="text-xl sm:text-2xl font-black text-[#0c2242] mt-0.5 tracking-tight">
                        {displayGrowth360Package.price}{" "}
                        <span className="text-xs sm:text-sm font-bold text-slate-600 tracking-normal">
                          {displayGrowth360Package.period}
                        </span>
                      </p>
                      <p className="text-xs text-slate-500 mt-1 max-w-[210px] leading-tight">
                        {displayGrowth360Package.tagline}
                      </p>
                    </div>

                    {/* Center: 2-Column Feature Checklist */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2.5 text-xs sm:text-sm flex-1 w-full border-t lg:border-t-0 lg:border-l border-slate-200 pt-4 lg:pt-0 lg:pl-8">
                      <div className="space-y-2">
                        {displayGrowth360Package.featuresCol1.map((feat) => (
                          <div
                            key={feat}
                            className="flex items-center gap-2.5 text-slate-800 font-medium"
                          >
                            <CheckCircle2 className="w-4 h-4 text-white fill-[#00a6ff] shrink-0" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                      <div className="space-y-2">
                        {displayGrowth360Package.featuresCol2.map((feat) => (
                          <div
                            key={feat}
                            className="flex items-center gap-2.5 text-slate-800 font-medium"
                          >
                            <CheckCircle2 className="w-4 h-4 text-white fill-[#00a6ff] shrink-0" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Right: Choose Package Button */}
                    <div className="shrink-0 flex items-center justify-end w-full lg:w-auto lg:self-end">
                      <button
                        onClick={() => handleSelectPackage(displayGrowth360Package.id)}
                        className={`w-full lg:w-auto px-6 py-2.5 rounded-xl font-bold text-sm tracking-wide transition-all shadow-md cursor-pointer ${
                          selectedTier === displayGrowth360Package.id
                            ? "bg-emerald-600 text-white shadow-emerald-600/30 ring-2 ring-emerald-400/50"
                            : "bg-[#00a6ff] hover:bg-[#0092e0] text-white shadow-sky-500/20"
                        }`}
                      >
                        {selectedTier === displayGrowth360Package.id ? "Selected ✓" : "Choose Package"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Save & Continue */}
              <div className="flex justify-end pt-3">
                <Link
                  href="/client-portal/add-ons"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#00a6ff] hover:bg-[#0092e0] text-white font-bold text-sm shadow-lg shadow-sky-500/25 transition-all"
                >
                  <span>Save & Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ) : activeSlug === "video" ? (
            <div className="bg-[#091527] border border-[#142745] rounded-3xl p-5 sm:p-7 shadow-2xl space-y-6">
              {/* Header */}
              <div className="flex items-center gap-2.5 pb-4 border-b border-[#14233e]">
                <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-white uppercase tracking-wider">
                    Video Production Packages
                  </h2>
                  <p className="text-sm text-slate-400 mt-0.5">
                    Select the video production and shoot package that best fits your client&apos;s brand.
                  </p>
                </div>
              </div>

              {/* 3 Vertical Cards Side by Side */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch pt-2">
                {displayVideoPackages.map((pkg) => {
                  const isSelected = selectedTier === pkg.id;

                  return (
                    <div
                      key={pkg.id}
                      className={`bg-white rounded-3xl p-6 sm:p-7 relative shadow-md transition-all border flex flex-col justify-between ${
                        isSelected
                          ? "border-[#00a6ff] ring-2 ring-[#00a6ff] shadow-xl shadow-sky-500/10"
                          : "border-slate-200 hover:border-sky-300"
                      }`}
                    >
                      {pkg.isPopular && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 px-3 py-1 rounded-md text-[11px] font-extrabold uppercase tracking-wider bg-[#00a6ff] text-white shadow-sm whitespace-nowrap">
                          <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                          <span>Most Popular</span>
                        </div>
                      )}

                      <div>
                        <div className="w-14 h-14 rounded-full bg-[#0a192f] border border-[#173258] text-[#00a6ff] flex items-center justify-center mx-auto mb-3 shadow-inner">
                          <Film className="w-6 h-6 text-[#00a6ff]" />
                        </div>

                        <h3 className="text-xl font-extrabold text-slate-900 tracking-tight text-center uppercase">
                          {pkg.name}
                        </h3>

                        <p className="text-2xl font-black text-[#0c2242] mt-1 text-center tracking-tight">
                          {pkg.price}{" "}
                          <span className="text-xs font-bold text-slate-500 tracking-normal">
                            {pkg.period}
                          </span>
                        </p>

                        {pkg.tagline && (
                          <p className="text-xs text-slate-500 mt-1.5 text-center leading-tight min-h-[28px]">
                            {pkg.tagline}
                          </p>
                        )}

                        <div className="space-y-2.5 my-6 text-xs sm:text-sm border-t border-slate-100 pt-5">
                          {pkg.features.map((feat) => (
                            <div
                              key={feat}
                              className="flex items-start gap-2.5 text-slate-800 font-medium leading-snug"
                            >
                              <CheckCircle2 className="w-4 h-4 text-white fill-[#00a6ff] shrink-0 mt-0.5" />
                              <span>{feat}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <button
                        onClick={() => handleSelectPackage(pkg.id)}
                        className={`w-full py-2.5 px-4 rounded-xl font-bold text-sm transition-all cursor-pointer shadow-sm ${
                          isSelected
                            ? "bg-emerald-600 text-white shadow-emerald-600/30 ring-2 ring-emerald-400/50"
                            : pkg.isPopular
                            ? "bg-[#00a6ff] hover:bg-[#0092e0] text-white shadow-sky-500/20"
                            : "border border-[#00a6ff] text-[#00a6ff] hover:bg-sky-50"
                        }`}
                      >
                        {isSelected ? "Selected ✓" : "Choose Package"}
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Save & Continue */}
              <div className="flex justify-end pt-3">
                <Link
                  href="/client-portal/add-ons"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#00a6ff] hover:bg-[#0092e0] text-white font-bold text-sm shadow-lg shadow-sky-500/25 transition-all"
                >
                  <span>Save & Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ) : activeSlug === "ecommerce" ? (
            <div className="bg-[#091527] border border-[#142745] rounded-3xl p-5 sm:p-7 shadow-2xl space-y-6">
              {/* Header */}
              <div className="flex items-center gap-2.5 pb-4 border-b border-[#14233e]">
                <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
                  <ShoppingCart className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-white uppercase tracking-wider">
                    E-commerce & Mini Website Packages
                  </h2>
                  <p className="text-sm text-slate-400 mt-0.5">
                    Select the online storefront package that best fits your client&apos;s product catalog.
                  </p>
                </div>
              </div>

              {/* 2 E-commerce Package Cards */}
              <div className="space-y-5">
                {/* E-Commerce Package 1: MINI E-COMMERCE WEBSITE FROM AED 3,499 */}
                <div className={`rounded-3xl p-6 sm:p-7 shadow-2xl transition-all border ${
                  selectedEcommerce === "mini"
                    ? "bg-[#0b2447] border-2 border-sky-400 shadow-sky-600/30 ring-1 ring-sky-300/40"
                    : "bg-[#091527] border-[#142745] hover:border-sky-500/40"
                }`}>
                  <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
                    {/* Left: Icon, Title & Price */}
                    <div className="flex items-center gap-4 xl:w-80 shrink-0">
                      <div className="w-14 h-14 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
                        <ShoppingCart className="w-7 h-7" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
                          {miniEcomPkg?.name ? `${miniEcomPkg.name} FROM` : "MINI E-COMMERCE WEBSITE FROM"}
                        </h3>
                        <p className="text-3xl font-black text-[#0284c7] mt-0.5 tracking-tight">
                          {miniEcomPrice}
                        </p>
                        <p className="text-xs text-slate-400 mt-1 leading-tight">
                          {miniEcomPkg?.description || "Final pricing depends on functionality and product volume."}
                        </p>
                      </div>
                    </div>

                    {/* Center: 2 Columns of Deliverables Checklist */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2.5 text-sm flex-1">
                      <div className="space-y-2">
                        {miniEcomFeatures.slice(0, Math.ceil(miniEcomFeatures.length / 2)).map((feat) => (
                          <div key={feat} className="flex items-center gap-2 text-slate-200">
                            <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>

                      <div className="space-y-2">
                        {miniEcomFeatures.slice(Math.ceil(miniEcomFeatures.length / 2)).map((feat) => (
                          <div key={feat} className="flex items-center gap-2 text-slate-200">
                            <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Right: Choose Package Button */}
                    <div className="shrink-0 flex items-center justify-end">
                      <button
                        onClick={() => handleChooseEcommerce("mini")}
                        className={`px-6 py-3 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                          selectedEcommerce === "mini"
                            ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 ring-2 ring-emerald-400/50"
                            : "bg-[#0284c7] hover:bg-[#0369a1] text-white shadow-lg shadow-sky-600/30"
                        }`}
                      >
                        {selectedEcommerce === "mini" ? "Selected ✓" : "Choose Package"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* E-Commerce Package 2: E-COMMERCE WEBSITE FROM AED 5,999 */}
                <div className={`rounded-3xl p-6 sm:p-7 shadow-2xl transition-all border ${
                  selectedEcommerce === "standard"
                    ? "bg-[#0b2447] border-2 border-sky-400 shadow-sky-600/30 ring-1 ring-sky-300/40"
                    : "bg-[#091527] border-[#142745] hover:border-sky-500/40"
                }`}>
                  <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
                    {/* Left: Icon, Title & Price */}
                    <div className="flex items-center gap-4 xl:w-80 shrink-0">
                      <div className="w-14 h-14 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
                        <ShoppingCart className="w-7 h-7" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
                          {standardEcomPkg?.name ? `${standardEcomPkg.name} FROM` : "E-COMMERCE WEBSITE FROM"}
                        </h3>
                        <p className="text-3xl font-black text-[#0284c7] mt-0.5 tracking-tight">
                          {standardEcomPrice}
                        </p>
                        <p className="text-xs text-slate-400 mt-1 leading-tight">
                          {standardEcomPkg?.description || "Final pricing depends on functionality and product volume."}
                        </p>
                      </div>
                    </div>

                    {/* Center: 2 Columns of Deliverables Checklist */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2.5 text-sm flex-1">
                      <div className="space-y-2">
                        {standardEcomFeatures.slice(0, Math.ceil(standardEcomFeatures.length / 2)).map((feat) => (
                          <div key={feat} className="flex items-center gap-2 text-slate-200">
                            <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>

                      <div className="space-y-2">
                        {standardEcomFeatures.slice(Math.ceil(standardEcomFeatures.length / 2)).map((feat) => (
                          <div key={feat} className="flex items-center gap-2 text-slate-200">
                            <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Right: Choose Package Button */}
                    <div className="shrink-0 flex items-center justify-end">
                      <button
                        onClick={() => handleChooseEcommerce("standard")}
                        className={`px-6 py-3 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                          selectedEcommerce === "standard"
                            ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 ring-2 ring-emerald-400/50"
                            : "bg-[#0284c7] hover:bg-[#0369a1] text-white shadow-lg shadow-sky-600/30"
                        }`}
                      >
                        {selectedEcommerce === "standard" ? "Selected ✓" : "Choose Package"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Save & Continue */}
              <div className="flex justify-end pt-3">
                <Link
                  href="/client-portal/add-ons"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#00a6ff] hover:bg-[#0092e0] text-white font-bold text-sm shadow-lg shadow-sky-500/25 transition-all"
                >
                  <span>Save & Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* Comparison Matrix Card */}
              <div className="bg-[#091527] border border-[#142745] rounded-3xl p-5 sm:p-6 shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-2.5 pb-4 border-b border-[#14233e]">
              <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
                <Monitor className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">
                  Website Developing Packages
                </h2>
                <p className="text-sm text-slate-400 mt-0.5">
                  Select the package that best fits your client&apos;s requirements.
                </p>
              </div>
            </div>

            {/* Matrix Table */}
            <div className="overflow-x-auto mt-4 -mx-5 sm:-mx-6 px-5 sm:px-6">
              <table className="w-full text-center text-sm border-collapse min-w-[720px]">
                {/* Table Header: Tiers */}
                <thead>
                  <tr className="border-b border-[#14233e]">
                    <th className="text-left py-3.5 px-3 w-[22%] text-slate-400 font-bold text-xs uppercase tracking-wider">
                      Tier / Metric
                    </th>
                    {displayPackageTiers.map((tier) => {
                      const isSelected = selectedTier === tier.id && selectedEcommerce === null;
                      return (
                        <th
                          key={tier.id}
                          className={`py-3.5 px-2 text-center transition-all ${
                            isSelected
                              ? "bg-[#0b2447] border-x-2 border-t-2 border-sky-400 shadow-lg text-sky-300"
                              : tier.isPopular
                              ? "bg-[#0b1f3b]/70 border-x border-[#1a3862]"
                              : ""
                          }`}
                        >
                          <div className="flex flex-col items-center">
                            {tier.isPopular && (
                              <span className="text-amber-400 text-sm mb-0.5 flex items-center gap-0.5 font-bold">
                                <Star className="w-4 h-4 fill-amber-400" />
                              </span>
                            )}
                            <span
                              className={`font-black tracking-wide text-sm ${
                                isSelected
                                  ? "text-sky-300 font-black scale-105"
                                  : tier.isPopular
                                  ? "text-sky-400 font-extrabold"
                                  : "text-white"
                              }`}
                            >
                              {tier.name}
                            </span>
                          </div>
                        </th>
                      );
                    })}
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#101e33]">
                  {/* Row: Price */}
                  <tr className="hover:bg-[#0c1a2f]/60 transition-colors">
                    <td className="text-left py-3.5 px-3 text-slate-300 font-bold text-sm">
                      Price
                    </td>
                    {displayPackageTiers.map((tier) => {
                      const isSelected = selectedTier === tier.id && selectedEcommerce === null;
                      return (
                        <td
                          key={tier.id}
                          className={`py-3.5 px-2 font-black text-sm sm:text-base transition-colors ${
                            isSelected
                              ? "bg-[#0b2447]/90 border-x-2 border-sky-400/80 text-sky-300"
                              : tier.isPopular
                              ? "bg-[#0b1f3b]/70 border-x border-[#1a3862] text-sky-400"
                              : "text-white"
                          }`}
                        >
                          {tier.price}
                        </td>
                      );
                    })}
                  </tr>

                  {/* Row: Best For (Static) */}
                  <tr className="hover:bg-[#0c1a2f]/60 transition-colors">
                    <td className="text-left py-3.5 px-3 text-slate-300 font-semibold text-sm">
                      Best For
                    </td>
                    {displayPackageTiers.map((tier) => {
                      const isSelected = selectedTier === tier.id && selectedEcommerce === null;
                      return (
                        <td
                          key={tier.id}
                          className={`py-3.5 px-2 text-xs sm:text-sm transition-colors ${
                            isSelected
                              ? "bg-[#0b2447]/90 border-x-2 border-sky-400/80 text-slate-100 font-medium"
                              : tier.isPopular
                              ? "bg-[#0b1f3b]/70 border-x border-[#1a3862] text-slate-300"
                              : "text-slate-400"
                          }`}
                        >
                          {tier.bestFor}
                        </td>
                      );
                    })}
                  </tr>

                  {/* Row: Pages (Static) */}
                  <tr className="hover:bg-[#0c1a2f]/60 transition-colors">
                    <td className="text-left py-3.5 px-3 text-slate-300 font-semibold text-sm">
                      Pages
                    </td>
                    {displayPackageTiers.map((tier) => {
                      const isSelected = selectedTier === tier.id && selectedEcommerce === null;
                      return (
                        <td
                          key={tier.id}
                          className={`py-3.5 px-2 text-sm font-bold transition-colors ${
                            isSelected
                              ? "bg-[#0b2447]/90 border-x-2 border-sky-400/80 text-white"
                              : tier.isPopular
                              ? "bg-[#0b1f3b]/70 border-x border-[#1a3862] text-slate-200"
                              : "text-slate-200"
                          }`}
                        >
                          {tier.pages}
                        </td>
                      );
                    })}
                  </tr>

                  {/* Feature Rows (Merged Static & Dynamic from Backend) */}
                  {displayFeatureMatrix.map((row, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-[#0c1a2f]/60 transition-colors"
                    >
                      <td className="text-left py-3 px-3 text-slate-300 font-medium text-sm">
                        {row.name}
                      </td>
                      {displayPackageTiers.map((tier) => {
                        const isSelected = selectedTier === tier.id && selectedEcommerce === null;
                        const cellVal = row[tier.id as keyof FeatureRow];
                        return (
                          <td
                            key={tier.id}
                            className={`py-3 px-2 transition-colors ${
                              isSelected
                                ? "bg-[#0b2447]/90 border-x-2 border-sky-400/80"
                                : tier.isPopular
                                ? "bg-[#0b1f3b]/70 border-x border-[#1a3862]"
                                : ""
                            }`}
                          >
                            {renderCellContent(cellVal as string | boolean)}
                          </td>
                        );
                      })}
                    </tr>
                  ))}

                  {/* Bottom Action Row: Select Buttons */}
                  <tr className="border-t border-[#14233e]">
                    <td className="text-left py-4 px-3 text-slate-400 font-bold text-xs uppercase tracking-wider">
                      Action
                    </td>
                    {displayPackageTiers.map((tier) => {
                      const isSelected = selectedTier === tier.id && selectedEcommerce === null;
                      return (
                        <td
                          key={tier.id}
                          className={`py-4 px-2 transition-colors ${
                            isSelected
                              ? "bg-[#0b2447] border-x-2 border-b-2 border-sky-400"
                              : tier.isPopular
                              ? "bg-[#0b1f3b]/70 border-x border-[#1a3862]"
                              : ""
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => handleSelectPackage(tier.id)}
                            className={`w-full max-w-[110px] py-2 px-3.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                              isSelected
                                ? "bg-[#0284c7] hover:bg-[#0369a1] text-white shadow-lg shadow-sky-600/40 ring-2 ring-sky-300/40 scale-105"
                                : "bg-[#102342] hover:bg-[#16305a] text-sky-400 border border-[#1b3b6a]"
                            }`}
                          >
                            {isSelected ? "Selected ✓" : "Select"}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* ------------------------------------------------------------------ */}
          {/* E-COMMERCE STANDALONE PACKAGES (2 Cards below) */}
          {/* ------------------------------------------------------------------ */}
          <div className="space-y-4">
            {/* E-Commerce Package 1: MINI E-COMMERCE WEBSITE */}
            <div className={`rounded-3xl p-6 sm:p-7 shadow-2xl transition-all border ${
              selectedEcommerce === "mini"
                ? "bg-[#0b2447] border-2 border-sky-400 shadow-sky-600/30 ring-1 ring-sky-300/40"
                : "bg-[#091527] border-[#142745] hover:border-sky-500/40"
            }`}>
              <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
                {/* Left: Icon, Title & Price */}
                <div className="flex items-center gap-4 xl:w-80 shrink-0">
                  <div className="w-14 h-14 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
                    <ShoppingCart className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
                      {miniEcomPkg?.name ? `${miniEcomPkg.name} FROM` : "MINI E-COMMERCE WEBSITE FROM"}
                    </h3>
                    <p className="text-3xl font-black text-[#0284c7] mt-0.5 tracking-tight">
                      {miniEcomPrice}
                    </p>
                    <p className="text-xs text-slate-400 mt-1 leading-tight">
                      {miniEcomPkg?.description || "Final pricing depends on functionality and product volume."}
                    </p>
                  </div>
                </div>

                {/* Center: 2 Columns of Deliverables Checklist */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2.5 text-sm flex-1">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                      <span>Custom E-Commerce Design</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                      <span>Product Catalogue</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                      <span>Product Management</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                      <span>Shopping Cart</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                      <span>Checkout System</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                      <span>Payment Gateway Integration</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                      <span>Order Management</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                      <span>Admin Dashboard</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                      <span>Customer Accounts</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                      <span>Coupon & Discount System</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                      <span>WhatsApp Integration</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                      <span>Google Analytics</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                      <span>Conversion Tracking</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                      <span>Basic SEO</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                      <span>Mobile Optimization</span>
                    </div>
                  </div>
                </div>

                {/* Right: Choose Package Button */}
                <div className="shrink-0 flex items-center justify-end">
                  <button
                    onClick={() => handleChooseEcommerce("mini")}
                    className={`px-6 py-3 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                      selectedEcommerce === "mini"
                        ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 ring-2 ring-emerald-400/50"
                        : "bg-[#0284c7] hover:bg-[#0369a1] text-white shadow-lg shadow-sky-600/30"
                    }`}
                  >
                    {selectedEcommerce === "mini" ? "Selected ✓" : "Choose Package"}
                  </button>
                </div>
              </div>
            </div>

            {/* E-Commerce Package 2: E-COMMERCE WEBSITE */}
            <div className={`rounded-3xl p-6 sm:p-7 shadow-2xl transition-all border ${
              selectedEcommerce === "standard"
                ? "bg-[#0b2447] border-2 border-sky-400 shadow-sky-600/30 ring-1 ring-sky-300/40"
                : "bg-[#091527] border-[#142745] hover:border-sky-500/40"
            }`}>
              <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
                {/* Left: Icon, Title & Price */}
                <div className="flex items-center gap-4 xl:w-80 shrink-0">
                  <div className="w-14 h-14 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
                    <ShoppingCart className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
                      {standardEcomPkg?.name ? `${standardEcomPkg.name} FROM` : "E-COMMERCE WEBSITE FROM"}
                    </h3>
                    <p className="text-3xl font-black text-[#0284c7] mt-0.5 tracking-tight">
                      {standardEcomPrice}
                    </p>
                    <p className="text-xs text-slate-400 mt-1 leading-tight">
                      {standardEcomPkg?.description || "Final pricing depends on functionality and product volume."}
                    </p>
                  </div>
                </div>

                {/* Center: 2 Columns of Deliverables Checklist */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2.5 text-sm flex-1">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                      <span>Custom E-Commerce Design</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                      <span>Product Catalogue</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                      <span>Product Management</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                      <span>Shopping Cart</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                      <span>Checkout System</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                      <span>Payment Gateway Integration</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                      <span>Order Management</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                      <span>Admin Dashboard</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                      <span>Customer Accounts</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                      <span>Coupon & Discount System</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                      <span>WhatsApp Integration</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                      <span>Google Analytics</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                      <span>Conversion Tracking</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                      <span>Basic SEO</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                      <span>Mobile Optimization</span>
                    </div>
                  </div>
                </div>

                {/* Right: Choose Package Button */}
                <div className="shrink-0 flex items-center justify-end">
                  <button
                    onClick={() => handleChooseEcommerce("standard")}
                    className={`px-6 py-3 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                      selectedEcommerce === "standard"
                        ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 ring-2 ring-emerald-400/50"
                        : "bg-[#0284c7] hover:bg-[#0369a1] text-white shadow-lg shadow-sky-600/30"
                    }`}
                  >
                    {selectedEcommerce === "standard" ? "Selected ✓" : "Choose Package"}
                  </button>
                </div>
              </div>
            </div>
          </div>

            {/* Save & Continue for Web Dev View */}
            <div className="flex justify-end pt-2">
              <Link
                href="/client-portal/add-ons"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#00a6ff] hover:bg-[#0092e0] text-white font-bold text-sm shadow-lg shadow-sky-500/25 transition-all"
              >
                <span>Save & Continue</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </>
        )}
        </main>
      </div>
    </div>
  );
}
