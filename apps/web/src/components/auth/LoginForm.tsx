"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, AlertCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { useAuth } from "@/hooks/useAuth";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const DEMO_ACCOUNTS = [
  {
    role: "Super Admin",
    email: "superadmin@next.com",
    password: "Superadmin@123",
    badge: "Full Control",
    badgeColor: "bg-red-500/10 text-red-400 border-red-500/20",
  },
  {
    role: "Sales Staff",
    email: "staff@nextdigital.com",
    password: "Staff@12345",
    badge: "Pipeline & Slabs",
    badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  },
  {
    role: "Operations Admin",
    email: "admin@next.com",
    password: "Admin@12345",
    badge: "Ops & Approvals",
    badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  },
];

const DEFAULT_EMAIL = "superadmin@next.com";
const DEFAULT_PASSWORD = "Superadmin@123";

export function LoginForm() {
  const { login, isLoggingIn } = useAuth();
  const [showPassword, setShowPassword] = React.useState(false);
  const [authError, setAuthError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: DEFAULT_EMAIL,
      password: DEFAULT_PASSWORD,
    },
  });

  // Ensure fields are pre-filled upon mount
  React.useEffect(() => {
    setValue("email", DEFAULT_EMAIL, { shouldValidate: true });
    setValue("password", DEFAULT_PASSWORD, { shouldValidate: true });
  }, [setValue]);

  const onSubmit = async (values: LoginFormValues) => {
    setAuthError(null);
    try {
      await login(values);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to log in. Please check your credentials.";
      setAuthError(message);
    }
  };

  const handleQuickFill = (acc: typeof DEMO_ACCOUNTS[0]) => {
    setValue("email", acc.email, { shouldValidate: true });
    setValue("password", acc.password, { shouldValidate: true });
    setAuthError(null);
  };

  return (
    <Card className="w-full max-w-md mx-auto border-surface-800/80 bg-surface-900/90 shadow-2xl backdrop-blur-2xl">
      <CardHeader className="text-center pb-5 border-b-0">
        <div className="mx-auto w-12 h-12 rounded-2xl bg-brand-600/10 border border-brand-500/20 text-brand-400 flex items-center justify-center mb-3 shadow-glow">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-surface-50 via-surface-200 to-surface-400 bg-clip-text text-transparent">
          Welcome back
        </CardTitle>
        <CardDescription className="text-surface-400 text-sm mt-1">
          Enter your credentials to access your Next CRM workspace
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-1">
        {authError && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
            <span>{authError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Email"
            type="email"
            placeholder="name@company.com"
            autoComplete="email"
            defaultValue={DEFAULT_EMAIL}
            leadingIcon={<Mail className="w-4 h-4" />}
            error={errors.email?.message}
            {...register("email")}
          />

          <Input
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••••••"
            autoComplete="current-password"
            defaultValue={DEFAULT_PASSWORD}
            leadingIcon={<Lock className="w-4 h-4" />}
            trailingIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="hover:text-surface-200 transition-colors p-1"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            }
            error={errors.password?.message}
            {...register("password")}
          />

          <Button
            type="submit"
            size="lg"
            isLoading={isLoggingIn}
            className="w-full mt-2 group"
          >
            <span>Sign In</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </form>

        {/* Demo Accounts Quick-Fill Section */}
        <div className="mt-6 pt-5 border-t border-surface-800/60">
          <div className="flex items-center gap-1.5 text-xs font-medium text-surface-400 mb-2.5">
            <Sparkles className="w-3.5 h-3.5 text-brand-400" />
            <span>Click to fill seeded test account:</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {DEMO_ACCOUNTS.map((acc) => (
              <button
                key={acc.role}
                type="button"
                onClick={() => handleQuickFill(acc)}
                className="p-2 rounded-xl bg-surface-800/50 hover:bg-surface-800 border border-surface-700/60 hover:border-brand-500/40 text-left transition-all group flex flex-col justify-between"
              >
                <span className="text-xs font-semibold text-surface-200 group-hover:text-brand-300">
                  {acc.role}
                </span>
                <span className={`text-[10px] mt-1 px-1.5 py-0.5 rounded border inline-block w-fit ${acc.badgeColor}`}>
                  {acc.badge}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 text-center text-xs text-surface-500">
          Enterprise Access Management • AES-256 Encrypted
        </div>
      </CardContent>
    </Card>
  );
}
