"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  AlertTriangle,
  TrendingUp,
  Clock,
  Target,
  ShieldAlert,
} from "lucide-react";

interface StudentAnalysis {
  name: string;
  productivity_score: number;
  status: "green" | "yellow" | "red";
  yesterday_summary: string;
  today_plan: string;
  obstacles: string;
}

interface RedFlag {
  name: string;
  risk_reasons: string[];
  mentor_suggestion: string;
}

interface VisualJson {
  top_metrics: {
    total_students: number;
    high_risk_count: number;
    avg_productivity: number;
  };
  red_flags: RedFlag[];
  students: StudentAnalysis[];
}

interface Report {
  report_date: string;
  is_processed: boolean;
  visual_json: VisualJson | null;
}

export default function ReportDetailPage() {
  const params = useParams();
  const date = params.date as string;
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!date) return;
    fetch(`/api/reports/${encodeURIComponent(date)}?t=${Date.now()}`, { cache: "no-store" })
      .then((res) => {
        if (!res.ok) throw new Error("گزارش یافت نشد");
        return res.json();
      })
      .then((data) => setReport(data.report))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [date]);

  if (loading) {
    return (
      <div className="max-w-xl mx-auto mt-16">
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-sm">
          <Clock className="w-16 h-16 text-slate-300 mx-auto mb-4 animate-pulse" />
          <p className="text-slate-500">در حال بارگذاری گزارش...</p>
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="max-w-xl mx-auto mt-16">
        <div className="bg-white rounded-xl border border-red-200 p-12 text-center shadow-sm">
          <AlertTriangle className="w-16 h-16 text-red-300 mx-auto mb-4" />
          <p className="text-red-500">{error || "گزارش یافت نشد"}</p>
        </div>
      </div>
    );
  }

  if (!report.is_processed || !report.visual_json) {
    return (
      <div className="max-w-xl mx-auto mt-16">
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-sm">
          <Clock className="w-16 h-16 text-yellow-400 mx-auto mb-4 animate-pulse" />
          <h2 className="text-lg font-bold text-slate-800 mb-2">
            گزارش در حال پردازش است
          </h2>
          <p className="text-slate-500 text-sm">
            گزارش تاریخ <span className="font-medium">{date}</span> هنوز توسط
            سرویس هرمس تحلیل نشده است. لطفاً بعداً مجدد بررسی کنید.
          </p>
        </div>
      </div>
    );
  }

  const { top_metrics, red_flags, students } = report.visual_json;

  const getScoreColor = (score: number) => {
    if (score >= 7) return "text-green-600 bg-green-50 border-green-200";
    if (score >= 4) return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

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
        return "وضعیت عادی";
      case "yellow":
        return "وضعیت هشدار";
      case "red":
        return "وضعیت بحرانی";
      default:
        return "نامشخص";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-800">گزارش {date}</h2>
      </div>

      {/* Top Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">
                {top_metrics.total_students}
              </p>
              <p className="text-xs text-slate-500">تعداد کل دانش‌آموزان</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-red-50 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">
                {top_metrics.high_risk_count}
              </p>
              <p className="text-xs text-slate-500">افراد در ریسک بالا</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-green-50 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">
                {top_metrics.avg_productivity.toFixed(1)}
              </p>
              <p className="text-xs text-slate-500">میانگین بهره‌وری</p>
            </div>
          </div>
        </div>
      </div>

      {/* Red Flags */}
      {red_flags && red_flags.length > 0 && (
        <div className="bg-red-50 rounded-xl border border-red-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <ShieldAlert className="w-5 h-5 text-red-600" />
            <h3 className="font-bold text-red-800">پرچم‌های قرمز</h3>
          </div>
          <div className="space-y-4">
            {red_flags.map((flag, i) => (
              <div
                key={i}
                className="bg-white rounded-lg border border-red-100 p-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                  <span className="font-bold text-slate-800">{flag.name}</span>
                </div>
                <ul className="space-y-1 mb-2 mr-6">
                  {flag.risk_reasons.map((reason, j) => (
                    <li key={j} className="text-sm text-red-600 list-disc">
                      {reason}
                    </li>
                  ))}
                </ul>
                <div className="bg-blue-50 text-blue-700 text-sm px-3 py-2 rounded-lg mr-6">
                  <span className="font-medium">پیشنهاد منتور:</span>{" "}
                  {flag.mentor_suggestion}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Students Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-slate-800">تحلیل دانش‌آموزان</h3>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-4 py-3 text-right font-medium text-slate-600">
                  نام
                </th>
                <th className="px-4 py-3 text-center font-medium text-slate-600">
                  نمره بهره‌وری
                </th>
                <th className="px-4 py-3 text-center font-medium text-slate-600">
                  وضعیت
                </th>
                <th className="px-4 py-3 text-right font-medium text-slate-600">
                  خلاصه دیروز
                </th>
                <th className="px-4 py-3 text-right font-medium text-slate-600">
                  برنامه امروز
                </th>
                <th className="px-4 py-3 text-right font-medium text-slate-600">
                  موانع
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.map((student, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-slate-800">
                    {student.name}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`inline-flex items-center justify-center w-8 h-8 rounded-full border text-sm font-bold ${getScoreColor(student.productivity_score)}`}
                    >
                      {student.productivity_score}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Badge className={getStatusBadge(student.status)}>
                      {getStatusLabel(student.status)}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-slate-600 text-xs leading-relaxed max-w-[200px]">
                    {student.yesterday_summary}
                  </td>
                  <td className="px-4 py-3 text-slate-600 text-xs leading-relaxed max-w-[200px]">
                    {student.today_plan}
                  </td>
                  <td className="px-4 py-3 text-slate-600 text-xs leading-relaxed max-w-[200px]">
                    {student.obstacles}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
