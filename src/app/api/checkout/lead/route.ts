import { NextResponse } from "next/server";
import {
  deleteLead,
  listLeads,
  markLeadAsConverted,
  saveLead
} from "@/lib/leads-repository";
import { CheckoutLead } from "@/types/commerce";
import { isAdminAuthorized } from "@/lib/admin-request";
import { withAdminSessionRefresh } from "@/lib/admin-session-response";

export async function GET() {
  try {
    if (!(await isAdminAuthorized())) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const leads = await listLeads();
    return withAdminSessionRefresh(NextResponse.json({ leads }));
  } catch (e) {
    console.error("Failed to read leads:", e);
    return NextResponse.json(
      { message: "Failed to read leads." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.id || !Array.isArray(body.items)) {
      return NextResponse.json(
        { message: "Invalid lead payload." },
        { status: 400 }
      );
    }

    // Skip saving lead if phone number is not provided
    if (!body.phone || !body.phone.trim()) {
      return NextResponse.json(
        { ok: false, message: "Skipped: phone number is required to save lead." },
        { status: 200 }
      );
    }

    // Determine created_at (keep existing if known, or generate new)
    let createdAt = body.createdAt;
    if (!createdAt) {
      createdAt = new Date().toISOString();
    }

    const lead: CheckoutLead = {
      id: body.id,
      customerName: body.customerName || undefined,
      phone: body.phone || undefined,
      address: body.address || undefined,
      note: body.note || undefined,
      items: body.items,
      subtotal: Number(body.subtotal) || 0,
      deliveryFee: Number(body.deliveryFee) || 0,
      total: Number(body.total) || 0,
      deliveryArea: body.deliveryArea || undefined,
      status: body.status || "abandoned",
      convertedOrderId: body.convertedOrderId || undefined,
      createdAt,
      updatedAt: new Date().toISOString()
    };

    await saveLead(lead);
    return NextResponse.json({ ok: true, leadId: lead.id }, { status: 201 });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to save lead.";
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    if (!(await isAdminAuthorized())) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const body = (await request.json()) as {
      leadId?: string;
      status?: "abandoned" | "converted";
      orderId?: string;
    };

    if (!body.leadId || !body.status) {
      return NextResponse.json(
        { message: "Invalid update payload." },
        { status: 400 }
      );
    }

    if (body.status === "converted") {
      await markLeadAsConverted(body.leadId, body.orderId || "MANUAL");
    } else {
      // Revert to abandoned (clear order reference)
      const supabase = require("@/lib/supabase-server").getSupabaseAdminClient();
      if (!supabase) {
        const { readLeads } = require("@/lib/leads-store");
        const path = require("path");
        const { promises: fs } = require("fs");
        const leads = await readLeads();
        const index = leads.findIndex((l: CheckoutLead) => l.id === body.leadId);
        if (index !== -1) {
          leads[index] = {
            ...leads[index],
            status: "abandoned",
            convertedOrderId: undefined,
            updatedAt: new Date().toISOString()
          };
          const dataDir = path.join(process.cwd(), "data");
          const leadsPath = path.join(dataDir, "leads.json");
          await fs.writeFile(leadsPath, JSON.stringify(leads, null, 2), "utf8");
        }
      } else {
        await supabase
          .from("checkout_leads")
          .update({
            status: "abandoned",
            converted_order_id: null,
            updated_at: new Date().toISOString()
          })
          .eq("id", body.leadId);
      }
    }

    return withAdminSessionRefresh(NextResponse.json({ ok: true }));
  } catch (e) {
    console.error("Failed to update lead status:", e);
    return NextResponse.json(
      { message: "Failed to update lead status." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    if (!(await isAdminAuthorized())) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const body = (await request.json()) as { leadIds?: string[] };
    const leadIds = (body.leadIds ?? [])
      .map((id) => id.trim())
      .filter(Boolean);

    if (!leadIds.length) {
      return NextResponse.json(
        { message: "No lead ids provided." },
        { status: 400 }
      );
    }

    const deleted: string[] = [];
    const failed: { id: string; reason: string }[] = [];

    for (const leadId of leadIds) {
      const result = await deleteLead(leadId);
      if (result.deleted) {
        deleted.push(leadId);
      } else {
        failed.push({ id: leadId, reason: result.reason || "Delete failed." });
      }
    }

    if (!deleted.length) {
      return NextResponse.json(
        { message: failed[0]?.reason || "Could not delete leads.", failed },
        { status: 400 }
      );
    }

    return withAdminSessionRefresh(
      NextResponse.json({ ok: true, deleted, failed })
    );
  } catch (e) {
    console.error("Failed to delete leads:", e);
    return NextResponse.json(
      { message: "Failed to delete leads." },
      { status: 500 }
    );
  }
}
