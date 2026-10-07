export interface AddonItemData {
  id: string;
  name: string;
  price: number;
  unit?: string;
  category?: "web" | "marketing" | "seo" | "media" | "tech";
}

export const ALL_ADDONS: AddonItemData[] = [
  // Primary Featured Services (Matching Prototype Reference)
  { id: "regular-content", name: "Regular Content Upgrades", price: 499, category: "marketing" },
  { id: "social-video", name: "Social Media Video Production", price: 1499, category: "media" },
  { id: "photo-shoot", name: "Photo Shoot", price: 999, category: "media" },
  { id: "technical-consultation", name: "Technical Consultation", price: 699, category: "tech" },

  // Catalogue Services
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
