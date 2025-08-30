export default function ResourceTable({ available }) {
  return (
    <div className="p-4 bg-white rounded-2xl shadow-md">
      <h2 className="text-lg font-bold mb-2">Available Resources</h2>
      <div className="flex gap-4">
        {available.map((res, i) => (
          <span key={i} className="px-3 py-1 bg-green-200 rounded-lg">
            R{i}: {res}
          </span>
        ))}
      </div>
    </div>
  );
}
