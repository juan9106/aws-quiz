import type { Answers, IQuestion } from "../types";
const strings = (v: unknown): v is string[] =>
  Array.isArray(v) &&
  v.length > 0 &&
  v.every((x) => typeof x === "string" && x.trim()) &&
  new Set(v).size === v.length;
export function validateQuestions(data: unknown): IQuestion[] {
  if (!Array.isArray(data) || !data.length)
    throw new Error("Invalid question bank");
  const ids = new Set<number>();
  return data.map((item: unknown) => {
    if (!item || typeof item !== "object") throw new Error("Invalid question");
    const q = item as Record<string, unknown>;
    if (
      typeof q.number !== "number" ||
      !Number.isInteger(q.number) ||
      q.number < 1 ||
      ids.has(q.number) ||
      typeof q.question !== "string" ||
      !q.question.trim() ||
      !strings(q.options) ||
      q.options.length < 2 ||
      !strings(q.answers) ||
      !q.answers.every((a) => (q.options as string[]).includes(a)) ||
      (q.type !== "single option" && q.type !== "multi option") ||
      (q.type === "single option"
        ? q.answers.length !== 1
        : q.answers.length < 2)
    )
      throw new Error("Invalid question");
    ids.add(q.number);
    return {
      number: q.number,
      question: q.question,
      options: [...q.options],
      answers: [...q.answers],
      type: q.type,
    };
  });
}
export function selectQuestions(
  bank: IQuestion[],
  count: number,
  random = Math.random,
) {
  const copy = [...bank];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, count);
}
export function calculateScore(questions: IQuestion[], answers: Answers) {
  return questions.reduce((score, q) => {
    const selected = [...new Set(answers[q.number] ?? [])];
    return selected.some((a) => !q.answers.includes(a))
      ? score
      : score + selected.length / q.answers.length;
  }, 0);
}
