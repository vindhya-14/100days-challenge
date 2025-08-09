import React, { useState, useCallback, useEffect } from 'react';
import { SiblingType, View, QuizAnswer, ResultData } from './types';
import { QUIZ_QUESTIONS, RESULT_CONFIG } from './constants';
import WelcomeScreen from './components/WelcomeScreen';
import QuizScreen from './components/QuizScreen';
import ResultsScreen from './components/ResultsScreen';
import RakhiPromiseScreen from './components/RakhiPromiseScreen';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.Welcome);
  const [siblingType, setSiblingType] = useState<SiblingType | null>(null);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [resultData, setResultData] = useState<ResultData | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleStartQuiz = (type: SiblingType) => {
    setSiblingType(type);
    setCurrentView(View.Quiz);
    setAnswers([]);
    setResultData(null);
  };

  const calculateResults = useCallback(() => {
    // Simple scoring: sum of answer indices
    const score = answers.reduce((acc, curr) => acc + curr.index, 0);
    const scoreTier = Math.floor(score / (QUIZ_QUESTIONS.length * 4 / 3)); // 3 tiers: 0, 1, 2

    const config = RESULT_CONFIG[scoreTier] || RESULT_CONFIG[0];
    
    setResultData({
        title: config.title,
        description: config.description,
        score: Math.min(100, 75 + score),
        superpower: config.superpower,
        rakhiColor: config.rakhiColor,
        memoryIdea: config.memoryIdea
    });
    
    setCurrentView(View.Results);
  }, [answers]);

  useEffect(() => {
    if (currentView === View.Results) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [currentView]);

  useEffect(() => {
      if (answers.length === QUIZ_QUESTIONS.length && currentView === View.Quiz) {
          calculateResults();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answers, currentView]);

  const handleMakePromise = () => {
    setCurrentView(View.Promise);
  };

  const handleRestart = () => {
    setCurrentView(View.Welcome);
    setSiblingType(null);
    setAnswers([]);
    setResultData(null);
  };

  const renderView = () => {
    switch (currentView) {
      case View.Welcome:
        return <WelcomeScreen onStart={handleStartQuiz} />;
      case View.Quiz:
        return (
          <QuizScreen
            questions={QUIZ_QUESTIONS}
            onComplete={(finalAnswers) => {
              setAnswers(finalAnswers);
            }}
          />
        );
      case View.Results:
        return resultData && siblingType ? (
          <ResultsScreen
            result={resultData}
            siblingType={siblingType}
            onMakePromise={handleMakePromise}
            onRestart={handleRestart}
          />
        ) : null;
      case View.Promise:
        return resultData && <RakhiPromiseScreen onRestart={handleRestart} />;
      default:
        return <WelcomeScreen onStart={handleStartQuiz} />;
    }
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden text-gray-800"
      style={{
        backgroundImage: "url('https://static.vecteezy.com/system/resources/previews/018/853/800/non_2x/minimalist-love-shape-pattern-in-purple-for-background-abstract-simple-and-cute-girls-wallpaper-design-theme-vector.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {showConfetti && <Confetti />}
      <div className="relative w-full max-w-lg mx-auto z-10">
        {renderView()}
      </div>
    </div>
  );
};

const Confetti: React.FC = () => {
    const particles = Array.from({ length: 150 });
    const colors = ['#f59e0b', '#ef4444', '#fde047', '#fbbf24', '#f87171'];
    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-50">
            {particles.map((_, i) => {
                const style: React.CSSProperties = {
                    left: `${Math.random() * 100}%`,
                    animationDuration: `${Math.random() * 3 + 2}s`,
                    animationDelay: `${Math.random() * 2}s`,
                    backgroundColor: colors[Math.floor(Math.random() * colors.length)],
                };
                return <div key={i} className="confetti-particle absolute w-2 h-4 rounded-full opacity-0" style={style}></div>
            })}
            <style>{`
                @keyframes confetti-fall {
                    0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
                    100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
                }
                .confetti-particle {
                    animation-name: confetti-fall;
                    animation-timing-function: linear;
                    animation-iteration-count: infinite;
                }
            `}</style>
        </div>
    );
};

export default App;
