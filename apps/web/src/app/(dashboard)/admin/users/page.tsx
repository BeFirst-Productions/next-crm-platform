"use client";

import * as React from "react";
import Link from "next/link";
import {
  Users,
  UserCheck,
  UserX,
  UserPlus,
  Building2,
  Shield,
  Search,
  Filter,
  RotateCcw,
  Download,
  Calendar,
  Pencil,
  Trash2,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Plus,
  ChevronDown,
} from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { useToast } from "@/hooks/useToast";
import { CreateUserFormCard, PRESET_AVATARS } from "@/components/admin/CreateUserFormCard";

// ============================================================================
// TYPES
// ============================================================================

export type UserRole = "Admin" | "Sales Executive" | "Marketing Executive" | "Super Admin";
export type UserDepartment = "Administration" | "Sales" | "Marketing" | "Operations" | "IT" | "Finance";
export type UserStatus = "Active" | "Inactive";

export interface ManagedUser {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  department: UserDepartment;
  joiningDate: string;
  salesTarget: number;
  commissionRate: number;
  status: UserStatus;
  avatar: string;
}

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default function UserManagementPage() {
  const { toast } = useToast();
  const [users, setUsers] = React.useState<ManagedUser[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [dbStats, setDbStats] = React.useState<{
    total: number;
    active: number;
    inactive: number;
    newThisMonth: number;
    departmentCount: number;
    roleCount: number;
  } | null>(null);

  // Fetch users and metrics directly from the PostgreSQL Database via API
  const fetchUsersAndStats = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const [usersRes, statsRes] = await Promise.all([
        apiClient<any[]>("/users?limit=100"),
        apiClient<any>("/users/stats").catch(() => null),
      ]);

      if (usersRes?.data && Array.isArray(usersRes.data) && usersRes.data.length > 0) {
        const mapped: ManagedUser[] = usersRes.data.map((u: any) => {
          let roleName: UserRole = "Sales Executive";
          if (u.role === "SUPER_ADMIN") roleName = "Super Admin";
          else if (u.role === "ADMIN") roleName = "Admin";
          else if (u.role === "MARKETING_TEAM") roleName = "Marketing Executive";
          else if (u.role === "SALES_STAFF") roleName = "Sales Executive";

          let deptName: UserDepartment = "Sales";
          if (u.department?.name) {
            deptName = u.department.name as UserDepartment;
          } else if (u.settings?.department) {
            deptName = u.settings.department as UserDepartment;
          }

          let statusName: UserStatus = u.status === "ACTIVE" ? "Active" : "Inactive";
          let dateStr = "10 Jan 2025";
          if (u.joiningDate) {
            try {
              dateStr = new Date(u.joiningDate).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              });
            } catch {
              // keep fallback
            }
          }

          const empIndex = parseInt(u.employeeId?.replace(/\D/g, "") || "1", 10) || 1;
          const defaultPreset = PRESET_AVATARS[(empIndex - 1) % PRESET_AVATARS.length].svg;
          const avatar =
            u.settings?.avatar ||
            u.avatarUrl ||
            defaultPreset;

          return {
            id: u.id,
            employeeId: u.employeeId || `USR-${u.id.slice(0, 4)}`,
            name: u.name,
            email: u.email,
            phone: u.phone || "+971 50 000 0000",
            role: roleName,
            department: deptName,
            joiningDate: dateStr,
            salesTarget: u.salesTarget || 0,
            commissionRate: u.commissionPercentage || 0,
            status: statusName,
            avatar: avatar,
          };
        });

        setUsers(mapped);
      } else if (usersRes?.data && Array.isArray(usersRes.data)) {
        setUsers([]);
      }

      if (statsRes?.data) {
        setDbStats(statsRes.data);
      }
    } catch (err) {
      console.warn("Failed to load users from DB via API, keeping current state", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    try {
      localStorage.removeItem("next_crm_managed_users");
    } catch {
      // ignore
    }
    fetchUsersAndStats();
  }, [fetchUsersAndStats]);

  const [searchQuery, setSearchQuery] = React.useState("");
  const [roleFilter, setRoleFilter] = React.useState<string>("All Roles");
  const [departmentFilter, setDepartmentFilter] = React.useState<string>("All Departments");
  const [statusFilter, setStatusFilter] = React.useState<string>("All Status");

  // Pagination State
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);

  // Selection State
  const [selectedUserIds, setSelectedUserIds] = React.useState<string[]>([]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingUser, setEditingUser] = React.useState<ManagedUser | null>(null);

  // Delete Confirm State
  const [deleteConfirmUser, setDeleteConfirmUser] = React.useState<ManagedUser | null>(null);

  // Handle Filtering
  const filteredUsers = React.useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        !searchQuery ||
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.employeeId.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRole =
        roleFilter === "All Roles" || u.role === roleFilter;

      const matchesDepartment =
        departmentFilter === "All Departments" || u.department === departmentFilter;

      const matchesStatus =
        statusFilter === "All Status" || u.status === statusFilter;

      return matchesSearch && matchesRole && matchesDepartment && matchesStatus;
    });
  }, [users, searchQuery, roleFilter, departmentFilter, statusFilter]);

  // Derived Pagination
  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize));
  const paginatedUsers = React.useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredUsers.slice(start, start + pageSize);
  }, [filteredUsers, currentPage, pageSize]);

  // Select All on current page
  const allCurrentSelected =
    paginatedUsers.length > 0 &&
    paginatedUsers.every((u) => selectedUserIds.includes(u.id));

  const handleToggleSelectAll = () => {
    if (allCurrentSelected) {
      setSelectedUserIds((prev) =>
        prev.filter((id) => !paginatedUsers.some((u) => u.id === id))
      );
    } else {
      const pageIds = paginatedUsers.map((u) => u.id);
      setSelectedUserIds((prev) => Array.from(new Set([...prev, ...pageIds])));
    }
  };

  const handleToggleSelectRow = (id: string) => {
    setSelectedUserIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Open Edit Modal
  const openEditModal = (user: ManagedUser) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  // Delete User
  const handleDeleteUser = async (user: ManagedUser) => {
    try {
      await apiClient(`/users/${user.id}`, { method: "DELETE" });
      toast({
        type: "success",
        title: "User Deleted",
        description: `Successfully removed ${user.name} from database.`,
      });
      fetchUsersAndStats();
    } catch (err) {
      console.warn("Delete API notice:", err);
    }

    setUsers((prev) => prev.filter((u) => u.id !== user.id));
    setSelectedUserIds((prev) => prev.filter((id) => id !== user.id));
    setDeleteConfirmUser(null);
  };

  // Reset Filters / Refresh from DB
  const handleResetFilters = () => {
    setSearchQuery("");
    setRoleFilter("All Roles");
    setDepartmentFilter("All Departments");
    setStatusFilter("All Status");
    setCurrentPage(1);
    fetchUsersAndStats();
  };

  // Export to CSV
  const handleExportCSV = () => {
    const headers = [
      "Employee ID",
      "Name",
      "Email",
      "Phone",
      "Role",
      "Department",
      "Joining Date",
      "Sales Target",
      "Commission Rate",
      "Status",
    ];
    const rows = filteredUsers.map((u) => [
      u.employeeId,
      `"${u.name}"`,
      u.email,
      `"${u.phone}"`,
      `"${u.role}"`,
      `"${u.department}"`,
      `"${u.joiningDate}"`,
      u.salesTarget,
      `${u.commissionRate}%`,
      u.status,
    ]);
    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `next_crm_users_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Dynamic metrics from Database Stats
  const totalUsersCount = dbStats?.total ?? users.length;
  const activeUsersCount = dbStats?.active ?? users.filter((u) => u.status === "Active").length;
  const inactiveUsersCount = dbStats?.inactive ?? users.filter((u) => u.status === "Inactive").length;
  const newUsersThisMonth = dbStats?.newThisMonth ?? 32;
  const departmentsCount = dbStats?.departmentCount ?? 8;
  const rolesCount = dbStats?.roleCount ?? 4;
  const activePercentage = totalUsersCount > 0 ? ((activeUsersCount / totalUsersCount) * 100).toFixed(1) : "0";
  const inactivePercentage = totalUsersCount > 0 ? ((inactiveUsersCount / totalUsersCount) * 100).toFixed(1) : "0";

  return (
    <div className="space-y-4 text-slate-100 font-sans pb-10 select-none">
      {/* -------------------------------------------------------------------- */}
      {/* 1. BREADCRUMB & PAGE HEADER */}
      {/* -------------------------------------------------------------------- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            User Management
          </h1>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
            <Link
              href="/dashboard"
              className="hover:text-cyan-400 transition-colors"
            >
              Dashboard
            </Link>
            <span className="text-slate-600">&gt;</span>
            <span className="text-slate-300 font-medium">User Management</span>
          </div>
        </div>

        {/* Top-Right "+ Create User" Button */}
        <Link
          href="/admin/users/create"
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#00c0f0] hover:bg-[#00a6d1] text-white text-xs font-semibold shadow-[0_0_16px_rgba(0,192,240,0.35)] transition-all cursor-pointer self-start sm:self-auto shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create User</span>
        </Link>
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* 2. KPI METRICS CARDS (6 Grid Cards across) */}
      {/* -------------------------------------------------------------------- */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-3.5">
        {/* Total Users */}
        <div className="bg-[#0b1426] border border-[#162544] rounded-2xl p-4 flex flex-col justify-between shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-blue-600/25 border border-blue-500/40 text-blue-400 flex items-center justify-center shrink-0">
              <Users className="w-4 h-4" />
            </div>
            <span className="text-[12px] font-medium text-slate-300 truncate">
              Total Users
            </span>
          </div>
          <div className="mt-2.5">
            <p className="text-2xl font-bold text-white tracking-tight leading-none">
              {totalUsersCount}
            </p>
            <p className="text-[11px] font-semibold text-emerald-400 mt-1.5">
              ↑ 12.5% from last month
            </p>
          </div>
        </div>

        {/* Active Users */}
        <div className="bg-[#0b1426] border border-[#162544] rounded-2xl p-4 flex flex-col justify-between shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-500/25 border border-emerald-400/40 text-emerald-400 flex items-center justify-center shrink-0">
              <UserCheck className="w-4 h-4" />
            </div>
            <span className="text-[12px] font-medium text-slate-300 truncate">
              Active Users
            </span>
          </div>
          <div className="mt-2.5">
            <p className="text-2xl font-bold text-white tracking-tight leading-none">
              {activeUsersCount}
            </p>
            <p className="text-[11px] text-slate-400 mt-1.5">
              {activePercentage}% of total users
            </p>
          </div>
        </div>

        {/* Inactive Users */}
        <div className="bg-[#0b1426] border border-[#162544] rounded-2xl p-4 flex flex-col justify-between shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-amber-500/25 border border-amber-400/40 text-amber-400 flex items-center justify-center shrink-0">
              <UserX className="w-4 h-4" />
            </div>
            <span className="text-[12px] font-medium text-slate-300 truncate">
              Inactive Users
            </span>
          </div>
          <div className="mt-2.5">
            <p className="text-2xl font-bold text-white tracking-tight leading-none">
              {inactiveUsersCount}
            </p>
            <p className="text-[11px] text-slate-400 mt-1.5">
              {inactivePercentage}% of total users
            </p>
          </div>
        </div>

        {/* New Users (This Month) */}
        <div className="bg-[#0b1426] border border-[#162544] rounded-2xl p-4 flex flex-col justify-between shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-purple-600/25 border border-purple-500/40 text-purple-400 flex items-center justify-center shrink-0">
              <UserPlus className="w-4 h-4" />
            </div>
            <span className="text-[12px] font-medium text-slate-300 truncate">
              New Users (This Month)
            </span>
          </div>
          <div className="mt-2.5">
            <p className="text-2xl font-bold text-white tracking-tight leading-none">
              {newUsersThisMonth}
            </p>
            <p className="text-[11px] font-semibold text-emerald-400 mt-1.5">
              ↑ Active in CRM
            </p>
          </div>
        </div>

        {/* Departments */}
        <div className="bg-[#0b1426] border border-[#162544] rounded-2xl p-4 flex flex-col justify-between shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-cyan-500/25 border border-cyan-400/40 text-cyan-400 flex items-center justify-center shrink-0">
              <Building2 className="w-4 h-4" />
            </div>
            <span className="text-[12px] font-medium text-slate-300 truncate">
              Departments
            </span>
          </div>
          <div className="mt-2.5">
            <p className="text-2xl font-bold text-white tracking-tight leading-none">
              {departmentsCount}
            </p>
            <p className="text-[11px] text-slate-400 mt-1.5">
              Total Departments
            </p>
          </div>
        </div>

        {/* Roles */}
        <div className="bg-[#0b1426] border border-[#162544] rounded-2xl p-4 flex flex-col justify-between shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-pink-600/25 border border-pink-500/40 text-pink-400 flex items-center justify-center shrink-0">
              <Shield className="w-4 h-4" />
            </div>
            <span className="text-[12px] font-medium text-slate-300 truncate">
              Roles
            </span>
          </div>
          <div className="mt-2.5">
            <p className="text-2xl font-bold text-white tracking-tight leading-none">
              {rolesCount}
            </p>
            <p className="text-[11px] text-slate-400 mt-1.5">
              System Roles
            </p>
          </div>
        </div>
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* 3. SEARCH & FILTERS BAR */}
      {/* -------------------------------------------------------------------- */}
      <div className="bg-[#0b1426] border border-[#162544] rounded-2xl p-3.5 sm:p-4 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-end">
          {/* Search Field (4 cols) */}
          <div className="lg:col-span-4">
            <label className="block text-[11px] font-medium text-slate-400 mb-1.5">
              Search User
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search by name, email or phone..."
                className="w-full bg-[#0d182e] border border-[#1a2d52] focus:border-cyan-500/70 focus:ring-1 focus:ring-cyan-500/30 text-xs text-slate-200 placeholder:text-slate-500 rounded-xl px-3.5 py-2 pr-9 outline-none transition-all"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Role Filter (2 cols) */}
          <div className="lg:col-span-2">
            <label className="block text-[11px] font-medium text-slate-400 mb-1.5">
              Role
            </label>
            <div className="relative">
              <select
                value={roleFilter}
                onChange={(e) => {
                  setRoleFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full bg-[#0d182e] border border-[#1a2d52] focus:border-cyan-500/70 text-xs text-slate-200 rounded-xl px-3 py-2 appearance-none outline-none cursor-pointer pr-8"
              >
                <option value="All Roles">All Roles</option>
                <option value="Admin">Admin</option>
                <option value="Sales Executive">Sales Executive</option>
                <option value="Marketing Executive">Marketing Executive</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Department Filter (2 cols) */}
          <div className="lg:col-span-2">
            <label className="block text-[11px] font-medium text-slate-400 mb-1.5">
              Department
            </label>
            <div className="relative">
              <select
                value={departmentFilter}
                onChange={(e) => {
                  setDepartmentFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full bg-[#0d182e] border border-[#1a2d52] focus:border-cyan-500/70 text-xs text-slate-200 rounded-xl px-3 py-2 appearance-none outline-none cursor-pointer pr-8"
              >
                <option value="All Departments">All Departments</option>
                <option value="Administration">Administration</option>
                <option value="Sales">Sales</option>
                <option value="Marketing">Marketing</option>
                <option value="Operations">Operations</option>
                <option value="IT">IT</option>
                <option value="Finance">Finance</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Status Filter (2 cols) */}
          <div className="lg:col-span-2">
            <label className="block text-[11px] font-medium text-slate-400 mb-1.5">
              Status
            </label>
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full bg-[#0d182e] border border-[#1a2d52] focus:border-cyan-500/70 text-xs text-slate-200 rounded-xl px-3 py-2 appearance-none outline-none cursor-pointer pr-8"
              >
                <option value="All Status">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Action Buttons: Filter & Reset (2 cols) */}
          <div className="lg:col-span-2 flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(1)}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/10 text-xs font-semibold transition-all cursor-pointer"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Filter</span>
            </button>
            <button
              onClick={handleResetFilters}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-slate-700 hover:border-slate-600 text-slate-300 hover:bg-slate-800/60 text-xs font-medium transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* 4. TABLE CONTROLS & TABLE CARD */}
      {/* -------------------------------------------------------------------- */}
      <div className="bg-[#0b1426] border border-[#162544] rounded-2xl shadow-sm overflow-hidden">
        {/* Controls Bar: Show entries & Export */}
        <div className="p-3.5 sm:p-4 border-b border-[#14233f] flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Show</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-[#0d182e] border border-[#1a2d52] text-xs text-slate-200 rounded-lg px-2 py-1 outline-none cursor-pointer"
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
            <span>entries</span>
          </div>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0d182e] border border-[#1a2d52] hover:border-slate-600 text-xs text-slate-300 hover:text-white transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Export</span>
          </button>
        </div>

        {/* User Directory Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#14233f] bg-[#091122]/60 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <th className="py-3 px-3.5 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={allCurrentSelected}
                    onChange={handleToggleSelectAll}
                    className="rounded bg-[#0d182e] border-[#1a2d52] text-cyan-500 focus:ring-0 cursor-pointer"
                  />
                </th>
                <th className="py-3 px-3.5">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-slate-200">
                    <span>USER</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  </div>
                </th>
                <th className="py-3 px-3.5">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-slate-200">
                    <span>EMAIL</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  </div>
                </th>
                <th className="py-3 px-3.5">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-slate-200">
                    <span>PHONE</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  </div>
                </th>
                <th className="py-3 px-3.5">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-slate-200">
                    <span>ROLE</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  </div>
                </th>
                <th className="py-3 px-3.5">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-slate-200">
                    <span>DEPARTMENT</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  </div>
                </th>
                <th className="py-3 px-3.5">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-slate-200">
                    <span>JOINING DATE</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  </div>
                </th>
                <th className="py-3 px-3.5">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-slate-200">
                    <span>SALES TARGET</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  </div>
                </th>
                <th className="py-3 px-3.5">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-slate-200">
                    <span>COMMISSION %</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  </div>
                </th>
                <th className="py-3 px-3.5">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-slate-200">
                    <span>STATUS</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  </div>
                </th>
                <th className="py-3 px-3.5 text-center">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#131f38]">
              {isLoading ? (
                <tr>
                  <td colSpan={11} className="py-14 text-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                      <span className="text-xs text-slate-400">Loading users from database...</span>
                    </div>
                  </td>
                </tr>
              ) : paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-slate-400">
                    No users match your criteria. Try resetting the filters.
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((user) => {
                  const isSelected = selectedUserIds.includes(user.id);

                  // Role badge styling
                  let roleBadgeStyle = "bg-cyan-950/70 border-cyan-500/40 text-cyan-300";
                  if (user.role === "Sales Executive") {
                    roleBadgeStyle = "bg-blue-950/70 border-blue-500/40 text-blue-300";
                  } else if (user.role === "Marketing Executive") {
                    roleBadgeStyle = "bg-purple-950/70 border-purple-500/40 text-purple-300";
                  }

                  return (
                    <tr
                      key={user.id}
                      className={`hover:bg-[#0f1d38]/60 transition-colors group ${
                        isSelected ? "bg-[#0c1f3d]/40" : ""
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-3 px-3.5 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelectRow(user.id)}
                          className="rounded bg-[#0d182e] border-[#1a2d52] text-cyan-500 focus:ring-0 cursor-pointer"
                        />
                      </td>

                      {/* User Info (Avatar, Name, Employee ID) */}
                      <td className="py-3 px-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-700 shrink-0 bg-slate-800">
                            <img
                              src={user.avatar}
                              alt={user.name}
                              onError={(e) => {
                                e.currentTarget.src = PRESET_AVATARS[0].svg;
                              }}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-semibold text-white leading-tight">
                              {user.name}
                            </p>
                            <p className="text-[10px] text-slate-400 font-mono mt-0.5 leading-tight">
                              {user.employeeId}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="py-3 px-3.5 text-slate-300 font-mono text-[11px]">
                        {user.email}
                      </td>

                      {/* Phone */}
                      <td className="py-3 px-3.5 text-slate-300 whitespace-nowrap">
                        {user.phone}
                      </td>

                      {/* Role Badge */}
                      <td className="py-3 px-3.5 whitespace-nowrap">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${roleBadgeStyle}`}
                        >
                          {user.role}
                        </span>
                      </td>

                      {/* Department */}
                      <td className="py-3 px-3.5 text-slate-300 whitespace-nowrap">
                        {user.department}
                      </td>

                      {/* Joining Date */}
                      <td className="py-3 px-3.5 text-slate-300 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-500" />
                          <span>{user.joiningDate}</span>
                        </div>
                      </td>

                      {/* Sales Target */}
                      <td className="py-3 px-3.5 text-slate-200 font-medium whitespace-nowrap">
                        {user.salesTarget > 0
                          ? `AED ${user.salesTarget.toLocaleString()}`
                          : "AED 0"}
                      </td>

                      {/* Commission % */}
                      <td className="py-3 px-3.5 text-slate-300 whitespace-nowrap">
                        {user.commissionRate}%
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3.5 whitespace-nowrap">
                        {user.status === "Active" ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border bg-[#062c20] text-emerald-400 border-emerald-500/30">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border bg-[#2d1117] text-rose-400 border-rose-500/30">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                            Inactive
                          </span>
                        )}
                      </td>

                      {/* Action Buttons */}
                      <td className="py-3 px-3.5 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Edit Button */}
                          <button
                            onClick={() => openEditModal(user)}
                            className="w-7 h-7 rounded-lg border border-blue-500/40 bg-blue-950/40 hover:bg-blue-600 text-blue-400 hover:text-white transition-all flex items-center justify-center"
                            title="Edit User"
                            aria-label={`Edit ${user.name}`}
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={() => setDeleteConfirmUser(user)}
                            className="w-7 h-7 rounded-lg border border-rose-500/40 bg-rose-950/40 hover:bg-rose-600 text-rose-400 hover:text-white transition-all flex items-center justify-center"
                            title="Delete User"
                            aria-label={`Delete ${user.name}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* PAGINATION FOOTER */}
        {/* ------------------------------------------------------------------ */}
        <div className="p-3.5 sm:p-4 border-t border-[#14233f] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div>
            Showing{" "}
            <span className="font-semibold text-slate-200">
              {filteredUsers.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}
            </span>{" "}
            to{" "}
            <span className="font-semibold text-slate-200">
              {Math.min(currentPage * pageSize, filteredUsers.length)}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-slate-200">
              {filteredUsers.length}
            </span>{" "}
            entries
          </div>

          <div className="flex items-center gap-1">
            {/* Previous Page */}
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-7 h-7 rounded-lg border border-[#1a2d52] bg-[#0d182e] hover:bg-[#142647] disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center text-slate-300 transition-colors"
              aria-label="Previous Page"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            {/* Page Number Buttons */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`w-7 h-7 rounded-lg text-xs font-semibold transition-all ${
                  currentPage === pageNum
                    ? "bg-blue-600 text-white shadow-sm"
                    : "border border-[#1a2d52] bg-[#0d182e] text-slate-300 hover:bg-[#142647]"
                }`}
              >
                {pageNum}
              </button>
            ))}

            {/* Next Page */}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="w-7 h-7 rounded-lg border border-[#1a2d52] bg-[#0d182e] hover:bg-[#142647] disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center text-slate-300 transition-colors"
              aria-label="Next Page"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* 5. EDIT USER MODAL (Rich Midnight-Dark Card Form) */}
      {/* -------------------------------------------------------------------- */}
      {isModalOpen && editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-fade-in overflow-y-auto">
          <div className="w-full max-w-5xl my-auto animate-slide-up">
            <CreateUserFormCard
              mode="edit"
              initialUser={editingUser}
              isModal={true}
              onClose={() => {
                setIsModalOpen(false);
                setEditingUser(null);
              }}
              onSuccess={() => {
                setIsModalOpen(false);
                setEditingUser(null);
                fetchUsersAndStats();
              }}
            />
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* 6. DELETE CONFIRMATION MODAL */}
      {/* -------------------------------------------------------------------- */}
      {deleteConfirmUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0b1426] border border-[#162544] rounded-2xl w-full max-w-sm p-5 shadow-2xl space-y-4 animate-slide-up text-center">
            <div className="w-12 h-12 rounded-full bg-rose-600/20 border border-rose-500/40 text-rose-400 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">Delete User</h4>
              <p className="text-xs text-slate-400 mt-1">
                Are you sure you want to remove{" "}
                <span className="text-white font-semibold">
                  {deleteConfirmUser.name}
                </span>{" "}
                ({deleteConfirmUser.employeeId})? This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center justify-center gap-2.5 pt-2">
              <button
                onClick={() => setDeleteConfirmUser(null)}
                className="flex-1 px-4 py-2 rounded-xl border border-slate-700 hover:bg-slate-800 text-xs font-medium text-slate-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteUser(deleteConfirmUser)}
                className="flex-1 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-[0_0_12px_rgba(244,63,94,0.4)] transition-all cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
