import React from "react";

const Controls = () => {
  return (
    <div className="flex justify-center gap-4 mt-6">
      <button className="px-4 py-2 bg-cyan-600 rounded-xl shadow hover:bg-cyan-700">
        Restart 🔄
      </button>
      <button className="px-4 py-2 bg-green-600 rounded-xl shadow hover:bg-green-700">
        Pause ⏸
      </button>
    </div>
  );
};

export default Controls;
