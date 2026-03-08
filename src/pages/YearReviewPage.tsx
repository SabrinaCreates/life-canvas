import { useMemo } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Star, TrendingUp, MapPin, User, Calendar } from "lucide-react";
import { useJournalEntries } from "@/hooks/useData";
import { getPhotoForEntry } from "@/lib/demoPhotos";

const moodEmoji: Record<string, string> = {
  very_positive: "😊", positive: "🙂", neutral: "😐", stressed: "😰", sad: "😢",
};

export default function YearReviewPage() {
  const { data: entries } = useJournalEntries();

  const stats = useMemo(() => {
    if (!entries || entries.length === 0) return null;
    // Most joyful month
    const monthMoods: Record<number, number[]> = {};
    const moodVal: Record<string, number> = { very_positive: 5, positive: 4, neutral: 3, stressed: 2, sad: 1 };
    entries.forEach((e) => {
      const m = new Date(e.entry_date).getMonth();
      if (!monthMoods[m]) monthMoods[m] = [];
      if (e.mood) monthMoods[m].push(moodVal[e.mood] || 3);
    });
    let bestMonth = "—";
    let bestAvg = 0;
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    Object.entries(monthMoods).forEach(([m, vals]) => {
      const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
      if (avg > bestAvg) { bestAvg = avg; bestMonth = monthNames[Number(m)]; }
    });

    // Most mentioned person
    const people: Record<string, number> = {};
    entries.forEach((e) => { (e.people_mentions as any[])?.forEach((p: any) => { people[p.person_name] = (people[p.person_name] || 0) + 1; }); });
    const topPerson = Object.entries(people).sort((a, b) => b[1] - a[1])[0]?.[0] || "—";

    // Top topic
    const tags: Record<string, number> = {};
    entries.forEach((e) => { (e.entry_tags as any[])?.forEach((t: any) => { tags[t.tag] = (tags[t.tag] || 0) + 1; }); });
    const topTag = Object.entries(tags).sort((a, b) => b[1] - a[1])[0]?.[0] || "—";

    return { total: entries.length, bestMonth, topPerson, topTag };
  }, [entries]);

  // Top moments (most positive with photos)
  const topMoments = useMemo(() => {
    if (!entries) return [];
    return entries
      .filter((e) => e.mood === "very_positive")
      .slice(0, 3)
      .map((e) => ({ ...e, photo: getPhotoForEntry(e.content || "", e.entry_type) }));
  }, [entries]);

  return (
    <DashboardLayout>
      <div className="max-w-3xl animate-fade-in">
        <div className="text-center mb-10">
          <h1 className="font-display text-4xl text-foreground mb-2">Your 2026 Life Review</h1>
          <p className="text-muted-foreground">A look back at your year of growth.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { icon: Calendar, label: "Entries Written", value: String(stats?.total || 0) },
            { icon: Star, label: "Most Joyful Month", value: stats?.bestMonth || "—" },
            { icon: MapPin, label: "Top Topic", value: `#${stats?.topTag || "—"}` },
            { icon: User, label: "Most Mentioned", value: stats?.topPerson || "—" },
          ].map((stat) => (
            <div key={stat.label} className="bg-card rounded-xl p-5 shadow-card border border-border/50 text-center hover:shadow-elevated transition-all">
              <stat.icon className="w-5 h-5 text-accent mx-auto mb-2" />
              <p className="text-2xl font-semibold text-foreground font-display">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Top Moments */}
        {topMoments.length > 0 && (
          <div className="mb-6">
            <h3 className="font-display text-lg text-foreground mb-4">✨ Top Moments</h3>
            <div className="space-y-4">
              {topMoments.map((entry) => {
                const peopleMentions = (entry.people_mentions as any[]) || [];
                const bucketName = (entry.buckets as any)?.name;
                return (
                  <div key={entry.id} className="bg-card rounded-xl shadow-card border border-border/50 overflow-hidden hover:shadow-elevated transition-all group">
                    <div className="flex">
                      {entry.photo && (
                        <div className="w-32 shrink-0 overflow-hidden">
                          <img src={entry.photo} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        </div>
                      )}
                      <div className="p-4 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-lg">{entry.mood ? moodEmoji[entry.mood] : "📝"}</span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(entry.entry_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </span>
                          {bucketName && (
                            <span className="text-[10px] bg-secondary/20 text-secondary-foreground px-2 py-0.5 rounded-full">{bucketName}</span>
                          )}
                        </div>
                        <p className="text-sm text-foreground/80 leading-relaxed line-clamp-2">{entry.content}</p>
                        {peopleMentions.length > 0 && (
                          <div className="flex gap-1 mt-2">
                            {peopleMentions.map((p: any) => (
                              <span key={p.person_name} className="text-xs bg-primary/10 px-2 py-0.5 rounded-full text-primary">@{p.person_name}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="bg-card rounded-xl p-6 shadow-card border border-border/50 mb-6">
          <h3 className="font-display text-lg text-foreground mb-3">Year Highlights</h3>
          <div className="space-y-3">
            {[
              "Started a fitness journey and ran your first 5K without stopping",
              "Deepened friendships through regular dinners and coffee meetups",
              "Made progress on career goals with a strong Q1 presentation",
              "Planned an exciting trip to Japan for cherry blossom season",
            ].map((highlight, i) => (
              <div key={i} className="flex items-start gap-3">
                <Star className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <p className="text-sm text-foreground/80">{highlight}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-xl p-6 shadow-card border border-border/50">
          <p className="text-xs text-muted-foreground mb-1">AI Insight</p>
          <p className="text-sm text-foreground/80 italic">
            "Your happiest entries involve time with friends and family. Exercise also correlates strongly with positive mood entries — keep those morning runs going!"
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
