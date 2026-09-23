-- THE SIGNAL · таблиця прогресу учнів (Supabase SQL Editor)
-- Один рядок на учня й курс; весь прогрес — у JSONB, тож нові уроки не потребують міграцій.
-- Використовує функцію public.is_teacher(), яка вже є в базі Inkwell.

create table if not exists public.signal_progress (
  user_id    uuid        not null references auth.users (id) on delete cascade,
  course_id  text        not null,
  data       jsonb       not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (user_id, course_id)
);

alter table public.signal_progress enable row level security;

-- Учень бачить свій прогрес; викладач — прогрес усіх учнів
create policy "signal: read own or teacher"
  on public.signal_progress for select
  using (auth.uid() = user_id or public.is_teacher());

-- Створює рядок лише сам учень
create policy "signal: insert own progress"
  on public.signal_progress for insert
  with check (auth.uid() = user_id);

-- Оновлює свій рядок учень; викладач може очистити епізод учневі
create policy "signal: update own or teacher"
  on public.signal_progress for update
  using (auth.uid() = user_id or public.is_teacher())
  with check (auth.uid() = user_id or public.is_teacher());

-- Видаляє свій рядок учень; викладач може очистити курс учневі
create policy "signal: delete own or teacher"
  on public.signal_progress for delete
  using (auth.uid() = user_id or public.is_teacher());

-- ─────────────────────────────────────────────────────────────
-- Якщо таблицю вже створено попередньою версією скрипту,
-- виконайте лише цей блок — він замінює старі правила:
--
-- drop policy if exists "signal: read own progress"   on public.signal_progress;
-- drop policy if exists "signal: read own or teacher" on public.signal_progress;
-- drop policy if exists "signal: update own progress" on public.signal_progress;
--
-- create policy "signal: read own or teacher"
--   on public.signal_progress for select
--   using (auth.uid() = user_id or public.is_teacher());
--
-- create policy "signal: update own or teacher"
--   on public.signal_progress for update
--   using (auth.uid() = user_id or public.is_teacher())
--   with check (auth.uid() = user_id or public.is_teacher());
--
-- create policy "signal: delete own or teacher"
--   on public.signal_progress for delete
--   using (auth.uid() = user_id or public.is_teacher());
