import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function GET(
  _request: NextRequest,
  { params }: { params: { date: string } }
) {
  try {
    const supabase = getSupabase();
    const decodedDate = decodeURIComponent(params.date);

    const { data, error } = await supabase
      .from("reports")
      .select("report_date, is_processed, visual_json")
      .eq("report_date", decodedDate)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    return NextResponse.json({ report: data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
