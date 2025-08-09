import React from "react";
import { SiblingType } from "../types";

interface WelcomeScreenProps {
  onStart: (type: SiblingType) => void;
}

const RakhiIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="rakhiGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ef4444" />
        <stop offset="100%" stopColor="#f59e0b" />
      </linearGradient>
      <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="4" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    <path
      d="M10 50 H90"
      stroke="url(#rakhiGradient)"
      strokeWidth="4"
      strokeLinecap="round"
    />
    <circle cx="50" cy="50" r="18" fill="#ef4444" filter="url(#glow)" />
    <circle cx="50" cy="50" r="12" fill="#fbbf24" />
    <circle cx="50" cy="50" r="6" fill="#fde047" />
    <path
      d="M45 30 L50 20 L55 30"
      fill="#fde047"
      stroke="#f59e0b"
      strokeWidth="1"
    />
    <path
      d="M30 45 L20 50 L30 55"
      fill="#fde047"
      stroke="#f59e0b"
      strokeWidth="1"
    />
    <path
      d="M70 45 L80 50 L70 55"
      fill="#fde047"
      stroke="#f59e0b"
      strokeWidth="1"
    />
    <path
      d="M45 70 L50 80 L55 70"
      fill="#fde047"
      stroke="#f59e0b"
      strokeWidth="1"
    />
  </svg>
);

const HeartIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.03L12 21.35Z"
      fill="currentColor"
    />
  </svg>
);

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  return (
    <>
      {/* Falling hearts animation */}
      {/* {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="absolute top-0 animate-float pointer-events-none"
          style={{
            left: `${10 + i * 10}%`,
            animationDelay: `${i * 0.5}s`,
            animationDuration: `${15 + Math.random() * 10}s`,
          }}
        >
          <HeartIcon className="w-6 h-6 text-red-400 opacity-70" />
        </div>
      ))} */}

      {/* Main content */}
      <div
        className="
          relative
          text-center
          bg-gradient-to-tr from-yellow-200 via-yellow-100 to-yellow-50
          backdrop-blur-md
          p-10
          rounded-3xl
          shadow-2xl
          border
          border-yellow-300
          max-w-2xl
          mx-auto
          my-12
          transform
          transition-all
          duration-500
          hover:scale-[1.03]
          hover:shadow-yellow-400
        "
      >
        <div className="absolute -top-6 -right-6 w-20 h-20 bg-yellow-300 rounded-full flex items-center justify-center shadow-lg">
          <HeartIcon className="w-10 h-10 text-red-500 animate-pulse" />
        </div>

        <RakhiIcon className="w-32 h-32 mx-auto mb-6 animate-float-slow" />

        <h1
          className="
            text-6xl
            font-extrabold
            text-transparent
            bg-clip-text
            bg-gradient-to-r
            from-red-600
            to-yellow-500
            mb-5
            font-display
            tracking-wide
          "
        >
          Bondify
        </h1>

        <p className="text-xl text-yellow-700 mb-10 font-semibold max-w-lg mx-auto leading-relaxed">
          Celebrate the unbreakable bond of love and care between siblings.
          <span className="block mt-3 text-yellow-600 font-medium">
            Ready to play? Who's your sibling buddy?
          </span>
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
          <button
            onClick={() => onStart(SiblingType.SisterBrother)}
            className="
              relative
              overflow-hidden
              group
              bg-gradient-to-br
              from-pink-400
              to-red-500
              text-white
              font-bold
              py-5
              px-7
              rounded-xl
              shadow-lg
              hover:shadow-xl
              transform
              hover:-translate-y-1
              transition-all
              duration-300
              ease-in-out
            "
          >
            <span className="relative z-10 flex items-center justify-center gap-3 text-lg">
              Sister-Brother <span className="text-2xl">👩‍👦</span>
            </span>
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>

          <button
            onClick={() => onStart(SiblingType.BrotherBrother)}
            className="
    relative
    overflow-hidden
    group
    bg-gradient-to-br
    from-blue-400
    to-indigo-500
    text-white
    font-bold
    py-5
    px-10
    rounded-xl
    shadow-lg
    hover:shadow-xl
    transform
    hover:-translate-y-1
    transition-all
    duration-300
    ease-in-out
  "
          >
            <span className="relative z-10 flex items-center justify-center gap-2 text-lg leading-none">
              Brother-Brother{""}
              <span className="text-2xl leading-none">👦</span>
            </span>

            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>

          <button
            onClick={() => onStart(SiblingType.SisterSister)}
            className="
              relative
              overflow-hidden
              group
              bg-gradient-to-br
              from-purple-400
              to-pink-500
              text-white
              font-bold
              py-5
              px-7
              rounded-xl
              shadow-lg
              hover:shadow-xl
              transform
              hover:-translate-y-1
              transition-all
              duration-300
              ease-in-out
            "
          >
            <span className="relative z-10 flex items-center justify-center gap-3 text-lg">
              Sister-Sister <span className="text-2xl">👩‍👩</span>
            </span>
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </div>

        <div className="mt-10 text-yellow-600 flex items-center justify-center gap-3 text-sm font-medium">
          <HeartIcon className="w-6 h-6 text-red-500" />
          <span>Made with love for siblings everywhere</span>
          <HeartIcon className="w-6 h-6 text-red-500" />
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes slowZoom {
          0% { transform: scale(1) translate(0, 0); }
          50% { transform: scale(1.05) translate(10px, 10px); }
          100% { transform: scale(1) translate(0, 0); }
        }
        .animate-float-slow {
          animation: slowZoom 8s ease-in-out infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </>
  );
};

export default WelcomeScreen;
