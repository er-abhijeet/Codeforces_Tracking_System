// utils/api.js
export async function fetchStats(handle,ip) {
  const res = await fetch(`${ip}/stats/${handle}`);
  if (!res.ok) throw new Error("Failed to fetch stats");
  return await res.json();
}
