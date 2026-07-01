import { promises as fs } from "fs";
import path from "path";
import { canUseLocalOrderFileStore } from "@/lib/runtime-env";
import { CheckoutLead } from "@/types/commerce";

const dataDir = path.join(process.cwd(), "data");
const leadsPath = path.join(dataDir, "leads.json");

async function ensureStore() {
  if (!canUseLocalOrderFileStore()) {
    return;
  }
  await fs.mkdir(dataDir, { recursive: true });
  try {
    await fs.access(leadsPath);
  } catch {
    await fs.writeFile(leadsPath, "[]", "utf8");
  }
}

export async function readLeads(): Promise<CheckoutLead[]> {
  if (!canUseLocalOrderFileStore()) {
    try {
      const raw = await fs.readFile(leadsPath, "utf8");
      return JSON.parse(raw) as CheckoutLead[];
    } catch {
      return [];
    }
  }

  await ensureStore();
  const raw = await fs.readFile(leadsPath, "utf8");
  return JSON.parse(raw) as CheckoutLead[];
}

export async function writeLead(lead: CheckoutLead): Promise<void> {
  if (!canUseLocalOrderFileStore()) return;
  await ensureStore();
  const all = await readLeads();
  const index = all.findIndex((l) => l.id === lead.id);
  if (index !== -1) {
    all[index] = lead;
  } else {
    all.unshift(lead);
  }
  await fs.writeFile(leadsPath, JSON.stringify(all, null, 2), "utf8");
}

export async function deleteLeadFromFile(leadId: string): Promise<boolean> {
  if (!canUseLocalOrderFileStore()) {
    return false;
  }
  await ensureStore();
  const all = await readLeads();
  const next = all.filter((l) => l.id !== leadId);
  if (next.length === all.length) {
    return false;
  }
  await fs.writeFile(leadsPath, JSON.stringify(next, null, 2), "utf8");
  return true;
}
