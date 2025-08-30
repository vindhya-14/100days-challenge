export default function ResultPanel({ result }) {
  if (!result) return null;

  return (
    <div className="p-4 bg-white rounded-2xl shadow-md mt-4">
      <h2 className="text-lg font-bold mb-2">Result</h2>
      {result.deadlock ? (
        <p className="text-red-600 font-semibold">⚠️ Deadlock Detected!</p>
      ) : (
        <p className="text-green-600 font-semibold">
          ✅ Safe Sequence: {result.safeSequence.join(" → ")}
        </p>
      )}
    </div>
  );
}
