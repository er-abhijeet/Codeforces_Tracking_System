import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const ProblemsByDifficultyChart = ({ data }) => {
  const formatted = Object.entries(data).map(([difficulty, count]) => ({
    difficulty, count
  }));

  return (<div className='mt-6'>
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={formatted}>
        <XAxis dataKey="difficulty" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="count" fill="#3B82F6" />
      </BarChart>
    </ResponsiveContainer>
    </div>
  );
};

export default ProblemsByDifficultyChart;
