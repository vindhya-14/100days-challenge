import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';

interface RakhiPromiseScreenProps {
  onRestart: () => void;
}

const RakhiPromiseScreen: React.FC<RakhiPromiseScreenProps> = ({ onRestart }) => {
  const [promise, setPromise] = useState('');
  const cardRef = useRef<HTMLDivElement>(null);

  const handleDownloadImage = async () => {
    if (cardRef.current) {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null, // transparent background if needed
        scale: 2, // higher resolution image
      });
      const dataUrl = canvas.toDataURL('image/png');

      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = 'rakhi-promise.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleShareText = () => {
  const text = `This Raksha Bandhan, I want to promise you from my heart: "${promise}"  
Thank you for always being my strength and my friend. Wishing us countless memories ahead.  
Happy Raksha Bandhan!`;
  
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
  window.open(whatsappUrl, '_blank');
};


  return (
    <div className="bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-yellow-300 max-w-md mx-auto space-y-8 text-center font-sans">
      <h2 className="font-display text-4xl text-red-600 tracking-wide drop-shadow-md">
        A Rakhi Promise
      </h2>
      <p className="text-amber-700 text-base sm:text-lg px-4">
        Write a short message or promise for your sibling. See it magically appear on the card below!
      </p>

      <textarea
        value={promise}
        onChange={(e) => setPromise(e.target.value)}
        placeholder="e.g., I promise to always have your back no matter what..."
        className="w-full p-4 border-2 border-yellow-400 rounded-lg focus:outline-none focus:ring-4 focus:ring-amber-300 transition shadow-sm text-lg resize-none"
        rows={5}
      />

      {/* Rakhi Card */}
      <div
        ref={cardRef}
        id="rakhi-card"
        className="relative bg-gradient-to-br from-yellow-200 via-red-200 to-red-400 p-8 rounded-xl shadow-inner border-4 border-yellow-300 text-left"
      >
        <div className="absolute top-3 right-3 text-4xl animate-pulse">🪔</div>
        <h3 className="font-display text-3xl text-red-700 mb-4 tracking-tight drop-shadow-lg">
          Happy Raksha Bandhan!
        </h3>
        <hr className="border-red-300 mb-6" />
        <p className="text-amber-900 min-h-[80px] italic text-xl leading-relaxed select-text whitespace-pre-wrap">
          {promise || 'Your wonderful promise will appear here...'}
        </p>
        <hr className="border-red-300 mt-6" />
        <p className="font-semibold text-red-700 mt-4 tracking-wide text-lg">
          Forever Your Guardian 🌟
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-5 justify-center px-4">
        <button
          onClick={handleDownloadImage}
          disabled={!promise}
          className="flex-1 bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:bg-blue-700 disabled:bg-gray-400 transition"
        >
          Download Card Image
        </button>
        <button
          onClick={handleShareText}
          disabled={!promise}
          className="flex-1 bg-green-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:bg-green-700 disabled:bg-gray-400 transition"
        >
          Share Text on WhatsApp
        </button>
        <button
          onClick={onRestart}
          className="flex-1 bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg shadow hover:bg-gray-300 transition"
        >
          Start Over
        </button>
      </div>
    </div>
  );
};

export default RakhiPromiseScreen;
