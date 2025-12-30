import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminLayoutClient } from "@/components/admin/AdminLayoutClient";
import { Toaster } from "@/components/ui/sonner";
import "@/app/globals.css";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  // Get current user
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  // Get admin user details
  const { data: adminUser } = await supabase
    .from("admin_users")
    .select("display_name, role, is_active")
    .eq("id", user.id)
    .single();

  if (!adminUser?.is_active) {
    redirect("/admin/login?error=unauthorized");
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white antialiased">
        <AdminLayoutClient
          adminName={adminUser.display_name}
          adminRole={adminUser.role}
        >
          {children}
        </AdminLayoutClient>
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
