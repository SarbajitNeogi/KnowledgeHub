import React, { useState } from 'react'
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import Radiobtn from '../Components/RadioBtn/Radiobtn';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const Forgetpassword = () => {
  const [userType, setUserType] = useState('');
  const [data, setData] = useState({ email: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value
    });
  };

  const onFormSubmit = async (e) => {
    e.preventDefault();

    if (!data.email) {
      toast.error('Email is required');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      toast.error('Please provide a valid email');
      return;
    }

    try {
      const response = await axios.post(`/api/${userType}/forgetpassword`, { Email: data.email });
      console.log(response.data);
      toast.success('Email sent successfully');
    } catch (error) {

      toast.error('An error occurred while sending the email');
    }
  };

  console.log(userType);

  return (
    <section className='h-[100vh] flex items-center justify-center'>
      <form noValidate className='w-96 p-10 flex flex-col justify-center gap-4 text-white shadow-[0_0_10px_white] bg-[#yourColor] rounded-lg' onSubmit={onFormSubmit}>

        <h1 className='text-2xl font-bold text-white'>Forgot Your Password?</h1>
        <p className='text-lg text-white'>Enter your email address below to reset your password.</p>
        <label htmlFor='email' className='text-2xl text-white font-semibold rounded-md'>Email Address</label>
        <input
          type="email"
          name="email"
          id="email"
          placeholder="Enter your email"
          value={data.email}
          onChange={handleChange}
          className='bg-transparent border-2 border-white py-3 px-4 focus:outline-none focus:border-yellow-500 rounded-lg'
        />
        <div className='radio-btn'>
          <Radiobtn userType={userType} setUserType={setUserType} />
        </div>
        <div className='flex flex-row items-center justify-between mt-4'>
          <button
            type="submit"
            className="bg-gradient-to-r from-[#A94444] to-[#3E3B3A] text-white py-3 px-6 font-bold uppercase rounded-lg cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg hover:from-[#FF4C4C] hover:to-[#3E3B3A] border-none outline-none">
            Send
          </button>

          <p className='text-xl text-yellow-500 flex items-center' onClick={() => navigate(-1)}>
            <IoArrowBack className='text-xl text-semibold' /> Go back
          </p>
        </div>
      </form>
    </section>
  );
};

export default Forgetpassword;
