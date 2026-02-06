"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SunburstLogo } from "@/components/laxmi-logo";

// Login form component that uses searchParams
function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Check for error from middleware
  const urlError = searchParams.get("error");
  const redirectPath = searchParams.get("redirect") || "/admin/dashboard";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const supabase = createClient();

      // Sign in with email and password
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError("Invalid email or password");
        setLoading(false);
        return;
      }

      if (!data.user) {
        setError("Authentication failed");
        setLoading(false);
        return;
      }

      // Check if user is an admin
      const { data: adminUser, error: adminError } = await supabase
        .from("admin_users")
        .select("is_active, role")
        .eq("id", data.user.id)
        .single();

      if (adminError || !adminUser?.is_active) {
        // Sign out since user is not an admin
        await supabase.auth.signOut();
        setError("You are not authorized to access the admin panel");
        setLoading(false);
        return;
      }

      // Update last login timestamp
      await supabase
        .from("admin_users")
        .update({ last_login: new Date().toISOString() })
        .eq("id", data.user.id);

      // Redirect to dashboard or original destination
      router.push(redirectPath);
      router.refresh();
    } catch (err) {
      console.error("Login error:", err);
      setError("An error occurred during login");
      setLoading(false);
    }
  }

  return (
    <>
      {/* Error Messages */}
      {(error || urlError) && (
        <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 rounded text-red-400 text-sm text-center">
          {error ||
            (urlError === "unauthorized"
              ? "You are not authorized to access this area"
              : "An error occurred")}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-zinc-400 text-sm">
            Email Address
          </Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@laxmi.it"
            required
            disabled={loading}
            className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-amber-500 focus:ring-amber-500/20"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-zinc-400 text-sm">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
            disabled={loading}
            className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-amber-500 focus:ring-amber-500/20"
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-amber-600 hover:bg-amber-500 text-white font-medium py-3 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Signing in...
            </span>
          ) : (
            "Sign In"
          )}
        </Button>
      </form>
    </>
  );
}

// Loading fallback
function LoginFormSkeleton() {
  return (
    <div className="space-y-5 animate-pulse">
      <div className="space-y-2">
        <div className="h-4 w-24 bg-zinc-800 rounded" />
        <div className="h-10 bg-zinc-800 rounded" />
      </div>
      <div className="space-y-2">
        <div className="h-4 w-20 bg-zinc-800 rounded" />
        <div className="h-10 bg-zinc-800 rounded" />
      </div>
      <div className="h-12 bg-zinc-800 rounded" />
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-4">
      <div className="w-full max-w-md">
        {/* Logo/Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex flex-col items-center">
            <SunburstLogo className="w-12 h-8 text-amber-500 mb-3" />
            <span className="text-xl tracking-[0.3em] font-serif font-light text-white">
              LAXMI
            </span>
            <span className="text-xs tracking-widest text-zinc-500 mt-1 uppercase">
              Admin Dashboard
            </span>
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-8 shadow-xl">
          <h1 className="text-xl font-light text-white mb-6 text-center">
            Sign In
          </h1>

          <Suspense fallback={<LoginFormSkeleton />}>
            <LoginForm />
          </Suspense>
        </div>

        {/* Security Notice */}
        <p className="text-center text-xs text-zinc-600 mt-6">
          This is a protected area. Unauthorized access attempts are logged.
        </p>
      </div>
    </div>
  );
}
