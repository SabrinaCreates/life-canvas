import { DashboardLayout } from "@/components/DashboardLayout";
import { TrendingUp, User, Lightbulb, Briefcase, BookOpen, Camera, Mic } from "lucide-react";

const recentEntries = [
  { id: 1, date: "Apr 3, 2026", mood: "😊", type: "voice", preview: "Today I had a great workout and felt really energized...", bucket: "Health" },
  { id: 2, date: "Apr 2, 2026", mood: "🙂", type: "text", preview: "Had a productive meeting about the new project...", bucket: "Career" },
  { id: 3, date: "Apr 1, 2026", mood: "😐", type: "photo", preview: "Quiet day. Spent time organizing my workspace...", bucket: null },
];

const typeIcon = {
  text: BookOpen,
  photo: Camera,
  voice: Mic,
};

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="max-w-5xl animate-fade-in">
        <h1 className="font-display text-3xl text-foreground mb-1">Good morning</h1>
        <p className="text-muted-foreground mb-8">Here's your life at a glance.</p>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <SummaryCard
            icon={<TrendingUp className="w-5 h-5 text-secondary" />}
            label="Mood Trend"
            value="↑ Improving"
            detail="this month"
            bg="bg-secondary/10"
          />
          <SummaryCard
            icon={<User className="w-5 h-5 text-primary" />}
            label="Most Mentioned"
            value="Mom"
            detail="12 mentions"
            bg="bg-primary/10"
          />
          <SummaryCard
            icon={<Briefcase className="w-5 h-5 text-accent" />}
            label="Top Topic"
            value="Career Growth"
            detail="8 entries"
            bg="bg-accent/10"
          />
          <SummaryCard
            icon={<Lightbulb className="w-5 h-5 text-accent" />}
            label="AI Insight"
            value=""
            detail=""
            bg="bg-accent/10"
            isInsight
            insight="You tend to feel happier on days when you exercise and journal."
          />
        </div>

        {/* Recent Entries */}
        <div>
          <h2 className="font-display text-xl text-foreground mb-4">Recent Entries</h2>
          <div className="space-y-3">
            {recentEntries.map((entry) => {
              const Icon = typeIcon[entry.type as keyof typeof typeIcon];
              return (
                <div
                  key={entry.id}
                  className="bg-card rounded-xl p-5 shadow-card hover:shadow-soft transition-shadow cursor-pointer border border-border/50"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-lg shrink-0">
                      {entry.mood}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-foreground">{entry.date}</span>
                        <Icon className="w-3.5 h-3.5 text-muted-foreground" />
                        {entry.bucket && (
                          <span className="text-xs bg-secondary/20 text-secondary-foreground px-2 py-0.5 rounded-full">
                            {entry.bucket}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-1">{entry.preview}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Privacy Note */}
        <p className="text-xs text-muted-foreground/60 mt-8 text-center">
          🔒 All your entries are private and encrypted. Only you can see your data.
        </p>
      </div>
    </DashboardLayout>
  );
}

function SummaryCard({
  icon,
  label,
  value,
  detail,
  bg,
  isInsight,
  insight,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  detail: string;
  bg: string;
  isInsight?: boolean;
  insight?: string;
}) {
  return (
    <div className="bg-card rounded-xl p-5 shadow-card border border-border/50">
      <div className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center mb-3`}>
        {icon}
      </div>
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
