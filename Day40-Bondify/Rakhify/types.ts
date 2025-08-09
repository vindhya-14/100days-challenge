
export enum View {
  Welcome,
  Quiz,
  Results,
  Promise,
}

export enum SiblingType {
  SisterBrother = 'Sister-Brother',
  BrotherBrother = 'Brother-Brother',
  SisterSister = 'Sister-Sister',
}

export interface QuizQuestion {
  id: number;
  question: string;
  answers: { text: string; emoji: string }[];
}

export interface QuizAnswer {
  questionId: number;
  index: number;
}

export interface ResultData {
  title: string;
  description: string;
  score: number;
  superpower: string;
  rakhiColor: string;
  memoryIdea: string;
}
