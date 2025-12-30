import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAdminUser, getSiteContentBySection, getContentSections } from "@/lib/admin/queries";
import { ContentSectionClient } from "./ContentSectionClient";

interface ContentSectionPageProps {
  params: Promise<{ section: string }>;
}

export default async function ContentSectionPage({ params }: ContentSectionPageProps) {
  const { section } = await params;

  // Get authenticated user
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  // Verify admin status
  const adminUser = await getAdminUser(user.id);
  if (!adminUser) {
    redirect("/admin/login?error=unauthorized");
  }

  // Get section info
  const sections = await getContentSections();
  const sectionInfo = sections.find((s) => s.section_key === section);

  if (!sectionInfo) {
    notFound();
  }

  // Get content for this section
  const content = await getSiteContentBySection(section);

  if (!content || content.length === 0) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <a
            href="/admin/content"
            className="inline-flex items-center text-sm text-zinc-400 hover:text-amber-500 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Content
          </a>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-12 text-center">
          <h2 className="text-lg font-medium text-white mb-2">{sectionInfo.display_name_en}</h2>
          <p className="text-zinc-400">No content items found for this section.</p>
        </div>
      </div>
    );
  }

  return (
    <ContentSectionClient
      sectionInfo={sectionInfo}
      content={content}
      userId={user.id}
    />
  );
}
