import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Target, TrendingUp, Plus } from "lucide-react";
import { useBuckets, useCreateBucket, useJournalEntries } from "@/hooks/useData";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const categories = ["Health", "Fitness", "Career", "Creativity", "Relationships", "Travel"];

export default function BucketsPage() {
  const { data: buckets, isLoading } = useBuckets();
  const { data: entries } = useJournalEntries();
  const createBucket = useCreateBucket();
  const [showNew, setShowNew] = useState(false);
  const [name, setName] = useState("");
  const [goal, setGoal] = useState("");
  const [category, setCategory] = useState("");

  const activeBuckets = buckets?.filter((b) => b.is_active) || [];

  const handleCreate = async () => {
    if (!name) return;
    await createBucket.mutateAsync({ name, goal, category });
    setName("");
    setGoal("");
    setCategory("");
    setShowNew(false);
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl animate-fade-in">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl text-foreground mb-1">Buckets</h1>
            <p className="text-muted-foreground">Track your personal goals. Up to 2 active buckets.</p>
          </div>
          {activeBuckets.length < 2 && (
            <button
              onClick={() => setShowNew(true)}
              className="flex items-center gap-2 bg-primary text-primary-foreground rounded-full px-5 py-2.5 text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              <Plus className="w-4 h-4" />
              New Bucket
            </button>
          )}
        </div>

        {isLoading ? (
          <p className="text-muted-foreground text-center py-12">Loading...</p>
        ) : activeBuckets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeBuckets.map((bucket) => {
              const bucketEntries = entries?.filter((e) => e.bucket_id === bucket.id) || [];
              return (
                <div key={bucket.id} className="bg-card rounded-xl p-6 shadow-card border border-border/50">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center">
                      <Target className="w-5 h-5 text-secondary" />
                    </div>
                    <div>
                      <h3 className="font-display text-lg text-foreground">{bucket.name}</h3>
                      {bucket.goal && <p className="text-xs text-muted-foreground">{bucket.goal}</p>}
                    </div>
                  </div>
                  <div className="flex gap-4 mb-4">
                    <div className="text-center">
                      <p className="text-2xl font-semibold text-foreground">{bucketEntries.length}</p>
                      <p className="text-xs text-muted-foreground">Entries</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center gap-1 justify-center">
                        <TrendingUp className="w-4 h-4 text-secondary" />
                        <p className="text-sm font-medium text-foreground">Active</p>
                      </div>
                      <p className="text-xs text-muted-foreground">Status</p>
                    </div>
                  </div>
                  {bucket.category && (
                    <span className="text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground">{bucket.category}</span>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-card rounded-xl p-8 border border-dashed border-border text-center">
            <p className="text-muted-foreground text-sm">No active buckets yet. Create one to start tracking goals.</p>
          </div>
        )}
      </div>

      <Dialog open={showNew} onOpenChange={setShowNew}>
        <DialogContent className="sm:max-w-md bg-card border-border shadow-elevated">
          <DialogHeader>
            <DialogTitle className="font-display text-xl text-foreground">New Bucket</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1">Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Health"
                className="w-full bg-muted/30 border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1">Goal</label>
              <input
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="e.g., Gain 10 pounds"
                className="w-full bg-muted/30 border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-muted/30 border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <option value="">Select...</option>
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowNew(false)} className="px-4 py-2 text-sm text-muted-foreground hover:bg-muted rounded-full">Cancel</button>
              <button
                onClick={handleCreate}
                disabled={!name || createBucket.isPending}
                className="px-5 py-2 bg-primary text-primary-foreground rounded-full text-sm font-semibold hover:opacity-90 disabled:opacity-40"
              >
                {createBucket.isPending ? "Creating..." : "Create Bucket"}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
