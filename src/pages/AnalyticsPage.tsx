import { useMemo } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { BarChart3, TrendingUp, Users, Hash } from "lucide-react";
import { useJournalEntries } from "@/hooks/useData";

const moodScore: Record<string, number> = {
  very_positive: 100, positive: 75, neutral: 50, stressed: 25, sad: 10,
};

export default function AnalyticsPage() {
  const { data: entries } = useJournalEntries();

  // Mood trend by day of week (last 30 days)
  const moodByDay = useMemo(() => {
    if (!entries) return [50, 50, 50, 50, 50, 50, 50];
    const days: number[][] = [[], [], [], [], [], [], []];
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 30);
    entries.forEach((e) => {
      const d = new Date(e.entry_date);
      if (d >= cutoff && e.mood) {
        days[d.getDay() === 0 ? 6 : d.getDay() - 1].push(moodScore[e.mood] ?? 50);
      }
    });
    return days.map((arr) => (arr.length ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : 0));
  }, [entries]);

  // Entry frequency by day of week
  const freqByDay = useMemo(() => {
    if (!entries) return [0, 0, 0, 0, 0, 0, 0];
    const days = [0, 0, 0, 0, 0, 0, 0];
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 30);
    entries.forEach((e) => {
      const d = new Date(e.entry_date);
      if (d >= cutoff) days[d.getDay() === 0 ? 6 : d.getDay() - 1]++;
    });
    return days;
  }, [entries]);

  // Top tags
  const topTags = useMemo(() => {
    if (!entries) return [];
    const counts: Record<string, number> = {};
    entries.forEach((e) => {
      (e.entry_tags as any[])?.forEach((t: any) => {
        counts[t.tag] = (counts[t.tag] || 0) + 1;
      });
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([topic, count]) => ({ topic, count }));
  }, [entries]);

  // Top people
  const topPeople = useMemo(() => {
    if (!entries) return [];
    const counts: Record<string, number> = {};
    entries.forEach((e) => {
      (e.people_mentions as any[])?.forEach((p: any) => {
        counts[p.person_name] = (counts[p.person_name] || 0) + 1;
      });
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));
  }, [entries]);

  const maxTag = topTags[0]?.count || 1;
  const maxFreq = Math.max(...freqByDay, 1);

  return (
    <DashboardLayout>
      <div className="max-w-5xl animate-fade-in">
        <h1 className="font-display text-3xl text-foreground mb-1">Analytics</h1>
        <p className="text-muted-foreground mb-8">Understand your patterns and growth.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Mood Trend */}
          <div className="bg-card rounded-xl p-6 shadow-card border border-border/50">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-secondary" />
              <h3 className="font-display text-lg text-foreground">Mood Trend</h3>
            </div>
            <div className="h-32 flex items-end gap-2">
              {moodByDay.map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full bg-primary/20 rounded-t-md transition-all"
                    style={{ height: `${h}%` }}
                  />
                  <span className="text-[10px] text-muted-foreground">
                    {["M", "T", "W", "T", "F", "S", "S"][i]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Entry Frequency */}
          <div className="bg-card rounded-xl p-6 shadow-card border border-border/50">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-5 h-5 text-accent" />
              <h3 className="font-display text-lg text-foreground">Entry Frequency</h3>
            </div>
            <div className="h-32 flex items-end gap-2">
              {freqByDay.map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full bg-accent/30 rounded-t-md transition-all"
                    style={{ height: `${maxFreq ? (h / maxFreq) * 100 : 0}%` }}
                  />
                  <span className="text-[10px] text-muted-foreground">
                    {["M", "T", "W", "T", "F", "S", "S"][i]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Topics */}
          <div className="bg-card rounded-xl p-6 shadow-card border border-border/50">
            <div className="flex items-center gap-2 mb-4">
              <Hash className="w-5 h-5 text-primary" />
              <h3 className="font-display text-lg text-foreground">Top Topics</h3>
            </div>
            <div className="space-y-3">
              {topTags.length > 0 ? topTags.map((t) => (
                <div key={t.topic} className="flex items-center justify-between">
                  <span className="text-sm text-foreground">#{t.topic}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary/40 rounded-full"
                        style={{ width: `${(t.count / maxTag) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground w-6 text-right">{t.count}</span>
                  </div>
                </div>
              )) : (
                <p className="text-sm text-muted-foreground">No tags yet. Add tags to your entries.</p>
              )}
            </div>
          </div>

          {/* Most Mentioned People */}
          <div className="bg-card rounded-xl p-6 shadow-card border border-border/50">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-secondary" />
              <h3 className="font-display text-lg text-foreground">Most Mentioned People</h3>
            </div>
            <div className="space-y-3">
              {topPeople.length > 0 ? topPeople.map((p) => (
                <div key={p.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                      {p.name[0]}
                    </div>
                    <span className="text-sm text-foreground">{p.name}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{p.count} mentions</span>
                </div>
              )) : (
                <p className="text-sm text-muted-foreground">No people mentioned yet.</p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl p-6 shadow-card border border-border/50">
          <p className="text-xs text-muted-foreground mb-1">AI Insight</p>
          <p className="text-sm text-foreground/80 italic">
            "You tend to write about career stress during weekday evenings. Your happiest entries are on weekends when you spend time with family."
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
