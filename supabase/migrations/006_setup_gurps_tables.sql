-- Initial Schema Setup for GURPS

-- Enable UUID extension if not present
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Profiles (extends auth.users)
CREATE TABLE gurps.profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username      TEXT UNIQUE NOT NULL
                  CONSTRAINT username_format CHECK (username ~ '^[a-zA-Z0-9_-]{3,24}$'),
  display_name  TEXT,
  avatar_url    TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX profiles_username_lower_idx ON gurps.profiles (LOWER(username));

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION gurps.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = gurps, public
AS $$
BEGIN
  INSERT INTO gurps.profiles (id, username, display_name)
  VALUES (
    NEW.id,
    'user_' || SUBSTR(NEW.id::TEXT, 1, 8),
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION gurps.handle_new_user();

-- 2. Characters
CREATE TABLE gurps.characters (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id      UUID NOT NULL REFERENCES gurps.profiles(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  points        INTEGER NOT NULL DEFAULT 0,
  data          JSONB NOT NULL DEFAULT '{}'::JSONB,
  is_public     BOOLEAN NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Groups (Guilds/Campaigns)
CREATE TABLE gurps.groups (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id      UUID NOT NULL REFERENCES gurps.profiles(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  description   TEXT,
  settings      JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Group Members (Characters in Groups)
CREATE TABLE gurps.group_characters (
  group_id      UUID NOT NULL REFERENCES gurps.groups(id) ON DELETE CASCADE,
  character_id  UUID NOT NULL REFERENCES gurps.characters(id) ON DELETE CASCADE,
  joined_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (group_id, character_id)
);

-- RLS Enforcement
ALTER TABLE gurps.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE gurps.characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE gurps.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE gurps.group_characters ENABLE ROW LEVEL SECURITY;

-- Policies for Profiles
CREATE POLICY "profiles_select_authenticated" ON gurps.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "profiles_update_own" ON gurps.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

-- Policies for Characters
CREATE POLICY "characters_select_owner" ON gurps.characters FOR SELECT TO authenticated USING (auth.uid() = owner_id OR is_public = true);
CREATE POLICY "characters_insert_owner" ON gurps.characters FOR INSERT TO authenticated WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "characters_update_owner" ON gurps.characters FOR UPDATE TO authenticated USING (auth.uid() = owner_id);
CREATE POLICY "characters_delete_owner" ON gurps.characters FOR DELETE TO authenticated USING (auth.uid() = owner_id);

-- Policies for Groups
CREATE POLICY "groups_select_all" ON gurps.groups FOR SELECT TO authenticated USING (true);
CREATE POLICY "groups_insert_owner" ON gurps.groups FOR INSERT TO authenticated WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "groups_update_owner" ON gurps.groups FOR UPDATE TO authenticated USING (auth.uid() = owner_id);

-- Policies for Group Members
CREATE POLICY "group_characters_select" ON gurps.group_characters FOR SELECT TO authenticated USING (true);
CREATE POLICY "group_characters_modify" ON gurps.group_characters FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM gurps.groups WHERE id = group_id AND owner_id = auth.uid())
);
