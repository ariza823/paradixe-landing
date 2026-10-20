import type { Session, SupabaseClient } from "@supabase/supabase-js";

export async function checkIsAdmin(client: SupabaseClient, session: Session | null): Promise<boolean> {
  if (!session) return false;
  const { data, error } = await client
    .from("admins")
    .select("user_id")
    .eq("user_id", session.user.id)
    .maybeSingle();
  return !error && data !== null;
}

export async function signInWithPassword(client: SupabaseClient, email: string, password: string) {
  const { error } = await client.auth.signInWithPassword({ email, password });
  if (error) throw new Error("Correo o contraseña incorrectos.");
}
