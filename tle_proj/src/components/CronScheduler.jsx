import React, { useState } from "react";

const CronScheduler = () => {
  const [hour, setHour] = useState("18");    // 6 PM default
  const [minute, setMinute] = useState("30"); // :30
  const [frequency, setFrequency] = useState("daily");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const ip = `http://localhost:3000`;

  const handleSubmit = async () => {
    setSaving(true);
    const res = await fetch(`${ip}/update-cron`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hour, minute, frequency }),
    });
    const data = await res.json();
    setMessage(data.message || "Error updating");
    setSaving(false);
  };

  return (
    <div className="flex justify-center items-center h-lvh">
    
    <div className="p-6 bg-white shadow-md rounded max-w-md">
      <h2 className="text-xl font-semibold mb-4">Update Cron Schedule</h2>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Hour (0–23)</label>
        <input
          className="border rounded p-2 w-full"
          type="number"
          value={hour}
          min={0}
          max={23}
          onChange={e => setHour(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Minute (0–59)</label>
        <input
          className="border rounded p-2 w-full"
          type="number"
          value={minute}
          min={0}
          max={59}
          onChange={e => setMinute(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Frequency</label>
        <select
          className="border rounded p-2 w-full"
          value={frequency}
          onChange={e => setFrequency(e.target.value)}
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="hourly">Hourly</option>
        </select>
      </div>

      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={handleSubmit}
        disabled={saving}
      >
        {saving ? "Updating..." : "Update Schedule"}
      </button>

      {message && <p className="mt-4 text-green-600">{message}</p>}
    </div>
    </div>
  );
};

export default CronScheduler;
