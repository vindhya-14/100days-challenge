
import React, { useState } from 'react';
import { QuizQuestion, QuizAnswer } from '../types';

interface QuizScreenProps {
  questions: QuizQuestion[];
  onComplete: (answers: QuizAnswer[]) => void;
}

const QuizScreen: React.FC<QuizScreenProps> = ({ questions, onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [animate, setAnimate] = useState(false);

  const handleAnswer = (questionId: number, answerIndex: number) => {
    const newAnswers = [...answers, { questionId, index: answerIndex }];
    setAnswers(newAnswers);
    setAnimate(true);

    setTimeout(() => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            onComplete(newAnswers);
        }
        setAnimate(false);
    }, 300);
  };
  
  const currentQuestion = questions[currentQuestionIndex];
  const progressPercentage = ((currentQuestionIndex) / questions.length) * 100;

  return (
    <div className="bg-white/80 backdrop-blur-sm p-6 md:p-8 rounded-2xl shadow-xl border border-yellow-200 w-full max-w-md mx-auto">
      <div className="mb-4">
        <div className="h-2.5 w-full rounded-full bg-yellow-200">
            <div className="h-2.5 rounded-full bg-amber-500 transition-all duration-500" style={{ width: `${progressPercentage}%` }}></div>
        </div>
        <p className="text-center text-sm text-amber-700 mt-2">Question {currentQuestionIndex + 1} of {questions.length}</p>
      </div>
      
      <div className={`transition-opacity duration-300 ${animate ? 'opacity-0' : 'opacity-100'}`}>
        <h2 className="text-2xl font-bold text-center text-red-500 mb-6 font-display">
            {currentQuestion.question}
        </h2>
        <div className="grid grid-cols-2 gap-3 md:gap-4">
            {currentQuestion.answers.map((answer, index) => (
            <button
                key={index}
                onClick={() => handleAnswer(currentQuestion.id, index)}
                className="flex flex-col items-center justify-center text-center p-3 md:p-4 bg-yellow-100 rounded-lg shadow-sm border-2 border-transparent hover:border-amber-400 hover:bg-yellow-200 transform hover:scale-105 transition-all duration-200"
            >
                <span className="text-4xl mb-2">{answer.emoji}</span>
                <span className="text-sm font-medium text-amber-800">{answer.text}</span>
            </button>
            ))}
        </div>
      </div>
    </div>
  );
};

export default QuizScreen;
