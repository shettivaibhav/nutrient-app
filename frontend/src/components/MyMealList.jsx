import React, { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";
import "bootstrap/dist/css/bootstrap.min.css";

const MyMealList = () => {
  const [meals, setMeals] = useState([]);
  const [totals, setTotals] = useState({
    protein: 0,
    carbs: 0,
    fats: 0,
    calories: 0,
  });

  const token = sessionStorage.getItem("token");

  const fetchMeals = async () => {
    try {
      const res = await axiosInstance.get("/meals", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMeals(res.data);

      // Calculate totals with qty
      const newTotals = res.data.reduce(
        (acc, meal) => {
          const qty = meal.qty || 1;
          acc.protein += (meal.protein || 0) * qty;
          acc.carbs += (meal.carbs || 0) * qty;
          acc.fats += (meal.fats || 0) * qty;
          acc.calories += (meal.calories || 0) * qty;
          return acc;
        },
        { protein: 0, carbs: 0, fats: 0, calories: 0 }
      );
      setTotals(newTotals);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (mealId) => {
    try {
      await axiosInstance.delete(`/meals/${mealId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchMeals();
    } catch (err) {
      console.error(err);
    }
  };

  const handleQtyChange = async (mealId, delta) => {
    try {
      const meal = meals.find((m) => m._id === mealId);
      if (!meal) return;

      const newQty = meal.qty + delta;
      if (newQty < 1) return;

      await axiosInstance.patch(
        `/meals/${mealId}`,
        { qty: newQty },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchMeals();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (token) fetchMeals();
  }, [token]);

  return (
    <div className="container-fluid px-3">
      <div className="card shadow-sm border-0 rounded-4">
        <div className="card-body">
          <h3 className="card-title text-primary fw-bold mb-3">🧾 My Meals</h3>

          {meals.length === 0 ? (
            <div className="alert alert-info text-center" role="alert">
              No meals added yet.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Meal</th>
                    <th>Protein (g)</th>
                    <th>Carbs (g)</th>
                    <th>Fats (g)</th>
                    <th>Calories</th>
                    <th>Qty</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {meals.map((m) => (
                    <tr key={m._id}>
                      <td className="fw-semibold">{m.foodName}</td>
                      <td>{(m.protein || 0) * (m.qty)}</td>
                      <td>{(m.carbs || 0) * (m.qty)}</td>
                      <td>{(m.fats || 0) * (m.qty)}</td>
                      <td>{(m.calories || 0) * (m.qty)}</td>
                      <td>
                        <span>{m.qty}</span>
                      </td>
                      <td>
                        <button
                          onClick={() => handleDelete(m._id)}
                          className="btn btn-sm btn-danger rounded-pill px-3"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  <tr className="fw-bold table-secondary">
                    <td>Totals</td>
                    <td>{totals.protein}</td>
                    <td>{totals.carbs}</td>
                    <td>{totals.fats}</td>
                    <td>{totals.calories}</td>
                    <td></td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyMealList;
