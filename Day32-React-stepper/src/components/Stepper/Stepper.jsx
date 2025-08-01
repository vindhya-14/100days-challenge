import React, { useState } from "react";
import "./Stepper.css";
import steps from "./steps";

const Stepper = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const next = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  return (
    <div className="stepper-container">
      <div className="stepper">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`step ${index <= currentStep ? "active" : ""}`}
          >
            {step.title}
          </div>
        ))}
      </div>

      <div className="step-content">
        <p>{steps[currentStep].content}</p>
        <div className="step-buttons">
          <button onClick={prev} disabled={currentStep === 0}>
            Previous
          </button>
          <button onClick={next} disabled={currentStep === steps.length - 1}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Stepper;
