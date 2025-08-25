import React from "react";
import { cn } from "./utils";

export function Badge({ children, variant = "default", className }) {
  const styles = {
    default: "bg-blue-600 text-white",
    secondary: "bg-slate-200 text-slate-800",
  };
  return (
    <span
      className={cn(
        "px-2 py-0.5 rounded-full text-xs font-medium",
        styles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
