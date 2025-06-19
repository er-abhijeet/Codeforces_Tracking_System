import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import dayjs from "dayjs";
const RecentContestsTable = ({ user, timeRange }) => {
  const ip = `http://localhost:3000`;
  const [contests, setContests] = useState([]);
  // console.log(timeRange);
  const setTableTimeline = () => {
    if(!contests.length)return [];
    const rows = contests;
    const now = dayjs();
    // const isoString = "2025-02-18T16:35:00.000Z";
// const unixTimestamp = Math.floor(new Date(isoString).getTime() / 1000);
// console.log("rows is ",contests);
// rows
      // .map((row) => console.log(dayjs.unix(Math.floor(new Date(row.participatedAt).getTime() / 1000))))
    const filteredRows = rows
      .map((row) => ({
        ...row,
        time: dayjs.unix(Math.floor(new Date(row.participatedAt).getTime() / 1000)),
        timeLabel: dayjs.unix(Math.floor(new Date(row.participatedAt).getTime() / 1000)).format("MMM DD, YYYY"),
      }))
      .filter((row) => row.time.isAfter(now.subtract(timeRange, "day")));
    console.log("setted interval");
    // setContests(filteredRows);
    // console.log(filteredRows);
    return filteredRows;
  };
  const filteredRows = setTableTimeline();
  useEffect(() => {
    const fetchContests = async () => {
      const data = await fetch(`${ip}/recentContestData?user=${user}`);
      // console.log(`${ip}/recentContestData?user=${user}`);
      let rows = await data.json();
      // console.log("rows here", rows);
      setContests(rows);
    };
    fetchContests();
  }, [ip, user]);
  return (
    <table className="w-full text-sm ">
      <thead className="bg-gray-50 text-gray-500">
        <tr>
          <th className="p-4 text-left">Contest Name</th>
          <th className="p-4 text-left">Date</th>
          <th className="p-4 text-left">Rank</th>
          <th className="p-4 text-left">Rating Change</th>
          <th className="p-4 text-left">Solved</th>
          <th className="p-4 text-left">Unsolved</th>
        </tr>
      </thead>
      <tbody>
        {filteredRows.map((c, i) => (
          <tr key={i} className="">
            <td className="p-4 font-bold">{c.contestName}</td>
            <td className="p-4 font-bold">
              {new Date(c.participatedAt).toLocaleDateString("en-CA")}
            </td>
            <td className="p-4 font-bold">{c.rank}</td>
            <td className="p-4 font-bold">
              {c.oldRating + "->" + c.newRating}
            </td>
            <td className="p-4 font-bold text-green-700">{c.solvedProblems}</td>
            <td className="p-4 font-bold text-orange-600">
              {c.unsolvedProblems}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default RecentContestsTable;
