import React, { useEffect, useState } from "react";
import "./Search.css";
import { useParams } from "react-router-dom";
import Success from "./Success";

function Search() {
  const [data, setData] = useState("");
  const [course, setCourse] = useState([]);
  const [courseID, setCourseID] = useState([]);
  const [popup, setPopup] = useState(false);
  const [idArray, setIdArray] = useState([]);
  const { ID } = useParams();
  const [openTM, setOpenTM] = useState(false);
  const [Tdec, setTeacherDetails] = useState(null);
  const [tname, setTname] = useState({});

  const daysName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  const closePopup = () => {
    setPopup(false);
    window.location.reload();
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetch(`/api/course/student/${ID}/enrolled`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const user = await response.json();
        setCourseID(user.data);
        setIdArray(prevIdArray => [...prevIdArray, ...user.data.map(res => res._id)]);
      } catch (error) {
        console.log(error.message);
      }
    };
    getData();
  }, []);

  const SearchTeacher = async (sub) => {
    const subject = sub.toLowerCase();
    const Data = await fetch(`/api/course/${subject}`);
    const response = await Data.json();
    if (response.statusCode === 200) {
      setCourse(response.data);
    }
    setData("");
  };

  const handleEnroll = async (courseName, id) => {
    try {
      const check = await fetch(`/api/course/${courseName}/${id}/verify/student/${ID}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!check.ok) throw new Error(`Verification failed: ${check.statusText}`);

      let res = await check.json();
      if (res.statusCode !== 200) {
        alert(res.message);
        return;
      }

      let enrollResponse = await fetch(`/api/course/${courseName}/${id}/add/student/${ID}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!enrollResponse.ok) throw new Error("Enrollment failed");

      let enrollRes = await enrollResponse.json();
      console.log(enrollRes);
      setPopup(true);
    } catch (error) {
      console.error("Error in handleEnroll:", error.message);
    }
  };

  return (
    <>
      <div className="search mb-4">
        <input
          type="text"
          placeholder="Ex: Math ..."
          value={data}
          onChange={(e) => setData(e.target.value)}
        />
        <button className="w-32" onClick={() => SearchTeacher(data)}>
          Find Teacher
        </button>
      </div>
      <div className="overflow-auto">
        {course.map((Data) => (
          <div key={Data._id} className="relative bg-blue-600 p-4 gap-6 mb-3 flex rounded-sm max-w-4xl h-20 items-start">
            <div className="h-fit font-bold text-blue-900">{Data.coursename.toUpperCase()}</div>
            <div className="text-gray-300 cursor-pointer font-bold">
              {Data.enrolledteacher.Firstname} {Data.enrolledteacher.Lastname}
            </div>
            <div className="text-gray-900">
              <span className="text-black">Desc :</span> {Data.description}
            </div>
            <div>{Data.enrolledStudent.length}/20</div>
            {idArray.includes(Data._id) ? (
              <div className="text-white bg-green-900 py-2 px-3 absolute right-4 cursor-not-allowed">
                Already Enrolled
              </div>
            ) : Data.enrolledStudent.length < 20 ? (
              <div onClick={() => handleEnroll(Data.coursename, Data._id)} className="text-white bg-blue-900 py-2 px-3 absolute right-4 cursor-pointer">
                Enroll Now
              </div>
            ) : (
              <div className="text-white bg-red-900 py-2 px-3 absolute right-4 cursor-not-allowed">
                Already Full
              </div>
            )}
          </div>
        ))}
      </div>
      {popup && <Success onClose={closePopup} />}
    </>
  );
}

export default Search;
