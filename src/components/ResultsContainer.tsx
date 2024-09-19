import React from 'react'
import { IQuestion, UserAnswer } from '../types'
import QuestionCard from './QuestionCard';

type ResultsContainerProps = {
    userName: string;
    score: number;
    userAnswers: UserAnswer[];
    assignedQuestions: IQuestion[];
}

export const ResultsContainer: React.FC<ResultsContainerProps> = ({ userName, score, userAnswers, assignedQuestions }) => {
    return (
        <div className='results-container'>
            <h2>{userName}, your score is {(((score * 100)/assignedQuestions.length).toFixed(0))}% out of {assignedQuestions.length} questions.</h2>
            {
                assignedQuestions.map((question, index) => {
                    return (
                        <QuestionCard
                            key={index}
                            currentQuestion={question}
                            currentQuestionIndex={index}
                            totalQuestions={assignedQuestions.length}
                            answeredQuestions={userAnswers}
                            isReviewMode={true}
                        />
                    )
                })
            }
        </div>
    )
}
