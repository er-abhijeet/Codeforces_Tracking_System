// pages/ProblemSolvingData.js
import React, { useEffect, useState } from "react";
import { fetchStats } from "../assets/api.js";
import StatCards from "./StatCards";
import RatingBucketChart from "./RatingBucketChart";
import SubmissionHeatmap from "./SubmissionHeatmap";

function ProblemSolvingData({ handle }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const ip = `http://localhost:3000`;

  useEffect(() => {
    fetchStats(handle,ip)
      .then(setData)
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [handle,ip]);

  if (loading) return <p>Loading...</p>;
  if (!data) return <p>No data found.</p>;
//   console.log("dt",data)
  return (
    <div className="p-4 space-y-4">
      <StatCards
        totalSolved={data.totalSolved}
        averageRating={data.averageRating}
        hardestProblem={data.hardestProblem}
        problemsPerDay={data.problemsPerDay}
      />
      <RatingBucketChart ratingBuckets={data.ratingBuckets} />
      <SubmissionHeatmap heatmapData={data.heatmapData} />
    </div>
  );
}

export default ProblemSolvingData;
