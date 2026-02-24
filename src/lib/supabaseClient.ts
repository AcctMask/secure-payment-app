// src/lib/supabaseClient.ts
// Compatibility shim for imports expecting `src/lib/supabaseClient`.
// We keep the real client in `src/lib/supabase.ts`.

export * from "./supabase";
export { supabase as default } from "./supabase";
