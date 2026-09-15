import type { IQuestion } from "../types";
type Props = {
  question: IQuestion;
  index: number;
  total: number;
  selected: string[];
  onAnswer?: (answers: string[]) => void;
  review?: boolean;
};
export default function QuestionCard({
  question,
  index,
  total,
  selected,
  onAnswer,
  review = false,
}: Props) {
  return (
    <section className="card questions">
      <h2>
        Question {index + 1} of {total}
      </h2>
      <fieldset>
        <legend>{question.question}</legend>
        {question.type === "multi option" && (
          <p>
            Select all that apply. Partial credit is awarded only when no
            incorrect options are selected.
          </p>
        )}
        {review && selected.length === 0 && <p>Not answered</p>}
        {question.options.map((option, i) => {
          const correct = question.answers.includes(option),
            checked = selected.includes(option),
            id = "question-" + question.number + "-option-" + i;
          return (
            <div
              key={option}
              className={
                "option " +
                (review
                  ? correct
                    ? "correct"
                    : checked
                      ? "incorrect"
                      : ""
                  : "")
              }
            >
              <input
                id={id}
                name={"question-" + question.number}
                type={question.type === "single option" ? "radio" : "checkbox"}
                checked={checked}
                disabled={review}
                onChange={(e) =>
                  onAnswer?.(
                    question.type === "single option"
                      ? [option]
                      : e.target.checked
                        ? [...selected, option]
                        : selected.filter((a) => a !== option),
                  )
                }
              />
              <label htmlFor={id}>
                {option}
                {review && (
                  <span className="answer-status">
                    {correct
                      ? " — Correct answer"
                      : checked
                        ? " — Incorrect answer"
                        : ""}
                    {checked ? " (Your selection)" : ""}
                  </span>
                )}
              </label>
            </div>
          );
        })}
      </fieldset>
    </section>
  );
}
