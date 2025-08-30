export default function SimulationControls({ onRun }) {
  return (
    <div className="p-4 flex justify-center">
      <button
        onClick={onRun}
        className="px-6 py-2 bg-blue-600 text-white rounded-xl shadow-md hover:bg-blue-700 transition"
      >
        Run Banker’s Algorithm
      </button>
    </div>
  );
}
