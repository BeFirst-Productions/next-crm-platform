"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowRight,
  Calendar,
  ChevronDown,
  Moon,
  Sun,
  CheckCircle2,
  ArrowLeft,
  FileText,
  Download,
  Package,
  Sparkles,
  Check,
  Printer,
  Building2,
  RefreshCw,
} from "lucide-react";
import { apiClient } from "@/lib/api-client";
import {
  fetchCategories,
  fetchPackages,
  fetchAddons,
  ServiceCategory,
  PackageItem,
  AddonItem,
} from "@/lib/catalog-api";

const CLOUDINARY_UPLOADED_TEMPLATE_BG =
  "https://res.cloudinary.com/dqnzbr7dk/image/upload/f_auto,q_auto,w_1600,c_limit/v1791016475/next-crm/category-templates/2fd7f7dd-829e-4ecf-82b6-c1cfd18edaa7/template_bg_1791016471256.jpg";
const CLOUDINARY_UPLOADED_TEMPLATE_PDF =
  "https://res.cloudinary.com/dqnzbr7dk/image/upload/v1791016475/next-crm/category-templates/2fd7f7dd-829e-4ecf-82b6-c1cfd18edaa7/template_bg_1791016471256.pdf";

const FALLBACK_CATEGORIES: ServiceCategory[] = [
  {
    id: "2fd7f7dd-829e-4ecf-82b6-c1cfd18edaa7",
    name: "Mobile App Development",
    description: "Enterprise hybrid & native apps with custom uploaded BeFirst PDF proposal template.",
    hasAddons: true,
    status: true,
    sortOrder: 1,
    templatePdfUrl: CLOUDINARY_UPLOADED_TEMPLATE_PDF,
    bgImageUrls: [CLOUDINARY_UPLOADED_TEMPLATE_BG],
  },
  {
    id: "2cd95ce8-50f4-4761-8ce1-60fbc4e3dd56",
    name: "Website Development",
    description: "Modern high-conversion web platforms with uploaded BeFirst proposal template.",
    hasAddons: true,
    status: true,
    sortOrder: 2,
    templatePdfUrl: CLOUDINARY_UPLOADED_TEMPLATE_PDF,
    bgImageUrls: [CLOUDINARY_UPLOADED_TEMPLATE_BG],
  },
];

const FALLBACK_PACKAGES: PackageItem[] = [
  {
    id: "pkg-mobile-pro",
    categoryId: "2fd7f7dd-829e-4ecf-82b6-c1cfd18edaa7",
    name: "Professional Mobile App",
    description: "High-performance enterprise mobile application with custom backend APIs & payment gateway.",
    price: 15999,
    billingType: "ONE_TIME",
    duration: "3 Months",
    icon: null,
    status: true,
    isPopular: true,
    sortOrder: 2,
    features: [
      { featureName: "Cross-Platform iOS & Android App", included: true },
      { featureName: "Custom Node.js / PostgreSQL APIs", included: true },
      { featureName: "Payment Gateway & Push Notifications", included: true },
      { featureName: "3 Months Dedicated SLA Support", included: true },
    ],
  },
  {
    id: "pkg-mobile-starter",
    categoryId: "2fd7f7dd-829e-4ecf-82b6-c1cfd18edaa7",
    name: "Mobile MVP (iOS & Android)",
    description: "Fast-to-market hybrid mobile application built with Flutter or React Native.",
    price: 8999,
    billingType: "ONE_TIME",
    duration: "2 Months",
    icon: null,
    status: true,
    isPopular: false,
    sortOrder: 1,
    features: [
      { featureName: "Core MVP Features & Wireframing", included: true },
      { featureName: "Authentication & User Management", included: true },
      { featureName: "Store Submission (App Store & Play Store)", included: true },
    ],
  },
  {
    id: "pkg-mobile-enterprise",
    categoryId: "2fd7f7dd-829e-4ecf-82b6-c1cfd18edaa7",
    name: "Enterprise Mobile Suite",
    description: "Mission-critical mobile application with distributed microservices and advanced security.",
    price: 28999,
    billingType: "ONE_TIME",
    duration: "6 Months",
    icon: null,
    status: true,
    isPopular: false,
    sortOrder: 3,
    features: [
      { featureName: "High-Availability Microservices Architecture", included: true },
      { featureName: "End-to-End Encryption & Biometrics", included: true },
      { featureName: "Real-Time Telemetry & Admin Dashboard", included: true },
      { featureName: "12 Months 24/7 SLA Support", included: true },
    ],
  },
  {
    id: "pkg-web-pro",
    categoryId: "2cd95ce8-50f4-4761-8ce1-60fbc4e3dd56",
    name: "Enterprise Web Platform",
    description: "Custom digital growth web app with modern high-conversion branding assets.",
    price: 12500,
    billingType: "ONE_TIME",
    duration: "6 Weeks",
    icon: null,
    status: true,
    isPopular: true,
    sortOrder: 1,
    features: [
      { featureName: "Custom Next.js & Tailwind Web App", included: true },
      { featureName: "Lead Capture & CRM Integrations", included: true },
      { featureName: "Advanced SEO & Speed Optimization", included: true },
    ],
  },
];

function ProposalStudioContent() {
  const searchParams = useSearchParams();
  const leadIdParam = searchParams.get("leadId");

  // Mode state
  const [isDarkMode, setIsDarkMode] = React.useState(false);

  // Step state (1: Company Details, 2: Packages & Templates, 3: Review & Verify, 4: Proposal & PDF)
  const [currentStep, setCurrentStep] = React.useState<1 | 2 | 3 | 4>(1);

  // Form Fields (Step 1)
  const [formData, setFormData] = React.useState({
    companyName: "Abc technologies",
    contactNumber: "+987 14 222222",
    contactPerson: "Dhasarath kp",
    location: "Fujairah, Fujairah Emirate, United Arab Emirates",
    emailAddress: "Info@abctechnologies.com",
    industry: "Real Estate",
    requiredServices: "Social Media + Video Production",
    projectDescription: "Custom digital growth strategy and modern high-conversion branding assets.",
    expectedDeliveryDate: "2026-10-30",
    additionalNotes: "Focus on modern 3D visual graphics and targeted lead generation.",
  });

  // Catalog Data (Step 2)
  const [categories, setCategories] = React.useState<ServiceCategory[]>(FALLBACK_CATEGORIES);
  const [packages, setPackages] = React.useState<PackageItem[]>(FALLBACK_PACKAGES);
  const [addons, setAddons] = React.useState<AddonItem[]>([]);

  // Selections (Step 2)
  const [selectedCategoryId, setSelectedCategoryId] = React.useState<string>(FALLBACK_CATEGORIES[0].id);
  const [selectedPackageId, setSelectedPackageId] = React.useState<string>(FALLBACK_PACKAGES[0].id);
  const [selectedAddonIds, setSelectedAddonIds] = React.useState<string[]>([]);
  const [discountPercent] = React.useState<number>(0);

  // Verification state (Step 3)
  const [isVerified, setIsVerified] = React.useState(false);

  // Generated Proposal state (Step 4)
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [generatedProposalNumber, setGeneratedProposalNumber] = React.useState<string>("");

  // Parse URL query parameters to prefill form fields from earlier navigation stages
  React.useEffect(() => {
    const qCompany = searchParams.get("companyName");
    const qPerson = searchParams.get("contactPerson");
    const qPhone = searchParams.get("contactNumber") || searchParams.get("phone") || searchParams.get("whatsapp");
    const qEmail = searchParams.get("emailAddress") || searchParams.get("email");
    const qLoc = searchParams.get("location");
    const qInd = searchParams.get("industry");
    const qServices = searchParams.get("requiredServices") || searchParams.get("services");
    const qDesc = searchParams.get("projectDescription") || searchParams.get("description");
    const qDate = searchParams.get("expectedDeliveryDate") || searchParams.get("deliveryDate");
    const qNotes = searchParams.get("additionalNotes") || searchParams.get("notes") || searchParams.get("remarks");
    const qCatId = searchParams.get("categoryId");
    const qPkgId = searchParams.get("packageId");

    if (qCompany || qPerson || qPhone || qEmail || qLoc || qInd) {
      setFormData((prev) => ({
        ...prev,
        companyName: qCompany || prev.companyName,
        contactPerson: qPerson || prev.contactPerson,
        contactNumber: qPhone || prev.contactNumber,
        emailAddress: qEmail || prev.emailAddress,
        location: qLoc || prev.location,
        industry: qInd || prev.industry,
        requiredServices: qServices || prev.requiredServices,
        projectDescription: qDesc || prev.projectDescription,
        expectedDeliveryDate: qDate || prev.expectedDeliveryDate,
        additionalNotes: qNotes || prev.additionalNotes,
      }));
    }
    if (qCatId) setSelectedCategoryId(qCatId);
    if (qPkgId) setSelectedPackageId(qPkgId);
  }, [searchParams]);

  // Load Lead details if leadId is passed in URL
  React.useEffect(() => {
    if (!leadIdParam) return;
    const loadLeadData = async () => {
      try {
        const res = await apiClient<any>(`/leads/${leadIdParam}`, { requiresAuth: false });
        if (res.data) {
          const l = res.data;
          setFormData((prev) => ({
            ...prev,
            companyName: l.companyName || prev.companyName,
            contactPerson: l.contactPerson || prev.contactPerson,
            contactNumber: l.phone || l.whatsapp || prev.contactNumber,
            emailAddress: l.email || prev.emailAddress,
            location: l.location || prev.location,
            industry: l.industry || prev.industry,
            requiredServices: l.servicesRequired || prev.requiredServices,
            additionalNotes: l.remarks || prev.additionalNotes,
          }));
          if (l.recommendedPackageId) {
            setSelectedPackageId(l.recommendedPackageId);
          }
        }
      } catch {
        // Fallback to default
      }
    };
    loadLeadData();
  }, [leadIdParam]);

  // Load Catalog data on mount
  React.useEffect(() => {
    const loadCatalog = async () => {
      try {
        const [cats, pkgs, ads] = await Promise.all([
          fetchCategories().catch(() => FALLBACK_CATEGORIES),
          fetchPackages().catch(() => FALLBACK_PACKAGES),
          fetchAddons().catch(() => []),
        ]);

        const validCats = cats && cats.length > 0 ? cats : FALLBACK_CATEGORIES;
        const validPkgs = pkgs && pkgs.length > 0 ? pkgs : FALLBACK_PACKAGES;

        setCategories(validCats);
        setPackages(validPkgs);
        setAddons(ads || []);

        // Pick category: priority to category with custom template or matching URL
        const urlCatId = searchParams.get("categoryId");
        const catWithTemplate = validCats.find((c) => c.templatePdfUrl || (c.bgImageUrls && c.bgImageUrls.length > 0));
        const initialCatId =
          urlCatId && validCats.some((c) => c.id === urlCatId)
            ? urlCatId
            : catWithTemplate
            ? catWithTemplate.id
            : validCats[0]?.id || FALLBACK_CATEGORIES[0].id;

        setSelectedCategoryId(initialCatId);

        // Pick initial package for this category
        const urlPkgId = searchParams.get("packageId");
        const pkgsForCat = validPkgs.filter((p) => p.categoryId === initialCatId);
        const initialPkgId =
          urlPkgId && validPkgs.some((p) => p.id === urlPkgId)
            ? urlPkgId
            : pkgsForCat[0]?.id || validPkgs[0]?.id || FALLBACK_PACKAGES[0].id;

        setSelectedPackageId(initialPkgId);
      } catch (err) {
        console.error("Failed to load catalog data", err);
      }
    };
    loadCatalog();
  }, [searchParams]);

  // Update selected package when category changes if needed
  const filteredPackages = React.useMemo(() => {
    if (!selectedCategoryId) return packages;
    const filtered = packages.filter((p) => p.categoryId === selectedCategoryId);
    return filtered.length > 0 ? filtered : packages;
  }, [packages, selectedCategoryId]);

  const selectedCategory = React.useMemo(() => {
    return categories.find((c) => c.id === selectedCategoryId) || categories[0] || FALLBACK_CATEGORIES[0];
  }, [categories, selectedCategoryId]);

  const selectedPackage = React.useMemo(() => {
    return (
      packages.find((p) => p.id === selectedPackageId) ||
      filteredPackages[0] ||
      packages[0] ||
      FALLBACK_PACKAGES[0]
    );
  }, [packages, selectedPackageId, filteredPackages]);

  // Cloudinary Template Background / Artwork Image URL
  const templateImageUrl = React.useMemo(() => {
    if (selectedCategory?.bgImageUrls && selectedCategory.bgImageUrls.length > 0) {
      const rawUrl = selectedCategory.bgImageUrls[0];
      if (rawUrl.toLowerCase().endsWith(".pdf")) {
        return rawUrl.replace(/\.pdf$/i, ".jpg");
      }
      return rawUrl;
    }
    return CLOUDINARY_UPLOADED_TEMPLATE_BG;
  }, [selectedCategory]);

  const selectedAddonsList = React.useMemo(() => {
    return addons.filter((a) => selectedAddonIds.includes(a.id));
  }, [addons, selectedAddonIds]);

  // Financial calculations
  const packagePrice = Number(selectedPackage?.price || 0);
  const addonsTotal = selectedAddonsList.reduce((acc, curr) => acc + Number(curr.price || 0), 0);
  const subtotalBeforeDiscount = packagePrice + addonsTotal;
  const discountAmount = (subtotalBeforeDiscount * discountPercent) / 100;
  const subtotal = subtotalBeforeDiscount - discountAmount;
  const taxRate = 0.05; // 5% UAE VAT
  const taxAmount = subtotal * taxRate;
  const grandTotal = subtotal + taxAmount;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggleAddon = (addonId: string) => {
    setSelectedAddonIds((prev) =>
      prev.includes(addonId) ? prev.filter((id) => id !== addonId) : [...prev, addonId]
    );
  };

  // Step 1: Save & Continue
  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.companyName || !formData.contactPerson) {
      alert("Please provide the Company Name and Contact Person.");
      return;
    }
    try {
      localStorage.setItem("crm_client_proposal_draft", JSON.stringify(formData));
    } catch {
      // Ignore
    }
    setCurrentStep(2);
  };

  // Step 3: Trigger Proposal Generation
  const handleGenerateProposal = async () => {
    if (!isVerified) {
      alert("Please check the verification box confirming client and package details.");
      return;
    }

    setIsGenerating(true);
    try {
      // Generate proposal number
      const propNum = `PROP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      setGeneratedProposalNumber(propNum);

      // Attempt to save to API if connected
      const payload = {
        leadId: leadIdParam || undefined,
        expectedDeliveryDate: formData.expectedDeliveryDate ? new Date(formData.expectedDeliveryDate) : undefined,
        projectDescription: formData.projectDescription,
        notes: formData.additionalNotes,
        discount: discountAmount,
        taxRatePercent: 5,
        items: [
          ...(selectedPackage?.id ? [{ itemType: "PACKAGE" as const, packageId: selectedPackage.id }] : []),
          ...selectedAddonsList.map((a) => ({ itemType: "ADDON" as const, addonId: a.id, quantity: 1 })),
        ],
      };

      try {
        const res = await apiClient<any>("/proposals", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        if (res.data?.id) {
          if (res.data.proposalNumber) {
            setGeneratedProposalNumber(res.data.proposalNumber);
          }
        }
      } catch (err) {
        console.warn("API proposal creation note (using client preview):", err);
      }

      setCurrentStep(4);
    } catch (err: any) {
      alert(err.message || "Failed to generate proposal");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060e1a] flex flex-col lg:flex-row antialiased select-none font-sans">
      {/* ==================================================================== */}
      {/* LEFT PANEL: BRANDING, ROLES & DUBAI SKYLINE */}
      {/* ==================================================================== */}
      <aside className="w-full lg:w-[320px] xl:w-[360px] bg-[#071120] border-r border-[#14233e] flex flex-col justify-between shrink-0 relative overflow-hidden shadow-2xl print:hidden">
        {/* Top Section */}
        <div className="p-6 sm:p-7 space-y-6 z-10">
          {/* Logo */}
          <Link href="/dashboard" className="inline-block group">
            <div className="flex flex-col items-start">
              <img
                src="/logo.svg"
                alt="nEXT Branding | Marketing"
                className="h-9 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
              />
            </div>
          </Link>

          {/* Heading */}
          <div className="pt-1">
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Proposal Studio
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Multi-step dynamic lead proposal engine
            </p>
          </div>

          {/* Step Progress Tracker */}
          <div className="space-y-2 pt-1">
            <div className="text-[11px] font-bold text-sky-400 uppercase tracking-wider mb-2">
              Workflow Progress
            </div>
            {[
              { num: 1, title: "1. Company Details", desc: "Lead info & contact specs" },
              { num: 2, title: "2. Packages & Template", desc: "Select services & design" },
              { num: 3, title: "3. Verify & Review", desc: "Audit pricing & terms" },
              { num: 4, title: "4. Generate & Download", desc: "Dynamic PDF output" },
            ].map((step) => {
              const isActive = currentStep === step.num;
              const isPast = currentStep > step.num;
              return (
                <div
                  key={step.num}
                  onClick={() => {
                    if (isPast) setCurrentStep(step.num as any);
                  }}
                  className={`p-3 rounded-xl transition-all flex items-center gap-3 border ${
                    isActive
                      ? "bg-sky-600/20 border-sky-400/50 text-white shadow-md shadow-sky-600/20"
                      : isPast
                      ? "bg-slate-900/60 border-emerald-500/30 text-slate-300 hover:bg-slate-900 cursor-pointer"
                      : "bg-[#091528] border-[#162744] text-slate-500 opacity-60"
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                      isActive
                        ? "bg-sky-500 text-white"
                        : isPast
                        ? "bg-emerald-500 text-white"
                        : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {isPast ? <Check className="w-4 h-4" /> : step.num}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold truncate">{step.title}</p>
                    <p className="text-[10px] text-slate-400 truncate">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active Template Status Card */}
          {selectedCategory && (
            <div className="p-3.5 rounded-xl bg-[#09172e] border border-indigo-500/30 text-xs space-y-1.5">
              <div className="flex items-center gap-1.5 text-indigo-400 font-semibold">
                <FileText className="w-3.5 h-3.5" />
                <span>Selected Category Template</span>
              </div>
              <p className="text-white font-bold text-[12px] truncate">{selectedCategory.name}</p>
              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                <span>PDF Template Status:</span>
                {selectedCategory.templatePdfUrl ? (
                  <span className="text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                    Uploaded (Cloudinary)
                  </span>
                ) : (
                  <span className="text-amber-400 font-medium">Standard Glass Template</span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Graphic: Dubai Burj Khalifa Night Skyline */}
        <div className="relative mt-auto w-full pt-8 overflow-hidden select-none pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-[#071120]/40 to-[#071120] z-10" />
          <img
            src="/dubai-skyline.jpg"
            alt="Dubai Skyline at Night"
            className="w-full h-36 object-cover object-bottom opacity-75 mix-blend-screen scale-105"
          />
        </div>
      </aside>

      {/* ==================================================================== */}
      {/* RIGHT PANEL: MULTI-STEP WORKFLOW */}
      {/* ==================================================================== */}
      <main
        className={`flex-1 relative flex flex-col min-w-0 transition-colors duration-200 overflow-y-auto ${
          isDarkMode ? "bg-[#070e1a] text-slate-100" : "bg-white text-slate-900"
        }`}
      >
        {/* Top Control Bar: Back Link & Theme Toggle (Hidden in Print) */}
        <div className="relative z-10 px-6 sm:px-10 lg:px-12 pt-6 flex items-center justify-between print:hidden">
          <Link
            href="/dashboard/leads"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-600 hover:text-sky-700 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Leads CRM</span>
          </Link>

          {/* Theme Pill Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="flex items-center gap-1.5 bg-[#091528] border border-[#162544] px-2.5 py-1 rounded-full text-slate-300 hover:text-white transition-all shadow-sm cursor-pointer"
              title="Toggle Light/Dark Display"
            >
              {isDarkMode ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-[10px] font-medium text-slate-200">Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-sky-400" />
                  <span className="text-[10px] font-medium text-slate-300">Dark</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="relative z-10 px-6 sm:px-10 lg:px-12 py-6 w-full pb-16">
          {/* ================================================================ */}
          {/* STEP 1: COMPANY DETAILS */}
          {/* ================================================================ */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h1
                  className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
                    isDarkMode ? "text-white" : "text-slate-900"
                  }`}
                >
                  Step 1: Prospect Company Details
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Enter or verify the client company details to generate the proposal contract.
                </p>
              </div>

              <form onSubmit={handleStep1Submit} className="space-y-6">
                <div className="space-y-4">
                  <h2 className="text-xs sm:text-sm font-bold tracking-wider text-sky-500 uppercase">
                    Company Information
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <div>
                      <label className="block text-[11px] sm:text-xs font-medium text-slate-600 mb-1">
                        Company Name:
                      </label>
                      <input
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-[#0d1829] border border-[#172844] text-white text-xs sm:text-sm rounded-xl px-4 py-2.5 outline-none focus:border-sky-500 transition-all shadow-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] sm:text-xs font-medium text-slate-600 mb-1">
                        Contact Number:
                      </label>
                      <input
                        type="text"
                        name="contactNumber"
                        value={formData.contactNumber}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-[#0d1829] border border-[#172844] text-white text-xs sm:text-sm rounded-xl px-4 py-2.5 outline-none focus:border-sky-500 transition-all shadow-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] sm:text-xs font-medium text-slate-600 mb-1">
                        Contact Person:
                      </label>
                      <input
                        type="text"
                        name="contactPerson"
                        value={formData.contactPerson}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-[#0d1829] border border-[#172844] text-white text-xs sm:text-sm rounded-xl px-4 py-2.5 outline-none focus:border-sky-500 transition-all shadow-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] sm:text-xs font-medium text-slate-600 mb-1">
                        Location:
                      </label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-[#0d1829] border border-[#172844] text-white text-xs sm:text-sm rounded-xl px-4 py-2.5 outline-none focus:border-sky-500 transition-all shadow-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] sm:text-xs font-medium text-slate-600 mb-1">
                        Email Address:
                      </label>
                      <input
                        type="email"
                        name="emailAddress"
                        value={formData.emailAddress}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-[#0d1829] border border-[#172844] text-white text-xs sm:text-sm rounded-xl px-4 py-2.5 outline-none focus:border-sky-500 transition-all shadow-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] sm:text-xs font-medium text-slate-600 mb-1">
                        Industry:
                      </label>
                      <div className="relative">
                        <select
                          name="industry"
                          value={formData.industry}
                          onChange={handleInputChange}
                          className="w-full bg-[#0d1829] border border-[#172844] text-white text-xs sm:text-sm rounded-xl px-4 py-2.5 pr-8 appearance-none outline-none focus:border-sky-500 transition-all cursor-pointer"
                        >
                          <option value="Real Estate">Real Estate</option>
                          <option value="Technology">Technology</option>
                          <option value="E-commerce">E-commerce</option>
                          <option value="Retail">Retail</option>
                          <option value="Healthcare">Healthcare</option>
                          <option value="Hospitality">Hospitality</option>
                          <option value="Aerospace">Aerospace</option>
                          <option value="Other">Other</option>
                        </select>
                        <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-2">
                  <h2 className="text-xs sm:text-sm font-bold tracking-wider text-sky-500 uppercase">
                    Project Requirements
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <div>
                      <label className="block text-[11px] sm:text-xs font-medium text-slate-600 mb-1">
                        Required Services:
                      </label>
                      <input
                        type="text"
                        name="requiredServices"
                        value={formData.requiredServices}
                        onChange={handleInputChange}
                        className="w-full bg-[#0d1829] border border-[#172844] text-white text-xs sm:text-sm rounded-xl px-4 py-2.5 outline-none focus:border-sky-500 transition-all shadow-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] sm:text-xs font-medium text-slate-600 mb-1">
                        Expected Delivery Date:
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          name="expectedDeliveryDate"
                          value={formData.expectedDeliveryDate}
                          onChange={handleInputChange}
                          className="w-full bg-[#0d1829] border border-[#172844] text-white text-xs sm:text-sm rounded-xl px-4 py-2.5 pr-8 outline-none focus:border-sky-500 transition-all cursor-pointer"
                        />
                        <Calendar className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-[11px] sm:text-xs font-medium text-slate-600 mb-1">
                        Project Scope / Description:
                      </label>
                      <textarea
                        rows={2}
                        name="projectDescription"
                        value={formData.projectDescription}
                        onChange={handleInputChange}
                        className="w-full bg-[#0d1829] border border-[#172844] text-white text-xs sm:text-sm rounded-xl px-4 py-2.5 outline-none focus:border-sky-500 transition-all shadow-sm"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-[11px] sm:text-xs font-medium text-slate-600 mb-1">
                        Additional Notes:
                      </label>
                      <input
                        type="text"
                        name="additionalNotes"
                        value={formData.additionalNotes}
                        onChange={handleInputChange}
                        className="w-full bg-[#0d1829] border border-[#172844] text-white text-xs sm:text-sm rounded-xl px-4 py-2.5 outline-none focus:border-sky-500 transition-all shadow-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Step 1 Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                  <span className="text-xs text-slate-400">
                    Lead details will be linked dynamically to the selected proposal template.
                  </span>
                  <button
                    type="submit"
                    className="bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs sm:text-sm font-semibold px-6 py-2.5 rounded-xl flex items-center gap-2 shadow-lg shadow-sky-600/30 transition-all cursor-pointer active:scale-95"
                  >
                    <span>Proceed to Packages & Template</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ================================================================ */}
          {/* STEP 2: PACKAGES & TEMPLATE SELECTION */}
          {/* ================================================================ */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h1
                    className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
                      isDarkMode ? "text-white" : "text-slate-900"
                    }`}
                  >
                    Step 2: Select Package & Template
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Choose the service category (which uses its custom uploaded template PDF) and target package.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="text-xs text-sky-500 hover:underline flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Company Details
                </button>
              </div>

              {/* Service Categories with Template Indicators */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-sky-400 uppercase tracking-wider block">
                  1. Choose Service Category & Template
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {categories.map((cat) => {
                    const isSelected = cat.id === selectedCategoryId;
                    const hasCustomPdf = Boolean(cat.templatePdfUrl || (cat.bgImageUrls && cat.bgImageUrls.length > 0));
                    const thumbUrl = cat.bgImageUrls?.[0]?.toLowerCase().endsWith(".pdf")
                      ? cat.bgImageUrls[0].replace(/\.pdf$/i, ".jpg")
                      : cat.bgImageUrls?.[0];

                    return (
                      <div
                        key={cat.id}
                        onClick={() => {
                          setSelectedCategoryId(cat.id);
                          const catPkgs = packages.filter((p) => p.categoryId === cat.id);
                          if (catPkgs.length > 0) {
                            setSelectedPackageId(catPkgs[0].id);
                          }
                        }}
                        className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between overflow-hidden relative ${
                          isSelected
                            ? "bg-sky-950/40 border-sky-400 shadow-lg shadow-sky-600/20 ring-1 ring-sky-400/50"
                            : "bg-[#0b172a] border-[#172844] hover:border-sky-500/50"
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2">
                            <h3 className="text-sm font-bold text-white truncate">{cat.name}</h3>
                            {isSelected && (
                              <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                            {cat.description || "Comprehensive enterprise marketing solutions."}
                          </p>

                          {/* Template Thumbnail Preview if available */}
                          {thumbUrl && (
                            <div className="mt-3 relative rounded-lg overflow-hidden border border-slate-700/60 h-20 bg-slate-950">
                              <img
                                src={thumbUrl}
                                alt={cat.name}
                                className="w-full h-full object-cover object-top opacity-85 group-hover:opacity-100 transition-opacity"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-1.5">
                                <span className="text-[9px] font-bold text-sky-300 bg-sky-950/90 px-1.5 py-0.5 rounded border border-sky-700/50">
                                  Uploaded PDF Template
                                </span>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="mt-4 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px]">
                          {hasCustomPdf ? (
                            <span className="text-emerald-400 font-semibold flex items-center gap-1">
                              <FileText className="w-3 h-3" /> Custom PDF Template
                            </span>
                          ) : (
                            <span className="text-slate-400">Glassmorphic Modern</span>
                          )}
                          <span className="text-slate-400 font-mono">
                            {packages.filter((p) => p.categoryId === cat.id).length} Packages
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Packages List in Selected Category */}
              <div className="space-y-3 pt-2">
                <label className="text-xs font-bold text-sky-400 uppercase tracking-wider block">
                  2. Choose Package for {selectedCategory?.name || "Services"}
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {filteredPackages.map((pkg) => {
                    const isSelected = pkg.id === selectedPackageId;

                    return (
                      <div
                        key={pkg.id}
                        onClick={() => setSelectedPackageId(pkg.id)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between relative ${
                          isSelected
                            ? "bg-gradient-to-b from-[#0e2448] to-[#09152b] border-sky-400 shadow-xl shadow-sky-600/25 ring-1 ring-sky-400"
                            : "bg-[#0a1526] border-[#152542] hover:border-sky-500/40"
                        }`}
                      >
                        {pkg.isPopular && (
                          <span className="absolute -top-2.5 right-4 bg-gradient-to-r from-amber-500 to-orange-500 text-black text-[9px] font-black uppercase px-2 py-0.5 rounded-full shadow-md">
                            Popular
                          </span>
                        )}

                        <div>
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-bold text-white">{pkg.name}</h4>
                            <span className="text-[10px] uppercase font-bold text-sky-400 bg-sky-950/60 px-2 py-0.5 rounded border border-sky-800">
                              {pkg.billingType}
                            </span>
                          </div>

                          <div className="mt-2.5">
                            <span className="text-xl font-extrabold text-white">
                              AED {Number(pkg.price).toLocaleString()}
                            </span>
                            <span className="text-[11px] text-slate-400 ml-1">/ project</span>
                          </div>

                          <p className="text-[11px] text-slate-400 mt-2 line-clamp-2">
                            {pkg.description || "Designed for accelerated digital conversions."}
                          </p>

                          {/* Features */}
                          {pkg.features && pkg.features.length > 0 && (
                            <div className="mt-3 space-y-1.5 pt-2 border-t border-slate-800/80">
                              {pkg.features.slice(0, 3).map((f, i) => (
                                <div key={i} className="flex items-center gap-1.5 text-[11px] text-slate-300">
                                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                  <span className="truncate">{f.featureName}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                          <span className="text-[11px] text-slate-400">
                            {isSelected ? "Selected" : "Click to select"}
                          </span>
                          <div
                            className={`w-5 h-5 rounded-full flex items-center justify-center ${
                              isSelected ? "bg-sky-500 text-white" : "border border-slate-600"
                            }`}
                          >
                            {isSelected && <Check className="w-3.5 h-3.5" />}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Add-ons Selection */}
              {addons.length > 0 && (
                <div className="space-y-3 pt-2">
                  <label className="text-xs font-bold text-sky-400 uppercase tracking-wider block">
                    3. Optional Add-ons & Extended Deliverables
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {addons.map((addon) => {
                      const isChecked = selectedAddonIds.includes(addon.id);
                      return (
                        <div
                          key={addon.id}
                          onClick={() => handleToggleAddon(addon.id)}
                          className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                            isChecked
                              ? "bg-indigo-950/30 border-indigo-400 text-white"
                              : "bg-[#0b172a] border-[#172844] text-slate-300 hover:border-slate-700"
                          }`}
                        >
                          <div>
                            <p className="text-xs font-semibold text-white">{addon.name}</p>
                            <p className="text-[10px] text-emerald-400 font-bold mt-0.5">
                              + AED {Number(addon.price).toLocaleString()}
                            </p>
                          </div>
                          <div
                            className={`w-4 h-4 rounded border flex items-center justify-center ${
                              isChecked
                                ? "bg-indigo-600 border-indigo-500 text-white"
                                : "border-slate-600"
                            }`}
                          >
                            {isChecked && <Check className="w-3 h-3" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Pricing Summary Card */}
              <div className="bg-[#0b172d] border border-sky-500/30 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <p className="text-xs text-slate-400">Total Proposal Value (Estimated)</p>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-2xl font-black text-white">
                      AED {grandTotal.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      (Includes 5% UAE VAT: AED {taxAmount.toFixed(2)})
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="px-4 py-2 rounded-xl border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs sm:text-sm font-semibold px-6 py-2.5 rounded-xl flex items-center gap-2 shadow-lg shadow-sky-600/30 cursor-pointer active:scale-95 transition-all"
                  >
                    <span>Proceed to Verification</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* STEP 3: VERIFICATION & REVIEW */}
          {/* ================================================================ */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h1
                    className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
                      isDarkMode ? "text-white" : "text-slate-900"
                    }`}
                  >
                    Step 3: Verification & Final Audit
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Review all prospect and package parameters. Once verified, generate the dynamic proposal.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="text-xs text-sky-500 hover:underline flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Packages
                </button>
              </div>

              {/* Review Audit Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Card 1: Prospect Lead Details */}
                <div className="bg-[#09152a] border border-[#172844] rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <h3 className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5" />
                      Client Company Details
                    </h3>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="text-[11px] text-sky-400 hover:underline"
                    >
                      Edit
                    </button>
                  </div>

                  <div className="space-y-2 text-xs text-slate-300">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Company:</span>
                      <span className="font-bold text-white">{formData.companyName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Contact Person:</span>
                      <span className="font-semibold">{formData.contactPerson}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Phone:</span>
                      <span>{formData.contactNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Email:</span>
                      <span>{formData.emailAddress}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Location:</span>
                      <span>{formData.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Industry:</span>
                      <span className="text-sky-300">{formData.industry}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Target Delivery:</span>
                      <span className="text-amber-300">{formData.expectedDeliveryDate}</span>
                    </div>
                  </div>
                </div>

                {/* Card 2: Package & Template Scope */}
                <div className="bg-[#09152a] border border-[#172844] rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <h3 className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Package className="w-3.5 h-3.5" />
                      Template & Service Scope
                    </h3>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="text-[11px] text-sky-400 hover:underline"
                    >
                      Edit
                    </button>
                  </div>

                  <div className="space-y-2 text-xs text-slate-300">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Category:</span>
                      <span className="font-bold text-white">{selectedCategory?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Template Engine:</span>
                      <span className="text-emerald-400 font-semibold">
                        {selectedCategory?.templatePdfUrl ? "Custom Cloudinary PDF Template" : "Standard Modern"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Selected Package:</span>
                      <span className="font-bold text-white">{selectedPackage?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Package Price:</span>
                      <span>AED {packagePrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Add-ons Selected:</span>
                      <span>{selectedAddonsList.length} items (AED {addonsTotal.toLocaleString()})</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Financial Breakdown Table */}
              <div className="bg-[#081224] border border-[#152542] rounded-2xl p-5 space-y-3">
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  Detailed Financial Breakdown
                </h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-800 text-slate-300">
                    <span>{selectedPackage?.name || "Package Service"}</span>
                    <span>AED {packagePrice.toFixed(2)}</span>
                  </div>
                  {selectedAddonsList.map((addon) => (
                    <div key={addon.id} className="flex justify-between py-1 border-b border-slate-800 text-slate-400">
                      <span>Add-on: {addon.name}</span>
                      <span>AED {Number(addon.price).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between pt-1 text-slate-300">
                    <span>Subtotal</span>
                    <span>AED {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>VAT Standard Rate (5%)</span>
                    <span>AED {taxAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-slate-700 text-sm font-bold text-white">
                    <span>Grand Total (AED)</span>
                    <span className="text-sky-400">AED {grandTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Verification Confirmation Box */}
              <div className="p-4 rounded-2xl bg-sky-950/40 border border-sky-500/40 flex items-start gap-3">
                <input
                  type="checkbox"
                  id="verificationCheck"
                  checked={isVerified}
                  onChange={(e) => setIsVerified(e.target.checked)}
                  className="w-5 h-5 rounded border-slate-700 text-sky-500 focus:ring-sky-400 mt-0.5 cursor-pointer"
                />
                <label htmlFor="verificationCheck" className="text-xs text-slate-200 cursor-pointer select-none">
                  <span className="font-bold text-white block">
                    Verify all prospect parameters & package scope
                  </span>
                  I confirm that all company details, contact information, services, and pricing calculations have been
                  verified and are ready to be compiled into the official proposal template.
                </label>
              </div>

              {/* Step 3 Actions */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-4 py-2 rounded-xl border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white"
                >
                  Back to Packages
                </button>

                <button
                  type="button"
                  disabled={!isVerified || isGenerating}
                  onClick={handleGenerateProposal}
                  className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs sm:text-sm font-bold px-8 py-3 rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-600/30 cursor-pointer active:scale-95 transition-all"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Compiling Proposal Template...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Generate Proposal with Dynamic Template</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* STEP 4: PROPOSAL PREVIEW & PDF DOWNLOAD */}
          {/* ================================================================ */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-fade-in">
              {/* Top Banner: Success & Actions (Hidden in Print) */}
              <div className="bg-[#09152b] border border-emerald-500/30 rounded-2xl p-4 sm:p-5 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white flex items-center gap-2">
                      Proposal Generated Successfully!
                      <span className="text-xs font-mono font-bold bg-sky-950 text-sky-300 px-2 py-0.5 rounded border border-sky-800">
                        {generatedProposalNumber}
                      </span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Dynamically populated with <b className="text-slate-200">{formData.companyName}</b> parameters and <b className="text-sky-300">{selectedCategory?.name}</b> uploaded template.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => window.print()}
                    className="bg-[#0070f3] hover:bg-[#0060d0] text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer shrink-0"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print / Save as PDF</span>
                  </button>

                  {selectedCategory?.templatePdfUrl && (
                    <a
                      href={selectedCategory.templatePdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-emerald-700/80 hover:bg-emerald-600 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl flex items-center gap-2 border border-emerald-500/40 transition-all shrink-0"
                    >
                      <Download className="w-4 h-4" />
                      <span>Original Template PDF</span>
                    </a>
                  )}

                  <Link
                    href="/dashboard/leads"
                    className="px-4 py-2.5 rounded-xl bg-[#0e1d35] hover:bg-[#132647] border border-[#1b3156] text-xs font-semibold text-slate-200 transition-colors"
                  >
                    View in Leads CRM
                  </Link>
                </div>
              </div>

              {/* ============================================================ */}
              {/* PRINTABLE DYNAMIC PROPOSAL DOCUMENT CANVAS */}
              {/* ============================================================ */}
              <div
                id="proposal-document"
                className="w-full max-w-[880px] mx-auto bg-[#0a1224] text-white border border-[#1b2b4b] rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden print:m-0 print:p-6 print:max-w-none print:border-none print:shadow-none print:bg-white print:text-black"
              >
                {/* 1. UPLOADED TEMPLATE ARTWORK HERO HEADER */}
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-700/60 mb-8 bg-[#030914] print:mb-6 print:border-gray-300">
                  <img
                    src={templateImageUrl}
                    alt="Uploaded Proposal Template Design"
                    className="w-full h-auto object-cover block"
                    style={{ WebkitPrintColorAdjust: "exact", printColorAdjust: "exact" }}
                  />
                  {/* Dynamic Floating Badges over the Template Hero */}
                  <div className="absolute top-3 left-3 sm:top-6 sm:left-6 bg-slate-950/85 backdrop-blur-md border border-white/20 rounded-xl px-3.5 py-2 sm:px-4 sm:py-2.5 shadow-2xl print:bg-white/95 print:border-gray-400">
                    <span className="text-[9px] sm:text-[10px] uppercase font-bold text-sky-400 print:text-blue-700 tracking-wider block">
                      Commercial Proposal
                    </span>
                    <span className="text-xs sm:text-sm font-black text-white print:text-black">
                      {selectedCategory?.name}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3 sm:top-6 sm:right-6 bg-slate-950/85 backdrop-blur-md border border-sky-400/50 rounded-xl px-3.5 py-2 sm:px-4 sm:py-2.5 text-right shadow-2xl print:bg-white/95 print:border-gray-400">
                    <span className="text-[11px] sm:text-xs font-mono font-bold text-sky-400 print:text-blue-700 block">
                      {generatedProposalNumber}
                    </span>
                    <span className="text-[10px] sm:text-[11px] text-slate-300 print:text-gray-800">
                      Prepared for: <b className="text-white print:text-black">{formData.companyName}</b>
                    </span>
                    <span className="text-[9px] sm:text-[10px] text-slate-400 print:text-gray-600 block mt-0.5">
                      Date: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                    </span>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Executive Header Branding & Dates */}
                  <div className="flex items-start justify-between pb-5 border-b border-white/10 print:border-gray-300">
                    <div>
                      <div className="text-2xl font-black bg-gradient-to-r from-indigo-400 via-sky-400 to-cyan-300 bg-clip-text text-transparent print:text-blue-700">
                        NEXT DIGITAL CRM
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5 print:text-gray-600">
                        A Division of BeFirst Media Productions | Enterprise Growth &amp; Strategy
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="inline-block bg-sky-950/80 border border-sky-400/40 text-sky-300 font-mono font-bold text-xs px-3 py-1 rounded-full print:border-gray-400 print:text-black print:bg-gray-100">
                        {generatedProposalNumber}
                      </span>
                      <p className="text-[11px] text-slate-400 mt-1 print:text-gray-600">
                        Issuance: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                      </p>
                    </div>
                  </div>

                  {/* 2-Column: Client Info & Service Specifications */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
                    <div className="bg-[#0d1a33] border border-[#1b3158] p-4 rounded-xl print:bg-gray-50 print:border-gray-300">
                      <p className="text-[10px] uppercase font-bold text-sky-400 tracking-wider mb-2 print:text-blue-700">
                        PROPOSAL PREPARED FOR (PROSPECT SPECS)
                      </p>
                      <div className="space-y-1">
                        <p className="font-bold text-sm text-white print:text-black">{formData.companyName}</p>
                        <p className="text-slate-300 print:text-gray-700">Attn: {formData.contactPerson}</p>
                        <p className="text-slate-400 print:text-gray-600">Email: {formData.emailAddress}</p>
                        <p className="text-slate-400 print:text-gray-600">Phone: {formData.contactNumber}</p>
                        <p className="text-slate-400 print:text-gray-600">Location: {formData.location}</p>
                        <p className="text-slate-400 print:text-gray-600">Industry: {formData.industry}</p>
                      </div>
                    </div>

                    <div className="bg-[#0d1a33] border border-[#1b3158] p-4 rounded-xl print:bg-gray-50 print:border-gray-300">
                      <p className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider mb-2 print:text-emerald-700">
                        SERVICE &amp; TEMPLATE SPECIFICATIONS
                      </p>
                      <div className="space-y-1">
                        <p className="font-bold text-sm text-white print:text-black">{selectedCategory?.name}</p>
                        <p className="text-slate-300 print:text-gray-700">Package: <b className="text-white print:text-black">{selectedPackage?.name}</b></p>
                        <p className="text-slate-400 print:text-gray-600">Billing: {selectedPackage?.billingType || "ONE_TIME"}</p>
                        <p className="text-slate-400 print:text-gray-600">
                          Target Delivery: <span className="text-amber-400 font-semibold print:text-black">{formData.expectedDeliveryDate || "Within 30 Days"}</span>
                        </p>
                        <p className="text-slate-400 print:text-gray-600">
                          Template Source: <span className="text-emerald-400 font-semibold print:text-emerald-800">Custom Cloudinary Uploaded Template</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Project Scope & Executive Summary */}
                  {formData.projectDescription && (
                    <div className="bg-[#0d1a33]/60 border border-[#1b3158]/80 p-4 rounded-xl print:bg-gray-50 print:border-gray-300 space-y-1.5">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-sky-400 print:text-blue-700">
                        Project Scope &amp; Executive Summary
                      </h4>
                      <p className="text-xs text-slate-300 leading-relaxed print:text-gray-800">
                        {formData.projectDescription}
                      </p>
                      {formData.additionalNotes && (
                        <p className="text-[11px] text-slate-400 pt-1 italic print:text-gray-600">
                          Strategic Execution Notes: {formData.additionalNotes}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Deliverables & Deliverable Features */}
                  {selectedPackage?.features && selectedPackage.features.length > 0 && (
                    <div className="space-y-2.5">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-sky-400 print:text-blue-700">
                        Included Deliverables &amp; Core Features
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {selectedPackage.features.map((f, i) => (
                          <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-[#0d1a33]/40 border border-slate-800 text-slate-300 print:bg-white print:border-gray-200 print:text-gray-800">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 print:bg-emerald-600" />
                            <span className="font-medium">{f.featureName}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Pricing Breakdown Table */}
                  <div className="space-y-2.5 pt-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-sky-400 print:text-blue-700">
                      Investment &amp; Pricing Schedule
                    </h4>
                    <table className="w-full text-xs text-left border-collapse">
                      <thead>
                        <tr className="border-b border-white/20 text-slate-400 print:border-gray-400 print:text-black">
                          <th className="py-2.5">Item Description</th>
                          <th className="py-2.5 text-center">Type</th>
                          <th className="py-2.5 text-right">Amount (AED)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/10 print:divide-gray-300">
                        <tr>
                          <td className="py-2.5 font-bold text-white print:text-black">{selectedPackage?.name}</td>
                          <td className="py-2.5 text-center text-slate-400 print:text-gray-600">Core Package</td>
                          <td className="py-2.5 text-right font-mono font-bold text-white print:text-black">
                            {packagePrice.toFixed(2)}
                          </td>
                        </tr>
                        {selectedAddonsList.map((addon) => (
                          <tr key={addon.id}>
                            <td className="py-2 text-slate-300 print:text-gray-800">Add-on: {addon.name}</td>
                            <td className="py-2 text-center text-slate-400 print:text-gray-600">Extension</td>
                            <td className="py-2 text-right font-mono text-slate-300 print:text-black">
                              {Number(addon.price).toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {/* Totals Box */}
                    <div className="pt-3 border-t border-white/20 space-y-1.5 text-xs max-w-sm ml-auto">
                      <div className="flex justify-between text-slate-400 print:text-gray-600">
                        <span>Subtotal</span>
                        <span className="font-mono text-slate-200 print:text-black">AED {subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-slate-400 print:text-gray-600">
                        <span>VAT Standard (5%)</span>
                        <span className="font-mono text-slate-200 print:text-black">AED {taxAmount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-base font-black text-white pt-2.5 border-t border-white/20 print:border-gray-400 print:text-black">
                        <span>Grand Total (AED)</span>
                        <span className="text-sky-400 font-mono text-lg print:text-blue-700">
                          AED {grandTotal.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Signature & Seal Section */}
                  <div className="pt-8 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs print:pt-10 print:border-gray-300">
                    <div className="flex flex-col justify-end">
                      <div className="border border-dashed border-sky-400/40 rounded-xl p-3 text-center bg-sky-950/20 print:border-gray-400 print:bg-gray-50">
                        <div className="w-8 h-8 mx-auto rounded-full bg-sky-500/10 flex items-center justify-center text-sky-400 mb-1">
                          <Check className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] font-bold text-sky-300 uppercase tracking-wider block print:text-black">
                          Official Certified
                        </span>
                        <span className="text-[9px] text-slate-400 print:text-gray-600">
                          Next Digital CRM UAE
                        </span>
                      </div>
                    </div>

                    <div>
                      <div className="border-b border-white/30 h-12 mb-1.5 print:border-gray-600" />
                      <p className="font-bold text-white print:text-black">Authorized Signature</p>
                      <p className="text-[10px] text-slate-400 print:text-gray-600">Next Digital CRM Management</p>
                    </div>

                    <div>
                      <div className="border-b border-white/30 h-12 mb-1.5 print:border-gray-600" />
                      <p className="font-bold text-white print:text-black">Client Acceptance</p>
                      <p className="text-[10px] text-slate-400 print:text-gray-600">{formData.companyName}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons Below (Hidden in Print) */}
              <div className="flex items-center justify-between pt-4 print:hidden">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-4 py-2.5 rounded-xl border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
                >
                  Create Another Proposal
                </button>

                <button
                  onClick={() => window.print()}
                  className="bg-[#0070f3] hover:bg-[#0060d0] text-white text-xs sm:text-sm font-bold px-6 py-2.5 rounded-xl flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print / Save as PDF</span>
                </button>
              </div>

              {/* Print Style Fix */}
              <style jsx global>{`
                @media print {
                  @page {
                    size: A4 portrait;
                    margin: 8mm;
                  }
                  * {
                    -webkit-print-color-adjust: exact !important;
                    print-color-adjust: exact !important;
                  }
                  body {
                    background: #ffffff !important;
                    color: #000000 !important;
                  }
                }
              `}</style>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function ClientCompanyDetailsPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-[#060e1a] flex items-center justify-center text-white text-sm">
          Loading Proposal Studio...
        </div>
      }
    >
      <ProposalStudioContent />
    </React.Suspense>
  );
}
