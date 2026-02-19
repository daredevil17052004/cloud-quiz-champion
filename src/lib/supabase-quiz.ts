import { supabase } from "@/integrations/supabase/client";

export interface QuizParticipant {
  id?: string;
  name: string;
  email: string;
  answers: number[];
  score: number;
  total_questions: number;
  completion_time: number;
  completed_at?: string;
}

export async function submitQuizResult(participant: QuizParticipant) {
  const { data, error } = await supabase
    .from("quiz_participants")
    .insert({
      name: participant.name,
      email: participant.email,
      answers: participant.answers,
      score: participant.score,
      total_questions: participant.total_questions,
      completion_time: participant.completion_time,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function fetchLeaderboard() {
  const { data, error } = await supabase
    .from("quiz_participants")
    .select("*")
    .order("score", { ascending: false })
    .order("completion_time", { ascending: true })
    .limit(100);

  if (error) throw error;
  return data;
}

export async function fetchAllParticipants() {
  const { data, error } = await supabase
    .from("quiz_participants")
    .select("*")
    .order("completed_at", { ascending: false });

  if (error) throw error;
  return data;
}
