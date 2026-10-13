export interface AddonItemData {
  id: string;
  name: string;
  price: number;
  unit?: string;
  category?: "web" | "marketing" | "seo" | "media" | "tech";
}

export const ALL_ADDONS: AddonItemData[] = [
  // Creative & Content
  { id: "addon-additional-creative", name: "Additional Creative", price: 75, category: "media" },
  { id: "addon-additional-reel", name: "Additional Reel", price: 150, category: "media" },
  { id: "addon-motion-graphic", name: "Motion Graphic", price: 200, category: "media" },
  { id: "addon-product-photography", name: "Product Photography", price: 499, category: "media" },
  { id: "addon-professional-photoshoot", name: "Professional Photoshoot", price: 499, category: "media" },
  { id: "addon-professional-videoshoot", name: "Professional Video Shoot", price: 699, category: "media" },
  { id: "addon-corporate-video", name: "Corporate Video", price: 1499, category: "media" },

  // Digital
  { id: "addon-landing-page", name: "Landing Page", price: 799, category: "web" },
  { id: "addon-website-maintenance", name: "Website Maintenance", price: 299, unit: "/ month", category: "web" },
  { id: "addon-seo-service", name: "SEO Add-On", price: 500, unit: "/ month", category: "seo" },
  { id: "addon-gbp-management", name: "Google Business Profile", price: 300, unit: "/ month", category: "seo" },
  { id: "addon-whatsapp-marketing", name: "WhatsApp Marketing", price: 499, category: "marketing" },
  { id: "addon-email-marketing", name: "Email Marketing", price: 499, unit: "/ month", category: "marketing" },

  // Advertising
  { id: "addon-meta-ads-setup", name: "Meta Ads Setup", price: 300, category: "marketing" },
  { id: "addon-google-ads-setup", name: "Google Ads Setup", price: 400, category: "marketing" },
  { id: "addon-additional-campaign", name: "Additional Campaign", price: 300, category: "marketing" },
  { id: "addon-retargeting-campaign", name: "Retargeting Campaign", price: 400, category: "marketing" },
  { id: "addon-conversion-tracking-setup", name: "Conversion Tracking Setup", price: 300, category: "tech" },

  // Branding
  { id: "addon-logo-design", name: "Logo Design", price: 499, category: "marketing" },
  { id: "addon-business-card", name: "Business Card", price: 199, category: "marketing" },
  { id: "addon-company-profile", name: "Company Profile", price: 499, category: "marketing" },
  { id: "addon-brochure-design", name: "Brochure Design", price: 299, category: "marketing" },
  { id: "addon-presentation-design", name: "Presentation Design", price: 499, category: "marketing" },
  { id: "addon-brand-guidelines", name: "Brand Guidelines", price: 799, category: "marketing" },
];

/**
 * Set of legacy mock / hardcoded add-on IDs that must NEVER be included in pricing calculations
 * or proposals, ensuring existing persisted user states are automatically cleansed.
 */
export const LEGACY_MOCK_ADDON_IDS: Set<string> = new Set([
  "regular-content",
  "social-video",
  "photo-shoot",
  "technical-consultation",
  "custom-landing",
  "dedicated-am",
  "lead-crm-standard",
  "lead-crm-ecommerce",
  "ecommerce-integration",
  "crm-sync",
  "customer-portal",
  "csat-survey",
  "google-review",
  "whatsapp-bot",
  "tiktok-meta-shop",
  "video-editing",
  "express-delivery",
  "domain-ssl",
  "payment-gateway",
  "bilingual-site",
  "speed-optimization",
  "technical-seo",
  "photography",
  "maintenance",
  "hosting",
  "social-posts",
  "drone-shoot",
  "extra-videos",
]);

