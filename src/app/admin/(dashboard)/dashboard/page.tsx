import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

// Stats card component
function StatCard({
  title,
  value,
  icon,
  href,
  color = "amber",
}: {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  href: string;
  color?: "amber" | "green" | "blue" | "purple";
}) {
  const colorClasses = {
    amber: "bg-primary/10 text-primary border-primary/20",
    green: "bg-accent/15 text-accent border-accent/20",
    blue: "bg-secondary/60 text-secondary-foreground border-border",
    purple: "bg-primary/10 text-primary border-primary/20",
  };

  return (
    <Link
      href={href}
      className="block p-6 bg-card border border-border rounded-lg hover:border-border transition-colors group"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg border ${colorClasses[color]}`}>
          {icon}
        </div>
        <svg
          className="w-5 h-5 text-muted-foreground group-hover:text-muted-foreground transition-colors"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
      <p className="text-3xl font-light text-foreground mb-1">{value}</p>
      <p className="text-sm text-muted-foreground">{title}</p>
    </Link>
  );
}

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  // Fetch stats
  const [postsResult, publishedResult, categoriesResult, authorsResult, contentResult] = await Promise.all([
    supabase.from("blog_posts").select("*", { count: "exact", head: true }),
    supabase.from("blog_posts").select("*", { count: "exact", head: true }).eq("status", "published"),
    supabase.from("blog_categories").select("*", { count: "exact", head: true }),
    supabase.from("blog_authors").select("*", { count: "exact", head: true }),
    supabase.from("site_content").select("*", { count: "exact", head: true }),
  ]);

  const stats = {
    totalPosts: postsResult.count || 0,
    publishedPosts: publishedResult.count || 0,
    categories: categoriesResult.count || 0,
    authors: authorsResult.count || 0,
    contentKeys: contentResult.count || 0,
  };

  // Fetch recent activity
  const { data: recentActivity } = await supabase
    .from("admin_activity_log")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-light text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to the LAXMI admin dashboard. Manage your content and blog posts here.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Blog Posts"
          value={stats.totalPosts}
          href="/admin/blog"
          color="amber"
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          }
        />
        <StatCard
          title="Published Posts"
          value={stats.publishedPosts}
          href="/admin/blog?status=published"
          color="green"
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatCard
          title="Categories"
          value={stats.categories}
          href="/admin/categories"
          color="blue"
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
            </svg>
          }
        />
        <StatCard
          title="Content Keys"
          value={stats.contentKeys}
          href="/admin/content"
          color="purple"
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          }
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Quick Actions Card */}
        <div className="p-6 bg-card border border-border rounded-lg">
          <h2 className="text-lg font-medium text-foreground mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <Link
              href="/admin/blog/new"
              className="flex items-center gap-3 p-4 bg-muted rounded-lg hover:bg-muted transition-colors"
            >
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <span className="text-sm text-foreground">New Blog Post</span>
            </Link>
            <Link
              href="/admin/content"
              className="flex items-center gap-3 p-4 bg-muted rounded-lg hover:bg-muted transition-colors"
            >
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <span className="text-sm text-foreground">Edit Content</span>
            </Link>
            <Link
              href="/admin/categories"
              className="flex items-center gap-3 p-4 bg-muted rounded-lg hover:bg-muted transition-colors"
            >
              <div className="p-2 bg-secondary/60 rounded-lg text-secondary-foreground">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <span className="text-sm text-foreground">Manage Categories</span>
            </Link>
            <Link
              href="/admin/authors"
              className="flex items-center gap-3 p-4 bg-muted rounded-lg hover:bg-muted transition-colors"
            >
              <div className="p-2 bg-accent/15 rounded-lg text-accent">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <span className="text-sm text-foreground">Manage Authors</span>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="p-6 bg-card border border-border rounded-lg">
          <h2 className="text-lg font-medium text-foreground mb-4">Recent Activity</h2>
          {recentActivity && recentActivity.length > 0 ? (
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center gap-3 p-3 bg-muted rounded-lg"
                >
                  <div className="p-2 bg-muted rounded-full">
                    <svg className="w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground truncate">
                      {activity.action} - {activity.entity_type}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(activity.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <svg className="w-12 h-12 text-muted-foreground mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-muted-foreground">No recent activity</p>
            </div>
          )}
        </div>
      </div>

      {/* Getting Started */}
      <div className="p-6 bg-card border border-border rounded-lg">
        <h2 className="text-lg font-medium text-foreground mb-4">Getting Started</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-muted rounded-lg">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-3">
              <span className="font-bold">1</span>
            </div>
            <h3 className="text-sm font-medium text-foreground mb-1">Seed Initial Data</h3>
            <p className="text-xs text-muted-foreground">
              Run the migration scripts to populate the database with initial content and blog posts.
            </p>
          </div>
          <div className="p-4 bg-muted rounded-lg">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-3">
              <span className="font-bold">2</span>
            </div>
            <h3 className="text-sm font-medium text-foreground mb-1">Edit Content</h3>
            <p className="text-xs text-muted-foreground">
              Update your website copy for both English and Italian languages from the Content section.
            </p>
          </div>
          <div className="p-4 bg-muted rounded-lg">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-3">
              <span className="font-bold">3</span>
            </div>
            <h3 className="text-sm font-medium text-foreground mb-1">Create Blog Posts</h3>
            <p className="text-xs text-muted-foreground">
              Add new blog posts with SEO-optimized content in both languages.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
