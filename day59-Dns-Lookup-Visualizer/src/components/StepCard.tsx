import React from "react";
import { motion } from "framer-motion";

interface StepCardProps {
  step: string;
  description: string;
  active?: boolean;
}

const StepCard: React.FC<StepCardProps> = ({ step, description, active }) => {
  return (
    <motion.div
      className={`p-4 rounded-2xl shadow-md border ${
        active ? "bg-cyan-600 border-cyan-400" : "bg-gray-800 border-gray-700"
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-lg font-semibold">{step}</h2>
      <p className="text-sm opacity-90">{description}</p>
    </motion.div>
  );
};

export default StepCard;
