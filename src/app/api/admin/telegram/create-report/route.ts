import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const { report_date, message_ids } = await request.json();

    if (!report_date || !Array.isArray(message_ids) || message_ids.length === 0) {
      return NextResponse.json(
        { error: "report_date and message_ids are required" },
        { status: 400 }
      );
    }

    const supabase = getSupabase();

    const { data: messages, error: fetchError } = await supabase
      .from("telegram_messages")
      .select("*")
      .in("id", message_ids);

    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    const sortedMessages = (messages || []).sort((a, b) => {
      const ta = new Date(a.received_at || 0).getTime();
      const tb = new Date(b.received_at || 0).getTime();
      return ta - tb;
    });

    const rawText = sortedMessages.map((m) => m.raw_text).join("\n\n---\n\n");

    if (!rawText.trim()) {
      return NextResponse.json(
        { error: "No message text found" },
        { status: 400 }
      );
    }

    const { data: report, error: upsertError } = await supabase
      .from("reports")
      .upsert(
        { report_date, raw_text: rawText, is_processed: false },
        { onConflict: "report_date" }
      )
      .select()
      .single();

    if (upsertError) {
      return NextResponse.json({ error: upsertError.message }, { status: 500 });
    }

    const { error: updateError } = await supabase
      .from("telegram_messages")
      .update({ is_processed: true, report_date })
      .in("id", message_ids);

    if (updateError) {
      console.error("telegram_messages update error:", updateError);
    }

    return NextResponse.json({ message: "Report created successfully", report });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
