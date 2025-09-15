import { useState } from "react";
import GraphCanvas from "./components/GraphCanvas";
import Controls from "./components/Controls";

export default function App() {
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);

  const runAlgorithm = (algorithmSteps) => {
    setSteps(algorithmSteps);
    setCurrentStep(0);
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">
        Graph Algorithms Playground
      </h1>
      <Controls onRun={runAlgorithm} />
      <GraphCanvas step={steps[currentStep]} />
      {steps.length > 0 && (
        <button
          onClick={nextStep}
          className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
        >
          Next Step
        </button>
      )}
    </div>
  );
}
