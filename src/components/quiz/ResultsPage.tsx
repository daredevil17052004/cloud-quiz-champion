import { quizQuestions } from "@/data/questions";
import { CheckCircle2, XCircle, Trophy, RotateCcw, Award, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Confetti } from "./Confetti";

const OPTION_LABELS = ["A", "B", "C", "D"];

interface ResultsPageProps {
  name: string;
  score: number;
  userAnswers: (number | null)[];
  completionTime: number;
  onViewLeaderboard: () => void;
  onRetake: () => void;
  isTopScorer?: boolean;
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

export function ResultsPage({ name, score, userAnswers, completionTime, onViewLeaderboard, onRetake, isTopScorer }: ResultsPageProps) {
  const total = quizQuestions.length;
  const pct = Math.round((score / total) * 100);

  const getMessage = () => {
    if (pct >= 90) return { text: "Outstanding! 🎉", sub: "You're a cloud computing expert!" };
    if (pct >= 70) return { text: "Great job! 👏", sub: "You have solid cloud knowledge." };
    if (pct >= 50) return { text: "Good effort! 💪", sub: "Keep learning and try again." };
    return { text: "Keep practicing! 📚", sub: "Review the answers below and try again." };
  };

  const msg = getMessage();

  return (
    <div className="min-h-screen bg-background pb-16">
      <Confetti active={isTopScorer === true} />

      {/* Score Hero */}
      <div className="gradient-hero px-4 py-12 text-center">
        {isTopScorer && (
          <div className="inline-flex items-center gap-2 bg-yellow-400/20 border border-yellow-400/30 rounded-full px-4 py-2 mb-4 animate-bounce-in">
            <Trophy className="w-4 h-4 text-yellow-300" />
            <span className="text-yellow-200 font-semibold text-sm">🏆 Top Scorer!</span>
          </div>
        )}
        <h2 className="text-2xl font-display font-bold text-white mb-1">{msg.text}</h2>
        <p className="text-white/70 text-sm mb-6">{msg.sub}</p>
        <div className="inline-flex items-end gap-2 animate-bounce-in">
          <span className="text-7xl font-display font-black text-white">{score}</span>
          <span className="text-3xl text-white/60 mb-2">/{total}</span>
        </div>
        <div className="flex items-center justify-center gap-6 mt-4 text-white/70 text-sm">
          <div className="flex items-center gap-1.5">
            <Award className="w-4 h-4" />
            <span>{pct}% score</span>
          </div>
          <div className="flex items-center gap-1.5">
            <BarChart3 className="w-4 h-4" />
            <span>{formatTime(completionTime)}</span>
          </div>
        </div>
      </div>

      {/* Answer Review */}
      <div className="max-w-2xl mx-auto px-4 mt-8">
        <h3 className="text-lg font-display font-semibold text-foreground mb-4">Answer Review</h3>
        <div className="space-y-4">
          {quizQuestions.map((q, qi) => {
            const userAns = userAnswers[qi];
            const isCorrect = userAns === q.correctAnswer;
            const skipped = userAns === null;

            return (
              <div
                key={qi}
                className={cn(
                  "bg-card rounded-2xl border-2 p-5 shadow-card animate-fade-in",
                  isCorrect ? "border-green-200" : "border-red-200"
                )}
                style={{ animationDelay: `${qi * 0.05}s` }}
              >
                <div className="flex items-start gap-3 mb-3">
                  {isCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  )}
                  <p className="text-sm font-semibold text-foreground leading-snug">{q.question}</p>
                </div>
                <div className="ml-8 space-y-1.5">
                  {q.options.map((opt, oi) => {
                    const isCorrectOpt = oi === q.correctAnswer;
                    const isUserOpt = oi === userAns;

                    return (
                      <div
                        key={oi}
                        className={cn(
                          "flex items-center gap-2 text-xs px-3 py-2 rounded-xl",
                          isCorrectOpt ? "bg-green-50 text-green-700 font-medium" :
                          isUserOpt && !isCorrectOpt ? "bg-red-50 text-red-600" :
                          "text-muted-foreground"
                        )}
                      >
                        <span className={cn(
                          "w-5 h-5 rounded-md flex items-center justify-center font-bold text-xs flex-shrink-0",
                          isCorrectOpt ? "bg-green-500 text-white" :
                          isUserOpt && !isCorrectOpt ? "bg-red-400 text-white" :
                          "bg-muted text-muted-foreground"
                        )}>
                          {OPTION_LABELS[oi]}
                        </span>
                        <span>{opt}</span>
                        {isCorrectOpt && <span className="ml-auto font-semibold">✓ Correct</span>}
                        {isUserOpt && !isCorrectOpt && <span className="ml-auto">Your answer</span>}
                        {skipped && isCorrectOpt && <span className="ml-auto text-orange-500">Skipped</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 mt-8">
          <Button
            onClick={onViewLeaderboard}
            className="flex-1 h-12 rounded-xl gradient-hero text-white font-semibold border-0 hover:opacity-90"
          >
            <Trophy className="mr-2 w-4 h-4" />
            View Leaderboard
          </Button>
          <Button
            onClick={onRetake}
            variant="outline"
            className="flex-1 h-12 rounded-xl font-semibold"
          >
            <RotateCcw className="mr-2 w-4 h-4" />
            Retake Quiz
          </Button>
        </div>
      </div>
    </div>
  );
}
