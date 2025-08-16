
import React from 'react';

const BotIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-6 h-6 text-indigo-600"
  >
    <path d="M14.5 6.5C14.5 12.5 9.5 17.5 3.5 17.5" />
    <path d="M14.5 6.5C14.5 12.5 19.5 17.5 25.5 17.5" transform="matrix(-1, 0, 0, 1, 29, 0)"/>
    <path d="M12 21a2 2 0 0 0 2-2c0-3-4-5-4-5s-4 2-4 5a2 2 0 0 0 2 2z" />
    <circle cx="12" cy="11" r="2.5" className="fill-current text-blue-400" />
    <path d="M3 17.5c3-1 5-3 5-5" />
    <path d="M21 17.5c-3-1-5-3-5-5" />
  </svg>
);

export default BotIcon;
