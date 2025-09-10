import React, { useEffect, useState } from "react";
import StepViewer from "./StepViewer";
import ResultPane from "./ResultPane";
import ProgressIndicator from "./ProgressIndicator";
import { parseSchema } from "../hooks/parser";
import { computeNormalizationSteps } from "../hooks/normalizationLogic";

export default function NormalizationWizard({ schema }) {
  const [state, setState] = useState({
    error: null,
    parsed: null,
    steps: [],
    current: 0,
    isLoading: false,
  });

  useEffect(() => {
    if (!schema) {
      setState({
        error: null,
        parsed: null,
        steps: [],
        current: 0,
        isLoading: false,
      });
      return;
    }

    setState((prev) => ({ ...prev, isLoading: true }));

    // Simulate processing delay for better UX
    const timer = setTimeout(() => {
      try {
        const parsed = parseSchema(schema);
        const steps = computeNormalizationSteps(parsed);
        setState({ error: null, parsed, steps, current: 0, isLoading: false });
      } catch (err) {
        setState({
          error: err.message || "Parsing error",
          parsed: null,
          steps: [],
          current: 0,
          isLoading: false,
        });
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [schema]);

  const { error, steps, current, isLoading } = state;

  function goTo(i) {
    setState((s) => ({
      ...s,
      current: Math.max(0, Math.min(i, (s.steps || []).length - 1)),
    }));
  }

  if (!schema)
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center text-gray-500 dark:text-gray-400 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl h-full">
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
        <p>Please input a database schema to begin normalization</p>
        <p className="text-sm mt-1">
          Example:{" "}
          <code className="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded">
            R(a, b, c)
          </code>
        </p>
      </div>
    );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5 h-full flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <div className="flex items-center">
          <div className="bg-indigo-100 dark:bg-indigo-900 p-2 rounded-lg mr-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-indigo-600 dark:text-indigo-400"
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
          </div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
            Normalization Wizard
          </h2>
        </div>

        {steps.length > 0 && (
          <span className="px-3 py-1 text-xs font-medium bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded-full">
            Step {current + 1} of {steps.length}
          </span>
        )}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-10 flex-grow">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Analyzing your schema...
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
            This may take a few seconds
          </p>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-5">
          <div className="flex items-start">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 mr-3 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <h3 className="font-medium text-red-800 dark:text-red-300">
                Error Processing Schema
              </h3>
              <p className="text-sm text-red-700 dark:text-red-400 mt-1">
                {error}
              </p>
              <p className="text-xs text-red-600 dark:text-red-500 mt-2">
                Please check your schema format and try again.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* No Steps Available */}
      {!error && steps.length === 0 && !isLoading && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <div className="flex items-start">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5 mr-3 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <div>
              <h3 className="font-medium text-yellow-800 dark:text-yellow-300">
                No Normalization Steps Available
              </h3>
              <p className="text-sm text-yellow-700 dark:text-yellow-400 mt-1">
                This schema may already be normalized or doesn't require further
                normalization steps.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Progress Indicator */}
      {steps.length > 0 && !isLoading && (
        <ProgressIndicator
          steps={steps}
          current={current}
          onStepClick={goTo}
          className="mb-5"
        />
      )}

      {/* Content Area */}
      {steps.length > 0 && !isLoading && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 flex-grow">
          <div className="lg:col-span-2">
            <StepViewer
              step={steps[current]}
              index={current}
              total={steps.length}
            />
          </div>
          <div>
            <ResultPane step={steps[current]} />
          </div>
        </div>
      )}

      {/* Navigation Controls */}
      {steps.length > 0 && !isLoading && (
        <div className="flex justify-between items-center mt-5 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {steps[current].status === "completed" ? (
              <span className="flex items-center text-green-600 dark:text-green-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Step completed
              </span>
            ) : (
              <span className="flex items-center text-blue-600 dark:text-blue-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                In progress
              </span>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => goTo(0)}
              className="btn-secondary flex items-center"
              disabled={current === 0}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.333 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z"
                />
              </svg>
              First
            </button>
            <button
              onClick={() => goTo(current - 1)}
              className="btn-secondary flex items-center"
              disabled={current === 0}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Previous
            </button>
            <button
              onClick={() => goTo(current + 1)}
              className="btn-primary flex items-center"
              disabled={current === steps.length - 1}
            >
              Next
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 ml-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
