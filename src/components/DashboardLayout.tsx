import { useState } from "react";
import { AppSidebar } from "./AppSidebar";
import { NewEntryModal } from "./NewEntryModal";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [showNewEntry, setShowNewEntry] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar onNewEntry={() => setShowNewEntry(true)} />
      <main className="ml-64 p-8">
        {children}
      </main>
      <NewEntryModal open={showNewEntry} onOpenChange={setShowNewEntry} />
    </div>
  );
}
