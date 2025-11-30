import React, { useState } from "react";
import { axiosInstance } from "../lib/axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Login handler
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.post("/login", {
        email,
        password,
      });
      console.log("Login response:", response.data);

      if (response.data.success) {
        // ✅ Store JWT token in sessionStorage
        sessionStorage.setItem("token", response.data.token);

        alert(response.data.message);
        navigate("/home"); // redirect to main/home page
      } else {
        alert(response.data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Login failed");
    }
  };

  // Reset password handler
  const handleResetPassword = async () => {
    if (!email) {
      alert("Please enter your email to reset password!");
      return;
    }

    try {
      const res = await axiosInstance.post("/reset-password", { email });
      alert(res.data.message);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Error sending reset email!");
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100" style={{ backgroundColor: "#ffffff" }}>
      <div className="card p-4 shadow" style={{ width: "400px", border: "2px solid #28a745", borderRadius: "15px" }}>
        <h3 className="text-center mb-4" style={{ color: "#ff9800" }}>Login</h3>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            name="email"
            className="form-control mb-2"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            name="password"
            className="form-control mb-3"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="btn w-100 mb-2" style={{ backgroundColor: "#28a745", color: "#fff" }}>
            Login
          </button>
        </form>
        <button
          className="btn btn-link w-100"
          style={{ color: "#ff9800" }}
          onClick={handleResetPassword}
        >
          Forgot Password? Reset Here
        </button>
        <div className="text-center">
          <Link to="/" className="btn btn-link">Go to Signup Page</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
