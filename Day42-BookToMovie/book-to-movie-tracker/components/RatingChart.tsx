
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface RatingChartProps {
  bookRating: number; // expecting 0-10
  adaptationRating: number; // expecting 0-10
}

const RatingChart: React.FC<RatingChartProps> = ({ bookRating, adaptationRating }) => {
  const data = [
    { name: 'Book', rating: bookRating },
    { name: 'Adaptation', rating: adaptationRating },
  ];
  const colors = ['#22d3ee', '#64748b']; // cyan, slate

  return (
    <div className="w-full h-48 my-4">
      <h4 className="text-lg font-bold text-slate-200 mb-2 text-center">Ratings Comparison</h4>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
          <XAxis type="number" domain={[0, 10]} hide />
          <YAxis type="category" dataKey="name" width={80} tickLine={false} axisLine={false} tick={{ fill: '#cbd5e1' }} />
          <Tooltip 
            cursor={{ fill: 'rgba(255,255,255,0.1)' }}
            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '0.5rem' }}
            labelStyle={{ color: '#e2e8f0' }}
          />
          <Bar dataKey="rating" barSize={25} radius={[0, 10, 10, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RatingChart;
