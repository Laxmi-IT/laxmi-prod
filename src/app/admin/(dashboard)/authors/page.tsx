import { createClient } from "@/lib/supabase/server";
import { AuthorsClient } from "./AuthorsClient";

export default async function AuthorsPage() {
  const supabase = await createClient();

  const { data: authors } = await supabase
    .from("blog_authors")
    .select("*")
    .order("name");

  return <AuthorsClient authors={authors || []} />;
}
