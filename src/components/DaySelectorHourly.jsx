// src/components/HourlyForecast/DaySelector.jsx
import React from "react";
import { Button } from "antd";

const DaySelectorHourly = ({ dates, selectedDate, onSelect }) => {
  return (
    <div style={{ display: "flex", overflowX: "auto", marginBottom: 20 }}>
      {dates.map((date) => (
        <Button
          key={date}
          type={date === selectedDate ? "primary" : "default"}
          style={{ marginRight: 8 }}
          onClick={() => onSelect(date)}
        >
          {date}
        </Button>
      ))}
    </div>
  );
};

export default DaySelectorHourly;
