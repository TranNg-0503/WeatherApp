import React from "react";
import { Card, Row, Col } from "antd";
import {
  CloudOutlined,
  DashboardOutlined,
  CompressOutlined,
  EyeOutlined,
  ArrowUpOutlined,
} from "@ant-design/icons";

const WeatherCard = ({ weatherData }) => {
  if (!weatherData) return null;

  const { name, main, weather, wind, visibility } = weatherData;

  const iconUrl = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;

  return (
    <Card
      title={`Thời tiết tại ${name}`}
      style={{ background: "#3a3a80", color: "#fff", borderRadius: 12 }}
      headStyle={{ color: "#fff", fontWeight: "bold" }}
    >
      <Row align="middle">
        <Col span={6}>
          <img src={iconUrl} alt="weather icon" />
          <div style={{ fontSize: "36px", fontWeight: "bold" }}>
            {Math.round(main.temp)}°C
          </div>
        </Col>

        <Col span={18}>
          <div style={{ fontSize: "18px" }}>{weather[0].description}</div>
          <div style={{ color: "#ccc" }}>
            Cảm thấy như: {Math.round(main.feels_like)}°
          </div>
          <div style={{ marginTop: 12 }}>
            <p>
              {`Dự báo: Trời ${
                weather[0].description
              }. Nhiệt độ cao nhất hôm nay khoảng ${Math.round(
                main.temp_max
              )}°C.`}
            </p>
          </div>

          <Row gutter={16}>
            <Col span={8}>
              <DashboardOutlined /> Gió: {wind.speed} km/h
            </Col>
            <Col span={8}>
              <CloudOutlined /> Độ ẩm: {main.humidity}%
            </Col>
            <Col span={8}>
              <EyeOutlined /> Tầm nhìn: {visibility / 1000} km
            </Col>
            <Col span={8}>
              <CompressOutlined /> Áp suất: {main.pressure} mb
            </Col>
            <Col span={8}>
              <ArrowUpOutlined /> Điểm sương:{" "}
              {(main.temp - (100 - main.humidity) / 5).toFixed(1)}°
            </Col>
          </Row>
        </Col>
      </Row>
    </Card>
  );
};

export default WeatherCard;
