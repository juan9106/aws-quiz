import { useEffect, useState } from "react";
import type { Answers, IQuestion } from "../types";
import { calculateScore, selectQuestions } from "../lib/quiz";
type Session = {
  status: "idle" | "active" | "completed";
  name: string;
  questions: IQuestion[];
  answers: Answers;
  deadline: number;
  timeLeft: number;
  score: number;
};
const empty: Session = {
  status: "idle",
  name: "",
  questions: [],
  answers: {},
  deadline: 0,
  timeLeft: 0,
  score: 0,
};
const complete = (s: Session): Session => ({
  ...s,
  status: "completed",
  score: calculateScore(s.questions, s.answers),
});
export function useQuiz(bank: IQuestion[]) {
  const [session, setSession] = useState<Session>(empty);
  useEffect(() => {
    if (session.status !== "active") return;
    const tick = () =>
      setSession((s) => {
        if (s.status !== "active") return s;
        const timeLeft = Math.max(
          0,
          Math.ceil((s.deadline - Date.now()) / 1000),
        );
        return timeLeft === 0
          ? complete({ ...s, timeLeft })
          : { ...s, timeLeft };
      });
    const interval = window.setInterval(tick, 250);
    window.addEventListener("focus", tick);
    document.addEventListener("visibilitychange", tick);
    return () => {
      window.clearInterval(interval);
      window.removeEventListener("focus", tick);
      document.removeEventListener("visibilitychange", tick);
    };
  }, [session.status]);
  function start(name: string, count: number) {
    if (
      !name.trim() ||
      !Number.isInteger(count) ||
      count < 1 ||
      count > Math.min(10, bank.length)
    )
      return false;
    setSession({
      ...empty,
      status: "active",
      name: name.trim(),
      questions: selectQuestions(bank, count),
      timeLeft: count * 120,
      deadline: Date.now() + count * 120000,
    });
    return true;
  }
  function answer(id: number, selected: string[]) {
    setSession((s) => {
      if (s.status !== "active") return s;
      if (Date.now() >= s.deadline) return complete({ ...s, timeLeft: 0 });
      const q = s.questions.find((q) => q.number === id);
      if (
        !q ||
        selected.some((a) => !q.options.includes(a)) ||
        (q.type === "single option" && selected.length > 1)
      )
        return s;
      return { ...s, answers: { ...s.answers, [id]: [...new Set(selected)] } };
    });
  }
  function finish() {
    setSession((s) =>
      s.status === "active"
        ? complete({
            ...s,
            timeLeft: Math.max(0, Math.ceil((s.deadline - Date.now()) / 1000)),
          })
        : s,
    );
  }
  return { ...session, start, answer, finish, reset: () => setSession(empty) };
}
export type Quiz = ReturnType<typeof useQuiz>;
