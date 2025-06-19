import React from 'react';
import classNames from 'classnames';

const ActivityHeatmap = ({ data }) => {
  return (
    <div className="grid grid-cols-7 gap-1 ">
      {Object.entries(data).map(([day, sessions]) => (
        <div key={day}>
          <div className="text-xs mb-1">{day.slice(0, 3)}</div>
          <div className="space-y-1">
            {sessions.map((val, i) => (
              <div
                key={i}
                className={classNames(
                  "h-6 w-12 rounded-sm",
                  {
                    "bg-blue-100": val <= 1,
                    "bg-blue-300": val === 2,
                    "bg-blue-500": val >= 3,
                  }
                )}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActivityHeatmap;
