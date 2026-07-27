import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  const { report_date, raw_text } = await request.json();

  if (!report_date || !raw_text) {
    return NextResponse.json(
      { error: "report_date and raw_text are required" },
      { status: 400 }
    );
  }

  const supabase = getSupabase();

  const { data, error } = await supabase
    .from("reports")
    .upsert(
      { report_date, raw_text, is_processed: false },
      { onConflict: "report_date" }
    )
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Report submitted successfully", data });
}
