import React, { useState, useEffect } from "react";
import StepCard from "./StepCard";

const steps = [
  { step: "Client Request", desc: "The client requests example.com" },
  { step: "Recursive Resolver", desc: "Resolver forwards request" },
  { step: "Root DNS Server", desc: "Points to TLD server (.com)" },
  { step: "TLD DNS Server", desc: "Directs to Authoritative Server" },
  { step: "Authoritative DNS", desc: "Returns the IP for example.com" },
  { step: "Final Response", desc: "Client gets IP address (93.184.216.34)" },
];

const Visualizer = () => {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {steps.map((s, i) => (
        <StepCard
          key={i}
          step={s.step}
          description={s.desc}
          active={i === activeStep}
        />
      ))}
    </div>
  );
};

export default Visualizer;
