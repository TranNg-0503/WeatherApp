import React, { useState, useEffect } from "react";
import { Card, Typography } from "antd";
import {
  ClockCircleOutlined,
  CompressOutlined,
  ExpandOutlined,
} from "@ant-design/icons";

const { Text, Title } = Typography;

const HourlyForecastCard = ({ data, expandedAll,tempUnit ="C" }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (expandedAll !== null) {
      setIsExpanded(expandedAll);
    }
  }, [expandedAll]);

  const handleToggle = () => {
    if (expandedAll !== null) return;
    setIsExpanded((prev) => !prev);
  };

  const {
    dt,
    main,
    weather,
    wind,
    clouds,
  } = data;

  const dateObj = new Date(dt * 1000);
  const timeString = dateObj.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const dateString = dateObj.toLocaleDateString("vi-VN");

  return (
    <Card
      hoverable
      onClick={handleToggle}
      style={{
        width: 180,
        margin: "8px",
        border: "1px solid #ddd",
        borderRadius: "10px",
        position: "relative",
        background: "#1f243d",
        color: "#fff",
      }}
      bodyStyle={{ padding: "12px" }}
    >
      <div style={{ textAlign: "center" }}>
  <img
    src={`https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`}
    alt="weather icon"
    style={{ width: "64px", height: "64px", display: "block", margin: "0 auto" }}
  />
  <div>
    <Text
      strong
      style={{
        color: "#fff",
        display: "block",
        textAlign: "center",
        marginTop: 4,
      }}
    >
      {weather[0].description}
    </Text>
  </div>
  <div>
    <Text
      style={{
        color: "#aaa",
        display: "block",
        textAlign: "center",
        marginTop: 2,
      }}
    >
      {timeString}
    </Text>
  </div>
  <Title
    level={4}
    style={{
      margin: "4px 0",
      color: "#fff",
      textAlign: "center",
    }}
  >
    {Math.round(main.temp)}°{tempUnit}
  </Title>
</div>


      {isExpanded && (
        <div style={{ marginTop: "8px", color: "#fff", fontSize: 13 }}>
          <div><ClockCircleOutlined /> {dateString}</div>
          <div>💧 Độ ẩm: {main.humidity}%</div>
          <div>🌬️ Gió: {wind.speed} m/s ({wind.deg}°)</div>
          <div>☁️ Mây: {clouds.all}%</div>
          <div>⏲️ Áp suất: {main.pressure} hPa</div>
        </div>
      )}

      {expandedAll === null && (
        <div
          style={{
            position: "absolute",
            top: 8,
            right: 8,
            fontSize: "14px",
            color: "#999",
          }}
        >
          {isExpanded ? <CompressOutlined /> : <ExpandOutlined />}
        </div>
      )}
    </Card>
  );
};

export default HourlyForecastCard;
