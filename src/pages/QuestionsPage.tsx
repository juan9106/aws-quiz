import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import QuestionCard from "../components/QuestionCard";
import { Timer } from "../components/Timer";
import { ResultsContainer } from "../components/ResultsContainer";
import type { Quiz } from "../hooks/useQuiz";
export function QuestionsPage({ quiz }: { quiz: Quiz }) {
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();
  if (quiz.status === "idle") return <Navigate to="/" replace />;
  if (quiz.status === "completed")
    return (
      <ResultsContainer
        quiz={quiz}
        onRetry={() => {
          quiz.reset();
          navigate("/");
        }}
      />
    );
  const question = quiz.questions[index];
  return (
    <div className="questions-container">
      <h1>AWS Quiz</h1>
      <Timer timeLeft={quiz.timeLeft} />
      <QuestionCard
        question={question}
        index={index}
        total={quiz.questions.length}
        selected={quiz.answers[question.number] ?? []}
        onAnswer={(selected) => quiz.answer(question.number, selected)}
      />
      <div className="buttons-container">
        <button onClick={() => setIndex(index - 1)} disabled={index === 0}>
          Back
        </button>
        <button
          onClick={() =>
            index === quiz.questions.length - 1
              ? quiz.finish()
              : setIndex(index + 1)
          }
        >
          {index === quiz.questions.length - 1 ? "Finish" : "Next"}
        </button>
      </div>
    </div>
  );
}
