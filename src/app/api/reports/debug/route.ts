import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = getSupabase();

    const { count } = await supabase
      .from("reports")
      .select("*", { count: "exact", head: true });

    const { data: all, error: err1 } = await supabase
      .from("reports")
      .select("*");

    const { data: ordered, error: err2 } = await supabase
      .from("reports")
      .select("id, report_date, is_processed, created_at")
      .order("report_date", { ascending: false });

    const dates = all?.map((r) => JSON.stringify(r.report_date)) || [];

    const response = NextResponse.json({
      count,
      dates,
      ordered_count: ordered?.length || 0,
      ordered_dates: ordered?.map((r) => r.report_date) || [],
      errors: [err1?.message, err2?.message].filter(Boolean),
    });
    response.headers.set("Cache-Control", "no-store, max-age=0");
    return response;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
