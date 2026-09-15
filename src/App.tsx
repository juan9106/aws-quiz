import { HashRouter, Route, Routes } from "react-router-dom";
import { ThemeContextProvider } from "./context/ThemeContext";
import HomePage from "./pages/HomePage";
import { QuestionsPage } from "./pages/QuestionsPage";
import { TopBar } from "./components/TopBar";
import { useQuiz } from "./hooks/useQuiz";
import { validateQuestions } from "./lib/quiz";
import data from "./data/questions.json";
import "./App.css";
const bank = (() => {
  try {
    return { questions: validateQuestions(data), error: "" };
  } catch {
    return {
      questions: [],
      error: "The question bank could not be loaded. Please try again later.",
    };
  }
})();
export const App = () => {
  const quiz = useQuiz(bank.questions);
  return (
    <ThemeContextProvider>
      <HashRouter>
        <div className="app">
          <TopBar />
          <main>
            {bank.error ? (
              <p role="alert">{bank.error}</p>
            ) : (
              <Routes>
                <Route
                  path="/"
                  element={
                    <HomePage
                      start={quiz.start}
                      maxQuestions={Math.min(10, bank.questions.length)}
                    />
                  }
                />
                <Route path="/quiz" element={<QuestionsPage quiz={quiz} />} />
                <Route
                  path="*"
                  element={
                    <HomePage
                      start={quiz.start}
                      maxQuestions={Math.min(10, bank.questions.length)}
                    />
                  }
                />
              </Routes>
            )}
          </main>
        </div>
      </HashRouter>
    </ThemeContextProvider>
  );
};
export default App;
