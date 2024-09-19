import { useEffect, useState } from 'react';
import {  BrowserRouter, Route, Routes } from 'react-router-dom';

import { ThemeContextProvider } from './context/ThemeContext';
import HomePage from './pages/HomePage';
import { QuestionsPage } from './pages/QuestionsPage';
import { TopBar } from './components/TopBar'

import './App.css'

export const App = () => {
  const [userName, setUserName] = useState<string>('');
  const [questionCount, setQuestionCount] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isTimeUp, setIsTimeUp] = useState(false);

  useEffect(() => {
    if (questionCount > 0 && timeLeft === 0) {
      setIsTimeUp(true);
      return;
    }

    const intervalId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft, questionCount]);
    
  return (
    <ThemeContextProvider>
      <BrowserRouter basename='/'>
        <div className="app">
          <TopBar />
          <Routes>
            <Route path="/" element={<HomePage setTimeLeft={setTimeLeft} setUserName={setUserName} setQuestionCount={setQuestionCount}/>} />
            <Route path="/quiz" element={
              <QuestionsPage
                timeLeft={timeLeft}
                isTimeUp={isTimeUp}
                numQuestions={questionCount}
                userName={userName} 
              />
              } />
          </Routes>
        </div>
      </BrowserRouter>
    </ThemeContextProvider>
  )
}

export default App;