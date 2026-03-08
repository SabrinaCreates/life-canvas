import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { BookOpen, Camera, Mic, Plus } from "lucide-react";
import { NewEntryModal } from "@/components/NewEntryModal";

const sampleEntries = [
  { id: 1, date: "2026-04-03", mood: "😊", moodLabel: "Very Positive", type: "voice", text: "Today I had a great workout and felt really energized. I managed to run 5 miles without stopping.", bucket: "Health", tags: ["exercise", "running"], people: [] },
  { id: 2, date: "2026-04-02", mood: "🙂", moodLabel: "Positive", type: "text", text: "Had a productive meeting about the new project. The team is aligned and excited about the direction we're taking.", bucket: "Career", tags: ["work", "project"], people: ["Sarah"] },
  { id: 3, date: "2026-04-01", mood: "😐", moodLabel: "Neutral", type: "photo", text: "Quiet day. Spent time organizing my workspace and planning for the week ahead.", bucket: null, tags: ["organization"], people: [] },
  { id: 4, date: "2026-03-31", mood: "😰", moodLabel: "Stressed", type: "text", text: "Deadline approaching. Feeling the pressure but trying to stay focused and take breaks.", bucket: "Career", tags: ["stress", "deadlines"], people: [] },
  { id: 5, date: "2026-03-30", mood: "😊", moodLabel: "Very Positive", type: "text", text: "Amazing dinner with Mom. We talked about childhood memories and laughed a lot.", bucket: null, tags: ["family", "dinner"], people: ["Mom"] },
];

const typeIcon = { text: BookOpen, photo: Camera, voice: Mic };

export default function JournalPage() {
  const [showNewEntry, setShowNewEntry] = useState(false);

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

        <div className="space-y-4">
          {sampleEntries.map((entry) => {
            const Icon = typeIcon[entry.type as keyof typeof typeIcon];
            return (
              <div key={entry.id} className="bg-card rounded-xl p-6 shadow-card border border-border/50 hover:shadow-soft transition-shadow cursor-pointer">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-2xl shrink-0">
                    {entry.mood}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium text-foreground">
                        {new Date(entry.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                      </span>
                      <Icon className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{entry.moodLabel}</span>
                      {entry.bucket && (
                        <span className="text-xs bg-secondary/20 text-secondary-foreground px-2 py-0.5 rounded-full">
                          {entry.bucket}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-foreground/80 leading-relaxed mb-2">{entry.text}</p>
                    <div className="flex gap-1.5 flex-wrap">
                      {entry.tags.map((tag) => (
                        <span key={tag} className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
                          #{tag}
                        </span>
                      ))}
                      {entry.people.map((person) => (
                        <span key={person} className="text-xs bg-primary/10 px-2 py-0.5 rounded-full text-primary">
                          @{person}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty state hint */}
        <div className="mt-8 bg-card rounded-xl p-6 border border-dashed border-border text-center">
          <p className="text-muted-foreground text-sm">
            💭 What happened today that felt meaningful?
          </p>
        </div>
      </div>

      <NewEntryModal open={showNewEntry} onOpenChange={setShowNewEntry} />
    </DashboardLayout>
  );
}
