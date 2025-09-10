import React, { useState } from "react";

export default function SchemaInput({ onSubmit, showTutorial }) {
  const [text, setText] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [validationError, setValidationError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const samples = [
    {
      name: "Simple Order Schema",
      value:
        "Orders(orderId, customerId, productId, productName, quantity, price, customerName)",
      description:
        "A simple order management schema with potential redundancy in customer and product information",
    },
    {
      name: "University Database",
      value:
        "Students(studentId, firstName, lastName, department, advisorId, advisorName, courseId, courseName, grade)",
      description:
        "A university schema showing student information with advisor and course details",
    },
    {
      name: "Employee Management",
      value:
        "Employees(empId, name, departmentId, departmentName, projectId, projectName, skillId, skillName)",
      description:
        "An employee management schema with department, project, and skill information",
    },
    {
      name: "Library System",
      value:
        "Books(bookId, title, authorId, authorName, genreId, genreName, publisherId, publisherName)",
      description:
        "A library system schema with book details and associated information",
    },
  ];

  function validateSchema(schema) {
    if (!schema.trim()) {
      return "Schema cannot be empty";
    }

    // Check if it follows the common pattern: Relation(attribute1, attribute2, ...)
    const schemaPattern = /^[A-Za-z_][A-Za-z0-9_]*\s*\([A-Za-z0-9_,\s]+\)$/;
    if (!schemaPattern.test(schema)) {
      return "Schema should follow the pattern: Relation(attr1, attr2, ...)";
    }

    // Check if it has at least two attributes
    const attributesMatch = schema.match(/\(([^)]+)\)/);
    if (attributesMatch) {
      const attributes = attributesMatch[1]
        .split(",")
        .map((attr) => attr.trim());
      if (attributes.length < 2) {
        return "Schema must have at least two attributes";
      }

      // Check for duplicate attributes
      const uniqueAttrs = new Set(attributes);
      if (uniqueAttrs.size !== attributes.length) {
        return "Schema contains duplicate attributes";
      }
    }

    return "";
  }

  function handleSubmit(e) {
    e.preventDefault();
    setIsProcessing(true);

    const error = validateSchema(text.trim());
    if (error) {
      setIsValid(false);
      setValidationError(error);
      setIsProcessing(false);
      return;
    }

    setIsValid(true);
    setValidationError("");

    // Simulate processing delay for better UX
    setTimeout(() => {
      onSubmit(text.trim());
      setIsProcessing(false);
    }, 800);
  }

  function handleSampleClick(sampleValue) {
    setText(sampleValue);
    setIsValid(true);
    setValidationError("");
  }

  function handleInputChange(e) {
    setText(e.target.value);
    // Clear validation error when user starts typing
    if (!isValid) {
      setIsValid(true);
      setValidationError("");
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5 h-full">
      <div className="flex items-center justify-between mb-4">
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
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
            Schema Input
          </h2>
        </div>

        <div className="flex space-x-2">
          <button
            type="button"
            onClick={() => setShowHelp(!showHelp)}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            title="Show help"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Help Section */}
      {showHelp && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
          <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-2 flex items-center">
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
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Schema Format Guide
          </h3>
          <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
            <li>
              • Use the format:{" "}
              <code className="bg-blue-100 dark:bg-blue-900/30 px-1 py-0.5 rounded">
                RelationName(attribute1, attribute2, ...)
              </code>
            </li>
            <li>• Relation name should start with a letter</li>
            <li>• Attributes should be separated by commas</li>
            <li>• Avoid duplicate attribute names</li>
            <li>• Include at least two attributes</li>
          </ul>
          <button
            onClick={showTutorial}
            className="mt-2 text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3 w-3 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            View full tutorial
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="schema-input"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Enter your database schema
          </label>
          <textarea
            id="schema-input"
            value={text}
            onChange={handleInputChange}
            placeholder="e.g., Orders(orderId, customerId, productId, productName, quantity, price, customerName)"
            rows={5}
            className={`w-full p-3 border rounded-lg text-sm dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
              !isValid
                ? "border-red-500 ring-2 ring-red-200 dark:ring-red-800"
                : "border-gray-300"
            }`}
          />
          {!isValid && (
            <div className="mt-2 flex items-center text-red-600 dark:text-red-400 text-sm">
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
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {validationError}
            </div>
          )}
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Format: RelationName(attribute1, attribute2, attribute3, ...)
          </p>
        </div>

        <div className="flex gap-2 mt-4">
          <button
            className="btn-primary flex items-center justify-center min-w-[120px]"
            type="submit"
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </>
            ) : (
              <>
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
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Analyze
              </>
            )}
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => {
              setText("");
              setIsValid(true);
              setValidationError("");
            }}
            disabled={isProcessing}
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
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            Clear
          </button>
        </div>
      </form>

      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
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
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Try sample schemas
        </h3>
        <div className="space-y-2">
          {samples.map((sample, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSampleClick(sample.value)}
              className="w-full text-left p-3 text-sm rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
              disabled={isProcessing}
            >
              <div className="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mt-0.5 mr-2 text-indigo-600 dark:text-indigo-400 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div className="flex-grow">
                  <div className="font-medium text-gray-800 dark:text-gray-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {sample.name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-mono bg-gray-100 dark:bg-gray-750 p-1 rounded">
                    {sample.value}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {sample.description}
                  </div>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-gray-400 group-hover:text-indigo-500 mt-0.5 ml-2 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
