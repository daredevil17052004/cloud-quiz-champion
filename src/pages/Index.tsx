import { useState, useRef } from "react";
import { LandingPage } from "@/components/quiz/LandingPage";
import { RegistrationForm } from "@/components/quiz/RegistrationForm";
import { QuizScreen } from "@/components/quiz/QuizScreen";
import { ResultsPage } from "@/components/quiz/ResultsPage";
import { LeaderboardPage } from "@/components/quiz/LeaderboardPage";
import { AdminDashboard } from "@/components/quiz/AdminDashboard";
import { quizQuestions } from "@/data/questions";
import { submitQuizResult } from "@/lib/supabase-quiz";
import { Settings } from "lucide-react";

type Stage = "landing" | "register" | "quiz" | "results" | "leaderboard" | "admin";

export default function Index() {
  const [stage, setStage] = useState<Stage>("landing");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>([]);
  const [score, setScore] = useState(0);
  const [completionTime, setCompletionTime] = useState(0);
  const [submittedId, setSubmittedId] = useState<string | undefined>();
  const [isTopScorer, setIsTopScorer] = useState(false);
  const startTimeRef = useRef<number>(0);

  const handleRegister = (n: string, e: string) => {
    setName(n);
    setEmail(e);
    setCurrentIndex(0);
    setUserAnswers([]);
    setScore(0);
    startTimeRef.current = Date.now();
    setStage("quiz");
  };

  const handleAnswer = async (selectedIndex: number | null) => {
    const isCorrect = selectedIndex === quizQuestions[currentIndex].correctAnswer;
    const newAnswers = [...userAnswers, selectedIndex];
    const newScore = score + (isCorrect ? 1 : 0);

    setUserAnswers(newAnswers);
    setScore(newScore);

    if (currentIndex + 1 >= quizQuestions.length) {
      const elapsed = Math.round((Date.now() - startTimeRef.current) / 1000);
      setCompletionTime(elapsed);

      // Submit to database
      try {
        const result = await submitQuizResult({
          name,
          email,
          answers: newAnswers.map((a) => a ?? -1),
          score: newScore,
          total_questions: quizQuestions.length,
          completion_time: elapsed,
        });
        if (result) setSubmittedId(result.id);

        // Check if top scorer
        const { fetchLeaderboard } = await import("@/lib/supabase-quiz");
        const lb = await fetchLeaderboard();
        if (lb.length > 0 && lb[0].id === result?.id) {
          setIsTopScorer(true);
        }
      } catch (err) {
        console.error("Failed to submit quiz result:", err);
      }

      setStage("results");
    } else {
      setCurrentIndex((i) => i + 1);
    }
  };

  const handleRetake = () => {
    setStage("register");
  };

  if (stage === "landing") {
    return (
      <div className="relative">
        <button
          onClick={() => setStage("admin")}
          className="fixed top-4 right-4 z-50 p-2 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 transition-all"
          title="Admin Dashboard"
        >
          <Settings className="w-5 h-5 text-white" />
        </button>
        <LandingPage onStart={() => setStage("register")} />
      </div>
    );
  }

  if (stage === "register") return <RegistrationForm onRegister={handleRegister} />;

  if (stage === "quiz") {
    return (
      <QuizScreen
        currentIndex={currentIndex}
        onAnswer={handleAnswer}
        userAnswers={userAnswers}
      />
    );
  }

  if (stage === "results") {
    return (
      <ResultsPage
        name={name}
        score={score}
        userAnswers={userAnswers}
        completionTime={completionTime}
        onViewLeaderboard={() => setStage("leaderboard")}
        onRetake={handleRetake}
        isTopScorer={isTopScorer}
      />
    );
  }

  if (stage === "leaderboard") {
    return (
      <LeaderboardPage
        onBack={() => setStage("results")}
        highlightId={submittedId}
      />
    );
  }

  if (stage === "admin") {
    return <AdminDashboard onBack={() => setStage("landing")} />;
  }

  return null;
}
