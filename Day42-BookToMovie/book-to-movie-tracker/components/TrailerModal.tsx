
import React from 'react';

interface TrailerModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoKey: string | null;
}

const TrailerModal: React.FC<TrailerModalProps> = ({ isOpen, onClose, videoKey }) => {
  if (!isOpen || !videoKey) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/80 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div 
        className="bg-slate-900 p-2 rounded-lg shadow-2xl w-full max-w-4xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="aspect-w-16 aspect-h-9">
          <iframe
            src={`https://www.youtube.com/embed/${videoKey}`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="Embedded trailer"
            className="w-full h-full"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default TrailerModal;
