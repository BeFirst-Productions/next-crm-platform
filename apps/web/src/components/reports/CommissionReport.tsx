"use client";

import * as React from "react";
import {
  Coins,
  DollarSign,
  Percent,
  Wallet,
  Calendar,
  Upload,
  Filter,
  RotateCcw,
  Info,
  Calculator,
  ChevronDown,
  X,
  FileText,
  CheckCircle2,
  Clock,
} from "lucide-react";

// ============================================================================
// DATA MODELS & INITIAL RECORDS (EXACTLY MATCHING SCREENSHOT)
// ============================================================================

export interface CommissionRecord {
  id: number;
  clientName: string;
  servicePackage: string;
  invoiceNo: string;
  invoiceDate: string;
  salesAmount: number;
  commissionRate: number;
  commissionAmount: number;
  status: "Paid" | "Pending";
  category: "Website Development" | "SEO Services" | "Social Media Management" | "Branding & Identity" | "Others";
  package: string;
}

const INITIAL_COMMISSION_DATA: CommissionRecord[] = [
  {
    id: 1,
    clientName: "Bright Solutions LLC",
    servicePackage: "Website Development",
    invoiceNo: "INV-2026-001",
    invoiceDate: "21 May 2026",
    salesAmount: 25000,
    commissionRate: 15,
    commissionAmount: 3750,
    status: "Paid",
    category: "Website Development",
    package: "Website Development",
  },
  {
    id: 2,
    clientName: "Future Tech",
    servicePackage: "SEO Services",
    invoiceNo: "INV-2026-002",
    invoiceDate: "18 May 2026",
    salesAmount: 18500,
    commissionRate: 15,
    commissionAmount: 2775,
    status: "Paid",
    category: "SEO Services",
    package: "SEO Services",
  },
  {
    id: 3,
    clientName: "Oceanic Group",
    servicePackage: "Social Media Management",
    invoiceNo: "INV-2026-003",
    invoiceDate: "15 May 2026",
    salesAmount: 32000,
    commissionRate: 15,
    commissionAmount: 4800,
    status: "Paid",
    category: "Social Media Management",
    package: "Social Media Management",
  },
  {
    id: 4,
    clientName: "Vision Marketing",
    servicePackage: "Branding Package",
    invoiceNo: "INV-2026-004",
    invoiceDate: "10 May 2026",
    salesAmount: 15750,
    commissionRate: 15,
    commissionAmount: 2363,
    status: "Paid",
    category: "Branding & Identity",
    package: "Branding Package",
  },
  {
    id: 5,
    clientName: "Creative Minds",
    servicePackage: "Website Development",
    invoiceNo: "INV-2026-005",
    invoiceDate: "04 May 2026",
    salesAmount: 12300,
    commissionRate: 15,
    commissionAmount: 1845,
    status: "Paid",
    category: "Website Development",
    package: "Website Development",
  },
  {
    id: 6,
    clientName: "Stellar Dynamics",
    servicePackage: "SEO Services",
    invoiceNo: "INV-2026-006",
    invoiceDate: "28 Apr 2026",
    salesAmount: 9850,
    commissionRate: 15,
    commissionAmount: 1478,
    status: "Pending",
    category: "SEO Services",
    package: "SEO Services",
  },
  {
    id: 7,
    clientName: "Silicon Corp",
    servicePackage: "E-commerce Package",
    invoiceNo: "INV-2026-007",
    invoiceDate: "25 Apr 2026",
    salesAmount: 28000,
    commissionRate: 15,
    commissionAmount: 4200,
    status: "Paid",
    category: "Others",
    package: "E-commerce Package",
  },
  {
    id: 8,
    clientName: "Elite Retail LLC",
    servicePackage: "Social Media Management",
    invoiceNo: "INV-2026-008",
    invoiceDate: "20 Apr 2026",
    salesAmount: 20450,
    commissionRate: 15,
    commissionAmount: 3068,
    status: "Paid",
    category: "Social Media Management",
    package: "Social Media Management",
  },
  {
    id: 9,
    clientName: "Skyline Traders",
    servicePackage: "SEO Services",
    invoiceNo: "INV-2026-009",
    invoiceDate: "15 Apr 2026",
    salesAmount: 17800,
    commissionRate: 15,
    commissionAmount: 2670,
    status: "Paid",
    category: "SEO Services",
    package: "SEO Services",
  },
  {
    id: 10,
    clientName: "Urban Spaces",
    servicePackage: "Website Development",
    invoiceNo: "INV-2026-010",
    invoiceDate: "12 Apr 2026",
    salesAmount: 14950,
    commissionRate: 15,
    commissionAmount: 2243,
    status: "Pending",
    category: "Website Development",
    package: "Website Development",
  },
];

// Daily Trend Data (31 days of May 2026 matching visual chart curve)
interface DailyDataPoint {
  day: number;
  dateStr: string;
  sales: number;
  commission: number;
}

const MAY_TREND_DATA: DailyDataPoint[] = [
  { day: 1, dateStr: "01 May 2026", sales: 12000, commission: 1800 },
  { day: 2, dateStr: "02 May 2026", sales: 14500, commission: 2175 },
  { day: 3, dateStr: "03 May 2026", sales: 10500, commission: 1575 },
  { day: 4, dateStr: "04 May 2026", sales: 12300, commission: 1845 },
  { day: 5, dateStr: "05 May 2026", sales: 17500, commission: 2625 },
  { day: 6, dateStr: "06 May 2026", sales: 15000, commission: 2250 },
  { day: 7, dateStr: "07 May 2026", sales: 16800, commission: 2520 },
  { day: 8, dateStr: "08 May 2026", sales: 15400, commission: 2310 },
  { day: 9, dateStr: "09 May 2026", sales: 19200, commission: 2880 },
  { day: 10, dateStr: "10 May 2026", sales: 15750, commission: 2363 },
  { day: 11, dateStr: "11 May 2026", sales: 21000, commission: 3150 },
  { day: 12, dateStr: "12 May 2026", sales: 18500, commission: 2775 },
  { day: 13, dateStr: "13 May 2026", sales: 20500, commission: 3075 },
  { day: 14, dateStr: "14 May 2026", sales: 24000, commission: 3600 },
  { day: 15, dateStr: "15 May 2026", sales: 32000, commission: 4800 },
  { day: 16, dateStr: "16 May 2026", sales: 28450, commission: 4268 }, // Highlighted in screenshot
  { day: 17, dateStr: "17 May 2026", sales: 23500, commission: 3525 },
  { day: 18, dateStr: "18 May 2026", sales: 26000, commission: 3900 },
  { day: 19, dateStr: "19 May 2026", sales: 22800, commission: 3420 },
  { day: 20, dateStr: "20 May 2026", sales: 30000, commission: 4500 },
  { day: 21, dateStr: "21 May 2026", sales: 34500, commission: 5175 },
  { day: 22, dateStr: "22 May 2026", sales: 31000, commission: 4650 },
  { day: 23, dateStr: "23 May 2026", sales: 29000, commission: 4350 },
  { day: 24, dateStr: "24 May 2026", sales: 36500, commission: 5475 },
  { day: 25, dateStr: "25 May 2026", sales: 33000, commission: 4950 },
  { day: 26, dateStr: "26 May 2026", sales: 41000, commission: 6150 },
  { day: 27, dateStr: "27 May 2026", sales: 39500, commission: 5925 },
  { day: 28, dateStr: "28 May 2026", sales: 44000, commission: 6600 },
  { day: 29, dateStr: "29 May 2026", sales: 42500, commission: 6375 },
  { day: 30, dateStr: "30 May 2026", sales: 47000, commission: 7050 },
  { day: 31, dateStr: "31 May 2026", sales: 43500, commission: 6525 },
];

// Donut category breakdown
interface CategoryShare {
  name: string;
  amount: number;
  percentage: number;
  color: string;
  dashArray: string;
  dashOffset: number;
}

// Circumference of r=38 circle is 238.76
const CATEGORY_SHARES: CategoryShare[] = [
  {
    name: "Website Development",
    amount: 8350,
    percentage: 39,
    color: "#0080ff",
    dashArray: "93.1 238.8",
    dashOffset: 0,
  },
  {
    name: "SEO Services",
    amount: 4750,
    percentage: 22,
    color: "#00d492",
    dashArray: "52.5 238.8",
    dashOffset: -93.1,
  },
  {
    name: "Social Media Management",
    amount: 3425,
    percentage: 16,
    color: "#a855f7",
    dashArray: "38.2 238.8",
    dashOffset: -145.6,
  },
  {
    name: "Branding & Identity",
    amount: 2850,
    percentage: 13,
    color: "#f59e0b",
    dashArray: "31.0 238.8",
    dashOffset: -183.8,
  },
  {
    name: "Others",
    amount: 2050,
    percentage: 10,
    color: "#475569",
    dashArray: "24.0 238.8",
    dashOffset: -214.8,
  },
];

export function CommissionReport() {
  // Filter States
  const [selectedDateRange, setSelectedDateRange] = React.useState("This Month");
  const [selectedViewBy, setSelectedViewBy] = React.useState("Monthly");
  const [selectedCategory, setSelectedCategory] = React.useState("All Categories");
  const [selectedPackage, setSelectedPackage] = React.useState("All Packages");
  const [selectedStatus, setSelectedStatus] = React.useState("All");

  // Hover states for Trend Chart
  const [hoveredDay, setHoveredDay] = React.useState<DailyDataPoint | null>(
    MAY_TREND_DATA.find((d) => d.day === 16) || MAY_TREND_DATA[15]
  );

  // Active Category Highlight for Donut
  const [hoveredCategory, setHoveredCategory] = React.useState<string | null>(null);

  // Selected Invoice Modal State
  const [previewInvoice, setPreviewInvoice] = React.useState<CommissionRecord | null>(null);

  // Filtered Commission Records
  const filteredRecords = React.useMemo(() => {
    return INITIAL_COMMISSION_DATA.filter((item) => {
      if (selectedCategory !== "All Categories" && item.category !== selectedCategory) {
        return false;
      }
      if (selectedPackage !== "All Packages" && item.package !== selectedPackage) {
        return false;
      }
      if (selectedStatus !== "All" && item.status !== selectedStatus) {
        return false;
      }
      return true;
    });
  }, [selectedCategory, selectedPackage, selectedStatus]);

  // Recalculated KPI summary values based on filtered records
  const summary = React.useMemo(() => {
    const isDefault =
      selectedCategory === "All Categories" &&
      selectedPackage === "All Packages" &&
      selectedStatus === "All";

    if (isDefault) {
      return {
        totalCount: 18,
        totalSales: 142850,
        totalCommission: 21425,
        paidCommission: 18631,
        pendingCommission: 2794,
        standardRate: 15,
        specialRate: 0,
        averageRate: 15,
      };
    }

    const totalSales = filteredRecords.reduce((acc, curr) => acc + curr.salesAmount, 0);
    const totalCommission = filteredRecords.reduce((acc, curr) => acc + curr.commissionAmount, 0);
    const paidCommission = filteredRecords
      .filter((i) => i.status === "Paid")
      .reduce((acc, curr) => acc + curr.commissionAmount, 0);
    const pendingCommission = filteredRecords
      .filter((i) => i.status === "Pending")
      .reduce((acc, curr) => acc + curr.commissionAmount, 0);

    return {
      totalCount: filteredRecords.length,
      totalSales,
      totalCommission,
      paidCommission,
      pendingCommission,
      standardRate: 15,
      specialRate: 0,
      averageRate: 15,
    };
  }, [filteredRecords, selectedCategory, selectedPackage, selectedStatus]);

  // Reset filters
  const handleReset = () => {
    setSelectedDateRange("This Month");
    setSelectedViewBy("Monthly");
    setSelectedCategory("All Categories");
    setSelectedPackage("All Packages");
    setSelectedStatus("All");
  };

  // Export report to CSV
  const handleExport = () => {
    const headers = [
      "#",
      "Client Name",
      "Service / Package",
      "Invoice No",
      "Invoice Date",
      "Sales Amount (AED)",
      "Commission Rate",
      "Commission (AED)",
      "Status",
    ];

    const rows = filteredRecords.map((r, idx) => [
      idx + 1,
      `"${r.clientName}"`,
      `"${r.servicePackage}"`,
      r.invoiceNo,
      `"${r.invoiceDate}"`,
      r.salesAmount,
      `${r.commissionRate}%`,
      r.commissionAmount,
      r.status,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Commission_Report_May_2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-5 animate-fade-in pb-12 select-none">
      {/* -------------------------------------------------------------------- */}
      {/* 1. Page Header & Actions */}
      {/* -------------------------------------------------------------------- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Commission Report
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Track your earned commissions and performance.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          {/* Date Range Badge */}
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#091322] border border-[#172641] hover:border-slate-600 transition-colors text-xs text-slate-200 shadow-sm cursor-pointer">
            <span className="font-medium tracking-tight">01 May 2026 - 31 May 2026</span>
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
          </div>

          {/* Export Button */}
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-transparent border border-[#1f3256] hover:bg-[#122340] hover:border-slate-500 transition-all text-xs font-semibold text-slate-200 cursor-pointer shadow-sm active:scale-95"
          >
            <Upload className="w-3.5 h-3.5 rotate-180" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* 2. Top 4 Metric KPI Cards */}
      {/* -------------------------------------------------------------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Sales */}
        <div className="bg-[#091322] border border-[#14233e] hover:border-[#1e3860] rounded-2xl p-4 sm:p-5 shadow-xl flex items-center gap-4 transition-all">
          <div className="w-12 h-12 rounded-full bg-[#0a2342] border border-blue-500/40 flex items-center justify-center text-blue-400 shrink-0 shadow-[0_0_15px_rgba(0,128,255,0.25)]">
            <Coins className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Total Sales</p>
            <h3 className="text-2xl font-black text-white mt-0.5 tracking-tight leading-none">
              18
            </h3>
            <p className="text-[11px] text-emerald-400 font-semibold mt-1 flex items-center gap-1">
              <span>↑</span> 28% from last month
            </p>
          </div>
        </div>

        {/* Card 2: Total Sales Amount */}
        <div className="bg-[#091322] border border-[#14233e] hover:border-[#1e3860] rounded-2xl p-4 sm:p-5 shadow-xl flex items-center gap-4 transition-all">
          <div className="w-12 h-12 rounded-full bg-[#042d1f] border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0 shadow-[0_0_15px_rgba(16,185,129,0.25)]">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Total Sales Amount</p>
            <h3 className="text-2xl font-black text-white mt-0.5 tracking-tight leading-none">
              AED 142,850
            </h3>
            <p className="text-[11px] text-emerald-400 font-semibold mt-1 flex items-center gap-1">
              <span>↑</span> 24% from last month
            </p>
          </div>
        </div>

        {/* Card 3: Total Commission */}
        <div className="bg-[#091322] border border-[#14233e] hover:border-[#1e3860] rounded-2xl p-4 sm:p-5 shadow-xl flex items-center gap-4 transition-all">
          <div className="w-12 h-12 rounded-full bg-[#270e44] border border-purple-500/40 flex items-center justify-center text-purple-400 shrink-0 shadow-[0_0_15px_rgba(168,85,247,0.25)]">
            <Percent className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Total Commission</p>
            <h3 className="text-2xl font-black text-white mt-0.5 tracking-tight leading-none">
              AED 21,425
            </h3>
            <p className="text-[11px] text-emerald-400 font-semibold mt-1 flex items-center gap-1">
              <span>↑</span> 18% from last month
            </p>
          </div>
        </div>

        {/* Card 4: Commission Rate */}
        <div className="bg-[#091322] border border-[#14233e] hover:border-[#1e3860] rounded-2xl p-4 sm:p-5 shadow-xl flex items-center gap-4 transition-all">
          <div className="w-12 h-12 rounded-full bg-[#3d2407] border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 shadow-[0_0_15px_rgba(245,158,11,0.25)]">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Commission Rate</p>
            <h3 className="text-2xl font-black text-white mt-0.5 tracking-tight leading-none">
              15%
            </h3>
            <p className="text-[11px] text-slate-400 font-medium mt-1 flex items-center gap-1">
              <span>—</span> same as last month
            </p>
          </div>
        </div>
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* 3. Middle Charts Section (Trend + Donut) */}
      {/* -------------------------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Commission Trend Dual Chart (approx 7.5 cols / 8 cols) */}
        <div className="lg:col-span-8 bg-[#091322] border border-[#14233e] rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          {/* Header & Legend */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#14233e]">
            <h2 className="text-sm font-semibold text-slate-100">
              Commission Trend
            </h2>

            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#0080ff]" />
                <span className="text-slate-300 text-[11px]">Sales Amount (AED)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#a855f7]" />
                <span className="text-slate-300 text-[11px]">Commission (AED)</span>
              </div>
            </div>
          </div>

          {/* Dual Axis Interactive Visual Canvas */}
          <div
            className="relative pt-4 pb-1 px-1"
            onMouseLeave={() => setHoveredDay(MAY_TREND_DATA[15])}
          >
            {/* Active / Hover Tooltip Card */}
            {hoveredDay && (
              <div
                className="absolute z-20 pointer-events-none transition-all duration-150"
                style={{
                  left: `${Math.max(12, Math.min(80, (hoveredDay.day / 31) * 92 - 6))}%`,
                  top: "16px",
                }}
              >
                <div className="bg-[#07101e]/95 backdrop-blur-md border border-[#1c3358] rounded-xl p-2.5 shadow-2xl text-left min-w-[130px]">
                  <p className="text-[10px] text-slate-400 font-medium">
                    {hoveredDay.dateStr}
                  </p>
                  <p className="text-xs font-bold text-sky-400 mt-0.5">
                    Sales: AED {hoveredDay.sales.toLocaleString()}
                  </p>
                  <p className="text-xs font-bold text-purple-400">
                    Commission: AED {hoveredDay.commission.toLocaleString()}
                  </p>
                </div>
              </div>
            )}

            {/* SVG Chart */}
            <svg
              viewBox="0 0 740 230"
              className="w-full h-56 sm:h-60 overflow-visible"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="commBlueBarGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#0099ff" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#004bcc" stopOpacity="0.55" />
                </linearGradient>
                <linearGradient id="commPurpleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#c084fc" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
              </defs>

              {/* Horizontal Gridlines for 50K, 40K, 30K, 20K, 10K, 0 */}
              {[38, 74, 110, 146, 182, 210].map((yVal, i) => (
                <line
                  key={i}
                  x1="38"
                  y1={yVal}
                  x2="720"
                  y2={yVal}
                  stroke="#122037"
                  strokeDasharray="2 3"
                  strokeWidth="1"
                />
              ))}

              {/* Left Y-Axis Labels (Sales Amount AED) */}
              <text x="32" y="42" fill="#64748b" fontSize="10" textAnchor="end" fontWeight="500">50K</text>
              <text x="32" y="78" fill="#64748b" fontSize="10" textAnchor="end" fontWeight="500">40K</text>
              <text x="32" y="114" fill="#64748b" fontSize="10" textAnchor="end" fontWeight="500">30K</text>
              <text x="32" y="150" fill="#64748b" fontSize="10" textAnchor="end" fontWeight="500">20K</text>
              <text x="32" y="186" fill="#64748b" fontSize="10" textAnchor="end" fontWeight="500">10K</text>
              <text x="32" y="213" fill="#64748b" fontSize="10" textAnchor="end" fontWeight="500">0</text>

              {/* Vertical Sales Amount Bars */}
              {MAY_TREND_DATA.map((item, idx) => {
                const xPos = 48 + idx * 21.8;
                const barHeight = Math.max(12, (item.sales / 50000) * 172);
                const yPos = 210 - barHeight;
                const isHovered = hoveredDay?.day === item.day;

                return (
                  <g
                    key={idx}
                    className="cursor-pointer group"
                    onMouseEnter={() => setHoveredDay(item)}
                  >
                    {/* Hover Hitbox */}
                    <rect
                      x={xPos - 5}
                      y={30}
                      width={21}
                      height={180}
                      fill="transparent"
                    />

                    {/* Gradient Bar */}
                    <rect
                      x={xPos}
                      y={yPos}
                      width="11"
                      height={barHeight}
                      rx="2.5"
                      fill="url(#commBlueBarGrad)"
                      className="transition-all duration-150"
                      opacity={isHovered ? 1 : 0.85}
                    />

                    {/* Active highlight marker */}
                    {isHovered && (
                      <line
                        x1={xPos + 5.5}
                        y1={30}
                        x2={xPos + 5.5}
                        y2={210}
                        stroke="#00d492"
                        strokeDasharray="2 2"
                        strokeWidth="1"
                        opacity="0.6"
                      />
                    )}
                  </g>
                );
              })}

              {/* Overlaid Smooth Purple Spline Line (Commission) */}
              <path
                d="M 53 194 
                   C 100 185, 140 176, 180 170
                   C 220 165, 260 155, 300 148
                   C 340 142, 380 152, 420 145
                   C 460 138, 500 130, 540 120
                   C 580 110, 620 102, 660 92
                   C 680 88, 700 86, 706 90"
                fill="none"
                stroke="url(#commPurpleGrad)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Purple glowing dots on the line */}
              {MAY_TREND_DATA.filter((_, i) => i % 3 === 0 || i === 15 || i === 30).map((pt, idx) => {
                const xPos = 48 + (pt.day - 1) * 21.8 + 5.5;
                // Scale commission (0 to 10k commission maps onto ~210 down to ~80)
                const yPos = 210 - (pt.commission / 7500) * 125;
                const isHovered = hoveredDay?.day === pt.day;

                return (
                  <circle
                    key={idx}
                    cx={xPos}
                    cy={yPos}
                    r={isHovered ? 4.5 : 3}
                    fill="#a855f7"
                    stroke="#ffffff"
                    strokeWidth={isHovered ? 2 : 1.5}
                    className="transition-all"
                  />
                );
              })}
            </svg>

            {/* X-Axis Dates */}
            <div className="flex justify-between pl-10 pr-4 text-[11px] text-slate-500 pt-1">
              <span>01 May</span>
              <span>06 May</span>
              <span>11 May</span>
              <span>16 May</span>
              <span>21 May</span>
              <span>26 May</span>
              <span>31 May</span>
            </div>
          </div>
        </div>

        {/* Right: Sales by Category Donut Chart (approx 4.5 cols / 4 cols) */}
        <div className="lg:col-span-4 bg-[#091322] border border-[#14233e] rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <h2 className="text-sm font-semibold text-slate-100 pb-3 border-b border-[#14233e]">
            Sales by Category (Commission)
          </h2>

          <div className="py-2 flex flex-col xl:flex-row items-center justify-center gap-6">
            {/* SVG Donut Circle with Center Text */}
            <div className="relative w-40 h-40 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                {/* Background Ring */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#081426"
                  strokeWidth="14"
                />

                {/* Donut Slices */}
                {CATEGORY_SHARES.map((slice, idx) => (
                  <circle
                    key={idx}
                    cx="50"
                    cy="50"
                    r="38"
                    fill="transparent"
                    stroke={slice.color}
                    strokeWidth={hoveredCategory === slice.name ? 16 : 14}
                    strokeDasharray={slice.dashArray}
                    strokeDashoffset={slice.dashOffset}
                    className="transition-all duration-200 cursor-pointer"
                    onMouseEnter={() => setHoveredCategory(slice.name)}
                    onMouseLeave={() => setHoveredCategory(null)}
                  />
                ))}
              </svg>

              {/* Center KPI text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-2">
                <span className="text-[13px] font-bold text-white tracking-tight leading-tight">
                  AED 21,425
                </span>
                <span className="text-[9px] text-slate-400 font-medium">
                  Total Commission
                </span>
              </div>
            </div>

            {/* Legend Breakdown */}
            <div className="space-y-2.5 w-full xl:w-auto">
              {CATEGORY_SHARES.map((item, idx) => {
                const isHovered = hoveredCategory === item.name;
                return (
                  <div
                    key={idx}
                    className={`flex items-start gap-2.5 cursor-pointer transition-colors p-1 rounded-lg ${
                      isHovered ? "bg-[#0f1d33]" : ""
                    }`}
                    onMouseEnter={() => setHoveredCategory(item.name)}
                    onMouseLeave={() => setHoveredCategory(null)}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-sm shrink-0 mt-1"
                      style={{ backgroundColor: item.color }}
                    />
                    <div>
                      <p className="text-xs text-slate-200 font-medium leading-tight">
                        {item.name}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        AED {item.amount.toLocaleString()} ({item.percentage}%)
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-2" />
        </div>
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* 4. Filter Bar */}
      {/* -------------------------------------------------------------------- */}
      <div className="bg-[#091322] border border-[#14233e] rounded-2xl p-3 sm:p-4 shadow-xl flex flex-wrap items-end gap-3 sm:gap-4">
        {/* Date Range Selector */}
        <div className="min-w-[140px] flex-1 sm:flex-none">
          <label className="text-[11px] text-slate-400 font-medium mb-1 block">
            Date Range
          </label>
          <div className="relative">
            <select
              value={selectedDateRange}
              onChange={(e) => setSelectedDateRange(e.target.value)}
              className="w-full bg-[#070e1c] border border-[#162744] hover:border-[#223b63] focus:border-cyan-500 text-xs text-slate-200 rounded-xl pl-8 pr-7 py-2 appearance-none outline-none cursor-pointer"
            >
              <option value="This Month">This Month</option>
              <option value="Last Month">Last Month</option>
              <option value="Last 3 Months">Last 3 Months</option>
              <option value="This Year">This Year</option>
              <option value="All Time">All Time</option>
            </select>
            <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
          </div>
        </div>

        {/* View By */}
        <div className="min-w-[120px] flex-1 sm:flex-none">
          <label className="text-[11px] text-slate-400 font-medium mb-1 block">
            View By
          </label>
          <div className="relative">
            <select
              value={selectedViewBy}
              onChange={(e) => setSelectedViewBy(e.target.value)}
              className="w-full bg-[#070e1c] border border-[#162744] hover:border-[#223b63] focus:border-cyan-500 text-xs text-slate-200 rounded-xl px-3 py-2 pr-7 appearance-none outline-none cursor-pointer"
            >
              <option value="Monthly">Monthly</option>
              <option value="Weekly">Weekly</option>
              <option value="Daily">Daily</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
          </div>
        </div>

        {/* Category */}
        <div className="min-w-[140px] flex-1 sm:flex-none">
          <label className="text-[11px] text-slate-400 font-medium mb-1 block">
            Category
          </label>
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-[#070e1c] border border-[#162744] hover:border-[#223b63] focus:border-cyan-500 text-xs text-slate-200 rounded-xl px-3 py-2 pr-7 appearance-none outline-none cursor-pointer"
            >
              <option value="All Categories">All Categories</option>
              <option value="Website Development">Website Development</option>
              <option value="SEO Services">SEO Services</option>
              <option value="Social Media Management">Social Media Management</option>
              <option value="Branding & Identity">Branding & Identity</option>
              <option value="Others">Others</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
          </div>
        </div>

        {/* Package */}
        <div className="min-w-[140px] flex-1 sm:flex-none">
          <label className="text-[11px] text-slate-400 font-medium mb-1 block">
            Package
          </label>
          <div className="relative">
            <select
              value={selectedPackage}
              onChange={(e) => setSelectedPackage(e.target.value)}
              className="w-full bg-[#070e1c] border border-[#162744] hover:border-[#223b63] focus:border-cyan-500 text-xs text-slate-200 rounded-xl px-3 py-2 pr-7 appearance-none outline-none cursor-pointer"
            >
              <option value="All Packages">All Packages</option>
              <option value="Website Development">Website Development</option>
              <option value="SEO Services">SEO Services</option>
              <option value="Social Media Management">Social Media Management</option>
              <option value="Branding Package">Branding Package</option>
              <option value="E-commerce Package">E-commerce Package</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
          </div>
        </div>

        {/* Invoice Status */}
        <div className="min-w-[120px] flex-1 sm:flex-none">
          <label className="text-[11px] text-slate-400 font-medium mb-1 block">
            Invoice Status
          </label>
          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-[#070e1c] border border-[#162744] hover:border-[#223b63] focus:border-cyan-500 text-xs text-slate-200 rounded-xl px-3 py-2 pr-7 appearance-none outline-none cursor-pointer"
            >
              <option value="All">All</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
          </div>
        </div>

        {/* Filter Action Buttons */}
        <div className="flex items-center gap-2.5 ml-auto">
          {/* Apply Filter Button */}
          <button
            onClick={() => {
              // Filters are reactive, button offers visual feedback
            }}
            className="bg-[#0080ff] hover:bg-[#0070e0] active:bg-[#0060c4] text-white text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-md shadow-blue-600/30 transition-all cursor-pointer"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Apply Filter</span>
          </button>

          {/* Reset Button */}
          <button
            onClick={handleReset}
            className="border border-[#172b49] hover:border-slate-500 text-slate-300 hover:text-white text-xs font-medium px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* 5. Bottom Section: Details Table (Left) + Summary Card (Right) */}
      {/* -------------------------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Commission Details Table Card (9 Cols) */}
        <div className="lg:col-span-9 bg-[#091322] border border-[#14233e] rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col justify-between overflow-hidden">
          <div>
            <h2 className="text-sm font-semibold text-slate-100 mb-3.5">
              Commission Details
            </h2>

            <div className="overflow-x-auto -mx-4 sm:-mx-5 px-4 sm:px-5">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#14233e] text-[11px] text-slate-400 font-semibold">
                    <th className="pb-3 pr-2 w-8 text-slate-400 font-semibold">#</th>
                    <th className="pb-3 px-3">Client Name</th>
                    <th className="pb-3 px-3">Service / Package</th>
                    <th className="pb-3 px-3">Invoice No</th>
                    <th className="pb-3 px-3">Invoice Date</th>
                    <th className="pb-3 px-3 text-right">Sales Amount (AED)</th>
                    <th className="pb-3 px-3 text-center">Commission Rate</th>
                    <th className="pb-3 px-3 text-right">Commission (AED)</th>
                    <th className="pb-3 pl-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#101c30]">
                  {filteredRecords.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="text-center py-8 text-slate-500">
                        No commission records match your current filters.
                      </td>
                    </tr>
                  ) : (
                    filteredRecords.map((item, idx) => (
                      <tr
                        key={item.id}
                        className="hover:bg-[#0c182d]/60 transition-colors group"
                      >
                        {/* Number */}
                        <td className="py-3 pr-2 text-slate-400 font-medium">
                          {idx + 1}
                        </td>

                        {/* Client Name */}
                        <td className="py-3 px-3 text-slate-200 font-medium">
                          {item.clientName}
                        </td>

                        {/* Service / Package */}
                        <td className="py-3 px-3 text-slate-400">
                          {item.servicePackage}
                        </td>

                        {/* Invoice No (clickable) */}
                        <td className="py-3 px-3">
                          <button
                            onClick={() => setPreviewInvoice(item)}
                            className="text-cyan-400 hover:text-cyan-300 font-mono hover:underline transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <span>{item.invoiceNo}</span>
                          </button>
                        </td>

                        {/* Invoice Date */}
                        <td className="py-3 px-3 text-slate-400">
                          {item.invoiceDate}
                        </td>

                        {/* Sales Amount */}
                        <td className="py-3 px-3 text-right text-slate-200 font-semibold">
                          {item.salesAmount.toLocaleString()}
                        </td>

                        {/* Commission Rate */}
                        <td className="py-3 px-3 text-center text-slate-300">
                          {item.commissionRate}%
                        </td>

                        {/* Commission Amount */}
                        <td className="py-3 px-3 text-right text-slate-100 font-bold">
                          {item.commissionAmount.toLocaleString()}
                        </td>

                        {/* Status Badge */}
                        <td className="py-3 pl-3 text-center">
                          {item.status === "Paid" ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-medium">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                              Paid
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[11px] font-medium">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
                              Pending
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right: Commission Summary Card (3 Cols) */}
        <div className="lg:col-span-3 bg-[#091322] border border-[#14233e] rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            {/* Header with Icon */}
            <div className="flex items-center gap-2.5 pb-3 border-b border-[#14233e]">
              <div className="p-1.5 rounded-lg bg-[#0c1f38] border border-cyan-500/30 text-cyan-400">
                <Calculator className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-semibold text-slate-100">
                Commission Summary
              </h2>
            </div>

            {/* Amounts Breakdown */}
            <div className="py-3.5 space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Total Sales</span>
                <span className="font-bold text-slate-100">
                  AED {summary.totalSales.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Total Commission</span>
                <span className="font-bold text-slate-100">
                  AED {summary.totalCommission.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Paid Commission</span>
                <span className="font-bold text-slate-100">
                  AED {summary.paidCommission.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Pending Commission</span>
                <span className="font-bold text-slate-100">
                  AED {summary.pendingCommission.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-[#14233e] pt-3.5 pb-1">
              <h3 className="text-xs font-semibold text-slate-300 mb-2.5">
                Commission Rate
              </h3>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Standard Rate</span>
                  <span className="font-semibold text-slate-200">
                    {summary.standardRate}%
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Special Rate</span>
                  <span className="font-semibold text-slate-200">
                    {summary.specialRate}%
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Average Rate</span>
                  <span className="font-semibold text-slate-200">
                    {summary.averageRate}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Info Notice Box */}
          <div className="mt-4 p-3 rounded-xl bg-[#091830] border border-blue-500/30 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <p className="text-[11px] text-blue-200/80 leading-relaxed font-normal">
              Commissions are calculated based on paid invoices only. Pending invoices will be included once payment is received.
            </p>
          </div>
        </div>
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* 6. Invoice Quick Detail Modal */}
      {/* -------------------------------------------------------------------- */}
      {previewInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#091322] border border-[#192b47] rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#14233e] pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">
                  Invoice Details: {previewInvoice.invoiceNo}
                </h3>
              </div>
              <button
                onClick={() => setPreviewInvoice(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-[#122038] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex justify-between py-1 border-b border-[#121f36]">
                <span className="text-slate-400">Client:</span>
                <span className="font-semibold text-white">{previewInvoice.clientName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#121f36]">
                <span className="text-slate-400">Package / Service:</span>
                <span className="font-medium">{previewInvoice.servicePackage}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#121f36]">
                <span className="text-slate-400">Date:</span>
                <span>{previewInvoice.invoiceDate}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#121f36]">
                <span className="text-slate-400">Sales Amount:</span>
                <span className="font-bold text-white">AED {previewInvoice.salesAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#121f36]">
                <span className="text-slate-400">Commission Rate:</span>
                <span className="font-semibold text-sky-400">{previewInvoice.commissionRate}%</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#121f36]">
                <span className="text-slate-400">Commission Amount:</span>
                <span className="font-extrabold text-emerald-400">AED {previewInvoice.commissionAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Payment Status:</span>
                <span>
                  {previewInvoice.status === "Paid" ? (
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Paid
                    </span>
                  ) : (
                    <span className="text-amber-400 font-semibold flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> Pending
                    </span>
                  )}
                </span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setPreviewInvoice(null)}
                className="bg-[#0080ff] hover:bg-[#0070e0] text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
