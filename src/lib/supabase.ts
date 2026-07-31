import { createClient, SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

// Bypass Next.js global fetch cache for Supabase client
export function getSupabase(): SupabaseClient {
  if (!client) {
    client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          fetch: (url, options) =>
            fetch(url, { ...options, cache: "no-store" }),
        },
      }
    );
  }
  return client;
}

export interface StudentAnalysis {
  name: string;
  productivity_score: number;
  status: "green" | "yellow" | "red";
  yesterday_summary: string;
  today_plan: string;
  obstacles: string;
}

export interface RedFlag {
  name: string;
  risk_reasons: string[];
  mentor_suggestion: string;
}

export interface VisualJson {
  top_metrics: {
    total_students: number;
    high_risk_count: number;
    avg_productivity: number;
  };
  red_flags: RedFlag[];
  students: StudentAnalysis[];
}
