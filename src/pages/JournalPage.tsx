import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { BookOpen, Camera, Mic, Plus } from "lucide-react";
import { NewEntryModal } from "@/components/NewEntryModal";
import { useJournalEntries } from "@/hooks/useData";

const moodEmoji: Record<string, string> = {
  very_positive: "😊",
  positive: "🙂",
  neutral: "😐",
  stressed: "😰",
  sad: "😢",
};

const moodLabel: Record<string, string> = {
  very_positive: "Very Positive",
  positive: "Positive",
  neutral: "Neutral",
  stressed: "Stressed",
  sad: "Sad",
};

const typeIcon = { text: BookOpen, photo: Camera, voice: Mic };

export default function JournalPage() {
  const [showNewEntry, setShowNewEntry] = useState(false);
  const { data: entries, isLoading } = useJournalEntries();

  return (
    <DashboardLayout>
      <div className="max-w-3xl animate-fade-in">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl text-foreground mb-1">Journal</h1>
            <p className="text-muted-foreground">Your personal reflections.</p>
          </div>
          <button
            onClick={() => setShowNewEntry(true)}
            className="flex items-center gap-2 bg-primary text-primary-foreground rounded-full px-5 py-2.5 text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            New Entry
          </button>
        </div>

        {isLoading ? (
          <p className="text-muted-foreground text-center py-12">Loading entries...</p>
        ) : entries && entries.length > 0 ? (
          <div className="space-y-4">
            {entries.map((entry) => {
              const Icon = typeIcon[(entry.entry_type as keyof typeof typeIcon) || "text"];
              return (
                <div key={entry.id} className="bg-card rounded-xl p-6 shadow-card border border-border/50 hover:shadow-soft transition-shadow cursor-pointer">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-2xl shrink-0">
                      {entry.mood ? moodEmoji[entry.mood] : "📝"}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-foreground">
                          {new Date(entry.entry_date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                        </span>
                        <Icon className="w-3.5 h-3.5 text-muted-foreground" />
                        {entry.mood && <span className="text-xs text-muted-foreground">{moodLabel[entry.mood]}</span>}
                        {entry.buckets && (
                          <span className="text-xs bg-secondary/20 text-secondary-foreground px-2 py-0.5 rounded-full">
                            {(entry.buckets as any).name}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-foreground/80 leading-relaxed mb-2">{entry.content}</p>
                      <div className="flex gap-1.5 flex-wrap">
                        {entry.entry_tags?.map((t: any) => (
                          <span key={t.tag} className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
                            #{t.tag}
                          </span>
                        ))}
                        {entry.people_mentions?.map((p: any) => (
                          <span key={p.person_name} className="text-xs bg-primary/10 px-2 py-0.5 rounded-full text-primary">
                            @{p.person_name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-card rounded-xl p-8 border border-dashed border-border text-center">
            <p className="text-muted-foreground text-sm mb-2">💭 No entries yet</p>
            <p className="text-muted-foreground/60 text-xs">What happened today that felt meaningful?</p>
          </div>
        )}
      </div>

      <NewEntryModal open={showNewEntry} onOpenChange={setShowNewEntry} />
    </DashboardLayout>
  );
}
