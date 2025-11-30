import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "bootstrap/dist/css/bootstrap.min.css";

const NutrientSummary = ({ nutrients }) => {
  const data = [
    { name: "Protein", value: nutrients?.protein || 0 },
    { name: "Carbs", value: nutrients?.carbs || 0 },
    { name: "Fats", value: nutrients?.fats || 0 },
  ];

  const COLORS = ["#4CAF50", "#FF9800", "#2196F3"]; // green, orange, blue
  const totalCalories = nutrients?.calories || 0;

  return (
    <div className="card border-0 shadow-lg rounded-4 p-3 bg-white">
      <div className="card-body text-center">
        <h4 className="fw-bold text-primary mb-2">
          🍽️ Today's Nutrient Goal
        </h4>
        <p className="text-muted fs-6 mb-4">
          <b>Total Calories:</b> {totalCalories} kcal
        </p>

        <div
          className="d-flex justify-content-center align-items-center"
          style={{ width: "100%", height: "260px" }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={90}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={40} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default NutrientSummary;
