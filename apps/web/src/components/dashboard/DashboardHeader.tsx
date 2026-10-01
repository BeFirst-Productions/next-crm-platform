"use client";

import * as React from "react";
import Link from "next/link";
import {
  Menu,
  Search,
  Calendar,
  Bell,
  Moon,
  ChevronDown,
  LogOut,
  Settings,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface DashboardHeaderProps {
  onToggleSidebar?: () => void;
}

export function DashboardHeader({ onToggleSidebar }: DashboardHeaderProps) {
  const { user, logout, isLoading } = useAuth();
  const [userDropdownOpen, setUserDropdownOpen] = React.useState(false);
  const [dateRange] = React.useState("01 May 2026 - 31 May 2026");

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

  return (
    <header className="h-16 border-b border-[#142138] bg-[#080e1a]/95 backdrop-blur-xl px-4 lg:px-6 flex items-center justify-between sticky top-0 z-30 select-none">
      {/* -------------------------------------------------------------------- */}
      {/* Left: Hamburger Menu & System Title */}
      {/* -------------------------------------------------------------------- */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onToggleSidebar}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#121f38] transition-colors"
          aria-label="Toggle navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <h1 className="text-xs sm:text-sm font-semibold text-slate-100 tracking-normal hidden sm:block">
          Sales & Client Management Software
        </h1>
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* Center: Search Field */}
      {/* -------------------------------------------------------------------- */}
      <div className="flex-1 max-w-md mx-4 hidden md:block">
        <div className="relative flex items-center">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            placeholder={
              isSalesStaff
                ? "Search clients, invoices, proposals..."
                : "Search clients, leads, invoices, packages..."
            }
            className="w-full bg-[#0b1426] border border-[#162544] hover:border-[#22375e] focus:border-cyan-500/70 focus:ring-1 focus:ring-cyan-500/30 text-xs text-slate-200 placeholder:text-slate-500 rounded-xl pl-9 pr-4 py-2 transition-all outline-none"
          />
        </div>
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* Right Controls: Date Range, Notifications, Theme, Profile */}
      {/* -------------------------------------------------------------------- */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Date Range Picker Pill (Hidden on Sales Staff to match screenshot) */}
        {!isSalesStaff && (
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0b1426] border border-[#162544] text-xs text-slate-300 hover:border-[#22375e] transition-colors cursor-pointer">
            <span className="text-[11px] font-medium tracking-tight">
              {dateRange}
            </span>
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
          </div>
        )}

        {/* Notifications badge ('3' for sales staff, '12' for super admin) */}
        <button
          className="relative p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-[#121f38] transition-colors"
          aria-label="View notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-rose-500 text-[9.5px] font-bold text-white flex items-center justify-center shadow-md">
            {isSalesStaff ? "3" : "12"}
          </span>
        </button>

        {/* Moon / Theme Toggle (for super admin) */}
        {!isSalesStaff && (
          <button
            className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-[#121f38] transition-colors"
            aria-label="Toggle theme"
          >
            <Moon className="w-4 h-4" />
          </button>
        )}

        {/* User Profile Pill & Dropdown */}
        <div className="relative">
          <button
            onClick={() => setUserDropdownOpen(!userDropdownOpen)}
            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-[#121f38] transition-colors text-left"
            aria-label="User menu"
          >
            <div className="w-7 h-7 rounded-full overflow-hidden border border-slate-700 shrink-0 bg-slate-800">
              <img
                src={
                  isSalesStaff
                    ? "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80"
                    : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80"
                }
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="hidden sm:block text-left">
              <p suppressHydrationWarning className="text-xs font-semibold text-slate-200 leading-tight">
                {isSalesStaff ? (effectiveName || "Rahul Sharma") : (effectiveName || "Super Admin")}
              </p>
              {isSalesStaff && (
                <p className="text-[10px] text-slate-400 leading-tight">
                  Sales Executive
                </p>
              )}
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* User Dropdown */}
          {userDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setUserDropdownOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#0b1426] border border-[#162544] shadow-2xl p-2 z-50 animate-slide-up">
                <div className="px-3 py-2 border-b border-[#142138] mb-1">
                  <p suppressHydrationWarning className="text-xs font-bold text-white truncate">
                    {effectiveName || "Super Admin"}
                  </p>
                  <p suppressHydrationWarning className="text-[10px] text-slate-400 truncate">
                    {effectiveEmail || "admin@nextdigital.com"}
                  </p>
                  <span className="inline-block mt-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-cyan-950/70 border border-cyan-500/40 text-cyan-300">
                    {isSalesStaff ? "SALES STAFF" : "SUPER ADMIN"}
                  </span>
                </div>

                {!isSalesStaff && (
                  <Link
                    href="/admin/settings"
                    onClick={() => setUserDropdownOpen(false)}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-300 hover:bg-[#121f38] hover:text-white transition-colors"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    <span>Platform Settings</span>
                  </Link>
                )}

                <button
                  onClick={() => {
                    setUserDropdownOpen(false);
                    logout();
                  }}
                  disabled={isLoading}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign out</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
