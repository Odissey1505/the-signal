-- THE SIGNAL · список учнів курсу (Supabase → SQL Editor → Run)
-- Учень потрапляє сюди сам, щойно відкриває курс, і викладач бачить його у вкладці Students.
-- Скрипт можна запускати повторно: він нічого не видаляє й не дублює.
-- Потрібні: таблиця signal_progress (signal_progress.sql) і функція public.is_teacher() з Inkwell.

-- 1. Таблиця: один рядок на учня й курс
create table if not exists public.signal_students (
  user_id   uuid        not null references auth.users (id) on delete cascade,
  course_id text        not null,
  name      text,
  email     text,
  joined_at timestamptz not null default now(),
  last_seen timestamptz not null default now(),
  primary key (user_id, course_id)
);

alter table public.signal_students enable row level security;

-- 2. Правила доступу
drop policy if exists "signal students: read own or teacher" on public.signal_students;
drop policy if exists "signal students: insert own"          on public.signal_students;
drop policy if exists "signal students: update own"          on public.signal_students;
drop policy if exists "signal students: delete teacher"      on public.signal_students;

-- учень бачить свій рядок, викладач — усіх
create policy "signal students: read own or teacher"
  on public.signal_students for select
  using (auth.uid() = user_id or public.is_teacher());

-- записується учень лише сам
create policy "signal students: insert own"
  on public.signal_students for insert
  with check (auth.uid() = user_id);

create policy "signal students: update own"
  on public.signal_students for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- прибрати учня зі списку може лише викладач
create policy "signal students: delete teacher"
  on public.signal_students for delete
  using (public.is_teacher());

-- 3. Страховка: хто має прогрес у курсі, той і в списку
--    (спрацьовує навіть зі старою версією курсу в кеші браузера)
create or replace function public.signal_enroll_from_progress()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.signal_students (user_id, course_id, name, email)
  select u.id, new.course_id, coalesce(p.display_name, p.username), u.email
  from auth.users u
  left join public.profiles p on p.id = u.id
  where u.id = new.user_id
    and coalesce(p.role, '') <> 'teacher'
  on conflict (user_id, course_id) do update set last_seen = now();
  return new;
end;
$$;

drop trigger if exists signal_progress_enroll on public.signal_progress;
create trigger signal_progress_enroll
  after insert or update on public.signal_progress
  for each row execute function public.signal_enroll_from_progress();

-- 4. Одразу додати тих, хто вже проходив курс
insert into public.signal_students (user_id, course_id, name, email, joined_at, last_seen)
select sp.user_id, sp.course_id, coalesce(p.display_name, p.username), u.email, sp.updated_at, sp.updated_at
from public.signal_progress sp
join auth.users u on u.id = sp.user_id
left join public.profiles p on p.id = sp.user_id
where coalesce(p.role, '') <> 'teacher'
on conflict (user_id, course_id) do nothing;

-- Перевірка: хто зараз у списку курсу
-- select name, email, joined_at, last_seen from public.signal_students order by last_seen desc;
