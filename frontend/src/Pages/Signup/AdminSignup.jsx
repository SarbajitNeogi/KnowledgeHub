import React, { useState } from "react";
//import "./Login.css";
import Admin from "../Components/Admin/Admin";
import { useNavigate } from "react-router-dom";
import Header from '../Home/Header/Header';

export default function AdminSignup() {
  const [User, setUser] = useState("");
  const [Password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [err, setErr] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!User.trim()) newErrors.User = "User Name is required";
    if (!Password.trim()) newErrors.password = "Password is required";
    if (Password.length < 6) newErrors.password = "Password must be at least 6 characters";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const data = { username: User, password: Password };

    try {
      const response = await fetch(`/api/admin/signup`, {
        method: 'POST',
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();
      setErr(responseData.message);

      if (response.ok) {
        navigate('/adminLogin');
      } else {
        setErrors({ general: responseData.message || "Signup failed" });
      }
    } catch (error) {
      setErrors({ general: "An unexpected error occurred" });
    }
  };

  return (
    <>
      <Header />
      <section className="main">
        <div className="img-3">
          <img src={Admin} width={500} alt="" />
        </div>
        <div className="container py-5">
          <div className="para1">
            <h2> CREATE ADMIN ACCOUNT</h2>
          </div>
          <div className="para">
            <h5> Fill in the details to register.</h5>
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
                {errors.User && <div className="error-message">{errors.User}</div>}
              </div>
              <div className="input-2">
                <input
                  type="password"
                  placeholder="Password"
                  className="input-0"
                  value={Password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {errors.password && <div className="error-message">{errors.password}</div>}
              </div>
              <div className="btns">
                <button type="submit" className="btns-1">
                  Sign Up
                </button>
              </div>
              {errors.general && <div className="error-message">{errors.general}</div>}
              {err && <div className="error-message">{err}</div>}
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
