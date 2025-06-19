// components/SubmissionHeatmap.js
import React from "react";
import CalendarHeatmap from "react-calendar-heatmap";

function SubmissionHeatmap({ heatmapData }) {
  const startDate = new Date(new Date().setFullYear(new Date().getFullYear() - 1));
  const endDate = new Date();

  return (
    <div className="bg-white p-4 mt-6 rounded shadow">
      <h3 className="text-lg font-semibold mb-2">Submission Heatmap</h3>
      <CalendarHeatmap
        startDate={startDate}
        endDate={endDate}
        values={heatmapData}
        classForValue={value => {
          if (!value) return "color-empty";
          if (value.count >= 10) return "color-scale-4";
          if (value.count >= 5) return "color-scale-3";
          if (value.count >= 2) return "color-scale-2";
          return "color-scale-1";
        }}
        tooltipDataAttrs={value => ({
          "data-tip": value.date ? `${value.date}: ${value.count} solved` : "",
        })}
        showWeekdayLabels
      />
    </div>
  );
}

export default SubmissionHeatmap;
