
import React from 'react';
import ChatInterface from './components/ChatInterface';

const App: React.FC = () => {
  return (
    <main className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-blue-200 via-indigo-300 to-purple-300 flex items-center justify-center font-sans">
      <div className="absolute top-0 left-0 w-full h-full bg-opacity-20 bg-white backdrop-blur-sm"></div>
      <ChatInterface />
    </main>
  );
};

export default App;
