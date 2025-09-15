export default function GraphCanvas({ step }) {
  if (!step) return <div className="text-gray-500">Run an algorithm</div>;

  return (
    <div className="p-6 border rounded-lg bg-white shadow-md w-full max-w-md">
      <h2 className="text-xl font-semibold mb-2">Step:</h2>
      <pre className="bg-gray-100 p-3 rounded text-sm">
        {JSON.stringify(step, null, 2)}
      </pre>
    </div>
  );
}
