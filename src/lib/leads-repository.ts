import path from "path";
import { promises as fs } from "fs";
import {
  deleteLeadFromFile,
  readLeads,
  writeLead
} from "@/lib/leads-store";
import { getSupabaseAdminClient, isSupabaseConfigured } from "@/lib/supabase-server";
import { canUseLocalOrderFileStore } from "@/lib/runtime-env";
import { CheckoutLead } from "@/types/commerce";

interface CheckoutLeadRow {
  id: string;
  customer_name: string | null;
  phone: string | null;
  address: string | null;
  note: string | null;
  items: any;
  subtotal: number;
  delivery_fee: number;
  total: number;
  delivery_area: string | null;
  status: "abandoned" | "converted";
  converted_order_id: string | null;
  created_at: string;
  updated_at: string;
}

function mapLeadRow(row: CheckoutLeadRow): CheckoutLead {
  return {
    id: row.id,
    customerName: row.customer_name ?? undefined,
    phone: row.phone ?? undefined,
    address: row.address ?? undefined,
    note: row.note ?? undefined,
    items: row.items ?? [],
    subtotal: row.subtotal,
    deliveryFee: row.delivery_fee,
    total: row.total,
    deliveryArea: row.delivery_area ?? undefined,
    status: row.status,
    convertedOrderId: row.converted_order_id ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function assertLeadsPersistenceAvailable(): void {
  if (isSupabaseConfigured()) {
    return;
  }
  if (canUseLocalOrderFileStore()) {
    return;
  }
  throw new Error("Leads storage is not configured.");
}

export async function saveLead(lead: CheckoutLead): Promise<void> {
  assertLeadsPersistenceAvailable();
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    await writeLead(lead);
    return;
  }

  const payload: Partial<CheckoutLeadRow> = {
    id: lead.id,
    customer_name: lead.customerName?.trim() || null,
    phone: lead.phone?.trim() || null,
    address: lead.address?.trim() || null,
    note: lead.note?.trim() || null,
    items: lead.items,
    subtotal: lead.subtotal,
    delivery_fee: lead.deliveryFee,
    total: lead.total,
    delivery_area: lead.deliveryArea || null,
    status: lead.status,
    converted_order_id: lead.convertedOrderId || null,
    updated_at: new Date().toISOString()
  };

  // Check if lead already exists to preserve its created_at if we want,
  // or we can let Supabase upsert handle it because created_at has a default now().
  // However, onConflict upsert in Supabase might overwrite created_at if we pass it,
  // but if we don't pass created_at, it will preserve it.
  const { error } = await supabase
    .from("checkout_leads")
    .upsert(payload, { onConflict: "id" });

  if (error) {
    throw new Error(error.message || "Could not save checkout lead.");
  }
}

export async function listLeads(): Promise<CheckoutLead[]> {
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    if (!canUseLocalOrderFileStore()) {
      return [];
    }
    const fileLeads = await readLeads();
    return fileLeads.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }

  const { data, error } = await supabase
    .from("checkout_leads")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error || !data) {
    if (canUseLocalOrderFileStore()) {
      const fileLeads = await readLeads();
      return fileLeads.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    }
    throw new Error(error?.message || "Could not load leads from database.");
  }

  return (data as CheckoutLeadRow[]).map(mapLeadRow);
}

export async function deleteLead(
  leadId: string
): Promise<{ deleted: boolean; reason?: string }> {
  const trimmedId = leadId.trim();
  if (!trimmedId) {
    return { deleted: false, reason: "Missing lead id." };
  }

  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    const deleted = await deleteLeadFromFile(trimmedId);
    return {
      deleted,
      reason: deleted ? undefined : "Lead not found in local store."
    };
  }

  const { data, error } = await supabase
    .from("checkout_leads")
    .delete()
    .eq("id", trimmedId)
    .select("id")
    .limit(1);

  if (error || !data?.length) {
    if (canUseLocalOrderFileStore()) {
      const deletedInFile = await deleteLeadFromFile(trimmedId);
      if (deletedInFile) {
        return { deleted: true };
      }
    }
    return {
      deleted: false,
      reason: error?.message || "Lead not found."
    };
  }

  return { deleted: true };
}

export async function markLeadAsConverted(
  leadId: string,
  orderId: string
): Promise<void> {
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    if (canUseLocalOrderFileStore()) {
      const leads = await readLeads();
      const index = leads.findIndex((l) => l.id === leadId);
      if (index !== -1) {
        leads[index] = {
          ...leads[index],
          status: "converted",
          convertedOrderId: orderId,
          updatedAt: new Date().toISOString()
        };
        const dataDir = path.join(process.cwd(), "data");
        const leadsPath = path.join(dataDir, "leads.json");
        await fs.writeFile(leadsPath, JSON.stringify(leads, null, 2), "utf8");
      }
    }
    return;
  }

  const { error } = await supabase
    .from("checkout_leads")
    .update({
      status: "converted",
      converted_order_id: orderId,
      updated_at: new Date().toISOString()
    })
    .eq("id", leadId);

  if (error) {
    throw new Error(error.message || "Failed to mark lead as converted.");
  }
}
