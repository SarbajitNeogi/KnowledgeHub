import React, { useState, useEffect } from "react";
import { IoIosNotificationsOutline } from "react-icons/io";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import logo from '../../Images/logo.svg'
import Course from "./Course";
import axios from "axios";

const Admin = () => {
  const { data } = useParams();
  const navigator = useNavigate();

  const [StudentData, setStudentData] = useState([]);
  const [TeacherData, setTeacherData] = useState([]);
  const [adminID, setAdminID] = useState(data);
  const [error, setErrors] = useState("");
  const [allmsg, setAllMsg] = useState(null);
  const [open, setOpen] = useState(false);

  const token = localStorage.getItem("AccessToken");
  useEffect(() => {
    const getAllMsg = async () => {
      console.log(token) // Or from cookies
      try {
        const response = await fetch(`/api/admin/messages/all`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`, // Ensure token is included
          },
        });

        const data = await response.json();
        console.log("API Response:", data); // Debug response

        if (data?.statusCode === 200) {
          setAllMsg(data.data);  // Set the data if it's available
        } else {
          console.log("No data found in response.");
        }
      } catch (err) {
        console.log("Error fetching messages:", err.message);
      }
    };
    getAllMsg();
  }, []);

  // Approve function for students and teachers
  const Approval = async (adminID, ID, type, approve) => {
    try {
        if (!adminID) {
            throw new Error("Admin ID is required");
        }

        const token = localStorage.getItem("Accesstoken"); // Get token
        if (!token) {
            throw new Error("Unauthorized request: No token found");
        }

        const data = {
            Isapproved: approve
        };

        const response = await fetch(`/api/admin/${adminID}/approve/${type}/${ID}`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` // Add authorization header
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`Error approving request: ${response.statusText}`);
        }

        const result = await response.json();
        console.log("Approval Response:", result);

        // Update UI if approval is successful
        if (type === "student") {
            setStudentData(prev => prev.filter((student) => student._id !== ID));
        } else if (type === "teacher") {
            setTeacherData(prev => prev.filter((teacher) => teacher._id !== ID));
        }
    } catch (error) {
        console.error("Approval Error:", error.message);
        if (typeof setErrors === "function") {
            setErrors(error.message);
        }
    }
};


  // Document details function
  const docDetails = async (type, ID) => {
    navigator(`/VarifyDoc/${type}/${adminID}/${ID}`);
  };

  // Fetch initial data for student and teacher approval
  useEffect(() => {
    const getData = async () => {
        try {
            const token = localStorage.getItem("AccessToken");
            console.log(token) // ✅ Retrieve token from localStorage

            if (!token) {
                console.error("No access token found!");
                return;
            }

            const response = await fetch(`/api/admin/${adminID}/approve`, {
                method: "POST",
                credentials: "include", // ✅ Ensures cookies are sent
                headers: {
                  "Authorization": `Bearer ${token}` ,// ✅ Attach the token
                    "Content-Type": "application/json"
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch data: ${response.status}`);
            }

            const result = await response.json();
            setStudentData(result.data.studentsforApproval || []);
            setTeacherData(result.data.teachersforApproval || []);

            console.log("Fetched Student Data:", result.data);
            console.log("Fetched Teacher Data:", result.data.teachersforApproval);
        } catch (err) {
            console.error("Error fetching data:", err.message);
        }
    };

    if (adminID) {
        getData();
    } else {
        console.warn("Admin ID is missing, skipping fetch");
    }
}, [adminID]); // ✅ Runs when adminID changes



  return (
    <div className="h-[100vh]">
      {/* Navbar */}
      <nav className="h-16 sm:h-20 md:h-24 lg:h-24 w-full bg-[#042439] flex justify-between items-center px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20">
        <NavLink to='/'>
          <div className="flex items-center gap-4">
            <img
              src={logo}
              alt="logo"
              className="w-14 sm:h-12 md:h-14 lg:h-16 xl:h-18"
            />
            <h1 className="text-2xl text-[#4E84C1] font-bold">
              KnowledgeHub
            </h1>
          </div>
        </NavLink>
        <div className="flex items-center">
          <div className="relative mr-4">
            <IoIosNotificationsOutline className="h-8 w-8 text-white" />
            <span className="absolute top-1 right-1 h-3 w-3 bg-red-500 rounded-full"></span>
          </div>
          <button onClick={() => navigator('/')} className="bg-blue-500 text-white px-4 py-2 rounded-md">
            Logout
          </button>
        </div>
      </nav>

      {/* Main Section */}
      <div className="p-4 sm:p-8 md:p-12 lg:p-10">
      <h1 className="text-3xl font-semibold border-b-2 border-white pb-2 text-white">All New Requests</h1>
      <div className="flex gap-6 mt-6 justify-end">
        <div onClick={() => setOpen(prev => !prev)} className="cursor-pointer bg-green-800 hover:bg-green-700 transition p-4 w-36 text-center rounded-md">
          Messages
        </div>
        <div onClick={() => navigator(`/admin/course/${data}`)} className="cursor-pointer bg-blue-800 hover:bg-blue-700 transition p-4 w-48 text-center rounded-md">
          Course Requests
        </div>
      </div>
      {open && (
        <div className="mt-6 w-full sm:w-[30rem] bg-gray-800 p-5 rounded-md shadow-md">
          {allmsg.length > 0 ? (
            allmsg.map((msg, index) => (
              <div key={index} className="bg-gray-700 mb-4 p-4 rounded-md">
                <p className="text-gray-300 font-semibold">Name: <span className="text-white">{msg.name}</span></p>
                <p className="text-light-blue-500 font-semibold">Email: <span className="text-white">{msg.email}</span></p>
                <p className="text-gray-300">Message: <span className="text-white">{msg.message}</span></p>
              </div>
            ))
          ) : (
            <p className="text-gray-400">No messages available</p>
          )}
        </div>
      )}
    </div>

    <div className="flex flex-col md:flex-row justify-center gap-16 p-10">
      <div className="w-full md:w-1/2">
        <h4 className="text-white bg-gray-900 p-4 text-center rounded-md">Student Requests</h4>
        {StudentData.length > 0 ? (
          StudentData.map((student) => student.Isapproved === "pending" && (
            <div key={student._id} onClick={() => docDetails("student", student._id)} className="mt-6 p-6 bg-gray-800 hover:bg-gray-700 transition rounded-md shadow-md cursor-pointer flex flex-col gap-4">
              <h1 className="text-xl font-semibold text-white">{student.Firstname} {student.Lastname}</h1>
              <p className="text-sm text-gray-300">Status: <span>{student.Isapproved}</span></p>
              <div className="flex gap-4">
                <button onClick={() => Approval(student._id, "student", "approved")} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md w-full">Approve</button>
                <button onClick={() => Approval(student._id, "student", "rejected")} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md w-full">Reject</button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-center mt-4">No pending student requests</p>
        )}
      </div>

      <div className="w-full md:w-1/2">
        <h4 className="text-white bg-gray-900 p-4 text-center rounded-md">Teacher Requests</h4>
        {TeacherData.length > 0 ? (
          TeacherData.map((teacher) => teacher.Isapproved === "pending" && (
            <div key={teacher._id} onClick={() => docDetails("teacher", teacher._id)} className="mt-6 p-6 bg-gray-800 hover:bg-gray-700 transition rounded-md shadow-md cursor-pointer flex flex-col gap-4">
              <h1 className="text-xl font-semibold text-white">{teacher.Firstname} {teacher.Lastname}</h1>
              <p className="text-sm text-gray-300">Status: <span>{teacher.Isapproved}</span></p>
              <div className="flex gap-4">
                <button onClick={() => Approval(teacher._id, "teacher", "approved")} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md w-full">Approve</button>
                <button onClick={() => Approval(teacher._id, "teacher", "rejected")} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md w-full">Reject</button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-center mt-4">No pending teacher requests</p>
        )}
      </div>
    </div>
  </div>
  );
};

export default Admin;