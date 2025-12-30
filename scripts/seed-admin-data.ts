/**
 * Seed Admin Data Script
 *
 * This script seeds the admin dashboard with:
 * 1. An initial super_admin user
 * 2. Blog authors from static data
 * 3. Blog categories from static data
 * 4. Blog posts from static data
 * 5. Site content from translation files
 *
 * Usage:
 * 1. First, create a Supabase user via the dashboard or signUp API
 * 2. Set ADMIN_EMAIL env variable to match the user's email
 * 3. Run: npx tsx scripts/seed-admin-data.ts
 */

import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import { authors, categories, posts } from "../src/lib/blog/data";
import enDict from "../src/i18n/dictionaries/en.json";
import itDict from "../src/i18n/dictionaries/it.json";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing environment variables:");
  console.error("- NEXT_PUBLIC_SUPABASE_URL");
  console.error("- SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Helper to flatten nested object keys
function flattenObject(
  obj: Record<string, unknown>,
  prefix = ""
): Record<string, string> {
  const result: Record<string, string> = {};

  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}.${key}` : key;

    if (value && typeof value === "object" && !Array.isArray(value)) {
      Object.assign(result, flattenObject(value as Record<string, unknown>, newKey));
    } else if (typeof value === "string") {
      result[newKey] = value;
    } else if (Array.isArray(value)) {
      // Store arrays as JSON strings
      result[newKey] = JSON.stringify(value);
    }
  }

  return result;
}

// Get section from content key
function getSectionFromKey(key: string): string {
  return key.split(".")[0];
}

async function seedAuthors() {
  console.log("\n📝 Seeding blog authors...");

  for (const author of authors) {
    const { error } = await supabase.from("blog_authors").upsert(
      {
        id: undefined, // Let Supabase generate UUID
        name: author.name,
        slug: author.id, // Use the static ID as slug
        role_en: author.role,
        role_it: author.roleIT,
        bio_en: author.bio,
        bio_it: author.bioIT,
        avatar_url: author.avatar || null,
      },
      { onConflict: "slug" }
    );

    if (error) {
      console.error(`  ❌ Error seeding author ${author.name}:`, error.message);
    } else {
      console.log(`  ✓ Author: ${author.name}`);
    }
  }
}

async function seedCategories() {
  console.log("\n📁 Seeding blog categories...");

  let sortOrder = 0;
  for (const category of categories) {
    const { error } = await supabase.from("blog_categories").upsert(
      {
        id: undefined, // Let Supabase generate UUID
        name_en: category.name,
        name_it: category.nameIT,
        slug: category.slug,
        description_en: category.description,
        description_it: category.descriptionIT,
        sort_order: sortOrder++,
      },
      { onConflict: "slug" }
    );

    if (error) {
      console.error(`  ❌ Error seeding category ${category.name}:`, error.message);
    } else {
      console.log(`  ✓ Category: ${category.name}`);
    }
  }
}

async function seedPosts() {
  console.log("\n📄 Seeding blog posts...");

  // First, get author and category mappings
  const { data: dbAuthors } = await supabase.from("blog_authors").select("id, slug");
  const { data: dbCategories } = await supabase.from("blog_categories").select("id, slug");

  const authorMap = new Map(dbAuthors?.map((a) => [a.slug, a.id]) || []);
  const categoryMap = new Map(dbCategories?.map((c) => [c.slug, c.id]) || []);

  for (const post of posts) {
    // Find author ID - map from static author ID to slug
    const authorSlug = post.author; // In static data, author is the ID which we use as slug
    const authorId = authorMap.get(authorSlug) || null;

    // Find category ID
    const categorySlug = categories.find((c) => c.id === post.category)?.slug;
    const categoryId = categorySlug ? categoryMap.get(categorySlug) : null;

    const { error } = await supabase.from("blog_posts").upsert(
      {
        slug: post.slug,
        title_en: post.title,
        title_it: post.titleIT,
        excerpt_en: post.excerpt,
        excerpt_it: post.excerptIT,
        content_en: post.content,
        content_it: post.contentIT,
        tags_en: post.tags,
        tags_it: post.tagsIT,
        featured_image: post.featuredImage,
        featured_image_alt_en: post.featuredImageAlt,
        featured_image_alt_it: post.featuredImageAltIT,
        author_id: authorId,
        category_id: categoryId,
        reading_time: post.readingTime,
        schema_type: post.schemaType,
        status: post.status,
        featured: post.featured,
        published_at: post.status === "published" ? post.publishedAt : null,
        seo_title_en: post.seoTitle,
        seo_title_it: post.seoTitleIT,
        seo_description_en: post.seoDescription,
        seo_description_it: post.seoDescriptionIT,
        seo_keywords_en: post.seoKeywords,
        seo_keywords_it: post.seoKeywordsIT,
      },
      { onConflict: "slug" }
    );

    if (error) {
      console.error(`  ❌ Error seeding post "${post.title.substring(0, 50)}...":`, error.message);
    } else {
      console.log(`  ✓ Post: ${post.title.substring(0, 50)}...`);
    }

    // Seed FAQs if present
    if (post.faqs && post.faqs.length > 0) {
      const { data: dbPost } = await supabase
        .from("blog_posts")
        .select("id")
        .eq("slug", post.slug)
        .single();

      if (dbPost) {
        for (let i = 0; i < post.faqs.length; i++) {
          const faq = post.faqs[i];
          await supabase.from("blog_post_faqs").upsert(
            {
              post_id: dbPost.id,
              question_en: faq.question,
              question_it: faq.questionIT,
              answer_en: faq.answer,
              answer_it: faq.answerIT,
              sort_order: i,
            },
            { onConflict: "post_id,sort_order", ignoreDuplicates: true }
          );
        }
        console.log(`    ✓ Added ${post.faqs.length} FAQs`);
      }
    }
  }
}

async function seedSiteContent() {
  console.log("\n🌐 Seeding site content from translations...");

  const enFlat = flattenObject(enDict as Record<string, unknown>);
  const itFlat = flattenObject(itDict as Record<string, unknown>);

  let seededCount = 0;
  let skippedCount = 0;

  for (const [key, enValue] of Object.entries(enFlat)) {
    const itValue = itFlat[key] || enValue;
    const section = getSectionFromKey(key);

    // Determine content type
    let contentType = "text";
    if (enValue.includes("\n") || enValue.length > 200) {
      contentType = "richtext";
    }
    if (enValue.startsWith("[") || enValue.startsWith("{")) {
      contentType = "json";
    }

    const { error } = await supabase.from("site_content").upsert(
      {
        content_key: key,
        section,
        content_en: enValue,
        content_it: itValue,
        content_type: contentType,
        is_array: enValue.startsWith("["),
      },
      { onConflict: "content_key" }
    );

    if (error) {
      console.error(`  ❌ Error seeding content key "${key}":`, error.message);
      skippedCount++;
    } else {
      seededCount++;
    }
  }

  console.log(`  ✓ Seeded ${seededCount} content keys`);
  if (skippedCount > 0) {
    console.log(`  ⚠ Skipped ${skippedCount} keys due to errors`);
  }
}

async function main() {
  console.log("🚀 Starting admin data seed...\n");
  console.log(`Database: ${supabaseUrl}`);

  try {
    // Seed in order
    await seedAuthors();
    await seedCategories();
    await seedPosts();
    await seedSiteContent();

    console.log("\n✅ Seed completed successfully!");
    console.log("\nNext steps:");
    console.log("1. Create an admin user in Supabase Auth dashboard");
    console.log("2. Add the user to admin_users table with role 'super_admin'");
    console.log("3. Access the admin dashboard at /admin/login");
  } catch (error) {
    console.error("\n❌ Seed failed:", error);
    process.exit(1);
  }
}

main();
