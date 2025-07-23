import React from 'react';
import './ProgressBar.css';

const getColor = (value) => {
  if (value < 40) return 'low';
  if (value < 75) return 'medium';
  return 'high';
};

const ProgressBar = ({
  value,
  width = '100%',
  height = '30px',
  label = '',
  showPercentage = true,
  rounded = true,
}) => {
  const clampValue = Math.min(100, Math.max(0, value));
  const colorClass = getColor(clampValue);

  return (
    <div className="progress-wrapper" style={{ width }}>
      {label && <div className="progress-label">{label}</div>}
      <div
        className={`progress-bar-container ${rounded ? 'rounded' : ''}`}
        style={{ height }}
        role="progressbar"
        aria-valuenow={clampValue}
        aria-valuemin="0"
        aria-valuemax="100"
        aria-label={label || 'Progress Bar'}
        title={`${clampValue}% completed`}
      >
        <div
          className={`progress-bar-fill ${colorClass} striped`}
          style={{ width: `${clampValue}%` }}
        ></div>
        {showPercentage && (
          <span className="progress-bar-text">{clampValue}%</span>
        )}
      </div>
    </div>
  );
};

export default ProgressBar;
