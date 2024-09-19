import React, { Dispatch, SetStateAction } from 'react';
import { IQuestion, UserAnswer } from '../types';

type QuestionCardProps = {
    currentQuestion: IQuestion,
    currentQuestionIndex: number,
    totalQuestions: number,
    answeredQuestions: UserAnswer[],
    setAnsweredQuestions?: Dispatch<SetStateAction<UserAnswer[]>>,
    handleNext?: () => void,
    handlePrevious?: () => void,
    isReviewMode?: boolean, // Propiedad para el modo de revisión
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  currentQuestion,
  currentQuestionIndex,
  totalQuestions,
  answeredQuestions,
  setAnsweredQuestions,
  handlePrevious,
  handleNext,
  isReviewMode = false
}) => {
    const handleAnswerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (isReviewMode) return; // No permitir cambios en el modo de revisión

        const userAnswers = [...answeredQuestions];
        const answer = e.target.value;

        if (!userAnswers[currentQuestionIndex]) {
            userAnswers[currentQuestionIndex] = { number: currentQuestion.number, answers: [] };
        }

        const currentAnswers = userAnswers[currentQuestionIndex];
        let updatedAnswers = [...currentAnswers.answers];

        if (!e.target.checked) {
            updatedAnswers = updatedAnswers.filter(a => a !== answer);
            updateAnswers(userAnswers, updatedAnswers);
            return;
        }

        if (currentQuestion.type === 'single option') {
            updatedAnswers = [answer];
        } else {
            if (!updatedAnswers.includes(answer)) {
                updatedAnswers.push(answer);
            }
        }

        updateAnswers(userAnswers, updatedAnswers);
    };

    const updateAnswers = (userAnswers: UserAnswer[], updatedAnswers: string[]) => {
        const newAnswers = { ...userAnswers[currentQuestionIndex], answers: updatedAnswers };
      
        setAnsweredQuestions?.([
          ...userAnswers.slice(0, currentQuestionIndex),
          newAnswers,
          ...userAnswers.slice(currentQuestionIndex + 1),
        ]);
    };
    
    return (
        <div className="card questions">
            <h3>Question {currentQuestionIndex + 1} of {totalQuestions}</h3>
            <p>{currentQuestion.question}</p>
            {currentQuestion.options.map((option, index) => {

                const isCorrect = currentQuestion.answers.includes(option);
                const isSelected = answeredQuestions[currentQuestionIndex]?.answers.includes(option) || false;
                const optionClass = isReviewMode ? (isCorrect ? 'correct' : isSelected ? 'incorrect' : '') : '';

                return (
                    <div key={index} className={optionClass}>
                        <input
                            checked={isSelected}
                            type={currentQuestion.type === 'single option' ? 'radio' : 'checkbox'}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleAnswerChange(e)}
                            name={`question-${currentQuestion.number}`}
                            id={`option-${index}`}
                            value={option}
                            disabled={isReviewMode}
                        />
                        <label htmlFor={`option-${index}`}>{option}</label>
                    </div>
                );
            })}
            {!isReviewMode && (
                <div className='buttons-container'>
                    <button onClick={handlePrevious} disabled={currentQuestionIndex === 0}>
                        Back
                    </button>
                    <button onClick={handleNext}>
                        {currentQuestionIndex === totalQuestions - 1 ? 'Finish' : 'Next'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default QuestionCard;
