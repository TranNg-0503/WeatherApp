import React, { useState, useEffect } from "react";
import { Card, Tooltip, Row, Col, Button } from "antd";
import { fetchMonthlyWeather } from "../services/weatherService";
import "./MonthlyForecast.css";

const WEEKDAYS = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

const MonthlyForecast = () => {
  const [monthlyWeather, setMonthlyWeather] = useState([]);
  const [monthLabel, setMonthLabel] = useState("");
  const [monthOffset, setMonthOffset] = useState(0);

  useEffect(() => {
    loadWeather(monthOffset);
  }, [monthOffset]);

  const loadWeather = async (offset) => {
    try {
      const data = await fetchMonthlyWeather("HoChiMinh", offset);
      setMonthlyWeather(data.days);
      setMonthLabel(`${data.month}/${data.year}`);
    } catch (err) {
      console.error("Lỗi khi load weather:", err);
    }
  };

  const renderCalendarGrid = () => {
    if (!monthlyWeather.length) {
      return null;
    }

    const firstDay = monthlyWeather[0];
    const firstDayIdx = new Date(firstDay.datetime).getDay();
    const paddingLeftArr = new Array(firstDayIdx).fill(null);
    const paddingRightArr = new Array(
      7 - ((firstDayIdx + monthlyWeather.length) % 7)
    ).fill(null);

    const calendarCells = [
      ...paddingLeftArr,
      ...monthlyWeather,
      ...paddingRightArr,
    ].map((day, idx) => {
      if (!day) {
        return <div key={idx} className="monthly-day-placeholder"></div>;
      }

      const dateObj = new Date(day.datetime);
      return (
        <Tooltip
          key={idx}
          title={
            <div>
              <div>
                <b>Nhiệt độ TB:</b> {day.temp}°C
              </div>
              <div>
                <b>Cảm giác:</b> {day.feelslike}°C
              </div>
              <div>
                <b>Độ ẩm:</b> {day.humidity}%
              </div>
              <div>
                <b>Lượng mưa:</b> {day.precip} mm
              </div>
              <div>
                <b>Điều kiện:</b> {day.conditions}
              </div>
            </div>
          }
        >
          <Card styles={{ body: { padding: 8, height: 120 } }} hoverable>
            <div className="monthly-card-title">
              {day.datetime.split("-")[2]}
            </div>
            <div className="monthly-card-temp">
              🌡️ {day.tempmax}° / {day.tempmin}°
            </div>
            <div className="monthly-card-weather-condition">
              Điều kiện: {day.conditions}
            </div>
          </Card>
        </Tooltip>
      );
    });

    return calendarCells;
  };

  return (
    <div style={{ padding: 20 }}>
      {/* Thanh điều hướng tháng */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <Button onClick={() => setMonthOffset(monthOffset - 1)}>
          ← Tháng trước
        </Button>
        <h2>Tháng {monthLabel}</h2>
        <Button onClick={() => setMonthOffset(monthOffset + 1)}>
          Tháng sau →
        </Button>
      </div>

      {/* Header ngày trong tuần */}
      <div className="monthly-container">
        {WEEKDAYS.map((day, idx) => (
          <div className="monthly-weather-header" key={idx}>
            {day}
          </div>
        ))}
        {renderCalendarGrid()}
      </div>
    </div>
  );
};

export default MonthlyForecast;
