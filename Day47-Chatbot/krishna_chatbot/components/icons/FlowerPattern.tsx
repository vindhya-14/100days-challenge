import React from "react";

const FlowerPattern: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden opacity-10">
      <svg
        className="w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {Array.from({ length: 20 }).map((_, i) => {
          const cx = Math.random() * 100;
          const cy = Math.random() * 100;
          const r = Math.random() * 2 + 0.5;
          const fill = i % 2 === 0 ? "#7c3aed" : "#2563eb";

          return <circle key={i} cx={cx} cy={cy} r={r} fill={fill} />;
        })}
        {Array.from({ length: 10 }).map((_, i) => {
          const x1 = Math.random() * 100;
          const y1 = Math.random() * 100;
          const x2 = Math.random() * 100;
          const y2 = Math.random() * 100;
          const stroke = i % 2 === 0 ? "#7c3aed" : "#2563eb";

          return (
            <line
              key={i + 20}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={stroke}
              strokeWidth="0.5"
            />
          );
        })}
      </svg>
    </div>
  );
};

export default FlowerPattern;
