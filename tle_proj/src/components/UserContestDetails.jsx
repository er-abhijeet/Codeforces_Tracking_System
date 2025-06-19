import React, { useState, useEffect } from 'react';
import { getUnsolvedProblemsPerContest } from '../utils/codeforcesApi';

const UserContestDetails = ({ handle }) => {
  const [contestDetails, setContestDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
//   console.log(handle);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const details = await getUnsolvedProblemsPerContest(handle);
        setContestDetails(details);
      } catch (err) {
        setError("Failed to fetch contest details.",err);
      } finally {
        setLoading(false);
      }
    };

    if (handle) {
      fetchData();
    }
  }, [handle]);

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Contest Participation for {handle}</h2>
      {contestDetails.length === 0 ? (
        <p>No contest participation found.</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="p-2 border-b text-left">Contest Name</th>
              <th className="p-2 border-b text-left">Contest ID</th>
              <th className="p-2 border-b text-left">Participated At</th>
              <th className="p-2 border-b text-left">Total Problems</th>
              <th className="p-2 border-b text-left">Solved</th>
              <th className="p-2 border-b text-left">Unsolved</th>
            </tr>
          </thead>
          <tbody>
            {contestDetails.map((contest, index) => (
              <tr key={index}>
                <td className="p-2 border-b">{contest.contestName}</td>
                <td className="p-2 border-b">{contest.contestId}</td>
                <td className="p-2 border-b">{new Date(contest.participatedAt).toLocaleDateString()}</td>
                <td className="p-2 border-b">{contest.totalProblems}</td>
                <td className="p-2 border-b">{contest.solvedProblems}</td>
                <td className="p-2 border-b">{contest.unsolvedProblems}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserContestDetails;