import React from 'react'
import RatingProgressChart from './RatingProgressChart'
import RecentContestsTable from './RecentContestsTable'
import { useState } from 'react';


function ContestHistoryPage({user,p}) {
      const [timeRange, setTimeRange] = useState(90);
  const timeOptions = [30, 90, 36500];

    return (
        <div className="flex-2 rounded-xl border-gray-300 border">
          {/* <RatingHistoryChart data={p.ratingHistory} p={p} /> */}
          <div>
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
                    </div>
                  </div>
          <RatingProgressChart user={user} timeRange={timeRange}/>
          </div>
          <div className="h-1 bg-gray-200 mr-10 ml-8"></div>
          <div className=" p-4 rounded ">
            <h2 className="text-lg font-semibold mb-4">Recent Contests</h2>
            <RecentContestsTable contests={p.recentContests} user={user} timeRange={timeRange}/>
          </div>
        </div>
    )
}

export default ContestHistoryPage
