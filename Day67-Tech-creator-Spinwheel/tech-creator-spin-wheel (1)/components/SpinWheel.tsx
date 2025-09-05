import React, { useState } from "react";
import { Creator } from "../types";

interface SpinWheelProps {
  creators: Creator[];
  onSpinEnd: (winner: Creator) => void;
}

const COLORS = [
  "#6366F1",
  "#8B5CF6",
  "#EC4899",
  "#F59E0B",
  "#10B981",
  "#3B82F6",
  "#D946EF",
  "#F43F5E",
  "#84CC16",
  "#0EA5E9",
  "#A78BFA",
  "#EAB308",
];

const SpinWheel: React.FC<SpinWheelProps> = ({ creators, onSpinEnd }) => {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);

  const segmentDegrees = 360 / creators.length;

  const handleSpinClick = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    const winnerIndex = Math.floor(Math.random() * creators.length);
    const randomDegrees = Math.random() * (segmentDegrees - 4) + 2;
    const targetRotation = 360 - (winnerIndex * segmentDegrees + randomDegrees);
    const finalRotation = rotation + 360 * 6 + targetRotation;

    setRotation(finalRotation);

    setTimeout(() => {
      onSpinEnd(creators[winnerIndex]);
      setIsSpinning(false);
    }, 6000);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto p-4">
      {/* Title */}
      <h2 className="text-2xl font-bold text-white mb-6 text-center">
        Creator Wheel of Fortune
      </h2>

      <div className="relative w-full max-w-[600px] aspect-square flex justify-center items-center">
        {/* Arrow */}
        <div className="absolute w-12 h-12 -top-2 z-20 flex justify-center drop-shadow-[0_5px_10px_rgba(255,255,255,0.3)]">
          <svg
            width="48"
            height="48"
            viewBox="0 0 48 48"
            className="w-full h-full"
          >
            <path
              d="M24 2 L48 48 L24 38 L0 48 Z"
              fill="#EC4899"
              stroke="#fff"
              strokeWidth="2"
            />
          </svg>
        </div>

        {/* Wheel */}
        <div
          className={`relative w-full h-full rounded-full border-8 border-white/20 shadow-[0_0_50px_rgba(0,0,0,0.6),inset_0_0_50px_rgba(0,0,0,0.3)] overflow-hidden transition-transform duration-[6000ms] ease-[cubic-bezier(0.33,1,0.68,1)] will-change-transform bg-gradient-to-br from-gray-900 via-gray-800 to-black`}
          style={{
            transform: `rotate(${rotation}deg)`,
          }}
        >
          {creators.map((creator, index) => {
            const rotate = segmentDegrees * index;
            const skewY = 90 - segmentDegrees;

            return (
              <div
                key={creator.id}
                className="absolute w-1/2 h-1/2 origin-bottom-right rounded-tr-full hover:brightness-110 transition-all duration-300"
                style={{
                  transform: `rotate(${rotate}deg) skewY(-${skewY}deg)`,
                  backgroundColor: COLORS[index % COLORS.length],
                  backgroundImage: `linear-gradient(135deg, ${
                    COLORS[index % COLORS.length]
                  } 0%, ${COLORS[(index + 3) % COLORS.length]} 100%)`,
                  boxShadow:
                    "inset 0 0 15px rgba(255,255,255,0.2), 0 0 5px rgba(0,0,0,0.3)",
                }}
              >
                <div
                  className="absolute w-[200%] h-[200%] left-[-100%] top-0 flex items-center justify-center text-white font-bold text-xs sm:text-sm md:text-base select-none"
                  style={{
                    transform: `skewY(${skewY}deg) rotate(${
                      segmentDegrees / 2
                    }deg)`,
                    transformOrigin: "bottom left",
                    textShadow: "2px 2px 6px rgba(0,0,0,0.8)",
                  }}
                >
                  <span className="transform -rotate-90 block pl-5 text-center w-44 truncate">
                    {creator.name}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Center circle */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full border-4 border-white/20 shadow-lg z-10"></div>

          {/* Glow effect */}
          {isSpinning && (
            <div className="absolute inset-0 rounded-full pointer-events-none">
              <div className="w-full h-full rounded-full border-4 border-white/30 shadow-[0_0_30px_rgba(255,255,255,0.6)] animate-pulse"></div>
            </div>
          )}
        </div>

        {/* Spin Button */}
        <button
          onClick={handleSpinClick}
          disabled={isSpinning}
          className="absolute w-28 h-28 md:w-36 md:h-36 bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-500 rounded-full text-white font-extrabold text-xl md:text-2xl uppercase shadow-2xl transition-all duration-300 ease-in-out transform hover:scale-110 hover:shadow-[0_0_40px_rgba(255,0,200,0.7)] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed z-10 flex items-center justify-center border-4 border-white/20"
          aria-label="Spin the wheel"
        >
          <span className="drop-shadow-md">SPIN</span>
        </button>
      </div>

      {/* Status indicator */}
      <div className="mt-6 text-white/80 text-sm">
        {isSpinning ? "Spinning..." : "Click the button to spin!"}
      </div>
    </div>
  );
};

export default SpinWheel;
