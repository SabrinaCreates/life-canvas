import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { ChevronLeft, ChevronRight, X, BookOpen, Camera, Mic } from "lucide-react";
import { useJournalEntries } from "@/hooks/useData";
import { getPhotoForEntry } from "@/lib/demoPhotos";

const moodEmoji: Record<string, string> = {
  very_positive: "😊", positive: "🙂", neutral: "😐", stressed: "😰", sad: "😢",
};
const moodLabel: Record<string, string> = {
  very_positive: "Very Positive", positive: "Positive", neutral: "Neutral", stressed: "Stressed", sad: "Sad",
};
const typeEmoji: Record<string, string> = { text: "📝", photo: "📷", voice: "🎤" };
const typeIcon = { text: BookOpen, photo: Camera, voice: Mic };

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
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

  const selectedEntries = selectedDay ? getEntryForDay(selectedDay) : [];
  const selectedDateStr = selectedDay
    ? new Date(year, month, selectedDay).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })
    : "";

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
              const isSelected = selectedDay === day;
              return (
                <button
                  key={i}
                  onClick={() => hasEntries && setSelectedDay(day)}
                  className={`aspect-square rounded-lg p-1 flex flex-col items-center justify-center transition-all ${
                    isSelected
                      ? "bg-primary/20 ring-2 ring-primary/40"
                      : hasEntries
                      ? "bg-primary/10 hover:bg-primary/20 hover:shadow-soft"
                      : "hover:bg-muted/50"
                  } ${hasEntries ? "cursor-pointer" : "cursor-default"}`}
                >
                  <span className={`text-sm ${hasEntries ? "font-medium text-foreground" : "text-foreground/60"}`}>{day}</span>
                  {hasEntries && (
                    <div className="flex gap-0.5 mt-0.5">
                      {dayEntries.map((e, idx) => (
                        <span key={idx} className="text-[9px] leading-none">
                          {typeEmoji[e.entry_type] || "📝"}
                        </span>
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Entry Detail Modal */}
        {selectedDay && selectedEntries.length > 0 && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedDay(null)}>
            <div className="bg-card rounded-2xl shadow-elevated max-w-lg w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between p-5 border-b border-border/50">
                <h3 className="font-display text-lg text-foreground">{selectedDateStr}</h3>
                <button onClick={() => setSelectedDay(null)} className="p-1.5 hover:bg-muted rounded-lg transition-colors">
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
              <div className="p-5 space-y-5">
                {selectedEntries.map((entry) => {
                  const Icon = typeIcon[(entry.entry_type as keyof typeof typeIcon) || "text"];
                  const photo = getPhotoForEntry(entry.content || "", entry.entry_type);
                  const bucketName = (entry.buckets as any)?.name;
                  const peopleMentions = (entry.people_mentions as any[]) || [];
                  const tags = (entry.entry_tags as any[]) || [];

                  return (
                    <div key={entry.id} className="space-y-3">
                      {/* Mood & Type */}
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{entry.mood ? moodEmoji[entry.mood] : "📝"}</span>
                        <div>
                          <span className="text-sm font-medium text-foreground">
                            {entry.mood ? moodLabel[entry.mood] : "No mood"}
                          </span>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <Icon className="w-3 h-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground capitalize">{entry.entry_type} entry</span>
                          </div>
                        </div>
                        {bucketName && (
                          <span className="ml-auto text-xs bg-secondary/20 text-secondary-foreground px-2.5 py-1 rounded-full font-medium">
                            {bucketName}
                          </span>
                        )}
                      </div>

                      {/* Photo */}
                      {photo && (
                        <div className="rounded-xl overflow-hidden">
                          <img src={photo} alt="Entry photo" className="w-full h-48 object-cover" />
                        </div>
                      )}

                      {/* Content */}
                      <p className="text-sm text-foreground/80 leading-relaxed">{entry.content}</p>

                      {/* Tags & People */}
                      {(tags.length > 0 || peopleMentions.length > 0) && (
                        <div className="flex gap-1.5 flex-wrap">
                          {tags.map((t: any) => (
                            <span key={t.tag} className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">#{t.tag}</span>
                          ))}
                          {peopleMentions.map((p: any) => (
                            <span key={p.person_name} className="text-xs bg-primary/10 px-2 py-0.5 rounded-full text-primary">@{p.person_name}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
