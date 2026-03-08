import { useMemo } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { TrendingUp, User, Lightbulb, Briefcase, BookOpen, Camera, Mic, Sparkles } from "lucide-react";
import { useJournalEntries, useProfile } from "@/hooks/useData";
import { getPhotoForEntry } from "@/lib/demoPhotos";

const typeIcon = { text: BookOpen, photo: Camera, voice: Mic };
const moodEmoji: Record<string, string> = {
  very_positive: "😊", positive: "🙂", neutral: "😐", stressed: "😰", sad: "😢",
};

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export default function DashboardPage() {
  const { data: entries } = useJournalEntries();
  const { data: profile } = useProfile();
  const recentEntries = entries?.slice(0, 3) || [];
  const displayName = profile?.display_name || "there";

  const highlights = useMemo(() => {
    if (!entries || entries.length === 0) return [];
    const scored = entries.map((entry) => {
      let score = 0;
      if (entry.mood === "very_positive") score += 3;
      if (entry.mood === "positive") score += 1;
      if (entry.entry_type === "photo") score += 2;
      if (entry.entry_type === "voice") score += 2;
      const peopleMentions = (entry.people_mentions as any[]) || [];
      score += peopleMentions.length * 1.5;
      if (entry.bucket_id) score += 0.5;
      return { ...entry, score };
    });
    return scored.filter((e) => e.score >= 2).sort((a, b) => b.score - a.score).slice(0, 3);
  }, [entries]);

  return (
    <DashboardLayout>
      <div className="max-w-5xl animate-fade-in">
        <h1 className="font-display text-3xl text-foreground mb-1">{getGreeting()}, {displayName}</h1>
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
            value="" detail="" bg="bg-accent/10" isInsight
            insight={entries && entries.length > 0
              ? "Keep journaling to unlock personalized insights about your patterns."
              : "Start journaling to get AI-powered insights about your life patterns."}
          />
        </div>

        {/* Memory Highlights */}
        {highlights.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-primary" />
              <h2 className="font-display text-xl text-foreground">Memory Highlights</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {highlights.map((entry) => {
                const Icon = typeIcon[(entry.entry_type as keyof typeof typeIcon) || "text"];
                const peopleMentions = (entry.people_mentions as any[]) || [];
                const bucketName = (entry.buckets as any)?.name;
                const photo = getPhotoForEntry(entry.content || "", entry.entry_type);

                return (
                  <div
                    key={entry.id}
                    className="bg-card rounded-xl shadow-card border border-primary/20 hover:border-primary/40 hover:shadow-elevated transition-all cursor-pointer overflow-hidden group"
                  >
                    {/* Photo thumbnail */}
                    {photo && (
                      <div className="h-32 overflow-hidden">
                        <img
                          src={photo}
                          alt="Memory"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xl">{entry.mood ? moodEmoji[entry.mood] : "📝"}</span>
                        <span className="text-xs font-medium text-muted-foreground">
                          {new Date(entry.entry_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </span>
                        <Icon className="w-3.5 h-3.5 text-muted-foreground" />
                        {bucketName && (
                          <span className="text-[10px] bg-secondary/20 text-secondary-foreground px-2 py-0.5 rounded-full ml-auto">
                            {bucketName}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-foreground/80 leading-relaxed line-clamp-2 mb-2">{entry.content}</p>
                      {peopleMentions.length > 0 && (
                        <div className="flex gap-1.5">
                          {peopleMentions.map((p: any) => (
                            <span key={p.person_name} className="text-xs bg-primary/10 px-2 py-0.5 rounded-full text-primary">@{p.person_name}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div>
          <h2 className="font-display text-xl text-foreground mb-4">Recent Entries</h2>
          {recentEntries.length > 0 ? (
            <div className="space-y-3">
              {recentEntries.map((entry) => {
                const Icon = typeIcon[(entry.entry_type as keyof typeof typeIcon) || "text"];
                const photo = getPhotoForEntry(entry.content || "", entry.entry_type);
                return (
                  <div key={entry.id} className="bg-card rounded-xl p-5 shadow-card hover:shadow-elevated transition-all cursor-pointer border border-border/50 group">
                    <div className="flex items-start gap-4">
                      {photo ? (
                        <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0">
                          <img src={photo} alt="" className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-lg shrink-0">
                          {entry.mood ? moodEmoji[entry.mood] : "📝"}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-foreground">
                            {new Date(entry.entry_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </span>
                          <Icon className="w-3.5 h-3.5 text-muted-foreground" />
                          {entry.mood && <span className="text-sm">{moodEmoji[entry.mood]}</span>}
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
    <div className="bg-card rounded-xl p-5 shadow-card border border-border/50 hover:shadow-elevated transition-all">
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
