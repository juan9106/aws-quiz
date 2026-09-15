import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
export default function HomePage({
  start,
  maxQuestions,
}: {
  start: (name: string, count: number) => boolean;
  maxQuestions: number;
}) {
  const [name, setName] = useState("");
  const [count, setCount] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  function submit(e: FormEvent) {
    e.preventDefault();
    if (!start(name, Number(count))) {
      setError(
        "Enter your name and a whole number from 1 to " + maxQuestions + ".",
      );
      return;
    }
    navigate("/quiz");
  }
  return (
    <div className="card start-quiz">
      <form onSubmit={submit}>
        <h1>AWS Quiz</h1>
        <p>
          Practice with up to {maxQuestions} questions. You have two minutes per
          question.
        </p>
        <label htmlFor="user-name">Your name</label>
        <input
          id="user-name"
          autoComplete="given-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <label htmlFor="question-count">
          Number of questions (1–{maxQuestions})
        </label>
        <input
          id="question-count"
          type="number"
          min={1}
          max={maxQuestions}
          step={1}
          value={count}
          onChange={(e) => setCount(e.target.value)}
          required
        />
        {error && <p role="alert">{error}</p>}
        <button type="submit">Start Quiz</button>
      </form>
    </div>
  );
}
