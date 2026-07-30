import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

interface HistoryEntry {
  report_date: string;
  productivity_score: number;
  status: string;
  yesterday_summary: string;
  today_plan: string;
  obstacles: string;
}

interface Analytics {
  total_reports: number;
  avg_productivity: number;
  current_status: string | null;
  trend: "up" | "down" | "stable" | null;
  score_history: { date: string; score: number; status: string }[];
  common_obstacles: { obstacle: string; count: number }[];
  status_counts: { green: number; yellow: number; red: number };
}

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

    const history: HistoryEntry[] = [];

    for (const report of data || []) {
      if (!report.visual_json) continue;
      const vj = report.visual_json as {
        students?: { name: string; productivity_score: number; status: string; yesterday_summary: string; today_plan: string; obstacles: string }[];
      };
      const student = vj.students?.find((s) => s.name === name);
      if (student) {
        history.push({
          report_date: report.report_date,
          productivity_score: student.productivity_score,
          status: student.status,
          yesterday_summary: student.yesterday_summary,
          today_plan: student.today_plan,
          obstacles: student.obstacles,
        });
      }
    }

    const sorted = [...history].sort(
      (a, b) => a.report_date.localeCompare(b.report_date)
    );

    const scores = sorted.map((h) => h.productivity_score);
    const avgProductivity =
      scores.length > 0
        ? scores.reduce((a, b) => a + b, 0) / scores.length
        : 0;

    const latest = history[0] || null;

    let trend: Analytics["trend"] = null;
    if (scores.length >= 3) {
      const recent3 = scores.slice(0, 3);
      const avgRecent = recent3.reduce((a, b) => a + b, 0) / recent3.length;
      const older = scores.slice(-3);
      const avgOlder = older.reduce((a, b) => a + b, 0) / older.length;
      const diff = avgRecent - avgOlder;
      trend = diff > 0.5 ? "up" : diff < -0.5 ? "down" : "stable";
    }

    const obstacleMap = new Map<string, number>();
    for (const h of history) {
      const obs = h.obstacles.trim();
      if (obs && obs.length > 3) {
        obstacleMap.set(obs, (obstacleMap.get(obs) || 0) + 1);
      }
    }
    const commonObstacles = Array.from(obstacleMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([obstacle, count]) => ({ obstacle, count }));

    const statusCounts = { green: 0, yellow: 0, red: 0 };
    for (const h of history) {
      if (h.status === "green") statusCounts.green++;
      else if (h.status === "yellow") statusCounts.yellow++;
      else if (h.status === "red") statusCounts.red++;
    }

    const analytics: Analytics = {
      total_reports: history.length,
      avg_productivity: Math.round(avgProductivity * 10) / 10,
      current_status: latest?.status || null,
      trend,
      score_history: sorted.map((h) => ({
        date: h.report_date,
        score: h.productivity_score,
        status: h.status,
      })),
      common_obstacles: commonObstacles,
      status_counts: statusCounts,
    };

    return NextResponse.json({ history, analytics });
  } catch {
    return NextResponse.json({ history: [], analytics: null });
  }
}
