
import React, { useState, useCallback } from 'react';
import { ResultData, SiblingType } from '../types';
import { generateMemoryTagline } from '../services/geminiService';

interface ResultsScreenProps {
  result: ResultData;
  siblingType: SiblingType;
  onMakePromise: () => void;
  onRestart: () => void;
}

const SiblingAvatar: React.FC<{ type: SiblingType, className?: string }> = ({ type, className }) => {
    const avatars: Record<SiblingType, string[]> = {
        'Sister-Brother': ['👩', '👦'],
        'Brother-Brother': ['👦', '👦'],
        'Sister-Sister': ['👩', '👩'],
    };
    const [avatar1, avatar2] = avatars[type];
    return (
        <div className={`flex -space-x-4 ${className}`}>
            <span className="text-5xl bg-white p-2 rounded-full shadow-md">{avatar1}</span>
            <span className="text-5xl bg-white p-2 rounded-full shadow-md">{avatar2}</span>
        </div>
    );
};

const DigitalRakhi: React.FC<{ color: string }> = ({ color }) => (
    <div className="flex items-center justify-center my-4">
        <div className="h-1 w-16 bg-gradient-to-r from-yellow-400 to-red-400 rounded-l-full"></div>
        <div className={`w-12 h-12 rounded-full ${color} flex items-center justify-center shadow-lg border-2 border-white`}>
            <div className="w-8 h-8 rounded-full bg-white/50 flex items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-red-400"></div>
            </div>
        </div>
        <div className="h-1 w-16 bg-gradient-to-l from-yellow-400 to-red-400 rounded-r-full"></div>
    </div>
);

const ResultsScreen: React.FC<ResultsScreenProps> = ({ result, siblingType, onMakePromise, onRestart }) => {
  const [memory, setMemory] = useState('');
  const [tagline, setTagline] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateTagline = useCallback(async () => {
    if (!memory) return;
    setIsLoading(true);
    const generatedTagline = await generateMemoryTagline(memory);
    setTagline(generatedTagline);
    setIsLoading(false);
  }, [memory]);

  return (
    <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-yellow-200 w-full max-w-lg mx-auto space-y-6">
      {/* Poster Section */}
      <div id="poster" className="bg-gradient-to-br from-yellow-100 to-red-200 p-6 rounded-lg text-center shadow-inner relative overflow-hidden">
        <SiblingAvatar type={siblingType} className="justify-center mb-3" />
        <h2 className="text-3xl font-bold text-red-500 font-display">{result.title}</h2>
        <p className="text-amber-800 font-medium">{result.description}</p>
        <div className="mt-4 bg-red-100/50 rounded-full px-4 py-2 inline-flex items-center gap-2">
            <span className="font-bold text-red-600">Power Badge:</span>
            <span className="text-red-500 font-medium">{result.superpower}</span>
        </div>
        <DigitalRakhi color={result.rakhiColor} />
      </div>

      {/* AI Memory Card */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="font-display text-2xl text-amber-600 mb-2 text-center">AI Memory Card</h3>
        <p className="text-sm text-center text-gray-600 mb-3">Type a shared memory and let AI create a special tagline for it!</p>
        <textarea
            value={memory}
            onChange={(e) => setMemory(e.target.value)}
            placeholder="e.g., The time we built a fort out of all the living room cushions..."
            className="w-full p-2 border border-yellow-300 rounded-md focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition"
            rows={3}
        />
        <button onClick={handleGenerateTagline} disabled={isLoading} className="w-full mt-2 bg-amber-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-amber-600 disabled:bg-gray-400 transition">
            {isLoading ? 'Generating...' : 'Create Tagline'}
        </button>
        {tagline && (
            <div className="mt-3 text-center bg-yellow-100 p-3 rounded-lg">
                <p className="font-display text-xl text-amber-800">"{tagline}"</p>
            </div>
        )}
      </div>
      
      {/* Nostalgic Memory Suggestion */}
      <div className="bg-red-100 p-4 rounded-lg shadow-md text-center">
        <h3 className="font-display text-xl text-red-600 mb-1">Nostalgia Corner</h3>
        <p className="text-red-800">{result.memoryIdea}</p>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button onClick={onMakePromise} className="flex-1 bg-red-500 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-red-600 transform hover:-translate-y-0.5 transition-all">
          Make a Rakhi Promise 💌
        </button>
        <button onClick={onRestart} className="flex-1 bg-gray-200 text-gray-700 font-bold py-3 px-6 rounded-lg shadow-md hover:bg-gray-300 transform hover:-translate-y-0.5 transition-all">
          Play Again 🔄
        </button>
      </div>
    </div>
  );
};

export default ResultsScreen;
