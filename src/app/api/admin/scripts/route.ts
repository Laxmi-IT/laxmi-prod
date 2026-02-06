import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { readFile } from "fs/promises";
import path from "path";

const ALLOWED_SCRIPTS: Record<string, string> = {
  "arrexlab_full_downloader.py": "scripts/arrexlab_full_downloader.py",
};

export async function GET(request: NextRequest) {
  const fileName = request.nextUrl.searchParams.get("file");

  if (!fileName || !ALLOWED_SCRIPTS[fileName]) {
    return NextResponse.json({ error: "Invalid file" }, { status: 400 });
  }

  // Check authentication
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check admin status
  const { data: adminUser, error: adminError } = await supabase
    .from("admin_users")
    .select("role, is_active")
    .eq("id", user.id)
    .single();

  if (adminError || !adminUser?.is_active) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Read and return the script file
  const filePath = path.join(process.cwd(), ALLOWED_SCRIPTS[fileName]);

  try {
    const fileContent = await readFile(filePath);
    return new NextResponse(fileContent, {
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename="${fileName}"`,
      },
    });
  } catch {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
}
