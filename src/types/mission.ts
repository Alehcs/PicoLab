export type MissionDifficulty = 'Easy' | 'Medium' | 'Hard';

export type MissionSubject = 'Math' | 'Physics';

export type MissionReward = {
  label: string;
  points: number;
};

export type Mission = {
  id: string;
  title: string;
  subject: MissionSubject;
  topic: string;
  difficulty: MissionDifficulty;
  reward: MissionReward;
  description?: string;
  question?: PracticeQuestion;
};

export type AnswerOption = {
  id: string;
  label: string;
};

export type PracticeQuestion = {
  id: string;
  prompt: string;
  options: AnswerOption[];
  correctOptionId: string;
  feedbackCorrect: string;
  feedbackUsefulSignal: string;
};
