import { DashboardLayout } from "@/components/DashboardLayout";

const timelineEvents = [
  { month: "January 2026", title: "Started new semester", description: "Began advanced courses in machine learning.", mood: "🙂", hasPhoto: false },
  { month: "February 2026", title: "Started fitness journey", description: "Committed to gaining weight and building strength.", mood: "😊", hasPhoto: false },
  { month: "March 2026", title: "Trip with friends", description: "Weekend road trip to the mountains. Unforgettable sunsets.", mood: "😊", hasPhoto: true },
  { month: "April 2026", title: "Reached health milestone", description: "Gained 5 pounds of muscle. Feeling stronger than ever.", mood: "😊", hasPhoto: false },
];

export default function TimelinePage() {
  return (
    <DashboardLayout>
      <div className="max-w-3xl animate-fade-in">
        <h1 className="font-display text-3xl text-foreground mb-8">Timeline</h1>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-border" />

          <div className="space-y-8">
            {timelineEvents.map((event, i) => (
              <div key={i} className="relative flex gap-6">
                {/* Dot */}
                <div className="w-12 h-12 rounded-full bg-card border-2 border-primary/30 flex items-center justify-center text-lg shrink-0 z-10">
                  {event.mood}
                </div>

                <div className="bg-card rounded-xl p-5 shadow-card border border-border/50 flex-1">
                  <p className="text-xs text-muted-foreground mb-1">{event.month}</p>
                  <h3 className="font-display text-lg text-foreground mb-1">{event.title}</h3>
                  <p className="text-sm text-foreground/80">{event.description}</p>
                  {event.hasPhoto && (
                    <div className="mt-3 w-full h-32 bg-muted rounded-lg flex items-center justify-center text-muted-foreground text-xs">
                      📷 Photo attached
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
