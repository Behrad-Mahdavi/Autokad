import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const processed = request.nextUrl.searchParams.get("processed");

    const supabase = getSupabase();
    const { data, error } = await supabase.from("telegram_messages").select("*");

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const all = (data || []).sort((a, b) => {
      const ta = new Date(a.received_at || 0).getTime();
      const tb = new Date(b.received_at || 0).getTime();
      return tb - ta;
    });

    const filtered =
      processed === "true"
        ? all.filter((m) => m.is_processed === true)
        : processed === "false"
          ? all.filter((m) => m.is_processed === false)
          : all;

    const response = NextResponse.json({ messages: filtered });
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
