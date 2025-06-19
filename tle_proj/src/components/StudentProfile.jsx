import React from "react";
// import mockProfile from "../assets/mockProfile";
import RatingHistoryChart from "./RatingHistoryChart";
import ProblemsByDifficultyChart from "./ProblemsByDifficultyChart";
import ActivityHeatmap from "./ActivityHeatmap";
import RecentContestsTable from "./RecentContestsTable";
import getRankColor from "../assets/profileColor";
// import { useState } from "react";
import RatingProgressChart from "./RatingProgressChart";
import { useParams } from 'react-router-dom';
import ContestHistoryPage from "./ContestHistoryPage";
import ProblemSolvingData from "./ProblemSolvingData";
import UserContext from "../context/UserContext";
// import { useContext } from "react";
import { useState ,useEffect} from "react";
import LoadingScreen from "./LoadingScreen";

const StudentProfile = () => {
  const [students,setStudents]=useState([]);
  const ip = `http://localhost:3000`;

  useEffect(() => {
      const fetchUsers = async () => {
        const data = await fetch(`${ip}/all`);
        let rows = await data.json();
        rows = rows.users; //array
        console.log("all dta", rows);
        setStudents(rows);
        // setLoadingUsers(false);
      };
      fetchUsers();
  
    }, [ip]);

  const {user}=useParams();
    const p = students.find(s => s.cf_handle == user);
    if(!p)return <LoadingScreen />
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4 border border-gray-200 rounded-2xl p-4">
        <img src={p.avatar} alt="avatar" className="w-16 h-16 rounded-full" />
        <div>
          <h1 className="text-xl font-semibold">{p.cf_name}</h1>
          <p className="font-bold text-sm text-gray-500">
            Current Rating:{" "}
            <span className={getRankColor(p.current_rating)}>
              {p.current_rating}
            </span>{" "}
            / Max Rating:{" "}
            <span className={getRankColor(p.max_rating)}>{p.max_rating}</span>
          </p>
        </div>
        {/* <div className="ml-auto flex gap-10">
          <div>
            <p className="text-gray-500 text-sm">Global Rank</p>
            <p className="text-lg font-semibold">{p.globalRank}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Total Contests</p>
            <p className="text-lg font-semibold">{p.totalContests}</p>
          </div>
        </div> */}
      </div>

      <div className="flex gap-4 min-h-lvh">
        <ContestHistoryPage user={user} p={p} />
        <div className="flex-1 border border-gray-300 p-4 rounded-xl">
          <ProblemSolvingData handle={user}/>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
