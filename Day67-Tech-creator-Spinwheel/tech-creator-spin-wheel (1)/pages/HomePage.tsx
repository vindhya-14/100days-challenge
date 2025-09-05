import React from "react";
import { useNavigate } from "react-router-dom";
import SpinWheel from "../components/SpinWheel";
import { CREATOR_DATA } from "../constants/creatorData";
import { Creator } from "../types";

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const handleSpinEnd = (winner: Creator) => {
    setTimeout(() => {
      navigate(`/creator/${winner.id}`);
    }, 500);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-indigo-50 via-white to-indigo-50 p-4 text-center animate-fade-in">
      {/* Header */}
      <header className="mb-8 md:mb-12">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-3">
          Tech Creator <span className="text-indigo-600">Spin Wheel</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-600 max-w-xl mx-auto">
          Spin the wheel to discover your next favorite tech educator! 🎡
        </p>
      </header>

      {/* Main Spin Wheel */}
      <main className="w-full max-w-3xl">
        <div className="p-6 bg-gradient-to-tr from-indigo-100 via-white to-indigo-50 rounded-3xl shadow-2xl transition-transform duration-500 hover:scale-[1.02]">
          <SpinWheel creators={CREATOR_DATA} onSpinEnd={handleSpinEnd} />
        </div>
      </main>

      {/* Footer / CTA */}
      <footer className="mt-12 text-slate-500">
        <p className="text-sm md:text-base">
          Powered by your favorite tech community. Spin & explore! 🚀
        </p>
      </footer>
    </div>
  );
};

export default HomePage;
