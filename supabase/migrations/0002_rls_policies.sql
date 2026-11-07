-- Momentum — Row-Level Security policies (MVP #1)
-- These unlock the tables safely: each user may touch ONLY their own rows.
-- `auth.uid()` is the ID of the currently signed-in user.
--   USING      = which existing rows this user can see / change / delete
--   WITH CHECK = which new or edited rows this user is allowed to write

-- PROFILES ------------------------------------------------------------------
-- A profile row IS the user (its id = the auth user id).
create policy "Users can view their own profile"
  on public.profiles for select
  using (id = auth.uid());

create policy "Users can create their own profile"
  on public.profiles for insert
  with check (id = auth.uid());

create policy "Users can update their own profile"
  on public.profiles for update
  using (id = auth.uid())
  with check (id = auth.uid());

-- ITEMS ---------------------------------------------------------------------
-- An item belongs to the user named in its user_id column.
create policy "Users can view their own items"
  on public.items for select
  using (user_id = auth.uid());

create policy "Users can create their own items"
  on public.items for insert
  with check (user_id = auth.uid());

create policy "Users can update their own items"
  on public.items for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "Users can delete their own items"
  on public.items for delete
  using (user_id = auth.uid());
