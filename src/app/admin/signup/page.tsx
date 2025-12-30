"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Sunburst Logo Component
function SunburstLogo({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {Array.from({ length: 9 }).map((_, i) => {
        const angle = -180 + (i * 180) / 8;
        const rad = (angle * Math.PI) / 180;
        const x1 = 20 + Math.cos(rad) * 4;
        const y1 = 22 + Math.sin(rad) * 4;
        const x2 = 20 + Math.cos(rad) * 12;
        const y2 = 22 + Math.sin(rad) * 12;
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="currentColor"
            strokeWidth="0.8"
            strokeLinecap="round"
            opacity={0.85}
          />
        );
      })}
      <circle cx="20" cy="22" r="1.5" fill="currentColor" />
    </svg>
  );
}

export default function AdminSignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    // Validate password length
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      const supabase = createClient();

      // Sign up the user
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName || "Admin User",
          },
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
        return;
      }

      if (!data.user) {
        setError("Failed to create user");
        setLoading(false);
        return;
      }

      // Add user to admin_users table with super_admin role
      const { error: adminError } = await supabase.from("admin_users").insert({
        id: data.user.id,
        email: data.user.email,
        display_name: displayName || "Admin User",
        role: "super_admin",
        is_active: true,
      });

      if (adminError) {
        // If admin insert fails, we should note this but the auth user exists
        console.error("Failed to add to admin_users:", adminError);
        setError(
          "User created but failed to set admin role. Contact support with user ID: " +
            data.user.id
        );
        setLoading(false);
        return;
      }

      setSuccess(true);

      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push("/admin/login");
      }, 2000);
    } catch (err) {
      console.error("Signup error:", err);
      setError("An error occurred during signup");
      setLoading(false);
    }
  }

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
              Admin Setup
            </span>
          </div>
        </div>

        {/* Signup Form */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-8 shadow-xl">
          <h1 className="text-xl font-light text-white mb-6 text-center">
            Create Admin Account
          </h1>

          {/* Success Message */}
          {success ? (
            <div className="text-center">
              <div className="mb-4 p-3 bg-green-500/10 border border-green-500/30 rounded text-green-400 text-sm">
                Account created successfully! Redirecting to login...
              </div>
            </div>
          ) : (
            <>
              {/* Error Message */}
              {error && (
                <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 rounded text-red-400 text-sm text-center">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="displayName" className="text-zinc-400 text-sm">
                    Display Name
                  </Label>
                  <Input
                    id="displayName"
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Admin Name"
                    disabled={loading}
                    className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-amber-500 focus:ring-amber-500/20"
                  />
                </div>

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
                    placeholder="Min 6 characters"
                    required
                    disabled={loading}
                    className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-amber-500 focus:ring-amber-500/20"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-zinc-400 text-sm">
                    Confirm Password
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
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
                      Creating account...
                    </span>
                  ) : (
                    "Create Admin Account"
                  )}
                </Button>
              </form>
            </>
          )}
        </div>

        {/* Warning Notice */}
        <p className="text-center text-xs text-amber-600 mt-6">
          TEMPORARY PAGE - Remove after creating admin account
        </p>
      </div>
    </div>
  );
}
