// src/components/HourlyChart.jsx
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

const HourlyChart = ({ data, unit, dataKey, label }) => {
  // Format tooltip và YAxis theo loại dữ liệu
  const formatValue = (value) => {
    if (dataKey === "temp") {
      return `${Math.round(value)}°${unit === "metric" ? "C" : "F"}`;
    } else if (dataKey === "humidity") {
      return `${value}%`;
    } else if (dataKey === "rain") {
      return `${value} mm`;
    } else if (dataKey === "wind") {
      return `${value} ${unit === "metric" ? "m/s" : "mph"}`;
    }
    return value;
  };

  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis domain={["auto", "auto"]} tickFormatter={formatValue} />
        <RechartsTooltip formatter={(value) => formatValue(value)} labelFormatter={(t) => `${t} - ${label}`} />
        <Line
          type="monotone"
          dataKey={dataKey}
          stroke={
            dataKey === "temp"
              ? "#ff7300"
              : dataKey === "humidity"
              ? "#007bff"
              : dataKey === "rain"
              ? "#00c853"
              : "#6a1b9a"
          }
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default HourlyChart;
