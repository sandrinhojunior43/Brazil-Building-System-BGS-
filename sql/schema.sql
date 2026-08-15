-- BGS - Brazil Building System
-- Schema do Supabase: assinaturas (Stripe) + histórico de treinos concluídos.
-- Rode este arquivo inteiro no SQL Editor do seu projeto Supabase.

create extension if not exists pgcrypto;

-- =========================================================
-- Tabela de assinaturas
-- Cada usuário (auth.users) tem no máximo 1 linha aqui,
-- mantida sincronizada pelo webhook do Stripe (api/webhook.js).
-- =========================================================
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  stripe_customer_id text,
  stripe_subscription_id text,
  plan text check (plan in ('monthly', 'yearly')),
  status text not null default 'inactive', -- active | trialing | past_due | canceled | inactive
  current_period_end bigint, -- unix timestamp (segundos), vindo direto do Stripe
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists subscriptions_user_id_key on public.subscriptions (user_id);
create index if not exists subscriptions_stripe_customer_id_idx on public.subscriptions (stripe_customer_id);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_subscriptions_updated_at on public.subscriptions;
create trigger set_subscriptions_updated_at
before update on public.subscriptions
for each row execute function public.set_updated_at();

alter table public.subscriptions enable row level security;

-- Usuário só enxerga a própria assinatura.
drop policy if exists "Users can view their own subscription" on public.subscriptions;
create policy "Users can view their own subscription"
  on public.subscriptions for select
  using (auth.uid() = user_id);

-- Nenhuma policy de insert/update/delete é criada de propósito:
-- só o backend (usando a service_role key, que ignora RLS) pode
-- escrever nesta tabela — via api/webhook.js e api/create-checkout-session.js.

-- =========================================================
-- Histórico de treinos concluídos (recurso Premium)
-- O usuário grava/lê direto pelo Supabase client no front-end,
-- protegido por RLS: só mexe nas próprias linhas.
-- =========================================================
create table if not exists public.workout_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  workout_id text not null,
  completed_at timestamptz not null default now()
);

create index if not exists workout_logs_user_id_idx on public.workout_logs (user_id);

alter table public.workout_logs enable row level security;

drop policy if exists "Users manage their own workout logs" on public.workout_logs;
create policy "Users manage their own workout logs"
  on public.workout_logs
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
