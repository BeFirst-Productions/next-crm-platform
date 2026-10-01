"use client";

import * as React from "react";
import Link from "next/link";
import {
  Users,
  UserPlus,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  Building2,
  Lock,
  Wallet,
  Clock,
  TrendingUp,
  Target,
  Percent,
  Laptop,
  Globe,
  Video,
  LayoutGrid,
  ChevronDown,
  FileText,
  DollarSign,
  RefreshCw,
  FileCheck,
  Send,
} from "lucide-react";

// ============================================================================
// DATA DEFINITIONS & MOCK METRICS MATCHING THE REFERENCE DESIGN
// ============================================================================

const TOP_METRICS = [
  {
    id: "total-leads",
    title: "Total Leads",
    value: "1,248",
    trend: "18.5%",
    trendUp: true,
    icon: Users,
    iconBg: "bg-blue-600/25 border-blue-500/40 text-blue-400",
    href: "/dashboard/leads",
  },
  {
    id: "new-leads",
    title: "New Leads",
    value: "246",
    trend: "12.3%",
    trendUp: true,
    icon: UserPlus,
    iconBg: "bg-cyan-500/25 border-cyan-400/40 text-cyan-400",
    href: "/dashboard/leads",
  },
  {
    id: "active-leads",
    title: "Active Leads",
    value: "620",
    trend: "8.4%",
    trendUp: true,
    icon: UserCheck,
    iconBg: "bg-purple-600/25 border-purple-500/40 text-purple-400",
    href: "/dashboard/leads",
  },
  {
    id: "converted-leads",
    title: "Converted Leads",
    value: "302",
    trend: "24.6%",
    trendUp: true,
    icon: CheckCircle2,
    iconBg: "bg-emerald-500/25 border-emerald-400/40 text-emerald-400",
    href: "/dashboard/leads",
  },
  {
    id: "lost-leads",
    title: "Lost Leads",
    value: "80",
    trend: "6.1%",
    trendUp: false,
    icon: AlertCircle,
    iconBg: "bg-rose-500/25 border-rose-500/40 text-rose-400",
    href: "/dashboard/leads",
  },
  {
    id: "total-clients",
    title: "Total Clients",
    value: "548",
    trend: "14.5%",
    trendUp: true,
    icon: Building2,
    iconBg: "bg-blue-500/25 border-blue-400/40 text-blue-400",
    href: "/dashboard/clients",
  },
];

const FINANCIAL_METRICS = [
  {
    id: "total-sales",
    title: "Total Sales",
    value: "AED 456,890",
    trend: "↑ 16.2%",
    icon: Lock,
    iconColor: "text-cyan-400",
    boxBg: "bg-[#0b243d] border-[#0284c7]/40",
  },
  {
    id: "payments-received",
    title: "Payments Received",
    value: "AED 312,450",
    trend: "↑ 14.8%",
    icon: Wallet,
    iconColor: "text-emerald-400",
    boxBg: "bg-[#072d24] border-[#059669]/40",
  },
  {
    id: "pending-payments",
    title: "Pending Payments",
    value: "AED 144,440",
    trend: "↑ 9.4%",
    icon: Clock,
    iconColor: "text-amber-400",
    boxBg: "bg-[#2a1d08] border-[#d97706]/40",
  },
  {
    id: "monthly-sales",
    title: "Monthly Sales",
    value: "AED 78,450",
    trend: "↑ 18.7%",
    icon: TrendingUp,
    iconColor: "text-purple-400",
    boxBg: "bg-[#220d3d] border-[#7c3aed]/40",
  },
  {
    id: "monthly-target",
    title: "Monthly Target",
    value: "AED 100,000",
    trend: null,
    icon: Target,
    iconColor: "text-cyan-400",
    boxBg: "bg-[#0a233f] border-[#0284c7]/40",
  },
  {
    id: "commission-payable",
    title: "Commission Payable",
    value: "AED 28,760",
    trend: null,
    icon: Percent,
    iconColor: "text-blue-400",
    boxBg: "bg-[#0d1d42] border-[#2563eb]/40",
  },
];

const SERVICES_DATA = [
  {
    id: "web-dev",
    name: "Website Development",
    icon: Laptop,
    amount: "AED 191,800",
    percentage: 42,
    barColor: "bg-[#00c0f0]",
    iconColor: "text-[#00c0f0]",
    boxBg: "bg-[#0a233d]",
  },
  {
    id: "digital-marketing",
    name: "Digital Marketing",
    icon: Globe,
    amount: "AED 128,450",
    percentage: 28,
    barColor: "bg-[#10b981]",
    iconColor: "text-[#10b981]",
    boxBg: "bg-[#072d22]",
  },
  {
    id: "video-production",
    name: "Video Production",
    icon: Video,
    amount: "AED 72,500",
    percentage: 16,
    barColor: "bg-[#a855f7]",
    iconColor: "text-[#a855f7]",
    boxBg: "bg-[#220e3a]",
  },
  {
    id: "other-services",
    name: "Other Services",
    icon: LayoutGrid,
    amount: "AED 63,050",
    percentage: 14,
    barColor: "bg-[#f59e0b]",
    iconColor: "text-[#f59e0b]",
    boxBg: "bg-[#2d1e08]",
  },
];

const STAFF_RANKINGS = [
  {
    rank: 1,
    name: "Ahmed Khan",
    amount: "AED 98,450",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80",
  },
  {
    rank: 2,
    name: "Rahul Sharma",
    amount: "AED 76,800",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80",
  },
  {
    rank: 3,
    name: "Fatima Ali",
    amount: "AED 63,750",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&h=120&q=80",
  },
  {
    rank: 4,
    name: "Jason D'souza",
    amount: "AED 42,900",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80",
  },
  {
    rank: 5,
    name: "Neha Patel",
    amount: "AED 38,450",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&h=120&q=80",
  },
];

const PIPELINE_STAGES = [
  { id: "new", name: "NEW", count: "246", color: "bg-[#1d4ed8]" },
  { id: "contacted", name: "CONTACTED", count: "312", color: "bg-[#0284c7]" },
  { id: "interested", name: "INTERESTED", count: "220", color: "bg-[#0f766e]" },
  { id: "proposal_sent", name: "PROPOSAL SENT", count: "156", color: "bg-[#7e22ce]" },
  { id: "negotiation", name: "NEGOTIATION", count: "98", color: "bg-[#b45309]" },
  { id: "won", name: "WON", count: "142", color: "bg-[#047857]" },
  { id: "lost", name: "LOST", count: "80", color: "bg-[#b91c1c]" },
];

const LEADS_DATA = [
  {
    id: "LD-1250",
    customer: "Bright Solutions LLC",
    assignedTo: "Ahmed Khan",
    status: "Interested",
    statusColor: "bg-[#0c2f2e] text-[#2dd4bf] border-[#14b8a6]/40",
    priority: "High",
    priorityColor: "bg-[#331117] text-[#fb7185] border-[#f43f5e]/40",
    followUp: "20 May 2026",
  },
  {
    id: "LD-1249",
    customer: "Future Tech",
    assignedTo: "Rahul Sharma",
    status: "Proposal Sent",
    statusColor: "bg-[#25123d] text-[#d8b4fe] border-[#a855f7]/40",
    priority: "Medium",
    priorityColor: "bg-[#2e2009] text-[#fcd34d] border-[#f59e0b]/40",
    followUp: "19 May 2026",
  },
  {
    id: "LD-1248",
    customer: "Oceanic Group",
    assignedTo: "Fatima Ali",
    status: "Negotiation",
    statusColor: "bg-[#0f2347] text-[#93c5fd] border-[#3b82f6]/40",
    priority: "High",
    priorityColor: "bg-[#331117] text-[#fb7185] border-[#f43f5e]/40",
    followUp: "18 May 2026",
  },
];

const ACTIVITIES_DATA = [
  {
    id: "1",
    text: "Lead LD-1250 assigned to Ahmed Khan",
    time: "2 min ago",
    icon: Users,
    iconColor: "text-blue-400 bg-blue-950/70 border-blue-600/40",
  },
  {
    id: "2",
    text: "Invoice INV-2026-1587 created for Bright Solutions LLC",
    time: "15 min ago",
    icon: FileText,
    iconColor: "text-emerald-400 bg-emerald-950/70 border-emerald-600/40",
  },
  {
    id: "3",
    text: "Payment received AED 18,500 from Future Tech",
    time: "48 min ago",
    icon: DollarSign,
    iconColor: "text-cyan-400 bg-cyan-950/70 border-cyan-600/40",
  },
  {
    id: "4",
    text: "Lead LD-1248 status changed to Proposal Sent",
    time: "1 hr ago",
    icon: RefreshCw,
    iconColor: "text-blue-400 bg-blue-950/70 border-blue-600/40",
  },
  {
    id: "5",
    text: "New lead LD-1251 added by Rahul Sharma",
    time: "2 hr ago",
    icon: UserPlus,
    iconColor: "text-emerald-400 bg-emerald-950/70 border-emerald-600/40",
  },
  {
    id: "6",
    text: "Contract signed with Oceanic Group",
    time: "3 hr ago",
    icon: FileCheck,
    iconColor: "text-teal-400 bg-teal-950/70 border-teal-600/40",
  },
  {
    id: "7",
    text: "Invoice INV-2026-1586 sent to Vision Marketing",
    time: "4 hr ago",
    icon: Send,
    iconColor: "text-purple-400 bg-purple-950/70 border-purple-600/40",
  },
];

// ============================================================================
// EXECUTIVE DASHBOARD COMPONENT
// ============================================================================

export function ExecutiveDashboard() {
  const salesTimeframe = "This Month";
  const packageTimeframe = "This Month";

  return (
    <div className="space-y-4 sm:space-y-5 text-slate-100 font-sans pb-8">
      {/* ---------------------------------------------------------------------- */}
      {/* ROW 1: PRIMARY METRIC CARDS (6 Grid Cards) */}
      {/* ---------------------------------------------------------------------- */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-3.5">
        {TOP_METRICS.map((metric) => {
          const Icon = metric.icon;
          return (
            <div
              key={metric.id}
              className="bg-[#0b1426] border border-[#162544] hover:border-[#1e3a68] rounded-2xl p-4 transition-all duration-200 flex flex-col justify-between shadow-sm group hover:shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
            >
              <div>
                <div className="flex items-center gap-2.5 mb-2.5">
                  <div
                    className={`w-8 h-8 rounded-full border flex items-center justify-center shrink-0 ${metric.iconBg}`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[12px] font-medium text-slate-300 truncate">
                    {metric.title}
                  </span>
                </div>

                <div className="flex items-baseline justify-between gap-1 mt-1">
                  <span className="text-2xl font-bold text-white tracking-tight">
                    {metric.value}
                  </span>
                  <div
                    className={`flex items-center text-[11px] font-semibold ${
                      metric.trendUp ? "text-emerald-400" : "text-rose-400"
                    }`}
                  >
                    {metric.trendUp ? "↑" : "↓"} {metric.trend}
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-[#131f38] flex items-center justify-between">
                <Link
                  href={metric.href}
                  className="text-[11px] font-medium text-slate-400 hover:text-cyan-400 transition-colors"
                >
                  View Details
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* ---------------------------------------------------------------------- */}
      {/* ROW 2: FINANCIAL QUICK METRICS (6 Grid Cards) */}
      {/* ---------------------------------------------------------------------- */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-3.5">
        {FINANCIAL_METRICS.map((fin) => {
          const Icon = fin.icon;
          return (
            <div
              key={fin.id}
              className="bg-[#0b1426] border border-[#162544] hover:border-[#1e3a68] rounded-2xl p-3.5 flex items-center gap-3 transition-all duration-200 shadow-sm"
            >
              <div
                className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${fin.boxBg} ${fin.iconColor}`}
              >
                <Icon className="w-4 h-4" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-medium text-slate-400 truncate">
                  {fin.title}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                  <span className="text-[13px] font-bold text-white tracking-tight whitespace-nowrap">
                    {fin.value}
                  </span>
                  {fin.trend && (
                    <span className="text-[10px] font-semibold text-emerald-400 whitespace-nowrap">
                      {fin.trend}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ---------------------------------------------------------------------- */}
      {/* ROW 3: CHARTS & BREAKDOWN (3 Columns: 5fr - 4fr - 3fr) */}
      {/* ---------------------------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Sales Overview Chart (5 cols) */}
        <div className="lg:col-span-5 bg-[#0b1426] border border-[#162544] rounded-2xl p-5 flex flex-col justify-between shadow-sm">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-white tracking-wide">
              Sales Overview
            </h2>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0e1b33] border border-[#1a2e54] text-xs text-slate-300 cursor-pointer hover:border-cyan-500/40 transition-colors">
              <span>{salesTimeframe}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </div>
          </div>

          {/* SVG Glowing Line Chart */}
          <div className="relative w-full h-48 sm:h-52 my-1">
            <svg
              className="w-full h-full overflow-visible"
              viewBox="0 0 500 180"
              preserveAspectRatio="none"
            >
              <defs>
                {/* Glow Filter for the Neon Spline */}
                <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3.5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>

                {/* Subtle Area Fill Gradient */}
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00c0f0" stopOpacity="0.32" />
                  <stop offset="60%" stopColor="#00c0f0" stopOpacity="0.08" />
                  <stop offset="100%" stopColor="#00c0f0" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="35" y1="20" x2="490" y2="20" stroke="#162544" strokeDasharray="3 3" strokeWidth="0.75" />
              <line x1="35" y1="55" x2="490" y2="55" stroke="#162544" strokeDasharray="3 3" strokeWidth="0.75" />
              <line x1="35" y1="90" x2="490" y2="90" stroke="#162544" strokeDasharray="3 3" strokeWidth="0.75" />
              <line x1="35" y1="125" x2="490" y2="125" stroke="#162544" strokeDasharray="3 3" strokeWidth="0.75" />
              <line x1="35" y1="160" x2="490" y2="160" stroke="#162544" strokeWidth="0.75" />

              {/* Y Axis Labels */}
              <text x="25" y="23" fill="#64748b" fontSize="9" textAnchor="end" fontFamily="sans-serif">100K</text>
              <text x="25" y="58" fill="#64748b" fontSize="9" textAnchor="end" fontFamily="sans-serif">80K</text>
              <text x="25" y="93" fill="#64748b" fontSize="9" textAnchor="end" fontFamily="sans-serif">60K</text>
              <text x="25" y="128" fill="#64748b" fontSize="9" textAnchor="end" fontFamily="sans-serif">40K</text>
              <text x="25" y="163" fill="#64748b" fontSize="9" textAnchor="end" fontFamily="sans-serif">20K</text>

              {/* Area Fill */}
              <path
                d="M 45,155 C 90,150 120,135 170,120 C 210,108 235,52 265,52 C 295,52 320,115 365,115 C 410,115 440,75 480,70 L 480,160 L 45,160 Z"
                fill="url(#areaGradient)"
              />

              {/* Glowing Stroke Curve */}
              <path
                d="M 45,155 C 90,150 120,135 170,120 C 210,108 235,52 265,52 C 295,52 320,115 365,115 C 410,115 440,75 480,70"
                fill="none"
                stroke="#00c0f0"
                strokeWidth="2.5"
                filter="url(#neonGlow)"
              />

              {/* Tooltip & Point Marker at 15 May Peak */}
              <circle cx="265" cy="52" r="5" fill="#00c0f0" className="animate-pulse" />
              <circle cx="265" cy="52" r="9" fill="none" stroke="#00c0f0" strokeOpacity="0.4" strokeWidth="1.5" />
            </svg>

            {/* Floating Tooltip Box over Peak Point */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-[#0c1c38]/95 border border-cyan-500/70 rounded-lg px-2.5 py-1 shadow-[0_0_15px_rgba(0,192,240,0.35)] backdrop-blur-md pointer-events-none text-center">
              <p className="text-[10px] text-slate-300 font-medium leading-tight">15 May 2026</p>
              <p className="text-xs font-bold text-cyan-300 leading-tight">AED 78,450</p>
            </div>

            {/* X Axis Labels */}
            <div className="flex justify-between px-10 pt-1 text-[10px] text-slate-500 font-medium">
              <span>01 May</span>
              <span>08 May</span>
              <span className="text-cyan-400 font-semibold">15 May</span>
              <span>22 May</span>
              <span>31 May</span>
            </div>
          </div>

          {/* Bottom Summary Indicators */}
          <div className="mt-4 pt-3.5 border-t border-[#131f38] grid grid-cols-3 gap-2">
            <div>
              <p className="text-[10px] font-medium text-slate-400">Total Sales</p>
              <p className="text-xs font-bold text-white mt-0.5">
                AED 78,450 <span className="text-emerald-400 font-semibold text-[10px]">↑ 16.2%</span>
              </p>
            </div>
            <div>
              <p className="text-[10px] font-medium text-slate-400">Total Target</p>
              <p className="text-xs font-bold text-white mt-0.5">AED 100,000</p>
            </div>
            <div>
              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span>Achievement</span>
                <span className="text-white font-bold">78.45%</span>
              </div>
              <div className="w-full bg-[#131f38] h-1.5 rounded-full mt-1.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-cyan-500 to-[#00c0f0] h-full rounded-full shadow-[0_0_8px_rgba(0,192,240,0.6)]"
                  style={{ width: "78.45%" }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sales by Package / Service (4 cols) */}
        <div className="lg:col-span-4 bg-[#0b1426] border border-[#162544] rounded-2xl p-5 flex flex-col justify-between shadow-sm">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-white tracking-wide">
              Sales by Package / Service
            </h2>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0e1b33] border border-[#1a2e54] text-xs text-slate-300 cursor-pointer hover:border-cyan-500/40 transition-colors">
              <span>{packageTimeframe}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </div>
          </div>

          {/* List of Services */}
          <div className="space-y-4">
            {SERVICES_DATA.map((srv) => {
              const Icon = srv.icon;
              return (
                <div key={srv.id} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-7 h-7 rounded-lg border border-slate-700/50 flex items-center justify-center shrink-0 ${srv.boxBg} ${srv.iconColor}`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-semibold text-slate-200 truncate">
                        {srv.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs shrink-0">
                      <span className="text-slate-300 font-medium">{srv.amount}</span>
                      <span className="font-bold text-white w-7 text-right">
                        {srv.percentage}%
                      </span>
                    </div>
                  </div>

                  {/* Colored Progress Bar */}
                  <div className="w-full bg-[#131f38] h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${srv.barColor}`}
                      style={{ width: `${srv.percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 pt-2 border-t border-transparent" />
        </div>

        {/* Sales by Staff (3 cols) */}
        <div className="lg:col-span-3 bg-[#0b1426] border border-[#162544] rounded-2xl p-5 flex flex-col justify-between shadow-sm">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-white tracking-wide">
              Sales by Staff
            </h2>
            <Link
              href="/dashboard/reports"
              className="text-xs font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              View All
            </Link>
          </div>

          {/* Staff Leaderboard List */}
          <div className="space-y-3.5">
            {STAFF_RANKINGS.map((staff) => (
              <div
                key={staff.rank}
                className="flex items-center justify-between gap-2 p-1 rounded-xl hover:bg-[#0f1d38] transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-xs font-bold text-slate-400 w-3.5 text-center">
                    {staff.rank}
                  </span>
                  <div className="w-7 h-7 rounded-full overflow-hidden border border-slate-700/60 shrink-0 bg-slate-800">
                    <img
                      src={staff.avatar}
                      alt={staff.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-xs font-semibold text-slate-200 truncate">
                    {staff.name}
                  </span>
                </div>

                <span className="text-xs font-bold text-white shrink-0">
                  {staff.amount}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-2 pt-2 border-t border-transparent" />
        </div>
      </div>

      {/* ---------------------------------------------------------------------- */}
      {/* ROW 4: PIPELINE & RECENT ACTIVITY (2 Columns: 8fr - 4fr) */}
      {/* ---------------------------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Lead Status Pipeline & Leads Table (8 cols) */}
        <div className="lg:col-span-8 bg-[#0b1426] border border-[#162544] rounded-2xl p-5 flex flex-col justify-between shadow-sm">
          <div>
            <h2 className="text-sm font-bold text-white tracking-wide mb-3.5">
              Lead Status Pipeline
            </h2>

            {/* Interlocking Chevron Flow */}
            <div className="grid grid-cols-7 gap-1 sm:gap-1.5 py-1">
              {PIPELINE_STAGES.map((stage, idx) => {
                const isFirst = idx === 0;
                const isLast = idx === PIPELINE_STAGES.length - 1;

                // Chevron Polygon Clip Path
                const clipPathStyle = isFirst
                  ? "polygon(0% 0%, calc(100% - 10px) 0%, 100% 50%, calc(100% - 10px) 100%, 0% 100%)"
                  : isLast
                  ? "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 10px 50%)"
                  : "polygon(0% 0%, calc(100% - 10px) 0%, 100% 50%, calc(100% - 10px) 100%, 0% 100%, 10px 50%)";

                return (
                  <div
                    key={stage.id}
                    style={{ clipPath: clipPathStyle }}
                    className={`${stage.color} py-2.5 px-2 flex flex-col items-center justify-center text-center text-white transition-transform hover:scale-[1.03] cursor-pointer shadow-sm`}
                  >
                    <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-100 truncate w-full text-center">
                      {stage.name}
                    </span>
                    <span className="text-sm sm:text-base font-extrabold text-white mt-0.5">
                      {stage.count}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Leads Table */}
            <div className="mt-5 overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#14233f] text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    <th className="py-2.5 pr-4">LEAD ID</th>
                    <th className="py-2.5 px-4">CUSTOMER / COMPANY</th>
                    <th className="py-2.5 px-4">ASSIGNED TO</th>
                    <th className="py-2.5 px-4 text-center">STATUS</th>
                    <th className="py-2.5 px-4 text-center">PRIORITY</th>
                    <th className="py-2.5 pl-4 text-right">NEXT FOLLOW-UP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#131f38]">
                  {LEADS_DATA.map((lead) => (
                    <tr
                      key={lead.id}
                      className="hover:bg-[#0f1d38]/60 transition-colors group cursor-pointer"
                    >
                      <td className="py-3 pr-4 font-bold text-cyan-400 group-hover:underline">
                        {lead.id}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-200">
                        {lead.customer}
                      </td>
                      <td className="py-3 px-4 text-slate-300">
                        {lead.assignedTo}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${lead.statusColor}`}
                        >
                          {lead.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${lead.priorityColor}`}
                        >
                          {lead.priority}
                        </span>
                      </td>
                      <td className="py-3 pl-4 text-right text-slate-400 font-mono text-[11px]">
                        {lead.followUp}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Recent Activity (4 cols) */}
        <div className="lg:col-span-4 bg-[#0b1426] border border-[#162544] rounded-2xl p-5 flex flex-col justify-between shadow-sm">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-white tracking-wide">
              Recent Activity
            </h2>
            <Link
              href="/admin/activity"
              className="text-xs font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              View All
            </Link>
          </div>

          {/* Activity Stream */}
          <div className="space-y-3.5">
            {ACTIVITIES_DATA.map((act) => {
              const Icon = act.icon;
              return (
                <div key={act.id} className="flex items-start gap-3">
                  <div
                    className={`w-7 h-7 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${act.iconColor}`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-slate-200 leading-snug line-clamp-1">
                      {act.text}
                    </p>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      {act.time}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-2 pt-2 border-t border-transparent" />
        </div>
      </div>
    </div>
  );
}
