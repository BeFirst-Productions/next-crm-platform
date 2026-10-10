"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CreateUserFormCard } from "@/components/admin/CreateUserFormCard";

export default function CreateUserPage() {
  return (
    <div className="space-y-5 text-slate-100 font-sans pb-12 select-none max-w-[1400px] mx-auto animate-fade-in">
      {/* -------------------------------------------------------------------- */}
      {/* 1. TOP HEADER & BREADCRUMB (Matching Reference Screenshot) */}
      {/* -------------------------------------------------------------------- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Create New User
          </h1>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
            <Link
              href="/dashboard"
              className="hover:text-cyan-400 transition-colors"
            >
              Dashboard
            </Link>
            <span className="text-slate-600">&gt;</span>
            <Link
              href="/admin/users"
              className="hover:text-cyan-400 transition-colors"
            >
              User Management
            </Link>
            <span className="text-slate-600">&gt;</span>
            <span className="text-[#00c0f0] font-medium">Create User</span>
          </div>
        </div>

        {/* Top-Right "← Back to List" Button */}
        <Link
          href="/admin/users"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#091427] hover:bg-[#0f213e] text-slate-300 hover:text-white border border-[#142646] text-xs font-semibold shadow-sm transition-all cursor-pointer self-start sm:self-auto shrink-0"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to List</span>
        </Link>
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* 2. MAIN USER CREATION CARD CONTAINER */}
      {/* -------------------------------------------------------------------- */}
      <CreateUserFormCard />
    </div>
  );
}
