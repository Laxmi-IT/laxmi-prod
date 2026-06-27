import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminLayoutClient } from "@/components/admin/AdminLayoutClient";

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
    <AdminLayoutClient
      adminName={adminUser.display_name}
      adminRole={adminUser.role}
    >
      {children}
    </AdminLayoutClient>
  );
}
