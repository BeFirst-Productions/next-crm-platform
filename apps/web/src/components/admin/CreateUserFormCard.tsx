"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  X,
  UserPlus,
  Pencil,
  Camera,
  Upload,
  User,
  Lock,
  Building2,
  Eye,
  EyeOff,
  Check,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/useToast";
import { apiClient } from "@/lib/api-client";

// ============================================================================
// 6 PRESET AVATARS (Clean SVG Data URIs matching the screenshot palette)
// ============================================================================

export const PRESET_AVATARS = [
  {
    id: "preset-1",
    label: "Male Formal (Blue)",
    // Navy blue background, male with blue tie
    svg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%231d4ed8"/><path d="M50 20a16 16 0 0 1 16 16c0 10-7 18-16 18s-16-8-16-18a16 16 0 0 1 16-16z" fill="%23fed7aa"/><path d="M34 32c0-8 7-14 16-14s16 6 16 14v4h-32v-4z" fill="%231e293b"/><path d="M22 88c2-20 14-30 28-30s26 10 28 30z" fill="%230f172a"/><path d="M44 58l6 14 6-14h-12z" fill="%23ffffff"/><polygon points="48,60 52,60 51,76 49,76" fill="%2338bdf8"/></svg>`,
  },
  {
    id: "preset-2",
    label: "Female Professional (Purple)",
    // Purple background, female in violet jacket
    svg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%237c3aed"/><path d="M50 20a16 16 0 0 1 16 16c0 10-7 18-16 18s-16-8-16-18a16 16 0 0 1 16-16z" fill="%23fde047"/><path d="M30 36c0-10 9-18 20-18s20 8 20 18v8c0 4-4 8-8 8h-4c-2 0-3-1-3-3v-5h-10v5c0 2-1 3-3 3h-4c-4 0-8-4-8-8v-8z" fill="%23701a75"/><path d="M22 88c2-20 14-28 28-28s26 8 28 28z" fill="%23581c87"/><circle cx="43" cy="38" r="4.5" fill="none" stroke="%23e9d5ff" stroke-width="1.8"/><circle cx="57" cy="38" r="4.5" fill="none" stroke="%23e9d5ff" stroke-width="1.8"/><line x1="47.5" y1="38" x2="52.5" y2="38" stroke="%23e9d5ff" stroke-width="1.8"/><path d="M45 60l5 12 5-12z" fill="%23f5d0fe"/></svg>`,
  },
  {
    id: "preset-3",
    label: "Male Bearded (Emerald)",
    // Dark green background, bearded executive
    svg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%23059669"/><path d="M50 20a16 16 0 0 1 16 16c0 10-7 18-16 18s-16-8-16-18a16 16 0 0 1 16-16z" fill="%23fed7aa"/><path d="M34 32c0-8 7-14 16-14s16 6 16 14v3h-32v-3z" fill="%231e293b"/><path d="M38 42c0 8 5 14 12 14s12-6 12-14v-2H38v2z" fill="%23334155"/><path d="M22 88c2-20 14-28 28-28s26 8 28 28z" fill="%23064e3b"/><circle cx="43" cy="36" r="4" fill="none" stroke="%23e2e8f0" stroke-width="1.6"/><circle cx="57" cy="36" r="4" fill="none" stroke="%23e2e8f0" stroke-width="1.6"/><line x1="47" y1="36" x2="53" y2="36" stroke="%23e2e8f0" stroke-width="1.6"/></svg>`,
  },
  {
    id: "preset-4",
    label: "Casual Professional (Orange)",
    // Warm orange background, creative lead
    svg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%23ea580c"/><path d="M50 20a16 16 0 0 1 16 16c0 10-7 18-16 18s-16-8-16-18a16 16 0 0 1 16-16z" fill="%23fcd34d"/><path d="M33 30c2-10 8-12 17-12s15 2 17 12v3H33v-3z" fill="%23451a03"/><path d="M22 88c2-20 14-28 28-28s26 8 28 28z" fill="%239a3412"/><path d="M42 60c4 5 12 5 16 0l4 8H38z" fill="%23fed7aa"/></svg>`,
  },
  {
    id: "preset-5",
    label: "Tech Lead (Indigo)",
    // Indigo background, tech style
    svg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%234f46e5"/><path d="M50 20a16 16 0 0 1 16 16c0 10-7 18-16 18s-16-8-16-18a16 16 0 0 1 16-16z" fill="%23fed7aa"/><path d="M32 32c1-8 8-14 18-14s17 6 18 14v4H32v-4z" fill="%230f172a"/><path d="M22 88c2-20 14-28 28-28s26 8 28 28z" fill="%23312e81"/><path d="M44 58h12v18h-12z" fill="%2300c0f0"/></svg>`,
  },
  {
    id: "preset-6",
    label: "Customer Success (Teal)",
    // Mint teal background, female support lead
    svg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%230891b2"/><path d="M50 20a16 16 0 0 1 16 16c0 10-7 18-16 18s-16-8-16-18a16 16 0 0 1 16-16z" fill="%23fef08a"/><path d="M32 34c0-10 8-16 18-16s18 6 18 16v6c0 4-3 6-7 6h-22c-4 0-7-2-7-6v-6z" fill="%23134e4a"/><path d="M22 88c2-20 14-28 28-28s26 8 28 28z" fill="%230f766e"/><circle cx="43" cy="36" r="4.2" fill="none" stroke="%23ccfbf1" stroke-width="1.8"/><circle cx="57" cy="36" r="4.2" fill="none" stroke="%23ccfbf1" stroke-width="1.8"/><line x1="47.2" y1="36" x2="52.8" y2="36" stroke="%23ccfbf1" stroke-width="1.8"/></svg>`,
  },
];

export interface InitialUserFormValues {
  id?: string;
  employeeId?: string;
  name?: string;
  email?: string;
  phone?: string;
  role?: string;
  department?: string;
  status?: string;
  avatar?: string;
  salesTarget?: number;
  commissionRate?: number;
  settings?: any;
}

export interface CreateUserFormCardProps {
  mode?: "create" | "edit";
  initialUser?: InitialUserFormValues | null;
  onClose?: () => void;
  onSuccess?: () => void;
  isModal?: boolean;
}

export function CreateUserFormCard({
  mode = "create",
  initialUser = null,
  onClose,
  onSuccess,
  isModal = false,
}: CreateUserFormCardProps) {
  const router = useRouter();
  const { toast } = useToast();
  const isEdit = mode === "edit";

  // Form fields
  const [fullName, setFullName] = React.useState(initialUser?.name || "");
  const [email, setEmail] = React.useState(initialUser?.email || "");
  const [phone, setPhone] = React.useState(initialUser?.phone || "+971 50 ");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [department, setDepartment] = React.useState(initialUser?.department || "Sales");
  const [accountStatus, setAccountStatus] = React.useState(initialUser?.status || "Active");

  // Profile image state
  const [selectedAvatar, setSelectedAvatar] = React.useState<string>(() => {
    if (initialUser?.avatar) return initialUser.avatar;
    return PRESET_AVATARS[0].svg;
  });
  const [isCustomUpload, setIsCustomUpload] = React.useState(() => {
    if (initialUser?.avatar) {
      return !PRESET_AVATARS.some((p) => p.svg === initialUser.avatar);
    }
    return false;
  });
  const [isDragOver, setIsDragOver] = React.useState(false);

  // Password visibility
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  // Validation & Submission
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [dbDepartments, setDbDepartments] = React.useState<Array<{ id: string; name: string }>>([]);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Sync state if initialUser changes in edit mode
  React.useEffect(() => {
    if (isEdit && initialUser) {
      setFullName(initialUser.name || "");
      setEmail(initialUser.email || "");
      setPhone(initialUser.phone || "+971 50 ");
      setDepartment(initialUser.department || "Sales");
      setAccountStatus(initialUser.status || "Active");
      const avatarUrl = initialUser.avatar || PRESET_AVATARS[0].svg;
      setSelectedAvatar(avatarUrl);
      const isPreset = PRESET_AVATARS.some((p) => p.svg === avatarUrl);
      setIsCustomUpload(!isPreset && Boolean(avatarUrl));
    }
  }, [isEdit, initialUser]);

  // Fetch departments from database
  React.useEffect(() => {
    apiClient<Array<{ id: string; name: string }>>("/users/departments")
      .then((res) => {
        if (res?.data && Array.isArray(res.data) && res.data.length > 0) {
          setDbDepartments(res.data);
        }
      })
      .catch(() => {});
  }, []);

  // Handle Preset Avatar Selection
  const handleSelectPreset = (svg: string) => {
    setSelectedAvatar(svg);
    setIsCustomUpload(false);
  };

  // Handle File Upload
  const handleFileProcess = (file: File) => {
    if (!file) return;

    // Validate type
    const validTypes = ["image/png", "image/jpeg", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast({
        type: "error",
        title: "Unsupported file type",
        description: "Please upload a PNG, JPG, or WebP image.",
      });
      return;
    }

    // Validate size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        type: "error",
        title: "File too large",
        description: "Max image size is 5MB.",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setSelectedAvatar(reader.result);
        setIsCustomUpload(true);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileProcess(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileProcess(file);
  };

  // Validate form
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!phone.trim() || phone.trim() === "+971 50") {
      newErrors.phone = "UAE Phone number is required";
    }

    // Password validation:
    // In create mode: Password is required (>= 8 chars)
    // In edit mode: Password is optional. If provided, must be >= 8 chars and match confirmPassword.
    if (!isEdit) {
      if (!password) {
        newErrors.password = "Password is required";
      } else if (password.length < 8) {
        newErrors.password = "Password must be at least 8 characters";
      }

      if (!confirmPassword) {
        newErrors.confirmPassword = "Confirm password is required";
      } else if (confirmPassword !== password) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    } else {
      if (password) {
        if (password.length < 8) {
          newErrors.password = "Password must be at least 8 characters";
        }
        if (confirmPassword !== password) {
          newErrors.confirmPassword = "Passwords do not match";
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast({
        type: "error",
        title: "Validation Error",
        description: "Please fill in all required fields accurately.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Map department to standard role
      let role: "SUPER_ADMIN" | "ADMIN" | "SALES_STAFF" | "MARKETING_TEAM" =
        "SALES_STAFF";
      if (initialUser?.role === "Super Admin" || initialUser?.role === "SUPER_ADMIN") {
        role = "SUPER_ADMIN";
      } else if (department === "Administration" || department === "Operations") {
        role = "ADMIN";
      } else if (department === "Marketing") {
        role = "MARKETING_TEAM";
      }

      // Find matching department ID in database
      const matchedDept = dbDepartments.find(
        (d) => d.name.toLowerCase() === department.toLowerCase()
      );

      const statusValue =
        accountStatus === "Active"
          ? "ACTIVE"
          : accountStatus === "Suspended"
          ? "SUSPENDED"
          : "INACTIVE";

      if (isEdit && initialUser?.id) {
        // Direct DB update via API PATCH
        const patchPayload: Record<string, unknown> = {
          name: fullName.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          role: role,
          status: statusValue,
          departmentId: matchedDept?.id || undefined,
          salesTarget: department === "Sales" ? 40000 : 0,
          commissionPercentage: department === "Sales" ? 8 : 0,
          settings: {
            department: department,
            status: accountStatus,
            avatar: selectedAvatar,
          },
        };

        if (password.trim()) {
          patchPayload.password = password.trim();
        }

        await apiClient<any>(`/users/${initialUser.id}`, {
          method: "PATCH",
          body: patchPayload,
        });

        toast({
          type: "success",
          title: "User Updated Successfully",
          description: `Profile for ${fullName} (${department}) has been updated in database.`,
        });
      } else {
        // Direct DB persistence via API POST
        await apiClient<any>("/users", {
          method: "POST",
          body: {
            name: fullName.trim(),
            email: email.trim().toLowerCase(),
            password: password,
            phone: phone.trim(),
            role: role,
            departmentId: matchedDept?.id || undefined,
            joiningDate: new Date().toISOString(),
            salesTarget: department === "Sales" ? 40000 : 0,
            commissionPercentage: department === "Sales" ? 8 : 0,
            settings: {
              department: department,
              status: accountStatus,
              avatar: selectedAvatar,
            },
          },
        });

        toast({
          type: "success",
          title: "User Created Successfully",
          description: `Profile for ${fullName} (${department}) has been provisioned.`,
        });
      }

      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/admin/users");
      }
    } catch (err: unknown) {
      toast({
        type: "error",
        title: isEdit ? "Update Failed" : "Creation Failed",
        description:
          err instanceof Error ? err.message : "Could not complete operation.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (onClose) {
      onClose();
    } else {
      router.push("/admin/users");
    }
  };

  return (
    <div
      className={`w-full bg-[#07101f] border border-[#14233e] rounded-2xl sm:rounded-3xl shadow-2xl shadow-black/60 overflow-hidden ${
        isModal ? "max-h-[92vh] flex flex-col" : ""
      }`}
    >
      {/* -------------------------------------------------------------------- */}
      {/* CARD HEADER */}
      {/* -------------------------------------------------------------------- */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-[#13223f] bg-[#091427]/80">
        <div className="flex items-center gap-3.5">
          {/* Glowing badge icon */}
          <div className="w-10 h-10 rounded-xl bg-[#092b45] border border-[#0f4d73] text-[#00c0f0] flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(0,192,240,0.25)]">
            {isEdit ? <Pencil className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              {isEdit
                ? `Edit User Profile ${initialUser?.employeeId ? `— ${initialUser.employeeId}` : ""}`
                : "Create New User Profile"}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {isEdit
                ? "Update personal credentials, roles, and status for this user."
                : "Fill in personal credentials and organizational roles to manage user access."}
            </p>
          </div>
        </div>

        {/* Close Button X */}
        <button
          type="button"
          onClick={handleCancel}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#142544] transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* CARD BODY (2 COLUMNS: Profile Image | Form Fields) */}
      {/* -------------------------------------------------------------------- */}
      <form
        onSubmit={handleSubmit}
        className={`p-6 sm:p-8 ${
          isModal ? "overflow-y-auto flex-1 space-y-6" : ""
        }`}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* ================================================================ */}
          {/* LEFT COLUMN: PROFILE IMAGE & PRESETS (Col Span 4) */}
          {/* ================================================================ */}
          <div className="lg:col-span-4 flex flex-col space-y-5">
            {/* Header: PROFILE IMAGE */}
            <div className="flex items-center gap-2 text-[#00c0f0] text-xs font-bold tracking-wider uppercase">
              <Camera className="w-4 h-4" />
              <span>PROFILE IMAGE</span>
            </div>

            {/* Hidden native file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png, image/jpeg, image/webp"
              onChange={handleFileInputChange}
              className="hidden"
            />

            {/* Upload Area / Drop Zone */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative rounded-2xl border-2 border-dashed p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 min-h-[190px] ${
                isDragOver
                  ? "border-[#00c0f0] bg-[#00c0f0]/10 shadow-[0_0_20px_rgba(0,192,240,0.2)]"
                  : "border-[#1a3356] bg-[#08152a]/70 hover:border-[#00c0f0]/60 hover:bg-[#0b1b36]/70"
              }`}
            >
              {selectedAvatar && isCustomUpload ? (
                <div className="relative group flex flex-col items-center">
                  <img
                    src={selectedAvatar}
                    alt="Uploaded Avatar"
                    onError={() => {
                      setSelectedAvatar(PRESET_AVATARS[0].svg);
                      setIsCustomUpload(false);
                    }}
                    className="w-24 h-24 rounded-2xl object-cover border-2 border-[#00c0f0] shadow-[0_0_16px_rgba(0,192,240,0.3)]"
                  />
                  <div className="mt-2.5 flex items-center gap-1.5 text-xs text-[#00c0f0] font-medium">
                    <Check className="w-3.5 h-3.5" />
                    <span>Photo uploaded</span>
                  </div>
                  <span className="text-[11px] text-slate-400 mt-0.5">
                    Click to change photo
                  </span>
                </div>
              ) : selectedAvatar ? (
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-[#00c0f0] shadow-[0_0_16px_rgba(0,192,240,0.35)] p-0.5 bg-[#091b34]">
                    <img
                      src={selectedAvatar}
                      alt="Preset Avatar"
                      onError={() => setSelectedAvatar(PRESET_AVATARS[0].svg)}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  </div>
                  <p className="text-xs font-semibold text-slate-200 mt-2.5">
                    Preset Avatar Selected
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Click to browse or drop custom photo
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-xl bg-[#0c2442] border border-[#173e6b] text-[#00c0f0] flex items-center justify-center mb-3">
                    <Upload className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-semibold text-slate-200">
                    Upload User Photo
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Drag & drop or click to browse
                  </p>
                </div>
              )}
            </div>

            {/* Upload Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-2.5 rounded-xl border border-[#164372] bg-[#092543] hover:bg-[#0c3158] text-[#00c0f0] hover:text-[#38d4ff] text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Photo</span>
            </button>

            {/* Photo specs information */}
            <div className="space-y-1.5 pt-1 text-xs">
              <div className="flex items-center justify-between text-slate-400 py-1 border-b border-[#13223f]">
                <span>Format</span>
                <span className="text-slate-200 font-medium">PNG, JPG, WebP</span>
              </div>
              <div className="flex items-center justify-between text-slate-400 py-1">
                <span>Ratio / Size</span>
                <span className="text-slate-200 font-medium">
                  1:1 Square (Max 5MB)
                </span>
              </div>
            </div>

            {/* Preset Avatars Section */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-slate-300">
                  Preset Avatars (Folder)
                </span>
                <span className="text-[11px] font-semibold text-[#00c0f0]">
                  6 presets
                </span>
              </div>

              {/* 6 Circular Preset Avatars */}
              <div className="grid grid-cols-6 gap-2">
                {PRESET_AVATARS.map((preset) => {
                  const isSelected =
                    !isCustomUpload && selectedAvatar === preset.svg;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleSelectPreset(preset.svg)}
                      title={preset.label}
                      className={`relative w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden transition-all duration-150 cursor-pointer ${
                        isSelected
                          ? "ring-2 ring-[#00c0f0] scale-110 shadow-[0_0_12px_rgba(0,192,240,0.6)]"
                          : "opacity-80 hover:opacity-100 hover:scale-105"
                      }`}
                    >
                      <img
                        src={preset.svg}
                        alt={preset.label}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ================================================================ */}
          {/* RIGHT COLUMN: FORM FIELDS (Col Span 8) */}
          {/* ================================================================ */}
          <div className="lg:col-span-8 flex flex-col space-y-7">
            {/* -------------------------------------------------------------- */}
            {/* 1. PERSONAL & CONTACT INFORMATION */}
            {/* -------------------------------------------------------------- */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-slate-200 text-xs font-bold tracking-wider uppercase">
                <User className="w-4 h-4 text-[#00c0f0]" />
                <span>1. PERSONAL & CONTACT INFORMATION</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Full Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    autoComplete="off"
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      if (errors.fullName)
                        setErrors((prev) => ({ ...prev, fullName: "" }));
                    }}
                    placeholder="e.g. Tariq Mansoor"
                    className={`w-full bg-[#08152a] border text-xs text-white rounded-xl px-3.5 py-2.5 outline-none transition-all placeholder:text-slate-500 ${
                      errors.fullName
                        ? "border-rose-500 focus:ring-1 focus:ring-rose-500"
                        : "border-[#172c4c] focus:border-[#00c0f0] focus:ring-1 focus:ring-[#00c0f0]/30"
                    }`}
                  />
                  {errors.fullName && (
                    <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.fullName}
                    </p>
                  )}
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Email Address <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="email"
                    autoComplete="off"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email)
                        setErrors((prev) => ({ ...prev, email: "" }));
                    }}
                    placeholder="e.g. tariq.m@next.com"
                    className={`w-full bg-[#08152a] border text-xs text-white rounded-xl px-3.5 py-2.5 outline-none transition-all placeholder:text-slate-500 ${
                      errors.email
                        ? "border-rose-500 focus:ring-1 focus:ring-rose-500"
                        : "border-[#172c4c] focus:border-[#00c0f0] focus:ring-1 focus:ring-[#00c0f0]/30"
                    }`}
                  />
                  {errors.email && (
                    <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>

              {/* Dubai / UAE Phone Number (Full Width) */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Dubai / UAE Phone Number <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    if (errors.phone)
                      setErrors((prev) => ({ ...prev, phone: "" }));
                  }}
                  placeholder="+971 50"
                  className={`w-full bg-[#08152a] border text-xs text-white rounded-xl px-3.5 py-2.5 outline-none transition-all placeholder:text-slate-500 ${
                    errors.phone
                      ? "border-rose-500 focus:ring-1 focus:ring-rose-500"
                      : "border-[#172c4c] focus:border-[#00c0f0] focus:ring-1 focus:ring-[#00c0f0]/30"
                  }`}
                />
                {errors.phone && (
                  <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.phone}
                  </p>
                )}
              </div>
            </div>

            {/* -------------------------------------------------------------- */}
            {/* ACCOUNT CREDENTIALS & ACCESS PASSWORD */}
            {/* -------------------------------------------------------------- */}
            <div className="space-y-4 pt-1">
              <div className="flex items-center gap-2 text-slate-200 text-xs font-bold tracking-wider uppercase">
                <Lock className="w-4 h-4 text-[#00c0f0]" />
                <span>ACCOUNT CREDENTIALS & ACCESS PASSWORD</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Password */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Password{" "}
                    {isEdit ? (
                      <span className="text-slate-400 text-[11px] font-normal">
                        (Leave blank to keep current)
                      </span>
                    ) : (
                      <span className="text-rose-400">*</span>
                    )}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (errors.password)
                          setErrors((prev) => ({ ...prev, password: "" }));
                      }}
                      placeholder={
                        isEdit
                          ? "Enter new password (optional)"
                          : "Min 8 characters (letters & numbers)"
                      }
                      className={`w-full bg-[#08152a] border text-xs text-white rounded-xl pl-3.5 pr-10 py-2.5 outline-none transition-all placeholder:text-slate-500 ${
                        errors.password
                          ? "border-rose-500 focus:ring-1 focus:ring-rose-500"
                          : "border-[#172c4c] focus:border-[#00c0f0] focus:ring-1 focus:ring-[#00c0f0]/30"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Confirm Password{" "}
                    {isEdit ? (
                      <span className="text-slate-400 text-[11px] font-normal">
                        (Optional)
                      </span>
                    ) : (
                      <span className="text-rose-400">*</span>
                    )}
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (errors.confirmPassword)
                          setErrors((prev) => ({ ...prev, confirmPassword: "" }));
                      }}
                      placeholder={
                        isEdit
                          ? "Re-enter new password to confirm"
                          : "Re-enter password to confirm"
                      }
                      className={`w-full bg-[#08152a] border text-xs text-white rounded-xl pl-3.5 pr-10 py-2.5 outline-none transition-all placeholder:text-slate-500 ${
                        errors.confirmPassword
                          ? "border-rose-500 focus:ring-1 focus:ring-rose-500"
                          : "border-[#172c4c] focus:border-[#00c0f0] focus:ring-1 focus:ring-[#00c0f0]/30"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                      aria-label="Toggle confirm password visibility"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* -------------------------------------------------------------- */}
            {/* 2. DEPARTMENT & STATUS */}
            {/* -------------------------------------------------------------- */}
            <div className="space-y-4 pt-1">
              <div className="flex items-center gap-2 text-slate-200 text-xs font-bold tracking-wider uppercase">
                <Building2 className="w-4 h-4 text-[#00c0f0]" />
                <span>2. DEPARTMENT & STATUS</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Department */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Department <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full bg-[#08152a] border border-[#172c4c] focus:border-[#00c0f0] focus:ring-1 focus:ring-[#00c0f0]/30 text-xs text-white rounded-xl px-3.5 py-2.5 outline-none appearance-none cursor-pointer pr-10"
                    >
                      <option value="Sales">Sales</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Administration">Administration</option>
                      <option value="Operations">Operations</option>
                      <option value="IT">IT</option>
                      <option value="Finance">Finance</option>
                    </select>
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Account Status */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Account Status <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={accountStatus}
                      onChange={(e) => setAccountStatus(e.target.value)}
                      className="w-full bg-[#08152a] border border-[#172c4c] focus:border-[#00c0f0] focus:ring-1 focus:ring-[#00c0f0]/30 text-xs text-white rounded-xl px-3.5 py-2.5 outline-none appearance-none cursor-pointer pr-10"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="Suspended">Suspended</option>
                    </select>
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* ACTION BUTTONS (Bottom Right: Cancel | Create & Provision User) */}
        {/* ------------------------------------------------------------------ */}
        <div className="pt-8 border-t border-[#13223f] flex items-center justify-end gap-3 mt-8">
          <button
            type="button"
            onClick={handleCancel}
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-xl border border-[#1a3356] bg-[#09172e] hover:bg-[#122648] text-xs font-semibold text-slate-300 hover:text-white transition-all cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-7 py-2.5 rounded-xl bg-[#0091ff] hover:bg-[#0080e6] text-white text-xs font-semibold shadow-[0_0_20px_rgba(0,145,255,0.4)] hover:shadow-[0_0_25px_rgba(0,145,255,0.6)] transition-all cursor-pointer flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{isEdit ? "Updating User..." : "Provisioning..."}</span>
              </>
            ) : (
              <span>{isEdit ? "Save & Update User" : "Create & Provision User"}</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
