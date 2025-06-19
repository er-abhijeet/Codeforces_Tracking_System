import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useState } from "react";

const RatingHistoryChart = ({ data, p }) => {
  const [timeRange, setTimeRange] = useState("Last 12 Months");
  const [contestType, setContestType] = useState("All Contests");

  const timeOptions = ["Last 6 Months", "Last 12 Months", "Last 24 Months"];
  const contestOptions = [
    "All Contests",
    "Div. 1",
    "Div. 2",
    "Educational",
    "Global",
  ];
  console.log(p);
  return (
    <>
      <div className="flex items-center justify-between px-4 py-4 rounded border-b border-gray-200">
        <h2 className="text-lg font-semibold  px-2 py-1 rounded">
          Contest Performance
        </h2>
        <div className="grid grid-cols-3 text-center bg-gray-50 rounded p-4"></div>
        <div className="flex gap-2">
          <select
            className="px-4 p-2 rounded border border-gray-300 text-sm"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            {timeOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
          <select
            className="px-4 p-2 rounded border border-gray-300 text-sm"
            value={contestType}
            onChange={(e) => setContestType(e.target.value)}
          >
            {contestOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="col-span-2 space-y-4 ">
        <div className="grid grid-cols-3 text-center bg-gray-50 rounded p-4 ">
          <div className="rounded border border-gray-300 p-4 mx-2">
            <p className="text-sm text-gray-500">Contests Won</p>
            <p className="text-xl font-bold text-blue-600">
              {
                p?.contestsWon?p.contestsWon:""
              }
            </p>
          </div>
          <div className="rounded border border-gray-300 p-4 mx-2">
            <p className="text-sm text-gray-500">Average Rank</p>
            <p className="text-xl font-bold text-blue-600">
              {
                p?.averageRank?p.averageRank:""
              }
            </p>
          </div>
          <div className="rounded border border-gray-300 p-4 mx-2">
            <p className="text-sm text-gray-500">Best Rank</p>
            <p className="text-xl font-bold text-blue-600">
              {
                p?.bestRank?p.bestRank:""
              }
            </p>
          </div>
        </div>
      </div>
      <div className="p-6">

      <h1 className=" my-6 text-xl">Rating History</h1>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis dataKey="month" />
          <YAxis domain={[0, 2000]} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="rating"
            stroke="#6366F1"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
            </div>
    </>
  );
};

export default RatingHistoryChart;
