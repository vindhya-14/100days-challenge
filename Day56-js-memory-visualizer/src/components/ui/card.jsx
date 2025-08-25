import React from "react";
import { cn } from "./utils";

export function Card({ children, className }) {
  return (
    <div className={cn("bg-white rounded-2xl shadow p-3", className)}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className }) {
  return <div className={cn("mb-2", className)}>{children}</div>;
}

export function CardTitle({ children, className }) {
  return <h3 className={cn("font-semibold", className)}>{children}</h3>;
}

export function CardContent({ children, className }) {
  return <div className={cn("space-y-2", className)}>{children}</div>;
}
