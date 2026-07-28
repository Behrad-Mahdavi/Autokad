"use client";

import { useState } from "react";
import { CalendarDays, FileText, Send, CheckCircle2 } from "lucide-react";

export default function AdminPage() {
  const [date, setDate] = useState("");
  const [rawText, setRawText] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const res = await fetch("/api/admin/submit-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ report_date: date, raw_text: rawText }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "خطا در ثبت گزارش");
      }

      setSuccess(true);
      setDate("");
      setRawText("");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "خطای ناشناخته");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-surface rounded-xl border border-border shadow-sm p-8">
        <div className="flex items-center gap-3 mb-6">
          <CalendarDays className="w-6 h-6 text-action" />
          <h2 className="text-xl font-bold text-text-default">
            ثبت گزارش روزانه
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-text-subtle mb-1.5">
              تاریخ گزارش
            </label>
            <input
              type="text"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder="مثلاً: 1405-05-05 یا 2026-07-27"
              className="w-full px-4 py-2.5 rounded-lg bg-surface-2 border border-border-strong text-text-default placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-focus-ring focus:border-transparent text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-subtle mb-1.5">
              <div className="flex items-center gap-1.5">
                <FileText className="w-4 h-4" />
                متن خام گزارش
              </div>
            </label>
            <textarea
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="متن گزارش روزانه گروه را اینجا Paste کنید..."
              rows={12}
              className="w-full px-4 py-3 rounded-lg bg-surface-2 border border-border-strong text-text-default placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-focus-ring focus:border-transparent text-sm leading-relaxed resize-y"
              required
            />
          </div>

          {error && (
            <div className="bg-danger-subtle text-danger text-sm px-4 py-2.5 rounded-lg border border-danger/20">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-success-subtle text-success text-sm px-4 py-2.5 rounded-lg border border-success/20 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              گزارش با موفقیت ثبت شد و وارد صف تحلیل شد.
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-action hover:bg-action-hover disabled:opacity-50 text-text-on-brand font-medium py-2.5 px-4 rounded-lg transition-colors text-sm"
          >
            <Send className="w-4 h-4" />
            {loading ? "در حال ثبت..." : "ثبت و ارسال به صف تحلیل"}
          </button>
        </form>
      </div>
    </div>
  );
}
