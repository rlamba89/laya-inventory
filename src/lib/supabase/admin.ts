import { createClient } from "@supabase/supabase-js";

// Untyped admin client — used in API routes and server-side admin operations
// where we handle type assertions ourselves
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!
  );
}
