import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useJournalEntries } from "@/hooks/useData";

const moodEmoji: Record<string, string> = {
  very_positive: "😊", positive: "🙂", neutral: "😐", stressed: "😰", sad: "😢",
};

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { data: entries } = useJournalEntries();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const days: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  const getEntryForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return entries?.filter((e) => e.entry_date === dateStr) || [];
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl animate-fade-in">
        <h1 className="font-display text-3xl text-foreground mb-8">Calendar</h1>

        <div className="bg-card rounded-xl p-6 shadow-card border border-border/50">
          <div className="flex items-center justify-between mb-6">
            <button onClick={() => setCurrentDate(new Date(year, month - 1, 1))} className="p-2 hover:bg-muted rounded-lg transition-colors">
              <ChevronLeft className="w-5 h-5 text-foreground" />
            </button>
            <h2 className="font-display text-xl text-foreground">{monthName}</h2>
            <button onClick={() => setCurrentDate(new Date(year, month + 1, 1))} className="p-2 hover:bg-muted rounded-lg transition-colors">
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
              const dayEntries = getEntryForDay(day);
              const hasEntries = dayEntries.length > 0;
              return (
                <div
                  key={i}
                  className={`aspect-square rounded-lg p-1.5 flex flex-col items-center justify-center cursor-pointer transition-colors ${
                    hasEntries ? "bg-primary/10 hover:bg-primary/20" : "hover:bg-muted/50"
                  }`}
                >
                  <span className="text-sm text-foreground">{day}</span>
                  {hasEntries && (
                    <div className="flex gap-0.5 mt-0.5">
                      {dayEntries[0]?.mood && <span className="text-[10px]">{moodEmoji[dayEntries[0].mood]}</span>}
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
