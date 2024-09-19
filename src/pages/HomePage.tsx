import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface HomePageProps {
  setUserName: (name: string) => void;
  setQuestionCount: (count: number) => void;
  setTimeLeft: (timeLeft: number) => void;
}

const TIME_FOR_QUESTION = 120;

const HomePage: React.FC<HomePageProps> = ({ setUserName, setQuestionCount, setTimeLeft }) => {
  const [name, setName] = useState('');
  const [count, setCount] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && count) {
      setUserName(name);
      setTimeLeft(parseInt(count) * TIME_FOR_QUESTION)
      setQuestionCount(Math.min(10, parseInt(count)));
      navigate('/quiz');
    }
  };

  return (
    <div className='card start-quiz'>
        <form onSubmit={handleSubmit}>
            <h2>Complete information to start quiz</h2>
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                required
            />
            <input
                type="number"
                value={count}
                onChange={(e) => setCount(e.target.value)}
                placeholder="Number of questions (max 10)"
                min="1"
                max="10"
                required
            />
            <button type="submit">Start Quiz</button>
        </form>
    </div>
  );
};

export default HomePage;