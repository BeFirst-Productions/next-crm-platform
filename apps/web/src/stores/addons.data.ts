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

  // Catalogue & Previous Addons
  { id: "regular-content", name: "Regular Content Upgrades", price: 499, category: "marketing" },
  { id: "social-video", name: "Social Media Video Production", price: 1499, category: "media" },
  { id: "photo-shoot", name: "Photo Shoot", price: 999, category: "media" },
  { id: "technical-consultation", name: "Technical Consultation", price: 699, category: "tech" },
  { id: "custom-landing", name: "Custom Landing Page", price: 999, category: "web" },
  { id: "dedicated-am", name: "Dedicated Account Manager", price: 1499, category: "marketing" },
  { id: "lead-crm-standard", name: "Lead CRM - Standard Website", price: 799, category: "tech" },
  { id: "lead-crm-ecommerce", name: "Lead CRM - E-Commerce", price: 1299, category: "tech" },
  { id: "ecommerce-integration", name: "E-Commerce Integration", price: 1999, category: "web" },
  { id: "crm-sync", name: "Advanced CRM Synchronization", price: 1299, category: "tech" },
  { id: "customer-portal", name: "Customer Portal", price: 1999, category: "web" },
  { id: "csat-survey", name: "Customer Satisfaction Survey", price: 499, category: "marketing" },
  { id: "google-review", name: "Google Review Automation", price: 699, category: "marketing" },
  { id: "whatsapp-bot", name: "WhatsApp CRM Bot", price: 1299, category: "tech" },
  { id: "tiktok-meta-shop", name: "TikTok Shop / Meta Shop Setup", price: 1499, category: "marketing" },
  { id: "video-editing", name: "Video Editing / Month", price: 999, category: "media" },
  { id: "express-delivery", name: "Express Delivery (48 Hours)", price: 500, category: "tech" },
  { id: "domain-ssl", name: "Custom Domain & SSL Setup", price: 299, category: "tech" },
  { id: "payment-gateway", name: "Payment Gateway Setup", price: 499, category: "tech" },
  { id: "bilingual-site", name: "Multilingual Website (Arabic)", price: 799, category: "web" },
  { id: "speed-optimization", name: "Speed Optimization", price: 499, category: "tech" },
  { id: "technical-seo", name: "Technical SEO & Indexing", price: 699, category: "seo" },
  { id: "photography", name: "Professional Photography", price: 600, category: "media" },
  { id: "maintenance", name: "Website Maintenance", price: 250, unit: "/ month", category: "tech" },
  { id: "hosting", name: "Hosting & Technical Management", price: 450, unit: "/ year", category: "tech" },
];
