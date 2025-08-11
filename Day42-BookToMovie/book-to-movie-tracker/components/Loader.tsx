
import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="flex justify-center items-center p-4">
      <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent border-solid rounded-full animate-spin"></div>
    </div>
  );
};

export default Loader;
