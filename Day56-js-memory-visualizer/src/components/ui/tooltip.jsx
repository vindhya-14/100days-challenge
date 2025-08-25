import React, { useState } from "react";

export function TooltipProvider({ children }) {
  return <>{children}</>;
}

export function Tooltip({ children }) {
  return <div className="relative inline-block">{children}</div>;
}

export function TooltipTrigger({ children }) {
  return <>{children}</>;
}

export function TooltipContent({ children }) {
  return (
    <div className="absolute mt-1 px-2 py-1 text-xs bg-slate-800 text-white rounded shadow">
      {children}
    </div>
  );
}
