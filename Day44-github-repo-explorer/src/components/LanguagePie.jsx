import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer, Legend } from "recharts";

function tallyLanguages(repos) {
  const map = new Map();
  for (const r of repos) {
    const lang = r.language || "Other";
    map.set(lang, (map.get(lang) || 0) + 1);
  }
  // Sort by count descending and limit to top 10 for better readability
  return Array.from(map, ([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);
}

const COLORS = [
  "#6366f1", "#8b5cf6", "#ec4899", "#f43f5e",
  "#f97316", "#f59e0b", "#eab308", "#84cc16",
  "#10b981", "#14b8a6", "#0ea5e9", "#3b82f6"
];

export default function LanguagePie({ repos }) {
  const data = tallyLanguages(repos);

  if (!data.length) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Languages</h3>
        <p className="text-gray-500">No language data available</p>
      </div>
    );
  }

  const totalLanguages = data.length;
  const totalRepos = data.reduce((sum, item) => sum + item.value, 0);
  const otherRepos = repos.length - totalRepos;

  // Custom label component
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        className="text-xs font-medium"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">Language Distribution</h3>
        <div className="text-sm text-gray-500">
          {totalLanguages} {totalLanguages === 1 ? 'language' : 'languages'} 
          {otherRepos > 0 && ` (+${otherRepos} other)`}
        </div>
      </div>
      
      <div className="w-full h-64">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
              nameKey="name"
              label={renderCustomizedLabel}
              labelLine={false}
            >
              {data.map((_, i) => (
                <Cell 
                  key={`cell-${i}`} 
                  fill={COLORS[i % COLORS.length]} 
                  stroke="#fff"
                  strokeWidth={1}
                />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value, name, props) => [
                `${value} repos (${(props.payload.percent * 100).toFixed(1)}%)`,
                name
              ]}
              contentStyle={{
                backgroundColor: '#fff',
                borderColor: '#e2e8f0',
                borderRadius: '0.375rem',
                boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
                padding: '0.5rem',
                color: '#1f2937'
              }}
            />
            <Legend 
              layout="horizontal"
              verticalAlign="bottom"
              height={40}
              wrapperStyle={{
                paddingTop: '1rem',
                color: '#1f2937'
              }}
              formatter={(value) => (
                <span className="text-sm">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {data.map((item, i) => (
          <div key={item.name} className="flex items-center">
            <div 
              className="w-3 h-3 rounded-full mr-2" 
              style={{ backgroundColor: COLORS[i % COLORS.length] }}
            />
            <span className="text-sm text-gray-700 truncate">
              {item.name} <span className="text-gray-500">({item.value})</span>
            </span>
          </div>
        ))}
      </div>

      {repos.length > 10 && (
        <div className="mt-2 text-xs text-gray-500 text-center">
          Showing top 10 languages by repository count
          {otherRepos > 0 && ` (${otherRepos} repos in other languages)`}
        </div>
      )}
    </div>
  );
}