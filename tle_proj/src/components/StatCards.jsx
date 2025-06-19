// components/StatCards.js
import React from "react";

function StatCards({ totalSolved, averageRating, hardestProblem, problemsPerDay }) {
    if(!totalSolved)return
    // console.log("hp", hardestProblem)
  return (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <div className="p-4 bg-white rounded shadow">
      <h4 className="text-gray-600">Total Solved</h4>
      <p className="text-2xl font-bold">{totalSolved}</p>
    </div>
    <div className="p-4 bg-white rounded shadow">
      <h4 className="text-gray-600">Average Rating</h4>
      <p className="text-2xl font-bold">{averageRating}</p>
    </div>
    <div className="p-4 bg-white rounded shadow">
      <h4 className="text-gray-600">Hardest Problem</h4>
      <a
        className="text-blue-600 underline"
        href={`https://codeforces.com/contest/${hardestProblem.contest_id}/problem/${hardestProblem.problem_index}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        {hardestProblem.problem_name} ({hardestProblem.problem_rating})
      </a>
    </div>
    <div className="p-4 bg-white rounded shadow">
      <h4 className="text-gray-600">Avg. Problems/Day</h4>
      <p className="text-2xl font-bold">{problemsPerDay}</p>
    </div>
  </div>
);

}

export default StatCards;
