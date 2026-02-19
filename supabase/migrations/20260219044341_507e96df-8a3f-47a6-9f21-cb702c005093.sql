
-- Create quiz_participants table
CREATE TABLE public.quiz_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  answers jsonb NOT NULL DEFAULT '[]',
  score integer NOT NULL DEFAULT 0,
  total_questions integer NOT NULL DEFAULT 10,
  completion_time integer NOT NULL DEFAULT 0,
  completed_at timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.quiz_participants ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (public quiz)
CREATE POLICY "Anyone can submit quiz results"
ON public.quiz_participants
FOR INSERT
WITH CHECK (true);

-- Allow anyone to read (for leaderboard)
CREATE POLICY "Anyone can view quiz results"
ON public.quiz_participants
FOR SELECT
USING (true);

-- Create index for leaderboard sorting
CREATE INDEX idx_quiz_participants_score_time ON public.quiz_participants (score DESC, completion_time ASC);
