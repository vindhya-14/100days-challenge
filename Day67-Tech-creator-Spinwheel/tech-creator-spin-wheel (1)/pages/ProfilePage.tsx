import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import CreatorProfile from "../components/CreatorProfile";
import { CREATOR_DATA } from "../constants/creatorData";

const ProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const creator = id
    ? CREATOR_DATA.find((c) => c.id === parseInt(id, 10))
    : undefined;

  if (!creator) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-indigo-50 via-white to-indigo-50 text-slate-800 p-4 animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Creator Not Found
        </h1>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-full shadow-lg hover:bg-indigo-700 hover:scale-105 transition-all transform"
        >
          Back to Wheel
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-indigo-50 via-white to-indigo-50 animate-fade-in">
      {/* Creator Profile Card */}
      <CreatorProfile creator={creator} />

      {/* Spin Again Button */}
      <button
        onClick={() => navigate("/")}
        className="mt-10 px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold rounded-full shadow-2xl hover:scale-105 hover:shadow-purple-400 transition-all transform"
      >
        Spin Again
      </button>

      {/* Footer */}
      <footer className="mt-8 text-slate-500 text-sm md:text-base">
        Discover more tech creators with every spin! 🎡
      </footer>
    </div>
  );
};

export default ProfilePage;
