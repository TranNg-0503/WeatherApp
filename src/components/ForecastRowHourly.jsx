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
        <Col span={3}>
          <Text strong>{item.dt_txt.split(" ")[1].slice(0, 5)}</Text>
        </Col>
        <Col span={3}>
          <img src={getWeatherIcon(item.weather)} alt="icon" />
        </Col>
        <Col span={4}>
          <Text>{formatTemp(item.main.temp)}</Text>
        </Col>
        <Col span={10}>{isOpen ? <UpOutlined /> : <DownOutlined />}</Col>
      </Row>

      {isOpen && <ForecastDetailsHourly item={item} unit={unit} />}
    </Card>
  );
};

export default ForecastRow;
