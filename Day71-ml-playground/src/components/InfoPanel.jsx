// Updated InfoPanel.jsx
import React from "react";

export default function InfoPanel({
  predictions,
  points,
  trainingHistory,
  onClearHistory,
}) {
  const accuracy = predictions
    ? (
        (predictions.filter((p, i) => p === points[i].label).length /
          points.length) *
        100
      ).toFixed(1)
    : 0;

  return (
    <div className="info-panel">
      <div className="stats-card">
        <h3>Current Model</h3>
        <div className="stats-grid">
          <div className="stat">
            <span className="stat-value">{points.length}</span>
            <span className="stat-label">Points</span>
          </div>
          <div className="stat">
            <span className="stat-value">
              {predictions ? `${accuracy}%` : "N/A"}
            </span>
            <span className="stat-label">Accuracy</span>
          </div>
        </div>
      </div>

      {trainingHistory.length > 0 && (
        <div className="history-card">
          <div className="card-header">
            <h3>Training History</h3>
            <button onClick={onClearHistory} className="btn-sm">
              Clear
            </button>
          </div>
          <div className="history-list">
            {trainingHistory.map((item, index) => (
              <div key={index} className="history-item">
                <div className="history-model">{item.modelType}</div>
                <div className="history-accuracy">{item.accuracy}%</div>
                <div className="history-points">{item.points} points</div>
                <div className="history-time">{item.timestamp}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
