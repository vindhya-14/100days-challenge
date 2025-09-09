import React, { useState, useEffect } from "react";
import Canvas from "./components/Canvas";
import Controls from "./components/Controls";
import InfoPanel from "./components/InfoPanel";
import { Perceptron } from "./ml/perceptron";
import { DecisionStump } from "./ml/decisionTree";
import "./App.css";

export default function App() {
  const [points, setPoints] = useState([]);
  const [model, setModel] = useState(null);
  const [predictions, setPredictions] = useState(null);
  const [modelType, setModelType] = useState("perceptron");
  const [trainingHistory, setTrainingHistory] = useState([]);
  const [isTraining, setIsTraining] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [epochs, setEpochs] = useState(10);
  const [learningRate, setLearningRate] = useState(0.1);
  const [trainingModel, setTrainingModel] = useState(null);

  const onTrain = () => {
    if (points.length === 0) return;

    setIsTraining(true);
    setTrainingProgress(0);

    const X = points.map((p) => [p.x / 200 - 1, p.y / 200 - 1]);
    const y = points.map((p) => p.label);

    let m =
      modelType === "perceptron"
        ? new Perceptron(2, learningRate)
        : new DecisionStump();

    setTrainingModel(m);

    // For DecisionStump, train immediately as it's fast
    if (modelType === "decisionTree") {
      m.train(X, y);
      setModel(m);
      const newPredictions = points.map((p, i) => m.predict(X[i]));
      setPredictions(newPredictions);

      // Calculate accuracy for history
      const correct = newPredictions.filter(
        (p, i) => p === points[i].label
      ).length;
      const accuracy = ((correct / points.length) * 100).toFixed(1);

      setTrainingHistory((prev) => [
        ...prev,
        {
          modelType,
          accuracy,
          points: points.length,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);

      setIsTraining(false);
      setTrainingModel(null);
      return;
    }

    // For Perceptron, show training progress
    const totalSteps = epochs;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;

      // Train for one epoch
      if (currentStep <= epochs) {
        // Train for one epoch
        for (let i = 0; i < X.length; i++) {
          let pred = m.predict(X[i]);
          let error = y[i] - pred;
          m.weights[0] += m.lr * error;
          for (let j = 0; j < X[i].length; j++) {
            m.weights[j + 1] += m.lr * error * X[i][j];
          }
        }

        setTrainingProgress((currentStep / totalSteps) * 100);

        // Update predictions after each epoch for visualization
        const newPredictions = points.map((p, i) => m.predict(X[i]));
        setPredictions(newPredictions);

        // Create a new instance with the updated weights to maintain class methods
        const updatedModel = new Perceptron(2, learningRate);
        updatedModel.weights = [...m.weights];
        setModel(updatedModel);
      }

      if (currentStep >= totalSteps) {
        clearInterval(interval);
        setModel(m);

        const newPredictions = points.map((p, i) => m.predict(X[i]));
        setPredictions(newPredictions);

        // Calculate accuracy for history
        const correct = newPredictions.filter(
          (p, i) => p === points[i].label
        ).length;
        const accuracy = ((correct / points.length) * 100).toFixed(1);

        setTrainingHistory((prev) => [
          ...prev,
          {
            modelType,
            accuracy,
            points: points.length,
            timestamp: new Date().toLocaleTimeString(),
          },
        ]);

        setIsTraining(false);
        setTrainingModel(null);
      }
    }, 200); // Update every 200ms
  };

  const onReset = () => {
    setPoints([]);
    setModel(null);
    setPredictions(null);
    setTrainingProgress(0);
    setTrainingModel(null);
  };

  const onClearHistory = () => {
    setTrainingHistory([]);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>ML Playground</h1>
        <p>Visualize machine learning algorithms in action</p>
      </header>

      <div className="main-content">
        <div className="left-panel">
          <Controls
            onTrain={onTrain}
            onReset={onReset}
            modelType={modelType}
            setModelType={setModelType}
            isTraining={isTraining}
            epochs={epochs}
            setEpochs={setEpochs}
            learningRate={learningRate}
            setLearningRate={setLearningRate}
          />

          <InfoPanel
            predictions={predictions}
            points={points}
            trainingHistory={trainingHistory}
            onClearHistory={onClearHistory}
          />

          <div className="instructions">
            <h3>Instructions</h3>
            <ul>
              <li>
                Click to add <span className="green-text">positive</span> points
                (class 1)
              </li>
              <li>
                Shift+Click to add <span className="red-text">negative</span>{" "}
                points (class -1)
              </li>
              <li>
                Select a model and click "Train" to see the decision boundary
              </li>
            </ul>
          </div>
        </div>

        <div className="canvas-container">
          <Canvas
            points={points}
            setPoints={setPoints}
            model={isTraining ? trainingModel : model}
            predictions={predictions}
          />

          {isTraining && (
            <div className="training-overlay">
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${trainingProgress}%` }}
                ></div>
              </div>
              <p>
                Training {modelType}... {Math.round(trainingProgress)}%
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
