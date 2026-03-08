import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { ChevronLeft, ChevronRight } from "lucide-react";

const entryDays: Record<string, { mood: string; types: string[] }> = {
  "2026-04-01": { mood: "😐", types: ["📝", "📷"] },
  "2026-04-02": { mood: "🙂", types: ["📝"] },
  "2026-04-03": { mood: "😊", types: ["🎤", "📷"] },
  "2026-03-30": { mood: "😊", types: ["📝"] },
  "2026-03-28": { mood: "😰", types: ["📝"] },
};

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 3, 1)); // April 2026

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  return (
    <DashboardLayout>
      <div className="max-w-4xl animate-fade-in">
        <h1 className="font-display text-3xl text-foreground mb-8">Calendar</h1>

        <div className="bg-card rounded-xl p-6 shadow-card border border-border/50">
          <div className="flex items-center justify-between mb-6">
            <button onClick={prevMonth} className="p-2 hover:bg-muted rounded-lg transition-colors">
              <ChevronLeft className="w-5 h-5 text-foreground" />
            </button>
            <h2 className="font-display text-xl text-foreground">{monthName}</h2>
            <button onClick={nextMonth} className="p-2 hover:bg-muted rounded-lg transition-colors">
              <ChevronRight className="w-5 h-5 text-foreground" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div key={d} className="text-center text-xs font-medium text-muted-foreground py-2">{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {days.map((day, i) => {
              if (!day) return <div key={i} />;
              const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
              const entry = entryDays[dateStr];
              return (
                <div
                  key={i}
                  className={`aspect-square rounded-lg p-1.5 flex flex-col items-center justify-center cursor-pointer transition-colors ${
                    entry ? "bg-primary/8 hover:bg-primary/15" : "hover:bg-muted/50"
                  }`}
                >
                  <span className="text-sm text-foreground">{day}</span>
                  {entry && (
                    <div className="flex gap-0.5 mt-0.5">
                      {entry.types.map((t, j) => (
                        <span key={j} className="text-[10px]">{t}</span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
