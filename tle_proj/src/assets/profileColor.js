function getRankColor(rating) {
  if (rating >= 3000) {
    return 'text-red-700'; // Legendary Grandmaster (dark red)
  } else if (rating >= 2600) {
    return 'text-red-500'; // International Grandmaster (red)
  } else if (rating >= 2400) {
    return 'text-red-300'; // Grandmaster (slightly lighter red)
  } else if (rating >= 2300) {
    return 'text-orange-600'; // International Master (orange-red)
  } else if (rating >= 2100) {
    return 'text-orange-400'; // Master (orange)
  } else if (rating >= 1900) {
    return 'text-purple-500'; // Candidate Master (purple)
  } else if (rating >= 1600) {
    return 'text-blue-700'; // Expert (blue)
  } else if (rating >= 1400) {
    return 'text-cyan-600'; // Specialist (cyan)
  } else if (rating >= 1200) {
    return 'text-green-600'; // Pupil (green)
  } else {
    return 'text-gray-500'; // Newbie (gray)
  }
}

export default getRankColor;