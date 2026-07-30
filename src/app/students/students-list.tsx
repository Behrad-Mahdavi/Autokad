"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, Search } from "lucide-react";

interface StudentData {
  name: string;
  slug: string;
  reportCount: number;
  lastProductivity: number | null;
  lastStatus: string | null;
}

export function StudentsList() {
  const [students, setStudents] = useState<StudentData[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/students/summary", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => setStudents(data.students))
      .catch(() => {});
  }, []);

  const filtered = search
    ? students.filter((s) => s.name.includes(search))
    : students;

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="جستجوی نام..."
          className="w-full pr-10 pl-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((student) => {
          const statusColor =
            student.lastStatus === "green"
              ? "text-green-600 bg-green-50 border-green-200"
              : student.lastStatus === "yellow"
                ? "text-yellow-600 bg-yellow-50 border-yellow-200"
                : student.lastStatus === "red"
                  ? "text-red-600 bg-red-50 border-red-200"
                  : "text-slate-400 bg-slate-50 border-slate-200";

          const statusLabel =
            student.lastStatus === "green"
              ? "عادی"
              : student.lastStatus === "yellow"
                ? "هشدار"
                : student.lastStatus === "red"
                  ? "بحرانی"
                  : "—";

          return (
            <Link
              key={student.slug}
              href={`/students/${student.slug}`}
              className="bg-white rounded-xl border border-slate-200 p-4 hover:border-blue-300 hover:shadow-sm transition-all"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Users className="w-4 h-4 text-blue-600" />
                </div>
                <div className="font-medium text-slate-800">
                  {student.name}
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500 pr-11">
                <span>
                  {student.reportCount > 0
                    ? `${student.reportCount} گزارش`
                    : "بدون گزارش"}
                </span>
                {student.lastProductivity !== null && (
                  <span
                    className={`px-2 py-0.5 rounded-full border text-xs ${statusColor}`}
                  >
                    {statusLabel} · {student.lastProductivity}
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
