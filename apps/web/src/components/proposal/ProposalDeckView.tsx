"use client";

import * as React from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Printer,
} from "lucide-react";


export interface ProposalDeckData {
  clientName: string;
  companyName: string;
  email?: string;
  phone?: string;
  location?: string;
  industry?: string;
  packageName: string;
  packagePrice: number;
  packageFeatures: string[];
  selectedAddons?: Array<{ id: string; name: string; price: number }>;
  subTotal: number;
  vatAmount: number;
  grandTotal: number;
  proposalNumber?: string;
  proposalDate?: string;
  expectedDeliveryDate?: string;
  projectDescription?: string;
  additionalNotes?: string;
  salesStaffName?: string;
  salesStaffEmail?: string;
  serviceCategory?: string;
}

interface ProposalDeckViewProps {
  data: ProposalDeckData;
  onClose?: () => void;
  initialMode?: "slides" | "document";
}

export function ProposalDeckView({
  data,
  onClose,
  initialMode = "document",
}: ProposalDeckViewProps) {
  const [currentSlide, setCurrentSlide] = React.useState(1);
  const [viewMode, setViewMode] = React.useState<"slides" | "document">(initialMode);
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const totalSlides = 24;

  const containerRef = React.useRef<HTMLDivElement>(null);

  // Format date helper
  const formattedDate = React.useMemo(() => {
    if (data.proposalDate) return data.proposalDate;
    return new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }, [data.proposalDate]);

  // Calculate working days based on expected delivery date or package size
  const calculatedWorkingDays = React.useMemo(() => {
    if (data.expectedDeliveryDate) {
      try {
        const target = new Date(data.expectedDeliveryDate);
        const now = new Date();
        const diffTime = target.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays > 0 && diffDays < 90) {
          // approx 5/7 for working days
          const workDays = Math.max(7, Math.round(diffDays * (5 / 7)));
          return `${workDays} Working Days`;
        }
      } catch {
        // fallback
      }
    }
    const name = data.packageName.toLowerCase();
    if (name.includes("basic") || name.includes("starter") || name.includes("local")) {
      return "10 - 14 Working Days";
    }
    if (name.includes("business") || name.includes("growth")) {
      return "15 - 20 Working Days";
    }
    return "20 - 25 Working Days";
  }, [data.expectedDeliveryDate, data.packageName]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(() => { });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => { });
      setIsFullscreen(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Keyboard navigation for presentation mode
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (viewMode === "slides") {
        if (e.key === "ArrowRight" || e.key === "PageDown") {
          setCurrentSlide((prev) => Math.min(totalSlides, prev + 1));
        } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
          setCurrentSlide((prev) => Math.max(1, prev - 1));
        }
      }
      if (e.key === "Escape" && onClose) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [viewMode, onClose]);

  // Payment breakdown: 50% / 30% / 20%
  const milestone50 = (data.grandTotal * 0.5).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const milestone30 = (data.grandTotal * 0.3).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const milestone20 = (data.grandTotal * 0.2).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 bg-[#030812] text-slate-100 flex flex-col overflow-hidden select-none font-sans"
    >
      {/* ==================================================================== */}
      {/* TOP CONTROLS & NAVIGATION BAR (HIDDEN IN PRINT)                     */}
      {/* ==================================================================== */}
      <header className="print:hidden w-full bg-[#061224] border-b border-[#142848] px-4 sm:px-6 py-3 flex items-center justify-between shrink-0 z-30 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="font-black text-white text-base tracking-wider">nEXT</span>
            <span className="text-[#00a3ff] font-bold text-sm">|</span>
            <span className="text-slate-300 font-semibold text-xs tracking-widest uppercase">
              befirst
            </span>
          </div>
          <span className="hidden sm:inline-block text-xs font-medium text-slate-500">|</span>
          <span className="hidden sm:inline-block text-xs font-semibold text-cyan-400">
            Proposal #{data.proposalNumber || "PROP-2026-0001"}
          </span>
          <span className="text-xs text-slate-400 truncate max-w-[200px]">
            ({data.companyName})
          </span>
        </div>

        {/* View mode toggle & Slide Nav */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Mode Switcher */}
          <div className="bg-[#091830] p-1 rounded-xl border border-[#162f59] flex items-center text-xs font-semibold">
            <button
              onClick={() => setViewMode("document")}
              className={`px-3 py-1.5 rounded-lg transition-all ${viewMode === "document"
                  ? "bg-[#00a3ff] text-white shadow"
                  : "text-slate-400 hover:text-white"
                }`}
            >
              All 24 Pages
            </button>
            <button
              onClick={() => setViewMode("slides")}
              className={`px-3 py-1.5 rounded-lg transition-all ${viewMode === "slides"
                  ? "bg-[#00a3ff] text-white shadow"
                  : "text-slate-400 hover:text-white"
                }`}
            >
              Slide Mode
            </button>
          </div>

          {/* Slide Pager (in slide mode) */}
          {viewMode === "slides" && (
            <div className="flex items-center gap-1.5 bg-[#091830] px-2.5 py-1.5 rounded-xl border border-[#162f59]">
              <button
                onClick={() => setCurrentSlide((p) => Math.max(1, p - 1))}
                disabled={currentSlide === 1}
                className="p-1 hover:text-white disabled:opacity-30 transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-bold font-mono px-1 text-slate-200">
                {currentSlide} / {totalSlides}
              </span>
              <button
                onClick={() => setCurrentSlide((p) => Math.min(totalSlides, p + 1))}
                disabled={currentSlide === totalSlides}
                className="p-1 hover:text-white disabled:opacity-30 transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Print / Download Button */}
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#00a3ff] to-[#0080e0] hover:from-[#0092e0] hover:to-[#0070c0] text-white font-bold text-xs shadow-md shadow-sky-500/20 transition cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Print / Save PDF</span>
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            title="Toggle fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Close Button */}
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-rose-950/60 transition"
              title="Close viewer"
            >
              <X className="w-5 h-5 text-rose-400" />
            </button>
          )}
        </div>
      </header>

      {/* ==================================================================== */}
      {/* MAIN DOCUMENT VIEWPORT                                              */}
      {/* ==================================================================== */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-8 flex flex-col items-center gap-8 bg-[#040914] print:p-0 print:m-0 print:bg-white print:overflow-visible">
        {/* Render Slides: either single active slide or all 24 slides */}
        {Array.from({ length: totalSlides }).map((_, idx) => {
          const slideNumber = idx + 1;
          if (viewMode === "slides" && currentSlide !== slideNumber) {
            return null;
          }

          return (
            <div
              key={slideNumber}
              className="w-full max-w-[1100px] aspect-[16/9] min-h-[580px] sm:min-h-[620px] rounded-2xl shadow-2xl overflow-hidden relative border border-[#162847] print:border-none print:shadow-none print:rounded-none print:max-w-none print:w-[297mm] print:h-[210mm] print:break-after-page print:m-0 shrink-0 bg-[#071326] transition-all"
            >
              <SlideContent slideNumber={slideNumber} data={data} milestone50={milestone50} milestone30={milestone30} milestone20={milestone20} calculatedWorkingDays={calculatedWorkingDays} formattedDate={formattedDate} />

              {/* Slide Number Badge (Hidden in print) */}
              <div className="absolute bottom-2 right-4 text-[10px] font-mono font-bold text-slate-500/80 print:hidden pointer-events-none">
                Page {slideNumber} of {totalSlides}
              </div>
            </div>
          );
        })}
      </main>

      {/* ==================================================================== */}
      {/* EMBEDDED PRINT STYLES                                               */}
      {/* ==================================================================== */}
      <style jsx global>{`
        @media print {
          body,
          html {
            background-color: white !important;
            color: black !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
          }
          header {
            display: none !important;
          }
          main {
            padding: 0 !important;
            margin: 0 !important;
            background: white !important;
            gap: 0 !important;
          }
          .print\\:break-after-page {
            page-break-after: always !important;
            break-after: page !important;
            height: 100vh !important;
            width: 100vw !important;
            border: none !important;
            border-radius: 0 !important;
            box-shadow: none !important;
          }
        }
      `}</style>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SLIDE CONTENT RENDERER (ALL 24 OFFICIAL SLIDES)
// ─────────────────────────────────────────────────────────────────────────────

interface SlideContentProps {
  slideNumber: number;
  data: ProposalDeckData;
  milestone50: string;
  milestone30: string;
  milestone20: string;
  calculatedWorkingDays: string;
  formattedDate: string;
}

function SlideContent({
  slideNumber,
  data,
  milestone50,
  milestone30,
  milestone20,
  calculatedWorkingDays,
  formattedDate,
}: SlideContentProps) {
  switch (slideNumber) {
    // -------------------------------------------------------------------------
    // SLIDE 1: COVER
    // -------------------------------------------------------------------------
    case 1:
      return (
        <div className="w-full h-full bg-gradient-to-br from-[#051124] via-[#081836] to-[#040e1e] p-8 sm:p-14 flex flex-col justify-between relative overflow-hidden text-white">
          <div className="absolute top-0 right-0 w-[55%] h-full bg-radial-gradient from-sky-500/10 via-transparent to-transparent pointer-events-none" />

          {/* Top Logo */}
          <div className="flex items-center gap-3">
            <span className="text-2xl font-black tracking-widest text-white">nEXT</span>
            <span className="text-2xl text-[#00a3ff] font-light">|</span>
            <span className="text-sm font-extrabold tracking-[0.25em] text-slate-300 uppercase">
              befirst
            </span>
          </div>
          <div className="text-[10px] tracking-[0.2em] font-semibold text-slate-400 uppercase -mt-4">
            BRANDING | MARKETING MEDIA &amp; PRODUCTION
          </div>

          {/* Main Title Banner & Visual Layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center my-auto">
            <div className="md:col-span-7 space-y-4">
              <h1 className="text-3xl sm:text-5xl font-black uppercase text-sky-400 tracking-tight leading-tight">
                A DIVISION OF <br />
                <span className="text-white">BEFIRST MEDIA</span> <br />
                <span className="text-sky-300">PRODUCTIONS</span>
              </h1>
              <div className="pt-2">
                <span className="text-sm sm:text-lg italic font-medium text-sky-400">
                  — {data.serviceCategory ? `${data.serviceCategory.toLowerCase()} proposal` : "website development proposal"}
                </span>
              </div>
            </div>

            {/* Laptop 3D Mockup Graphic representation */}
            <div className="md:col-span-5 flex justify-center">
              <div className="relative w-full max-w-[340px] aspect-[4/3] bg-gradient-to-br from-[#0c244d] to-[#051329] rounded-2xl border border-sky-400/40 p-4 shadow-[0_0_35px_rgba(0,163,255,0.25)] flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-sky-500/20 pb-2">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="text-[9px] font-mono text-sky-300 uppercase font-bold">
                    NEXT-GEN PORTAL
                  </span>
                </div>
                <div className="my-auto text-center space-y-2 py-4">
                  <span className="inline-block px-3 py-1 bg-sky-500/20 rounded-full border border-sky-400/30 text-[10px] font-bold text-sky-300 uppercase">
                    {data.packageName}
                  </span>
                  <h4 className="text-base font-black text-white">{data.companyName}</h4>
                  <p className="text-[11px] text-slate-300">Prepared exclusively for {data.clientName}</p>
                </div>
                <div className="bg-[#040e21] rounded-lg p-2 flex justify-between items-center text-[10px]">
                  <span className="text-slate-400">Total Investment:</span>
                  <span className="font-mono font-bold text-sky-400">AED {data.grandTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="border-t border-[#132c54] pt-3 text-center text-xs font-semibold text-slate-400 tracking-wider">
            www.nextmedia.ae
          </div>
        </div>
      );

    // -------------------------------------------------------------------------
    // SLIDE 2: PROPOSAL SUMMARY / METADATA
    // -------------------------------------------------------------------------
    case 2:
      return (
        <div className="w-full h-full bg-[#071329] p-8 sm:p-12 flex flex-col justify-between text-white relative">
          <div className="flex justify-between items-center pb-2 border-b border-sky-500/20">
            <span className="text-xs font-black tracking-widest text-sky-400 uppercase">
              PROPOSAL SUMMARY &amp; METADATA
            </span>
            <span className="text-xs font-bold text-slate-400">#{data.proposalNumber || "PROP-2026-0001"}</span>
          </div>

          {/* 6 Pill Metadata Rows */}
          <div className="max-w-3xl mx-auto w-full space-y-2.5 my-auto">
            {[
              { label: "Prepared For", value: data.clientName },
              { label: "Company", value: data.companyName },
              { label: "Selected Package", value: data.packageName },
              {
                label: "Investment:",
                value: `AED ${data.grandTotal.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`,
                highlight: true,
              },
              { label: "Proposal Date:", value: formattedDate },
              { label: "Proposal No.:", value: data.proposalNumber || "#PROP-2026-0001" },
            ].map((row, i) => (
              <div
                key={i}
                className="flex items-center rounded-xl bg-gradient-to-r from-[#0b1f42] to-[#071733] border border-sky-500/40 px-5 py-2.5 shadow-md"
              >
                <span className="w-44 text-xs font-bold text-slate-200 shrink-0 tracking-wide">
                  {row.label}
                </span>
                <span className="text-sky-400 font-bold mr-3">:</span>
                <span
                  className={`text-xs font-semibold truncate ${row.highlight
                      ? "text-sky-300 font-mono font-bold text-sm tracking-tight"
                      : "text-slate-100"
                    }`}
                >
                  {row.value}
                </span>
              </div>
            ))}
          </div>

          {/* Standard Intro Box */}
          <div className="max-w-3xl mx-auto w-full text-center space-y-1.5 pt-2">
            <h4 className="text-xs sm:text-sm font-extrabold text-sky-400 tracking-wider uppercase">
              SHORT STANDARD INTRODUCTION:
            </h4>
            <p className="text-[11px] sm:text-xs text-slate-300 leading-relaxed font-normal">
              A professional website development solution designed to establish a strong digital
              presence, present your business professionally, and provide a seamless experience for
              your customers.
            </p>
          </div>
        </div>
      );

    // -------------------------------------------------------------------------
    // SLIDE 3: ABOUT NEXT MEDIA & OUR SERVICES
    // -------------------------------------------------------------------------
    case 3:
      return (
        <div className="w-full h-full bg-slate-50 text-slate-900 p-8 sm:p-12 flex flex-col justify-between">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-black text-[#0066cc] uppercase tracking-tight">
              ABOUT NEXT MEDIA
            </h2>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              Next Media is a Dubai-based creative and digital solutions company and a division of
              BeFirst Media Productions.
            </p>
            <p className="text-xs text-slate-600 leading-relaxed">
              We provide businesses with integrated digital solutions covering website
              development, digital marketing, branding, media production and creative services.
            </p>
            <p className="text-xs text-slate-600 leading-relaxed">
              Our approach combines strategy, creativity and technology to create digital solutions
              aligned with each client&apos;s business objectives.
            </p>
          </div>

          {/* Services Box */}
          <div className="max-w-3xl mx-auto w-full space-y-3">
            <h3 className="text-xl font-black text-[#0066cc] text-center uppercase tracking-tight">
              OUR SERVICES
            </h3>
            <div className="bg-[#0b2752] text-white rounded-2xl p-6 shadow-xl border border-sky-800">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-8 text-xs font-semibold">
                {[
                  "Website Design & Development",
                  "Digital Marketing",
                  "Social Media Management",
                  "Branding & Creative Design",
                  "Video Production",
                  "Photography & Videography",
                  "SEO",
                  "Business Digital Solutions",
                ].map((s, idx) => (
                  <div key={idx} className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-sky-400 shrink-0" />
                    <span>{s}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center text-[10px] text-slate-400 font-semibold border-t border-slate-200 pt-3">
            <span>Next Media | BeFirst Media Productions</span>
            <span>www.nextmedia.ae</span>
          </div>
        </div>
      );

    // -------------------------------------------------------------------------
    // SLIDE 4: PROJECT OVERVIEW & UNDERSTANDING YOUR REQUIREMENT
    // -------------------------------------------------------------------------
    case 4:
      return (
        <div className="w-full h-full bg-[#08152c] text-white p-8 sm:p-12 flex flex-col justify-between">
          <div>
            <span className="text-xs font-extrabold text-sky-400 tracking-widest uppercase">
              | Understanding Your Requirement
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center my-auto">
            {/* Left Mockup Graphic */}
            <div className="md:col-span-5 flex justify-center">
              <div className="w-full max-w-[320px] aspect-[4/3] bg-[#0c1f3d] rounded-2xl border border-sky-500/40 p-4 shadow-xl space-y-3">
                <div className="flex items-center gap-1.5 pb-2 border-b border-sky-500/20">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
                  <span className="text-[10px] font-bold text-slate-300">Target Digital Experience</span>
                </div>
                <div className="text-center py-4 space-y-1">
                  <h4 className="text-base font-black text-sky-300 uppercase">{data.packageName}</h4>
                  <p className="text-[11px] text-slate-300">Custom tailored for {data.companyName}</p>
                </div>
                <div className="bg-[#071326] p-2 rounded-lg text-[10px] text-slate-400 flex justify-between">
                  <span>Industry:</span>
                  <span className="font-semibold text-slate-200">{data.industry || "General"}</span>
                </div>
              </div>
            </div>

            {/* Right Overview Points */}
            <div className="md:col-span-7 space-y-3">
              <h2 className="text-2xl sm:text-3xl font-black uppercase text-sky-400 tracking-tight">
                PROJECT OVERVIEW
              </h2>
              <p className="text-xs text-slate-300 font-medium">
                Based on the selected package, Next Media will design and develop a professional website for:
              </p>
              <div className="bg-gradient-to-r from-[#0b2752] to-[#071d3d] border border-sky-400/50 rounded-xl px-4 py-2 font-black text-sm text-white">
                Client: {data.companyName}
              </div>

              <div className="pt-2">
                <h4 className="text-xs font-bold text-slate-200 mb-2">The website will be developed to:</h4>
                <div className="space-y-1.5 text-xs text-slate-300">
                  {[
                    "Establish a professional online presence",
                    "Present the company's services/products",
                    "Improve customer experience",
                    "Generate enquiries and leads",
                    "Provide mobile-friendly access",
                    "Build trust and credibility",
                    "Support the client's digital growth",
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="text-right text-[10px] text-slate-500 font-medium border-t border-[#12284c] pt-2">
            Next Media Solutions
          </div>
        </div>
      );

    // -------------------------------------------------------------------------
    // SLIDE 5: PROJECT APPROACH & SELECTED PACKAGE & SCOPE
    // -------------------------------------------------------------------------
    case 5:
      return (
        <div className="w-full h-full bg-slate-50 text-slate-900 p-8 sm:p-12 flex flex-col justify-between">
          <div className="text-center space-y-3">
            <h2 className="text-2xl sm:text-3xl font-black text-[#0066cc] uppercase tracking-tight">
              PROJECT APPROACH
            </h2>
            {/* Step Chevron */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              {["Plan", "Design", "Develop", "Test", "Launch"].map((step, idx, arr) => (
                <React.Fragment key={idx}>
                  <div className="px-5 py-2 rounded-xl bg-[#0b2752] text-white text-xs font-black shadow-md">
                    {step}
                  </div>
                  {idx < arr.length - 1 && <span className="text-sky-600 font-bold">→</span>}
                </React.Fragment>
              ))}
            </div>
            <p className="text-xs text-slate-600 font-medium pt-1">
              The project will be executed according to the selected website package and the approved scope of work.
            </p>
          </div>

          {/* Dynamic CRM Generated Page Box */}
          <div className="max-w-2xl mx-auto w-full text-center space-y-3 my-auto">
            <div className="text-xs font-extrabold text-[#0066cc] uppercase tracking-wider">
              | Selected Package &amp; Scope of Work
            </div>
            <div className="text-[11px] font-black tracking-widest uppercase text-slate-500">
              THIS IS THE DYNAMIC CRM-GENERATED PROPOSAL
            </div>

            <div className="bg-[#0b2752] text-white rounded-2xl py-3 px-6 shadow-xl border border-sky-800">
              <span className="text-xl sm:text-2xl font-black tracking-wide uppercase">
                {data.packageName}
              </span>
            </div>

            <div className="pt-2 space-y-2">
              <span className="text-xs font-black text-slate-700 uppercase tracking-widest block">
                PACKAGE INVESTMENT
              </span>
              <div className="bg-[#0b2752] text-sky-400 rounded-2xl py-3 px-6 shadow-xl border border-sky-800">
                <span className="text-xl sm:text-2xl font-black font-mono tracking-tight">
                  AED {data.grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center text-[10px] text-slate-400 border-t border-slate-200 pt-3">
            <span>Client: {data.companyName}</span>
            <span>www.nextmedia.ae</span>
          </div>
        </div>
      );

    // -------------------------------------------------------------------------
    // SLIDE 6: SCOPE OF WORK (DYNAMIC MATRIX)
    // -------------------------------------------------------------------------
    case 6:
      return (
        <div className="w-full h-full bg-[#08152c] text-white p-8 sm:p-12 flex flex-col justify-between">
          <div className="text-center space-y-1">
            <h2 className="text-2xl sm:text-3xl font-black uppercase text-sky-400 tracking-tight">
              SCOPE OF WORK
            </h2>
            <p className="text-xs text-slate-300">
              The following services and features are included in the selected package:
            </p>
          </div>

          {/* Scope Table */}
          <div className="max-w-3xl mx-auto w-full my-auto overflow-hidden rounded-2xl border border-sky-500/40 shadow-2xl bg-[#0a1b38]">
            <div className="grid grid-cols-12 bg-gradient-to-r from-[#0c2854] to-[#071b3b] p-3 text-xs font-black text-sky-300 border-b border-sky-500/30 uppercase tracking-wider">
              <div className="col-span-8">SCOPE</div>
              <div className="col-span-4 text-center">INCLUDED</div>
            </div>
            <div className="divide-y divide-sky-500/15 text-xs">
              {[
                { name: "Website Design", status: "✓ Included" },
                { name: "Responsive Development", status: "✓ Included" },
                { name: "Pages / Structure", status: data.packageFeatures[0] || "Custom Pages Included" },
                { name: "Admin / CMS Module", status: "Included" },
                { name: "Contact & Enquiry Form", status: "Included" },
                { name: "WhatsApp & Social Links", status: "Included" },
                { name: "Basic SEO Setup", status: "Included" },
                { name: "Domain & DNS Setup", status: "Included" },
                { name: "Cloud Hosting Deployment", status: "Included" },
                { name: "SSL Certificate (HTTPS)", status: "Included" },
                { name: "Post-Launch Warranty", status: "30 Days Basic Support" },
              ].map((row, idx) => (
                <div key={idx} className="grid grid-cols-12 p-2 px-4 items-center hover:bg-sky-500/5 transition">
                  <div className="col-span-8 font-medium text-slate-200">{row.name}</div>
                  <div className="col-span-4 text-center font-bold text-sky-400">{row.status}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center text-[10px] text-slate-400 border-t border-[#12284c] pt-2">
            Package: {data.packageName} — All core deliverables included
          </div>
        </div>
      );

    // -------------------------------------------------------------------------
    // SLIDE 7: INCLUDED PAGES
    // -------------------------------------------------------------------------
    case 7:
      return (
        <div className="w-full h-full bg-[#08152c] text-white p-8 sm:p-12 flex flex-col justify-between">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center my-auto">
            <div className="md:col-span-7 space-y-4">
              <h2 className="text-3xl font-black uppercase text-sky-400 tracking-tight">
                INCLUDED PAGES
              </h2>
              <p className="text-xs text-sky-300 font-semibold uppercase tracking-wider">
                [CRM automatically inserts package-specific pages]
              </p>

              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold text-slate-200 block">Deliverables list:</span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    "• Home Page",
                    "• About Us",
                    "• Services / Offerings",
                    "• Service Details",
                    "• Contact Us",
                    "• Blog / Updates",
                  ].map((p, idx) => (
                    <div key={idx} className="bg-[#0c1f3d] border border-sky-500/20 rounded-lg p-2 font-medium text-slate-200">
                      {p}
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-[11px] text-slate-400 pt-2 leading-relaxed">
                This page is completely dynamic according to the selected package ({data.packageName}).
              </p>
            </div>

            {/* Right Tablet Mockup Representation */}
            <div className="md:col-span-5 flex justify-center">
              <div className="w-full max-w-[300px] aspect-[4/3] bg-gradient-to-br from-[#0c2652] to-[#071938] rounded-2xl border-2 border-sky-400/50 p-4 shadow-2xl flex flex-col justify-between text-center">
                <span className="text-[10px] font-bold text-sky-300 uppercase tracking-wider">
                  Interactive Preview
                </span>
                <div className="py-4 space-y-2">
                  <h4 className="text-sm font-black text-white">{data.companyName}</h4>
                  <p className="text-[10px] text-slate-300">Modern Bespoke Web Layout</p>
                </div>
                <div className="bg-[#051126] p-2 rounded-lg text-[9px] text-slate-400">
                  Fully Responsive on Mobile &amp; Desktop
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between text-[10px] text-slate-500 border-t border-[#132c54] pt-2">
            <span>Next Media Digital Solutions</span>
            <span>www.nextmedia.ae</span>
          </div>
        </div>
      );

    // -------------------------------------------------------------------------
    // SLIDE 8: DEVELOPMENT PROCESS (6 STAGES)
    // -------------------------------------------------------------------------
    case 8:
      return (
        <div className="w-full h-full bg-slate-50 text-slate-900 p-8 sm:p-12 flex flex-col justify-between">
          <div>
            <span className="text-xs font-extrabold text-[#0066cc] tracking-widest uppercase">
              | Development &amp; Delivery
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0066cc] uppercase tracking-tight mt-1">
              DEVELOPMENT PROCESS
            </h2>
          </div>

          {/* 6 Step Bento Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 my-auto">
            {[
              { num: "01.", title: "Requirement & Planning", desc: "Understanding the business, target audience and website requirements." },
              { num: "02.", title: "UI/UX Design", desc: "Creating the website structure and visual design according to the client's brand." },
              { num: "03.", title: "Development", desc: "Converting the approved design into a functional responsive website." },
              { num: "04.", title: "Testing", desc: "Testing the website across major browsers, devices and screen sizes." },
              { num: "05.", title: "Final Review", desc: "Client review and final corrections within the agreed scope." },
              { num: "06.", title: "Launch", desc: "Deployment of the completed website after final approval and payment." },
            ].map((step, idx) => (
              <div key={idx} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-black text-sky-500 font-mono">{step.num}</span>
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-tight leading-snug">
                    {step.title}
                  </span>
                </div>
                <div className="bg-[#0b2752] text-white text-[10px] p-2.5 rounded-lg leading-relaxed font-medium">
                  {step.desc}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center text-[10px] text-slate-400 border-t border-slate-200 pt-2">
            <span>Stage-wise Quality Assurance</span>
            <span>www.nextmedia.ae</span>
          </div>
        </div>
      );

    // -------------------------------------------------------------------------
    // SLIDE 9: ESTIMATED TIMELINE
    // -------------------------------------------------------------------------
    case 9:
      return (
        <div className="w-full h-full bg-[#08152c] text-white p-8 sm:p-12 flex flex-col justify-between">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center my-auto">
            <div className="md:col-span-7 space-y-4">
              <h2 className="text-3xl font-black uppercase text-sky-400 tracking-tight">
                ESTIMATED TIMELINE
              </h2>

              <div className="bg-gradient-to-r from-[#0b2752] to-[#071d3d] border border-sky-400/50 rounded-xl px-5 py-3 font-black text-lg text-white">
                {calculatedWorkingDays}
              </div>

              <div className="space-y-2 pt-2">
                <h4 className="text-sm font-bold text-slate-200">Timeline begins after:</h4>
                <div className="bg-[#0c1f3d] border border-sky-500/20 rounded-xl p-4 space-y-2 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                    <span>Confirmation of the project</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                    <span>Initial payment</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                    <span>Receipt of required content/materials</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                    <span>Required approvals</span>
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 italic">
                Client-side delays in providing content or approvals may affect the delivery timeline.
              </p>
            </div>

            {/* Mobile graphic representation */}
            <div className="md:col-span-5 flex justify-center">
              <div className="w-[200px] aspect-[9/16] bg-[#051124] rounded-3xl border-4 border-slate-700 p-3 shadow-2xl flex flex-col justify-between text-center">
                <div className="w-16 h-3 bg-slate-800 rounded-full mx-auto" />
                <div className="space-y-2 py-4">
                  <span className="text-[9px] font-bold text-sky-400 uppercase">Speed &amp; Delivery</span>
                  <h4 className="text-xs font-black text-white">{data.companyName}</h4>
                  <div className="text-[10px] font-mono font-bold text-sky-300">
                    Target: {data.expectedDeliveryDate ? new Date(data.expectedDeliveryDate).toLocaleDateString() : "Scheduled"}
                  </div>
                </div>
                <div className="w-10 h-1 bg-slate-700 rounded-full mx-auto" />
              </div>
            </div>
          </div>

          <div className="text-right text-[10px] text-slate-500 border-t border-[#12284c] pt-2">
            Next Media Timeline Engine
          </div>
        </div>
      );

    // -------------------------------------------------------------------------
    // SLIDE 10: CLIENT RESPONSIBILITIES & REVISIONS
    // -------------------------------------------------------------------------
    case 10:
      return (
        <div className="w-full h-full bg-slate-50 text-slate-900 p-8 sm:p-12 flex flex-col justify-between">
          <div>
            <span className="text-xs font-extrabold text-[#0066cc] tracking-widest uppercase">
              | Client Responsibilities &amp; Terms
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0066cc] uppercase tracking-tight mt-1">
              CLIENT RESPONSIBILITIES
            </h2>
          </div>

          <div className="space-y-4 my-auto max-w-3xl mx-auto w-full">
            <p className="text-xs font-bold text-slate-700">The client is responsible for providing:</p>
            <div className="bg-[#0b2752] text-white rounded-2xl p-5 shadow-lg">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6 text-xs font-medium">
                {[
                  "Company information",
                  "Product/service information",
                  "Logo and branding materials",
                  "Contact details",
                  "Website content",
                  "Required documents",
                  "Images/videos",
                  "Necessary approvals",
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-xs text-slate-600 italic">
              The client must provide feedback and approvals within a reasonable timeframe to maintain the agreed project schedule.
            </p>

            <div className="pt-2">
              <h3 className="text-xl font-black text-[#0066cc] uppercase tracking-tight">REVISIONS</h3>
              <p className="text-xs text-slate-700 leading-relaxed mt-1 font-medium">
                The selected package includes 2-3 rounds of revisions. Revisions must remain within the approved project scope. Additional changes, pages or functionality may be charged separately.
              </p>
            </div>
          </div>

          <div className="text-[10px] text-slate-400 border-t border-slate-200 pt-2 flex justify-between">
            <span>Next Media Terms of Service</span>
            <span>www.nextmedia.ae</span>
          </div>
        </div>
      );

    // -------------------------------------------------------------------------
    // SLIDE 11: ADDITIONAL REQUIREMENTS
    // -------------------------------------------------------------------------
    case 11:
      return (
        <div className="w-full h-full bg-slate-50 text-slate-900 p-8 sm:p-12 flex flex-col justify-between">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center my-auto">
            <div className="md:col-span-7 space-y-4">
              <h2 className="text-2xl sm:text-3xl font-black text-[#0066cc] uppercase tracking-tight">
                ADDITIONAL REQUIREMENTS
              </h2>
              <p className="text-xs text-slate-700 font-medium leading-relaxed">
                Any functionality or service not specifically mentioned in the selected package will be considered an additional requirement and will be quoted separately.
              </p>

              <div className="space-y-2 pt-2">
                <span className="text-xs font-black text-slate-700 uppercase">Examples:</span>
                <div className="bg-[#0b2752] text-white rounded-2xl p-5 shadow-lg">
                  <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs font-medium">
                    {[
                      "• E-commerce",
                      "• Additional pages",
                      "• Payment gateway",
                      "• Additional languages",
                      "• Booking system",
                      "• Advanced SEO",
                      "• Custom CRM integration",
                      "• Custom dashboards",
                      "• API integration",
                      "• Custom Animations",
                    ].map((item, idx) => (
                      <div key={idx}>{item}</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Laptop mockup representation */}
            <div className="md:col-span-5 flex justify-center">
              <div className="w-full max-w-[300px] aspect-[4/3] bg-[#071d3d] rounded-2xl p-4 text-white shadow-xl flex flex-col justify-between text-center border border-sky-600">
                <span className="text-[10px] font-bold text-sky-300 uppercase">Expandable Architecture</span>
                <h4 className="text-base font-black text-white">{data.packageName}</h4>
                <div className="bg-[#030e21] p-2 rounded text-[10px] text-slate-300">
                  Modular upgrades can be added anytime
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between text-[10px] text-slate-400 border-t border-slate-200 pt-2">
            <span>Next Media Modular Architecture</span>
            <span>www.nextmedia.ae</span>
          </div>
        </div>
      );

    // -------------------------------------------------------------------------
    // SLIDE 12: INVESTMENT & PAYMENT TERMS, OWNERSHIP & SUPPORT
    // -------------------------------------------------------------------------
    case 12:
      return (
        <div className="w-full h-full bg-slate-50 text-slate-900 p-8 sm:p-12 flex flex-col justify-between">
          <div>
            <span className="text-xs font-extrabold text-[#0066cc] tracking-widest uppercase">
              | Payment &amp; Agreement
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 my-auto">
            {/* Left: Investment & Payment Terms */}
            <div className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-black text-[#0066cc] uppercase tracking-tight">
                INVESTMENT &amp; <br /> PAYMENT TERMS
              </h2>
              <div className="bg-[#0b2752] text-white rounded-xl p-3 text-center shadow-md">
                <span className="text-xs text-slate-300 block font-bold">Total Project Cost</span>
                <span className="text-xl font-black font-mono text-sky-400">
                  AED {data.grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-slate-800 font-semibold pt-1">
                <span className="text-xs font-bold text-slate-900 uppercase block mb-2">Payment Schedule:</span>
                <div className="flex justify-between border-b border-slate-200 pb-1">
                  <span>50% — Project Confirmation:</span>
                  <span className="font-mono text-sky-700 font-bold">AED {milestone50}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-1">
                  <span>30% — Development Milestone:</span>
                  <span className="font-mono text-sky-700 font-bold">AED {milestone30}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-1">
                  <span>20% — Final Delivery:</span>
                  <span className="font-mono text-sky-700 font-bold">AED {milestone20}</span>
                </div>
              </div>
              <p className="text-[10px] text-slate-500 italic">
                Payment terms may vary according to the selected package or agreed quotation.
              </p>
            </div>

            {/* Right: Ownership & Support */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-black text-[#0066cc] uppercase tracking-tight">
                  OWNERSHIP &amp; HANDOVER
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium mt-1">
                  Upon receipt of the complete project payment, the agreed website deliverables will be handed over to the client.
                </p>
                <p className="text-[11px] text-slate-500 leading-relaxed mt-1">
                  Third-party software, plugins, APIs, hosting services, stock assets and other licensed materials remain subject to their respective terms and licences.
                </p>
              </div>

              <div className="pt-2">
                <h3 className="text-lg font-black text-[#0066cc] uppercase tracking-tight">
                  SUPPORT
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium mt-1">
                  Next Media will provide 30 days basic technical support after website delivery, according to the selected package.
                </p>
                <p className="text-[11px] text-slate-500 leading-relaxed mt-1">
                  New features, additional pages and changes outside the agreed scope are not included in standard support.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-between text-[10px] text-slate-400 border-t border-slate-200 pt-2">
            <span>Official Commercial Terms</span>
            <span>www.nextmedia.ae</span>
          </div>
        </div>
      );

    // -------------------------------------------------------------------------
    // SLIDE 13: PROJECT AGREEMENT
    // -------------------------------------------------------------------------
    case 13:
      return (
        <div className="w-full h-full bg-slate-50 text-slate-900 p-8 sm:p-12 flex flex-col justify-between">
          <div>
            <span className="text-xs font-extrabold text-[#0066cc] tracking-widest uppercase">
              | Agreement &amp; Signatures
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center my-auto">
            <div className="md:col-span-7 space-y-4">
              <h2 className="text-2xl sm:text-3xl font-black text-[#0066cc] uppercase tracking-tight">
                PROJECT AGREEMENT
              </h2>
              <p className="text-xs text-slate-700 font-medium">
                By approving this proposal, the client confirms that they have reviewed and accepted:
              </p>

              <div className="bg-[#0b2752] text-white rounded-2xl p-5 shadow-lg space-y-2.5 text-xs font-medium">
                <div className="grid grid-cols-2 gap-3">
                  <div>• Selected website package: {data.packageName}</div>
                  <div>• Project Timeline</div>
                  <div>• Scope of work &amp; deliverables</div>
                  <div>• Revision policy</div>
                  <div>• Project investment: AED {data.grandTotal.toLocaleString()}</div>
                  <div>• Project terms and conditions</div>
                  <div>• Payment terms: 50% / 30% / 20%</div>
                </div>
              </div>

              <p className="text-xs text-slate-600 font-medium leading-relaxed pt-2">
                This proposal, together with the approved quotation, forms the basis of the website development agreement between {data.companyName} and Next Media.
              </p>
            </div>

            {/* Laptop graphic */}
            <div className="md:col-span-5 flex justify-center">
              <div className="w-full max-w-[280px] aspect-[4/3] bg-[#071a36] rounded-2xl p-4 text-white shadow-xl flex flex-col justify-between border border-sky-500">
                <span className="text-[10px] font-bold text-sky-400 uppercase">Agreement Snapshot</span>
                <div className="py-2 space-y-1">
                  <h4 className="text-sm font-black text-white">{data.companyName}</h4>
                  <p className="text-[11px] text-slate-300">Package: {data.packageName}</p>
                </div>
                <div className="text-[10px] text-sky-300 font-mono">
                  AED {data.grandTotal.toLocaleString()} Total
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between text-[10px] text-slate-400 border-t border-slate-200 pt-2">
            <span>Binding Proposal Framework</span>
            <span>www.nextmedia.ae</span>
          </div>
        </div>
      );

    // -------------------------------------------------------------------------
    // SLIDE 14: TECHNOLOGIES & CONTENT
    // -------------------------------------------------------------------------
    case 14:
      return (
        <div className="w-full h-full bg-slate-50 text-slate-900 p-8 sm:p-12 flex flex-col justify-between">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 my-auto">
            {/* Left: Technologies */}
            <div className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-black text-[#0066cc] uppercase tracking-tight">
                POSSIBLE TECHNOLOGIES INCLUDE:
              </h2>
              <div className="bg-[#0b2752] text-white rounded-2xl p-5 shadow-lg space-y-2 text-xs font-medium">
                <div>• React / Next.js</div>
                <div>• Node.js</div>
                <div>• PostgreSQL / MongoDB / SQL database</div>
                <div>• CMS solutions where applicable</div>
                <div>• HTML5 / CSS3 / JavaScript</div>
                <div>• Responsive web technologies</div>
                <div>• Cloud / server hosting</div>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                The final technology stack will be selected by Next Media based on the project&apos;s technical requirements.
              </p>
            </div>

            {/* Right: Content */}
            <div className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-black text-[#0066cc] uppercase tracking-tight">
                CONTENT
              </h2>
              <p className="text-xs font-bold text-slate-700">The client will provide the required:</p>
              <div className="bg-[#0b2752] text-white rounded-2xl p-5 shadow-lg space-y-1.5 text-xs font-medium">
                <div>• Company information</div>
                <div>• Logo and brand assets</div>
                <div>• Images &amp; Media assets</div>
                <div>• Service/product information</div>
                <div>• Contact details</div>
                <div>• Existing documents &amp; Legal content</div>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                Next Media may assist with formatting and arranging the supplied content. Professional copywriting and media shoots are quoted separately if not in package.
              </p>
            </div>
          </div>

          <div className="flex justify-between text-[10px] text-slate-400 border-t border-slate-200 pt-2">
            <span>Next Media Modern Tech Stack</span>
            <span>www.nextmedia.ae</span>
          </div>
        </div>
      );

    // -------------------------------------------------------------------------
    // SLIDE 15: SEO & PERFORMANCE / DOMAIN & HOSTING
    // -------------------------------------------------------------------------
    case 15:
      return (
        <div className="w-full h-full bg-[#08152c] text-white p-8 sm:p-12 flex flex-col justify-between">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 my-auto">
            {/* Left: SEO & Performance */}
            <div className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-black uppercase text-sky-400 tracking-tight">
                SEO &amp; PERFORMANCE
              </h2>
              <p className="text-xs text-slate-300 font-medium">
                The website will be developed with basic SEO-friendly practices, including:
              </p>
              <div className="bg-[#0c1f3d] border border-sky-500/30 rounded-2xl p-5 space-y-2 text-xs font-medium text-slate-200">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                  <span>On-Page SEO Meta tags &amp; titles</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                  <span>Mobile-first responsive optimization</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                  <span>Image compression &amp; Fast load speed</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                  <span>XML Sitemap &amp; Robots.txt structure</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 italic">
                Advanced SEO campaigns, backlink building and paid advertising are separate services unless included in the quotation.
              </p>
            </div>

            {/* Right: Domain & Hosting */}
            <div className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-black uppercase text-sky-400 tracking-tight">
                DOMAIN &amp; HOSTING
              </h2>
              <p className="text-xs text-slate-300 font-medium">
                Domain and hosting can be provided or managed by Next Media based on the selected package.
              </p>
              <div className="bg-[#0c1f3d] border border-sky-500/30 rounded-2xl p-5 space-y-2 text-xs font-medium text-slate-200">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                  <span>Domain registration / DNS configuration</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                  <span>High-performance Cloud website hosting</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                  <span>SSL security certificate setup (HTTPS)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                  <span>Business email configuration assistance</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between text-[10px] text-slate-500 border-t border-[#12284c] pt-2">
            <span>Next Media Infrastructure</span>
            <span>www.nextmedia.ae</span>
          </div>
        </div>
      );

    // -------------------------------------------------------------------------
    // SLIDE 16: PROJECT PROCESS (STAGE 01 TO STAGE 08)
    // -------------------------------------------------------------------------
    case 16:
      return (
        <div className="w-full h-full bg-[#08152c] text-white p-8 sm:p-12 flex flex-col justify-between">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-black uppercase text-sky-400 tracking-tight">
              PROJECT PROCESS
            </h2>
          </div>

          {/* 8 Bento Grid Stages */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-auto">
            {[
              { stage: "STAGE 01", title: "DISCOVERY", desc: "Understanding the client's business, requirements, target audience and objectives." },
              { stage: "STAGE 02", title: "PLANNING", desc: "Finalising website structure, sitemap and functionality." },
              { stage: "STAGE 03", title: "UI/UX DESIGN", desc: "Creating the visual design and user experience." },
              { stage: "STAGE 04", title: "CLIENT APPROVAL", desc: "Client reviews and approves the proposed design." },
              { stage: "STAGE 05", title: "DEVELOPMENT", desc: "Approved designs are converted into a functional website." },
              { stage: "STAGE 06", title: "TESTING", desc: "Testing across major browsers, screen sizes and website functions." },
              { stage: "STAGE 07", title: "FINAL REVIEW", desc: "Client reviews the completed website and provides final feedback." },
              { stage: "STAGE 08", title: "LAUNCH", desc: "Website deployment and handover after completion of the agreed requirements." },
            ].map((st, idx) => (
              <div key={idx} className="bg-[#0b244d] rounded-xl border border-sky-500/30 p-3 flex flex-col justify-between shadow-md">
                <div>
                  <span className="text-[10px] font-black text-sky-400 block tracking-wider font-mono">
                    {st.stage}
                  </span>
                  <h4 className="text-xs font-black text-white uppercase tracking-tight mt-0.5">
                    {st.title}
                  </h4>
                </div>
                <p className="text-[10px] text-slate-300 mt-2 leading-snug">
                  {st.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center text-[10px] text-slate-500 border-t border-[#12284c] pt-2">
            Structured End-to-End Implementation
          </div>
        </div>
      );

    // -------------------------------------------------------------------------
    // SLIDE 17: PROJECT TIMELINE & MILESTONES
    // -------------------------------------------------------------------------
    case 17:
      return (
        <div className="w-full h-full bg-slate-50 text-slate-900 p-8 sm:p-12 flex flex-col justify-between">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0066cc] uppercase tracking-tight">
              PROJECT TIMELINE
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center my-auto">
            <div className="md:col-span-7 space-y-4">
              <div className="space-y-1">
                <span className="text-xs font-black text-slate-700 uppercase">Estimated development period:</span>
                <div className="bg-[#0b2752] text-white rounded-xl p-3.5 text-center shadow-lg font-mono font-black text-base text-sky-400">
                  {calculatedWorkingDays}
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-bold text-slate-800">The timeline will begin after:</h4>
                <div className="bg-[#0b2752] text-white rounded-xl p-4 space-y-2 text-xs font-medium">
                  <div>1. Agreement confirmation</div>
                  <div>2. Initial payment (50%)</div>
                  <div>3. Receipt of required content/materials</div>
                  <div>4. Confirmation of project requirements</div>
                </div>
              </div>

              <p className="text-[11px] text-slate-500 italic leading-relaxed">
                Delays in receiving content, approvals or feedback from the client may affect the delivery schedule.
              </p>
            </div>

            {/* Laptop graphic */}
            <div className="md:col-span-5 flex justify-center">
              <div className="w-full max-w-[280px] aspect-[4/3] bg-[#071a36] rounded-2xl p-4 text-white shadow-xl flex flex-col justify-between text-center border border-sky-500">
                <span className="text-[10px] font-bold text-sky-400 uppercase">Agile Timeline</span>
                <div className="py-2">
                  <h4 className="text-sm font-black text-white">{data.companyName}</h4>
                  <p className="text-[11px] text-slate-300">Fast delivery execution</p>
                </div>
                <div className="text-[10px] text-sky-300 font-mono">
                  {calculatedWorkingDays}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between text-[10px] text-slate-400 border-t border-slate-200 pt-2">
            <span>Next Media Project Management</span>
            <span>www.nextmedia.ae</span>
          </div>
        </div>
      );

    // -------------------------------------------------------------------------
    // SLIDE 18: PAYMENT TERMS & CLIENT RESPONSIBILITIES
    // -------------------------------------------------------------------------
    case 18:
      return (
        <div className="w-full h-full bg-slate-50 text-slate-900 p-8 sm:p-12 flex flex-col justify-between">
          <div className="space-y-3">
            <h2 className="text-2xl sm:text-3xl font-black text-[#0066cc] uppercase tracking-tight">
              PAYMENT TERMS
            </h2>
            <span className="text-xs font-bold text-slate-600 block">Recommended payment structure:</span>

            {/* 3 Payment Columns */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-[#0b2752] text-white p-4 rounded-xl shadow-md text-center space-y-1">
                <span className="text-2xl font-black font-mono text-sky-400 block">50%</span>
                <p className="text-[11px] text-slate-300">Project Confirmation Required before starting the project.</p>
                <span className="text-xs font-mono font-bold text-sky-300 block pt-1">AED {milestone50}</span>
              </div>
              <div className="bg-[#0b2752] text-white p-4 rounded-xl shadow-md text-center space-y-1">
                <span className="text-2xl font-black font-mono text-sky-400 block">30%</span>
                <p className="text-[11px] text-slate-300">Design &amp; Development Stage Payable after design approval milestone.</p>
                <span className="text-xs font-mono font-bold text-sky-300 block pt-1">AED {milestone30}</span>
              </div>
              <div className="bg-[#0b2752] text-white p-4 rounded-xl shadow-md text-center space-y-1">
                <span className="text-2xl font-black font-mono text-sky-400 block">20%</span>
                <p className="text-[11px] text-slate-300">Final Delivery Payable before final website launch and handover.</p>
                <span className="text-xs font-mono font-bold text-sky-300 block pt-1">AED {milestone20}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <h3 className="text-xl font-black text-[#0066cc] uppercase tracking-tight">
              CLIENT RESPONSIBILITIES
            </h3>
            <span className="text-xs font-bold text-slate-600 block">The client agrees to:</span>
            <div className="bg-[#0b2752] text-white p-4 rounded-xl shadow-md text-xs font-medium">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-1.5 gap-x-6">
                <div>• Provide accurate project information</div>
                <div>• Provide approvals within a reasonable period</div>
                <div>• Provide required content and images</div>
                <div>• Make payments according to the agreed schedule</div>
                <div>• Provide timely feedback</div>
                <div>• Provide access credentials where required</div>
                <div>• Review submitted designs</div>
              </div>
            </div>
          </div>

          <div className="flex justify-between text-[10px] text-slate-400 border-t border-slate-200 pt-2">
            <span>Next Media Commercial Operations</span>
            <span>www.nextmedia.ae</span>
          </div>
        </div>
      );

    // -------------------------------------------------------------------------
    // SLIDE 19: ADDITIONAL WORK / MAINTENANCE & SUPPORT
    // -------------------------------------------------------------------------
    case 19:
      return (
        <div className="w-full h-full bg-[#08152c] text-white p-8 sm:p-12 flex flex-col justify-between">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 my-auto">
            {/* Additional Work */}
            <div className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-black uppercase text-sky-400 tracking-tight">
                ADDITIONAL WORK
              </h2>
              <p className="text-xs text-slate-300 font-medium leading-relaxed">
                Any requirement not specifically mentioned in this proposal will be considered an additional service.
              </p>
              <div className="bg-[#0c1f3d] border border-sky-500/20 rounded-xl p-4 text-xs font-medium space-y-1 text-slate-200">
                <span className="text-sky-300 font-bold block mb-1">Examples include:</span>
                <div>• Additional pages &amp; Custom dashboards</div>
                <div>• E-commerce &amp; Payment gateway integration</div>
                <div>• Booking systems &amp; CRM integration</div>
                <div>• API integrations &amp; Custom micro-animations</div>
                <div>• Additional languages &amp; Mobile applications</div>
              </div>
            </div>

            {/* Maintenance & Support */}
            <div className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-black uppercase text-sky-400 tracking-tight">
                MAINTENANCE &amp; SUPPORT
              </h2>
              <p className="text-xs text-slate-300 font-medium leading-relaxed">
                After website delivery, Next Media will provide 30 days of basic technical support for issues related to the delivered website.
              </p>
              <div className="bg-[#0c1f3d] border border-sky-500/20 rounded-xl p-4 text-xs font-medium space-y-1 text-slate-300">
                <span className="text-sky-300 font-bold block mb-1">Support does not include:</span>
                <div>• New features &amp; New pages</div>
                <div>• Major design changes</div>
                <div>• Third-party service problems &amp; Client errors</div>
                <div>• Hosting/server issues outside Next Media&apos;s control</div>
              </div>
              <p className="text-[11px] text-slate-400 italic">
                Monthly website maintenance can be provided under a separate agreement.
              </p>
            </div>
          </div>

          <div className="flex justify-between text-[10px] text-slate-500 border-t border-[#12284c] pt-2">
            <span>Next Media Support SLA</span>
            <span>www.nextmedia.ae</span>
          </div>
        </div>
      );

    // -------------------------------------------------------------------------
    // SLIDE 20: OWNERSHIP & HANDOVER / CONFIDENTIALITY
    // -------------------------------------------------------------------------
    case 20:
      return (
        <div className="w-full h-full bg-slate-50 text-slate-900 p-8 sm:p-12 flex flex-col justify-between">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center my-auto">
            <div className="md:col-span-7 space-y-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-[#0066cc] uppercase tracking-tight">
                  OWNERSHIP &amp; HANDOVER
                </h2>
                <p className="text-xs text-slate-700 leading-relaxed font-medium mt-1">
                  Upon receipt of the full project payment, the client will receive the agreed website deliverables.
                </p>
                <p className="text-xs text-slate-600 leading-relaxed mt-1">
                  Third-party software, plugins, stock images, fonts, APIs and other licensed materials remain subject to their respective licence terms.
                </p>
                <p className="text-xs text-slate-600 leading-relaxed mt-1">
                  Next Media may retain the right to display the completed project in its portfolio unless the client requests otherwise in writing.
                </p>
              </div>

              <div className="pt-2">
                <h2 className="text-xl sm:text-2xl font-black text-[#0066cc] uppercase tracking-tight">
                  CONFIDENTIALITY
                </h2>
                <p className="text-xs text-slate-700 leading-relaxed font-medium mt-1">
                  Both parties agree to maintain confidentiality regarding confidential business information, credentials, documents, data and materials exchanged during the project.
                </p>
                <p className="text-xs text-slate-600 leading-relaxed mt-1">
                  Neither party shall disclose confidential information to third parties without appropriate authorisation, except where required by law.
                </p>
              </div>
            </div>

            {/* Laptop graphic */}
            <div className="md:col-span-5 flex justify-center">
              <div className="w-full max-w-[280px] aspect-[4/3] bg-[#071a36] rounded-2xl p-4 text-white shadow-xl flex flex-col justify-between text-center border border-sky-500">
                <span className="text-[10px] font-bold text-sky-400 uppercase">IP &amp; Security</span>
                <div className="py-2 space-y-1">
                  <h4 className="text-sm font-black text-white">{data.companyName}</h4>
                  <p className="text-[10px] text-slate-300">100% Deliverable Ownership</p>
                </div>
                <div className="text-[10px] text-sky-300 font-mono">Full Handover Upon Settlement</div>
              </div>
            </div>
          </div>

          <div className="flex justify-between text-[10px] text-slate-400 border-t border-slate-200 pt-2">
            <span>Next Media IP &amp; Legal Framework</span>
            <span>www.nextmedia.ae</span>
          </div>
        </div>
      );

    // -------------------------------------------------------------------------
    // SLIDE 21: PROJECT CANCELLATION
    // -------------------------------------------------------------------------
    case 21:
      return (
        <div className="w-full h-full bg-[#08152c] text-white p-8 sm:p-12 flex flex-col justify-between">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center my-auto">
            <div className="md:col-span-7 space-y-4">
              <h2 className="text-3xl font-black uppercase text-sky-400 tracking-tight">
                PROJECT CANCELLATION
              </h2>
              <div className="bg-[#0c1f3d] border border-sky-500/30 rounded-2xl p-5 space-y-3 text-xs text-slate-200 font-medium leading-relaxed">
                <p>
                  If the client cancels the project after commencement, payments made for completed work, design, development, third-party services or committed project resources shall not be refundable.
                </p>
                <p>
                  Any outstanding amount for work already completed will remain payable.
                </p>
                <p>
                  If Next Media is unable to continue the project due to circumstances within its control, the parties will discuss an appropriate settlement based on the work completed.
                </p>
              </div>
            </div>

            {/* Laptop graphic */}
            <div className="md:col-span-5 flex justify-center">
              <div className="w-full max-w-[280px] aspect-[4/3] bg-[#051124] rounded-2xl border border-sky-500/40 p-4 shadow-xl flex flex-col justify-between text-center">
                <span className="text-[10px] font-bold text-sky-400 uppercase">Policy Standard</span>
                <div className="py-2">
                  <h4 className="text-sm font-black text-white">Client Agreement</h4>
                  <p className="text-[10px] text-slate-300">Mutual Protection</p>
                </div>
                <div className="text-[10px] text-slate-400">BeFirst Media Productions</div>
              </div>
            </div>
          </div>

          <div className="text-right text-[10px] text-slate-500 border-t border-[#12284c] pt-2">
            Next Media Cancellation Policy
          </div>
        </div>
      );

    // -------------------------------------------------------------------------
    // SLIDE 22: WEBSITE SECURITY & THIRD PARTY SERVICES
    // -------------------------------------------------------------------------
    case 22:
      return (
        <div className="w-full h-full bg-slate-50 text-slate-900 p-8 sm:p-12 flex flex-col justify-between">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 my-auto">
            {/* Website Security */}
            <div className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-black text-[#0066cc] uppercase tracking-tight">
                WEBSITE SECURITY
              </h2>
              <p className="text-xs text-slate-700 font-medium">
                Next Media will follow reasonable development and security practices during website development.
              </p>
              <div className="space-y-1 text-xs text-slate-700">
                <span className="font-bold text-slate-800 block">However, Next Media cannot guarantee protection against every possible:</span>
                <div className="bg-[#0b2752] text-white rounded-xl p-4 space-y-1 text-xs font-medium">
                  <div>• Cyberattack &amp; Server failure</div>
                  <div>• Third-party vulnerability &amp; Malware infection</div>
                  <div>• Hosting failure &amp; External service interruption</div>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                Regular backups and maintenance are recommended after launch.
              </p>
            </div>

            {/* Third Party Services */}
            <div className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-black text-[#0066cc] uppercase tracking-tight">
                THIRD PARTY SERVICES
              </h2>
              <p className="text-xs text-slate-700 font-medium">
                Third-party services such as:
              </p>
              <div className="bg-[#0b2752] text-white rounded-xl p-4 text-xs font-medium space-y-1">
                <div>• Payment gateways &amp; APIs</div>
                <div>• Hosting providers &amp; Plugins</div>
                <div>• Google services &amp; Stock media</div>
                <div>• WhatsApp &amp; Premium software</div>
                <div>• Email services</div>
              </div>
              <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                May have their own charges, policies and service limitations. Such charges are the responsibility of the client unless specifically included in this proposal.
              </p>
            </div>
          </div>

          <div className="flex justify-between text-[10px] text-slate-400 border-t border-slate-200 pt-2">
            <span>Next Media Security Standard</span>
            <span>www.nextmedia.ae</span>
          </div>
        </div>
      );

    // -------------------------------------------------------------------------
    // SLIDE 23: CLIENT APPROVAL
    // -------------------------------------------------------------------------
    case 23:
      return (
        <div className="w-full h-full bg-[#08152c] text-white p-8 sm:p-12 flex flex-col justify-between">
          <div className="max-w-2xl mx-auto w-full my-auto space-y-6">
            <h2 className="text-3xl font-black uppercase text-center text-sky-400 tracking-tight">
              CLIENT APPROVAL
            </h2>

            <div className="bg-slate-50 text-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4">
              <div className="bg-[#0b2752] text-white rounded-xl p-3 px-4 font-bold text-xs flex justify-between">
                <span>Client / Company:</span>
                <span className="text-sky-300 font-bold">{data.companyName}</span>
              </div>
              <div className="bg-[#0b2752] text-white rounded-xl p-3 px-4 font-bold text-xs flex justify-between">
                <span>Authorised Person:</span>
                <span className="text-sky-300 font-bold">{data.clientName}</span>
              </div>
              <div className="bg-[#0b2752] text-white rounded-xl p-3 px-4 font-bold text-xs flex justify-between">
                <span>Designation:</span>
                <span className="text-sky-300 font-bold">Managing Director / Authorised Signatory</span>
              </div>

              {/* Signature Line */}
              <div className="pt-6 grid grid-cols-2 gap-8 text-xs font-bold text-slate-800">
                <div className="border-b-2 border-slate-400 pb-1">
                  Signature: <span className="text-slate-400 font-normal">___________________________</span>
                </div>
                <div className="border-b-2 border-slate-400 pb-1">
                  Date: <span className="text-slate-400 font-normal">___________________________</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between text-[10px] text-slate-500 border-t border-[#12284c] pt-2">
            <span>Authorised Client Signoff</span>
            <span>www.nextmedia.ae</span>
          </div>
        </div>
      );

    // -------------------------------------------------------------------------
    // SLIDE 24: AUTHORISED REPRESENTATIVE / CLOSING
    // -------------------------------------------------------------------------
    case 24:
      return (
        <div className="w-full h-full bg-[#071329] text-white p-8 sm:p-14 flex flex-col justify-between relative overflow-hidden">
          {/* Top Branding */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl font-black tracking-widest text-white">nEXT</span>
              <span className="text-2xl text-[#00a3ff] font-light">|</span>
              <span className="text-sm font-extrabold tracking-[0.25em] text-slate-300 uppercase">
                befirst
              </span>
            </div>
            <div className="text-[10px] tracking-[0.2em] font-semibold text-slate-400 uppercase -mt-2">
              BRANDING | MARKETING MEDIA &amp; PRODUCTION
            </div>

            <div className="pt-4">
              <h2 className="text-2xl sm:text-3xl font-black text-sky-400 uppercase tracking-tight">
                NEXT MEDIA A DIVISION OF <br />
                <span className="text-white">BEFIRST MEDIA PRODUCTIONS</span>
              </h2>
            </div>
          </div>

          {/* Lower White Card Box */}
          <div className="bg-slate-50 text-slate-900 rounded-2xl p-6 sm:p-8 max-w-2xl mx-auto w-full shadow-2xl space-y-6">
            <div className="text-xs font-black text-[#0066cc] uppercase tracking-wider">
              AUTHORISED REPRESENTATIVE: <span className="text-slate-800">{data.salesStaffName || "Next Media / BeFirst Media Productions"}</span>
            </div>

            <div className="grid grid-cols-2 gap-8 text-xs font-bold text-slate-800 pt-4">
              <div className="border-b-2 border-slate-300 pb-1">
                SIGNATURE: <span className="text-slate-400 font-normal">___________________________</span>
              </div>
              <div className="border-b-2 border-slate-300 pb-1">
                DATE: <span className="text-slate-800 font-bold">{formattedDate}</span>
              </div>
            </div>
          </div>

          {/* Bottom Website */}
          <div className="text-center text-xs font-bold text-sky-400 border-t border-[#132c54] pt-3 tracking-wider">
            www.nextmedia.ae
          </div>
        </div>
      );

    default:
      return null;
  }
}
