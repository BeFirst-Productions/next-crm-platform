"use client";

import * as React from "react";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { useAuth } from "@/hooks/useAuth";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const { user, isAuthenticated, isLoggingOut } = useAuth();

  // If user is signing out or has no active session, render full-screen transition without sidebar/header
  if (isLoggingOut || (!isAuthenticated && !user)) {
    return (
      <div className="fixed inset-0 z-50 bg-[#070d18] flex flex-col items-center justify-center gap-4 animate-fade-in select-none">
        <div className="flex flex-col items-center gap-3">
          <img
            src="/logo.svg"
            alt="Next CRM"
            className="h-10 w-auto object-contain opacity-90 animate-pulse"
          />
          <div className="flex items-center gap-2.5 mt-2 bg-[#0b1527] border border-[#172744] px-4 py-2 rounded-full shadow-lg">
            <div className="w-4 h-4 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
            <span className="text-xs font-medium text-slate-300 tracking-wide">
              Signing out...
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070d18] text-slate-100 flex flex-col lg:flex-row">
      {/* Sidebar (Desktop fixed / Mobile drawer) */}
      <DashboardSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        <DashboardHeader
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        <main className="flex-1 p-3 sm:p-4 lg:p-5 w-full max-w-[1920px] mx-auto min-w-0">
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
}
