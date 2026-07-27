import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.HERMES_API_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { report_date, visual_json } = body;

  if (!report_date || !visual_json) {
    return NextResponse.json(
      { error: "report_date and visual_json are required" },
      { status: 400 }
    );
  }

  const supabase = getSupabase();

  const { data: existing } = await supabase
    .from("reports")
    .select("id")
    .eq("report_date", report_date)
    .single();

  if (!existing) {
    return NextResponse.json(
      { error: `No report found for date: ${report_date}. Admin must submit raw report first.` },
      { status: 404 }
    );
  }

  const { error } = await supabase
    .from("reports")
    .update({
      visual_json,
      is_processed: true,
    })
    .eq("report_date", report_date);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Analysis submitted successfully" });
}
