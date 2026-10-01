"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  UserPlus,
  Package,
  Receipt,
  Building2,
  FileCheck2,
  BarChart3,
  Target,
  Percent,
  CreditCard,
  FileSpreadsheet,
  History,
  Bell,
  Settings,
  Terminal,
  Database,
  LogOut,
  X,
  Contact,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

interface DashboardSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRIMARY_NAV_ITEMS = [
  {
    title: "Dash board",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "User Management",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Lead Management",
    href: "/dashboard/leads",
    icon: UserPlus,
  },
  {
    title: "Package & Add-ons",
    href: "/admin/packages",
    icon: Package,
  },
  {
    title: "Invoice Generator",
    href: "/dashboard/invoices/new",
    icon: Receipt,
  },
  {
    title: "Client Management",
    href: "/dashboard/clients",
    icon: Building2,
  },
  {
    title: "Contract Management",
    href: "/dashboard/contracts",
    icon: FileCheck2,
  },
  {
    title: "Staff Report / Analytics",
    href: "/dashboard/reports",
    icon: BarChart3,
  },
  {
    title: "Sales Target Management",
    href: "/dashboard/targets",
    icon: Target,
  },
  {
    title: "Commission Management",
    href: "/dashboard/commissions",
    icon: Percent,
  },
  {
    title: "Payment Status",
    href: "/dashboard/payments",
    icon: CreditCard,
  },
  {
    title: "Invoice Manager",
    href: "/dashboard/invoices",
    icon: FileSpreadsheet,
  },
];

const SECONDARY_NAV_ITEMS = [
  {
    title: "Activity History",
    href: "/admin/activity",
    icon: History,
  },
  {
    title: "Notifications",
    href: "/dashboard/notifications",
    icon: Bell,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
  {
    title: "System Logs",
    href: "/admin/logs",
    icon: Terminal,
  },
  {
    title: "Backup & Restore",
    href: "/admin/backup",
    icon: Database,
  },
];

export function DashboardSidebar({ isOpen, onClose }: DashboardSidebarProps) {
  const pathname = usePathname();
  const { user, logout, isLoading } = useAuth();

  const lastRoleRef = React.useRef(user?.role);
  const lastNameRef = React.useRef(user?.name);
  const lastEmailRef = React.useRef(user?.email);

  if (user?.role) {
    lastRoleRef.current = user.role;
  }
  if (user?.name) {
    lastNameRef.current = user.name;
  }
  if (user?.email) {
    lastEmailRef.current = user.email;
  }

  const effectiveRole = user?.role || lastRoleRef.current;
  const effectiveName = user?.name || lastNameRef.current;
  const effectiveEmail = user?.email || lastEmailRef.current;
  const isSalesStaff = effectiveRole === "SALES_STAFF";

  const isCurrentActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard" || pathname === "/";
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 z-40 w-64 bg-[#080e1a] border-r border-[#152238] flex flex-col transition-transform duration-300 lg:translate-x-0 select-none shadow-2xl",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Brand Header */}
        <div className="pt-6 pb-4 px-5 flex flex-col items-center border-b border-[#142138] relative">
          {/* Close button for mobile */}
          <button
            onClick={onClose}
            className="lg:hidden absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Logo from public/logo.svg */}
          <Link href="/dashboard" className="flex flex-col items-center group py-0.5">
            <img
              src="/logo.svg"
              alt="neXT Branding & Marketing"
              className="h-10 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
            />
          </Link>

          {/* Role Pill Badge */}
          <div className="mt-3.5 w-full max-w-[200px] py-1.5 px-3 rounded-full border border-cyan-500/50 bg-[#0c1f38]/60 text-center shadow-[0_0_12px_rgba(0,192,240,0.2)]">
            <span suppressHydrationWarning className="text-xs font-bold uppercase tracking-widest text-[#22d3ee]">
              {isSalesStaff ? "SALES STAFF" : "SUPER ADMIN"}
            </span>
          </div>
        </div>

        {/* Scrollable Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3.5 py-3 space-y-1.5 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
          {isSalesStaff ? (
            /* Sales Staff Streamlined Menu */
            [
              { title: "Dash board", href: "/dashboard", icon: LayoutDashboard },
              { title: "Invoice Generator", href: "/dashboard/invoices/new", icon: Receipt },
              { title: "Sales Report", href: "/dashboard/reports", icon: BarChart3 },
              { title: "Commission Report", href: "/dashboard/commissions", icon: Contact },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = isCurrentActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => {
                    if (typeof window !== "undefined" && window.innerWidth < 1024) {
                      onClose();
                    }
                  }}
                  className={cn(
                    "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group",
                    isActive
                      ? "bg-[#0080ff] text-white font-semibold shadow-[0_0_16px_rgba(0,128,255,0.4)]"
                      : "text-slate-400 hover:text-slate-100 hover:bg-[#0f1b30] border border-transparent",
                  )}
                >
                  <Icon
                    className={cn(
                      "w-[18px] h-[18px] shrink-0 transition-colors",
                      isActive
                        ? "text-white"
                        : "text-slate-400 group-hover:text-cyan-400",
                    )}
                  />
                  <span className="truncate">{item.title}</span>
                </Link>
              );
            })
          ) : (
            /* Super Admin / Admin Full Menu */
            <>
              {PRIMARY_NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = isCurrentActive(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => {
                      if (typeof window !== "undefined" && window.innerWidth < 1024) {
                        onClose();
                      }
                    }}
                    className={cn(
                      "flex items-center gap-3 px-3.5 py-2 rounded-xl text-sm font-medium transition-all group",
                      isActive
                        ? "bg-[#00c0f0] text-white font-semibold shadow-[0_0_16px_rgba(0,192,240,0.45)]"
                        : "text-slate-400 hover:text-slate-100 hover:bg-[#0f1b30] border border-transparent",
                    )}
                  >
                    <Icon
                      className={cn(
                        "w-[18px] h-[18px] shrink-0 transition-colors",
                        isActive
                          ? "text-white"
                          : "text-slate-400 group-hover:text-cyan-400",
                      )}
                    />
                    <span className="truncate">{item.title}</span>
                  </Link>
                );
              })}

              {/* Section: OTHER */}
              <div className="pt-3 pb-1 px-3.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  OTHER
                </span>
              </div>

              {SECONDARY_NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = isCurrentActive(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => {
                      if (typeof window !== "undefined" && window.innerWidth < 1024) {
                        onClose();
                      }
                    }}
                    className={cn(
                      "flex items-center gap-3 px-3.5 py-2 rounded-xl text-sm font-medium transition-all group",
                      isActive
                        ? "bg-[#00c0f0] text-white font-semibold shadow-[0_0_16px_rgba(0,192,240,0.45)]"
                        : "text-slate-400 hover:text-slate-100 hover:bg-[#0f1b30] border border-transparent",
                    )}
                  >
                    <Icon
                      className={cn(
                        "w-[18px] h-[18px] shrink-0 transition-colors",
                        isActive
                          ? "text-white"
                          : "text-slate-400 group-hover:text-cyan-400",
                      )}
                    />
                    <span className="truncate">{item.title}</span>
                  </Link>
                );
              })}
            </>
          )}
        </div>

        {/* Footer: User Profile Card */}
        <div className="p-3 border-t border-[#142138] bg-[#070c17]">
          <div className="p-2.5 rounded-xl bg-[#0b1426] border border-[#162544] flex items-center justify-between gap-2 shadow-sm">
            <div className="flex items-center gap-2.5 min-w-0">
              {isSalesStaff ? (
                <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-700 shrink-0 bg-slate-800">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80"
                    alt="Sales Staff"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-[#0a1b33] border border-cyan-500/60 flex items-center justify-center text-cyan-300 font-extrabold text-xs shrink-0 shadow-[0_0_8px_rgba(0,192,240,0.3)]">
                  N
                </div>
              )}
              <div className="min-w-0">
                <p suppressHydrationWarning className="text-sm font-bold text-white truncate leading-tight">
                  {isSalesStaff ? (effectiveName || "Sales Staff") : (effectiveName || "Super Admin")}
                </p>
                <p suppressHydrationWarning className="text-xs text-slate-400 truncate leading-tight">
                  {isSalesStaff ? (effectiveEmail || "staff@nextdigital.com") : (effectiveEmail || "admin@nextdigital.com")}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[11px] font-medium text-emerald-400">
                    Online
                  </span>
                </div>
              </div>
            </div>

            {!isSalesStaff && (
              <button
                onClick={() => logout()}
                disabled={isLoading}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition-colors shrink-0"
                title="Sign Out"
                aria-label="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Standalone Logout Button for Sales Staff */}
          {isSalesStaff && (
            <button
              onClick={() => logout()}
              disabled={isLoading}
              className="mt-2.5 w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors text-sm font-medium cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
