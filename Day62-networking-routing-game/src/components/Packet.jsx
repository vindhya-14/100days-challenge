import React, { useEffect, useState } from "react";

export default function Packet({ data, onEnd }) {
  const { path, id } = data;
  const [pos, setPos] = useState(path[0]);

  useEffect(() => {
    if (!path || path.length < 2) return;

    let mounted = true;
    const animate = async () => {
      for (let i = 0; i < path.length - 1 && mounted; i++) {
        const a = path[i];
        const b = path[i + 1];
        const steps = 40;
        for (let s = 1; s <= steps; s++) {
          if (!mounted) return;
          const t = s / steps;
          const x = a.x + (b.x - a.x) * t;
          const y = a.y + (b.y - a.y) * t;
          setPos({ x, y });
          await new Promise((r) => setTimeout(r, 15));
        }
      }
      onEnd && onEnd(id);
    };
    animate();
    return () => {
      mounted = false;
    };
  }, [path]);

  return (
    <div
      className="absolute w-5 h-5 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-500 shadow-[0_0_10px_rgba(34,211,238,0.9)]"
      style={{ left: pos.x - 10, top: pos.y - 10 }}
    />
  );
}
