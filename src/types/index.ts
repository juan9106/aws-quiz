export interface IQuestion {
  number: number;
  question: string;
  options: string[];
  answers: string[];
  type: "multi option" | "single option";
}
export type Answers = Record<number, string[]>;
