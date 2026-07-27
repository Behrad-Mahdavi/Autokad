"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle2, FileBarChart, AlertCircle } from "lucide-react";

interface Report {
  id: string;
  report_date: string;
  is_processed: boolean;
  created_at: string;
}

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/reports/list")
      .then((res) => {
        if (!res.ok) throw new Error("خطا در دریافت گزارش‌ها");
        return res.json();
      })
      .then((data) => setReports(data.reports || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <FileBarChart className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-bold text-slate-800">لیست گزارش‌ها</h2>
      </div>

      {loading && (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <Clock className="w-12 h-12 text-slate-300 mx-auto mb-3 animate-pulse" />
          <p className="text-slate-500">در حال بارگذاری...</p>
        </div>
      )}

      {!loading && error && (
        <div className="bg-white rounded-xl border border-red-200 p-12 text-center">
          <AlertCircle className="w-12 h-12 text-red-300 mx-auto mb-3" />
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      )}

      {!loading && !error && reports.length === 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <Clock className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">هنوز گزارشی ثبت نشده است.</p>
          <Link
            href="/admin"
            className="text-blue-600 hover:underline text-sm mt-2 inline-block"
          >
            ثبت اولین گزارش
          </Link>
        </div>
      )}

      {!loading && !error && reports.length > 0 && (
        <div className="grid gap-3">
          {reports.map((report) => (
            <Link key={report.id} href={`/reports/${report.report_date}`}>
              <div className="bg-white rounded-xl border border-slate-200 p-5 hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileBarChart className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="font-medium text-slate-800">
                      {report.report_date}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {new Date(report.created_at).toLocaleDateString("fa-IR")}
                    </p>
                  </div>
                </div>
                <Badge
                  variant={report.is_processed ? "default" : "secondary"}
                  className={
                    report.is_processed
                      ? "bg-green-100 text-green-700 border-green-200"
                      : "bg-yellow-100 text-yellow-700 border-yellow-200"
                  }
                >
                  {report.is_processed ? (
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      آماده مشاهده
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      در حال پردازش...
                    </span>
                  )}
                </Badge>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
