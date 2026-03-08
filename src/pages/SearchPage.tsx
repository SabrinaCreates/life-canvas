import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Search, BookOpen } from "lucide-react";
import { useJournalEntries } from "@/hooks/useData";

const moodEmoji: Record<string, string> = {
  very_positive: "😊", positive: "🙂", neutral: "😐", stressed: "😰", sad: "😢",
};

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const { data: entries } = useJournalEntries();

  const filtered = query && entries
    ? entries.filter((e) => {
        const q = query.toLowerCase();
        return (
          e.content?.toLowerCase().includes(q) ||
          e.entry_tags?.some((t: any) => t.tag.toLowerCase().includes(q)) ||
          e.people_mentions?.some((p: any) => p.person_name.toLowerCase().includes(q)) ||
          e.mood?.toLowerCase().includes(q)
        );
      })
    : [];

  return (
    <DashboardLayout>
      <div className="max-w-3xl animate-fade-in">
        <h1 className="font-display text-3xl text-foreground mb-8">Search Memories</h1>

        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by person, keyword, tag, or mood..."
            className="w-full bg-card border border-border rounded-xl pl-12 pr-4 py-3.5 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 shadow-card"
          />
        </div>

        {query && filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-12">No memories found for "{query}"</p>
        )}

        <div className="space-y-3">
          {filtered.map((entry) => (
            <div key={entry.id} className="bg-card rounded-xl p-5 shadow-card border border-border/50">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-lg">
                  {entry.mood ? moodEmoji[entry.mood] : "📝"}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground mb-1">
                    {new Date(entry.entry_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </p>
                  <p className="text-sm text-foreground/80">{entry.content}</p>
                  <div className="flex gap-1.5 mt-2">
                    {entry.people_mentions?.map((p: any) => (
                      <span key={p.person_name} className="text-xs bg-primary/10 px-2 py-0.5 rounded-full text-primary">@{p.person_name}</span>
                    ))}
                    {entry.entry_tags?.map((t: any) => (
                      <span key={t.tag} className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">#{t.tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {!query && (
          <div className="text-center py-16">
            <Search className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground">Start typing to search your memories</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
