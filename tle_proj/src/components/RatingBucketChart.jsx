// components/RatingBucketChart.js
import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

function RatingBucketChart({ ratingBuckets }) {
  return (
    <div className="bg-white p-4 mt-6 rounded shadow">
      <h3 className="text-lg font-semibold mb-2">Problems Solved by Rating Bucket</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={ratingBuckets}>
          <XAxis dataKey="rating" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default RatingBucketChart;
