import React, { useState, useEffect } from 'react';
import './CountdownTimer.css';

const CountdownTimer = () => {
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const handleStart = () => {
    setTimeLeft(minutes * 60 + seconds);
    setIsRunning(true);
  };

  useEffect(() => {
    let timer;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      alert("Time's up!");
    }

    return () => clearInterval(timer);
  }, [timeLeft, isRunning]);

  const formatTime = (time) => {
    const m = Math.floor(time / 60);
    const s = time % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="timer-container">
      <h1>Countdown Timer</h1>
      <div className="input-group">
        <input
          type="number"
          placeholder="Minutes"
          value={minutes}
          onChange={(e) => setMinutes(Number(e.target.value))}
        />
        <input
          type="number"
          placeholder="Seconds"
          value={seconds}
          onChange={(e) => setSeconds(Number(e.target.value))}
        />
      </div>
      <button onClick={handleStart} disabled={isRunning}>
        Start
      </button>
      <h2>{formatTime(timeLeft)}</h2>
    </div>
  );
};

export default CountdownTimer;
