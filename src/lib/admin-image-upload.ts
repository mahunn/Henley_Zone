import "server-only";
import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { getSupabaseAdminClient, isSupabaseConfigured } from "@/lib/supabase-server";

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

function extFromMime(mime: string): string {
  if (mime === "image/jpeg") return "jpg";
  if (mime === "image/png") return "png";
  if (mime === "image/webp") return "webp";
  if (mime === "image/gif") return "gif";
  return "bin";
}

/**
 * Saves an admin-uploaded product image to Supabase Storage when configured,
 * otherwise to `public/uploads/catalog/` (local / self-hosted only — not on Vercel).
 */
export async function saveAdminProductImage(file: File): Promise<{ url: string } | { error: string }> {
  if (!file || typeof file.arrayBuffer !== "function") {
    return { error: "No file received." };
  }
  if (!ALLOWED.has(file.type)) {
    return { error: "Only JPEG, PNG, WebP, or GIF images are allowed." };
  }

  const buf = Buffer.from(await file.arrayBuffer());
  if (buf.length === 0) {
    return { error: "Empty file." };
  }
  if (buf.length > MAX_IMAGE_BYTES) {
    return { error: "Image must be 5 MB or smaller." };
  }

  const ext = extFromMime(file.type);
  const key = `${randomUUID()}.${ext}`;
  const storagePath = `catalog/${key}`;

  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdminClient();
    if (!supabase) {
      return { error: "Supabase client could not be created." };
    }

    const { error } = await supabase.storage.from("product-images").upload(storagePath, buf, {
      contentType: file.type,
      upsert: false
    });

    if (error) {
      const hint =
        error.message?.includes("Bucket not found") || error.message?.includes("not found")
          ? ' Create a public bucket named "product-images" (see supabase/migrations) or use "Paste image URL" below.'
          : "";
      return { error: `${error.message || "Storage upload failed."}${hint}` };
    }

    const { data } = supabase.storage.from("product-images").getPublicUrl(storagePath);
    return { url: data.publicUrl };
  }

  if (process.env.VERCEL) {
    return {
      error:
        "File upload on Vercel requires Supabase Storage. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY, add the product-images bucket (see supabase/migrations), or paste an image URL instead."
    };
  }

  const dir = path.join(process.cwd(), "public", "uploads", "catalog");
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, key), buf);
  return { url: `/uploads/catalog/${key}` };
}
