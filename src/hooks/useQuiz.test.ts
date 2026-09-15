import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useQuiz } from "./useQuiz";
import { validateQuestions } from "../lib/quiz";
import data from "../data/questions.json";
const bank = validateQuestions(data);
beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-01-01"));
});
afterEach(() => vi.useRealTimers());
describe("quiz lifecycle", () => {
  it("does not tick before starting and rejects invalid input", () => {
    const { result } = renderHook(() => useQuiz(bank));
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(result.current.timeLeft).toBe(0);
    for (const count of [0, -1, 1.5, 11, NaN])
      expect(result.current.start("Ana", count)).toBe(false);
    expect(result.current.start("  ", 1)).toBe(false);
    expect(result.current.status).toBe("idle");
  });
  it("freezes answers and score after manual completion, then resets", () => {
    const { result } = renderHook(() => useQuiz(bank));
    act(() => {
      result.current.start(" Ana ", 2);
    });
    const q = result.current.questions[1];
    act(() => {
      result.current.answer(q.number, q.answers);
    });
    act(() => {
      result.current.finish();
    });
    expect(result.current.score).toBe(1);
    const remaining = result.current.timeLeft;
    act(() => {
      vi.advanceTimersByTime(300000);
      result.current.answer(q.number, []);
    });
    expect(result.current.timeLeft).toBe(remaining);
    expect(result.current.score).toBe(1);
    act(() => result.current.reset());
    expect(result.current.answers).toEqual({});
    act(() => {
      result.current.start("Ben", 1);
    });
    expect(result.current.status).toBe("active");
    expect(result.current.timeLeft).toBe(120);
    expect(result.current.score).toBe(0);
  });
  it("expires at the deadline and never goes negative", () => {
    const { result } = renderHook(() => useQuiz(bank));
    act(() => {
      result.current.start("Ana", 1);
    });
    act(() => {
      vi.advanceTimersByTime(120000);
    });
    expect(result.current.status).toBe("completed");
    expect(result.current.timeLeft).toBe(0);
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(result.current.timeLeft).toBe(0);
  });
  it("uses elapsed wall time when returning to the window", () => {
    const { result } = renderHook(() => useQuiz(bank));
    act(() => {
      result.current.start("Ana", 1);
    });
    act(() => {
      vi.setSystemTime(Date.now() + 121000);
      window.dispatchEvent(new Event("focus"));
    });
    expect(result.current.status).toBe("completed");
  });
  it("rejects an answer received after the deadline before the timer ticks", () => {
    const { result } = renderHook(() => useQuiz(bank));
    act(() => {
      result.current.start("Ana", 1);
    });
    const q = result.current.questions[0];
    act(() => {
      vi.setSystemTime(Date.now() + 120000);
      result.current.answer(q.number, q.answers);
    });
    expect(result.current.score).toBe(0);
    expect(result.current.status).toBe("completed");
  });
});
