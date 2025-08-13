import React, { useState, useEffect, useContext } from "react";
import { Card, Tooltip, Button } from "antd";
import { fetchMonthlyWeather } from "../services/weatherService";
import "./MonthlyForecast.css";
import WeatherTempChart from "../components/WeatherTempChart";
import WeatherConditionPieChart from "../components/WeatherConditionPieChart";
import RainfallBarChart from "../components/RainfallBarChart";
import { ThemeContext } from "../contexts/ThemeContext";

const WEEKDAYS = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

const MonthlyForecast = () => {
  const [monthlyWeather, setMonthlyWeather] = useState([]);
  const [monthLabel, setMonthLabel] = useState("");
  const [monthOffset, setMonthOffset] = useState(0);
  const { darkMode } = useContext(ThemeContext);

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
    if (!monthlyWeather.length) return null;

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
          <Card
            style={{
              backgroundColor: darkMode ? "#242333ff" : "#cbcef4ff",
              color: darkMode ? "#ffffff" : "#000000",
              border: darkMode ? "1px solid #444" : "1px solid #ffffffff",
            }}
            styles={{ body: { padding: 8, height: 120 } }}
            hoverable
          >
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
    <div
      style={{
        padding: 20,
        background: darkMode
          ? "linear-gradient(135deg, #0554c3ff, #162f68ff)" // Gradient dark
          : "linear-gradient(135deg, #c1ddffff, #ffffffff)", // Gradient light
        color: darkMode ? "#ffffff" : "#000000",
        minHeight: "100vh", // đảm bảo gradient phủ toàn bộ
      }}
    >
      {/* Thanh điều hướng tháng */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 20,
          alignItems: "center",
        }}
      >
        <Button onClick={() => setMonthOffset(monthOffset - 1)}>
          ← Tháng trước
        </Button>
        <h2 style={{ margin: 0 }}>Tháng {monthLabel}</h2>
        <Button onClick={() => setMonthOffset(monthOffset + 1)}>
          Tháng sau →
        </Button>
      </div>

      {/* Header ngày trong tuần */}
      <div className="monthly-container">
        {WEEKDAYS.map((day, idx) => (
          <div
            className="monthly-weather-header"
            key={idx}
            style={{
              backgroundColor: darkMode ? "#161b22" : "rgba(123, 153, 215, 1)",
              color: darkMode ? "#ffffff" : "#ffffffff",
            }}
          >
            {day}
          </div>
        ))}
        {renderCalendarGrid()}
      </div>

      {/* Biểu đồ nhiệt độ */}
      <div style={{ marginTop: 40 }}>
        <h3>Nhiệt độ trong tháng</h3>
        <WeatherTempChart days={monthlyWeather} />
      </div>

      {/* Biểu đồ thời tiết + Phân tích lượng mưa */}
      <div style={{ display: "flex", gap: "40px", marginTop: 20 }}>
        <div style={{ flex: 1 }}>
          <h3>Thời tiết trong tháng</h3>
          <WeatherConditionPieChart days={monthlyWeather} />
        </div>

        <div style={{ flex: 1 }}>
          <h3>Phân tích lượng mưa</h3>
          <RainfallBarChart
            dailyWeather={monthlyWeather.map((day) => ({
              date: day.datetime,
              precipitation: day.precip || 0,
            }))}
          />
        </div>
      </div>
    </div>
  );
};

export default MonthlyForecast;
