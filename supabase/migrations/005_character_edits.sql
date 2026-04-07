-- Edit history for group characters
CREATE TABLE public.character_edits (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_character_id  UUID NOT NULL REFERENCES public.group_characters(id) ON DELETE CASCADE,
  editor_id           UUID NOT NULL REFERENCES public.profiles(id),
  editor_role         TEXT NOT NULL CONSTRAINT editor_role_check CHECK (editor_role IN ('gm', 'player')),
  previous_data       JSONB NOT NULL,
  new_data            JSONB NOT NULL,
  reversion_proposed  BOOLEAN NOT NULL DEFAULT FALSE,
  reversion_status    TEXT CONSTRAINT reversion_status_check CHECK (reversion_status IN ('pending', 'approved', 'rejected')),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX char_edits_gc_idx ON public.character_edits (group_character_id);
CREATE INDEX char_edits_reversion_idx ON public.character_edits (group_character_id) WHERE reversion_proposed = TRUE;

-- RLS
ALTER TABLE public.character_edits ENABLE ROW LEVEL SECURITY;

-- Owner and GMs of the group can read
CREATE POLICY "char_edits_select"
  ON public.character_edits FOR SELECT
  TO authenticated
  USING (
    editor_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.group_characters gc
      JOIN public.group_members gm ON gm.group_id = gc.group_id
      WHERE gc.id = character_edits.group_character_id
        AND (gc.owner_id = auth.uid() OR (gm.user_id = auth.uid() AND gm.status = 'active'))
    )
  );

-- Owner and GM can insert edits
CREATE POLICY "char_edits_insert"
  ON public.character_edits FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = editor_id);

-- GM can update reversion_status
CREATE POLICY "char_edits_gm_update"
  ON public.character_edits FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.group_characters gc
      JOIN public.group_members gm ON gm.group_id = gc.group_id
      WHERE gc.id = character_edits.group_character_id
        AND gm.user_id = auth.uid()
        AND gm.role = 'gm'
        AND gm.status = 'active'
    )
  );

-- Owner can update reversion_proposed
CREATE POLICY "char_edits_owner_update"
  ON public.character_edits FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.group_characters gc
      WHERE gc.id = character_edits.group_character_id
        AND gc.owner_id = auth.uid()
    )
  );
