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

async function uploadToCloudinaryUnsigned(buf: Buffer, file: File): Promise<{ url: string } | { error: string }> {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
  const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET?.trim();
  if (!cloudName || !uploadPreset) {
    return { error: "Cloudinary is not configured." };
  }

  const ext = extFromMime(file.type);
  const fileName = `${randomUUID()}.${ext}`;
  const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

  const form = new FormData();
  form.append("upload_preset", uploadPreset);
  form.append("folder", "henley-zone-products");
  // Use Uint8Array to satisfy BlobPart typing across Node runtimes (Vercel build).
  form.append("file", new Blob([new Uint8Array(buf)], { type: file.type }), fileName);

  const res = await fetch(endpoint, { method: "POST", body: form });
  const data = (await res.json()) as { secure_url?: string; error?: { message?: string } };
  if (!res.ok || !data.secure_url) {
    const msg = data.error?.message || "Cloudinary upload failed.";
    return { error: msg };
  }
  return { url: data.secure_url };
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
      // If Supabase is present but Storage bucket/policy is not ready, fall back to Cloudinary when configured.
      if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_UPLOAD_PRESET) {
        return uploadToCloudinaryUnsigned(buf, file);
      }
      const hint =
        error.message?.includes("Bucket not found") || error.message?.includes("not found")
          ? ' Create a public bucket named "product-images" (see supabase/migrations) or configure CLOUDINARY_CLOUD_NAME + CLOUDINARY_UPLOAD_PRESET.'
          : "";
      return { error: `${error.message || "Storage upload failed."}${hint}` };
    }

    const { data } = supabase.storage.from("product-images").getPublicUrl(storagePath);
    return { url: data.publicUrl };
  }

  // Easy production fallback: Cloudinary unsigned upload
  if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_UPLOAD_PRESET) {
    return uploadToCloudinaryUnsigned(buf, file);
  }

  if (process.env.VERCEL) {
    return {
      error:
        "Upload is not configured for production yet. Easiest setup: add CLOUDINARY_CLOUD_NAME and CLOUDINARY_UPLOAD_PRESET in Vercel env vars, then redeploy."
    };
  }

  const dir = path.join(process.cwd(), "public", "uploads", "catalog");
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, key), buf);
  return { url: `/uploads/catalog/${key}` };
}
