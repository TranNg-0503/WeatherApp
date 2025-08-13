// src/components/HourlyForecast/TemperatureChart.jsx
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const HourlyChart = ({ data, unit }) => {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis domain={["auto", "auto"]} tickFormatter={(t) => `${t}°`} />
        <RechartsTooltip
          formatter={(value) =>
            `${Math.round(value)}°${unit === "metric" ? "C" : "F"}`
          }
        />
        <Line
          type="monotone"
          dataKey="temp"
          stroke="#ff7300"
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default HourlyChart;
