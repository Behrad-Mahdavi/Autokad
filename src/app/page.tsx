import Link from "next/link";
import { FileBarChart, ClipboardPlus } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-slate-800 mb-3">
          پلتفرم واسط تحلیل عملکرد دانش‌آموزان
        </h2>
        <p className="text-slate-500 max-w-lg mx-auto">
          این پلتفرم نقش واسط بین مدیر سیستم و سرویس تحلیل هوش مصنوعی
          (هرمس) را ایفا می‌کند.
        </p>
      </div>
      <div className="flex gap-4">
        <Link
          href="/admin"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-xl transition-colors"
        >
          <ClipboardPlus className="w-5 h-5" />
          ثبت گزارش جدید
        </Link>
        <Link
          href="/reports"
          className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-medium py-3 px-6 rounded-xl border border-slate-200 transition-colors"
        >
          <FileBarChart className="w-5 h-5" />
          مشاهده گزارش‌ها
        </Link>
      </div>
    </div>
  );
}
