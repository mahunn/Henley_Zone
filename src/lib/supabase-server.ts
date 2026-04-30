import "server-only";
import { createClient } from "@supabase/supabase-js";

function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return { url, serviceRoleKey };
}

export function isSupabaseConfigured(): boolean {
  const { url, serviceRoleKey } = getSupabaseEnv();
  return Boolean(url && serviceRoleKey);
}

export function getSupabaseAdminClient() {
  const { url, serviceRoleKey } = getSupabaseEnv();
  if (!url || !serviceRoleKey) {
    return null;
  }
  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false }
  });
}

