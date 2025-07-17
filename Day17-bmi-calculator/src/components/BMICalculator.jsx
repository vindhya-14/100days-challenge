import React, { useState, useEffect } from "react";

export default function BMICalculator() {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bmi, setBmi] = useState(null);
  const [category, setCategory] = useState("");
  const [tip, setTip] = useState("");

  const tips = {
    Underweight: "Eat more calories and include healthy fats in your diet.",
    Normal: "Great! Maintain a balanced diet and regular exercise.",
    Overweight: "Try daily walking, reduce sugar, and increase fiber intake.",
    Obese: "Consult a doctor and focus on a consistent weight-loss plan.",
  };

  useEffect(() => {
    if (height && weight) {
      const heightInMeters = height / 100;
      const bmiValue = (weight / (heightInMeters * heightInMeters)).toFixed(2);
      setBmi(bmiValue);

      if (bmiValue < 18.5) {
        setCategory("Underweight");
        setTip(tips["Underweight"]);
      } else if (bmiValue < 24.9) {
        setCategory("Normal");
        setTip(tips["Normal"]);
      } else if (bmiValue < 29.9) {
        setCategory("Overweight");
        setTip(tips["Overweight"]);
      } else {
        setCategory("Obese");
        setTip(tips["Obese"]);
      }
    } else {
      setBmi(null);
      setCategory("");
      setTip("");
    }
  }, [height, weight]);

  const getColor = (category) => {
    switch (category) {
      case "Underweight":
        return "text-yellow-500";
      case "Normal":
        return "text-green-600";
      case "Overweight":
        return "text-orange-500";
      case "Obese":
        return "text-red-600";
      default:
        return "text-gray-700";
    }
  };

  const reset = () => {
    setHeight("");
    setWeight("");
    setBmi(null);
    setCategory("");
    setTip("");
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white/30 backdrop-blur-md border border-gray-200 rounded-xl shadow-lg transition duration-300 hover:shadow-xl">
      <h1 className="text-3xl font-extrabold mb-6 text-center text-indigo-700">BMI Calculator</h1>

      <div className="mb-4">
        <label className="block text-gray-800 font-medium mb-1">Height (cm)</label>
        <input
          type="number"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
          placeholder="e.g., 160"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-800 font-medium mb-1">Weight (kg)</label>
        <input
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
          placeholder="e.g., 60"
        />
      </div>

      <div className="flex gap-3 mt-4">
        <button
          onClick={reset}
          className="w-full bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
        >
          Reset
        </button>
      </div>

      {bmi && (
        <div className="mt-8 text-center animate-fade-in">
          <p className="text-xl font-bold">Your BMI: <span className="text-indigo-800">{bmi}</span></p>
          <p className={`text-lg font-semibold mt-2 ${getColor(category)}`}>Category: {category}</p>
          <p className="mt-3 text-sm text-gray-700 italic">{tip}</p>
        </div>
      )}
    </div>
  );
}
