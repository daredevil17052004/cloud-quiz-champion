import { Cloud, Zap, Globe, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LandingPageProps {
  onStart: () => void;
}

export function LandingPage({ onStart }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden gradient-hero">
        {/* Decorative circles */}
        <div className="absolute top-[-100px] right-[-100px] w-[400px] h-[400px] rounded-full bg-white/5 blur-3xl" />
        <div className="absolute bottom-[-80px] left-[-80px] w-[300px] h-[300px] rounded-full bg-white/5 blur-3xl" />

        <div className="relative max-w-4xl mx-auto px-4 py-20 text-center animate-slide-up">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
            <Cloud className="w-4 h-4 text-white" />
            <span className="text-white/90 text-sm font-medium">10 Questions • 15 sec each</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-6 leading-tight">
            Cloud Computing
            <br />
            <span className="text-white/80">Quiz</span>
          </h1>
          <p className="text-white/75 text-lg md:text-xl mb-10 max-w-xl mx-auto leading-relaxed">
            Test your knowledge of cloud computing concepts. Race against the timer and compete on the global leaderboard!
          </p>
          <Button
            onClick={onStart}
            size="lg"
            className="bg-white text-primary hover:bg-white/90 font-semibold text-lg px-10 py-4 h-auto rounded-2xl shadow-hero transition-all duration-200 hover:scale-105 active:scale-95"
          >
            Start Quiz →
          </Button>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { icon: Zap, title: "15-Second Timer", desc: "Each question has a 15-second countdown — stay sharp!", color: "text-yellow-500" },
            { icon: Globe, title: "Global Leaderboard", desc: "Compete with participants worldwide. Top score wins!", color: "text-primary" },
            { icon: Shield, title: "Instant Results", desc: "See your score, review answers, and track your performance.", color: "text-accent" },
            { icon: Cloud, title: "10 Questions", desc: "Covering IaaS, SaaS, PaaS, and core cloud concepts.", color: "text-secondary" },
          ].map(({ icon: Icon, title, desc, color }) => (
            <div key={title} className="bg-card rounded-2xl p-6 shadow-card border border-border animate-fade-in">
              <div className={`w-10 h-10 rounded-xl bg-muted flex items-center justify-center mb-4`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <h3 className="font-display font-semibold text-lg text-card-foreground mb-1">{title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
