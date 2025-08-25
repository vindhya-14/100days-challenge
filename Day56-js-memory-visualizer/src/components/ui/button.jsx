import React from "react";
import { cn } from "./utils";

export function Button({ children, variant = "default", className, ...props }) {
  const styles = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-slate-200 text-slate-900 hover:bg-slate-300",
    outline: "border border-slate-400 text-slate-700 hover:bg-slate-100",
  };
  return (
    <button
      className={cn(
        "px-3 py-1.5 rounded-xl text-sm font-medium transition-colors",
        styles[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
