import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { Database } from "@/integrations/supabase/types";
import { mockEntries } from "@/lib/mockEntries";

type MoodType = Database["public"]["Enums"]["mood_type"];

export function useJournalEntries() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["journal-entries", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("journal_entries")
        .select("*, entry_tags(tag), people_mentions(person_name), buckets(name)")
        .order("entry_date", { ascending: false });
      if (error) throw error;
      // If no real data, use mock entries for demo
      if (!data || data.length === 0) {
        return mockEntries as any;
      }
      return data;
    },
  });
}

export function useBuckets() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["buckets", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("buckets")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useCreateEntry() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({
      content,
      mood,
      tags,
      people,
      bucketId,
      entryType = "text",
    }: {
      content: string;
      mood: MoodType | null;
      tags: string[];
      people: string[];
      bucketId?: string | null;
      entryType?: string;
    }) => {
      if (!user) throw new Error("Not authenticated");

      const { data: entry, error } = await supabase
        .from("journal_entries")
        .insert({
          user_id: user.id,
          content,
          mood,
          bucket_id: bucketId || null,
          entry_type: entryType,
        })
        .select()
        .single();
      if (error) throw error;

      // Insert tags
      if (tags.length > 0) {
        const { error: tagError } = await supabase
          .from("entry_tags")
          .insert(tags.map((tag) => ({ entry_id: entry.id, tag })));
        if (tagError) console.error("Tag error:", tagError);
      }

      // Insert people
      if (people.length > 0) {
        const { error: peopleError } = await supabase
          .from("people_mentions")
          .insert(people.map((person_name) => ({ entry_id: entry.id, person_name })));
        if (peopleError) console.error("People error:", peopleError);
      }

      return entry;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journal-entries"] });
    },
  });
}

export function useCreateBucket() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ name, goal, category }: { name: string; goal: string; category?: string }) => {
      if (!user) throw new Error("Not authenticated");
      const { data, error } = await supabase
        .from("buckets")
        .insert({ user_id: user.id, name, goal, category })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["buckets"] });
    },
  });
}

export function useProfile() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["profile", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user!.id)
        .single();
      if (error) throw error;
      return data;
    },
  });
}
