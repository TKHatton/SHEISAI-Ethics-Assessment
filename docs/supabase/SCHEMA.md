# Database Schema (SQL)

Copy each block into the Supabase SQL editor and run in order, or use `docs/supabase/schema.sql`.

```sql
-- 0) Extensions
create extension if not exists pgcrypto;

-- 1) Enum types
do $$
begin
  if not exists (select 1 from pg_type where typname = 'attempt_status') then
    create type attempt_status as enum ('started','pass','fail','abandoned');
  end if;
end $$;

-- 2) Profiles (one per auth user)
create table if not exists profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text not null,
  organization text,
  tz text,
  normalized_name text generated always as (
    lower(regexp_replace(full_name, '[^a-z0-9]+','', 'g'))
  ) stored,
  created_at timestamptz not null default now()
);
create unique index if not exists profiles_email_idx on profiles (lower(email));

-- 3) Registrations (optional, for session signups)
create table if not exists registrations (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  email text not null,
  full_name text not null,
  organization text,
  role text,
  session_id text not null check (session_id in ('s1','s2','s3','s4')),
  session_start_utc timestamptz not null,
  session_end_utc timestamptz not null,
  tz text,
  user_agent text
);

-- 4) Assessment attempts
create table if not exists assessment_attempts (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  user_id uuid not null references auth.users(id) on delete cascade,
  email text not null,
  full_name text not null,
  organization text,
  tz text,
  normalized_name text generated always as (
    lower(regexp_replace(full_name, '[^a-z0-9]+','', 'g'))
  ) stored,
  identity_key text generated always as (
    lower(regexp_replace(coalesce(full_name,'') || '|' || coalesce(organization,''), '[^a-z0-9]+','', 'g'))
  ) stored,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  status attempt_status not null default 'started'
);
create index if not exists aa_user_idx on assessment_attempts(user_id);
create index if not exists aa_identity_idx on assessment_attempts(identity_key);
create index if not exists aa_name_idx on assessment_attempts(normalized_name);
create index if not exists aa_started_desc_idx on assessment_attempts(started_at desc);
create unique index if not exists aa_one_started_per_user on assessment_attempts(user_id) where status = 'started';

-- 5) Identity alerts
create table if not exists identity_alerts (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  identity_key text not null,
  prior_email text not null,
  new_email text not null,
  prior_attempt_id uuid references assessment_attempts(id),
  note text
);

-- 6) Business logic: eligibility
create or replace function can_start_assessment(
  _user_id uuid,
  _email text,
  _full_name text,
  _organization text default null,
  _now timestamptz default now()
) returns table(
  allowed boolean,
  reason text,
  lockout_until timestamptz,
  retake_deadline timestamptz,
  attempts_count int
) language plpgsql security definer set search_path=public as $$
declare
  _identity_key text := lower(regexp_replace(coalesce(_full_name,'') || '|' || coalesce(_organization,''), '[^a-z0-9]+','', 'g'));
  _latest record;
  _fails int;
  _passes int;
  _total int;
  _lockout_until timestamptz;
  _deadline timestamptz;
begin
  select
    sum((status='fail')::int) as fails,
    sum((status='pass')::int) as passes,
    count(*) as total
  into _fails, _passes, _total
  from assessment_attempts
  where identity_key = _identity_key;

  select *
  into _latest
  from assessment_attempts
  where identity_key = _identity_key
  order by started_at desc
  limit 1;

  if _passes > 0 then
    return query select false, 'already passed', null::timestamptz, null::timestamptz, _total; return;
  end if;

  if _total >= 2 then
    return query select false, 'maximum attempts reached', null::timestamptz, null::timestamptz, _total; return;
  end if;

  if _latest is not null and _latest.status = 'fail' then
    _lockout_until := coalesce(_latest.completed_at, _latest.started_at) + interval '48 hours';
    _deadline := _lockout_until + interval '7 days';
    if _now < _lockout_until then
      return query select false, 'wait 48 hours after failure', _lockout_until, _deadline, _total; return;
    end if;
    if _now > _deadline then
      return query select false, 'retake window expired (7 days after 48h wait)', _lockout_until, _deadline, _total; return;
    end if;
  end if;

  if exists (
    select 1 from assessment_attempts where user_id = _user_id and status = 'started'
  ) then
    return query select false, 'you already have an active attempt', null::timestamptz, null::timestamptz, _total; return;
  end if;

  return query select true, null::text, _lockout_until, _deadline, _total;
end;$$;

create or replace function trg_enforce_assessment_policy()
returns trigger language plpgsql security definer set search_path=public as $$
declare r record; begin
  select * into r from can_start_assessment(NEW.user_id, NEW.email, NEW.full_name, NEW.organization, now());
  if not r.allowed then
    raise exception 'Assessment start blocked: %', r.reason using errcode = 'P0001';
  end if;
  return NEW;
end;$$;

drop trigger if exists before_insert_assessment_attempts on assessment_attempts;
create trigger before_insert_assessment_attempts
before insert on assessment_attempts
for each row execute function trg_enforce_assessment_policy();

create or replace function trg_flag_identity_change()
returns trigger language plpgsql security definer set search_path=public as $$
declare prior record; begin
  select * into prior from assessment_attempts
  where identity_key = NEW.identity_key and email <> NEW.email
  order by started_at desc limit 1;
  if prior is not null then
    insert into identity_alerts(identity_key, prior_email, new_email, prior_attempt_id, note)
    values (NEW.identity_key, prior.email, NEW.email, prior.id, 'Same name/org used with different email');
  end if;
  return NEW;
end;$$;

drop trigger if exists after_insert_assessment_attempts on assessment_attempts;
create trigger after_insert_assessment_attempts
after insert on assessment_attempts
for each row execute function trg_flag_identity_change();

-- 7) Row Level Security
alter table profiles enable row level security;
alter table registrations enable row level security;
alter table assessment_attempts enable row level security;
alter table identity_alerts enable row level security;

drop policy if exists profiles_self on profiles;
create policy profiles_self on profiles
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists registrations_insert on registrations;
create policy registrations_insert on registrations
  for insert using (true) with check (true);

drop policy if exists aa_insert_own on assessment_attempts;
create policy aa_insert_own on assessment_attempts
  for insert using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists aa_update_own on assessment_attempts;
create policy aa_update_own on assessment_attempts
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists aa_select_own on assessment_attempts;
create policy aa_select_own on assessment_attempts
  for select using (auth.uid() = user_id);
```

## Optional: Relax identity enforcement
If you prefer to only flag duplicate identities (same name/org with different emails) without enforcing limits across identity, modify the logic in `can_start_assessment` and related checks to use `user_id` instead of `identity_key`, and keep the `identity_alerts` trigger for auditing.
