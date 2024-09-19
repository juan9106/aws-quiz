import React, { useCallback, useEffect, useState } from 'react';
import questions from '../data/questions.json';
import QuestionCard from '../components/QuestionCard';
import { useNavigate } from 'react-router-dom';
import { Timer } from '../components/Timer';
import { IQuestion, UserAnswer } from '../types';
import { ResultsContainer } from '../components/ResultsContainer';



type QuestionsPageProps = {
    userName: string;
    numQuestions: number;
    timeLeft: number;
    isTimeUp: boolean;
}

export const QuestionsPage: React.FC<QuestionsPageProps> = ({userName, numQuestions, isTimeUp, timeLeft}) => {
    const navigate = useNavigate();
    const [assignedQuestions, setAssignedQuestions] = useState<IQuestion[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
    const [answeredQuestions, setAnsweredQuestions] = useState<UserAnswer[]>([]);
    const [quizCompleted, setQuizCompleted] = useState<boolean>(false);
    const [score, setScore] = useState<number>(0);

    const handleNext = () => {
        if (currentQuestionIndex < assignedQuestions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);          
        } else {
          calculateScore();
          setQuizCompleted(true);
        }
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };
    
    const calculateScore = useCallback(() => {
        const scoreValue = assignedQuestions.reduce((acc, question) => {
            const userAnswer = answeredQuestions.find((answer) => answer.number === question.number);
            let value = 0;

            if(question.type === 'single option') {
                value = 1;
            }
            else {
                value = 1 / question.answers.length;
            }

            if(!userAnswer) return acc;

            const correctAnswers = userAnswer?.answers.filter((answer) => question.answers.includes(answer));

            const score = acc + (correctAnswers.length * value);

            return score;
        }, 0)
        setScore(scoreValue);
    }, [answeredQuestions, assignedQuestions]);

    useEffect(() => {
        const suffledQuestions = questions.sort(() => 0.5 - Math.random());
        setAssignedQuestions(suffledQuestions.slice(0, numQuestions) as IQuestion[]);
    }, [numQuestions]);

    useEffect(() => {
        if (isTimeUp) {
            calculateScore();
            setQuizCompleted(true);
        }
    },[isTimeUp, calculateScore])

    useEffect(() => {
        if (assignedQuestions.length === 0 && userName.length === 0) {
            navigate('/');
        }
    }, [assignedQuestions, userName, navigate]);
    
    if (quizCompleted) {
        return (
            <ResultsContainer
                assignedQuestions={assignedQuestions}
                score={score}
                userAnswers={answeredQuestions}
                userName={userName}
            />
        );
    }

    if(assignedQuestions.length === 0) {
        return (
            <div>Loading...</div>
        )
    }

    return (
        <div className='questions-container'>
            <Timer timeLeft={timeLeft} />
            <QuestionCard
                currentQuestion={assignedQuestions[currentQuestionIndex]}
                currentQuestionIndex={currentQuestionIndex}
                totalQuestions={assignedQuestions.length}
                answeredQuestions={answeredQuestions}
                setAnsweredQuestions={setAnsweredQuestions}
                handleNext={handleNext}
                handlePrevious={handlePrevious}
            />
        </div>
    )
}
