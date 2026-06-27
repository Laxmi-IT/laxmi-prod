import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { BlogDeleteButton } from "@/components/admin/BlogDeleteButton";

// Status badge component
function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    published: "bg-accent/15 text-accent border-accent/20",
    draft: "bg-primary/10 text-primary border-primary/20",
    archived: "bg-muted text-muted-foreground border-border",
  };

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded border ${styles[status] || styles.draft}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();

  // Build query
  let query = supabase
    .from("blog_posts")
    .select(`
      *,
      blog_authors ( name ),
      blog_categories ( name_en )
    `)
    .order("created_at", { ascending: false });

  // Filter by status if provided
  if (params.status) {
    query = query.eq("status", params.status);
  }

  const { data: posts, error } = await query;

  if (error) {
    console.error("Error fetching posts:", error);
  }

  // Get counts by status
  const { count: totalCount } = await supabase
    .from("blog_posts")
    .select("*", { count: "exact", head: true });

  const { count: publishedCount } = await supabase
    .from("blog_posts")
    .select("*", { count: "exact", head: true })
    .eq("status", "published");

  const { count: draftCount } = await supabase
    .from("blog_posts")
    .select("*", { count: "exact", head: true })
    .eq("status", "draft");

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-light text-foreground mb-2">Blog Posts</h1>
          <p className="text-muted-foreground">
            Manage your blog posts in both English and Italian.
          </p>
        </div>
        <Link
          href="/admin/blog/new"
          className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Post
        </Link>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-2 mb-6">
        <Link
          href="/admin/blog"
          className={`px-4 py-2 text-sm rounded-lg transition-colors ${
            !params.status
              ? "bg-primary/10 text-primary border border-primary/20"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
        >
          All ({totalCount || 0})
        </Link>
        <Link
          href="/admin/blog?status=published"
          className={`px-4 py-2 text-sm rounded-lg transition-colors ${
            params.status === "published"
              ? "bg-accent/15 text-accent border border-accent/20"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
        >
          Published ({publishedCount || 0})
        </Link>
        <Link
          href="/admin/blog?status=draft"
          className={`px-4 py-2 text-sm rounded-lg transition-colors ${
            params.status === "draft"
              ? "bg-primary/10 text-primary border border-primary/20"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
        >
          Drafts ({draftCount || 0})
        </Link>
      </div>

      {/* Posts Table */}
      {posts && posts.length > 0 ? (
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-6 py-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Title
                </th>
                <th className="text-left px-6 py-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Category
                </th>
                <th className="text-left px-6 py-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Author
                </th>
                <th className="text-left px-6 py-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left px-6 py-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Date
                </th>
                <th className="text-right px-6 py-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {post.featured_image && (
                        <div className="w-10 h-10 rounded bg-muted flex-shrink-0 overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={post.featured_image}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {post.title_en}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {post.title_it}
                        </p>
                      </div>
                      {post.featured && (
                        <span className="px-2 py-0.5 text-xs bg-primary/10 text-primary border border-primary/20 rounded">
                          Featured
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-muted-foreground">
                      {post.blog_categories?.name_en || "—"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-muted-foreground">
                      {post.blog_authors?.name || "—"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={post.status} />
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-muted-foreground">
                      {new Date(post.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/blog/${post.id}/edit`}
                        className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors"
                        title="Edit"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </Link>
                      <Link
                        href={`/en/blog/${post.slug}`}
                        target="_blank"
                        className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors"
                        title="View"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </Link>
                      <BlogDeleteButton postId={post.id} postTitle={post.title_en} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12 bg-card border border-border rounded-lg">
          <svg className="w-16 h-16 text-muted-foreground mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
          <h3 className="text-lg font-medium text-foreground mb-2">No Blog Posts</h3>
          <p className="text-sm text-muted-foreground mb-6">
            {params.status
              ? `No ${params.status} posts found.`
              : "Get started by creating your first blog post."}
          </p>
          <Link
            href="/admin/blog/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Post
          </Link>
        </div>
      )}
    </div>
  );
}
