import { redirect, notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { BlogPostEditor } from '@/components/admin/BlogPostEditor';

export default async function EditBlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/admin/login');
  }

  // Fetch the post
  const { data: post, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !post) {
    notFound();
  }

  // Fetch authors and categories
  const [authorsResult, categoriesResult] = await Promise.all([
    supabase.from('blog_authors').select('id, name').order('name'),
    supabase.from('blog_categories').select('id, name_en, name_it').order('sort_order'),
  ]);

  const authors = authorsResult.data || [];
  const categories = categoriesResult.data || [];

  return (
    <BlogPostEditor
      post={post}
      authors={authors}
      categories={categories}
      userId={user.id}
    />
  );
}
