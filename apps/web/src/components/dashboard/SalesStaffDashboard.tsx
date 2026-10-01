"use client";

import * as React from "react";
import Link from "next/link";
import {
  TrendingUp,
  DollarSign,
  FileText,
  FileCheck,
  Plus,
  Phone,
  Calendar,
  Clock,
  ChevronDown,
  MoreVertical,
  Eye,
  Pencil,
  Filter,
  RotateCcw,
  Receipt,
  Percent,
  BarChart3,
  ArrowRight,
  X,
} from "lucide-react";
import type { UserSession } from "@/types/auth.types";

interface SalesStaffDashboardProps {
  user?: UserSession | null;
}

// ============================================================================
// MOCK DATA MATCHING REFERENCE SCREENSHOT
// ============================================================================

const KPI_CARDS = [
  {
    id: "total-sales",
    title: "Total Sales",
    value: "18",
    trend: "+28% vs last month",
    trendUp: true,
    icon: TrendingUp,
    iconColor: "text-emerald-400",
    iconBg: "bg-emerald-500/20 border border-emerald-400/30",
  },
  {
    id: "total-amount",
    title: "Total Amount",
    value: "AED 142,850",
    trend: "+24% vs last month",
    trendUp: true,
    icon: DollarSign,
    iconColor: "text-blue-400",
    iconBg: "bg-blue-600/20 border border-blue-500/30",
  },
  {
    id: "total-draft",
    title: "Total Draft",
    value: "5",
    trend: "-17% vs last month",
    trendUp: false,
    icon: FileText,
    iconColor: "text-amber-400",
    iconBg: "bg-amber-500/20 border border-amber-400/30",
  },
  {
    id: "total-proposal",
    title: "Total Proposal",
    value: "12",
    trend: "+33% vs last month",
    trendUp: true,
    icon: FileCheck,
    iconColor: "text-purple-400",
    iconBg: "bg-purple-600/20 border border-purple-500/30",
  },
];

const TODAYS_TASKS = [
  {
    id: "1",
    title: "Follow up - Oceanic Group",
    subtitle: "Call and share revised proposal",
    time: "10:00 AM",
    icon: Phone,
    iconBg: "bg-[#062c20] text-emerald-400 border border-emerald-500/30",
  },
  {
    id: "2",
    title: "Send quotation - Future Tech",
    subtitle: "Share SEO package details",
    time: "12:30 PM",
    icon: FileText,
    iconBg: "bg-[#0b243d] text-blue-400 border border-blue-500/30",
  },
  {
    id: "3",
    title: "Client meeting - Bright Solutions",
    subtitle: "Online meeting (Google Meet)",
    time: "03:00 PM",
    icon: Calendar,
    iconBg: "bg-[#220d3d] text-purple-400 border border-purple-500/30",
  },
  {
    id: "4",
    title: "Invoice follow up - Creative Minds",
    subtitle: "Check payment status",
    time: "05:00 PM",
    icon: Clock,
    iconBg: "bg-[#2d1e08] text-amber-400 border border-amber-500/30",
  },
];

interface ProposalItem {
  id: number;
  initials: string;
  initialsBg: string;
  clientName: string;
  category: string;
  packageService: string;
  amount: number;
  createdOn: string;
  status: "Proposal Sent" | "Won" | "Draft";
  statusColor: string;
}

const INITIAL_PROPOSALS: ProposalItem[] = [
  {
    id: 1,
    initials: "BS",
    initialsBg: "bg-blue-600",
    clientName: "Bright Solutions LLC",
    category: "Technology",
    packageService: "Website Development",
    amount: 25000,
    createdOn: "28 May 2026",
    status: "Proposal Sent",
    statusColor: "bg-[#220d3d] text-purple-300 border-purple-500/40",
  },
  {
    id: 2,
    initials: "FT",
    initialsBg: "bg-emerald-600",
    clientName: "Future Tech",
    category: "Technology",
    packageService: "SEO & Content Growth",
    amount: 18500,
    createdOn: "26 May 2026",
    status: "Won",
    statusColor: "bg-[#062c20] text-emerald-300 border-emerald-500/40",
  },
  {
    id: 3,
    initials: "OG",
    initialsBg: "bg-purple-600",
    clientName: "Oceanic Group",
    category: "Real Estate",
    packageService: "Digital Marketing Pro",
    amount: 32000,
    createdOn: "24 May 2026",
    status: "Draft",
    statusColor: "bg-[#2d1e08] text-amber-300 border-amber-500/40",
  },
  {
    id: 4,
    initials: "VM",
    initialsBg: "bg-teal-600",
    clientName: "Vision Marketing",
    category: "Retail",
    packageService: "Branding Package",
    amount: 15750,
    createdOn: "21 May 2026",
    status: "Won",
    statusColor: "bg-[#062c20] text-emerald-300 border-emerald-500/40",
  },
  {
    id: 5,
    initials: "CM",
    initialsBg: "bg-rose-600",
    clientName: "Creative Minds",
    category: "Retail",
    packageService: "Social Media Management",
    amount: 12300,
    createdOn: "18 May 2026",
    status: "Proposal Sent",
    statusColor: "bg-[#220d3d] text-purple-300 border-purple-500/40",
  },
];

// ============================================================================
// SALES STAFF DASHBOARD COMPONENT
// ============================================================================

export function SalesStaffDashboard({ user }: SalesStaffDashboardProps) {
  const [salesTimeframe] = React.useState("This Month");
  const [dateRange, setDateRange] = React.useState("This Month");
  const [viewBy, setViewBy] = React.useState("Weekly");
  const [categoryFilter, setCategoryFilter] = React.useState("All Categories");
  const [packageFilter, setPackageFilter] = React.useState("All Packages");

  // Proposals State
  const [proposals, setProposals] = React.useState<ProposalItem[]>(INITIAL_PROPOSALS);
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);

  // New Proposal Form
  const [newClientName, setNewClientName] = React.useState("");
  const [newCategory, setNewCategory] = React.useState("Technology");
  const [newPackage, setNewPackage] = React.useState("Website Development");
  const [newAmount, setNewAmount] = React.useState("20000");

  const displayName = user?.name ? user.name.split(" ")[0] : "Rahul";

  const handleCreateProposal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName.trim()) return;

    const initials = newClientName
      .split(" ")
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

    const newProp: ProposalItem = {
      id: proposals.length + 1,
      initials: initials || "CL",
      initialsBg: "bg-blue-600",
      clientName: newClientName.trim(),
      category: newCategory,
      packageService: newPackage,
      amount: Number(newAmount) || 0,
      createdOn: "29 May 2026",
      status: "Draft",
      statusColor: "bg-[#2d1e08] text-amber-300 border-amber-500/40",
    };

    setProposals([newProp, ...proposals]);
    setIsCreateModalOpen(false);
    setNewClientName("");
  };

  const handleResetFilters = () => {
    setDateRange("This Month");
    setViewBy("Weekly");
    setCategoryFilter("All Categories");
    setPackageFilter("All Packages");
  };

  return (
    <div className="space-y-4 sm:space-y-5 text-slate-100 font-sans pb-10 select-none">
      {/* -------------------------------------------------------------------- */}
      {/* GREETING & TOP ACTION BAR */}
      {/* -------------------------------------------------------------------- */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Good Afternoon, {displayName}!
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Here&apos;s your sales overview. Keep up the great work!
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3 self-start lg:self-auto">
          <div className="text-left sm:text-right hidden sm:block">
            <p className="text-xs font-semibold text-slate-300">
              Thursday, 29 May 2026
            </p>
            <p className="text-[10px] text-slate-500 italic mt-0.5">
              Bigger Conversations. Brighter Opportunities.
            </p>
          </div>

          <Link
            href="/client-portal/company-details"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0080ff] hover:bg-[#0070e0] text-white text-xs font-semibold shadow-[0_0_16px_rgba(0,128,255,0.4)] transition-all cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Client Proposal</span>
          </Link>
        </div>
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* ROW 1: 4 KPI CARDS */}
      {/* -------------------------------------------------------------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {KPI_CARDS.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.id}
              className="bg-[#0b1426] border border-[#162544] hover:border-[#1e3a68] rounded-2xl p-4 flex items-center gap-4 transition-all duration-200 shadow-sm"
            >
              <div
                className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${kpi.iconBg} ${kpi.iconColor}`}
              >
                <Icon className="w-5 h-5" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-medium text-slate-400 truncate">
                  {kpi.title}
                </p>
                <p className="text-2xl font-bold text-white tracking-tight leading-tight mt-0.5">
                  {kpi.value}
                </p>
                <p
                  className={`text-[10.5px] font-semibold mt-0.5 ${
                    kpi.trendUp ? "text-emerald-400" : "text-rose-400"
                  }`}
                >
                  {kpi.trendUp ? "↑" : "↓"} {kpi.trend}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* ROW 2: PERFORMANCE, TARGET & TASKS (5fr - 3fr - 4fr) */}
      {/* -------------------------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Card 1: Sales Performance (5 cols) */}
        <div className="lg:col-span-5 bg-[#0b1426] border border-[#162544] rounded-2xl p-5 flex flex-col justify-between shadow-sm">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <h2 className="text-sm font-bold text-white tracking-wide">
              Sales Performance
            </h2>

            <div className="flex items-center gap-3">
              {/* Legend */}
              <div className="flex items-center gap-2.5 text-[10px] text-slate-400 font-medium">
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-sm bg-[#00c0f0]" />
                  <span>Sales Amount (AED)</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-sm bg-[#10b981]" />
                  <span>No. of Proposals</span>
                </div>
              </div>

              {/* Dropdown */}
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-[#0e1b33] border border-[#1a2e54] text-[11px] text-slate-300">
                <span>{salesTimeframe}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </div>
            </div>
          </div>

          {/* Double Spline SVG Chart */}
          <div className="relative w-full h-48 sm:h-52 my-1">
            <svg
              className="w-full h-full overflow-visible"
              viewBox="0 0 500 180"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="staffBlueArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00c0f0" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#00c0f0" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="30" y1="20" x2="490" y2="20" stroke="#162544" strokeDasharray="3 3" strokeWidth="0.75" />
              <line x1="30" y1="65" x2="490" y2="65" stroke="#162544" strokeDasharray="3 3" strokeWidth="0.75" />
              <line x1="30" y1="110" x2="490" y2="110" stroke="#162544" strokeDasharray="3 3" strokeWidth="0.75" />
              <line x1="30" y1="155" x2="490" y2="155" stroke="#162544" strokeWidth="0.75" />

              {/* Y Axis Labels */}
              <text x="22" y="24" fill="#64748b" fontSize="9" textAnchor="end">60K</text>
              <text x="22" y="69" fill="#64748b" fontSize="9" textAnchor="end">40K</text>
              <text x="22" y="114" fill="#64748b" fontSize="9" textAnchor="end">20K</text>
              <text x="22" y="159" fill="#64748b" fontSize="9" textAnchor="end">0</text>

              {/* Blue Curve (Sales Amount) Area Fill */}
              <path
                d="M 40,140 C 90,110 130,130 180,105 C 230,80 250,55 300,75 C 350,95 400,60 480,85 L 480,155 L 40,155 Z"
                fill="url(#staffBlueArea)"
              />

              {/* Blue Spline Stroke (Sales Amount) */}
              <path
                d="M 40,140 C 90,110 130,130 180,105 C 230,80 250,55 300,75 C 350,95 400,60 480,85"
                fill="none"
                stroke="#00c0f0"
                strokeWidth="2.5"
              />

              {/* Green Spline Stroke (No. of Proposals) */}
              <path
                d="M 40,150 C 90,140 130,145 180,135 C 230,125 250,110 300,120 C 350,130 400,105 480,115"
                fill="none"
                stroke="#10b981"
                strokeWidth="2"
              />

              {/* Points on Blue Curve */}
              <circle cx="40" cy="140" r="3" fill="#00c0f0" />
              <circle cx="100" cy="120" r="3" fill="#00c0f0" />
              <circle cx="180" cy="105" r="3" fill="#00c0f0" />
              <circle cx="250" cy="65" r="4.5" fill="#00c0f0" />
              <circle cx="340" cy="80" r="3" fill="#00c0f0" />
              <circle cx="480" cy="85" r="3" fill="#00c0f0" />

              {/* Points on Green Curve */}
              <circle cx="40" cy="150" r="2.5" fill="#10b981" />
              <circle cx="100" cy="142" r="2.5" fill="#10b981" />
              <circle cx="180" cy="135" r="2.5" fill="#10b981" />
              <circle cx="250" cy="115" r="4" fill="#10b981" />
              <circle cx="340" cy="122" r="2.5" fill="#10b981" />
              <circle cx="480" cy="115" r="2.5" fill="#10b981" />
            </svg>

            {/* Tooltip Callout Box at May 16 Peak */}
            <div className="absolute top-2 left-[50%] -translate-x-1/2 bg-[#0c1c38]/95 border border-cyan-500/70 rounded-lg px-2.5 py-1 shadow-[0_0_15px_rgba(0,192,240,0.35)] backdrop-blur-md pointer-events-none text-center">
              <p className="text-[10px] text-slate-300 font-medium leading-tight">16 May 2026</p>
              <p className="text-xs font-bold text-cyan-300 leading-tight">AED 28,450</p>
              <p className="text-[10px] font-bold text-emerald-400 leading-tight">6 Proposals</p>
            </div>

            {/* X Axis Labels */}
            <div className="flex justify-between px-6 pt-1 text-[10px] text-slate-500 font-medium">
              <span>01 May</span>
              <span>07 May</span>
              <span>14 May</span>
              <span>21 May</span>
              <span>28 May</span>
            </div>
          </div>
        </div>

        {/* Card 2: Monthly Target (3 cols) */}
        <div className="lg:col-span-3 bg-[#0b1426] border border-[#162544] rounded-2xl p-5 flex flex-col justify-between shadow-sm">
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-bold text-white tracking-wide">
              Monthly Target
            </h2>
            <button className="text-slate-400 hover:text-white p-1">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>

          {/* Donut Radial Chart */}
          <div className="relative w-36 h-36 mx-auto flex items-center justify-center my-2">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
              {/* Background Track */}
              <circle
                cx="80"
                cy="80"
                r="62"
                stroke="#14233f"
                strokeWidth="14"
                fill="none"
              />
              {/* Cyan Progress Arc (68% of circumference = 2 * PI * 62 = 389.5, 68% = 264.8) */}
              <circle
                cx="80"
                cy="80"
                r="62"
                stroke="#00c0f0"
                strokeWidth="14"
                strokeDasharray="389.5"
                strokeDashoffset={389.5 * (1 - 0.68)}
                strokeLinecap="round"
                fill="none"
                className="drop-shadow-[0_0_8px_rgba(0,192,240,0.5)]"
              />
            </svg>

            {/* Center Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-extrabold text-white tracking-tight">
                68%
              </span>
              <span className="text-[11px] font-bold text-slate-200 mt-0.5">
                AED 142,850
              </span>
              <span className="text-[9.5px] text-slate-400">
                of AED 210,000
              </span>
            </div>
          </div>

          {/* Legend */}
          <div className="pt-3 border-t border-[#131f38] flex flex-col gap-1 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-sm bg-[#00c0f0]" />
                <span className="text-slate-400 text-[11px]">Achieved</span>
              </div>
              <span className="text-white font-semibold text-[11px]">AED 142,850</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-sm bg-slate-600" />
                <span className="text-slate-400 text-[11px]">Remaining</span>
              </div>
              <span className="text-slate-300 font-semibold text-[11px]">AED 67,150</span>
            </div>
          </div>
        </div>

        {/* Card 3: Today's Tasks (4 cols) */}
        <div className="lg:col-span-4 bg-[#0b1426] border border-[#162544] rounded-2xl p-5 flex flex-col justify-between shadow-sm">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-white tracking-wide">
              Today&apos;s Tasks
            </h2>
            <Link
              href="/dashboard"
              className="text-xs font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              View All
            </Link>
          </div>

          {/* Task Items */}
          <div className="space-y-3">
            {TODAYS_TASKS.map((task) => {
              const Icon = task.icon;
              return (
                <div
                  key={task.id}
                  className="flex items-center justify-between gap-2.5 p-2 rounded-xl hover:bg-[#0f1d38] transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${task.iconBg}`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-200 truncate leading-tight">
                        {task.title}
                      </p>
                      <p className="text-[10.5px] text-slate-400 truncate mt-0.5 leading-tight">
                        {task.subtitle}
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] font-semibold text-slate-400 shrink-0 whitespace-nowrap">
                    {task.time}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-1 pt-1 border-t border-transparent" />
        </div>
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* ROW 3: PROPOSALS FILTER BAR */}
      {/* -------------------------------------------------------------------- */}
      <div className="bg-[#0b1426] border border-[#162544] rounded-2xl p-3.5 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-end">
          {/* Date Range */}
          <div className="lg:col-span-2">
            <label className="block text-[11px] font-medium text-slate-400 mb-1.5">
              Date Range
            </label>
            <div className="relative">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full bg-[#0d182e] border border-[#1a2d52] focus:border-cyan-500 text-xs text-slate-200 rounded-xl px-3 py-2 appearance-none outline-none cursor-pointer pr-8"
              >
                <option value="This Month">This Month</option>
                <option value="Last Month">Last Month</option>
                <option value="This Quarter">This Quarter</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* View By */}
          <div className="lg:col-span-2">
            <label className="block text-[11px] font-medium text-slate-400 mb-1.5">
              View By
            </label>
            <div className="relative">
              <select
                value={viewBy}
                onChange={(e) => setViewBy(e.target.value)}
                className="w-full bg-[#0d182e] border border-[#1a2d52] focus:border-cyan-500 text-xs text-slate-200 rounded-xl px-3 py-2 appearance-none outline-none cursor-pointer pr-8"
              >
                <option value="Weekly">Weekly</option>
                <option value="Daily">Daily</option>
                <option value="Monthly">Monthly</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Categories */}
          <div className="lg:col-span-3">
            <label className="block text-[11px] font-medium text-slate-400 mb-1.5">
              Categories
            </label>
            <div className="relative">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full bg-[#0d182e] border border-[#1a2d52] focus:border-cyan-500 text-xs text-slate-200 rounded-xl px-3 py-2 appearance-none outline-none cursor-pointer pr-8"
              >
                <option value="All Categories">All Categories</option>
                <option value="Technology">Technology</option>
                <option value="Real Estate">Real Estate</option>
                <option value="Retail">Retail</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Package */}
          <div className="lg:col-span-3">
            <label className="block text-[11px] font-medium text-slate-400 mb-1.5">
              Package
            </label>
            <div className="relative">
              <select
                value={packageFilter}
                onChange={(e) => setPackageFilter(e.target.value)}
                className="w-full bg-[#0d182e] border border-[#1a2d52] focus:border-cyan-500 text-xs text-slate-200 rounded-xl px-3 py-2 appearance-none outline-none cursor-pointer pr-8"
              >
                <option value="All Packages">All Packages</option>
                <option value="Website Development">Website Development</option>
                <option value="SEO & Content Growth">SEO & Content Growth</option>
                <option value="Digital Marketing Pro">Digital Marketing Pro</option>
                <option value="Branding Package">Branding Package</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Buttons: Apply Filter & Reset */}
          <div className="lg:col-span-2 flex items-center gap-2">
            <button
              onClick={() => {}}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#0080ff] hover:bg-[#0070e0] text-white text-xs font-semibold shadow-[0_0_12px_rgba(0,128,255,0.4)] transition-all cursor-pointer"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Apply Filter</span>
            </button>
            <button
              onClick={handleResetFilters}
              className="p-2 rounded-xl border border-slate-700 hover:border-slate-600 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Reset Filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* ROW 4: RECENT CLIENT PROPOSALS TABLE */}
      {/* -------------------------------------------------------------------- */}
      <div className="bg-[#0b1426] border border-[#162544] rounded-2xl p-5 shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-white tracking-wide">
            Recent Client Proposals
          </h2>
          <Link
            href="/dashboard/proposals"
            className="text-xs font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            View All
          </Link>
        </div>

        {/* Proposals Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#14233f] text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <th className="py-2.5 px-3 w-8">#</th>
                <th className="py-2.5 px-3">CLIENT NAME</th>
                <th className="py-2.5 px-3">CATEGORY</th>
                <th className="py-2.5 px-3">PACKAGE / SERVICE</th>
                <th className="py-2.5 px-3">AMOUNT (AED)</th>
                <th className="py-2.5 px-3">CREATED ON</th>
                <th className="py-2.5 px-3 text-center">STATUS</th>
                <th className="py-2.5 px-3 text-center">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#131f38]">
              {proposals.map((prop) => (
                <tr
                  key={prop.id}
                  className="hover:bg-[#0f1d38]/60 transition-colors group cursor-pointer"
                >
                  <td className="py-3 px-3 text-slate-400 font-semibold">{prop.id}</td>

                  {/* Client with Initials Circle */}
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-7 h-7 rounded-full text-white font-bold text-[10px] flex items-center justify-center shrink-0 ${prop.initialsBg}`}
                      >
                        {prop.initials}
                      </div>
                      <span className="font-semibold text-slate-200">
                        {prop.clientName}
                      </span>
                    </div>
                  </td>

                  <td className="py-3 px-3 text-slate-300">{prop.category}</td>
                  <td className="py-3 px-3 text-slate-300">{prop.packageService}</td>
                  <td className="py-3 px-3 font-semibold text-white">
                    {prop.amount.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 text-slate-400">{prop.createdOn}</td>

                  {/* Status Badge */}
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${prop.statusColor}`}
                    >
                      ● {prop.status}
                    </span>
                  </td>

                  {/* Action Icons: View, Edit, Dots */}
                  <td className="py-3 px-3 text-center">
                    <div className="flex items-center justify-center gap-2 text-slate-400">
                      <button
                        className="hover:text-cyan-400 transition-colors p-1"
                        title="View"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        className="hover:text-blue-400 transition-colors p-1"
                        title="Edit"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        className="hover:text-white transition-colors p-1"
                        title="More Options"
                      >
                        <MoreVertical className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* ROW 5: BOTTOM 3 QUICK ACTION CARDS */}
      {/* -------------------------------------------------------------------- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Invoice Generator */}
        <Link
          href="/dashboard/invoices/new"
          className="bg-[#0b1426] border border-[#162544] hover:border-cyan-500/40 rounded-2xl p-4.5 flex items-center justify-between group transition-all duration-200 shadow-sm"
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-cyan-600/20 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Receipt className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                Invoice Generator
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                Create and manage client invoices quickly.
              </p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all shrink-0 ml-2" />
        </Link>

        {/* Commission Report */}
        <Link
          href="/dashboard/commissions"
          className="bg-[#0b1426] border border-[#162544] hover:border-purple-500/40 rounded-2xl p-4.5 flex items-center justify-between group transition-all duration-200 shadow-sm"
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Percent className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors">
                Commission Report
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                View your earned commissions and performance.
              </p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all shrink-0 ml-2" />
        </Link>

        {/* Sales Report */}
        <Link
          href="/dashboard/reports"
          className="bg-[#0b1426] border border-[#162544] hover:border-emerald-500/40 rounded-2xl p-4.5 flex items-center justify-between group transition-all duration-200 shadow-sm"
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
                Sales Report
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                Detailed analysis of your sales activities.
              </p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all shrink-0 ml-2" />
        </Link>
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* CREATE NEW CLIENT PROPOSAL MODAL */}
      {/* -------------------------------------------------------------------- */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0b1426] border border-[#162544] rounded-2xl w-full max-w-md p-5 shadow-2xl space-y-4 animate-slide-up">
            <div className="flex items-center justify-between border-b border-[#14233f] pb-3">
              <h3 className="text-sm font-bold text-white">Create New Client Proposal</h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateProposal} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Client / Company Name *
                </label>
                <input
                  type="text"
                  required
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                  placeholder="e.g. Apex Global FZCO"
                  className="w-full bg-[#0d182e] border border-[#1a2d52] focus:border-cyan-500 text-white rounded-xl px-3 py-2 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Industry / Category
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full bg-[#0d182e] border border-[#1a2d52] focus:border-cyan-500 text-white rounded-xl px-3 py-2 outline-none cursor-pointer"
                >
                  <option value="Technology">Technology</option>
                  <option value="Real Estate">Real Estate</option>
                  <option value="Retail">Retail</option>
                  <option value="Hospitality">Hospitality</option>
                  <option value="Finance">Finance</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Package / Service
                </label>
                <select
                  value={newPackage}
                  onChange={(e) => setNewPackage(e.target.value)}
                  className="w-full bg-[#0d182e] border border-[#1a2d52] focus:border-cyan-500 text-white rounded-xl px-3 py-2 outline-none cursor-pointer"
                >
                  <option value="Website Development">Website Development</option>
                  <option value="SEO & Content Growth">SEO & Content Growth</option>
                  <option value="Digital Marketing Pro">Digital Marketing Pro</option>
                  <option value="Branding Package">Branding Package</option>
                  <option value="Social Media Management">Social Media Management</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Proposal Value (AED)
                </label>
                <input
                  type="number"
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                  placeholder="25000"
                  className="w-full bg-[#0d182e] border border-[#1a2d52] focus:border-cyan-500 text-white rounded-xl px-3 py-2 outline-none"
                />
              </div>

              <div className="pt-3 border-t border-[#14233f] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#0080ff] hover:bg-[#0070e0] text-white font-semibold shadow-[0_0_12px_rgba(0,128,255,0.4)]"
                >
                  Create Proposal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
