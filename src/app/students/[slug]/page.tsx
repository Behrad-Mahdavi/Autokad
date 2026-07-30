"use client";

import { useEffect, useState } from "react";
import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Minus,
  Users,
  AlertTriangle,
  Target,
  ShieldAlert,
  Lightbulb,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getStudentBySlug } from "@/lib/students";

interface ReportEntry {
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

export default function StudentDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const student = getStudentBySlug(slug);

  const [history, setHistory] = useState<ReportEntry[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!student) return;
    fetch(
      `/api/students/${encodeURIComponent(student.name)}?t=${Date.now()}`,
      { cache: "no-store" }
    )
      .then((res) => res.json())
      .then((data) => {
        setHistory(data.history || []);
        setAnalytics(data.analytics);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [student]);

  if (!student) notFound();

  const a = analytics;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "green":
        return "bg-green-100 text-green-700 border-green-200";
      case "yellow":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "red":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "green":
        return "عادی";
      case "yellow":
        return "هشدار";
      case "red":
        return "بحرانی";
      default:
        return "نامشخص";
    }
  };

  const barColor = (score: number) => {
    if (score >= 7) return "bg-green-500";
    if (score >= 4) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="space-y-6">
      <Link
        href="/students"
        className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
      >
        <ArrowRight className="w-4 h-4" />
        بازگشت به لیست
      </Link>

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-800">{student.name}</h2>
        {a && a.current_status && (
          <Badge className={getStatusBadge(a.current_status)}>
            {getStatusLabel(a.current_status)}
          </Badge>
        )}
      </div>

      {loading && (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500">
          در حال بارگذاری...
        </div>
      )}

      {!loading && history.length === 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <AlertTriangle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">
            هنوز تحلیلی برای این دانش‌آموز ثبت نشده است.
          </p>
        </div>
      )}

      {!loading && a && history.length > 0 && (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Target className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-800">
                    {a.total_reports}
                  </p>
                  <p className="text-xs text-slate-500">تعداد گزارش‌ها</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-800">
                    {a.avg_productivity}
                  </p>
                  <p className="text-xs text-slate-500">میانگین بهره‌وری</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  {a.trend === "up" ? (
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  ) : a.trend === "down" ? (
                    <TrendingDown className="w-5 h-5 text-red-600" />
                  ) : (
                    <Minus className="w-5 h-5 text-slate-500" />
                  )}
                </div>
                <div>
                  <p className="text-lg font-bold text-slate-800">
                    {a.trend === "up"
                      ? "🔼 روند صعودی"
                      : a.trend === "down"
                        ? "🔽 روند نزولی"
                        : "➡️ پایدار"}
                  </p>
                  <p className="text-xs text-slate-500">روند بهره‌وری</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <ShieldAlert className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-800">
                    {a.status_counts.green}/{a.status_counts.yellow}/
                    {a.status_counts.red}
                  </p>
                  <p className="text-xs text-slate-500">
                    سبز/زرد/قرمز
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Score Timeline */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-slate-800">نمودار بهره‌وری</h3>
            </div>
            <div className="space-y-2">
              {a.score_history.map((item) => (
                <Link
                  key={item.date}
                  href={`/reports/${item.date}`}
                  className="block"
                >
                  <div className="flex items-center gap-3 text-sm">
                    <span className="w-24 text-slate-500 shrink-0">
                      {item.date}
                    </span>
                    <div className="flex-1 h-6 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${barColor(item.score)}`}
                        style={{ width: `${item.score * 10}%` }}
                      />
                    </div>
                    <span className="w-8 text-center font-bold text-slate-700">
                      {item.score}
                    </span>
                    <span
                      className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                        item.status === "green"
                          ? "bg-green-500"
                          : item.status === "yellow"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                      }`}
                    />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Common Obstacles */}
          {a.common_obstacles.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-slate-800">موانع تکراری</h3>
              </div>
              <div className="space-y-2">
                {a.common_obstacles.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between bg-amber-50 rounded-lg px-4 py-2.5 border border-amber-100"
                  >
                    <span className="text-sm text-amber-800">
                      {item.obstacle}
                    </span>
                    <Badge className="bg-amber-100 text-amber-700 border-amber-200 shrink-0">
                      {item.count} بار
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Mentor Suggestions from Red Flags */}
          {history.some((h) => h.obstacles) && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="w-5 h-5 text-purple-600" />
                <h3 className="font-bold text-slate-800">
                  پیشنهادات منتورینگ
                </h3>
              </div>
              <p className="text-sm text-slate-500">
                برای ارائه پیشنهادات دقیق‌تر، ربات هرمس می‌تواند در پاسخ خود
                فیلد <code className="text-xs bg-slate-100 px-1 py-0.5 rounded">mentor_note</code>{" "}
                به هر دانش‌آموز اضافه کند.
              </p>
            </div>
          )}

          {/* Full History Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-800">
                  سوابق کامل
                </h3>
              </div>
            </div>
            <div className="overflow-x-auto scrollbar-thin">
              <table className="w-full text-sm min-w-[650px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-3 py-3 text-right font-medium text-slate-600 whitespace-nowrap">
                      تاریخ
                    </th>
                    <th className="px-3 py-3 text-center font-medium text-slate-600 whitespace-nowrap">
                      بهره‌وری
                    </th>
                    <th className="px-3 py-3 text-center font-medium text-slate-600 whitespace-nowrap">
                      وضعیت
                    </th>
                    <th className="px-3 py-3 text-right font-medium text-slate-600 whitespace-nowrap">
                      خلاصه دیروز
                    </th>
                    <th className="px-3 py-3 text-right font-medium text-slate-600 whitespace-nowrap">
                      برنامه امروز
                    </th>
                    <th className="px-3 py-3 text-right font-medium text-slate-600 whitespace-nowrap">
                      موانع
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {history.map((entry, i) => (
                    <tr
                      key={i}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-3 py-3 font-medium text-slate-800 whitespace-nowrap">
                        <Link
                          href={`/reports/${entry.report_date}`}
                          className="text-blue-600 hover:underline"
                        >
                          {entry.report_date}
                        </Link>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span className="flex items-center justify-center gap-1">
                          <span
                            className={`inline-flex items-center justify-center w-7 h-7 rounded-full border text-xs font-bold ${
                              entry.productivity_score >= 7
                                ? "text-green-600 bg-green-50 border-green-200"
                                : entry.productivity_score >= 4
                                  ? "text-yellow-600 bg-yellow-50 border-yellow-200"
                                  : "text-red-600 bg-red-50 border-red-200"
                            }`}
                          >
                            {entry.productivity_score}
                          </span>
                          <div className="w-12 h-1.5 bg-slate-100 rounded-full hidden sm:block">
                            <div
                              className={`h-full rounded-full ${barColor(entry.productivity_score)}`}
                              style={{
                                width: `${entry.productivity_score * 10}%`,
                              }}
                            />
                          </div>
                        </span>
                      </td>
                      <td className="px-3 py-3 text-center whitespace-nowrap">
                        <Badge
                          className={getStatusBadge(entry.status)}
                        >
                          {getStatusLabel(entry.status)}
                        </Badge>
                      </td>
                      <td className="px-3 py-3 text-slate-600 text-xs leading-relaxed whitespace-normal break-words min-w-[120px] max-w-[200px]">
                        {entry.yesterday_summary}
                      </td>
                      <td className="px-3 py-3 text-slate-600 text-xs leading-relaxed whitespace-normal break-words min-w-[120px] max-w-[200px]">
                        {entry.today_plan}
                      </td>
                      <td className="px-3 py-3 text-xs leading-relaxed whitespace-normal break-words min-w-[120px] max-w-[200px]">
                        {entry.obstacles ? (
                          <span className="text-amber-600">
                            {entry.obstacles}
                          </span>
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
