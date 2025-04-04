import React, { useState } from "react";
import "./Login.css";
import Admin from './Images/Admin.svg'
import {  useNavigate } from "react-router-dom";
import Header from '../Home/Header/Header';

export default function AdminLogin() {
  // State to hold user input and errors
  const [User, setUser] = useState("");
  const [Password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [err, setErr] = useState('');

  const navigate = useNavigate()

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation
    const newErrors = {};
    if (!User.trim()) newErrors.User = "User Name is required";
    if (!Password.trim()) newErrors.password = "Password is required";

    if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
    }

    // Prepare data object to send to the backend
    const data = { username: User, password: Password };

    try {
        // Send data to backend
        const response = await fetch(`/api/admin/login`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        const responseData = await response.json();
        setErr(responseData.message);

        // Handle response
        if (response.ok) {
            console.log("Login Success:", responseData);
            localStorage.setItem("AccessToken", responseData.data.AccessToken);

            // ✅ Store the token in localStorage
            if (responseData.data && responseData.data.AccessToken) {
                localStorage.setItem("AccessToken", responseData.data.AccessToken);
            } else {
                console.warn("AccessToken not found in response!");
            }

            // ✅ Redirect to the admin page
            navigate(`/admin/${responseData.data.admin._id}`);
        } else {
            setErrors({ general: responseData.message || "Login failed" });
        }
    } catch (error) {
        setErrors({ general: error.message || "An unexpected error occurred" });
    }
};


  return (
    <>
    <Header/>
    <section className="main">
      {/* image */}
      <div className="img-3">
        <img src={Admin} width={500} alt="" />
      </div>
      <div className="container py-5">
        <div className="para1">
          <h2> WELCOME BACK!</h2>
        </div>

        <div className="para">
          <h5> Please Log Into Your Account.</h5>
        </div>

        <div className="form">
          <form onSubmit={handleSubmit}>
            <div className="input-1">
              <input
                type="text"
                placeholder="User name"
                className="input-0"
                value={User}
                onChange={(e) => setUser(e.target.value)}
              />
              {errors.User && (
                <div className="error-message">{errors.User}</div>
              )}
            </div>
            <div className="input-2">
              <input
                type="password"
                placeholder="Password"
                className="input-0"
                value={Password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {errors.password && (
                <div className="error-message">{errors.password}</div>
              )}
            </div>

            {/* btns */}
            <div className="btns">
              <button type="submit" className="btns-1">
                Log In
              </button>
            </div>
            {errors.general && (
              <div className="error-message">{errors.general}</div>
            )}
            {err && (
              <div className="error-message">{err}</div>
            )}
          </form>
        </div>
      </div>
    </section>
    </>
  );
}
