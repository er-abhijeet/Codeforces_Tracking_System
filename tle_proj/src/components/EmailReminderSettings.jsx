import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function EmailReminderSettings() {
  const {handle}= useParams()
  const [enabled, setEnabled] = useState(true);
  const [count, setCount] = useState(0);
const ip= `http://localhost:3000`;
  useEffect(() => {
    fetch(`${ip}/email-status/${handle}`)
      .then(res => res.json())
      .then(data => {
        console.log(data.reminder_count);
        setEnabled(data.email_enabled);
        setCount(data.reminder_count);
      });
  }, [handle,ip]);

  const toggleEmail = async () => {
    const res = await fetch(`${ip}/email-toggle/${handle}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enabled: !enabled }),
    });
    if (res.ok) setEnabled(!enabled);
  };

  return (
    <div className="p-4 bg-white rounded shadow-md">
        <h1>{handle}</h1>
      <h4 className="font-semibold">Reminder Emails</h4>
      <p className="text-gray-700 mt-2">Sent: {count} times</p>
      <button
        className="mt-2 px-4 py-1 bg-blue-500 text-white rounded"
        onClick={toggleEmail}
      >
        {enabled ? "Disable" : "Enable"} Reminder Emails
      </button>
    </div>
  );
}

export default EmailReminderSettings;
