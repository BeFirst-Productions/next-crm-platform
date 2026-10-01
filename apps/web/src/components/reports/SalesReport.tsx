"use client";

import * as React from "react";
import {
  BarChart3,
  Calendar,
  Download,
  Filter,
  RotateCcw,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Handshake,
  Wallet,
  FileText,
} from "lucide-react";

interface SalesRecord {
  id: number;
  date: string;
  clientName: string;
  category: string;
  packageService: string;
  amount: number;
  status: "Won" | "Draft" | "Lost" | "Pending";
  paymentStatus: "Paid" | "Partial" | "Unpaid" | "N/A";
}

const INITIAL_SALES: SalesRecord[] = [
  {
    id: 1,
    date: "28 May 2026",
    clientName: "Bright Solutions LLC",
    category: "Technology",
    packageService: "Website Development",
    amount: 25000,
    status: "Won",
    paymentStatus: "Paid",
  },
  {
    id: 2,
    date: "26 May 2026",
    clientName: "Future Tech",
    category: "Technology",
    packageService: "SEO Services",
    amount: 18500,
    status: "Won",
    paymentStatus: "Paid",
  },
  {
    id: 3,
    date: "24 May 2026",
    clientName: "Oceanic Group",
    category: "Real Estate",
    packageService: "Social Media Management",
    amount: 32000,
    status: "Won",
    paymentStatus: "Partial",
  },
  {
    id: 4,
    date: "21 May 2026",
    clientName: "Vision Marketing",
    category: "Retail",
    packageService: "Branding Package",
    amount: 15750,
    status: "Won",
    paymentStatus: "Paid",
  },
  {
    id: 5,
    date: "18 May 2026",
    clientName: "Creative Minds",
    category: "Retail",
    packageService: "Website Development",
    amount: 12300,
    status: "Won",
    paymentStatus: "Paid",
  },
  {
    id: 6,
    date: "15 May 2026",
    clientName: "Stellar Dynamics",
    category: "Technology",
    packageService: "SEO Services",
    amount: 9850,
    status: "Draft",
    paymentStatus: "Unpaid",
  },
  {
    id: 7,
    date: "12 May 2026",
    clientName: "Silicon Corp",
    category: "Corporate",
    packageService: "E-commerce Package",
    amount: 28000,
    status: "Won",
    paymentStatus: "Partial",
  },
  {
    id: 8,
    date: "09 May 2026",
    clientName: "Elite Retail LLC",
    category: "Retail",
    packageService: "Social Media Management",
    amount: 20450,
    status: "Lost",
    paymentStatus: "N/A",
  },
  {
    id: 9,
    date: "05 May 2026",
    clientName: "Skyline Traders",
    category: "Technology",
    packageService: "SEO Services",
    amount: 17800,
    status: "Won",
    paymentStatus: "Paid",
  },
  {
    id: 10,
    date: "02 May 2026",
    clientName: "Urban Spaces",
    category: "Real Estate",
    packageService: "Website Development",
    amount: 14950,
    status: "Draft",
    paymentStatus: "Unpaid",
  },
  {
    id: 11,
    date: "29 Apr 2026",
    clientName: "Alpha Logistics",
    category: "Logistics",
    packageService: "Full Stack CRM",
    amount: 22000,
    status: "Won",
    paymentStatus: "Paid",
  },
  {
    id: 12,
    date: "27 Apr 2026",
    clientName: "Dubai Health Hub",
    category: "Healthcare",
    packageService: "SEO & Content",
    amount: 16500,
    status: "Won",
    paymentStatus: "Paid",
  },
];

const TOP_CLIENTS = [
  { id: 1, name: "Bright Solutions LLC", amount: "25,000" },
  { id: 2, name: "Oceanic Group", amount: "32,000" },
  { id: 3, name: "Silicon Corp", amount: "28,000" },
  { id: 4, name: "Elite Retail LLC", amount: "20,450" },
  { id: 5, name: "Future Tech", amount: "18,500" },
];

export function SalesReport() {
  const [selectedDateRange, setSelectedDateRange] = React.useState("This Month");
  const [selectedViewBy, setSelectedViewBy] = React.useState("Daily");
  const [selectedCategory, setSelectedCategory] = React.useState("All Categories");
  const [selectedPackage, setSelectedPackage] = React.useState("All Packages");
  const [selectedStatus, setSelectedStatus] = React.useState("All Status");
  const [currentPage, setCurrentPage] = React.useState(1);

  // Filtered sales
  const filteredSales = React.useMemo(() => {
    return INITIAL_SALES.filter((sale) => {
      if (selectedCategory !== "All Categories" && sale.category !== selectedCategory) return false;
      if (selectedPackage !== "All Packages" && sale.packageService !== selectedPackage) return false;
      if (selectedStatus !== "All Status" && sale.status !== selectedStatus) return false;
      return true;
    });
  }, [selectedCategory, selectedPackage, selectedStatus]);

  const handleReset = () => {
    setSelectedDateRange("This Month");
    setSelectedViewBy("Daily");
    setSelectedCategory("All Categories");
    setSelectedPackage("All Packages");
    setSelectedStatus("All Status");
    setCurrentPage(1);
  };

  const handleExport = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["ID,Date,Client Name,Category,Package,Amount,Status,Payment Status"]
        .concat(
          filteredSales.map(
            (s) =>
              `${s.id},"${s.date}","${s.clientName}","${s.category}","${s.packageService}",${s.amount},${s.status},${s.paymentStatus}`
          )
        )
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Sales_Report_May_2026.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-5 animate-fade-in pb-12 select-none">
      {/* -------------------------------------------------------------------- */}
      {/* Page Title & Top Actions */}
      {/* -------------------------------------------------------------------- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Sales Report
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Detailed analysis of your sales activities, performance, and conversions.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          {/* Date Range Pill */}
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#091224] border border-[#14233e] text-xs text-slate-300">
            <span>01 May 2026 - 31 May 2026</span>
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
          </div>

          {/* Export Report Button */}
          <button
            onClick={handleExport}
            className="bg-[#0066ff] hover:bg-[#0055d4] active:bg-[#0047b3] text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* 4 Top KPI Metric Cards */}
      {/* -------------------------------------------------------------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Sales */}
        <div className="bg-[#091224] border border-[#14233e] rounded-2xl p-4 sm:p-5 shadow-xl flex items-center gap-4">
          <div className="w-11 h-11 rounded-full bg-[#052e16] border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0 shadow-[0_0_12px_rgba(16,185,129,0.2)]">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Total Sales</p>
            <h3 className="text-2xl font-extrabold text-white mt-0.5 leading-tight">
              28
            </h3>
            <p className="text-[11px] text-emerald-400 font-medium mt-0.5">
              ↑ 27% from last month
            </p>
          </div>
        </div>

        {/* Metric 2: Total Sales Amount */}
        <div className="bg-[#091224] border border-[#14233e] rounded-2xl p-4 sm:p-5 shadow-xl flex items-center gap-4">
          <div className="w-11 h-11 rounded-full bg-[#0b2447] border border-blue-500/40 flex items-center justify-center text-blue-400 shrink-0 shadow-[0_0_12px_rgba(0,112,243,0.2)]">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Total Sales Amount</p>
            <h3 className="text-2xl font-extrabold text-white mt-0.5 leading-tight">
              AED 142,850
            </h3>
            <p className="text-[11px] text-emerald-400 font-medium mt-0.5">
              ↑ 24% from last month
            </p>
          </div>
        </div>

        {/* Metric 3: Total Proposals */}
        <div className="bg-[#091224] border border-[#14233e] rounded-2xl p-4 sm:p-5 shadow-xl flex items-center gap-4">
          <div className="w-11 h-11 rounded-full bg-[#240d42] border border-purple-500/40 flex items-center justify-center text-purple-400 shrink-0 shadow-[0_0_12px_rgba(168,85,247,0.2)]">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Total Proposals</p>
            <h3 className="text-2xl font-extrabold text-white mt-0.5 leading-tight">
              42
            </h3>
            <p className="text-[11px] text-emerald-400 font-medium mt-0.5">
              ↑ 18% from last month
            </p>
          </div>
        </div>

        {/* Metric 4: Conversion Rate */}
        <div className="bg-[#091224] border border-[#14233e] rounded-2xl p-4 sm:p-5 shadow-xl flex items-center gap-4">
          <div className="w-11 h-11 rounded-full bg-[#08283d] border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0 shadow-[0_0_12px_rgba(6,182,212,0.2)]">
            <Handshake className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Conversion Rate</p>
            <h3 className="text-2xl font-extrabold text-white mt-0.5 leading-tight">
              66.7%
            </h3>
            <p className="text-[11px] text-emerald-400 font-medium mt-0.5">
              ↑ 12% from last month
            </p>
          </div>
        </div>
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* Row 2: Sales Trend Chart & Sales by Package Breakdown */}
      {/* -------------------------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left: Sales Trend Dual-Axis Chart (8 Cols) */}
        <div className="lg:col-span-8 bg-[#091224] border border-[#14233e] rounded-2xl p-5 shadow-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-[#14233e]">
            <h2 className="text-sm font-bold text-white tracking-wide">
              Sales Trend
            </h2>
            <div className="flex items-center gap-4 text-[11px]">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#0070f3]" />
                <span className="text-slate-300">Sales Amount (AED)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#a855f7]" />
                <span className="text-slate-300">No. of Sales</span>
              </div>
            </div>
          </div>

          {/* Dual Axis Interactive Visual Canvas */}
          <div className="relative pt-4 pb-2 px-1">
            {/* Hover Tooltip Box on May 16 */}
            <div className="absolute left-[44%] top-6 bg-[#0a1830] border border-cyan-500/50 rounded-xl p-2.5 shadow-2xl z-10 pointer-events-none text-left">
              <p className="text-[10px] text-slate-400">16 May 2026</p>
              <p className="text-xs font-bold text-cyan-400 leading-tight">AED 28,450</p>
              <p className="text-[10px] font-semibold text-purple-400 leading-tight">5 Sales</p>
            </div>

            {/* SVG Dual Axis Chart */}
            <svg
              viewBox="0 0 700 230"
              className="w-full h-52 sm:h-56 overflow-visible"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="blueBarGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#0080ff" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#0050c8" stopOpacity="0.4" />
                </linearGradient>
              </defs>

              {/* Horizontal Gridlines */}
              {[40, 75, 110, 145, 180].map((yVal, i) => (
                <line
                  key={i}
                  x1="35"
                  y1={yVal}
                  x2="665"
                  y2={yVal}
                  stroke="#13233e"
                  strokeDasharray="2 3"
                  strokeWidth="1"
                />
              ))}

              {/* Left Y-Axis Labels (Amount AED) */}
              <text x="30" y="44" fill="#64748b" fontSize="9" textAnchor="end">50K</text>
              <text x="30" y="79" fill="#64748b" fontSize="9" textAnchor="end">40K</text>
              <text x="30" y="114" fill="#64748b" fontSize="9" textAnchor="end">30K</text>
              <text x="30" y="149" fill="#64748b" fontSize="9" textAnchor="end">20K</text>
              <text x="30" y="184" fill="#64748b" fontSize="9" textAnchor="end">10K</text>
              <text x="30" y="210" fill="#64748b" fontSize="9" textAnchor="end">0</text>

              {/* Right Y-Axis Labels (No. of Sales) */}
              <text x="670" y="44" fill="#64748b" fontSize="9" textAnchor="start">10</text>
              <text x="670" y="79" fill="#64748b" fontSize="9" textAnchor="start">8</text>
              <text x="670" y="114" fill="#64748b" fontSize="9" textAnchor="start">6</text>
              <text x="670" y="149" fill="#64748b" fontSize="9" textAnchor="start">4</text>
              <text x="670" y="184" fill="#64748b" fontSize="9" textAnchor="start">2</text>
              <text x="670" y="210" fill="#64748b" fontSize="9" textAnchor="start">0</text>

              {/* Sales Amount Bars */}
              {[
                { x: 50, h: 50 },
                { x: 70, h: 70 },
                { x: 90, h: 80 },
                { x: 110, h: 65 },
                { x: 130, h: 90 },
                { x: 150, h: 85 },
                { x: 170, h: 75 },
                { x: 190, h: 100 },
                { x: 210, h: 110 },
                { x: 230, h: 95 },
                { x: 250, h: 85 },
                { x: 270, h: 105 },
                { x: 290, h: 115 },
                { x: 310, h: 125 }, // May 16 peak
                { x: 330, h: 100 },
                { x: 350, h: 90 },
                { x: 370, h: 110 },
                { x: 390, h: 120 },
                { x: 410, h: 135 },
                { x: 430, h: 140 },
                { x: 450, h: 125 },
                { x: 470, h: 130 },
                { x: 490, h: 145 },
                { x: 510, h: 155 },
                { x: 530, h: 150 },
                { x: 550, h: 165 },
                { x: 570, h: 170 },
                { x: 590, h: 185 },
                { x: 610, h: 175 },
                { x: 630, h: 190 },
              ].map((bar, idx) => (
                <rect
                  key={idx}
                  x={bar.x}
                  y={210 - bar.h}
                  width="10"
                  height={bar.h}
                  rx="2"
                  fill="url(#blueBarGrad)"
                  className="hover:opacity-100 transition-opacity"
                />
              ))}

              {/* Purple Spline Line: No of Sales */}
              <path
                d="M 50 170 C 100 165, 150 155, 200 150 C 250 148, 280 140, 315 130 C 350 145, 400 135, 450 130 C 500 128, 550 120, 635 115"
                fill="none"
                stroke="#a855f7"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* Purple Points on line */}
              {[
                { cx: 50, cy: 170 },
                { cx: 120, cy: 160 },
                { cx: 200, cy: 150 },
                { cx: 270, cy: 142 },
                { cx: 315, cy: 130 }, // May 16 active point
                { cx: 390, cy: 137 },
                { cx: 470, cy: 130 },
                { cx: 550, cy: 120 },
                { cx: 635, cy: 115 },
              ].map((pt, idx) => (
                <circle
                  key={idx}
                  cx={pt.cx}
                  cy={pt.cy}
                  r={pt.cx === 315 ? "4" : "2.5"}
                  fill={pt.cx === 315 ? "#ffffff" : "#a855f7"}
                  stroke="#a855f7"
                  strokeWidth="2"
                />
              ))}

              {/* Vertical Dashed Marker at May 16 */}
              <line
                x1="315"
                y1="30"
                x2="315"
                y2="210"
                stroke="#06b6d4"
                strokeDasharray="3 3"
                strokeWidth="1.5"
                opacity="0.8"
              />
            </svg>

            {/* X-Axis Dates */}
            <div className="flex justify-between pl-8 pr-6 text-[10px] text-slate-500 pt-1">
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

        {/* Right: Sales by Package Donut Chart (4 Cols) */}
        <div className="lg:col-span-4 bg-[#091224] border border-[#14233e] rounded-2xl p-5 shadow-2xl flex flex-col justify-between">
          <h2 className="text-sm font-bold text-white tracking-wide pb-2 border-b border-[#14233e]">
            Sales by Package
          </h2>

          <div className="py-3 flex flex-col sm:flex-row items-center justify-center gap-6">
            {/* SVG Donut Circle */}
            <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
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
                {/* Slice 1: Website Development (34%) -> strokeDasharray: 81 239 */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#0070f3"
                  strokeWidth="14"
                  strokeDasharray="81 239"
                  strokeDashoffset="0"
                />
                {/* Slice 2: SEO Services (23%) -> 55 */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#10b981"
                  strokeWidth="14"
                  strokeDasharray="55 239"
                  strokeDashoffset="-81"
                />
                {/* Slice 3: Social Media (17%) -> 40 */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#8b5cf6"
                  strokeWidth="14"
                  strokeDasharray="40 239"
                  strokeDashoffset="-136"
                />
                {/* Slice 4: Branding (13%) -> 31 */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#3b82f6"
                  strokeWidth="14"
                  strokeDasharray="31 239"
                  strokeDashoffset="-176"
                />
                {/* Slice 5: E-commerce (9%) -> 21 */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#f97316"
                  strokeWidth="14"
                  strokeDasharray="21 239"
                  strokeDashoffset="-207"
                />
                {/* Slice 6: Others (4%) -> 10 */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#64748b"
                  strokeWidth="14"
                  strokeDasharray="10 239"
                  strokeDashoffset="-228"
                />
              </svg>

              {/* Center Donut Label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-xs font-extrabold text-white leading-tight">
                  AED
                </span>
                <span className="text-sm font-extrabold text-white leading-tight">
                  142,850
                </span>
                <span className="text-[9px] text-slate-400 mt-0.5">Total Sales</span>
              </div>
            </div>

            {/* Legend List matching screenshot */}
            <div className="space-y-1.5 text-[11px] min-w-0">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#0070f3] shrink-0" />
                <span className="text-slate-300 truncate">Website Development</span>
              </div>
              <p className="text-[10px] text-slate-400 pl-4.5">AED 48,500 (34%)</p>

              <div className="flex items-center gap-2 pt-0.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#10b981] shrink-0" />
                <span className="text-slate-300 truncate">SEO Services</span>
              </div>
              <p className="text-[10px] text-slate-400 pl-4.5">AED 32,400 (23%)</p>

              <div className="flex items-center gap-2 pt-0.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#8b5cf6] shrink-0" />
                <span className="text-slate-300 truncate">Social Media Management</span>
              </div>
              <p className="text-[10px] text-slate-400 pl-4.5">AED 24,850 (17%)</p>

              <div className="flex items-center gap-2 pt-0.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#3b82f6] shrink-0" />
                <span className="text-slate-300 truncate">Branding Package</span>
              </div>
              <p className="text-[10px] text-slate-400 pl-4.5">AED 18,750 (13%)</p>

              <div className="flex items-center gap-2 pt-0.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#f97316] shrink-0" />
                <span className="text-slate-300 truncate">E-commerce Package</span>
              </div>
              <p className="text-[10px] text-slate-400 pl-4.5">AED 12,350 (9%)</p>

              <div className="flex items-center gap-2 pt-0.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#64748b] shrink-0" />
                <span className="text-slate-300 truncate">Others</span>
              </div>
              <p className="text-[10px] text-slate-400 pl-4.5">AED 6,000 (4%)</p>
            </div>
          </div>
        </div>
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* Row 3: Filter Bar */}
      {/* -------------------------------------------------------------------- */}
      <div className="bg-[#091224] border border-[#14233e] rounded-2xl p-4 shadow-xl flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          {/* Date Range Dropdown */}
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Date Range</span>
            <select
              value={selectedDateRange}
              onChange={(e) => setSelectedDateRange(e.target.value)}
              className="bg-[#060b14] border border-[#15233c] text-slate-200 rounded-xl px-3 py-1.5 outline-none cursor-pointer"
            >
              <option value="This Month">This Month</option>
              <option value="Last Month">Last Month</option>
              <option value="This Quarter">This Quarter</option>
              <option value="This Year">This Year</option>
            </select>
          </div>

          {/* View By Dropdown */}
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">View By</span>
            <select
              value={selectedViewBy}
              onChange={(e) => setSelectedViewBy(e.target.value)}
              className="bg-[#060b14] border border-[#15233c] text-slate-200 rounded-xl px-3 py-1.5 outline-none cursor-pointer"
            >
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
            </select>
          </div>

          {/* Category Dropdown */}
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Category</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-[#060b14] border border-[#15233c] text-slate-200 rounded-xl px-3 py-1.5 outline-none cursor-pointer"
            >
              <option value="All Categories">All Categories</option>
              <option value="Technology">Technology</option>
              <option value="Real Estate">Real Estate</option>
              <option value="Retail">Retail</option>
              <option value="Corporate">Corporate</option>
            </select>
          </div>

          {/* Package Dropdown */}
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Package</span>
            <select
              value={selectedPackage}
              onChange={(e) => setSelectedPackage(e.target.value)}
              className="bg-[#060b14] border border-[#15233c] text-slate-200 rounded-xl px-3 py-1.5 outline-none cursor-pointer"
            >
              <option value="All Packages">All Packages</option>
              <option value="Website Development">Website Development</option>
              <option value="SEO Services">SEO Services</option>
              <option value="Social Media Management">Social Media Management</option>
              <option value="Branding Package">Branding Package</option>
              <option value="E-commerce Package">E-commerce Package</option>
            </select>
          </div>

          {/* Status Dropdown */}
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Status</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-[#060b14] border border-[#15233c] text-slate-200 rounded-xl px-3 py-1.5 outline-none cursor-pointer"
            >
              <option value="All Status">All Status</option>
              <option value="Won">Won</option>
              <option value="Draft">Draft</option>
              <option value="Lost">Lost</option>
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 self-end">
          <button
            onClick={() => setCurrentPage(1)}
            className="bg-[#0066ff] hover:bg-[#0055d4] text-white px-4 py-1.5 rounded-xl font-semibold flex items-center gap-1.5 shadow-md shadow-blue-600/30 transition-all cursor-pointer"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Apply Filter</span>
          </button>
          <button
            onClick={handleReset}
            className="bg-[#0b1426] hover:bg-[#121f38] text-slate-300 border border-[#162544] px-3 py-1.5 rounded-xl font-medium flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* Row 4: Sales Details Table & Right Breakdown Widgets */}
      {/* -------------------------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left: Sales Details Table (8 Cols) */}
        <div className="lg:col-span-8 bg-[#091224] border border-[#14233e] rounded-2xl p-5 shadow-2xl space-y-4">
          <h2 className="text-sm font-bold text-white tracking-wide pb-2 border-b border-[#14233e]">
            Sales Details
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#14233e] text-slate-400">
                  <th className="py-2.5 px-3 font-semibold w-8">#</th>
                  <th className="py-2.5 px-3 font-semibold">Date</th>
                  <th className="py-2.5 px-3 font-semibold">Client Name</th>
                  <th className="py-2.5 px-3 font-semibold">Category</th>
                  <th className="py-2.5 px-3 font-semibold">Package / Service</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Amount (AED)</th>
                  <th className="py-2.5 px-3 font-semibold text-center">Status</th>
                  <th className="py-2.5 px-3 font-semibold text-center">Payment Status</th>
                  <th className="py-2.5 px-3 font-semibold text-center w-8"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#14233e]">
                {filteredSales.slice((currentPage - 1) * 10, currentPage * 10).map((row) => (
                  <tr key={row.id} className="hover:bg-[#0c182e]/50 transition-colors">
                    <td className="py-3 px-3 text-slate-400 font-medium">{row.id}</td>
                    <td className="py-3 px-3 text-slate-300 whitespace-nowrap">{row.date}</td>
                    <td className="py-3 px-3 font-semibold text-white whitespace-nowrap">
                      {row.clientName}
                    </td>
                    <td className="py-3 px-3 text-slate-300">{row.category}</td>
                    <td className="py-3 px-3 text-slate-300">{row.packageService}</td>
                    <td className="py-3 px-3 text-right font-bold text-white whitespace-nowrap">
                      {row.amount.toLocaleString()}
                    </td>
                    {/* Status Pill */}
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      {row.status === "Won" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950/70 border border-emerald-500/40 text-emerald-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          Won
                        </span>
                      )}
                      {row.status === "Draft" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-950/70 border border-amber-500/40 text-amber-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                          Draft
                        </span>
                      )}
                      {row.status === "Lost" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-rose-950/70 border border-rose-500/40 text-rose-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                          Lost
                        </span>
                      )}
                    </td>
                    {/* Payment Status Pill */}
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      {row.paymentStatus === "Paid" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950/70 border border-emerald-500/40 text-emerald-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          Paid
                        </span>
                      )}
                      {row.paymentStatus === "Partial" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-950/70 border border-amber-500/40 text-amber-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                          Partial
                        </span>
                      )}
                      {row.paymentStatus === "Unpaid" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-rose-950/70 border border-rose-500/40 text-rose-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                          Unpaid
                        </span>
                      )}
                      {row.paymentStatus === "N/A" && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-800/80 text-slate-400">
                          N/A
                        </span>
                      )}
                    </td>
                    {/* Actions button */}
                    <td className="py-3 px-3 text-center">
                      <button
                        className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-[#121f38] transition-colors"
                        title="Actions"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-[#14233e] text-xs">
            <span className="text-slate-400">
              Showing 1 to {Math.min(10, filteredSales.length)} of {filteredSales.length} entries
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-[#162544] text-slate-400 hover:text-white hover:bg-[#121f38] disabled:opacity-40 transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              {[1, 2, 3].map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-7 h-7 rounded-lg text-xs font-semibold transition-all ${
                    currentPage === page
                      ? "bg-[#0070f3] text-white shadow-md shadow-blue-500/30"
                      : "border border-[#162544] text-slate-300 hover:bg-[#121f38]"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((p) => Math.min(3, p + 1))}
                disabled={currentPage === 3}
                className="p-1.5 rounded-lg border border-[#162544] text-slate-400 hover:text-white hover:bg-[#121f38] disabled:opacity-40 transition-colors"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right: Breakdown Widgets (4 Cols) */}
        <div className="lg:col-span-4 space-y-5">
          {/* Widget 1: Sales by Status */}
          <div className="bg-[#091224] border border-[#14233e] rounded-2xl p-5 shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-white tracking-wide pb-2 border-b border-[#14233e]">
              Sales by Status
            </h3>

            <div className="flex items-center justify-around gap-4 py-2">
              {/* Donut Progress */}
              <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="transparent"
                    stroke="#081426"
                    strokeWidth="12"
                  />
                  {/* Won (64%) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="transparent"
                    stroke="#10b981"
                    strokeWidth="12"
                    strokeDasharray="153 239"
                    strokeDashoffset="0"
                  />
                  {/* Draft (18%) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="transparent"
                    stroke="#f59e0b"
                    strokeWidth="12"
                    strokeDasharray="43 239"
                    strokeDashoffset="-153"
                  />
                  {/* Lost (11%) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="transparent"
                    stroke="#f43f5e"
                    strokeWidth="12"
                    strokeDasharray="26 239"
                    strokeDashoffset="-196"
                  />
                  {/* Pending (7%) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="transparent"
                    stroke="#64748b"
                    strokeWidth="12"
                    strokeDasharray="17 239"
                    strokeDashoffset="-222"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-lg font-extrabold text-white leading-tight">28</span>
                  <span className="text-[9px] text-slate-400">Total Sales</span>
                </div>
              </div>

              {/* Status List matching screenshot */}
              <div className="space-y-2 text-xs min-w-0">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="text-slate-300">Won</span>
                  </div>
                  <span className="font-semibold text-white">18 (64%)</span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <span className="text-slate-300">Draft</span>
                  </div>
                  <span className="font-semibold text-white">5 (18%)</span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-400" />
                    <span className="text-slate-300">Lost</span>
                  </div>
                  <span className="font-semibold text-white">3 (11%)</span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-slate-400" />
                    <span className="text-slate-300">Pending</span>
                  </div>
                  <span className="font-semibold text-white">2 (7%)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Widget 2: Top Clients by Sales */}
          <div className="bg-[#091224] border border-[#14233e] rounded-2xl p-5 shadow-2xl space-y-3">
            <h3 className="text-sm font-bold text-white tracking-wide pb-2 border-b border-[#14233e]">
              Top Clients by Sales
            </h3>

            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#14233e] text-slate-400">
                  <th className="py-2 px-2 font-semibold w-8">#</th>
                  <th className="py-2 px-2 font-semibold">Client Name</th>
                  <th className="py-2 px-2 font-semibold text-right">Amount (AED)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#14233e]">
                {TOP_CLIENTS.map((client) => (
                  <tr key={client.id} className="hover:bg-[#0c182e]/40 transition-colors">
                    <td className="py-2.5 px-2 text-slate-400 font-medium">{client.id}</td>
                    <td className="py-2.5 px-2 font-semibold text-slate-200 truncate max-w-[140px]">
                      {client.name}
                    </td>
                    <td className="py-2.5 px-2 text-right font-bold text-white">
                      {client.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
