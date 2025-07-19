import React, { useState } from 'react';

const Poll = () => {
  const question = "What's your favorite programming language?";
  const options = ['JavaScript', 'Python', 'C++', 'Java'];

  const [votes, setVotes] = useState(Array(options.length).fill(0));
  const [voted, setVoted] = useState(false);

  const handleVote = (index) => {
    if (voted) return;
    const newVotes = [...votes];
    newVotes[index] += 1;
    setVotes(newVotes);
    setVoted(true);
  };

  const totalVotes = votes.reduce((a, b) => a + b, 0);

  return (
    <div className="bg-white shadow-md rounded p-6 w-96">
      <h2 className="text-xl font-bold mb-4">{question}</h2>
      {options.map((option, index) => {
        const percentage = totalVotes ? ((votes[index] / totalVotes) * 100).toFixed(1) : 0;

        return (
          <div key={index} className="mb-4">
            <button
              onClick={() => handleVote(index)}
              disabled={voted}
              className="w-full text-left px-4 py-2 bg-blue-100 hover:bg-blue-200 rounded"
            >
              {option}
            </button>
            {voted && (
              <div className="mt-1 w-full bg-gray-200 rounded h-4">
                <div
                  className="bg-blue-500 h-4 rounded"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            )}
            {voted && (
              <p className="text-sm text-gray-600">{percentage}% ({votes[index]} votes)</p>
            )}
          </div>
        );
      })}
      {voted && (
        <p className="text-green-600 mt-4 font-semibold text-center">Thank you for voting!</p>
      )}
    </div>
  );
};

export default Poll;
