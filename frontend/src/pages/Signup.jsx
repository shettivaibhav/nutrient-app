import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { axiosInstance } from "../lib/axios";
import { useNavigate,Link } from "react-router-dom";


const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    age: "",
    gender: "",
    weight: "",
    height: "",
    goal: "maintain",
    activity: "moderate",
  });

  const navigate = useNavigate();
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const res = await axiosInstance.post("/signup", formData);
      alert(res.data.message);
      navigate("/login");
    } catch (error) {
      console.error(error);
      alert("Error connecting to server!");
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100" style={{ backgroundColor: "#ffffff" }}>
      <div className="card p-4 shadow" style={{ width: "450px", border: "2px solid #28a745", borderRadius: "15px" }}>
        <h3 className="text-center mb-4" style={{ color: "#ff9800" }}>Signup</h3>
        <form onSubmit={handleSubmit}>
          <input type="text" name="name" className="form-control mb-2" placeholder="Full Name" onChange={handleChange} required />
          <input type="email" name="email" className="form-control mb-2" placeholder="Email" onChange={handleChange} required />
          <input type="password" name="password" className="form-control mb-2" placeholder="Password" onChange={handleChange} required />
          <input type="password" name="confirmPassword" className="form-control mb-2" placeholder="Confirm Password" onChange={handleChange} required />
          <input type="number" name="age" className="form-control mb-2" placeholder="Age" onChange={handleChange} required />
          <select name="gender" className="form-control mb-2" onChange={handleChange} required>
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          <input type="number" name="weight" className="form-control mb-2" placeholder="Weight (kg)" onChange={handleChange} required />
          <input type="number" name="height" className="form-control mb-2" placeholder="Height (cm)" onChange={handleChange} required />
          <select name="goal" className="form-control mb-2" onChange={handleChange}>
            <option value="maintain">Maintain Weight</option>
            <option value="lose">Lose Weight</option>
            <option value="gain">Gain Weight</option>
          </select>
          <select name="activity" className="form-control mb-3" onChange={handleChange}>
            <option value="sedentary">Sedentary</option>
            <option value="light">Lightly Active</option>
            <option value="moderate">Moderately Active</option>
            <option value="active">Active</option>
            <option value="veryActive">Very Active</option>
          </select>
          <button type="submit" className="btn w-100" style={{ backgroundColor: "#28a745", color: "#fff" }}>Sign Up</button>
          <div className="text-center">
            <Link  to="/login">Go to Login Page</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
