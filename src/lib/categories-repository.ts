import "server-only";
import { promises as fs } from "fs";
import path from "path";
import { getSupabaseAdminClient } from "@/lib/supabase-server";
import { DEFAULT_CATEGORIES, CategoryItem } from "@/types/category";

const dataDir = path.join(process.cwd(), "data");
const categoriesFilePath = path.join(dataDir, "categories.json");

async function ensureFileStore(): Promise<void> {
  try {
    await fs.mkdir(dataDir, { recursive: true });
    try {
      await fs.access(categoriesFilePath);
    } catch {
      await fs.writeFile(categoriesFilePath, JSON.stringify(DEFAULT_CATEGORIES, null, 2), "utf8");
    }
  } catch {
    // Ignore file error
  }
}

async function readFileStore(): Promise<CategoryItem[]> {
  await ensureFileStore();
  try {
    const raw = await fs.readFile(categoriesFilePath, "utf8");
    const parsed = JSON.parse(raw) as CategoryItem[];
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.sort((a, b) => a.order - b.order);
    }
  } catch {
    // fallback
  }
  return [...DEFAULT_CATEGORIES];
}

async function writeFileStore(categories: CategoryItem[]): Promise<void> {
  await ensureFileStore();
  try {
    await fs.writeFile(categoriesFilePath, JSON.stringify(categories, null, 2), "utf8");
  } catch (e) {
    console.error("Failed writing categories to JSON:", e);
  }
}

export async function listCategories(): Promise<CategoryItem[]> {
  const supabase = getSupabaseAdminClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("order_index", { ascending: true });

      if (!error && data && data.length > 0) {
        return data.map((row) => ({
          id: row.id,
          title: row.title || row.id,
          nameBn: row.name_bn || row.title || row.id,
          label: row.label || "",
          description: row.description || "",
          icon: row.icon || "",
          imageUrl: row.image_url || "",
          accent: row.accent || "#0ea5e9",
          showInNav: row.show_in_nav !== false,
          order: typeof row.order_index === "number" ? row.order_index : 99
        }));
      }
    } catch {
      // Supabase table might not exist yet; fall through to file store
    }
  }

  return await readFileStore();
}

export async function saveCategory(category: CategoryItem): Promise<CategoryItem[]> {
  const current = await listCategories();
  const index = current.findIndex((c) => c.id.toLowerCase() === category.id.toLowerCase());

  let next: CategoryItem[];
  if (index >= 0) {
    next = current.map((c, i) => (i === index ? { ...c, ...category } : c));
  } else {
    next = [...current, category];
  }

  // Re-sort and normalize order
  next.sort((a, b) => a.order - b.order);
  next = next.map((c, idx) => ({ ...c, order: idx + 1 }));

  await writeFileStore(next);

  const supabase = getSupabaseAdminClient();
  if (supabase) {
    try {
      const row = {
        id: category.id,
        title: category.title,
        name_bn: category.nameBn,
        label: category.label || "",
        description: category.description || "",
        icon: category.icon || "",
        image_url: category.imageUrl || "",
        accent: category.accent || "#0ea5e9",
        show_in_nav: category.showInNav,
        order_index: category.order
      };
      await supabase.from("categories").upsert(row, { onConflict: "id" });
    } catch (e) {
      console.warn("Supabase category save fallback:", e);
    }
  }

  return next;
}

export async function deleteCategory(id: string): Promise<CategoryItem[]> {
  const current = await listCategories();
  const next = current
    .filter((c) => c.id !== id)
    .map((c, idx) => ({ ...c, order: idx + 1 }));

  await writeFileStore(next);

  const supabase = getSupabaseAdminClient();
  if (supabase) {
    try {
      await supabase.from("categories").delete().eq("id", id);
    } catch (e) {
      console.warn("Supabase category delete fallback:", e);
    }
  }

  return next;
}

export async function reorderCategories(orderedIds: string[]): Promise<CategoryItem[]> {
  const current = await listCategories();
  const map = new Map(current.map((c) => [c.id, c]));

  const next: CategoryItem[] = [];
  orderedIds.forEach((id, idx) => {
    const item = map.get(id);
    if (item) {
      next.push({ ...item, order: idx + 1 });
      map.delete(id);
    }
  });

  // Append any missing items
  map.forEach((item) => {
    next.push({ ...item, order: next.length + 1 });
  });

  await writeFileStore(next);

  const supabase = getSupabaseAdminClient();
  if (supabase) {
    try {
      for (const item of next) {
        await supabase
          .from("categories")
          .update({ order_index: item.order })
          .eq("id", item.id);
      }
    } catch (e) {
      console.warn("Supabase category reorder fallback:", e);
    }
  }

  return next;
}
