import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("reports")
      .select("id, report_date, is_processed, created_at");

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const sorted = (data || []).sort(
      (a, b) => b.report_date.localeCompare(a.report_date)
    );

    const response = NextResponse.json({ reports: sorted });
    response.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, max-age=0"
    );
    return response;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
