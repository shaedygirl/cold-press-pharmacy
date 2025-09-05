import { supabase } from "@/lib/supabaseClient";

export async function GET() {
  const { data, error } = await supabase.from("protocols").select("*").order("created_at", {ascending:false});
  if (error) return new Response(JSON.stringify({error:error.message}), {status:500});
  return new Response(JSON.stringify(data), {status:200});
}

export async function POST(req) {
  const body = await req.json();
  const { data, error } = await supabase.from("protocols").insert({ name: body.name, description: body.description }).select();
  if (error) return new Response(JSON.stringify({error:error.message}), {status:500});
  return new Response(JSON.stringify(data[0]), {status:201});
}
