import { createClient } from "@/lib/supabase/server";

export default async function SettingsPage() {
  const supabase = await createClient();

  // Get current user info
  const { data: { user } } = await supabase.auth.getUser();
  const { data: adminUser } = await supabase
    .from("admin_users")
    .select("*")
    .eq("id", user?.id)
    .single();

  // Get all admin users (only visible to super_admin)
  const { data: allAdmins } = await supabase
    .from("admin_users")
    .select("*")
    .order("created_at");

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-light text-foreground mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Manage your admin account and system settings.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Section */}
        <div className="p-6 bg-card border border-border rounded-lg">
          <h2 className="text-lg font-medium text-foreground mb-6">Your Profile</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-muted-foreground mb-1">Display Name</label>
              <p className="text-foreground">{adminUser?.display_name}</p>
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-1">Email</label>
              <p className="text-foreground">{adminUser?.email}</p>
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-1">Role</label>
              <span className="inline-flex px-2 py-1 text-xs font-medium bg-primary/10 text-primary border border-primary/20 rounded capitalize">
                {adminUser?.role?.replace("_", " ")}
              </span>
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-1">Last Login</label>
              <p className="text-foreground">
                {adminUser?.last_login
                  ? new Date(adminUser.last_login).toLocaleString()
                  : "—"}
              </p>
            </div>
          </div>
        </div>

        {/* System Info */}
        <div className="p-6 bg-card border border-border rounded-lg">
          <h2 className="text-lg font-medium text-foreground mb-6">System Information</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-muted-foreground mb-1">Version</label>
              <p className="text-foreground">LAXMI Admin v1.0.0</p>
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-1">Environment</label>
              <p className="text-foreground">{process.env.NODE_ENV}</p>
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-1">Database</label>
              <p className="text-foreground">Supabase PostgreSQL</p>
            </div>
          </div>
        </div>

        {/* Tools Section (Super Admin Only) */}
        {adminUser?.role === "super_admin" && (
          <div className="p-6 bg-card border border-border rounded-lg">
            <h2 className="text-lg font-medium text-foreground mb-6">Tools</h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">ArrexLab Image Downloader</p>
                  <p className="text-xs text-muted-foreground">Python script for downloading product images from ArrexLab</p>
                </div>
                <a
                  href="/api/admin/scripts?file=arrexlab_full_downloader.py"
                  className="flex items-center gap-2 px-3 py-1.5 text-sm bg-primary hover:bg-primary/90 text-primary-foreground rounded transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Admin Users Section (Super Admin Only) */}
        {adminUser?.role === "super_admin" && (
          <div className="p-6 bg-card border border-border rounded-lg lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-medium text-foreground">Admin Users</h2>
              <button className="flex items-center gap-2 px-3 py-1.5 text-sm bg-primary hover:bg-primary/90 text-primary-foreground rounded transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Admin
              </button>
            </div>

            {allAdmins && allAdmins.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase">
                        User
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase">
                        Role
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase">
                        Status
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase">
                        Last Login
                      </th>
                      <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {allAdmins.map((admin) => (
                      <tr key={admin.id} className="hover:bg-muted/50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                              {admin.display_name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-foreground">
                                {admin.display_name}
                              </p>
                              <p className="text-xs text-muted-foreground">{admin.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-muted-foreground capitalize">
                            {admin.role.replace("_", " ")}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex px-2 py-0.5 text-xs rounded ${
                              admin.is_active
                                ? "bg-accent/15 text-accent"
                                : "bg-destructive/10 text-destructive"
                            }`}
                          >
                            {admin.is_active ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-muted-foreground">
                            {admin.last_login
                              ? new Date(admin.last_login).toLocaleDateString()
                              : "Never"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No admin users found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
