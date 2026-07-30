export interface Student {
  name: string;
  slug: string;
}

export const students: Student[] = [
  { name: "تینا توسلی منش", slug: "tina-tavassoli" },
  { name: "سجاد حسینی", slug: "sajjad-hosseini" },
  { name: "دیانا دهقان پور", slug: "diana-dehghan" },
  { name: "الیسا ولی زاده", slug: "elisa-valizadeh" },
  { name: "آرتین امیری", slug: "artin-amiri" },
  { name: "ستاره صیاد", slug: "setareh-sayyad" },
  { name: "محمدرضا نبوی", slug: "mohammadreza-nabavi" },
  { name: "محمد مهدی صادقی", slug: "mohammad-mahdi-sadeghi" },
  { name: "مهدیار توکلی", slug: "mahdiyar-tavakoli" },
  { name: "احسان پاکزاد", slug: "ehsan-pakzad" },
  { name: "بهار بذرافشان", slug: "bahar-bazrafshan" },
  { name: "عسل کاظمی", slug: "asal-kazemi" },
  { name: "امیرحسین صف‌شکن", slug: "amirhossein-safshekan" },
  { name: "سهیل رحمانی", slug: "soheil-rahmani" },
  { name: "ارسلان ابراهیمی", slug: "arsalan-ebrahimi" },
  { name: "لنا اقبالی", slug: "lena-ebali" },
  { name: "ملیکا ترک", slug: "melika-tork" },
  { name: "حسین خوش رفتار", slug: "hossein-khoshraftar" },
  { name: "مهدیار حسن زاده", slug: "mahdiyar-hassanzadeh" },
  { name: "علیرضا محبوب", slug: "alireza-mahboob" },
  { name: "سجاد خزاعی", slug: "sajjad-khazaei" },
  { name: "محمد جعفریان", slug: "mohammad-jafarian" },
  { name: "متین رمضانی", slug: "matin-ramezani" },
  { name: "پارسا رحمانی", slug: "parsa-rahmani" },
  { name: "متین کامل", slug: "matin-kamel" },
  { name: "سروش حسنی", slug: "soroush-hasani" },
];

export function getStudentBySlug(slug: string): Student | undefined {
  return students.find((s) => s.slug === slug);
}
