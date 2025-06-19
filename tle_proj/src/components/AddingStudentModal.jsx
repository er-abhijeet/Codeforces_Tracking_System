import React, { useState } from 'react';

const AddingStudentModal = ({ onClose , onSave}) => {
    const [studentInfo,setStudentInfo]=useState({cf_handle:"",nickname:"",ph_no:"",email:""});
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4">Add Student</h2>
        <p className='my-6'><strong className='mr-6'>Codeforces Handle:</strong> <input className='border rounded-l p-2' type="text" value={studentInfo.cf_handle} onChange={(e)=>{setStudentInfo((prev)=>({...prev,cf_handle:e.target.value}))}}/></p>
        <p className='my-6'><strong className='mr-6'>NickName:</strong> <input className='border rounded-l p-2' type="text" value={studentInfo.nickname} onChange={(e)=>{setStudentInfo((prev)=>({...prev,nickname:e.target.value}))}}/></p>
        <p className='my-6'><strong className='mr-6'>Phone No.:</strong> <input className='border rounded-l p-2' type="number" value={studentInfo.ph_no} onChange={(e)=>{setStudentInfo((prev)=>({...prev,ph_no:e.target.value}))}}/></p>
        <p className='my-6'><strong className='mr-6'>Email:</strong> <input className='border rounded-l p-2' type="email" value={studentInfo.email} onChange={(e)=>{setStudentInfo((prev)=>({...prev,email:e.target.value}))}}/></p>
        <button className="mt-4 bg-gray-300 text-white px-4 py-2 rounded mr-6" onClick={onClose}>Close</button>
        {/* <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded mr-6" onClick={()=>onSave(studentInfo)}>Save</button> */}
        <button
  className="mt-4 bg-blue-500 text-white px-4 py-2 rounded mr-6"
  onClick={() => {
    // Basic validation before calling onSave
    if (!studentInfo.cf_handle.trim()) {
      alert("Codeforces handle is required.");
      return;
    }
    if (!studentInfo.nickname.trim()) {
      alert("Nickname is required.");
      return;
    }
    if (!studentInfo.ph_no.trim() || studentInfo.ph_no.length < 10) {
      alert("Enter a valid phone number.");
      return;
    }
    if (!studentInfo.email.trim() || !/^[\w.-]+@[\w.-]+\.\w+$/.test(studentInfo.email)) {
      alert("Enter a valid email.");
      return;
    }

    onSave(studentInfo); // Only called if all checks pass
  }}
>
  Save
</button>

      </div>
    </div>
  );
};

export default AddingStudentModal;
