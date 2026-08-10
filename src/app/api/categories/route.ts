import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { isAdminAuthorized } from "@/lib/admin-request";
import { withAdminSessionRefresh } from "@/lib/admin-session-response";
import {
  listCategories,
  saveCategory,
  deleteCategory,
  reorderCategories
} from "@/lib/categories-repository";
import type { CategoryItem } from "@/types/category";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const includeAll = url.searchParams.get("all") === "1" || url.searchParams.get("all") === "true";
    const categories = await listCategories();

    if (includeAll) {
      return NextResponse.json({ categories });
    }

    const visible = categories.filter((c) => c.showInNav !== false);
    return NextResponse.json({ categories: visible });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to load categories.";
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (!(await isAdminAuthorized())) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    let json: unknown;
    try {
      json = await request.json();
    } catch {
      return NextResponse.json({ message: "Invalid JSON." }, { status: 400 });
    }

    if (!json || typeof json !== "object") {
      return NextResponse.json({ message: "Invalid category payload." }, { status: 400 });
    }

    const body = json as Record<string, unknown>;
    const title = typeof body.title === "string" ? body.title.trim() : "";
    const id = (typeof body.id === "string" && body.id.trim()) ? body.id.trim() : title;
    const nameBn = typeof body.nameBn === "string" ? body.nameBn.trim() : title;
    const label = typeof body.label === "string" ? body.label.trim() : "";
    const description = typeof body.description === "string" ? body.description.trim() : "";
    const imageUrl = typeof body.imageUrl === "string" ? body.imageUrl.trim() : "";
    const icon = typeof body.icon === "string" ? body.icon.trim() : "✨";
    const accent = typeof body.accent === "string" ? body.accent.trim() : "#0ea5e9";
    const showInNav = body.showInNav !== false;
    const order = typeof body.order === "number" ? body.order : 99;

    if (!id || !title) {
      return NextResponse.json({ message: "Category title is required." }, { status: 400 });
    }

    const item: CategoryItem = {
      id,
      title,
      nameBn: nameBn || title,
      label,
      description,
      imageUrl,
      icon,
      accent,
      showInNav,
      order
    };

    const categories = await saveCategory(item);

    try {
      revalidateTag("categories", "default");
      revalidatePath("/");
      revalidatePath("/store");
      revalidatePath("/admin/categories");
    } catch (e) {
      console.warn("Revalidation failed:", e);
    }

    return withAdminSessionRefresh(NextResponse.json({ ok: true, categories }, { status: 201 }));
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to create category.";
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    if (!(await isAdminAuthorized())) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    let json: unknown;
    try {
      json = await request.json();
    } catch {
      return NextResponse.json({ message: "Invalid JSON." }, { status: 400 });
    }

    if (!json || typeof json !== "object") {
      return NextResponse.json({ message: "Invalid payload." }, { status: 400 });
    }

    const body = json as Record<string, unknown>;

    // Handle reordering array
    if (Array.isArray(body.reorderIds)) {
      const ids = body.reorderIds.filter((x): x is string => typeof x === "string");
      const categories = await reorderCategories(ids);

      try {
        revalidateTag("categories", "default");
        revalidatePath("/");
        revalidatePath("/store");
        revalidatePath("/admin/categories");
      } catch (e) {
        console.warn("Revalidation failed:", e);
      }

      return withAdminSessionRefresh(NextResponse.json({ ok: true, categories }));
    }

    // Handle individual edit
    const id = typeof body.id === "string" ? body.id.trim() : "";
    const title = typeof body.title === "string" ? body.title.trim() : id;
    const nameBn = typeof body.nameBn === "string" ? body.nameBn.trim() : title;
    const label = typeof body.label === "string" ? body.label.trim() : "";
    const description = typeof body.description === "string" ? body.description.trim() : "";
    const imageUrl = typeof body.imageUrl === "string" ? body.imageUrl.trim() : "";
    const icon = typeof body.icon === "string" ? body.icon.trim() : "✨";
    const accent = typeof body.accent === "string" ? body.accent.trim() : "#0ea5e9";
    const showInNav = body.showInNav !== false;
    const order = typeof body.order === "number" ? body.order : 99;

    if (!id || !title) {
      return NextResponse.json({ message: "Category id and title are required." }, { status: 400 });
    }

    const item: CategoryItem = {
      id,
      title,
      nameBn: nameBn || title,
      label,
      description,
      imageUrl,
      icon,
      accent,
      showInNav,
      order
    };

    const categories = await saveCategory(item);

    try {
      revalidateTag("categories", "default");
      revalidatePath("/");
      revalidatePath("/store");
      revalidatePath("/admin/categories");
    } catch (e) {
      console.warn("Revalidation failed:", e);
    }

    return withAdminSessionRefresh(NextResponse.json({ ok: true, categories }));
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to update category.";
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    if (!(await isAdminAuthorized())) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const url = new URL(request.url);
    const id = url.searchParams.get("id")?.trim() || "";

    if (!id) {
      return NextResponse.json({ message: "Category id is required." }, { status: 400 });
    }

    const categories = await deleteCategory(id);

    try {
      revalidateTag("categories", "default");
      revalidatePath("/");
      revalidatePath("/store");
      revalidatePath("/admin/categories");
    } catch (e) {
      console.warn("Revalidation failed:", e);
    }

    return withAdminSessionRefresh(NextResponse.json({ ok: true, categories }));
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to delete category.";
    return NextResponse.json({ message }, { status: 500 });
  }
}
