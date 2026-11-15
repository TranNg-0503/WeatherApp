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
    <div style={{ padding: "12px 16px", borderTop: "1px solid #eee" }}>
      <Row gutter={[16, 12]}>
        {/* Lượng mưa */}
        <Col span={12}>
          <CloudOutlined style={{ marginRight: 6 }} />
          Lượng mưa: {Math.round(item.pop * 100)}%
        </Col>

        {/* Gió */}
        <Col span={12}>
          <DashOutlined style={{ marginRight: 6 }} />
          Gió: {item.wind.speed} {unit === "metric" ? "m/s" : "mph"}
        </Col>

        {/* Độ ẩm */}
        <Col span={12}>
          <ThunderboltOutlined style={{ marginRight: 6 }} />
          Độ ẩm: {item.main.humidity}%
        </Col>

        {/* Áp suất */}
        <Col span={12}>
          <CompressOutlined style={{ marginRight: 6 }} />
          Áp suất: {item.main.pressure} hPa
        </Col>

        {/* Tầm nhìn */}
        <Col span={12}>
          <EyeOutlined style={{ marginRight: 6 }} />
          Tầm nhìn: {(item.visibility / 1000).toFixed(1)} km
        </Col>

        {/* Cảm giác như */}
        <Col span={12}>
          <SmileOutlined style={{ marginRight: 6 }} />
          Cảm thấy như: {formatTemp(item.main.feels_like)}
        </Col>
      </Row>
    </div>
  );
};

export default ForecastDetailsHourly;
