import { seedProducts } from "@/data/seed-products";
import { Product } from "@/types/commerce";
import { getSupabaseAdminClient } from "@/lib/supabase-server";

interface ProductRow {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image_url: string;
  category: string;
}

function toProduct(row: ProductRow): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    price: row.price,
    stock: row.stock,
    imageUrl: row.image_url,
    category: row.category
  };
}

export async function listProducts(): Promise<Product[]> {
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    return seedProducts;
  }

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) {
    return seedProducts;
  }

  const dbProducts = (data as ProductRow[]).map(toProduct);
  
  // Ensure the file-based products (with colors/images) are always shown.
  // Append any additional products found in the database.
  const seedIds = new Set(seedProducts.map(p => p.id));
  const extraDbProducts = dbProducts.filter(p => !seedIds.has(p.id));

  return [...seedProducts, ...extraDbProducts];
}

