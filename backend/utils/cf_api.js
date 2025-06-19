const BASE_URL = "https://codeforces.com/api";

// Fetch user contest history
async function fetchUserContests(handle) {
  try {
    const response = await fetch(`${BASE_URL}/user.rating?handle=${handle}`);
    const data = await response.json();
    if (data.status !== "OK") {
      throw new Error(data.comment || "Failed to fetch user contests");
    }
    return data.result; // Array of RatingChange objects
  } catch (error) {
    console.error("Error fetching user contests:", error);
    return [];
  }
}

// Fetch contest problems
async function fetchContestProblems(contestId) {
  try {
    const response = await fetch(`${BASE_URL}/contest.standings?contestId=${contestId}&showUnofficial=false`);
    const data = await response.json();
    if (data.status !== "OK") {
      throw new Error(data.comment || "Failed to fetch contest problems");
    }
    return data.result.problems; // Array of Problem objects
  } catch (error) {
    console.error(`Error fetching problems for contest ${contestId}:`, error);
    return [];
  }
}

// Fetch user submissions
async function fetchUserSubmissions(handle) {
  try {
    const response = await fetch(`${BASE_URL}/user.status?handle=${handle}&from=1&count=10000`);
    const data = await response.json();
    if (data.status !== "OK") {
      throw new Error(data.comment || "Failed to fetch user submissions");
    }
    return data.result; // Array of Submission objects
  } catch (error) {
    console.error("Error fetching user submissions:", error);
    return [];
  }
}

// Calculate unsolved problems per contest
async function getUnsolvedProblemsPerContest(handle) {
  // Step 1: Get contests participated by the user
  const contests = await fetchUserContests(handle);
  if (!contests.length) return [];

  // Step 2: Get all submissions by the user
  const submissions = await fetchUserSubmissions(handle);

  // Step 3: Process each contest
  const contestDetails = [];
  for (const contest of contests) {
    const {
      contestId,
      contestName,
      oldRating,
      newRating,
      rank,
      ratingUpdateTimeSeconds
    } = contest;

    // Get problems for this contest
    const problems = await fetchContestProblems(contestId);
    if (!problems.length) continue;

    // Identify solved problems
    const solvedProblems = new Set();
    submissions.forEach(submission => {
      const problem = submission.problem;
      if (
        problem.contestId === contestId &&
        submission.verdict === "OK"
      ) {
        solvedProblems.add(problem.index);
      }
    });

    // Calculate unsolved problems
    const totalProblems = problems.length;
    const solvedCount = solvedProblems.size;
    const unsolvedCount = totalProblems - solvedCount;

    contestDetails.push({
      contestId,
      contestName,
      totalProblems,
      solvedProblems: solvedCount,
      unsolvedProblems: unsolvedCount,
      oldRating,
      newRating,
      rank,
      participatedAt: new Date(ratingUpdateTimeSeconds * 1000).toISOString(),
    });
  }

  return contestDetails;
}


export { fetchUserContests, fetchContestProblems, fetchUserSubmissions, getUnsolvedProblemsPerContest };