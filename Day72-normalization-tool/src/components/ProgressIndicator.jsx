import React from "react";

export default function ProgressIndicator({
  steps,
  current,
  onStepClick,
  className = "",
}) {
  if (!steps || steps.length === 0) return null;

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 ${className}`}
    >
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 mr-1 text-indigo-600 dark:text-indigo-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
        Normalization Progress
      </h3>

      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-gray-500 dark:text-gray-400">Start</span>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          Complete
        </span>
      </div>

      <div className="relative mb-4">
        {/* Progress line */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700 rounded-full transform -translate-y-1/2"></div>
        <div
          className="absolute top-1/2 left-0 h-1 bg-indigo-600 dark:bg-indigo-500 rounded-full transform -translate-y-1/2 transition-all duration-300"
          style={{ width: `${(current / (steps.length - 1)) * 100}%` }}
        ></div>

        {/* Step markers */}
        <div className="relative flex justify-between">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <button
                onClick={() => onStepClick(index)}
                className={`w-6 h-6 rounded-full flex items-center justify-center relative z-10 transition-all duration-200 ${
                  index <= current
                    ? "bg-indigo-600 dark:bg-indigo-500 text-white shadow-md"
                    : "bg-white dark:bg-gray-600 text-gray-400 dark:text-gray-300 border border-gray-300 dark:border-gray-500"
                } ${
                  index === current
                    ? "ring-2 ring-indigo-300 dark:ring-indigo-700 scale-110"
                    : ""
                }`}
                aria-label={`Go to step ${index + 1}: ${step.title}`}
              >
                {index <= current ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  <span className="text-xs font-medium">{index + 1}</span>
                )}
              </button>

              {/* Step label */}
              <div
                className={`absolute top-full left-1/2 transform -translate-x-1/2 mt-2 text-xs text-center w-24 ${
                  index <= current
                    ? "text-indigo-700 dark:text-indigo-300 font-medium"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {step.title}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Step status summary */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-indigo-600 dark:bg-indigo-500 mr-2"></div>
          <span className="text-gray-600 dark:text-gray-300">Completed</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 mr-2"></div>
          <span className="text-gray-600 dark:text-gray-300">Pending</span>
        </div>
      </div>
    </div>
  );
}
