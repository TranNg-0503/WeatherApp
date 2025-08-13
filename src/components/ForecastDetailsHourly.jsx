// src/components/HourlyForecast/ForecastDetails.jsx
import React from "react";
import { Row, Col } from "antd";
import {
  CloudOutlined,
  DashOutlined,
  ThunderboltOutlined,
  CompressOutlined,
  EyeOutlined,
  SmileOutlined,
} from "@ant-design/icons";

const ForecastDetailsHourly = ({ item, unit }) => {
  const formatTemp = (temp) =>
    `${Math.round(temp)}°${unit === "metric" ? "C" : "F"}`;

  return (
    <div style={{ padding: "10px 16px", borderTop: "1px solid #ccc" }}>
      <Row gutter={[16, 8]}>
        <Col span={8}>
          <CloudOutlined style={{ marginRight: 6 }} />
          Lượng mưa: {item.pop * 100}%
        </Col>
        <Col span={8}>
          <DashOutlined style={{ marginRight: 6 }} />
          Gió: {item.wind.speed} {unit === "metric" ? "m/s" : "mph"}
        </Col>
        <Col span={8}>
          <ThunderboltOutlined style={{ marginRight: 6 }} />
          Độ ẩm: {item.main.humidity}%
        </Col>
        <Col span={8}>
          <CompressOutlined style={{ marginRight: 6 }} />
          Áp suất: {item.main.pressure} hPa
        </Col>
        <Col span={8}>
          <EyeOutlined style={{ marginRight: 6 }} />
          Tầm nhìn: {item.visibility / 1000} km
        </Col>
        <Col span={8}>
          <SmileOutlined style={{ marginRight: 6 }} />
          Cảm thấy như: {formatTemp(item.main.feels_like)}
        </Col>
      </Row>
    </div>
  );
};

export default ForecastDetailsHourly;
