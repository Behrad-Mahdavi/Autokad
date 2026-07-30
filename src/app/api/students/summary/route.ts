import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { students } from "@/lib/students";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = getSupabase();

    const { data } = await supabase
      .from("reports")
      .select("report_date, visual_json")
      .eq("is_processed", true)
      .order("report_date", { ascending: false });

    const studentMap = new Map<
      string,
      {
        reportCount: number;
        lastProductivity: number | null;
        lastStatus: string | null;
      }
    >();

    for (const student of students) {
      studentMap.set(student.name, {
        reportCount: 0,
        lastProductivity: null,
        lastStatus: null,
      });
    }

    for (const report of data || []) {
      if (!report.visual_json) continue;
      const visual = report.visual_json as {
        students?: {
          name: string;
          productivity_score: number;
          status: string;
        }[];
      };
      for (const s of visual.students || []) {
        if (studentMap.has(s.name)) {
          const entry = studentMap.get(s.name)!;
          entry.reportCount++;
          if (entry.lastProductivity === null) {
            entry.lastProductivity = s.productivity_score;
            entry.lastStatus = s.status;
          }
        }
      }
    }

    const result = students.map((s) => ({
      name: s.name,
      slug: s.slug,
      ...studentMap.get(s.name)!,
    }));

    return NextResponse.json({ students: result });
  } catch {
    const result = students.map((s) => ({
      name: s.name,
      slug: s.slug,
      reportCount: 0,
      lastProductivity: null,
      lastStatus: null,
    }));
    return NextResponse.json({ students: result });
  }
}
