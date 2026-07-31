create table reports (
  id uuid primary key default gen_random_uuid(),
  report_date text unique not null,
  raw_text text not null,
  visual_json jsonb default null,
  is_processed boolean default false,
  created_at timestamp with time zone default now()
);

create index idx_reports_date on reports(report_date);

-- جدول برای ذخیره‌ی پیام‌های خام تلگرام
create table public.telegram_messages (
  id bigint primary key generated always as identity,
  chat_id bigint not null,
  message_id bigint,
  from_user text,
  raw_text text not null,
  received_at timestamptz default now(),
  is_processed boolean default false,
  report_date text,
  created_at timestamptz default now()
);

create index idx_telegram_messages_is_processed on public.telegram_messages (is_processed);
create index idx_telegram_messages_report_date on public.telegram_messages (report_date);
