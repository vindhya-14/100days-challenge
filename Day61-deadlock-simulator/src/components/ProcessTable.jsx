export default function ProcessTable({ processes }) {
  return (
    <div className="p-4 bg-white rounded-2xl shadow-md overflow-x-auto">
      <h2 className="text-lg font-bold mb-2">Processes</h2>
      <table className="min-w-full border border-gray-200 text-center">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2">Process</th>
            <th className="border px-4 py-2">Allocation</th>
            <th className="border px-4 py-2">Max</th>
          </tr>
        </thead>
        <tbody>
          {processes.map((p) => (
            <tr key={p.id}>
              <td className="border px-4 py-2 font-semibold">{p.id}</td>
              <td className="border px-4 py-2">{p.allocation.join(", ")}</td>
              <td className="border px-4 py-2">{p.max.join(", ")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
