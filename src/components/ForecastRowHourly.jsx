// src/components/HourlyForecast/ForecastRow.jsx
import React from "react";
import { Card, Row, Col, Typography } from "antd";
import { UpOutlined, DownOutlined } from "@ant-design/icons";
import ForecastDetailsHourly from "./ForecastDetailsHourly";

const { Text } = Typography;

const ForecastRow = ({ item, isOpen, onToggle, unit }) => {
  const formatTemp = (temp) =>
    `${Math.round(temp)}°${unit === "metric" ? "C" : "F"}`;

  const getWeatherIcon = (weather) => {
    const iconCode = weather[0]?.icon || "01d";
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  return (
    <Card style={{ marginBottom: 10, padding: 0 }}>
      <Row
        align="middle"
        justify="space-between"
        style={{ padding: "10px 16px", cursor: "pointer" }}
        onClick={onToggle}
      >
        {/* Giờ */}
        <Col span={4}>
          <Text strong>{item.dt_txt.split(" ")[1].slice(0, 5)}</Text>
        </Col>

        {/* Icon thời tiết */}
        <Col span={4} style={{ textAlign: "center" }}>
          <img
            src={getWeatherIcon(item.weather)}
            alt={item.weather[0]?.description || "weather"}
            style={{ width: 40, height: 40 }}
          />
        </Col>

        {/* Nhiệt độ */}
        <Col span={4} style={{ textAlign: "center" }}>
          <Text>{formatTemp(item.main.temp)}</Text>
        </Col>

        {/* Tóm tắt thời tiết */}
        <Col span={8} style={{ textAlign: "center" }}>
          <Text type="secondary" style={{ marginRight: 8 }}>
            {item.weather[0]?.description
              ? item.weather[0].description.charAt(0).toUpperCase() +
                item.weather[0].description.slice(1)
              : "—"}
          </Text>
        </Col>

        {/* Toggle icon */}
        <Col span={4} style={{ textAlign: "right" }}>
          {isOpen ? <UpOutlined /> : <DownOutlined />}
        </Col>
      </Row>

      {/* Chi tiết khi mở rộng */}
      {isOpen && <ForecastDetailsHourly item={item} unit={unit} />}
    </Card>
  );
};

export default ForecastRow;
