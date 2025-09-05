// If you set up the @ alias; otherwise use a relative import to ../lib
import { supabase } from "../../../lib/supabaseClient";

export async function GET() {
  const { data, error } = await supabase
    .from("juice")
    .select("id, name")              // add more columns as needed
    .order("id", { ascending: true });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
  return new Response(JSON.stringify(data || []), { status: 200 });
}