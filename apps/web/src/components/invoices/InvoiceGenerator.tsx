"use client";

import * as React from "react";
import {
  Search,
  User,
  Mail,
  Phone,
  PhoneCall,
  Building2,
  FileText,
  ShieldCheck,
  UserCheck,
  Briefcase,
  Link2,
  Calendar,
  Layers,
  Receipt,
  MapPin,
  ArrowRight,
  ArrowLeft,
  Download,
  ChevronRight,
  Pencil,
  CreditCard,
} from "lucide-react";

// Client Data Model
export interface ClientRecord {
  id: string;
  initials: string;
  avatarColor: string;
  name: string;
  typeTag: string;
  clientType: "Corporate Client" | "SME";
  tagline: string;
  contactPerson: string;
  email: string;
  phone: string;
  alternatePhone: string;
  companyName: string;
  tradeLicense: string;
  trn: string;
  industry: string;
  source: string;
  accountManager: string;
  clientSince: string;
  totalProjects: number;
  totalInvoiced: string;
  addressLines: string[];
}

export const INITIAL_CLIENTS: ClientRecord[] = [
  {
    id: "cl-1",
    initials: "BS",
    avatarColor: "bg-[#2563eb]",
    name: "Bright Solutions LLC",
    typeTag: "UAE | Corporate Client",
    clientType: "Corporate Client",
    tagline: "Building digital success together",
    contactPerson: "Ahmed Raza",
    email: "contact@brightsolutions.ae",
    phone: "+971 50 123 4567",
    alternatePhone: "+971 4 567 8900",
    companyName: "Bright Solutions LLC",
    tradeLicense: "1234567",
    trn: "TRN1234567890003",
    industry: "Technology",
    source: "Website Inquiry",
    accountManager: "Rahul Sharma",
    clientSince: "12 Jan 2024",
    totalProjects: 5,
    totalInvoiced: "AED 48,750",
    addressLines: ["Office 1204, Business Bay,", "Dubai, UAE"],
  },
  {
    id: "cl-2",
    initials: "DT",
    avatarColor: "bg-[#0d9488]",
    name: "Dark Tech Trading",
    typeTag: "UAE | SME",
    clientType: "SME",
    tagline: "High performance IT solutions",
    contactPerson: "David Taylor",
    email: "info@darktechtrading.com",
    phone: "+971 52 987 6543",
    alternatePhone: "+971 4 332 1100",
    companyName: "Dark Tech Trading FZE",
    tradeLicense: "7654321",
    trn: "TRN9876543210001",
    industry: "E-Commerce & Tech",
    source: "Referral",
    accountManager: "Rahul Sharma",
    clientSince: "04 Mar 2024",
    totalProjects: 3,
    totalInvoiced: "AED 34,200",
    addressLines: ["Warehouse 4, Al Quoz Industrial 3,", "Dubai, UAE"],
  },
  {
    id: "cl-3",
    initials: "AG",
    avatarColor: "bg-[#8b5cf6]",
    name: "Al Ghaf Marketing",
    typeTag: "UAE | Corporate Client",
    clientType: "Corporate Client",
    tagline: "Pioneering brands across the Gulf",
    contactPerson: "Fatima Al Ghafri",
    email: "fatima@alghafmarketing.ae",
    phone: "+971 55 456 7890",
    alternatePhone: "+971 2 678 1234",
    companyName: "Al Ghaf Marketing & PR LLC",
    tradeLicense: "8923451",
    trn: "TRN5432167890004",
    industry: "Media & PR",
    source: "LinkedIn Campaign",
    accountManager: "Rahul Sharma",
    clientSince: "19 Nov 2023",
    totalProjects: 8,
    totalInvoiced: "AED 92,600",
    addressLines: ["Level 18, Nation Tower,", "Abu Dhabi, UAE"],
  },
  {
    id: "cl-4",
    initials: "SR",
    avatarColor: "bg-[#f97316]",
    name: "Skyline Retail LLC",
    typeTag: "UAE | SME",
    clientType: "SME",
    tagline: "Retail chains across prime malls",
    contactPerson: "Suresh Menon",
    email: "procurement@skylineretail.ae",
    phone: "+971 56 321 8765",
    alternatePhone: "+971 4 887 5544",
    companyName: "Skyline Retail LLC",
    tradeLicense: "3456789",
    trn: "TRN8765432190005",
    industry: "Retail & Apparel",
    source: "Cold Outreach",
    accountManager: "Rahul Sharma",
    clientSince: "28 Feb 2024",
    totalProjects: 2,
    totalInvoiced: "AED 21,500",
    addressLines: ["Unit 302, Deira City Center Tower,", "Dubai, UAE"],
  },
  {
    id: "cl-5",
    initials: "NH",
    avatarColor: "bg-[#6366f1]",
    name: "Noor Al Huda General Trading",
    typeTag: "UAE | Corporate Client",
    clientType: "Corporate Client",
    tagline: "Global import & export solutions",
    contactPerson: "Hassan Al Mansoori",
    email: "hassan@nooralhuda.ae",
    phone: "+971 50 876 5432",
    alternatePhone: "+971 6 524 3322",
    companyName: "Noor Al Huda Gen Trading LLC",
    tradeLicense: "4567890",
    trn: "TRN2345678900007",
    industry: "Import & Export",
    source: "Direct Referral",
    accountManager: "Rahul Sharma",
    clientSince: "08 Oct 2023",
    totalProjects: 6,
    totalInvoiced: "AED 73,400",
    addressLines: ["Plot 45, Sharjah Industrial Area 13,", "Sharjah, UAE"],
  },
  {
    id: "cl-6",
    initials: "MC",
    avatarColor: "bg-[#ec4899]",
    name: "MaxCare Services",
    typeTag: "UAE | SME",
    clientType: "SME",
    tagline: "Premium clinical and home care",
    contactPerson: "Dr. Maya Mathew",
    email: "admin@maxcare.ae",
    phone: "+971 54 234 5678",
    alternatePhone: "+971 4 456 7788",
    companyName: "MaxCare Healthcare Services LLC",
    tradeLicense: "5678901",
    trn: "TRN3456789010008",
    industry: "Healthcare",
    source: "Google Search",
    accountManager: "Rahul Sharma",
    clientSince: "15 Apr 2024",
    totalProjects: 4,
    totalInvoiced: "AED 39,800",
    addressLines: ["Building 64, Dubai Healthcare City,", "Dubai, UAE"],
  },
  {
    id: "cl-7",
    initials: "RB",
    avatarColor: "bg-[#10b981]",
    name: "Royal Builders LLC",
    typeTag: "UAE | Corporate Client",
    clientType: "Corporate Client",
    tagline: "Architectural luxury & construction",
    contactPerson: "Rashid Bin Butti",
    email: "management@royalbuilders.ae",
    phone: "+971 50 678 9012",
    alternatePhone: "+971 4 399 2211",
    companyName: "Royal Builders Contracting LLC",
    tradeLicense: "6789012",
    trn: "TRN4567890120009",
    industry: "Real Estate & Contracting",
    source: "Event Sponsorship",
    accountManager: "Rahul Sharma",
    clientSince: "11 Aug 2023",
    totalProjects: 7,
    totalInvoiced: "AED 115,000",
    addressLines: ["Floor 24, Boulevard Plaza Tower 1,", "Downtown Dubai, UAE"],
  },
  {
    id: "cl-8",
    initials: "TG",
    avatarColor: "bg-[#f59e0b]",
    name: "Traders Global",
    typeTag: "UAE | SME",
    clientType: "SME",
    tagline: "Fintech brokerage & liquidity",
    contactPerson: "Tariq Qureshi",
    email: "tariq@tradersglobal.com",
    phone: "+971 58 765 4321",
    alternatePhone: "+971 4 555 4321",
    companyName: "Traders Global DMCC",
    tradeLicense: "7890123",
    trn: "TRN5678901230001",
    industry: "Financial Services",
    source: "Website Inquiry",
    accountManager: "Rahul Sharma",
    clientSince: "22 May 2024",
    totalProjects: 3,
    totalInvoiced: "AED 28,900",
    addressLines: ["Unit 1102, Tiffany Tower, JLT Cluster W,", "Dubai, UAE"],
  },
  {
    id: "cl-9",
    initials: "OC",
    avatarColor: "bg-[#a855f7]",
    name: "Oceanic Group",
    typeTag: "UAE | Corporate Client",
    clientType: "Corporate Client",
    tagline: "Maritime shipping & offshore supply",
    contactPerson: "Captain Omar Farooq",
    email: "operations@oceanicgroup.ae",
    phone: "+971 52 345 6789",
    alternatePhone: "+971 4 881 2233",
    companyName: "Oceanic Maritime Group LLC",
    tradeLicense: "8901234",
    trn: "TRN6789012340002",
    industry: "Logistics & Marine",
    source: "Trade Expo",
    accountManager: "Rahul Sharma",
    clientSince: "05 Jan 2023",
    totalProjects: 9,
    totalInvoiced: "AED 164,500",
    addressLines: ["JAFZA South 15, Free Zone,", "Jebel Ali, Dubai, UAE"],
  },
  {
    id: "cl-10",
    initials: "VF",
    avatarColor: "bg-[#0284c7]",
    name: "Vision First",
    typeTag: "UAE | SME",
    clientType: "SME",
    tagline: "Creative optics and lifestyle accessories",
    contactPerson: "Vikram Malhotra",
    email: "contact@visionfirst.ae",
    phone: "+971 50 998 8776",
    alternatePhone: "+971 4 221 4455",
    companyName: "Vision First Eyewear Trading LLC",
    tradeLicense: "9012345",
    trn: "TRN7890123450003",
    industry: "Luxury Retail",
    source: "Instagram Inbound",
    accountManager: "Rahul Sharma",
    clientSince: "14 Jun 2024",
    totalProjects: 2,
    totalInvoiced: "AED 16,800",
    addressLines: ["Shop 18, Mall of the Emirates Annex,", "Dubai, UAE"],
  },
  {
    id: "cl-11",
    initials: "BM",
    avatarColor: "bg-[#06b6d4]",
    name: "BlueWave Media",
    typeTag: "UAE | Corporate Client",
    clientType: "Corporate Client",
    tagline: "Outdoor LED billboards and activations",
    contactPerson: "Bassem Khatib",
    email: "info@bluewavemedia.ae",
    phone: "+971 55 112 2334",
    alternatePhone: "+971 4 367 9900",
    companyName: "BlueWave Advertising Solutions FZ",
    tradeLicense: "9123456",
    trn: "TRN8901234560004",
    industry: "Advertising",
    source: "Direct Referral",
    accountManager: "Rahul Sharma",
    clientSince: "09 Sep 2023",
    totalProjects: 6,
    totalInvoiced: "AED 85,000",
    addressLines: ["Dubai Media City, Building 9,", "Dubai, UAE"],
  },
  {
    id: "cl-12",
    initials: "EC",
    avatarColor: "bg-[#16a34a]",
    name: "Emirates Cloud IT",
    typeTag: "UAE | SME",
    clientType: "SME",
    tagline: "Managed cloud infrastructure & backup",
    contactPerson: "Eyad Al Shaer",
    email: "eyad@emiratescloud.ae",
    phone: "+971 52 443 3221",
    alternatePhone: "+971 4 295 8877",
    companyName: "Emirates Cloud IT Services LLC",
    tradeLicense: "9234567",
    trn: "TRN9012345670005",
    industry: "Cloud & Cyber",
    source: "Google Ads",
    accountManager: "Rahul Sharma",
    clientSince: "18 Nov 2023",
    totalProjects: 4,
    totalInvoiced: "AED 42,300",
    addressLines: ["Office 504, Al Garhoud Star Building,", "Dubai, UAE"],
  },
  {
    id: "cl-13",
    initials: "AP",
    avatarColor: "bg-[#db2777]",
    name: "Apex Properties Dubai",
    typeTag: "UAE | Corporate Client",
    clientType: "Corporate Client",
    tagline: "Ultra-luxury villas in Palm Jumeirah",
    contactPerson: "Alexander Price",
    email: "alex@apexproperties.ae",
    phone: "+971 58 889 9001",
    alternatePhone: "+971 4 429 0011",
    companyName: "Apex Luxury Real Estate LLC",
    tradeLicense: "9345678",
    trn: "TRN0123456780006",
    industry: "Real Estate Brokerage",
    source: "Client Referral",
    accountManager: "Rahul Sharma",
    clientSince: "02 Feb 2024",
    totalProjects: 5,
    totalInvoiced: "AED 98,200",
    addressLines: ["Penthouse 48, Marina Gate 2,", "Dubai Marina, UAE"],
  },
  {
    id: "cl-14",
    initials: "NS",
    avatarColor: "bg-[#3b82f6]",
    name: "Nexus Logistics",
    typeTag: "UAE | SME",
    clientType: "SME",
    tagline: "Last mile delivery & cross-border freight",
    contactPerson: "Nadeem Siddiqui",
    email: "nadeem@nexuslogistics.ae",
    phone: "+971 50 776 5412",
    alternatePhone: "+971 4 883 9988",
    companyName: "Nexus Express Logistics LLC",
    tradeLicense: "9456789",
    trn: "TRN1234567890010",
    industry: "Transportation",
    source: "Website Inquiry",
    accountManager: "Rahul Sharma",
    clientSince: "29 Mar 2024",
    totalProjects: 3,
    totalInvoiced: "AED 31,600",
    addressLines: ["Dubai South Logistics City, Unit 8,", "Dubai, UAE"],
  },
  {
    id: "cl-15",
    initials: "GS",
    avatarColor: "bg-[#9333ea]",
    name: "Gulf Horizon Real Estate",
    typeTag: "UAE | Corporate Client",
    clientType: "Corporate Client",
    tagline: "Commercial towers & lease management",
    contactPerson: "Ghazi Al Sabti",
    email: "ghazi@gulfhorizon.ae",
    phone: "+971 55 334 4556",
    alternatePhone: "+971 2 445 6677",
    companyName: "Gulf Horizon Properties PJSC",
    tradeLicense: "9567890",
    trn: "TRN2345678900011",
    industry: "Real Estate Development",
    source: "Direct VIP Invite",
    accountManager: "Rahul Sharma",
    clientSince: "14 Jul 2023",
    totalProjects: 11,
    totalInvoiced: "AED 210,000",
    addressLines: ["Al Reem Island, Sky Tower Floor 30,", "Abu Dhabi, UAE"],
  },
  {
    id: "cl-16",
    initials: "PT",
    avatarColor: "bg-[#14b8a6]",
    name: "Prime Tech Innovations",
    typeTag: "UAE | SME",
    clientType: "SME",
    tagline: "Custom mobile apps & AI automation",
    contactPerson: "Priya Tandon",
    email: "priya@primetech.ae",
    phone: "+971 56 654 3210",
    alternatePhone: "+971 4 388 9911",
    companyName: "Prime Technologies FZ-LLC",
    tradeLicense: "9678901",
    trn: "TRN3456789010012",
    industry: "Software Engineering",
    source: "LinkedIn Inbound",
    accountManager: "Rahul Sharma",
    clientSince: "05 May 2024",
    totalProjects: 2,
    totalInvoiced: "AED 26,000",
    addressLines: ["Dubai Internet City, Building 12,", "Dubai, UAE"],
  },
  {
    id: "cl-17",
    initials: "FM",
    avatarColor: "bg-[#ea580c]",
    name: "Future Minds Consultancy",
    typeTag: "UAE | Corporate Client",
    clientType: "Corporate Client",
    tagline: "Executive recruitment & workforce strategy",
    contactPerson: "Faisal Al Mutawa",
    email: "info@futureminds.ae",
    phone: "+971 50 119 9223",
    alternatePhone: "+971 4 430 7766",
    companyName: "Future Minds Human Capital LLC",
    tradeLicense: "9789012",
    trn: "TRN4567890120013",
    industry: "Management Consulting",
    source: "Referral",
    accountManager: "Rahul Sharma",
    clientSince: "19 Dec 2023",
    totalProjects: 5,
    totalInvoiced: "AED 64,800",
    addressLines: ["DIFC Gate Village, Building 03,", "Dubai, UAE"],
  },
  {
    id: "cl-18",
    initials: "AL",
    avatarColor: "bg-[#d97706]",
    name: "Atlas Trading FZ",
    typeTag: "UAE | SME",
    clientType: "SME",
    tagline: "Industrial machinery spare parts",
    contactPerson: "Ali Al Lawati",
    email: "ali@atlastrading.ae",
    phone: "+971 52 887 7665",
    alternatePhone: "+971 9 223 4455",
    companyName: "Atlas Global Machinery FZC",
    tradeLicense: "9890123",
    trn: "TRN5678901230014",
    industry: "Heavy Equipment",
    source: "Industry Directory",
    accountManager: "Rahul Sharma",
    clientSince: "10 Feb 2024",
    totalProjects: 3,
    totalInvoiced: "AED 37,200",
    addressLines: ["Fujairah Free Zone, Phase 2,", "Fujairah, UAE"],
  },
  {
    id: "cl-19",
    initials: "ZM",
    avatarColor: "bg-[#4f46e5]",
    name: "Zenith Media Hub",
    typeTag: "UAE | Corporate Client",
    clientType: "Corporate Client",
    tagline: "Podcast studios & digital video production",
    contactPerson: "Zaid Makki",
    email: "zaid@zenithhub.ae",
    phone: "+971 55 990 0112",
    alternatePhone: "+971 4 391 5544",
    companyName: "Zenith Creative Media Production LLC",
    tradeLicense: "9901234",
    trn: "TRN6789012340015",
    industry: "Broadcasting & Content",
    source: "Instagram DM",
    accountManager: "Rahul Sharma",
    clientSince: "30 Mar 2024",
    totalProjects: 4,
    totalInvoiced: "AED 58,000",
    addressLines: ["Dubai Production City, Media Hub 4,", "Dubai, UAE"],
  },
  {
    id: "cl-20",
    initials: "CS",
    avatarColor: "bg-[#059669]",
    name: "Crescent Solutions",
    typeTag: "UAE | SME",
    clientType: "SME",
    tagline: "Solar panels and energy efficiency systems",
    contactPerson: "Chethan Shetty",
    email: "chethan@crescentenergy.ae",
    phone: "+971 54 887 6655",
    alternatePhone: "+971 4 345 8899",
    companyName: "Crescent Green Solutions LLC",
    tradeLicense: "9912345",
    trn: "TRN7890123450016",
    industry: "Renewable Energy",
    source: "Green Expo Dubai",
    accountManager: "Rahul Sharma",
    clientSince: "15 Jan 2024",
    totalProjects: 3,
    totalInvoiced: "AED 44,500",
    addressLines: ["Al Barsha 1, Elite Business Centre,", "Dubai, UAE"],
  },
  {
    id: "cl-21",
    initials: "SD",
    avatarColor: "bg-[#e11d48]",
    name: "Silverline Dental Care",
    typeTag: "UAE | SME",
    clientType: "SME",
    tagline: "Cosmetic dentistry & smile makeovers",
    contactPerson: "Dr. Sarah D'Souza",
    email: "contact@silverlinedental.ae",
    phone: "+971 50 445 5667",
    alternatePhone: "+971 4 344 8822",
    companyName: "Silverline Polyclinic & Dental LLC",
    tradeLicense: "9923456",
    trn: "TRN8901234560017",
    industry: "Dental Healthcare",
    source: "TikTok Inbound",
    accountManager: "Rahul Sharma",
    clientSince: "20 May 2024",
    totalProjects: 2,
    totalInvoiced: "AED 19,500",
    addressLines: ["Jumeirah Beach Road, Villa 412,", "Dubai, UAE"],
  },
  {
    id: "cl-22",
    initials: "OR",
    avatarColor: "bg-[#7c3aed]",
    name: "Omni Retail Group",
    typeTag: "UAE | Corporate Client",
    clientType: "Corporate Client",
    tagline: "Supermarket chains & distribution centers",
    contactPerson: "Omar Radwan",
    email: "omar@omniretail.ae",
    phone: "+971 55 778 8990",
    alternatePhone: "+971 4 885 6677",
    companyName: "Omni FMCG & Retail Holding LLC",
    tradeLicense: "9934567",
    trn: "TRN9012345670018",
    industry: "FMCG & Groceries",
    source: "Direct Referral",
    accountManager: "Rahul Sharma",
    clientSince: "12 Nov 2023",
    totalProjects: 8,
    totalInvoiced: "AED 124,000",
    addressLines: ["Dubai Investments Park 1, Phase 3,", "Dubai, UAE"],
  },
  {
    id: "cl-23",
    initials: "KA",
    avatarColor: "bg-[#0284c7]",
    name: "Khaleej Automation LLC",
    typeTag: "UAE | Corporate Client",
    clientType: "Corporate Client",
    tagline: "Smart building sensors & IoT controllers",
    contactPerson: "Khalid Al Zaabi",
    email: "khalid@khaleejautomation.ae",
    phone: "+971 50 332 2110",
    alternatePhone: "+971 2 554 4332",
    companyName: "Khaleej Smart Automation Systems LLC",
    tradeLicense: "9945678",
    trn: "TRN0123456780019",
    industry: "IoT & Smart Automation",
    source: "Gitex Technology Week",
    accountManager: "Rahul Sharma",
    clientSince: "27 Aug 2023",
    totalProjects: 6,
    totalInvoiced: "AED 89,400",
    addressLines: ["Mussafah Industrial Area M-14,", "Abu Dhabi, UAE"],
  },
  {
    id: "cl-24",
    initials: "BL",
    avatarColor: "bg-[#0f766e]",
    name: "Beacon Legal Partners",
    typeTag: "UAE | Corporate Client",
    clientType: "Corporate Client",
    tagline: "Corporate governance & arbitration solicitors",
    contactPerson: "Bilal Latif",
    email: "bilal@beaconlegal.ae",
    phone: "+971 56 123 9876",
    alternatePhone: "+971 4 311 2200",
    companyName: "Beacon Legal Advocacy & Consultancy",
    tradeLicense: "9956789",
    trn: "TRN1234567890020",
    industry: "Legal Services",
    source: "VIP Referral",
    accountManager: "Rahul Sharma",
    clientSince: "05 Feb 2024",
    totalProjects: 4,
    totalInvoiced: "AED 56,000",
    addressLines: ["Al Saada Tower, Floor 14, Trade Centre 1,", "Dubai, UAE"],
  },
];

// Packages Data Model
export interface InvoicePackage {
  id: string;
  name: string;
  subtitle: string;
  category: string;
  features: string[];
  price: number;
}

export interface InvoiceAddon {
  id: string;
  name: string;
  description: string;
  price: number;
}

export const INVOICE_PACKAGES: InvoicePackage[] = [
  {
    id: "pkg-1",
    name: "Website Development",
    subtitle: "Build a powerful online presence with modern, responsive websites.",
    category: "Website",
    features: [
      "Custom & Responsive Design",
      "Up to 10 Pages (as per package)",
      "CMS Integration (WordPress / Custom)",
      "Basic SEO Setup",
      "Contact Forms & Integrations",
      "1 Year Technical Support",
    ],
    price: 2999,
  },
  {
    id: "pkg-2",
    name: "Digital Marketing",
    subtitle: "Grow your brand. Reach more people online.",
    category: "Marketing",
    features: [
      "Social Media Management",
      "Content Creation (Posts, Reels, Stories)",
      "Paid Ads (Meta, Google, TikTok)",
      "Monthly Performance Report",
      "Strategy & Consultation",
      "Dedicated Account Manager",
    ],
    price: 1499,
  },
];

export const INVOICE_ADDONS: InvoiceAddon[] = [
  {
    id: "addon-1",
    name: "Additional Pages (per page)",
    description: "Design and development for extra pages",
    price: 299,
  },
  {
    id: "addon-2",
    name: "Content Writing",
    description: "Professional content writing for website pages",
    price: 499,
  },
  {
    id: "addon-3",
    name: "SEO Setup",
    description: "On-page SEO optimization",
    price: 399,
  },
  {
    id: "addon-4",
    name: "Multi-language Support",
    description: "Add multiple language functionality",
    price: 699,
  },
  {
    id: "addon-5",
    name: "Advanced Contact Forms",
    description: "Custom forms with integrations",
    price: 299,
  },
];

export function InvoiceGenerator() {
  const [currentStep, setCurrentStep] = React.useState<1 | 2 | 3>(1);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedClientId, setSelectedClientId] = React.useState<string>("cl-1");

  // Filter clients
  const filteredClients = React.useMemo(() => {
    if (!searchQuery.trim()) return INITIAL_CLIENTS;
    const q = searchQuery.toLowerCase();
    return INITIAL_CLIENTS.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        c.contactPerson.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const selectedClient = React.useMemo(() => {
    return INITIAL_CLIENTS.find((c) => c.id === selectedClientId) || INITIAL_CLIENTS[0];
  }, [selectedClientId]);

  // Calculations for Step 2 & 3
  // Packages (2) = 2,999 + 1,499 = 4,498
  // Add-ons (5) = 299 + 499 + 399 + 699 + 299 = 2,195
  // Subtotal = 6,693
  // VAT (5%) = 334.65
  // Total Amount = 7,027.65
  const packagesTotal = React.useMemo(() => {
    return INVOICE_PACKAGES.reduce((sum, pkg) => sum + pkg.price, 0);
  }, []);

  const addonsTotal = React.useMemo(() => {
    return INVOICE_ADDONS.reduce((sum, addon) => sum + addon.price, 0);
  }, []);

  const subtotal = packagesTotal + addonsTotal;
  const vatAmount = subtotal * 0.05;
  const totalAmount = subtotal + vatAmount;

  return (
    <div className="space-y-5 animate-fade-in pb-12 select-none">
      {/* -------------------------------------------------------------------- */}
      {/* Top Header & 3-Step Wizard Navigation */}
      {/* -------------------------------------------------------------------- */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-1">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Invoice Generator
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            {currentStep === 1 && "Select a client to view details and proceed."}
            {currentStep === 2 && "Select packages and add-ons for your client."}
            {currentStep === 3 && "Review all details before generating and downloading the invoice."}
          </p>
        </div>

        {/* Stepper Progress Indicator */}
        <div className="flex items-center gap-3 sm:gap-6 self-start lg:self-auto select-none">
          {/* Step 1 */}
          <div
            onClick={() => setCurrentStep(1)}
            className="flex flex-col items-center gap-1 cursor-pointer group"
          >
            <div
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                currentStep === 1
                  ? "bg-[#0070f3] text-white shadow-[0_0_12px_rgba(0,112,243,0.6)] ring-2 ring-blue-400/40"
                  : "bg-[#081226] border border-[#162744] text-slate-300 group-hover:border-cyan-500/50"
              }`}
            >
              1
            </div>
            <span
              className={`text-[11px] font-medium transition-colors ${
                currentStep === 1 ? "text-white font-semibold" : "text-slate-400"
              }`}
            >
              Client Details
            </span>
          </div>

          {/* Line 1 -> 2 */}
          <div
            className={`w-12 sm:w-20 h-[2px] -mt-4 transition-colors ${
              currentStep >= 2 ? "bg-[#0070f3]" : "bg-[#14233e]"
            }`}
          />

          {/* Step 2 */}
          <div
            onClick={() => setCurrentStep(2)}
            className="flex flex-col items-center gap-1 cursor-pointer group"
          >
            <div
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                currentStep === 2
                  ? "bg-[#0070f3] text-white shadow-[0_0_12px_rgba(0,112,243,0.6)] ring-2 ring-blue-400/40"
                  : "bg-[#081226] border border-[#162744] text-slate-300 group-hover:border-cyan-500/50"
              }`}
            >
              2
            </div>
            <span
              className={`text-[11px] font-medium transition-colors ${
                currentStep === 2 ? "text-white font-semibold" : "text-slate-400"
              }`}
            >
              Package Details
            </span>
          </div>

          {/* Line 2 -> 3 */}
          <div
            className={`w-12 sm:w-20 h-[2px] -mt-4 transition-colors ${
              currentStep === 3 ? "bg-[#0070f3]" : "bg-[#14233e]"
            }`}
          />

          {/* Step 3 */}
          <div
            onClick={() => setCurrentStep(3)}
            className="flex flex-col items-center gap-1 cursor-pointer group"
          >
            <div
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                currentStep === 3
                  ? "bg-[#0070f3] text-white shadow-[0_0_12px_rgba(0,112,243,0.6)] ring-2 ring-blue-400/40"
                  : "bg-[#081226] border border-[#162744] text-slate-300 group-hover:border-cyan-500/50"
              }`}
            >
              3
            </div>
            <span
              className={`text-[11px] font-medium transition-colors ${
                currentStep === 3 ? "text-white font-semibold" : "text-slate-400"
              }`}
            >
              Review &amp; Download
            </span>
          </div>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* STEP 1: CLIENT SELECTION & PROFILE VIEW */}
      {/* ==================================================================== */}
      {currentStep === 1 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Left Column: Clients List (24) */}
          <div className="lg:col-span-5 bg-[#091224] border border-[#14233e] rounded-2xl p-4 sm:p-5 shadow-2xl flex flex-col h-[700px]">
            {/* Title */}
            <div className="flex items-center justify-between pb-3">
              <h2 className="text-sm font-bold text-white tracking-wide">
                Clients ({INITIAL_CLIENTS.length})
              </h2>
              <span className="text-[11px] text-cyan-400 bg-cyan-950/60 border border-cyan-800/40 px-2 py-0.5 rounded-full font-medium">
                Verified
              </span>
            </div>

            {/* Search Input */}
            <div className="relative mb-3.5">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search client name, email or phone..."
                className="w-full bg-[#060b14] border border-[#15233c] hover:border-[#1e345c] focus:border-cyan-500/70 focus:ring-1 focus:ring-cyan-500/20 text-xs text-slate-200 placeholder:text-slate-500 rounded-xl pl-3.5 pr-9 py-2.5 outline-none transition-all"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
            </div>

            {/* Scrollable Clients List */}
            <div className="flex-1 overflow-y-auto space-y-1.5 pr-1.5 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
              {filteredClients.map((client) => {
                const isSelected = client.id === selectedClientId;
                return (
                  <div
                    key={client.id}
                    onClick={() => setSelectedClientId(client.id)}
                    className={`flex items-center justify-between p-2.5 sm:p-3 rounded-xl transition-all cursor-pointer group ${
                      isSelected
                        ? "border border-cyan-500/70 bg-gradient-to-r from-[#0b2447] to-[#091b35] shadow-[0_0_15px_rgba(0,180,240,0.18)]"
                        : "border border-transparent hover:border-[#172747] hover:bg-[#0c182e]/60"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Avatar Initials Circle */}
                      <div
                        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm text-white shrink-0 shadow-md ${client.avatarColor}`}
                      >
                        {client.initials}
                      </div>

                      {/* Client Info */}
                      <div className="min-w-0">
                        <p
                          className={`text-xs sm:text-sm font-semibold truncate leading-tight transition-colors ${
                            isSelected ? "text-white" : "text-slate-200 group-hover:text-white"
                          }`}
                        >
                          {client.name}
                        </p>
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">
                          {client.typeTag}
                        </p>
                      </div>
                    </div>

                    {/* Chevron Indicator */}
                    <ChevronRight
                      className={`w-4 h-4 shrink-0 transition-transform ${
                        isSelected
                          ? "text-cyan-400 translate-x-0.5"
                          : "text-slate-600 group-hover:text-slate-400"
                      }`}
                    />
                  </div>
                );
              })}

              {filteredClients.length === 0 && (
                <div className="py-12 text-center text-slate-500 text-xs">
                  No clients matching &quot;{searchQuery}&quot;
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Client Details */}
          <div className="lg:col-span-7 bg-[#091224] border border-[#14233e] rounded-2xl p-5 sm:p-6 shadow-2xl flex flex-col justify-between h-[700px]">
            <div className="space-y-6">
              {/* Header Title */}
              <h2 className="text-sm font-bold text-white tracking-wide">
                Client Details
              </h2>

              {/* Client Profile Header Badge */}
              <div className="flex items-center gap-4 pb-1">
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center font-extrabold text-xl text-white shrink-0 shadow-lg shadow-blue-600/30 ${selectedClient.avatarColor}`}
                >
                  {selectedClient.initials}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                      {selectedClient.name}
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#0c2445] text-cyan-400 border border-cyan-500/40">
                      {selectedClient.clientType}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {selectedClient.tagline}
                  </p>
                </div>
              </div>

              {/* Metadata Details Grid (2 Columns) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3.5 pt-1">
                {/* Left Column Fields */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2.5">
                    <User className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="text-xs text-slate-400 w-36 shrink-0">
                      Contact Person
                    </span>
                    <span className="text-xs font-semibold text-slate-100 truncate">
                      {selectedClient.contactPerson}
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="text-xs text-slate-400 w-36 shrink-0">
                      Email Address
                    </span>
                    <span className="text-xs font-semibold text-slate-100 truncate">
                      {selectedClient.email}
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="text-xs text-slate-400 w-36 shrink-0">
                      Phone Number
                    </span>
                    <span className="text-xs font-semibold text-slate-100 truncate">
                      {selectedClient.phone}
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <PhoneCall className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="text-xs text-slate-400 w-36 shrink-0">
                      Alternate Number
                    </span>
                    <span className="text-xs font-semibold text-slate-100 truncate">
                      {selectedClient.alternatePhone}
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="text-xs text-slate-400 w-36 shrink-0">
                      Company Name
                    </span>
                    <span className="text-xs font-semibold text-slate-100 truncate">
                      {selectedClient.companyName}
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="text-xs text-slate-400 w-36 shrink-0">
                      Trade License No.
                    </span>
                    <span className="text-xs font-semibold text-slate-100 truncate">
                      {selectedClient.tradeLicense}
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="text-xs text-slate-400 w-36 shrink-0">
                      Tax Registration No.
                    </span>
                    <span className="text-xs font-semibold text-slate-100 truncate">
                      {selectedClient.trn}
                    </span>
                  </div>
                </div>

                {/* Right Column Fields */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2.5">
                    <UserCheck className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="text-xs text-slate-400 w-36 shrink-0">
                      Client Type
                    </span>
                    <span className="text-xs font-semibold text-slate-100 truncate">
                      {selectedClient.clientType}
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <Briefcase className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="text-xs text-slate-400 w-36 shrink-0">
                      Industry
                    </span>
                    <span className="text-xs font-semibold text-slate-100 truncate">
                      {selectedClient.industry}
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <Link2 className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="text-xs text-slate-400 w-36 shrink-0">
                      Source
                    </span>
                    <span className="text-xs font-semibold text-slate-100 truncate">
                      {selectedClient.source}
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <User className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="text-xs text-slate-400 w-36 shrink-0">
                      Account Manager
                    </span>
                    <span className="text-xs font-semibold text-slate-100 truncate">
                      {selectedClient.accountManager}
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="text-xs text-slate-400 w-36 shrink-0">
                      Client Since
                    </span>
                    <span className="text-xs font-semibold text-slate-100 truncate">
                      {selectedClient.clientSince}
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <Layers className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="text-xs text-slate-400 w-36 shrink-0">
                      Total Projects
                    </span>
                    <span className="text-xs font-semibold text-slate-100 truncate">
                      {selectedClient.totalProjects}
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <Receipt className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="text-xs text-slate-400 w-36 shrink-0">
                      Total Invoiced
                    </span>
                    <span className="text-xs font-semibold text-cyan-300 truncate">
                      {selectedClient.totalInvoiced}
                    </span>
                  </div>
                </div>
              </div>

              {/* Address Section */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-xs font-medium text-slate-300">Address</span>
                </div>
                <div className="bg-[#060b14] border border-[#14233e] rounded-xl p-3.5 text-xs text-slate-300 leading-relaxed font-normal">
                  {selectedClient.addressLines.map((line, idx) => (
                    <p key={idx}>{line}</p>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Action Footer */}
            <div className="pt-4 border-t border-[#14233e] flex items-center justify-end">
              <button
                onClick={() => setCurrentStep(2)}
                className="bg-[#0066ff] hover:bg-[#0055d4] active:bg-[#0047b3] text-white text-xs sm:text-sm font-semibold px-8 py-2.5 rounded-xl flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
              >
                <span>Next</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* STEP 2: PACKAGE DETAILS & ADD-ONS (MATCHING IMAGE 1) */}
      {/* ==================================================================== */}
      {currentStep === 2 && (
        <div className="space-y-5 animate-fade-in">
          {/* Top Card: Selected Packages (2) */}
          <div className="bg-[#091224] border border-[#14233e] rounded-2xl p-5 sm:p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#14233e]">
              <h2 className="text-sm sm:text-base font-bold text-white tracking-wide">
                Selected Packages ({INVOICE_PACKAGES.length})
              </h2>
              <span className="text-xs text-slate-400">
                {INVOICE_PACKAGES.length} packages selected
              </span>
            </div>

            {/* Table of Packages */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#14233e] text-slate-400">
                    <th className="py-3 px-4 font-semibold w-12">#</th>
                    <th className="py-3 px-4 font-semibold w-72">Package Name</th>
                    <th className="py-3 px-4 font-semibold w-40">Category</th>
                    <th className="py-3 px-4 font-semibold">Features</th>
                    <th className="py-3 px-4 font-semibold text-right w-36">Price (AED)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#14233e]">
                  {INVOICE_PACKAGES.map((pkg, idx) => (
                    <tr key={pkg.id} className="hover:bg-[#0c182e]/40 transition-colors">
                      <td className="py-4 px-4 font-medium text-slate-400 align-top">
                        {idx + 1}
                      </td>
                      <td className="py-4 px-4 align-top">
                        <p className="text-sm font-bold text-white">{pkg.name}</p>
                        <p className="text-xs text-slate-400 mt-1 max-w-xs leading-relaxed">
                          {pkg.subtitle}
                        </p>
                      </td>
                      <td className="py-4 px-4 text-slate-300 align-top">
                        {pkg.category}
                      </td>
                      <td className="py-4 px-4 align-top">
                        <ul className="space-y-1.5">
                          {pkg.features.map((feature, fIdx) => (
                            <li key={fIdx} className="flex items-center gap-2 text-slate-300">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#0099ff] shrink-0" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td className="py-4 px-4 text-right font-extrabold text-white text-sm align-top">
                        {pkg.price.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bottom Card: Add-ons for Website Development */}
          <div className="bg-[#091224] border border-[#14233e] rounded-2xl p-5 sm:p-6 shadow-2xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2 border-b border-[#14233e]">
              <div className="flex items-baseline gap-2 flex-wrap">
                <h2 className="text-sm sm:text-base font-bold text-white tracking-wide">
                  Add-ons for Website Development
                </h2>
                <span className="text-xs text-slate-400">
                  Additional services available for the selected package.
                </span>
              </div>
              <span className="text-xs text-slate-400">
                {INVOICE_ADDONS.length} add-ons shown
              </span>
            </div>

            {/* Table of Add-ons */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#14233e] text-slate-400">
                    <th className="py-3 px-4 font-semibold w-12">#</th>
                    <th className="py-3 px-4 font-semibold w-72">Add-on Name</th>
                    <th className="py-3 px-4 font-semibold">Description</th>
                    <th className="py-3 px-4 font-semibold text-right w-36">Price (AED)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#14233e]">
                  {INVOICE_ADDONS.map((addon, idx) => (
                    <tr key={addon.id} className="hover:bg-[#0c182e]/40 transition-colors">
                      <td className="py-3.5 px-4 font-medium text-slate-400">
                        {idx + 1}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-200">
                        {addon.name}
                      </td>
                      <td className="py-3.5 px-4 text-slate-400">
                        {addon.description}
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-slate-200">
                        {addon.price.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Navigation Action Buttons */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => setCurrentStep(1)}
              className="bg-[#0b1426] hover:bg-[#121f38] text-slate-200 border border-[#162544] text-xs sm:text-sm font-medium px-6 py-2.5 rounded-xl flex items-center gap-2 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              onClick={() => setCurrentStep(3)}
              className="bg-[#0066ff] hover:bg-[#0055d4] active:bg-[#0047b3] text-white text-xs sm:text-sm font-semibold px-8 py-2.5 rounded-xl flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* STEP 3: INVOICE GENERATOR REVIEW (MATCHING IMAGE 2) */}
      {/* ==================================================================== */}
      {currentStep === 3 && (
        <div className="space-y-5 animate-fade-in">
          {/* Top Bar: Review & Download title + PDF Download CTA */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#091224] border border-[#14233e] rounded-2xl p-4 sm:p-5 shadow-xl">
            <div>
              <h2 className="text-base font-bold text-white tracking-wide">
                Review &amp; Download
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Please verify all the details below before generating the invoice.
              </p>
            </div>

            <button
              onClick={() => window.print()}
              className="bg-[#0066ff] hover:bg-[#0055d4] text-white text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer self-start sm:self-auto"
            >
              <Download className="w-4 h-4" />
              <span>Download Invoice (PDF)</span>
            </button>
          </div>

          {/* Main 2-Column Content Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* Left Column (8 Cols): Client Details + Selected Packages + Selected Add-ons */}
            <div className="lg:col-span-8 space-y-5">
              {/* Card 1: Client Details */}
              <div className="bg-[#091224] border border-[#14233e] rounded-2xl p-5 shadow-2xl space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-[#14233e]">
                  <h3 className="text-sm font-bold text-white tracking-wide">
                    Client Details
                  </h3>
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-[#0b162c] hover:bg-[#122340] border border-[#182b4a] px-3 py-1 rounded-lg transition-colors cursor-pointer"
                  >
                    <Pencil className="w-3 h-3" />
                    <span>Edit</span>
                  </button>
                </div>

                {/* Identity header */}
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-base text-white shrink-0 shadow-md ${selectedClient.avatarColor}`}
                  >
                    {selectedClient.initials}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-base font-bold text-white">
                        {selectedClient.name}
                      </h4>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#0c2445] text-cyan-400 border border-cyan-500/40">
                        {selectedClient.clientType}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {selectedClient.tagline}
                    </p>
                  </div>
                </div>

                {/* 2-Column Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2.5 pt-1 text-xs">
                  {/* Left Column */}
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="text-slate-400 w-32 shrink-0">Contact Person</span>
                      <span className="font-medium text-slate-100 truncate">
                        {selectedClient.contactPerson}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="text-slate-400 w-32 shrink-0">Email Address</span>
                      <span className="font-medium text-slate-100 truncate">
                        {selectedClient.email}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="text-slate-400 w-32 shrink-0">Phone Number</span>
                      <span className="font-medium text-slate-100 truncate">
                        {selectedClient.phone}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="text-slate-400 w-32 shrink-0">Company Name</span>
                      <span className="font-medium text-slate-100 truncate">
                        {selectedClient.companyName}
                      </span>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="text-slate-400 w-32 shrink-0">Industry</span>
                      <span className="font-medium text-slate-100 truncate">
                        {selectedClient.industry}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="text-slate-400 w-32 shrink-0">Source</span>
                      <span className="font-medium text-slate-100 truncate">
                        {selectedClient.source}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <UserCheck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="text-slate-400 w-32 shrink-0">Account Manager</span>
                      <span className="font-medium text-slate-100 truncate">
                        {selectedClient.accountManager}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="text-slate-400 w-32 shrink-0">Client Since</span>
                      <span className="font-medium text-slate-100 truncate">
                        {selectedClient.clientSince}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: Selected Packages (2) */}
              <div className="bg-[#091224] border border-[#14233e] rounded-2xl p-5 shadow-2xl space-y-3">
                <h3 className="text-sm font-bold text-white tracking-wide pb-2 border-b border-[#14233e]">
                  Selected Packages ({INVOICE_PACKAGES.length})
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-[#14233e] text-slate-400">
                        <th className="py-2.5 px-3 font-semibold w-10">#</th>
                        <th className="py-2.5 px-3 font-semibold w-64">Package Name</th>
                        <th className="py-2.5 px-3 font-semibold">Key Features</th>
                        <th className="py-2.5 px-3 font-semibold text-right w-32">Price (AED)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#14233e]">
                      {INVOICE_PACKAGES.map((pkg, idx) => (
                        <tr key={pkg.id} className="hover:bg-[#0c182e]/40">
                          <td className="py-3 px-3 text-slate-400 align-top font-medium">
                            {idx + 1}
                          </td>
                          <td className="py-3 px-3 font-bold text-white align-top">
                            {pkg.name}
                          </td>
                          <td className="py-3 px-3 align-top">
                            <ul className="space-y-1">
                              {pkg.features.map((feature, fIdx) => (
                                <li key={fIdx} className="flex items-center gap-2 text-slate-300">
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#0099ff] shrink-0" />
                                  <span>{feature}</span>
                                </li>
                              ))}
                            </ul>
                          </td>
                          <td className="py-3 px-3 text-right font-extrabold text-white align-top">
                            {pkg.price.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Card 3: Selected Add-ons (5) */}
              <div className="bg-[#091224] border border-[#14233e] rounded-2xl p-5 shadow-2xl space-y-3">
                <h3 className="text-sm font-bold text-white tracking-wide pb-2 border-b border-[#14233e]">
                  Selected Add-ons ({INVOICE_ADDONS.length})
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-[#14233e] text-slate-400">
                        <th className="py-2.5 px-3 font-semibold w-10">#</th>
                        <th className="py-2.5 px-3 font-semibold w-64">Add-on Name</th>
                        <th className="py-2.5 px-3 font-semibold">Description</th>
                        <th className="py-2.5 px-3 font-semibold text-right w-32">Price (AED)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#14233e]">
                      {INVOICE_ADDONS.map((addon, idx) => (
                        <tr key={addon.id} className="hover:bg-[#0c182e]/40">
                          <td className="py-2.5 px-3 text-slate-400 font-medium">
                            {idx + 1}
                          </td>
                          <td className="py-2.5 px-3 font-semibold text-slate-200">
                            {addon.name}
                          </td>
                          <td className="py-2.5 px-3 text-slate-400">
                            {addon.description}
                          </td>
                          <td className="py-2.5 px-3 text-right font-bold text-slate-200">
                            {addon.price.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Back to Package Details Button */}
              <div className="pt-2">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="bg-[#0b1426] hover:bg-[#121f38] text-slate-200 border border-[#162544] text-xs sm:text-sm font-medium px-6 py-2.5 rounded-xl flex items-center gap-2 transition-all cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
              </div>
            </div>

            {/* Right Column (4 Cols): Summary, Payment Info & Notes */}
            <div className="lg:col-span-4 space-y-5">
              {/* Card 1: Invoice Summary */}
              <div className="bg-[#091224] border border-[#14233e] rounded-2xl p-5 shadow-2xl space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-[#14233e]">
                  <Receipt className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-sm font-bold text-white tracking-wide">
                    Invoice Summary
                  </h3>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span>Packages ({INVOICE_PACKAGES.length})</span>
                    <span className="font-semibold text-white">
                      AED {packagesTotal.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between text-slate-300">
                    <span>Add-ons ({INVOICE_ADDONS.length})</span>
                    <span className="font-semibold text-white">
                      AED {addonsTotal.toLocaleString()}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-[#14233e] flex justify-between text-slate-300">
                    <span>Subtotal</span>
                    <span className="font-semibold text-white">
                      AED {subtotal.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between text-slate-300">
                    <span>VAT (5%)</span>
                    <span className="font-semibold text-white">
                      AED {vatAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>

                  {/* Total Amount Box matching screenshot */}
                  <div className="mt-3 p-3.5 rounded-xl bg-gradient-to-r from-[#0c2e59] to-[#092244] border border-[#0070f3]/60 shadow-[0_0_15px_rgba(0,112,243,0.25)] flex items-center justify-between">
                    <span className="text-xs font-bold text-white tracking-wide">
                      Total Amount
                    </span>
                    <span className="text-base sm:text-lg font-extrabold text-white">
                      AED {totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card 2: Payment Information */}
              <div className="bg-[#091224] border border-[#14233e] rounded-2xl p-5 shadow-2xl space-y-3.5">
                <div className="flex items-center gap-2 pb-2 border-b border-[#14233e]">
                  <CreditCard className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-sm font-bold text-white tracking-wide">
                    Payment Information
                  </h3>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Payment Terms</span>
                    <span className="font-medium text-slate-200">One Time</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Valid Until</span>
                    <span className="font-medium text-slate-200">25 Sep 2025</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Currency</span>
                    <span className="font-medium text-slate-200">AED (UAE Dirham)</span>
                  </div>
                </div>
              </div>

              {/* Card 3: Notes */}
              <div className="bg-[#091224] border border-[#14233e] rounded-2xl p-5 shadow-2xl space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-[#14233e]">
                  <FileText className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-sm font-bold text-white tracking-wide">
                    Notes
                  </h3>
                </div>

                <div className="p-3.5 rounded-xl bg-[#060b14] border border-[#14233e] text-xs text-slate-300 leading-relaxed">
                  <p>Thank you for choosing Next Creative Agency.</p>
                  <p className="mt-1">We look forward to a successful partnership.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
