export default function downloadStudentsAsCSV(students) {
  if (!students || students.length === 0) {
    alert("No student data to download.");
    return;
  }

  // Extract the headers
  const headers = Object.keys(students[0]);

  // Convert each student object to a CSV row
  const rows = students.map(student =>
    headers.map(header => {
      const cell = student[header];
      // Escape double quotes by doubling them, and wrap in quotes
      return `"${String(cell).replace(/"/g, '""')}"`
    }).join(',')
  );

  // Combine headers and rows
  const csvContent = [headers.join(','), ...rows].join('\n');

  // Create a Blob and a download link
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "students.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
