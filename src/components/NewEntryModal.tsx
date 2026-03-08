import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Camera, Mic } from "lucide-react";
import { useCreateEntry, useBuckets } from "@/hooks/useData";
import type { Database } from "@/integrations/supabase/types";

type MoodType = Database["public"]["Enums"]["mood_type"];

const moods: { label: string; value: MoodType; icon: string }[] = [
  { label: "Very Positive", value: "very_positive", icon: "😊" },
  { label: "Positive", value: "positive", icon: "🙂" },
  { label: "Neutral", value: "neutral", icon: "😐" },
  { label: "Stressed", value: "stressed", icon: "😰" },
  { label: "Sad", value: "sad", icon: "😢" },
];

interface NewEntryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewEntryModal({ open, onOpenChange }: NewEntryModalProps) {
  const [text, setText] = useState("");
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [tags, setTags] = useState("");
  const [people, setPeople] = useState("");
  const [selectedBucket, setSelectedBucket] = useState<string>("");
  const createEntry = useCreateEntry();
  const { data: buckets } = useBuckets();

  const handleSave = async () => {
    if (!text && !selectedMood) return;

    const tagList = tags.split(",").map((t) => t.trim()).filter(Boolean);
    const peopleList = people.split(",").map((p) => p.trim()).filter(Boolean);

    await createEntry.mutateAsync({
      content: text,
      mood: selectedMood,
      tags: tagList,
      people: peopleList,
      bucketId: selectedBucket || null,
    });

    setText("");
    setSelectedMood(null);
    setTags("");
    setPeople("");
    setSelectedBucket("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl bg-card border-border shadow-elevated">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl text-foreground">
            New Journal Entry
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </DialogHeader>

        <div className="space-y-5 mt-2">
          {/* Mood Selector */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              How are you feeling?
            </label>
            <div className="flex gap-2">
              {moods.map((mood) => (
                <button
                  key={mood.value}
                  onClick={() => setSelectedMood(mood.value)}
                  className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg text-xs transition-all ${
                    selectedMood === mood.value
                      ? "bg-primary/15 ring-2 ring-primary"
                      : "bg-muted/50 hover:bg-muted"
                  }`}
                >
                  <span className="text-xl">{mood.icon}</span>
                  <span className="text-muted-foreground">{mood.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Text Area */}
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What happened today that felt meaningful?"
            className="w-full h-40 bg-muted/30 border border-border rounded-lg p-4 text-foreground placeholder:text-muted-foreground/60 resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm leading-relaxed"
          />

          {/* Bucket selector */}
          {buckets && buckets.length > 0 && (
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1">Link to bucket</label>
              <select
                value={selectedBucket}
                onChange={(e) => setSelectedBucket(e.target.value)}
                className="w-full bg-muted/30 border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <option value="">None</option>
                {buckets.filter(b => b.is_active).map((b) => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>
          )}

          {/* Action Buttons Row */}
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-3 py-2 bg-muted/50 hover:bg-muted rounded-lg text-sm text-muted-foreground transition-colors">
              <Camera className="w-4 h-4" />
              Photo
            </button>
            <button className="flex items-center gap-2 px-3 py-2 bg-muted/50 hover:bg-muted rounded-lg text-sm text-muted-foreground transition-colors">
              <Mic className="w-4 h-4" />
              Voice
            </button>
            <input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Tags (comma separated)"
              className="flex-1 bg-muted/30 border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <input
            value={people}
            onChange={(e) => setPeople(e.target.value)}
            placeholder="People mentioned (comma separated)"
            className="w-full bg-muted/30 border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30"
          />

          {/* Save */}
          <div className="flex justify-end gap-3">
            <button
              onClick={() => onOpenChange(false)}
              className="px-5 py-2.5 rounded-full text-sm font-medium text-muted-foreground hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={(!text && !selectedMood) || createEntry.isPending}
              className="px-6 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-40"
            >
              {createEntry.isPending ? "Saving..." : "Save Entry"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
