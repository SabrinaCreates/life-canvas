import { DashboardLayout } from "@/components/DashboardLayout";
import { Star, TrendingUp, MapPin, User, Calendar } from "lucide-react";

export default function YearReviewPage() {
  return (
    <DashboardLayout>
      <div className="max-w-3xl animate-fade-in">
        <div className="text-center mb-10">
          <h1 className="font-display text-4xl text-foreground mb-2">Your 2026 Life Review</h1>
          <p className="text-muted-foreground">A look back at your year of growth.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { icon: Calendar, label: "Entries Written", value: "184" },
            { icon: Star, label: "Most Joyful Month", value: "July" },
            { icon: MapPin, label: "Top Category", value: "Travel" },
            { icon: User, label: "Most Mentioned", value: "Mom" },
          ].map((stat) => (
            <div key={stat.label} className="bg-card rounded-xl p-5 shadow-card border border-border/50 text-center">
              <stat.icon className="w-5 h-5 text-accent mx-auto mb-2" />
              <p className="text-2xl font-semibold text-foreground font-display">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="bg-card rounded-xl p-6 shadow-card border border-border/50 mb-6">
          <h3 className="font-display text-lg text-foreground mb-3">Year Highlights</h3>
          <div className="space-y-3">
            {[
              "Started a fitness journey in February and gained 10 pounds of muscle",
              "Took an unforgettable trip with friends in March",
              "Got promoted at work in September",
              "Deepened relationship with family through regular dinners",
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
            "Your confidence increased significantly between March and September. The combination of fitness progress and career growth contributed to your most positive emotional period."
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
