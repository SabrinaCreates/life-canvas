import { DashboardLayout } from "@/components/DashboardLayout";
import { BarChart3, TrendingUp, Users, Hash } from "lucide-react";

export default function AnalyticsPage() {
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
              {[60, 70, 55, 80, 75, 85, 90].map((h, i) => (
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
              {[3, 5, 2, 7, 4, 6, 5].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full bg-accent/30 rounded-t-md transition-all"
                    style={{ height: `${h * 14}%` }}
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
              {[
                { topic: "Career Growth", count: 24 },
                { topic: "Exercise", count: 18 },
                { topic: "Family", count: 14 },
                { topic: "Travel", count: 9 },
              ].map((t) => (
                <div key={t.topic} className="flex items-center justify-between">
                  <span className="text-sm text-foreground">{t.topic}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary/40 rounded-full"
                        style={{ width: `${(t.count / 24) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground w-6 text-right">{t.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Most Mentioned People */}
          <div className="bg-card rounded-xl p-6 shadow-card border border-border/50">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-secondary" />
              <h3 className="font-display text-lg text-foreground">Most Mentioned People</h3>
            </div>
            <div className="space-y-3">
              {[
                { name: "Mom", count: 12 },
                { name: "Sarah", count: 8 },
                { name: "David", count: 5 },
                { name: "Alex", count: 3 },
              ].map((p) => (
                <div key={p.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                      {p.name[0]}
                    </div>
                    <span className="text-sm text-foreground">{p.name}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{p.count} mentions</span>
                </div>
              ))}
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
