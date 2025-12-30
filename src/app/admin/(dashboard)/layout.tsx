import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
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
    <html lang="en" className="dark">
      <body className="min-h-screen bg-zinc-950 text-white antialiased">
        <AdminSidebar
          adminName={adminUser.display_name}
          adminRole={adminUser.role}
        />
        <main className="ml-64 min-h-screen">
          <div className="p-8">
            {children}
          </div>
        </main>
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
