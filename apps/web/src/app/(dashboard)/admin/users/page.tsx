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
  X,
  ChevronDown,
} from "lucide-react";

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
// INITIAL SEED DATA (32 Users matching the reference screenshot exactly)
// ============================================================================

const SEED_USERS: ManagedUser[] = [
  {
    id: "1",
    employeeId: "USR-1001",
    name: "Ahmed Khan",
    email: "ahmed.khan@next.com",
    phone: "+971 50 123 4567",
    role: "Admin",
    department: "Administration",
    joiningDate: "10 Jan 2025",
    salesTarget: 0,
    commissionRate: 0,
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80",
  },
  {
    id: "2",
    employeeId: "USR-1002",
    name: "Rahul Sharma",
    email: "rahul.sharma@next.com",
    phone: "+971 55 987 6543",
    role: "Sales Executive",
    department: "Sales",
    joiningDate: "15 Feb 2025",
    salesTarget: 50000,
    commissionRate: 10,
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80",
  },
  {
    id: "3",
    employeeId: "USR-1003",
    name: "Fatima Ali",
    email: "fatima.ali@next.com",
    phone: "+971 52 456 7890",
    role: "Sales Executive",
    department: "Sales",
    joiningDate: "20 Feb 2025",
    salesTarget: 45000,
    commissionRate: 8,
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&h=120&q=80",
  },
  {
    id: "4",
    employeeId: "USR-1004",
    name: "Jason D'souza",
    email: "jason.dsouza@next.com",
    phone: "+971 54 321 6789",
    role: "Marketing Executive",
    department: "Marketing",
    joiningDate: "05 Mar 2025",
    salesTarget: 30000,
    commissionRate: 7,
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80",
  },
  {
    id: "5",
    employeeId: "USR-1005",
    name: "Neha Patel",
    email: "neha.patel@next.com",
    phone: "+971 58 654 1237",
    role: "Marketing Executive",
    department: "Marketing",
    joiningDate: "12 Mar 2025",
    salesTarget: 32000,
    commissionRate: 7,
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&h=120&q=80",
  },
  {
    id: "6",
    employeeId: "USR-1006",
    name: "Vikram Singh",
    email: "vikram.singh@next.com",
    phone: "+971 56 789 4561",
    role: "Sales Executive",
    department: "Sales",
    joiningDate: "18 Mar 2025",
    salesTarget: 40000,
    commissionRate: 8,
    status: "Inactive",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=120&h=120&q=80",
  },
  {
    id: "7",
    employeeId: "USR-1007",
    name: "Priya Nair",
    email: "priya.nair@next.com",
    phone: "+971 55 147 2580",
    role: "Marketing Executive",
    department: "Marketing",
    joiningDate: "25 Mar 2025",
    salesTarget: 28000,
    commissionRate: 6,
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&h=120&q=80",
  },
  {
    id: "8",
    employeeId: "USR-1008",
    name: "Arjun Mehta",
    email: "arjun.mehta@next.com",
    phone: "+971 50 369 8521",
    role: "Sales Executive",
    department: "Sales",
    joiningDate: "02 Apr 2025",
    salesTarget: 35000,
    commissionRate: 7,
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&h=120&q=80",
  },
  {
    id: "9",
    employeeId: "USR-1009",
    name: "Sneha Verma",
    email: "sneha.verma@next.com",
    phone: "+971 52 741 9630",
    role: "Marketing Executive",
    department: "Marketing",
    joiningDate: "10 Apr 2025",
    salesTarget: 25000,
    commissionRate: 6,
    status: "Inactive",
    avatar: "https://images.unsplash.com/photo-1534751516642-a171ed292022?auto=format&fit=crop&w=120&h=120&q=80",
  },
  {
    id: "10",
    employeeId: "USR-1010",
    name: "Daniel George",
    email: "daniel.george@next.com",
    phone: "+971 54 852 7410",
    role: "Admin",
    department: "Administration",
    joiningDate: "20 Apr 2025",
    salesTarget: 0,
    commissionRate: 0,
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&h=120&q=80",
  },
  // Additional entries to support 32 total records across 4 pages
  {
    id: "11",
    employeeId: "USR-1011",
    name: "Kareem Zaid",
    email: "kareem.zaid@next.com",
    phone: "+971 50 998 1122",
    role: "Sales Executive",
    department: "Sales",
    joiningDate: "28 Apr 2025",
    salesTarget: 48000,
    commissionRate: 9,
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80",
  },
  {
    id: "12",
    employeeId: "USR-1012",
    name: "Layla Mansour",
    email: "layla.mansour@next.com",
    phone: "+971 55 334 5566",
    role: "Marketing Executive",
    department: "Marketing",
    joiningDate: "04 May 2025",
    salesTarget: 31000,
    commissionRate: 7,
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&h=120&q=80",
  },
  {
    id: "13",
    employeeId: "USR-1013",
    name: "Tariq Mahmoud",
    email: "tariq.mahmoud@next.com",
    phone: "+971 52 778 9900",
    role: "Admin",
    department: "Operations",
    joiningDate: "12 May 2025",
    salesTarget: 0,
    commissionRate: 0,
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=120&h=120&q=80",
  },
  {
    id: "14",
    employeeId: "USR-1014",
    name: "Reem Al Hashimi",
    email: "reem.hashimi@next.com",
    phone: "+971 58 112 3344",
    role: "Sales Executive",
    department: "Sales",
    joiningDate: "18 May 2025",
    salesTarget: 52000,
    commissionRate: 10,
    status: "Inactive",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&h=120&q=80",
  },
  {
    id: "15",
    employeeId: "USR-1015",
    name: "Hassan Qureshi",
    email: "hassan.qureshi@next.com",
    phone: "+971 54 445 6677",
    role: "Sales Executive",
    department: "Sales",
    joiningDate: "25 May 2025",
    salesTarget: 42000,
    commissionRate: 8,
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80",
  },
  {
    id: "16",
    employeeId: "USR-1016",
    name: "Nour Al Kaabi",
    email: "nour.kaabi@next.com",
    phone: "+971 50 667 8899",
    role: "Marketing Executive",
    department: "Marketing",
    joiningDate: "01 Jun 2025",
    salesTarget: 29000,
    commissionRate: 6,
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&h=120&q=80",
  },
  {
    id: "17",
    employeeId: "USR-1017",
    name: "Bilal Farooq",
    email: "bilal.farooq@next.com",
    phone: "+971 55 889 0011",
    role: "Admin",
    department: "Finance",
    joiningDate: "10 Jun 2025",
    salesTarget: 0,
    commissionRate: 0,
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&h=120&q=80",
  },
  {
    id: "18",
    employeeId: "USR-1018",
    name: "Zainab Rashid",
    email: "zainab.rashid@next.com",
    phone: "+971 52 223 4455",
    role: "Sales Executive",
    department: "Sales",
    joiningDate: "16 Jun 2025",
    salesTarget: 46000,
    commissionRate: 8,
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80",
  },
  {
    id: "19",
    employeeId: "USR-1019",
    name: "Omar Bakir",
    email: "omar.bakir@next.com",
    phone: "+971 56 332 1144",
    role: "Marketing Executive",
    department: "Marketing",
    joiningDate: "22 Jun 2025",
    salesTarget: 27000,
    commissionRate: 6,
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&h=120&q=80",
  },
  {
    id: "20",
    employeeId: "USR-1020",
    name: "Maya Haddad",
    email: "maya.haddad@next.com",
    phone: "+971 50 776 5544",
    role: "Sales Executive",
    department: "Sales",
    joiningDate: "30 Jun 2025",
    salesTarget: 39000,
    commissionRate: 7,
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&h=120&q=80",
  },
  {
    id: "21",
    employeeId: "USR-1021",
    name: "Farhan Saeed",
    email: "farhan.saeed@next.com",
    phone: "+971 55 443 2211",
    role: "Admin",
    department: "IT",
    joiningDate: "05 Jul 2025",
    salesTarget: 0,
    commissionRate: 0,
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=120&h=120&q=80",
  },
  {
    id: "22",
    employeeId: "USR-1022",
    name: "Sana Mir",
    email: "sana.mir@next.com",
    phone: "+971 52 998 7766",
    role: "Marketing Executive",
    department: "Marketing",
    joiningDate: "14 Jul 2025",
    salesTarget: 34000,
    commissionRate: 7,
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&h=120&q=80",
  },
  {
    id: "23",
    employeeId: "USR-1023",
    name: "Hamza Tariq",
    email: "hamza.tariq@next.com",
    phone: "+971 58 554 3322",
    role: "Sales Executive",
    department: "Sales",
    joiningDate: "20 Jul 2025",
    salesTarget: 41000,
    commissionRate: 8,
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80",
  },
  {
    id: "24",
    employeeId: "USR-1024",
    name: "Dalia Fawzi",
    email: "dalia.fawzi@next.com",
    phone: "+971 54 667 8811",
    role: "Sales Executive",
    department: "Sales",
    joiningDate: "29 Jul 2025",
    salesTarget: 37000,
    commissionRate: 7,
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&h=120&q=80",
  },
  {
    id: "25",
    employeeId: "USR-1025",
    name: "Youssef Nader",
    email: "youssef.nader@next.com",
    phone: "+971 50 112 2334",
    role: "Marketing Executive",
    department: "Marketing",
    joiningDate: "05 Aug 2025",
    salesTarget: 26000,
    commissionRate: 6,
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80",
  },
  {
    id: "26",
    employeeId: "USR-1026",
    name: "Salma Idris",
    email: "salma.idris@next.com",
    phone: "+971 55 667 7889",
    role: "Admin",
    department: "Operations",
    joiningDate: "12 Aug 2025",
    salesTarget: 0,
    commissionRate: 0,
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1534751516642-a171ed292022?auto=format&fit=crop&w=120&h=120&q=80",
  },
  {
    id: "27",
    employeeId: "USR-1027",
    name: "Rami Khoury",
    email: "rami.khoury@next.com",
    phone: "+971 52 334 4556",
    role: "Sales Executive",
    department: "Sales",
    joiningDate: "19 Aug 2025",
    salesTarget: 44000,
    commissionRate: 8,
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&h=120&q=80",
  },
  {
    id: "28",
    employeeId: "USR-1028",
    name: "Mona Salem",
    email: "mona.salem@next.com",
    phone: "+971 56 778 8990",
    role: "Marketing Executive",
    department: "Marketing",
    joiningDate: "27 Aug 2025",
    salesTarget: 33000,
    commissionRate: 7,
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&h=120&q=80",
  },
  {
    id: "29",
    employeeId: "USR-1029",
    name: "Mustafa Kamal",
    email: "mustafa.kamal@next.com",
    phone: "+971 50 889 9001",
    role: "Sales Executive",
    department: "Sales",
    joiningDate: "03 Sep 2025",
    salesTarget: 49000,
    commissionRate: 9,
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80",
  },
  {
    id: "30",
    employeeId: "USR-1030",
    name: "Hala Ghassan",
    email: "hala.ghassan@next.com",
    phone: "+971 55 223 3445",
    role: "Admin",
    department: "Administration",
    joiningDate: "10 Sep 2025",
    salesTarget: 0,
    commissionRate: 0,
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&h=120&q=80",
  },
  {
    id: "31",
    employeeId: "USR-1031",
    name: "Zayd Othman",
    email: "zayd.othman@next.com",
    phone: "+971 52 445 5667",
    role: "Sales Executive",
    department: "Sales",
    joiningDate: "18 Sep 2025",
    salesTarget: 43000,
    commissionRate: 8,
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=120&h=120&q=80",
  },
  {
    id: "32",
    employeeId: "USR-1032",
    name: "Khadija Nour",
    email: "khadija.nour@next.com",
    phone: "+971 54 778 8992",
    role: "Marketing Executive",
    department: "Marketing",
    joiningDate: "26 Sep 2025",
    salesTarget: 30000,
    commissionRate: 7,
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80",
  },
];

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default function UserManagementPage() {
  const [users, setUsers] = React.useState<ManagedUser[]>(SEED_USERS);
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
  const [modalMode, setModalMode] = React.useState<"create" | "edit">("create");
  const [editingUser, setEditingUser] = React.useState<ManagedUser | null>(null);

  // Delete Confirm State
  const [deleteConfirmUser, setDeleteConfirmUser] = React.useState<ManagedUser | null>(null);

  // Modal Form Inputs
  const [formName, setFormName] = React.useState("");
  const [formEmail, setFormEmail] = React.useState("");
  const [formPhone, setFormPhone] = React.useState("");
  const [formRole, setFormRole] = React.useState<UserRole>("Sales Executive");
  const [formDepartment, setFormDepartment] = React.useState<UserDepartment>("Sales");
  const [formJoiningDate, setFormJoiningDate] = React.useState("01 Oct 2025");
  const [formSalesTarget, setFormSalesTarget] = React.useState("40000");
  const [formCommissionRate, setFormCommissionRate] = React.useState("8");
  const [formStatus, setFormStatus] = React.useState<UserStatus>("Active");

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

  // Open Create Modal
  const openCreateModal = () => {
    setModalMode("create");
    setEditingUser(null);
    setFormName("");
    setFormEmail("");
    setFormPhone("+971 50 ");
    setFormRole("Sales Executive");
    setFormDepartment("Sales");
    setFormJoiningDate(new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }));
    setFormSalesTarget("40000");
    setFormCommissionRate("8");
    setFormStatus("Active");
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (user: ManagedUser) => {
    setModalMode("edit");
    setEditingUser(user);
    setFormName(user.name);
    setFormEmail(user.email);
    setFormPhone(user.phone);
    setFormRole(user.role);
    setFormDepartment(user.department);
    setFormJoiningDate(user.joiningDate);
    setFormSalesTarget(user.salesTarget.toString());
    setFormCommissionRate(user.commissionRate.toString());
    setFormStatus(user.status);
    setIsModalOpen(true);
  };

  // Submit Modal
  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formEmail.trim()) return;

    if (modalMode === "create") {
      const nextId = (users.length + 1).toString();
      const nextEmpNum = 1000 + users.length + 1;
      const newUser: ManagedUser = {
        id: nextId,
        employeeId: `USR-${nextEmpNum}`,
        name: formName.trim(),
        email: formEmail.trim(),
        phone: formPhone.trim() || "+971 50 000 0000",
        role: formRole,
        department: formDepartment,
        joiningDate: formJoiningDate,
        salesTarget: Number(formSalesTarget) || 0,
        commissionRate: Number(formCommissionRate) || 0,
        status: formStatus,
        avatar: `https://images.unsplash.com/photo-${1534528741775 + Number(nextId)}?auto=format&fit=crop&w=120&h=120&q=80`,
      };
      setUsers([newUser, ...users]);
    } else if (editingUser) {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === editingUser.id
            ? {
                ...u,
                name: formName.trim(),
                email: formEmail.trim(),
                phone: formPhone.trim(),
                role: formRole,
                department: formDepartment,
                joiningDate: formJoiningDate,
                salesTarget: Number(formSalesTarget) || 0,
                commissionRate: Number(formCommissionRate) || 0,
                status: formStatus,
              }
            : u
        )
      );
    }
    setIsModalOpen(false);
  };

  // Delete User
  const handleDeleteUser = (user: ManagedUser) => {
    setUsers((prev) => prev.filter((u) => u.id !== user.id));
    setSelectedUserIds((prev) => prev.filter((id) => id !== user.id));
    setDeleteConfirmUser(null);
  };

  // Reset Filters
  const handleResetFilters = () => {
    setSearchQuery("");
    setRoleFilter("All Roles");
    setDepartmentFilter("All Departments");
    setStatusFilter("All Status");
    setCurrentPage(1);
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

  // Metrics summary matching reference design
  const totalUsersCount = 32;
  const activeUsersCount = 28;
  const inactiveUsersCount = 3;
  const activePercentage = "87.5";
  const inactivePercentage = "9.4";

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
        <button
          onClick={openCreateModal}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#00c0f0] hover:bg-[#00a6d1] text-white text-xs font-semibold shadow-[0_0_16px_rgba(0,192,240,0.35)] transition-all cursor-pointer self-start sm:self-auto shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create User</span>
        </button>
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
              5
            </p>
            <p className="text-[11px] font-semibold text-emerald-400 mt-1.5">
              ↑ 25% from last month
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
              6
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
              4
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
              {paginatedUsers.length === 0 ? (
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
      {/* 5. CREATE / EDIT USER MODAL */}
      {/* -------------------------------------------------------------------- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0b1426] border border-[#162544] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-slide-up">
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-[#14233f] flex items-center justify-between">
              <h3 className="text-base font-bold text-white">
                {modalMode === "create" ? "Create New User" : `Edit User — ${editingUser?.employeeId}`}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveUser} className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Tariq Mansoor"
                    className="w-full bg-[#0d182e] border border-[#1a2d52] focus:border-cyan-500 text-xs text-white rounded-xl px-3 py-2 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="e.g. user@next.com"
                    className="w-full bg-[#0d182e] border border-[#1a2d52] focus:border-cyan-500 text-xs text-white rounded-xl px-3 py-2 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    placeholder="+971 50 123 4567"
                    className="w-full bg-[#0d182e] border border-[#1a2d52] focus:border-cyan-500 text-xs text-white rounded-xl px-3 py-2 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">
                    Role
                  </label>
                  <select
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value as UserRole)}
                    className="w-full bg-[#0d182e] border border-[#1a2d52] focus:border-cyan-500 text-xs text-white rounded-xl px-3 py-2 outline-none cursor-pointer"
                  >
                    <option value="Admin">Admin</option>
                    <option value="Sales Executive">Sales Executive</option>
                    <option value="Marketing Executive">Marketing Executive</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">
                    Department
                  </label>
                  <select
                    value={formDepartment}
                    onChange={(e) => setFormDepartment(e.target.value as UserDepartment)}
                    className="w-full bg-[#0d182e] border border-[#1a2d52] focus:border-cyan-500 text-xs text-white rounded-xl px-3 py-2 outline-none cursor-pointer"
                  >
                    <option value="Administration">Administration</option>
                    <option value="Sales">Sales</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Operations">Operations</option>
                    <option value="IT">IT</option>
                    <option value="Finance">Finance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">
                    Joining Date
                  </label>
                  <input
                    type="text"
                    value={formJoiningDate}
                    onChange={(e) => setFormJoiningDate(e.target.value)}
                    placeholder="e.g. 15 Oct 2025"
                    className="w-full bg-[#0d182e] border border-[#1a2d52] focus:border-cyan-500 text-xs text-white rounded-xl px-3 py-2 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">
                    Sales Target (AED)
                  </label>
                  <input
                    type="number"
                    value={formSalesTarget}
                    onChange={(e) => setFormSalesTarget(e.target.value)}
                    placeholder="40000"
                    className="w-full bg-[#0d182e] border border-[#1a2d52] focus:border-cyan-500 text-xs text-white rounded-xl px-3 py-2 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">
                    Commission Rate (%)
                  </label>
                  <input
                    type="number"
                    value={formCommissionRate}
                    onChange={(e) => setFormCommissionRate(e.target.value)}
                    placeholder="8"
                    className="w-full bg-[#0d182e] border border-[#1a2d52] focus:border-cyan-500 text-xs text-white rounded-xl px-3 py-2 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">
                  Status
                </label>
                <div className="flex items-center gap-4 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-200">
                    <input
                      type="radio"
                      name="status"
                      checked={formStatus === "Active"}
                      onChange={() => setFormStatus("Active")}
                      className="text-cyan-500 focus:ring-0"
                    />
                    <span>Active</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-200">
                    <input
                      type="radio"
                      name="status"
                      checked={formStatus === "Inactive"}
                      onChange={() => setFormStatus("Inactive")}
                      className="text-rose-500 focus:ring-0"
                    />
                    <span>Inactive</span>
                  </label>
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="pt-4 border-t border-[#14233f] flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-700 hover:bg-slate-800 text-xs font-medium text-slate-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#00c0f0] hover:bg-[#00a6d1] text-white text-xs font-semibold shadow-[0_0_12px_rgba(0,192,240,0.4)] transition-all cursor-pointer"
                >
                  {modalMode === "create" ? "Save User" : "Update User"}
                </button>
              </div>
            </form>
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
