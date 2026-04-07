-- Groups (campaigns)
CREATE TABLE public.groups (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  description TEXT,
  created_by  UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Group members
CREATE TABLE public.group_members (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id    UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role        TEXT NOT NULL DEFAULT 'player'
                CONSTRAINT role_check CHECK (role IN ('gm', 'player')),
  status      TEXT NOT NULL DEFAULT 'invited'
                CONSTRAINT member_status_check CHECK (status IN ('invited', 'active')),
  invited_by  UUID REFERENCES public.profiles(id),
  joined_at   TIMESTAMPTZ,
  UNIQUE (group_id, user_id)
);

-- Group invites (for unregistered users via email)
CREATE TABLE public.group_invites (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id      UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  invited_email TEXT NOT NULL,
  invited_by    UUID NOT NULL REFERENCES public.profiles(id),
  token         TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex'),
  status        TEXT NOT NULL DEFAULT 'pending'
                  CONSTRAINT invite_status_check CHECK (status IN ('pending', 'accepted', 'expired')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX group_members_group_idx ON public.group_members (group_id);
CREATE INDEX group_members_user_idx ON public.group_members (user_id);
CREATE INDEX group_invites_token_idx ON public.group_invites (token);
CREATE INDEX group_invites_email_idx ON public.group_invites (invited_email);

-- RLS: groups
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "groups_member_select"
  ON public.groups FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.group_members
      WHERE group_id = groups.id
        AND user_id = auth.uid()
        AND status = 'active'
    )
  );

CREATE POLICY "groups_creator_insert"
  ON public.groups FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "groups_gm_update"
  ON public.groups FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.group_members
      WHERE group_id = groups.id
        AND user_id = auth.uid()
        AND role = 'gm'
        AND status = 'active'
    )
  );

-- RLS: group_members
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "group_members_same_group_select"
  ON public.group_members FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.group_members gm2
      WHERE gm2.group_id = group_members.group_id
        AND gm2.user_id = auth.uid()
        AND gm2.status = 'active'
    )
  );

CREATE POLICY "group_members_gm_insert"
  ON public.group_members FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.group_members gm
      WHERE gm.group_id = group_members.group_id
        AND gm.user_id = auth.uid()
        AND gm.role = 'gm'
        AND gm.status = 'active'
    )
    OR (
      -- Creator of the group can add themselves as GM on group creation
      group_members.user_id = auth.uid()
    )
  );

CREATE POLICY "group_members_self_update"
  ON public.group_members FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "group_members_gm_update_role"
  ON public.group_members FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.group_members gm
      WHERE gm.group_id = group_members.group_id
        AND gm.user_id = auth.uid()
        AND gm.role = 'gm'
        AND gm.status = 'active'
    )
  );

CREATE POLICY "group_members_gm_delete"
  ON public.group_members FOR DELETE
  TO authenticated
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.group_members gm
      WHERE gm.group_id = group_members.group_id
        AND gm.user_id = auth.uid()
        AND gm.role = 'gm'
        AND gm.status = 'active'
    )
  );

-- RLS: group_invites
ALTER TABLE public.group_invites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "group_invites_gm_all"
  ON public.group_invites FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.group_members
      WHERE group_id = group_invites.group_id
        AND user_id = auth.uid()
        AND role = 'gm'
        AND status = 'active'
    )
  );

-- Allow reading invite by token (for accepting)
CREATE POLICY "group_invites_token_select"
  ON public.group_invites FOR SELECT
  USING (true);
