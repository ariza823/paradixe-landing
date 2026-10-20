import type { SupabaseClient } from "@supabase/supabase-js";

export interface SupabaseConfig {
  url: string;
  key: string;
}

const url = import.meta.env["VITE_SUPABASE_URL"] as string | undefined;
const key = import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"] as string | undefined;

export const supabaseConfig: SupabaseConfig | null = url && key ? { url, key } : null;

export const isDemoMode = supabaseConfig === null;

export const PRODUCT_IMAGES_BUCKET = "products";

let clientPromise: Promise<SupabaseClient> | null = null;

export function getSupabaseClient(config: SupabaseConfig): Promise<SupabaseClient> {
  clientPromise ??= import("@supabase/supabase-js").then(({ createClient }) =>
    createClient(config.url, config.key),
  );
  return clientPromise;
}
