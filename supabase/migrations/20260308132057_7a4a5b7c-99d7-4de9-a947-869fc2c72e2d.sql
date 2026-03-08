-- Timestamp update function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Mood enum
CREATE TYPE public.mood_type AS ENUM ('very_positive', 'positive', 'neutral', 'stressed', 'sad');

-- Buckets (goals)
CREATE TABLE public.buckets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  goal TEXT,
  category TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.buckets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own buckets" ON public.buckets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own buckets" ON public.buckets FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own buckets" ON public.buckets FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own buckets" ON public.buckets FOR DELETE USING (auth.uid() = user_id);
CREATE TRIGGER update_buckets_updated_at BEFORE UPDATE ON public.buckets FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Journal entries
CREATE TABLE public.journal_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  entry_date DATE NOT NULL DEFAULT CURRENT_DATE,
  entry_type TEXT NOT NULL DEFAULT 'text' CHECK (entry_type IN ('text', 'photo', 'voice')),
  content TEXT,
  transcript TEXT,
  mood mood_type,
  bucket_id UUID REFERENCES public.buckets(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own entries" ON public.journal_entries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own entries" ON public.journal_entries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own entries" ON public.journal_entries FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own entries" ON public.journal_entries FOR DELETE USING (auth.uid() = user_id);
CREATE TRIGGER update_entries_updated_at BEFORE UPDATE ON public.journal_entries FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX idx_entries_user_date ON public.journal_entries(user_id, entry_date DESC);

-- Entry tags
CREATE TABLE public.entry_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_id UUID NOT NULL REFERENCES public.journal_entries(id) ON DELETE CASCADE,
  tag TEXT NOT NULL,
  UNIQUE(entry_id, tag)
);
ALTER TABLE public.entry_tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own entry tags" ON public.entry_tags FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.journal_entries WHERE id = entry_id AND user_id = auth.uid())
);
CREATE POLICY "Users can insert own entry tags" ON public.entry_tags FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.journal_entries WHERE id = entry_id AND user_id = auth.uid())
);
CREATE POLICY "Users can delete own entry tags" ON public.entry_tags FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.journal_entries WHERE id = entry_id AND user_id = auth.uid())
);

-- People mentions
CREATE TABLE public.people_mentions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_id UUID NOT NULL REFERENCES public.journal_entries(id) ON DELETE CASCADE,
  person_name TEXT NOT NULL,
  UNIQUE(entry_id, person_name)
);
ALTER TABLE public.people_mentions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own people mentions" ON public.people_mentions FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.journal_entries WHERE id = entry_id AND user_id = auth.uid())
);
CREATE POLICY "Users can insert own people mentions" ON public.people_mentions FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.journal_entries WHERE id = entry_id AND user_id = auth.uid())
);
CREATE POLICY "Users can delete own people mentions" ON public.people_mentions FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.journal_entries WHERE id = entry_id AND user_id = auth.uid())
);

-- Entry files (photos, voice recordings)
CREATE TABLE public.entry_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_id UUID NOT NULL REFERENCES public.journal_entries(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL CHECK (file_type IN ('photo', 'voice')),
  file_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.entry_files ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own entry files" ON public.entry_files FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.journal_entries WHERE id = entry_id AND user_id = auth.uid())
);
CREATE POLICY "Users can insert own entry files" ON public.entry_files FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.journal_entries WHERE id = entry_id AND user_id = auth.uid())
);
CREATE POLICY "Users can delete own entry files" ON public.entry_files FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.journal_entries WHERE id = entry_id AND user_id = auth.uid())
);

-- Storage bucket for media
INSERT INTO storage.buckets (id, name, public) VALUES ('journal-media', 'journal-media', false);

CREATE POLICY "Users can view own media" ON storage.objects FOR SELECT USING (
  bucket_id = 'journal-media' AND auth.uid()::text = (storage.foldername(name))[1]
);
CREATE POLICY "Users can upload own media" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'journal-media' AND auth.uid()::text = (storage.foldername(name))[1]
);
CREATE POLICY "Users can delete own media" ON storage.objects FOR DELETE USING (
  bucket_id = 'journal-media' AND auth.uid()::text = (storage.foldername(name))[1]
);