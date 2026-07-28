import Link from "next/link";
import { FileBarChart, ClipboardPlus } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-text-default mb-3">
          پلتفرم واسط تحلیل عملکرد دانش‌آموزان
        </h2>
        <p className="text-text-muted max-w-lg mx-auto">
          این پلتفرم نقش واسط بین مدیر سیستم و سرویس تحلیل هوش مصنوعی
          (هرمس) را ایفا می‌کند.
        </p>
      </div>
      <div className="flex gap-4">
        <Link
          href="/admin"
          className="flex items-center gap-2 bg-action hover:bg-action-hover text-text-on-brand font-medium py-3 px-6 rounded-xl transition-colors"
        >
          <ClipboardPlus className="w-5 h-5" />
          ثبت گزارش جدید
        </Link>
        <Link
          href="/reports"
          className="flex items-center gap-2 bg-surface hover:bg-surface-2 text-text-default font-medium py-3 px-6 rounded-xl border border-border transition-colors"
        >
          <FileBarChart className="w-5 h-5" />
          مشاهده گزارش‌ها
        </Link>
      </div>
    </div>
  );
}
