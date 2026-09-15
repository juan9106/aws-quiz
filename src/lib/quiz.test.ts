import { describe, expect, it } from "vitest";
import data from "../data/questions.json";
import { calculateScore, selectQuestions, validateQuestions } from "./quiz";
const bank = validateQuestions(data);
const single = bank.find((q) => q.type === "single option")!;
const multi = bank.find((q) => q.type === "multi option")!;
describe("scoring", () => {
  it("scores skipped questions as zero", () =>
    expect(calculateScore(bank, {})).toBe(0));
  it("scores a single answer", () =>
    expect(calculateScore([single], { [single.number]: single.answers })).toBe(
      1,
    ));
  it("rejects an incorrect single answer", () =>
    expect(
      calculateScore([single], {
        [single.number]: [
          single.options.find((a) => !single.answers.includes(a))!,
        ],
      }),
    ).toBe(0));
  it("awards partial credit", () =>
    expect(
      calculateScore([multi], { [multi.number]: [multi.answers[0]] }),
    ).toBe(1 / multi.answers.length));
  it("awards full credit for all correct answers", () =>
    expect(calculateScore([multi], { [multi.number]: multi.answers })).toBe(1));
  it("rejects selecting all options", () =>
    expect(calculateScore([multi], { [multi.number]: multi.options })).toBe(0));
  it("deduplicates selected answers", () =>
    expect(
      calculateScore([single], {
        [single.number]: [...single.answers, ...single.answers],
      }),
    ).toBe(1));
  it("handles answering a later question only", () =>
    expect(
      calculateScore([multi, single], { [single.number]: single.answers }),
    ).toBe(1));
});
describe("question bank", () => {
  it("validates the actual bank", () => expect(bank).toHaveLength(46));
  it.each([
    null,
    [],
    [{}],
    [single, single],
    [{ ...single, number: 0 }],
    [{ ...single, question: " " }],
    [{ ...single, options: ["x", "x"] }],
    [{ ...single, answers: ["missing"] }],
    [{ ...single, answers: [] }],
    [{ ...single, answers: [...single.answers, ...single.answers] }],
    [{ ...single, type: "other" }],
    [{ ...single, type: "multi option" }],
    [{ ...multi, type: "single option" }],
  ])("rejects invalid data %j", (value) =>
    expect(() => validateQuestions(value)).toThrow(),
  );
  it("shuffles without mutation or duplicate questions", () => {
    const before = structuredClone(bank);
    const selected = selectQuestions(bank, 10, () => 0);
    expect(bank).toEqual(before);
    expect(selected).toHaveLength(10);
    expect(new Set(selected.map((q) => q.number)).size).toBe(10);
    expect(selected).not.toEqual(bank.slice(0, 10));
  });
});
