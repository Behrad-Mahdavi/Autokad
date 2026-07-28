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

interface Student {
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
  students: Student[];
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
    fetch(`/api/reports/${encodeURIComponent(date)}?t=${Date.now()}`, {
      cache: "no-store",
    })
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
        <div className="bg-surface rounded-xl border border-border p-12 text-center shadow-sm">
          <Clock className="w-16 h-16 text-text-muted mx-auto mb-4 animate-pulse" />
          <p className="text-text-muted">در حال بارگذاری گزارش...</p>
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="max-w-xl mx-auto mt-16">
        <div className="bg-surface rounded-xl border border-danger/20 p-12 text-center shadow-sm">
          <AlertTriangle className="w-16 h-16 text-danger mx-auto mb-4" />
          <p className="text-danger">{error || "گزارش یافت نشد"}</p>
        </div>
      </div>
    );
  }

  if (!report.is_processed || !report.visual_json) {
    return (
      <div className="max-w-xl mx-auto mt-16">
        <div className="bg-surface rounded-xl border border-border p-12 text-center shadow-sm">
          <Clock className="w-16 h-16 text-warning mx-auto mb-4 animate-pulse" />
          <h2 className="text-lg font-bold text-text-default mb-2">
            گزارش در حال پردازش است
          </h2>
          <p className="text-text-muted text-sm">
            گزارش تاریخ <span className="font-medium">{date}</span> هنوز توسط
            سرویس هرمس تحلیل نشده است. لطفاً بعداً مجدد بررسی کنید.
          </p>
        </div>
      </div>
    );
  }

  const { top_metrics, red_flags, students } = report.visual_json;

  const getScoreColor = (score: number) => {
    if (score >= 7) return "text-success bg-success-subtle border-success/30";
    if (score >= 4)
      return "text-warning bg-warning-subtle border-warning/30";
    return "text-danger bg-danger-subtle border-danger/30";
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "green":
        return "bg-success-subtle text-success border-success/30";
      case "yellow":
        return "bg-warning-subtle text-warning border-warning/30";
      case "red":
        return "bg-danger-subtle text-danger border-danger/30";
      default:
        return "bg-surface-2 text-text-subtle border-border";
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
      <h2 className="text-xl font-bold text-text-default">گزارش {date}</h2>

      {/* Top Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-surface rounded-xl border border-border p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-action-subtle rounded-lg">
              <Users className="w-5 h-5 text-action" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-default">
                {top_metrics.total_students}
              </p>
              <p className="text-xs text-text-muted">تعداد کل دانش‌آموزان</p>
            </div>
          </div>
        </div>
        <div className="bg-surface rounded-xl border border-border p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-danger-subtle rounded-lg">
              <AlertTriangle className="w-5 h-5 text-danger" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-default">
                {top_metrics.high_risk_count}
              </p>
              <p className="text-xs text-text-muted">افراد در ریسک بالا</p>
            </div>
          </div>
        </div>
        <div className="bg-surface rounded-xl border border-border p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-success-subtle rounded-lg">
              <TrendingUp className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-default">
                {top_metrics.avg_productivity.toFixed(1)}
              </p>
              <p className="text-xs text-text-muted">میانگین بهره‌وری</p>
            </div>
          </div>
        </div>
      </div>

      {/* Red Flags */}
      {red_flags && red_flags.length > 0 && (
        <div className="bg-danger-subtle rounded-xl border border-danger/20 p-6">
          <div className="flex items-center gap-2 mb-4">
            <ShieldAlert className="w-5 h-5 text-danger" />
            <h3 className="font-bold text-danger">پرچم‌های قرمز</h3>
          </div>
          <div className="space-y-4">
            {red_flags.map((flag, i) => (
              <div
                key={i}
                className="bg-surface rounded-lg border border-danger/10 p-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-danger" />
                  <span className="font-bold text-text-default">
                    {flag.name}
                  </span>
                </div>
                <ul className="space-y-1 mb-2 mr-6">
                  {flag.risk_reasons.map((reason, j) => (
                    <li key={j} className="text-sm text-danger list-disc">
                      {reason}
                    </li>
                  ))}
                </ul>
                <div className="bg-admin-subtle text-admin text-sm px-3 py-2 rounded-lg mr-6">
                  <span className="font-medium">پیشنهاد منتور:</span>{" "}
                  {flag.mentor_suggestion}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Students Table */}
      <div className="bg-surface rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-action" />
            <h3 className="font-bold text-text-default">تحلیل دانش‌آموزان</h3>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-surface-2 border-b border-border">
                <th className="px-4 py-3 text-right font-medium text-text-subtle">
                  نام
                </th>
                <th className="px-4 py-3 text-center font-medium text-text-subtle">
                  نمره بهره‌وری
                </th>
                <th className="px-4 py-3 text-center font-medium text-text-subtle">
                  وضعیت
                </th>
                <th className="px-4 py-3 text-right font-medium text-text-subtle">
                  خلاصه دیروز
                </th>
                <th className="px-4 py-3 text-right font-medium text-text-subtle">
                  برنامه امروز
                </th>
                <th className="px-4 py-3 text-right font-medium text-text-subtle">
                  موانع
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {students.map((student, i) => (
                <tr
                  key={i}
                  className="hover:bg-surface-2 transition-colors"
                >
                  <td className="px-4 py-3 font-medium text-text-default">
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
                  <td className="px-4 py-3 text-text-subtle text-xs leading-relaxed max-w-[200px]">
                    {student.yesterday_summary}
                  </td>
                  <td className="px-4 py-3 text-text-subtle text-xs leading-relaxed max-w-[200px]">
                    {student.today_plan}
                  </td>
                  <td className="px-4 py-3 text-text-subtle text-xs leading-relaxed max-w-[200px]">
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
