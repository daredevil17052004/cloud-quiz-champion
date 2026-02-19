import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, ArrowRight } from "lucide-react";

interface RegistrationFormProps {
  onRegister: (name: string, email: string) => void;
}

export function RegistrationForm({ onRegister }: RegistrationFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

  const validate = () => {
    const newErrors: { name?: string; email?: string } = {};
    if (!name.trim()) newErrors.name = "Name is required";
    else if (name.trim().length < 2) newErrors.name = "Name must be at least 2 characters";
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = "Please enter a valid email";
    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    onRegister(name.trim(), email.trim().toLowerCase());
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md animate-slide-up">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-display font-bold text-foreground mb-2">Enter Your Details</h2>
          <p className="text-muted-foreground">We'll use this to track your score on the leaderboard.</p>
        </div>

        <div className="bg-card rounded-3xl p-8 shadow-card border border-border">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-sm font-medium text-foreground">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => { setName(e.target.value); setErrors(p => ({...p, name: undefined})); }}
                  placeholder="John Doe"
                  className={`pl-10 h-12 rounded-xl border-border focus-visible:ring-primary ${errors.name ? 'border-destructive' : ''}`}
                  maxLength={100}
                />
              </div>
              {errors.name && <p className="text-destructive text-xs mt-1">{errors.name}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-medium text-foreground">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setErrors(p => ({...p, email: undefined})); }}
                  placeholder="john@example.com"
                  className={`pl-10 h-12 rounded-xl border-border focus-visible:ring-primary ${errors.email ? 'border-destructive' : ''}`}
                  maxLength={255}
                />
              </div>
              {errors.email && <p className="text-destructive text-xs mt-1">{errors.email}</p>}
            </div>

            <Button
              type="submit"
              className="w-full h-12 rounded-xl gradient-hero text-white font-semibold text-base mt-2 transition-all duration-200 hover:opacity-90 hover:scale-[1.02] active:scale-95 border-0"
            >
              Begin Quiz <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
