import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "پلتفرم منتورشیپ",
  description: "پلتفرم واسط تحلیل عملکرد دانش‌آموزان",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body className="antialiased min-h-screen">
        <nav className="bg-white border-b border-slate-200 px-6 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <h1 className="text-lg font-bold text-slate-800">
              پلتفرم منتورشیپ
            </h1>
            <div className="flex gap-4 text-sm">
              <a
                href="/admin"
                className="text-slate-600 hover:text-slate-900 transition-colors"
              >
                ثبت گزارش
              </a>
              <a
                href="/admin/telegram"
                className="text-slate-600 hover:text-slate-900 transition-colors"
              >
                تلگرام
              </a>
              <a
                href="/students"
                className="text-slate-600 hover:text-slate-900 transition-colors"
              >
                دانش‌آموزان
              </a>
              <a
                href="/reports"
                className="text-slate-600 hover:text-slate-900 transition-colors"
              >
                لیست گزارش‌ها
              </a>
            </div>
          </div>
        </nav>
        <main className="max-w-7xl mx-auto px-6 py-8">{children}</main>
      </body>
    </html>
  );
}
