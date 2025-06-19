import React, { useEffect, useState ,useContext} from "react";
import StudentRow from "./StudentRow";
import StudentDetailsModal from "./StudentDetailsModal";
import AddingStudentModal from "./AddingStudentModal";
import downloadStudentsAsCSV from "../assets/downloadAsCsv";
import LoadingScreen from "./LoadingScreen";
import UserContext from "../context/UserContext.js";
import {useNavigate } from 'react-router-dom';


const StudentList = () => {
    const navigate = useNavigate();

  const ip = `http://localhost:3000`;
  const { students,setStudents } = useContext(UserContext);

  const [lastTime, setlastTime] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [addingStudent, setAddingStudent] = useState(false);
  const [searchText,setSearchText]=useState("");
  const [loadingUsers,setLoadingUsers]=useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      const data = await fetch(`${ip}/all`);
      let rows = await data.json();
      rows = rows.users; //array
      console.log("all dta", rows);
      setStudents(rows);
      setLoadingUsers(false);
    };
    fetchUsers();

  }, [ip]);
  
  useEffect(() => {
    const fetchLastTime = async (user) => {
      const data = await fetch(`${ip}/last-updated?user=${user}`);
      let rows = await data.json();
      setlastTime(data=>({...data,[user]:rows.updated_at}))
    };
    students.forEach(student => {
      fetchLastTime(student.cf_handle);
    });

  }, [ip,students]);
  

  const handleDelete = (id) => {
    console.log("here");
    fetch(`${ip}/deleteuser/${id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => console.log("after dleting", data))
      .catch((err) => console.error(err));
    setStudents((prev) => prev.filter((s) => s.id !== id));
  };

  const handleAddButton = () => {
    setAddingStudent(true);
  };

  const handleAddStudent = async (studentInfo) => {
    try {
      const data = await fetch(
        `https://codeforces.com/api/user.info?handles=${studentInfo.cf_handle}`
      );
      let res = await data.json();
      res = res.result[0];
      console.log(res);
      const ob = {
        avatar: res.titlePhoto,
        currentRating: res.rating,
        email: studentInfo.email,
        handle: res.handle,
        maxRating: res.maxRating,
        name: (res.firstName?res.firstName:" ") + " " + (res.lastName?res.lastName:" "),
        nickname: studentInfo.nickname,
        ph_no: studentInfo.ph_no,
      };
      const resp = await fetch(`${ip}/adduser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ob),
      });
      let row = await resp.json();
      if(row.error){
        alert("handle already added")
      setAddingStudent(false);
return;
      }
      console.log("result", row.user);
      setStudents((prev) => [...prev, row.user]);
      setAddingStudent(false);
    } catch (err) {
      alert("handle not found")
      console.log(err);
    }
  };

  return (
    <div className="p-6">
      <button
              onClick={()=>navigate(`/cron`)}
              className="mb-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              Setup Cron
            </button>
      <div className=" border border-gray-200 rounded-2xl">
        
        <div className="p-4 border-b-1 border-gray-300 flex justify-between items-center mb-4 ">
          <h1 className="text-xl font-bold">Student List</h1>
          <div>
            <button
              onClick={() => downloadStudentsAsCSV(students)}
              className="px-4 py-2 mr-6 bg-gray-200 border border-gray-300 rounded hover:bg-gray-300 hover:border-gray-400"
            >
              DOWNLOAD CSV
            </button>
            <button
              onClick={handleAddButton}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              + Add Student
            </button>
          </div>
        </div>
        <div className="flex justify-between items-center mb-4">
          <input
          value={searchText}
          onChange={(e)=>setSearchText(e.target.value)}
            type="text"
            placeholder="Search students..."
            className="p-2 mx-4 rounded-xl border border-gray-300 w-full max-w-md"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full rounded">
            <thead className="text-gray-500 text-left">
              <tr className="border-gray-300">
                <th className="p-2">Avatar</th>
                <th className="p-2">Name</th>
                <th className="p-2">Nickname</th>
                <th className="p-2">Codeforces Handle</th>
                <th className="p-2">Email</th>
                <th className="p-2">Phone number</th>
                <th className="p-2">Current Rating</th>
                <th className="p-2">Max Rating</th>
                <th className="p-2">Actions</th>
                <th className="p-2">Updated</th>
              </tr>
            </thead>
            <tbody>

              {/* this section handles search */}

              {searchText.length?
              students.filter((s)=>(String(s.cf_name).toLowerCase()).includes(searchText.toLowerCase()) || (String(s.nickname).toLowerCase()).includes(searchText.toLowerCase()) || (String(s.cf_handle).toLowerCase()).includes(searchText.toLowerCase())).map((student) => (
                <StudentRow
                  key={student.id}
                  student={student}
                  onView={setSelectedStudent}
                  onDelete={handleDelete}
                  lastTime={lastTime}
                />
              ))
              :
              students.map((student) => (
                <StudentRow
                  key={student.id}
                  student={student}
                  onView={setSelectedStudent}
                  onDelete={handleDelete}
                  lastTime={lastTime}
                />
              ))}

              {/* section ends */}

            </tbody>
          </table>
        </div>
        <StudentDetailsModal
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
        />
        {addingStudent && (
          <AddingStudentModal
            onClose={() => setAddingStudent(false)}
            onSave={handleAddStudent}
          />
        )}
        
        {loadingUsers && <LoadingScreen />}

      </div>
    </div>
  );
};

export default StudentList;
