import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  Area,
  AreaChart,
} from "recharts";
import dayjs from "dayjs";
import { useState } from "react";
import { useEffect } from "react";

// Sample data (replace with props if needed)
// const data = [
//   {
//     contestId: 1899,
//     contestName: "Codeforces Round 909 (Div. 3)",
//     ratingUpdateTimeSeconds: 1700239800,
//     oldRating: 0,
//     newRating: 377,
//   },
//   {
//     contestId: 1905,
//     contestName: "Codeforces Round 915 (Div. 2)",
//     ratingUpdateTimeSeconds: 1702744500,
//     oldRating: 377,
//     newRating: 656,
//   },
//   {
//     contestId: 1913,
//     contestName: "Educational Codeforces Round 160 (Rated for Div. 2)",
//     ratingUpdateTimeSeconds: 1702917300,
//     oldRating: 656,
//     newRating: 834,
//   },
//   {
//     contestId: 1914,
//     contestName: "Codeforces Round 916 (Div. 3)",
//     ratingUpdateTimeSeconds: 1703005500,
//     oldRating: 834,
//     newRating: 943,
//   },
//   {
//     contestId: 1917,
//     contestName: "Codeforces Round 917 (Div. 2)",
//     ratingUpdateTimeSeconds: 1703435700,
//     oldRating: 943,
//     newRating: 1019,
//   },
//   {
//     contestId: 1915,
//     contestName: "Codeforces Round 918 (Div. 4)",
//     ratingUpdateTimeSeconds: 1703783100,
//     oldRating: 1019,
//     newRating: 994,
//   },
//   {
//     contestId: 1916,
//     contestName: "Good Bye 2023",
//     ratingUpdateTimeSeconds: 1703955000,
//     oldRating: 994,
//     newRating: 1035,
//   },
//   {
//     contestId: 1920,
//     contestName: "Codeforces Round 919 (Div. 2)",
//     ratingUpdateTimeSeconds: 1705163700,
//     oldRating: 994,
//     newRating: 1019,
//   },
// ];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const { contestName, newRating, oldRating } = payload[0].payload;
    return (
      <div className="bg-white p-3 border rounded shadow text-sm">
        <p className="font-semibold">{contestName}</p>
        <p>Date: {label}</p>
        <p>Rating:{" " + oldRating + " -> " + newRating}</p>
      </div>
    );
  }

  return null;
};

const RatingProgressChart = ({ user ,timeRange}) => {
  const [data, setData] = useState([]);
  const now = dayjs();
  const ip = `http://localhost:3000`;
  useEffect(() => {
    const fetchGraphData = async () => {
      const data = await fetch(`${ip}/progressData?user=${user}`);
      let rows = await data.json();
      rows = rows.result;
      // console.log("all dta", rows);
      setData(rows);
    };
    fetchGraphData();
  }, [user, ip]);
  // console.log("dff",dayjs.unix(data[0].ratingUpdateTimeSeconds))
  const filteredData = data
    .map((d) => ({
      ...d,
      time: dayjs.unix(d.ratingUpdateTimeSeconds),
      timeLabel: dayjs.unix(d.ratingUpdateTimeSeconds).format("MMM DD, YYYY"),
    }))
    .filter((d) => d.time.isAfter(now.subtract(timeRange, "day")));
  // console.log(filteredData);

  return (
    <>
      

      <div className="w-full h-[400px] p-4 bg-white rounded-2xl shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-center">
          Codeforces Rating Progress
        </h2>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={filteredData}
            margin={{ top: 20, right: 30, left: 10, bottom: 5 }}
          >
            <defs>
              <linearGradient id="ratingGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="timeLabel"
              angle={-30}
              textAnchor="end"
              height={60}
            />
            <YAxis domain={["auto", "auto"]} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Area
              type="monotone"
              dataKey="newRating"
              stroke="#8884d8"
              fillOpacity={1}
              fill="url(#ratingGradient)"
            />
            <Line
              type="monotone"
              dataKey="newRating"
              stroke="#413ea0"
              strokeWidth={2}
              dot={{ r: 5 }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </>
  );
};

export default RatingProgressChart;
