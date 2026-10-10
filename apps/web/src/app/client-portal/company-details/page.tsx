"use client";

import * as React from "react";
import Link from "next/link";
import {
  UserCheck,
  Shield,
  ArrowRight,
  ChevronDown,
  Moon,
  Sun,
  CheckCircle2,
  ArrowLeft,
  RotateCcw,
} from "lucide-react";

import { useRouter } from "next/navigation";
import { useProposalStore, type CompanyDetailsField, DEFAULT_COMPANY_DETAILS } from "@/stores";

export default function ClientCompanyDetailsPage() {
  const router = useRouter();

  // Zustand Store with Zod Schema Validation & LocalStorage Persistence
  const {
    companyDetails,
    setCompanyField,
    setCompanyDetails,
    validateCompanyDetails,
    errors,
    activeRole,
    setActiveRole,
    isDarkMode,
    toggleDarkMode,
    isSaved,
    setIsSaved,
    isSubmitting,
    setIsSubmitting,
    setCurrentStep,
  } = useProposalStore();

  // If fields contain previous hardcoded mock demo data, reset them to empty strings
  React.useEffect(() => {
    if (
      companyDetails.companyName === "Abc technologies" ||
      companyDetails.companyName === "ABC Technologies" ||
      companyDetails.emailAddress === "Info@abctechnologies.com"
    ) {
      setCompanyDetails(DEFAULT_COMPANY_DETAILS);
      setIsSaved(false);
    }
  }, [companyDetails.companyName, companyDetails.emailAddress, setCompanyDetails, setIsSaved]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCompanyField(name as CompanyDetailsField, value);
    if (isSaved) {
      setIsSaved(false);
    }
  };

  const handleClearForm = () => {
    setCompanyDetails(DEFAULT_COMPANY_DETAILS);
    setIsSaved(false);
  };

  const handleSaveAndContinue = (e: React.FormEvent) => {
    e.preventDefault();

    // Trigger full Zod schema validation
    const { isValid } = validateCompanyDetails();
    if (!isValid) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSaved(true);
      setCurrentStep(2);
      router.push("/client-portal/packages");
    }, 350);
  };

  return (
    <div className="min-h-screen bg-[#060e1a] flex flex-col lg:flex-row antialiased select-none font-sans">
      {/* ==================================================================== */}
      {/* LEFT PANEL: BRANDING, ROLES & DUBAI SKYLINE */}
      {/* ==================================================================== */}
      <aside className="w-full lg:w-[340px] xl:w-[380px] bg-[#071120] border-r border-[#14233e] flex flex-col justify-between shrink-0 relative overflow-hidden shadow-2xl">
        {/* Top Section */}
        <div className="p-6 sm:p-8 space-y-7 z-10">
          {/* Logo */}
          <Link href="/dashboard" className="inline-block group">
            <div className="flex flex-col items-start">
              <img
                src="/logo.svg"
                alt="nEXT Branding | Marketing"
                className="h-10 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
              />
            </div>
          </Link>

          {/* Heading */}
          <div className="pt-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome Back!
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Select your role and continue
            </p>
          </div>

          {/* Role Cards */}
          <div className="space-y-3.5 pt-2">
            {/* Role 1: SALES STAFF (Active) */}
            <div
              onClick={() => setActiveRole("SALES_STAFF")}
              className={`p-4 rounded-2xl transition-all cursor-pointer flex items-center justify-between gap-3 ${
                activeRole === "SALES_STAFF"
                  ? "bg-[#0284c7] text-white shadow-lg shadow-sky-600/30 border border-sky-400/40"
                  : "bg-[#0a172c] hover:bg-[#0f213f] text-slate-300 border border-[#162947]"
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    activeRole === "SALES_STAFF"
                      ? "bg-white/20 text-white"
                      : "bg-[#102344] text-sky-400"
                  }`}
                >
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xs font-bold tracking-wider uppercase">
                    SALES STAFF
                  </h2>
                  <p
                    className={`text-[11px] mt-0.5 ${
                      activeRole === "SALES_STAFF" ? "text-sky-100" : "text-slate-400"
                    }`}
                  >
                    Create new client proposal and manage orders
                  </p>
                </div>
              </div>

              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform ${
                  activeRole === "SALES_STAFF"
                    ? "bg-white/25 text-white translate-x-0.5"
                    : "bg-[#102344] text-slate-400"
                }`}
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Role 2: REPORTS */}
            <div
              onClick={() => setActiveRole("REPORTS")}
              className={`p-4 rounded-2xl transition-all cursor-pointer flex items-center justify-between gap-3 ${
                activeRole === "REPORTS"
                  ? "bg-[#0284c7] text-white shadow-lg shadow-sky-600/30 border border-sky-400/40"
                  : "bg-[#091528] hover:bg-[#0e1f3a] text-slate-300 border border-[#162744]"
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    activeRole === "REPORTS"
                      ? "bg-white/20 text-white"
                      : "bg-[#0f1d35] text-slate-400"
                  }`}
                >
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xs font-bold tracking-wider uppercase text-slate-200">
                    REPORTS
                  </h2>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Create new client proposal and manage orders
                  </p>
                </div>
              </div>

              <div className="w-7 h-7 rounded-full bg-[#0f1d35] flex items-center justify-center text-slate-400 shrink-0">
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Graphic: Dubai Burj Khalifa Night Skyline */}
        <div className="relative mt-auto w-full pt-10 overflow-hidden select-none pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-[#071120]/40 to-[#071120] z-10" />
          <img
            src="/dubai-skyline.jpg"
            alt="Dubai Skyline at Night"
            className="w-full h-44 sm:h-52 object-cover object-bottom opacity-85 mix-blend-screen scale-105"
          />
        </div>
      </aside>

      {/* ==================================================================== */}
      {/* RIGHT PANEL: COMPANY DETAILS CLIENT FORM */}
      {/* ==================================================================== */}
      <main
        className={`flex-1 relative flex flex-col min-w-0 transition-colors duration-200 overflow-y-auto ${
          isDarkMode ? "bg-[#070e1a] text-slate-100" : "bg-white text-slate-900"
        }`}
      >
        {/* Fluid Blue Wave Graphic - Top Right */}
        <div className="absolute top-0 right-0 w-80 sm:w-96 md:w-[480px] pointer-events-none z-0 overflow-hidden opacity-90">
          <svg
            viewBox="0 0 500 280"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-auto"
          >
            <defs>
              <linearGradient id="waveGradTop" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0077ff" stopOpacity="0.85" />
                <stop offset="50%" stopColor="#00b4d8" stopOpacity="0.75" />
                <stop offset="100%" stopColor="#03045e" stopOpacity="0.9" />
              </linearGradient>
            </defs>
            <path
              d="M120 0 C 220 80, 320 20, 500 120 L 500 0 Z"
              fill="url(#waveGradTop)"
            />
            <path
              d="M200 0 C 300 110, 380 70, 500 220 L 500 0 Z"
              fill="#0096c7"
              opacity="0.3"
            />
          </svg>
        </div>

        {/* Fluid Blue Wave Graphic - Bottom Right */}
        <div className="absolute bottom-0 right-0 w-64 sm:w-80 md:w-[380px] pointer-events-none z-0 overflow-hidden opacity-90">
          <svg
            viewBox="0 0 400 220"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-auto"
          >
            <defs>
              <linearGradient id="waveGradBottom" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#0077ff" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#0096c7" stopOpacity="0.7" />
              </linearGradient>
            </defs>
            <path
              d="M0 220 C 150 140, 260 220, 400 110 L 400 220 Z"
              fill="url(#waveGradBottom)"
            />
          </svg>
        </div>

        {/* Top Control Bar: Back Link & Theme Toggle */}
        <div className="relative z-10 px-6 sm:px-10 lg:px-14 pt-6 flex items-center justify-between">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-600 hover:text-sky-700 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Staff Dashboard</span>
          </Link>

          {/* Theme Pill Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleDarkMode}
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

        {/* Content Container (Full width to fill the entire space with the input fields) */}
        <div className="relative z-10 px-6 sm:px-10 lg:px-12 xl:px-14 py-6 w-full pb-16">
          {/* Main Title */}
          <div>
            <h1
              className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
                isDarkMode ? "text-white" : "text-slate-900"
              }`}
            >
              Creative New Company Details
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Enter the company information to create a new client project.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSaveAndContinue} className="mt-8 space-y-7">
            {/* -------------------------------------------------------------- */}
            {/* Section 1: Company Information */}
            {/* -------------------------------------------------------------- */}
            <div className="space-y-4">
              <h2 className="text-xs sm:text-sm font-bold tracking-wider text-sky-500 uppercase">
                Company Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 lg:gap-x-12 xl:gap-x-14 gap-y-5">
                {/* Column 1: Company Name */}
                <div>
                  <label className="block text-[11px] sm:text-xs font-medium text-slate-400 mb-1.5">
                    Company Name:
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={companyDetails.companyName}
                    onChange={handleInputChange}
                    placeholder="e.g. Acme Corporation"
                    className={`w-full bg-[#0d1829] border ${
                      errors.companyName ? "border-rose-500/80 focus:border-rose-500 focus:ring-1 focus:ring-rose-500" : "border-[#172844] focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                    } text-white placeholder:text-slate-500 text-xs sm:text-sm rounded-xl px-4 py-3 outline-none transition-all shadow-sm`}
                  />
                  {errors.companyName && (
                    <p className="text-[11px] text-rose-400 mt-1 animate-fadeIn">{errors.companyName}</p>
                  )}
                </div>

                {/* Column 2: Contact Number */}
                <div>
                  <label className="block text-[11px] sm:text-xs font-medium text-slate-400 mb-1.5">
                    Contact Number:
                  </label>
                  <input
                    type="text"
                    name="contactNumber"
                    value={companyDetails.contactNumber}
                    onChange={handleInputChange}
                    placeholder="e.g. +971 50 123 4567"
                    className={`w-full bg-[#0d1829] border ${
                      errors.contactNumber ? "border-rose-500/80 focus:border-rose-500 focus:ring-1 focus:ring-rose-500" : "border-[#172844] focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                    } text-white placeholder:text-slate-500 text-xs sm:text-sm rounded-xl px-4 py-3 outline-none transition-all shadow-sm`}
                  />
                  {errors.contactNumber && (
                    <p className="text-[11px] text-rose-400 mt-1 animate-fadeIn">{errors.contactNumber}</p>
                  )}
                </div>

                {/* Column 1: Contact Person */}
                <div>
                  <label className="block text-[11px] sm:text-xs font-medium text-slate-400 mb-1.5">
                    Contact Person:
                  </label>
                  <input
                    type="text"
                    name="contactPerson"
                    value={companyDetails.contactPerson}
                    onChange={handleInputChange}
                    placeholder="e.g. John Doe"
                    className={`w-full bg-[#0d1829] border ${
                      errors.contactPerson ? "border-rose-500/80 focus:border-rose-500 focus:ring-1 focus:ring-rose-500" : "border-[#172844] focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                    } text-white placeholder:text-slate-500 text-xs sm:text-sm rounded-xl px-4 py-3 outline-none transition-all shadow-sm`}
                  />
                  {errors.contactPerson && (
                    <p className="text-[11px] text-rose-400 mt-1 animate-fadeIn">{errors.contactPerson}</p>
                  )}
                </div>

                {/* Column 2: Location */}
                <div>
                  <label className="block text-[11px] sm:text-xs font-medium text-slate-400 mb-1.5">
                    Location:
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={companyDetails.location}
                    onChange={handleInputChange}
                    placeholder="e.g. Dubai, United Arab Emirates"
                    className={`w-full bg-[#0d1829] border ${
                      errors.location ? "border-rose-500/80 focus:border-rose-500 focus:ring-1 focus:ring-rose-500" : "border-[#172844] focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                    } text-white placeholder:text-slate-500 text-xs sm:text-sm rounded-xl px-4 py-3 outline-none transition-all shadow-sm`}
                  />
                  {errors.location && (
                    <p className="text-[11px] text-rose-400 mt-1 animate-fadeIn">{errors.location}</p>
                  )}
                </div>

                {/* Column 1: Email Address */}
                <div>
                  <label className="block text-[11px] sm:text-xs font-medium text-slate-400 mb-1.5">
                    Email Address:
                  </label>
                  <input
                    type="email"
                    name="emailAddress"
                    value={companyDetails.emailAddress}
                    onChange={handleInputChange}
                    placeholder="e.g. info@company.com"
                    className={`w-full bg-[#0d1829] border ${
                      errors.emailAddress ? "border-rose-500/80 focus:border-rose-500 focus:ring-1 focus:ring-rose-500" : "border-[#172844] focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                    } text-white placeholder:text-slate-500 text-xs sm:text-sm rounded-xl px-4 py-3 outline-none transition-all shadow-sm`}
                  />
                  {errors.emailAddress && (
                    <p className="text-[11px] text-rose-400 mt-1 animate-fadeIn">{errors.emailAddress}</p>
                  )}
                </div>

                {/* Column 2: Industry */}
                <div>
                  <label className="block text-[11px] sm:text-xs font-medium text-slate-400 mb-1.5">
                    Industry:
                  </label>
                  <div className="relative">
                    <select
                      name="industry"
                      value={companyDetails.industry}
                      onChange={handleInputChange}
                      className={`w-full bg-[#0d1829] border ${
                        errors.industry ? "border-rose-500/80 focus:border-rose-500 focus:ring-1 focus:ring-rose-500" : "border-[#172844] focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                      } ${!companyDetails.industry ? "text-slate-500" : "text-white"} text-xs sm:text-sm rounded-xl px-4 py-3 pr-9 appearance-none outline-none transition-all shadow-sm cursor-pointer`}
                    >
                      <option value="" disabled className="text-slate-500">Select industry</option>
                      <option value="Real Estate" className="text-white bg-[#0d1829]">Real Estate</option>
                      <option value="Technology" className="text-white bg-[#0d1829]">Technology</option>
                      <option value="E-commerce" className="text-white bg-[#0d1829]">E-commerce</option>
                      <option value="Retail" className="text-white bg-[#0d1829]">Retail</option>
                      <option value="Healthcare" className="text-white bg-[#0d1829]">Healthcare</option>
                      <option value="Corporate" className="text-white bg-[#0d1829]">Corporate</option>
                      <option value="Hospitality" className="text-white bg-[#0d1829]">Hospitality</option>
                      <option value="Other" className="text-white bg-[#0d1829]">Other</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5 pointer-events-none" />
                  </div>
                  {errors.industry && (
                    <p className="text-[11px] text-rose-400 mt-1 animate-fadeIn">{errors.industry}</p>
                  )}
                </div>
              </div>
            </div>

            {/* -------------------------------------------------------------- */}
            {/* Section 2: Project Requirements */}
            {/* -------------------------------------------------------------- */}
            <div className="space-y-4 pt-2">
              <h2 className="text-xs sm:text-sm font-bold tracking-wider text-sky-500 uppercase">
                Project Requirements
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 lg:gap-x-12 xl:gap-x-14 gap-y-5">
                {/* Column 1: Required Services */}
                <div>
                  <label className="block text-[11px] sm:text-xs font-medium text-slate-400 mb-1.5">
                    Required services:
                  </label>
                  <div className="relative">
                    <select
                      name="requiredServices"
                      value={companyDetails.requiredServices}
                      onChange={handleInputChange}
                      className={`w-full bg-[#0d1829] border ${
                        errors.requiredServices ? "border-rose-500/80 focus:border-rose-500 focus:ring-1 focus:ring-rose-500" : "border-[#172844] focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                      } ${!companyDetails.requiredServices ? "text-slate-500" : "text-white"} text-xs sm:text-sm rounded-xl px-4 py-3 pr-9 appearance-none outline-none transition-all shadow-sm cursor-pointer`}
                    >
                      <option value="" disabled className="text-slate-500">Select required service</option>
                      <option value="Social Media + Video Production" className="text-white bg-[#0d1829]">
                        Social Media + Video Production
                      </option>
                      <option value="Website Development" className="text-white bg-[#0d1829]">
                        Website Development
                      </option>
                      <option value="SEO Services" className="text-white bg-[#0d1829]">
                        SEO Services
                      </option>
                      <option value="Branding & Identity" className="text-white bg-[#0d1829]">
                        Branding & Identity
                      </option>
                      <option value="Full Digital Marketing Suite" className="text-white bg-[#0d1829]">
                        Full Digital Marketing Suite
                      </option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5 pointer-events-none" />
                  </div>
                  {errors.requiredServices && (
                    <p className="text-[11px] text-rose-400 mt-1 animate-fadeIn">{errors.requiredServices}</p>
                  )}
                </div>

                {/* Column 2: Project Description */}
                <div>
                  <label className="block text-[11px] sm:text-xs font-medium text-slate-400 mb-1.5">
                    Project Description:
                  </label>
                  <input
                    type="text"
                    name="projectDescription"
                    value={companyDetails.projectDescription || ""}
                    onChange={handleInputChange}
                    placeholder="e.g. Needs a modern, responsive website"
                    className={`w-full bg-[#0d1829] border ${
                      errors.projectDescription ? "border-rose-500/80 focus:border-rose-500 focus:ring-1 focus:ring-rose-500" : "border-[#172844] focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                    } text-white placeholder:text-slate-500 text-xs sm:text-sm rounded-xl px-4 py-3 outline-none transition-all shadow-sm`}
                  />
                  {errors.projectDescription && (
                    <p className="text-[11px] text-rose-400 mt-1 animate-fadeIn">{errors.projectDescription}</p>
                  )}
                </div>

                {/* Row 2: Additional Notes (Optional) */}
                <div className="md:col-span-2">
                  <label className="block text-[11px] sm:text-xs font-medium text-slate-400 mb-1.5">
                    Additional Notes (Optional)
                  </label>
                  <input
                    type="text"
                    name="additionalNotes"
                    value={companyDetails.additionalNotes || ""}
                    onChange={handleInputChange}
                    placeholder="e.g. Focus on modern 3D interactive graphics"
                    className={`w-full bg-[#0d1829] border ${
                      errors.additionalNotes ? "border-rose-500/80 focus:border-rose-500 focus:ring-1 focus:ring-rose-500" : "border-[#172844] focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                    } text-white placeholder:text-slate-500 text-xs sm:text-sm rounded-xl px-4 py-3 outline-none transition-all shadow-sm`}
                  />
                  {errors.additionalNotes && (
                    <p className="text-[11px] text-rose-400 mt-1 animate-fadeIn">{errors.additionalNotes}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Actions Row */}
            <div className="flex items-center justify-between pt-4">
              {isSaved ? (
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 animate-fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Company details saved successfully!</span>
                </div>
              ) : (
                <span className="text-[11px] sm:text-xs text-slate-400">
                  All details can be reviewed in proposal preview.
                </span>
              )}

              {/* Action Buttons: Clear & Save */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleClearForm}
                  className="px-4 py-3 rounded-xl border border-[#172844] text-xs font-medium text-slate-400 hover:text-white hover:bg-[#0d1829] hover:border-slate-600 transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Clear All</span>
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#0284c7] hover:bg-[#0369a1] active:bg-[#075985] text-white text-xs sm:text-sm font-semibold px-8 py-3 rounded-xl flex items-center gap-2 shadow-lg shadow-sky-600/30 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
                >
                  <span>{isSubmitting ? "Saving..." : "Save & Continue"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
