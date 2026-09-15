import type { Quiz } from "../hooks/useQuiz";
import QuestionCard from "./QuestionCard";
export function ResultsContainer({
  quiz,
  onRetry,
}: {
  quiz: Quiz;
  onRetry: () => void;
}) {
  const percentage = quiz.questions.length
    ? Math.round((quiz.score * 100) / quiz.questions.length)
    : 0;
  return (
    <div className="results-container">
      <h1>
        {quiz.name}, your score is {percentage}% out of {quiz.questions.length}{" "}
        questions.
      </h1>
      <button onClick={onRetry}>Try again</button>
      {quiz.questions.map((question, index) => (
        <QuestionCard
          key={question.number}
          question={question}
          index={index}
          total={quiz.questions.length}
          selected={quiz.answers[question.number] ?? []}
          review
        />
      ))}
    </div>
  );
}
