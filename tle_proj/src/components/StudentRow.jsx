import React from 'react';
import { Eye, Trash2 } from 'lucide-react';
import getRankColor from '../assets/profileColor';
import { useNavigate } from 'react-router-dom';
const StudentRow = ({ student, onView, onDelete, lastTime }) => {

  const navigate = useNavigate();
  return (
    <tr   className="hover:bg-gray-100">
      <td className="p-2 ">
        <img src={student.avatar} alt="avatar" className="h-10 w-10 rounded-full" />
      </td>
      <td onClick={()=>navigate(`/student/${student.cf_handle}`)} className="p-2">{student.cf_name}</td>
      <td className="p-2">{student.nickname}</td>
      <td className={`p-2 text-black`}>{student.cf_handle}</td>
      <td onClick={()=>navigate(`/email/${student.cf_handle}`)} className={`p-2 text-black`}>{student.email}</td>
      <td className={`p-2 text-black`}>{student.ph_no}</td>
      <td className={`p-2 ${getRankColor(student.current_rating)} font-bold`}>{student.current_rating}</td>
      <td className={`p-2 ${getRankColor(student.max_rating)} font-bold`}>{student.max_rating}</td>
      <td className="p-2 flex gap-6">
        <button onClick={() => onView(student)}><Eye size={18} /></button>
        <button onClick={() => onDelete(student.id)}><Trash2 size={18} /></button>
      </td>
      <td className={`p-2 text-black`}>{ new Date(lastTime[student.cf_handle]).toLocaleString()}</td>

    </tr>
  );
};

export default StudentRow;

