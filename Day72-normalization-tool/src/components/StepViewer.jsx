import React, { useState } from "react";

export default function StepViewer({ step, index, total }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!step)
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center text-gray-500 dark:text-gray-400 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg h-full">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 mb-3 opacity-50"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
          />
        </svg>
        <p>No normalization step to display</p>
        <p className="text-sm mt-1">
          Enter a database schema to begin the normalization process
        </p>
      </div>
    );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden h-full transition-all duration-300 hover:shadow-lg">
      {/* Header */}
      <div
        className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-800 border-b border-gray-200 dark:border-gray-700 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 font-bold mr-3">
            {index + 1}
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100">
              {step.title}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {step.subtitle || `Normalization Form ${index + 1}NF`}
            </p>
          </div>
        </div>

        <div className="flex items-center">
          <span className="text-xs font-medium px-2 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 mr-2">
            Step {index + 1} of {total}
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 text-gray-500 transition-transform duration-300 ${
              isExpanded ? "transform rotate-180" : ""
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      {/* Content */}
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isExpanded ? "max-h-96" : "max-h-0"
        }`}
      >
        <div className="p-4">
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            {step.description}
          </p>

          {step.details && (
            <div className="mb-4">
              <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2 flex items-center">
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
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Key Details
              </h4>
              <ul className="text-sm text-gray-600 dark:text-gray-400 pl-5 list-disc space-y-1">
                {step.details.map((detail, i) => (
                  <li key={i}>{detail}</li>
                ))}
              </ul>
            </div>
          )}

          {step.examples && (
            <div className="mt-4">
              <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2 flex items-center">
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
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
                Example
              </h4>
              <div className="mt-2 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg border border-gray-200 dark:border-gray-600 overflow-x-auto">
                <pre className="text-xs text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                  {typeof step.examples === "string"
                    ? step.examples
                    : JSON.stringify(step.examples, null, 2)}
                </pre>
              </div>
              {step.exampleDescription && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  {step.exampleDescription}
                </p>
              )}
            </div>
          )}

          {step.actions && (
            <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
              <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">
                Actions Taken:
              </h4>
              <ul className="text-sm text-gray-600 dark:text-gray-400 pl-5 list-disc space-y-1">
                {step.actions.map((action, i) => (
                  <li key={i}>{action}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Always visible summary */}
      <div
        className={`p-4 border-t border-gray-100 dark:border-gray-700 ${
          isExpanded ? "bg-gray-50 dark:bg-gray-750" : ""
        }`}
      >
        <div className="flex justify-between items-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {isExpanded ? "Click to collapse" : "Click to expand for details"}
          </p>
          <div className="flex space-x-2">
            {step.status && (
              <span
                className={`text-xs font-medium px-2 py-1 rounded-full ${
                  step.status === "completed"
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    : step.status === "pending"
                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                    : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                }`}
              >
                {step.status}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
