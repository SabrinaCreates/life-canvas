import { DashboardLayout } from "@/components/DashboardLayout";
import { Shield, Bell, Palette, Download } from "lucide-react";

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div className="max-w-2xl animate-fade-in">
        <h1 className="font-display text-3xl text-foreground mb-8">Settings</h1>

        <div className="space-y-4">
          <div className="bg-card rounded-xl p-6 shadow-card border border-border/50">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-5 h-5 text-primary" />
              <h3 className="font-display text-lg text-foreground">Privacy</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              All your entries are private and encrypted. Only you can access your data.
            </p>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-foreground">Two-factor authentication</span>
              <span className="text-xs bg-muted px-3 py-1 rounded-full text-muted-foreground">Coming soon</span>
            </div>
          </div>

          <div className="bg-card rounded-xl p-6 shadow-card border border-border/50">
            <div className="flex items-center gap-3 mb-4">
              <Bell className="w-5 h-5 text-accent" />
              <h3 className="font-display text-lg text-foreground">Notifications</h3>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-foreground">Daily journal reminder</span>
              <span className="text-xs bg-muted px-3 py-1 rounded-full text-muted-foreground">Coming soon</span>
            </div>
          </div>

          <div className="bg-card rounded-xl p-6 shadow-card border border-border/50">
            <div className="flex items-center gap-3 mb-4">
              <Download className="w-5 h-5 text-secondary" />
              <h3 className="font-display text-lg text-foreground">Export Data</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Download all your journal entries and media.
            </p>
            <button className="text-sm text-primary font-medium hover:underline">
              Export all data
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
