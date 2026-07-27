create table reports (
  id uuid primary key default gen_random_uuid(),
  report_date text unique not null,
  raw_text text not null,
  visual_json jsonb default null,
  is_processed boolean default false,
  created_at timestamp with time zone default now()
);

create index idx_reports_date on reports(report_date);
