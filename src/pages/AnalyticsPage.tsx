import { useMemo } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { BarChart3, TrendingUp, Users, Hash, Clock, Grid3X3, PieChart, Sparkles, Heart, Pen, Briefcase, UserCheck } from "lucide-react";
import { useJournalEntries } from "@/hooks/useData";

const moodScore: Record<string, number> = {
  very_positive: 100, positive: 75, neutral: 50, stressed: 25, sad: 10,
};
const moodColor: Record<string, string> = {
  very_positive: "bg-secondary", positive: "bg-secondary/60", neutral: "bg-muted-foreground/30", stressed: "bg-accent", sad: "bg-destructive/40",
};

// Fallback data for demo
const fallbackMoodByDay = [50, 75, 75, 50, 100, 100, 65];
const fallbackFreqByDay = [2, 1, 3, 2, 4, 5, 4];
const fallbackTopTags = [
  { topic: "Career Growth", count: 6 },
  { topic: "Family", count: 5 },
  { topic: "Exercise", count: 4 },
  { topic: "Friendships", count: 4 },
  { topic: "Travel", count: 3 },
  { topic: "Mindfulness", count: 2 },
];
const fallbackTopPeople = [
  { name: "Sarah", count: 4 },
  { name: "Mom", count: 3 },
  { name: "Dad", count: 3 },
  { name: "Alex", count: 3 },
  { name: "David", count: 2 },
];

const insightCards = [
  { icon: Heart, title: "Emotional Pattern", text: "Your happiest entries tend to happen on weekends when you spend time with friends or family.", color: "bg-secondary/10", iconColor: "text-secondary" },
  { icon: Pen, title: "Writing Habit", text: "You journal most often in the evening between 7pm and 10pm.", color: "bg-accent/10", iconColor: "text-accent" },
  { icon: Briefcase, title: "Life Balance", text: "Career-related entries increased this month, suggesting a period of professional growth.", color: "bg-primary/10", iconColor: "text-primary" },
  { icon: UserCheck, title: "Meaningful Connections", text: "Entries mentioning family and close friends appear most often in positive reflections.", color: "bg-secondary/10", iconColor: "text-secondary" },
];

const emotionalDistribution = [
  { label: "Happy", pct: 40, color: "bg-secondary" },
  { label: "Calm", pct: 25, color: "bg-primary" },
  { label: "Neutral", pct: 20, color: "bg-muted-foreground/40" },
  { label: "Reflective", pct: 10, color: "bg-accent" },
  { label: "Stressed", pct: 5, color: "bg-destructive/40" },
];

export default function AnalyticsPage() {
  const { data: entries } = useJournalEntries();

  const moodByDay = useMemo(() => {
    if (!entries || entries.length === 0) return fallbackMoodByDay;
    const days: number[][] = [[], [], [], [], [], [], []];
    entries.forEach((e) => {
      if (e.mood) {
        const d = new Date(e.entry_date + "T00:00:00");
        const idx = d.getDay() === 0 ? 6 : d.getDay() - 1;
        days[idx].push(moodScore[e.mood] ?? 50);
      }
    });
    const result = days.map((arr) => (arr.length ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : 0));
    return result.some((v) => v > 0) ? result : fallbackMoodByDay;
  }, [entries]);

  const freqByDay = useMemo(() => {
    if (!entries || entries.length === 0) return fallbackFreqByDay;
    const days = [0, 0, 0, 0, 0, 0, 0];
    entries.forEach((e) => {
      const d = new Date(e.entry_date + "T00:00:00");
      const idx = d.getDay() === 0 ? 6 : d.getDay() - 1;
      days[idx]++;
    });
    return days.some((v) => v > 0) ? days : fallbackFreqByDay;
  }, [entries]);

  const topTags = useMemo(() => {
    if (!entries || entries.length === 0) return fallbackTopTags;
    const counts: Record<string, number> = {};
    entries.forEach((e) => { (e.entry_tags as any[])?.forEach((t: any) => { counts[t.tag] = (counts[t.tag] || 0) + 1; }); });
    const result = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([topic, count]) => ({ topic, count }));
    return result.length > 0 ? result : fallbackTopTags;
  }, [entries]);

  const topPeople = useMemo(() => {
    if (!entries || entries.length === 0) return fallbackTopPeople;
    const counts: Record<string, number> = {};
    entries.forEach((e) => { (e.people_mentions as any[])?.forEach((p: any) => { counts[p.person_name] = (counts[p.person_name] || 0) + 1; }); });
    const result = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([name, count]) => ({ name, count }));
    return result.length > 0 ? result : fallbackTopPeople;
  }, [entries]);

  const lifeBalance = useMemo(() => {
    if (!entries || entries.length === 0) return [
      { name: "Career", count: 6, pct: 30, color: "bg-primary" },
      { name: "Family", count: 5, pct: 25, color: "bg-secondary" },
      { name: "Health", count: 4, pct: 20, color: "bg-accent" },
      { name: "Friendships", count: 4, pct: 20, color: "bg-primary/60" },
      { name: "Travel", count: 1, pct: 5, color: "bg-secondary/60" },
    ];
    const counts: Record<string, number> = {};
    entries.forEach((e) => {
      const name = (e.buckets as any)?.name || "Uncategorized";
      counts[name] = (counts[name] || 0) + 1;
    });
    const total = Object.values(counts).reduce((a, b) => a + b, 0);
    const colors = ["bg-primary", "bg-secondary", "bg-accent", "bg-primary/60", "bg-secondary/60", "bg-muted-foreground/40"];
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([name, count], i) => ({
      name, count, pct: Math.round((count / total) * 100), color: colors[i % colors.length],
    }));
  }, [entries]);

  const heatmapData = useMemo(() => {
    if (!entries) return [];
    const result: { date: string; mood: string | null }[] = [];
    for (let i = 27; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const ds = d.toISOString().split("T")[0];
      const entry = entries.find((e) => e.entry_date === ds);
      result.push({ date: ds, mood: entry?.mood || null });
    }
    return result;
  }, [entries]);

  const maxTag = topTags[0]?.count || 1;
  const maxFreq = Math.max(...freqByDay, 1);

  return (
    <DashboardLayout>
      <div className="max-w-5xl animate-fade-in">
        <h1 className="font-display text-3xl text-foreground mb-1">Insights From Your Life</h1>
        <p className="text-muted-foreground mb-8">Understand your patterns and growth.</p>

        {/* AI Insight Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {insightCards.map((card) => (
            <div key={card.title} className={`rounded-xl p-5 shadow-card border border-border/50 hover:shadow-elevated transition-all bg-card`}>
              <div className={`w-10 h-10 rounded-lg ${card.color} flex items-center justify-center mb-3`}>
                <card.icon className={`w-5 h-5 ${card.iconColor}`} />
              </div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">{card.title}</p>
              <p className="text-sm text-foreground/80 leading-relaxed italic">"{card.text}"</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Mood Trend */}
          <div className="bg-card rounded-xl p-6 shadow-card border border-border/50 hover:shadow-elevated transition-shadow">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-secondary" />
              <h3 className="font-display text-lg text-foreground">Mood Trend</h3>
            </div>
            <div className="h-32 flex items-end gap-2">
              {moodByDay.map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full bg-primary/20 rounded-t-md transition-all hover:bg-primary/30" style={{ height: `${h}%` }} />
                  <span className="text-[10px] text-muted-foreground">{["M", "T", "W", "T", "F", "S", "S"][i]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Entry Frequency */}
          <div className="bg-card rounded-xl p-6 shadow-card border border-border/50 hover:shadow-elevated transition-shadow">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-5 h-5 text-accent" />
              <h3 className="font-display text-lg text-foreground">Entry Frequency</h3>
            </div>
            <div className="h-32 flex items-end gap-2">
              {freqByDay.map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full bg-accent/30 rounded-t-md transition-all hover:bg-accent/40" style={{ height: `${maxFreq ? (h / maxFreq) * 100 : 0}%` }} />
                  <span className="text-[10px] text-muted-foreground">{["M", "T", "W", "T", "F", "S", "S"][i]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Topics */}
          <div className="bg-card rounded-xl p-6 shadow-card border border-border/50 hover:shadow-elevated transition-shadow">
            <div className="flex items-center gap-2 mb-4">
              <Hash className="w-5 h-5 text-primary" />
              <h3 className="font-display text-lg text-foreground">Top Topics</h3>
            </div>
            <div className="space-y-3">
              {topTags.map((t) => (
                <div key={t.topic} className="flex items-center justify-between">
                  <span className="text-sm text-foreground">#{t.topic}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary/40 rounded-full transition-all" style={{ width: `${(t.count / maxTag) * 100}%` }} />
                    </div>
                    <span className="text-xs text-muted-foreground w-6 text-right">{t.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Most Mentioned People */}
          <div className="bg-card rounded-xl p-6 shadow-card border border-border/50 hover:shadow-elevated transition-shadow">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-secondary" />
              <h3 className="font-display text-lg text-foreground">Most Mentioned People</h3>
            </div>
            <div className="space-y-3">
              {topPeople.map((p) => (
                <div key={p.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">{p.name[0]}</div>
                    <span className="text-sm text-foreground">{p.name}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{p.count} mentions</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Second row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Writing Time */}
          <div className="bg-card rounded-xl p-6 shadow-card border border-border/50 hover:shadow-elevated transition-shadow">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-5 h-5 text-accent" />
              <h3 className="font-display text-base text-foreground">Writing Time</h3>
            </div>
            <p className="text-sm text-foreground/80 leading-relaxed italic mb-3">
              "You write most often in the evening between 7pm and 10pm."
            </p>
            <div className="flex gap-1 items-end h-12">
              {[10, 5, 3, 5, 8, 15, 30, 55, 80, 95, 70, 20].map((v, i) => (
                <div key={i} className="flex-1">
                  <div className="w-full bg-accent/25 rounded-t-sm hover:bg-accent/40 transition-colors" style={{ height: `${v}%` }} />
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-[9px] text-muted-foreground">6am</span>
              <span className="text-[9px] text-muted-foreground">12pm</span>
              <span className="text-[9px] text-muted-foreground">6pm</span>
              <span className="text-[9px] text-muted-foreground">12am</span>
            </div>
          </div>

          {/* Mood Heatmap */}
          <div className="bg-card rounded-xl p-6 shadow-card border border-border/50 hover:shadow-elevated transition-shadow">
            <div className="flex items-center gap-2 mb-3">
              <Grid3X3 className="w-5 h-5 text-primary" />
              <h3 className="font-display text-base text-foreground">Mood Heatmap</h3>
            </div>
            <div className="grid grid-cols-7 gap-1">
              {heatmapData.map((d, i) => (
                <div
                  key={i}
                  title={`${d.date}: ${d.mood || "no entry"}`}
                  className={`aspect-square rounded-sm transition-colors ${
                    d.mood ? moodColor[d.mood] || "bg-muted" : "bg-muted/40"
                  }`}
                />
              ))}
            </div>
            <div className="flex items-center gap-2 mt-3 justify-center">
              <span className="text-[9px] text-muted-foreground">Sad</span>
              <div className="flex gap-0.5">
                <div className="w-3 h-3 rounded-sm bg-destructive/40" />
                <div className="w-3 h-3 rounded-sm bg-accent" />
                <div className="w-3 h-3 rounded-sm bg-muted-foreground/30" />
                <div className="w-3 h-3 rounded-sm bg-secondary/60" />
                <div className="w-3 h-3 rounded-sm bg-secondary" />
              </div>
              <span className="text-[9px] text-muted-foreground">Happy</span>
            </div>
          </div>

          {/* Life Balance */}
          <div className="bg-card rounded-xl p-6 shadow-card border border-border/50 hover:shadow-elevated transition-shadow">
            <div className="flex items-center gap-2 mb-3">
              <PieChart className="w-5 h-5 text-secondary" />
              <h3 className="font-display text-base text-foreground">Life Balance</h3>
            </div>
            <div className="flex h-4 rounded-full overflow-hidden mb-3">
              {lifeBalance.map((b) => (
                <div key={b.name} className={`${b.color} transition-all`} style={{ width: `${b.pct}%` }} title={`${b.name}: ${b.pct}%`} />
              ))}
            </div>
            <div className="space-y-1.5">
              {lifeBalance.slice(0, 5).map((b) => (
                <div key={b.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${b.color}`} />
                    <span className="text-xs text-foreground">{b.name}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{b.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Emotional Distribution */}
        <div className="bg-card rounded-xl p-6 shadow-card border border-border/50 hover:shadow-elevated transition-shadow mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-primary" />
            <h3 className="font-display text-lg text-foreground">Emotional Distribution</h3>
          </div>
          <div className="flex h-6 rounded-full overflow-hidden mb-4">
            {emotionalDistribution.map((e) => (
              <div key={e.label} className={`${e.color} transition-all`} style={{ width: `${e.pct}%` }} title={`${e.label}: ${e.pct}%`} />
            ))}
          </div>
          <div className="flex flex-wrap gap-4 justify-center">
            {emotionalDistribution.map((e) => (
              <div key={e.label} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${e.color}`} />
                <span className="text-xs text-foreground">{e.label}</span>
                <span className="text-xs text-muted-foreground">{e.pct}%</span>
              </div>
            ))}
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
