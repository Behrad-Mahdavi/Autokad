"use client";

import { useEffect, useState } from "react";
import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, TrendingUp, AlertTriangle } from "lucide-react";
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

export default function StudentDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const student = getStudentBySlug(slug);

  const [history, setHistory] = useState<ReportEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!student) return;
    fetch(
      `/api/students/${encodeURIComponent(student.name)}?t=${Date.now()}`,
      { cache: "no-store" }
    )
      .then((res) => res.json())
      .then((data) => setHistory(data.history || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [student]);

  if (!student) {
    notFound();
  }

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

  return (
    <div className="space-y-6">
      <Link
        href="/students"
        className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
      >
        <ArrowRight className="w-4 h-4" />
        بازگشت به لیست دانش‌آموزان
      </Link>

      <h2 className="text-xl font-bold text-slate-800">{student.name}</h2>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-slate-800">سوابق تحلیل</h3>
          </div>
        </div>

        {loading && (
          <div className="p-12 text-center text-slate-500">
            در حال بارگذاری...
          </div>
        )}

        {!loading && history.length === 0 && (
          <div className="p-12 text-center">
            <AlertTriangle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">
              هنوز تحلیلی برای این دانش‌آموز ثبت نشده است.
            </p>
          </div>
        )}

        {!loading && history.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-4 py-3 text-right font-medium text-slate-600">
                    تاریخ
                  </th>
                  <th className="px-4 py-3 text-center font-medium text-slate-600">
                    بهره‌وری
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
                {history.map((entry, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-800">
                      <Link
                        href={`/reports/${entry.report_date}`}
                        className="text-blue-600 hover:underline"
                      >
                        {entry.report_date}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-flex items-center justify-center w-8 h-8 rounded-full border text-sm font-bold ${
                          entry.productivity_score >= 7
                            ? "text-green-600 bg-green-50 border-green-200"
                            : entry.productivity_score >= 4
                              ? "text-yellow-600 bg-yellow-50 border-yellow-200"
                              : "text-red-600 bg-red-50 border-red-200"
                        }`}
                      >
                        {entry.productivity_score}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Badge className={getStatusBadge(entry.status)}>
                        {getStatusLabel(entry.status)}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-slate-600 text-xs leading-relaxed max-w-[200px]">
                      {entry.yesterday_summary}
                    </td>
                    <td className="px-4 py-3 text-slate-600 text-xs leading-relaxed max-w-[200px]">
                      {entry.today_plan}
                    </td>
                    <td className="px-4 py-3 text-slate-600 text-xs leading-relaxed max-w-[200px]">
                      {entry.obstacles}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
