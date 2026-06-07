export type MissionQuestion = {
  id: string;
  prompt: string;
  options: string[];
  correctOptionIndex: number;
  feedbackCorrect: string;
  feedbackWrong: string;
};

export type PracticeMission = {
  id: string;
  title: string;
  focusArea: string;
  questions: MissionQuestion[];
};
