import { useEffect, useState } from "react";
import { fetchAllParticipants } from "@/lib/supabase-quiz";
import { Download, Users, Trophy, Clock, ArrowLeft, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminDashboardProps {
  onBack: () => void;
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

function formatDate(str: string) {
  return new Date(str).toLocaleString(undefined, { dateStyle: "short", timeStyle: "short" });
}

export function AdminDashboard({ onBack }: AdminDashboardProps) {
  const [participants, setParticipants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllParticipants()
      .then(setParticipants)
      .finally(() => setLoading(false));
  }, []);

  const exportCSV = () => {
    const headers = ["Name", "Email", "Score", "Total Questions", "Completion Time (s)", "Completed At"];
    const rows = participants.map((p) => [
      p.name,
      p.email,
      p.score,
      p.total_questions,
      p.completion_time,
      new Date(p.completed_at).toISOString(),
    ]);
    const csv = [headers, ...rows].map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `quiz-results-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const avgScore = participants.length > 0
    ? (participants.reduce((s, p) => s + p.score, 0) / participants.length).toFixed(1)
    : "—";

  const topScorer = participants.length > 0
    ? [...participants].sort((a, b) => b.score - a.score || a.completion_time - b.completion_time)[0]
    : null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 py-4 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="mr-1 w-4 h-4" /> Back
            </Button>
            <div>
              <h1 className="text-lg font-display font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-xs text-muted-foreground">Cloud Computing Quiz Results</p>
            </div>
          </div>
          <Button onClick={exportCSV} className="gradient-hero text-white border-0 hover:opacity-90">
            <Download className="mr-2 w-4 h-4" />
            Export CSV
          </Button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {[
            { icon: Users, label: "Total Participants", value: participants.length, color: "text-primary" },
            { icon: BarChart3, label: "Avg. Score", value: avgScore, color: "text-secondary" },
            { icon: Trophy, label: "Top Scorer", value: topScorer ? `${topScorer.name} (${topScorer.score}pts)` : "—", color: "text-yellow-500", small: true },
          ].map(({ icon: Icon, label, value, color, small }) => (
            <div key={label} className="bg-card rounded-2xl p-5 shadow-card border border-border">
              <Icon className={`w-5 h-5 ${color} mb-2`} />
              <p className="text-2xl font-display font-bold text-foreground truncate" style={small ? { fontSize: "1rem" } : {}}>
                {value}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Table */}
        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => <div key={i} className="h-12 bg-muted rounded-xl animate-pulse" />)}
          </div>
        ) : participants.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No participants yet.</p>
          </div>
        ) : (
          <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-card">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground">#</th>
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Name</th>
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Email</th>
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Score</th>
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground">
                      <Clock className="w-3.5 h-3.5 inline mr-1" />Time
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {participants.map((p, i) => (
                    <tr key={p.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-muted-foreground">{i + 1}</td>
                      <td className="px-4 py-3 font-medium text-foreground">{p.name}</td>
                      <td className="px-4 py-3 text-muted-foreground truncate max-w-[180px]">{p.email}</td>
                      <td className="px-4 py-3">
                        <span className="font-bold text-foreground">{p.score}</span>
                        <span className="text-muted-foreground">/{p.total_questions}</span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{formatTime(p.completion_time)}</td>
                      <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{formatDate(p.completed_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
