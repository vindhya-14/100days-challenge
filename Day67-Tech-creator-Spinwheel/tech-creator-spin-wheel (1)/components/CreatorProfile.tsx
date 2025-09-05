import React from "react";
import { Creator } from "../types";

interface CreatorProfileProps {
  creator: Creator;
}

const CreatorProfile: React.FC<CreatorProfileProps> = ({ creator }) => {
  return (
    <div className="w-full max-w-4xl mx-auto bg-gradient-to-br from-white to-slate-50 rounded-3xl shadow-2xl p-6 md:p-10 text-slate-800 animate-fade-in transition-all duration-500 hover:scale-[1.02]">
      {/* Header */}
      <header className="flex flex-col sm:flex-row items-center gap-6 mb-8 border-b pb-6">
        <img
          src={creator.avatar}
          alt={`${creator.name}'s avatar`}
          className="w-32 h-32 rounded-full border-4 border-indigo-500 object-cover shadow-xl transition-transform duration-300 hover:scale-105"
        />
        <div className="text-center sm:text-left">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900">
            {creator.name}
          </h1>
          <p className="text-lg text-indigo-600 font-semibold mt-1">
            Subscribers (2025): {creator.subscribers2025}
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Favorite Quote */}
        <section className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold mb-3 text-slate-800 border-b border-indigo-300 pb-2">
            Favorite Quote
          </h2>
          <blockquote className="text-lg italic bg-gradient-to-r from-indigo-50 to-white p-6 rounded-2xl border-l-4 border-indigo-500 text-slate-700 shadow-inner transition-all duration-300 hover:shadow-lg">
            "{creator.favoriteLines}"
          </blockquote>
        </section>

        {/* Fan Reviews */}
        <aside className="lg:col-span-1">
          <h2 className="text-2xl font-bold mb-3 text-slate-800 border-b border-indigo-300 pb-2">
            Fan Reviews
          </h2>
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
            {creator.fanReviews.map((review, index) => (
              <div
                key={index}
                className="bg-indigo-50 p-4 rounded-xl text-slate-700 shadow hover:shadow-md transition-all duration-300"
              >
                <p>"{review}"</p>
              </div>
            ))}
          </div>
        </aside>
      </main>

      {/* Footer / CTA (optional) */}
      <footer className="mt-8 text-center">
        <p className="text-sm text-slate-500">
          Follow {creator.name} for more inspiration!
        </p>
      </footer>
    </div>
  );
};

export default CreatorProfile;
