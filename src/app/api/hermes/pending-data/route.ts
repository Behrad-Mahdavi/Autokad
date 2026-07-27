import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.HERMES_API_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getSupabase();

  const { data: pending, error: pendingError } = await supabase
    .from("reports")
    .select("*")
    .eq("is_processed", false)
    .order("created_at", { ascending: true })
    .limit(1)
    .single();

  if (pendingError || !pending) {
    return NextResponse.json(
      { error: "No pending report found" },
      { status: 404 }
    );
  }

  const { data: historical } = await supabase
    .from("reports")
    .select("report_date, raw_text, visual_json")
    .eq("is_processed", true)
    .order("report_date", { ascending: false })
    .limit(3);

  return NextResponse.json({
    report_date: pending.report_date,
    raw_text: pending.raw_text,
    historical_context: historical || [],
  });
}
