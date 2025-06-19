import React from 'react';

const StudentDetailsModal = ({ student, onClose }) => {
  if (!student) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4">Student Details</h2>
        <p><strong>Name:</strong> {student.nickname}</p>
        <p><strong>Email:</strong> {student.email}</p>
        <p><strong>Phone:</strong> {student.ph_no}</p>
        <p><strong>Codeforces Handle:</strong> {student.cf_handle}</p>
        <p><strong>Current Rating:</strong> {student.current_rating}</p>
        <p><strong>Max Rating:</strong> {student.max_rating}</p>
        <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default StudentDetailsModal;
