import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import { axiosInstance } from "../lib/axios";

const FoodSearch = ({ userId }) => {
  const [query, setQuery] = useState("");
  const [foods, setFoods] = useState([]);
  const [allFoods, setAllFoods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mealQty, setMealQty] = useState({}); // Track quantity for each food
  const token = sessionStorage.getItem("token");

  const defaultFoods = [
    "Egg",
    "Rice",
    "Milk",
    "Banana",
    "Apple",
    "Chicken Breast",
    "Coffee",
    "Bread",
    "Butter",
    "Cheese",
  ];

  // Load CSV food data
  useEffect(() => {
    setLoading(true);
    Papa.parse("/food.csv", {
      download: true,
      header: true,
      complete: (results) => {
        const data = results.data.filter((f) => f.Food);
        setAllFoods(data);
        const defaultItems = data.filter((f) =>
          defaultFoods.some((df) =>
            f.Food?.toLowerCase().includes(df.toLowerCase())
          )
        );
        setFoods(defaultItems.slice(0, 10));
        setLoading(false);
      },
      error: (err) => {
        console.error("CSV parse error:", err);
        setError("Failed to load food data.");
        setLoading(false);
      },
    });
  }, []);

  // Fetch user meals and initialize mealQty
  useEffect(() => {
    const fetchMeals = async () => {
      if (!token) return;
      try {
        const res = await axiosInstance.get("/meals", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const qtyMap = {};
        res.data.forEach((meal) => {
          qtyMap[meal.foodName.toLowerCase()] = meal.qty;
        });
        setMealQty(qtyMap);
      } catch (err) {
        console.error("Failed to fetch meals:", err.response?.data || err.message);
      }
    };
    fetchMeals();
  }, [token]);

  // Filter foods based on query
  useEffect(() => {
    if (!query.trim()) {
      const defaultItems = allFoods.filter((f) =>
        defaultFoods.some((df) =>
          f.Food?.toLowerCase().includes(df.toLowerCase())
        )
      );
      setFoods(defaultItems.slice(0, 10));
      setError("");
      return;
    }

    const filtered = allFoods
      .filter((f) =>
        f.Food?.toLowerCase().includes(query.trim().toLowerCase())
      )
      .slice(0, 10);

    setFoods(filtered);
    if (filtered.length === 0) setError(`No foods found for "${query}".`);
    else setError("");
  }, [query, allFoods]);

  // Add or increment meal
  const handleAdd = async (food) => {
    const id = food.Food.toLowerCase();
    const newQty = (mealQty[id] || 0) + 1;

    try {
      await axiosInstance.post(
        "/meals/add",
        { food },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMealQty((prev) => ({ ...prev, [id]: newQty }));
    } catch (err) {
      console.error("Add meal error:", err.response?.data || err.message);
      alert("Failed to add food. Please check your backend connection.");
    }
  };

  // Decrement meal
  const handleDecrement = async (food) => {
    const id = food.Food.toLowerCase();
    const currentQty = mealQty[id] || 0;
    if (currentQty <= 0) return;

    const newQty = currentQty - 1;

    try {
      // PATCH backend to update quantity
      const res = await axiosInstance.get("/meals", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const mealObj = res.data.find((m) => m.foodName.toLowerCase() === id);

      if (mealObj) {
        await axiosInstance.patch(
          `/meals/${mealObj._id}`,
          { qty: newQty },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      setMealQty((prev) => ({ ...prev, [id]: newQty }));
    } catch (err) {
      console.error("Decrement meal error:", err.response?.data || err.message);
    }
  };

  // Increment meal
  const handleIncrement = (food) => {
    handleAdd(food);
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <h3 className="text-center mb-4">🍎 Find and Add Foods</h3>

          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search food..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          {loading && <p>Loading results...</p>}
          {error && <p className="text-danger">{error}</p>}

          <ul className="list-group">
            {foods.map((f, index) => {
              const id = f.Food.toLowerCase();
              const qty = mealQty[id] || 0;
              return (
                <li
                  key={index}
                  className="list-group-item d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center py-3"
                >
                  {/* Food Info */}
                  <div className="mb-2 mb-md-0">
                    <strong className="d-block">{f.Food}</strong>
                    <span className="text-muted d-block">
                      {f.Calories} cal | {f.Protein}g P | {f.Carbs}g C | {f.Fat}g F
                    </span>
                    {f.Measure && f.Grams && (
                      <span className="text-secondary d-block">
                        ({f.Measure}, {f.Grams}g)
                      </span>
                    )}
                  </div>

                  {/* Quantity / Add buttons */}
                  <div className="d-flex align-items-center gap-2">
                    {qty === 0 ? (
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => handleAdd(f)}
                      >
                        + Add
                      </button>
                    ) : (
                      <>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDecrement(f)}
                        >
                          -
                        </button>
                        <span className="fw-bold px-2">{qty}</span>
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => handleIncrement(f)}
                        >
                          +
                        </button>
                      </>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>

        </div>
      </div>
    </div>
  );
};

export default FoodSearch;
