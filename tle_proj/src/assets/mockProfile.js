const mockProfile = {
  id: 2,
  name: "Alice Johnson",
  avatar: "https://randomuser.me/api/portraits/women/2.jpg",
  currentRating: 1850,
  maxRating: 1920,
  globalRank: 1234,
  totalContests: 78,
  contestsWon: 15,
  averageRank: 75,
  bestRank: 10,
  ratingHistory: [
    { month: "Jan", rating: 1500 },
    { month: "Feb", rating: 1550 },
    { month: "Mar", rating: 1600 },
    { month: "Apr", rating: 1650 },
    { month: "May", rating: 1700 },
    { month: "Jun", rating: 1720 },
    { month: "Jul", rating: 1750 },
    { month: "Aug", rating: 1740 },
    { month: "Sep", rating: 1760 },
    { month: "Oct", rating: 1780 },
    { month: "Nov", rating: 1800 },
    { month: "Dec", rating: 1850 },
  ],
  problems: {
    total: 297,
    difficulty: "Medium-Easy",
    longestStreak: "18 days",
    counts: {
      Easy: 140,
      Medium: 90,
      Hard: 40,
      Expert: 27
    }
  },
  activity: {
    "Mon": [3, 2, 4],
    "Tue": [0, 2, 3],
    "Wed": [1, 3, 4],
    "Thu": [4, 5, 2],
    "Fri": [2, 1, 3],
    "Sat": [5, 4, 3],
    "Sun": [2, 3, 4],
  },
  recentContests: [
    {
      name: "CodeBlitz 2024",
      date: "2024-03-10",
      rank: 45,
      score: 1250,
      status: "Accepted"
    },
    {
      name: "AlgoChallenge Spring",
      date: "2024-02-28",
      rank: 120,
      score: 1080,
      status: "Accepted"
    },
    {
      name: "Competitive Winter Cup",
      date: "2024-02-15",
      rank: 22,
      score: 1400,
      status: "Accepted"
    },
    {
      name: "Data Structures Sprint",
      date: "2024-01-20",
      rank: 78,
      score: 950,
      status: "Accepted"
    },
    {
      name: "Graph Theory Contest",
      date: "2023-12-05",
      rank: 15,
      score: 1520,
      status: "Accepted"
    }
  ]
};

export default mockProfile;
