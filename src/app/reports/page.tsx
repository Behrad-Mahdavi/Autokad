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
    const timestamp = Date.now();
    fetch(`/api/reports/list?t=${timestamp}`, { cache: "no-store" })
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
        <FileBarChart className="w-6 h-6 text-action" />
        <h2 className="text-xl font-bold text-text-default">لیست گزارش‌ها</h2>
      </div>

      {loading && (
        <div className="bg-surface rounded-xl border border-border p-12 text-center">
          <Clock className="w-12 h-12 text-text-muted mx-auto mb-3 animate-pulse" />
          <p className="text-text-muted">در حال بارگذاری...</p>
        </div>
      )}

      {!loading && error && (
        <div className="bg-surface rounded-xl border border-danger/20 p-12 text-center">
          <AlertCircle className="w-12 h-12 text-danger mx-auto mb-3" />
          <p className="text-danger text-sm">{error}</p>
        </div>
      )}

      {!loading && !error && reports.length === 0 && (
        <div className="bg-surface rounded-xl border border-border p-12 text-center">
          <Clock className="w-12 h-12 text-text-muted mx-auto mb-3" />
          <p className="text-text-muted">هنوز گزارشی ثبت نشده است.</p>
          <Link
            href="/admin"
            className="text-action hover:underline text-sm mt-2 inline-block"
          >
            ثبت اولین گزارش
          </Link>
        </div>
      )}

      {!loading && !error && reports.length > 0 && (
        <div className="grid gap-3">
          {reports.map((report) => (
            <Link key={report.id} href={`/reports/${report.report_date}`}>
              <div className="bg-surface rounded-xl border border-border p-5 hover:border-action/50 hover:shadow-sm transition-all cursor-pointer flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileBarChart className="w-5 h-5 text-text-muted" />
                  <div>
                    <p className="font-medium text-text-default">
                      {report.report_date}
                    </p>
                    <p className="text-xs text-text-muted mt-0.5">
                      {new Date(report.created_at).toLocaleDateString("fa-IR")}
                    </p>
                  </div>
                </div>
                <Badge
                  variant={report.is_processed ? "default" : "secondary"}
                  className={
                    report.is_processed
                      ? "bg-success-subtle text-success border-success/30"
                      : "bg-warning-subtle text-warning border-warning/30"
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
