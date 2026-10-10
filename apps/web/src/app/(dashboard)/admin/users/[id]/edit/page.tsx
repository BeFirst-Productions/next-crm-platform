"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { CreateUserFormCard, InitialUserFormValues } from "@/components/admin/CreateUserFormCard";
import { apiClient } from "@/lib/api-client";

export default function EditUserPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params?.id as string;

  const [user, setUser] = React.useState<InitialUserFormValues | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!userId) return;

    setIsLoading(true);
    apiClient<any>(`/users/${userId}`)
      .then((res) => {
        if (res?.data) {
          const u = res.data;
          let roleName = "Sales Executive";
          if (u.role === "SUPER_ADMIN") roleName = "Super Admin";
          else if (u.role === "ADMIN") roleName = "Admin";
          else if (u.role === "MARKETING_TEAM") roleName = "Marketing Executive";

          let deptName = "Sales";
          if (u.department?.name) {
            deptName = u.department.name;
          } else if (u.settings?.department) {
            deptName = u.settings.department;
          }

          const statusName = u.status === "ACTIVE" ? "Active" : u.status === "SUSPENDED" ? "Suspended" : "Inactive";
          const avatarUrl = u.settings?.avatar || u.avatar || "";

          setUser({
            id: u.id,
            employeeId: u.settings?.employeeId || `USR-${u.id.substring(0, 4).toUpperCase()}`,
            name: u.name,
            email: u.email,
            phone: u.phone || "+971 50 ",
            role: roleName,
            department: deptName,
            status: statusName,
            avatar: avatarUrl,
            salesTarget: u.salesTarget || 0,
            commissionRate: u.commissionPercentage || 0,
          });
        }
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Failed to load user profile");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [userId]);

  return (
    <div className="space-y-5 text-slate-100 font-sans pb-12 select-none max-w-[1400px] mx-auto animate-fade-in">
      {/* -------------------------------------------------------------------- */}
      {/* 1. TOP HEADER & BREADCRUMB */}
      {/* -------------------------------------------------------------------- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Edit User Profile
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
            <span className="text-[#00c0f0] font-medium">Edit User</span>
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
      {/* 2. MAIN USER EDIT CARD CONTAINER */}
      {/* -------------------------------------------------------------------- */}
      {isLoading ? (
        <div className="w-full h-80 rounded-3xl bg-[#07101f] border border-[#14233e] flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-[#00c0f0] animate-spin" />
          <p className="text-xs text-slate-400">Loading user profile details...</p>
        </div>
      ) : error ? (
        <div className="w-full p-8 rounded-3xl bg-[#07101f] border border-rose-500/30 text-center space-y-3">
          <p className="text-sm text-rose-400 font-semibold">{error}</p>
          <button
            onClick={() => router.push("/admin/users")}
            className="px-4 py-2 rounded-xl bg-[#0d1c33] text-xs text-slate-300 hover:text-white"
          >
            Return to User Management
          </button>
        </div>
      ) : user ? (
        <CreateUserFormCard
          mode="edit"
          initialUser={user}
          onSuccess={() => router.push("/admin/users")}
        />
      ) : null}
    </div>
  );
}
