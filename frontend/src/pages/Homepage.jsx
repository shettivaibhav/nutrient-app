// src/pages/HomePage.jsx
import React, { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";
import NutrientSummary from "../components/NutrientSummary";
import FoodSearch from "../components/FoodSearch";
import MyMealList from "../components/MyMealList";
import "bootstrap/dist/css/bootstrap.min.css";

const HomePage = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("options");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = sessionStorage.getItem("token");
        if (!token) {
          console.error("No token found in sessionStorage");
          return;
        }

        const res = await axiosInstance.get("/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        console.error(err.response?.data || err.message);
      }
    };
    fetchUser();
  }, []);

  if (!user)
    return (
      <div className="d-flex vh-100 justify-content-center align-items-center bg-light">
        <div className="spinner-border text-primary" role="status"></div>
        <span className="ms-2 text-muted">Loading user...</span>
      </div>
    );

  return (
    <div className="container-fluid min-vh-100 bg-light py-5">
      {/* Header */}
      <div className="text-center mb-5">
        <h2 className="fw-bold text-primary">
          👋 Hi {user.name?.charAt(0).toUpperCase() + user.name?.slice(1)}
        </h2>
        <p className="text-muted fs-5">
          Welcome back! Here’s your daily nutrition summary.
        </p>
      </div>

      {/* Centered Nutrient Summary */}
      <div className="d-flex justify-content-center mb-5">
        <div className="col-12 col-md-8 col-lg-6">
          <div className="card shadow-lg p-4 border-0 rounded-4 bg-white">
            <NutrientSummary nutrients={user.nutrients} />
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="container">
        <ul className="nav nav-tabs justify-content-center mb-4">
          <li className="nav-item">
            <button
              className={`nav-link fs-5 ${
                activeTab === "options" ? "active fw-semibold" : ""
              }`}
              onClick={() => setActiveTab("options")}
            >
              🍽️ Meal Options
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link fs-5 ${
                activeTab === "mymeal" ? "active fw-semibold" : ""
              }`}
              onClick={() => setActiveTab("mymeal")}
            >
              🧾 My Meals
            </button>
          </li>
        </ul>

        <div className="card shadow-sm p-4 border-0 bg-white rounded-4">
          {activeTab === "options" ? (
            <FoodSearch userId={user._id} />
          ) : (
            <MyMealList userId={user._id} />
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
