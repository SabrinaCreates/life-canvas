import { DashboardLayout } from "@/components/DashboardLayout";
import { Target, TrendingUp, Plus } from "lucide-react";

const buckets = [
  {
    id: 1,
    name: "Health",
    goal: "Gain 10 pounds",
    entries: 18,
    moodTrend: "improving",
    insight: "You write more positively about your health on days when you exercise.",
    color: "bg-secondary/20",
    iconColor: "text-secondary",
  },
  {
    id: 2,
    name: "Career",
    goal: "Get promoted to senior role",
    entries: 24,
    moodTrend: "steady",
    insight: "You tend to write about career stress during weekday evenings.",
    color: "bg-accent/20",
    iconColor: "text-accent",
  },
];

export default function BucketsPage() {
  return (
    <DashboardLayout>
      <div className="max-w-4xl animate-fade-in">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl text-foreground mb-1">Buckets</h1>
            <p className="text-muted-foreground">Track your personal goals. Up to 2 active buckets.</p>
          </div>
          {buckets.length < 2 && (
            <button className="flex items-center gap-2 bg-primary text-primary-foreground rounded-full px-5 py-2.5 text-sm font-semibold hover:opacity-90 transition-opacity">
              <Plus className="w-4 h-4" />
              New Bucket
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {buckets.map((bucket) => (
            <div key={bucket.id} className="bg-card rounded-xl p-6 shadow-card border border-border/50">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-lg ${bucket.color} flex items-center justify-center`}>
                  <Target className={`w-5 h-5 ${bucket.iconColor}`} />
                </div>
                <div>
                  <h3 className="font-display text-lg text-foreground">{bucket.name}</h3>
                  <p className="text-xs text-muted-foreground">{bucket.goal}</p>
                </div>
              </div>

              <div className="flex gap-4 mb-4">
                <div className="text-center">
                  <p className="text-2xl font-semibold text-foreground">{bucket.entries}</p>
                  <p className="text-xs text-muted-foreground">Entries</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center gap-1 justify-center">
                    <TrendingUp className="w-4 h-4 text-secondary" />
                    <p className="text-sm font-medium text-foreground capitalize">{bucket.moodTrend}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">Mood trend</p>
                </div>
              </div>

              <div className="bg-muted/30 rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-1">AI Insight</p>
                <p className="text-sm text-foreground/80 italic">"{bucket.insight}"</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
