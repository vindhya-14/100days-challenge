// Updated Controls.jsx
import React from "react";

export default function Controls({
  onTrain,
  onReset,
  modelType,
  setModelType,
  isTraining,
  epochs,
  setEpochs,
  learningRate,
  setLearningRate,
}) {
  return (
    <div className="controls-panel">
      <h3>Model Configuration</h3>

      <div className="control-group">
        <label htmlFor="model-type">Model Type</label>
        <select
          id="model-type"
          value={modelType}
          onChange={(e) => setModelType(e.target.value)}
          disabled={isTraining}
        >
          <option value="perceptron">Perceptron</option>
          <option value="decisionTree">Decision Stump</option>
        </select>
      </div>

      {modelType === "perceptron" && (
        <>
          <div className="control-group">
            <label htmlFor="learning-rate">Learning Rate: {learningRate}</label>
            <input
              id="learning-rate"
              type="range"
              min="0.01"
              max="1"
              step="0.01"
              value={learningRate}
              onChange={(e) => setLearningRate(parseFloat(e.target.value))}
              disabled={isTraining}
            />
          </div>

          <div className="control-group">
            <label htmlFor="epochs">Epochs: {epochs}</label>
            <input
              id="epochs"
              type="range"
              min="1"
              max="100"
              step="1"
              value={epochs}
              onChange={(e) => setEpochs(parseInt(e.target.value))}
              disabled={isTraining}
            />
          </div>
        </>
      )}

      <div className="button-group">
        <button
          onClick={onTrain}
          disabled={isTraining}
          className="btn btn-primary"
        >
          {isTraining ? "Training..." : "Train Model"}
        </button>
        <button
          onClick={onReset}
          disabled={isTraining}
          className="btn btn-secondary"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
