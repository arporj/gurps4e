-- Character submissions to groups
CREATE TABLE public.group_characters (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id      UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  character_id  UUID NOT NULL REFERENCES public.characters(id) ON DELETE CASCADE,
  owner_id      UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  working_data  JSONB,
  status        TEXT NOT NULL DEFAULT 'pending'
                  CONSTRAINT gc_status_check CHECK (status IN ('pending', 'accepted', 'rejected')),
  rejection_reason TEXT,
  submitted_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reviewed_at   TIMESTAMPTZ,
  reviewed_by   UUID REFERENCES public.profiles(id),
  UNIQUE (group_id, character_id, owner_id)
);

-- Indexes
CREATE INDEX group_characters_group_idx ON public.group_characters (group_id);
CREATE INDEX group_characters_owner_idx ON public.group_characters (owner_id);
CREATE INDEX group_characters_status_idx ON public.group_characters (status);

-- RLS
ALTER TABLE public.group_characters ENABLE ROW LEVEL SECURITY;

-- Members can see all submissions in their group
CREATE POLICY "gc_member_select"
  ON public.group_characters FOR SELECT
  TO authenticated
  USING (
    owner_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.group_members
      WHERE group_id = group_characters.group_id
        AND user_id = auth.uid()
        AND status = 'active'
    )
  );

-- Owner can submit (insert)
CREATE POLICY "gc_owner_insert"
  ON public.group_characters FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = owner_id);

-- Owner can withdraw (delete) if still pending
CREATE POLICY "gc_owner_delete"
  ON public.group_characters FOR DELETE
  TO authenticated
  USING (auth.uid() = owner_id AND status = 'pending');

-- GM can update status + working_data
CREATE POLICY "gc_gm_update"
  ON public.group_characters FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.group_members
      WHERE group_id = group_characters.group_id
        AND user_id = auth.uid()
        AND role = 'gm'
        AND status = 'active'
    )
  );

-- Owner can update working_data of accepted characters
CREATE POLICY "gc_owner_update_accepted"
  ON public.group_characters FOR UPDATE
  TO authenticated
  USING (auth.uid() = owner_id AND status = 'accepted');
