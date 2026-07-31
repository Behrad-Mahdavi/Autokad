"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Send,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  MessageSquare,
  Inbox,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TelegramMessage {
  id: number;
  chat_id: number;
  message_id: number | null;
  from_user: string | null;
  raw_text: string;
  received_at: string | null;
  is_processed: boolean;
  report_date: string | null;
}

export default function AdminTelegramPage() {
  const [messages, setMessages] = useState<TelegramMessage[]>([]);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [reportDate, setReportDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [showProcessed, setShowProcessed] = useState(false);

  const fetchMessages = () => {
    setLoading(true);
    fetch(
      `/api/admin/telegram/messages?processed=${showProcessed ? "true" : "false"}&t=${Date.now()}`,
      { cache: "no-store" }
    )
      .then((res) => res.json())
      .then((data) => setMessages(data.messages || []))
      .catch(() => setError("خطا در دریافت پیام‌ها"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showProcessed]);

  const grouped = useMemo(() => {
    const map = new Map<string, TelegramMessage[]>();
    for (const m of messages) {
      const key = m.from_user || "ناشناخته";
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(m);
    }
    return Array.from(map.entries());
  }, [messages]);

  const toggleSelect = (id: number) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  };

  const selectAll = () => {
    if (selected.size === messages.length) setSelected(new Set());
    else setSelected(new Set(messages.map((m) => m.id)));
  };

  const handleCreateReport = async () => {
    if (selected.size === 0) {
      setError("حداقل یک پیام را انتخاب کنید.");
      return;
    }
    if (!reportDate.trim()) {
      setError("تاریخ گزارش را وارد کنید.");
      return;
    }

    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/admin/telegram/create-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          report_date: reportDate.trim(),
          message_ids: Array.from(selected),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "خطا در ساخت گزارش");

      setSuccess(`گزارش ${reportDate.trim()} ساخته شد و وارد صف تحلیل شد.`);
      setSelected(new Set());
      setReportDate("");
      fetchMessages();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "خطای ناشناخته");
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (iso: string | null) => {
    if (!iso) return "—";
    const d = new Date(iso);
    return new Intl.DateTimeFormat("fa-IR", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(d);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-slate-800">
          مدیریت پیام‌های تلگرام
        </h2>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-1.5 text-sm text-slate-600 cursor-pointer">
            <input
              type="checkbox"
              checked={showProcessed}
              onChange={(e) => setShowProcessed(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300"
            />
            نمایش پردازش‌شده
          </label>
          <button
            onClick={fetchMessages}
            className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700"
          >
            <RefreshCw className="w-4 h-4" />
            به‌روزرسانی
          </button>
        </div>
      </div>

      {!showProcessed && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <div className="flex flex-wrap items-end gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                تاریخ گزارش (شمسی)
              </label>
              <input
                type="text"
                value={reportDate}
                onChange={(e) => setReportDate(e.target.value)}
                placeholder="مثلاً: 1405-05-10"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                {selected.size} انتخاب
              </Badge>
              <button
                onClick={handleCreateReport}
                disabled={submitting}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2.5 px-4 rounded-lg transition-colors text-sm"
              >
                <Send className="w-4 h-4" />
                {submitting ? "در حال ساخت..." : "ساخت گزارش"}
              </button>
            </div>
          </div>

          {success && (
            <div className="mt-4 bg-green-50 text-green-700 text-sm px-4 py-2.5 rounded-lg border border-green-200 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              {success}
            </div>
          )}
          {error && (
            <div className="mt-4 bg-red-50 text-red-700 text-sm px-4 py-2.5 rounded-lg border border-red-200 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}
        </div>
      )}

      {loading && (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500">
          در حال بارگذاری...
        </div>
      )}

      {!loading && messages.length === 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <Inbox className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">
            {showProcessed
              ? "پیام پردازش‌شده‌ای یافت نشد."
              : "پیام جدیدی از تلگرام دریافت نشده است."}
          </p>
        </div>
      )}

      {!loading && messages.length > 0 && (
        <>
          <button
            onClick={selectAll}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            {selected.size === messages.length
              ? "لغو انتخاب همه"
              : "انتخاب همه"}
          </button>

          {grouped.map(([user, msgs]) => (
            <div
              key={user}
              className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
            >
              <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-blue-600" />
                <span className="font-bold text-slate-800">{user}</span>
                <Badge className="bg-slate-200 text-slate-600 border-slate-300">
                  {msgs.length} پیام
                </Badge>
              </div>
              <div className="divide-y divide-slate-100">
                {msgs.map((m) => (
                  <label
                    key={m.id}
                    className="flex items-start gap-3 px-4 py-3 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selected.has(m.id)}
                      onChange={() => toggleSelect(m.id)}
                      disabled={showProcessed}
                      className="mt-1 w-4 h-4 rounded border-slate-300"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-slate-400">
                          {formatTime(m.received_at)}
                        </span>
                        {m.report_date && (
                          <Badge className="bg-green-100 text-green-700 border-green-200">
                            {m.report_date}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-slate-700 whitespace-pre-wrap break-words leading-relaxed">
                        {m.raw_text}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
