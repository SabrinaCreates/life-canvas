import { DashboardLayout } from "@/components/DashboardLayout";
import { TrendingUp, User, Lightbulb, Briefcase, BookOpen, Camera, Mic } from "lucide-react";
import { useJournalEntries, useProfile } from "@/hooks/useData";

const typeIcon = { text: BookOpen, photo: Camera, voice: Mic };
const moodEmoji: Record<string, string> = {
  very_positive: "😊", positive: "🙂", neutral: "😐", stressed: "😰", sad: "😢",
};

export default function DashboardPage() {
  const { data: entries } = useJournalEntries();
  const { data: profile } = useProfile();
  const recentEntries = entries?.slice(0, 3) || [];
  const displayName = profile?.display_name || "there";

  return (
    <DashboardLayout>
      <div className="max-w-5xl animate-fade-in">
        <h1 className="font-display text-3xl text-foreground mb-1">Good morning, {displayName}</h1>
        <p className="text-muted-foreground mb-8">Here's your life at a glance.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <SummaryCard
            icon={<TrendingUp className="w-5 h-5 text-secondary" />}
            label="Total Entries"
            value={String(entries?.length || 0)}
            detail="journal entries"
            bg="bg-secondary/10"
          />
          <SummaryCard
            icon={<User className="w-5 h-5 text-primary" />}
            label="This Month"
            value={String(entries?.filter(e => new Date(e.entry_date).getMonth() === new Date().getMonth()).length || 0)}
            detail="entries this month"
            bg="bg-primary/10"
          />
          <SummaryCard
            icon={<Briefcase className="w-5 h-5 text-accent" />}
            label="Streak"
            value="—"
            detail="connect daily"
            bg="bg-accent/10"
          />
          <SummaryCard
            icon={<Lightbulb className="w-5 h-5 text-accent" />}
            label="AI Insight"
            value=""
            detail=""
            bg="bg-accent/10"
            isInsight
            insight={entries && entries.length > 0
              ? "Keep journaling to unlock personalized insights about your patterns."
              : "Start journaling to get AI-powered insights about your life patterns."}
          />
        </div>

        <div>
          <h2 className="font-display text-xl text-foreground mb-4">Recent Entries</h2>
          {recentEntries.length > 0 ? (
            <div className="space-y-3">
              {recentEntries.map((entry) => {
                const Icon = typeIcon[(entry.entry_type as keyof typeof typeIcon) || "text"];
                return (
                  <div key={entry.id} className="bg-card rounded-xl p-5 shadow-card hover:shadow-soft transition-shadow cursor-pointer border border-border/50">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-lg shrink-0">
                        {entry.mood ? moodEmoji[entry.mood] : "📝"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-foreground">
                            {new Date(entry.entry_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </span>
                          <Icon className="w-3.5 h-3.5 text-muted-foreground" />
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-1">{entry.content}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-card rounded-xl p-6 border border-dashed border-border text-center">
              <p className="text-muted-foreground text-sm">💭 No entries yet. Start journaling to see your life here.</p>
            </div>
          )}
        </div>

        <p className="text-xs text-muted-foreground/60 mt-8 text-center">
          🔒 All your entries are private. Only you can see your data.
        </p>
      </div>
    </DashboardLayout>
  );
}

function SummaryCard({ icon, label, value, detail, bg, isInsight, insight }: {
  icon: React.ReactNode; label: string; value: string; detail: string; bg: string;
  isInsight?: boolean; insight?: string;
}) {
  return (
    <div className="bg-card rounded-xl p-5 shadow-card border border-border/50">
      <div className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center mb-3`}>{icon}</div>
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">{label}</p>
      {isInsight ? (
        <p className="text-sm text-foreground/80 leading-relaxed italic">"{insight}"</p>
      ) : (
        <>
          <p className="text-lg font-semibold text-foreground">{value}</p>
          <p className="text-xs text-muted-foreground">{detail}</p>
        </>
      )}
    </div>
  );
}
