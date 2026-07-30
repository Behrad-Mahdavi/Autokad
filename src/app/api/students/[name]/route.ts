import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  { params }: { params: { name: string } }
) {
  try {
    const supabase = getSupabase();
    const name = decodeURIComponent(params.name);

    const { data } = await supabase
      .from("reports")
      .select("report_date, visual_json")
      .eq("is_processed", true)
      .order("report_date", { ascending: false });

    const history: {
      report_date: string;
      productivity_score: number;
      status: string;
      yesterday_summary: string;
      today_plan: string;
      obstacles: string;
    }[] = [];

    for (const report of data || []) {
      if (!report.visual_json) continue;
      const visual = report.visual_json as {
        students?: {
          name: string;
          productivity_score: number;
          status: string;
          yesterday_summary: string;
          today_plan: string;
          obstacles: string;
        }[];
      };
      const student = visual.students?.find((s) => s.name === name);
      if (student) {
        history.push({
          report_date: report.report_date,
          ...student,
        });
      }
    }

    return NextResponse.json({ history });
  } catch {
    return NextResponse.json({ history: [] });
  }
}
