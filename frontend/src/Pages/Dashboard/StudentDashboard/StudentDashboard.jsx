import React, { useEffect, useState } from 'react'
import teachingImg from '../../Images/Teaching.svg'
import { NavLink, useParams, useNavigate } from 'react-router-dom'
import logo from '../../Images/logo.svg'

function StudentDashboard() {
  const { ID } = useParams();
  const navigator = useNavigate();
  const [data, setdata] = useState([]);
  const [error, setError] = useState(null);

  const Handlelogout = async() =>{
    const response = await fetch(`/api/student/logout`, {
      method: 'POST',
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      }
    });
    const data = await response.json();
    if(data.statusCode == 200){
      navigator('/');
    }
  }

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetch(`/api/Student/StudentDocument/${ID}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const user = await response.json();
        setdata(user.data);
      } catch (error) {
        setError(error.message)
      }
    };
    getData();
   },[]);

  return (
    <>
    {/* navbar */}
      <nav className='bg-black px-10 py-3 flex justify-between items-center'>
        <NavLink to="/">
        <div className='flex items-center gap-3'>
          <img src={logo} className="w-14" alt="" />
          <h1 className='text-3xl font-extrabold text-[#C55C5C] tracking-wide drop-shadow-lg'>KnowledgeHub</h1>
        </div>
        </NavLink>
        <div className='bg-[#A94444] text-white py-2 px-5 rounded-full cursor-pointer hover:bg-[#FF4C4C] transition-all' onClick={Handlelogout}>
          <p>logout</p>
        </div>
      </nav>

      <div className='bg-[#1E1E1E] flex justify-between items-center'>
        <div className='text-white font-semibold text-5xl ml-72'>
          <h1 className='mb-5 text-[#C55C5C]'>Welcome to <span className='text-white'>KnowledgeHub</span></h1>
          <h3 className='ml-16 text-[#C55C5C]'>{data.Firstname} {data.Lastname}</h3>
        </div>
        <div className='m-5 mr-20'>
          <img src={teachingImg} alt="teaching" width={300}/>
        </div>
      </div>

      {/* sidebar */}
      <div className='bg-[#2E2E2E] w-52 min-h-[120vh] max-h-[130vh] absolute top-20'>
        <div className='flex flex-col gap-5 text-xl items-center text-white mt-8 mb-10'>
          <img src="https://www.pngall.com/wp-content/uploads/5/Profile-Male-PNG.png" alt="profile_img" width={50} />
          <p>{data.Firstname} {data.Lastname}</p>
        </div>

        <div className='flex flex-col gap-1'>
          <NavLink to = {`/Student/Dashboard/${ID}/Search`} className={({isActive}) => isActive ? "bg-white p-3 px-[4.61rem] text-center font-semibold text-[#C55C5C]" : "p-3 text-center font-semibold text-[#C55C5C]" }> 
          Teacher
          </NavLink>

          <NavLink to = {`/Student/Dashboard/${ID}/Classes`} className={({isActive}) => isActive ? "bg-white p-3 px-[4.61rem] text-center font-semibold text-[#C55C5C]" : "p-3 text-center font-semibold text-[#C55C5C]" }> 
          Classes
          </NavLink>

          <NavLink to = {`/Student/Dashboard/${ID}/Courses`} className={({isActive}) => isActive ? "bg-white p-3 px-[4.61rem] text-center font-semibold text-[#C55C5C]" : "p-3 text-center font-semibold text-[#C55C5C]" }> 
          Courses
          </NavLink>
        </div>
      </div>
    </>
  )
}

export default StudentDashboard
