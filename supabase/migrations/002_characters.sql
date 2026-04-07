-- Character sheets
CREATE TABLE public.characters (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id    UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name        TEXT NOT NULL DEFAULT 'Novo Personagem',
  gcs_data    JSONB NOT NULL DEFAULT '{}',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER characters_updated_at
  BEFORE UPDATE ON public.characters
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Index for owner queries
CREATE INDEX characters_owner_idx ON public.characters (owner_id);

-- RLS
ALTER TABLE public.characters ENABLE ROW LEVEL SECURITY;

-- Owner can do everything
CREATE POLICY "characters_owner_all"
  ON public.characters FOR ALL
  TO authenticated
  USING (auth.uid() = owner_id);

-- GMs of accepted group_characters can read
CREATE POLICY "characters_gm_select"
  ON public.characters FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.group_characters gc
      JOIN public.group_members gm ON gm.group_id = gc.group_id
      WHERE gc.character_id = characters.id
        AND gc.status = 'accepted'
        AND gm.user_id = auth.uid()
        AND gm.role = 'gm'
        AND gm.status = 'active'
    )
  );
