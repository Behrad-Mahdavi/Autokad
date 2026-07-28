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
      <body className="antialiased min-h-screen bg-canvas text-text-default font-sans">
        <nav className="bg-surface border-b border-border px-6 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <h1 className="text-lg font-bold text-text-default">
              پلتفرم منتورشیپ
            </h1>
            <div className="flex gap-6 text-sm">
              <a
                href="/admin"
                className="text-text-subtle hover:text-text-default transition-colors"
              >
                ثبت گزارش
              </a>
              <a
                href="/reports"
                className="text-text-subtle hover:text-text-default transition-colors"
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
