import { useEffect, useRef, useState } from "react";
import { quizQuestions } from "@/data/questions";
import { Clock, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const TIMER_SECONDS = 15;
const OPTION_LABELS = ["A", "B", "C", "D"];

interface QuizScreenProps {
  currentIndex: number;
  onAnswer: (selectedIndex: number | null) => void;
  userAnswers: (number | null)[];
}

export function QuizScreen({ currentIndex, onAnswer }: QuizScreenProps) {
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const answeredRef = useRef(false);

  const question = quizQuestions[currentIndex];
  const progress = (currentIndex / quizQuestions.length) * 100;

  useEffect(() => {
    setTimeLeft(TIMER_SECONDS);
    setSelected(null);
    setAnswered(false);
    answeredRef.current = false;
  }, [currentIndex]);

  useEffect(() => {
    if (answeredRef.current) return;
    if (timeLeft <= 0) {
      answeredRef.current = true;
      setAnswered(true);
      setTimeout(() => onAnswer(null), 600);
      return;
    }
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, onAnswer]);

  const handleOptionClick = (idx: number) => {
    if (answered) return;
    setSelected(idx);
  };

  const handleSubmit = (ans: number | null) => {
    if (answeredRef.current) return;
    answeredRef.current = true;
    setAnswered(true);
    setTimeout(() => onAnswer(ans), 600);
  };

  const timerPct = (timeLeft / TIMER_SECONDS) * 100;

  const getTimerColor = () => {
    if (timeLeft > 10) return { bg: "hsl(var(--primary))", light: "hsl(var(--primary) / 0.1)" };
    if (timeLeft > 5) return { bg: "hsl(38 92% 50%)", light: "hsl(38 92% 50% / 0.1)" };
    return { bg: "hsl(var(--destructive))", light: "hsl(var(--destructive) / 0.1)" };
  };

  const timerColors = getTimerColor();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Bar */}
      <div className="bg-card border-b border-border px-4 py-3 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">
              Question{" "}
              <span className="text-foreground font-semibold">{currentIndex + 1}</span>{" "}
              / {quizQuestions.length}
            </span>
            <div
              className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold", timeLeft <= 5 ? "timer-pulse" : "")}
              style={{ backgroundColor: timerColors.light, color: timerColors.bg }}
            >
              <Clock className="w-3.5 h-3.5" />
              {timeLeft}s
            </div>
          </div>
          {/* Progress bar */}
          <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${progress}%`, background: "var(--gradient-hero)" }}
            />
          </div>
          {/* Timer bar */}
          <div className="w-full h-1 bg-muted rounded-full overflow-hidden mt-1">
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{ width: `${timerPct}%`, backgroundColor: timerColors.bg }}
            />
          </div>
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 flex items-start justify-center px-4 py-8">
        <div className="w-full max-w-2xl">
          <div className="animate-slide-up">
            <div className="mb-6">
              <div className="inline-block gradient-hero text-white text-xs font-semibold px-3 py-1 rounded-full mb-4">
                Q{currentIndex + 1}
              </div>
              <h2 className="text-xl md:text-2xl font-display font-bold text-foreground leading-snug">
                {question.question}
              </h2>
            </div>

            <div className="space-y-3">
              {question.options.map((option, idx) => {
                const isSelected = selected === idx;
                const isCorrect = idx === question.correctAnswer;
                const showResult = answered;

                const getOptionClass = () => {
                  if (showResult && isCorrect) return "bg-green-50 border-green-400 cursor-default";
                  if (showResult && isSelected && !isCorrect) return "bg-red-50 border-red-400 cursor-default";
                  if (isSelected && !showResult) return "bg-primary/5 border-primary cursor-pointer";
                  return "bg-card hover:bg-muted/50 border-border hover:border-primary/30 cursor-pointer";
                };

                const getLabelClass = () => {
                  if (showResult && isCorrect) return "bg-green-500 text-white";
                  if (showResult && isSelected && !isCorrect) return "bg-red-500 text-white";
                  if (isSelected) return "gradient-hero text-white";
                  return "bg-muted text-muted-foreground";
                };

                const getTextClass = () => {
                  if (showResult && isCorrect) return "text-green-700";
                  if (showResult && isSelected && !isCorrect) return "text-red-700";
                  return "text-foreground";
                };

                return (
                  <button
                    key={idx}
                    onClick={() => handleOptionClick(idx)}
                    disabled={answered}
                    className={cn(
                      "w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all duration-200 animate-slide-right",
                      getOptionClass()
                    )}
                    style={{ animationDelay: `${idx * 0.07}s` }}
                  >
                    <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 transition-all", getLabelClass())}>
                      {OPTION_LABELS[idx]}
                    </div>
                    <span className={cn("text-sm md:text-base font-medium leading-snug", getTextClass())}>
                      {option}
                    </span>
                  </button>
                );
              })}
            </div>

            {selected !== null && !answered && (
              <div className="mt-6 animate-fade-in">
                <Button
                  onClick={() => handleSubmit(selected)}
                  className="w-full h-12 rounded-xl gradient-hero text-white font-semibold border-0 hover:opacity-90 transition-all"
                >
                  Confirm Answer <ChevronRight className="ml-1 w-4 h-4" />
                </Button>
              </div>
            )}

            {answered && (
              <div className="mt-4 text-center animate-fade-in">
                <p className="text-muted-foreground text-sm">Moving to next question...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
