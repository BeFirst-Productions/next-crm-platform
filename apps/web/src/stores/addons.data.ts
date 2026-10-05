export interface AddonItemData {
  id: string;
  name: string;
  price: number;
  unit?: string;
  category?: "web" | "marketing" | "seo" | "media" | "tech";
}

export const ALL_ADDONS: AddonItemData[] = [
  // Media / Production Services
  { id: "photography", name: "Professional Photography", price: 600, category: "media" },
  { id: "social-posts", name: "Extra Social media posts", price: 300, category: "marketing" },
  { id: "drone-shoot", name: "Drone Shoot", price: 700, category: "media" },
  { id: "extra-videos", name: "Extra Videos", price: 500, category: "media" },

  // Website & Core Tech Services
  { id: "extra-page", name: "Extra Website Page", price: 100, category: "web" },
  { id: "premium-uiux", name: "Premium UI/UX Design", price: 300, category: "web" },
  { id: "bilingual-site", name: "Arabic + English Website", price: 650, category: "web" },
  { id: "additional-lang", name: "Additional Language", price: 500, category: "web" },
  { id: "ecommerce-module", name: "E-Commerce Module", price: 1100, category: "web" },
  { id: "payment-gateway", name: "Payment Gateway Integration", price: 500, category: "tech" },
  { id: "booking-system", name: "Booking System", price: 650, category: "web" },
  { id: "admin-panel", name: "Advanced Admin Panel", price: 800, category: "tech" },
  { id: "blog-news", name: "Blog / News Module", price: 350, category: "web" },
  { id: "product-catalogue", name: "Product Catalogue", price: 450, category: "web" },
  { id: "whatsapp-api", name: "WhatsApp API Integration", price: 300, category: "tech" },
  { id: "crm-integration", name: "CRM Integration", price: 650, category: "tech" },
  { id: "third-party-api", name: "Third-Party API Integration", price: 400, category: "tech" },

  // SEO & Optimization Services
  { id: "advanced-seo", name: "Advanced SEO Setup", price: 750, category: "seo" },
  { id: "gbp-setup", name: "Google Business Profile Setup", price: 200, category: "seo" },
  { id: "analytics-setup", name: "Analytics & Search Console Setup", price: 200, category: "seo" },
  { id: "speed-optimization", name: "Speed Optimization", price: 400, category: "tech" },
  { id: "advanced-security", name: "Advanced Security", price: 300, category: "tech" },

  // Content & Maintenance Services
  { id: "content-writing", name: "Website Content Writing", price: 80, unit: "/ page", category: "marketing" },
  { id: "copywriting", name: "Professional Copywriting", price: 250, unit: "+", category: "marketing" },
  { id: "maintenance", name: "Website Maintenance", price: 250, unit: "/ month", category: "tech" },
  { id: "hosting", name: "Hosting & Technical Management", price: 450, unit: "/ year", category: "tech" },
];
