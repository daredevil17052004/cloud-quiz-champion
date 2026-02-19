import { useEffect, useState } from "react";
import { fetchLeaderboard } from "@/lib/supabase-quiz";
import { Trophy, Clock, Medal, ArrowLeft, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface LeaderboardProps {
  onBack: () => void;
  highlightId?: string;
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

export function LeaderboardPage({ onBack, highlightId }: LeaderboardProps) {
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard()
      .then(setEntries)
      .finally(() => setLoading(false));
  }, []);

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-5 h-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-slate-400" />;
    if (rank === 3) return <Medal className="w-5 h-5 text-amber-600" />;
    return <span className="text-sm font-bold text-muted-foreground w-5 text-center">{rank}</span>;
  };

  const getRankBg = (rank: number) => {
    if (rank === 1) return "bg-yellow-50 border-yellow-300";
    if (rank === 2) return "bg-slate-50 border-slate-300";
    if (rank === 3) return "bg-amber-50 border-amber-300";
    return "bg-card border-border";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="gradient-hero px-4 py-10 text-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="text-white/80 hover:text-white hover:bg-white/10 mb-4 absolute top-4 left-4"
        >
          <ArrowLeft className="mr-1 w-4 h-4" /> Back
        </Button>
        <Trophy className="w-12 h-12 text-yellow-300 mx-auto mb-3" />
        <h2 className="text-3xl font-display font-bold text-white">Global Leaderboard</h2>
        <p className="text-white/70 text-sm mt-1">Ranked by highest score, then fastest time</p>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-muted rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : entries.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Trophy className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No participants yet. Be the first!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {entries.map((entry, i) => {
              const rank = i + 1;
              const isHighlighted = entry.id === highlightId;
              const isWinner = rank === 1;

              return (
                <div
                  key={entry.id}
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-2xl border-2 transition-all animate-slide-up shadow-card",
                    getRankBg(rank),
                    isHighlighted && "ring-2 ring-primary ring-offset-2"
                  )}
                  style={{ animationDelay: `${i * 0.04}s` }}
                >
                  <div className="w-8 flex items-center justify-center flex-shrink-0">
                    {getRankIcon(rank)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-sm text-foreground truncate">{entry.name}</p>
                      {isWinner && (
                        <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-semibold flex-shrink-0">
                          Winner 🏆
                        </span>
                      )}
                      {isHighlighted && !isWinner && (
                        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-semibold flex-shrink-0">
                          You
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {formatTime(entry.completion_time)}
                      </span>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <p className="text-xl font-display font-bold text-foreground">{entry.score}</p>
                    <p className="text-xs text-muted-foreground">/{entry.total_questions}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
