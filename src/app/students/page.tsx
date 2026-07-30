import { StudentsList } from "./students-list";

export default function StudentsPage() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-xl font-bold text-slate-800">لیست دانش‌آموزان</h2>
      </div>

      <StudentsList />
    </div>
  );
}
