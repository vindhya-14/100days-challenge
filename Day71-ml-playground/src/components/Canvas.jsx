// src/components/Canvas.jsx
import React, { useRef, useEffect } from "react";

const WIDTH = 500,
  HEIGHT = 500;

export default function Canvas({ points, setPoints, model, predictions }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    // Draw grid
    ctx.strokeStyle = "#f0f0f0";
    ctx.lineWidth = 1;
    const gridSize = 25;
    for (let x = 0; x <= WIDTH; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, HEIGHT);
      ctx.stroke();
    }
    for (let y = 0; y <= HEIGHT; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(WIDTH, y);
      ctx.stroke();
    }

    // Draw axes
    ctx.strokeStyle = "#d1d5db";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(WIDTH / 2, 0);
    ctx.lineTo(WIDTH / 2, HEIGHT);
    ctx.moveTo(0, HEIGHT / 2);
    ctx.lineTo(WIDTH, HEIGHT / 2);
    ctx.stroke();

    // Draw decision boundary with smoother visualization
    if (model && typeof model.predict === "function") {
      const pixelSize = 4;
      for (let x = 0; x < WIDTH; x += pixelSize) {
        for (let y = 0; y < HEIGHT; y += pixelSize) {
          const px = [(x / WIDTH) * 2 - 1, (y / HEIGHT) * 2 - 1];
          const pred = model.predict(px);
          ctx.fillStyle =
            pred === 1 ? "rgba(34, 197, 94, 0.2)" : "rgba(239, 68, 68, 0.2)";
          ctx.fillRect(x, y, pixelSize, pixelSize);
        }
      }
    }

    // Draw points with outline for better visibility
    points.forEach((p, i) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 8, 0, Math.PI * 2);

      let actualColor = p.label === 1 ? "#22c55e" : "#ef4444";
      let predicted = predictions ? predictions[i] : p.label;

      // Fill
      ctx.fillStyle = predicted === p.label ? actualColor : "#000000";
      ctx.fill();

      // Outline
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2;
      ctx.stroke();
    });
  }, [points, model, predictions]);

  const handleClick = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const label = e.shiftKey ? -1 : 1;
    setPoints([...points, { x, y, label }]);
  };

  return (
    <canvas
      ref={canvasRef}
      width={WIDTH}
      height={HEIGHT}
      onClick={handleClick}
      className="ml-canvas"
    />
  );
}
