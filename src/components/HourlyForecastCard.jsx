import React from "react";
import { Card, Typography, Row, Col } from "antd";

const { Text } = Typography;

const HourlyForecastCard = ({ data }) => {
  const date = new Date(data.dt * 1000);
  const now = new Date();
  const isCurrentHour =
    now.getHours() === date.getHours() &&
    now.toDateString() === date.toDateString();

  const hour = `${date.getHours()}:00`;
  const temp = Math.round(data.main.temp);
  const feelsLike = Math.round(data.main.feels_like);
  const humidity = data.main.humidity;
  const windSpeed = Math.round(data.wind.speed);
  const pressure = data.main.pressure;
  const cloud = data.clouds?.all;
  const description = data.weather[0]?.description;
  const icon = data.weather[0]?.icon;

  return (
    <Card
      hoverable
      style={{
        width: 140,
        minWidth: 140,
        background: isCurrentHour ? "#1677ff" : "#1f243d",
        borderRadius: 16,
        color: "white",
        border: isCurrentHour ? "2px solid #fff" : "none",
        transition: "all 0.3s ease-in-out",
        flexShrink: 0,
      }}
      styles={{
        body: { padding: 12 },
      }}
    >
      <Row justify="center" style={{ marginBottom: 4 }}>
        <Text strong style={{ color: "#fff" }}>
          {hour}
        </Text>
      </Row>
      <Row justify="center">
        <img
          src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
          alt={description}
          style={{ width: 48, height: 48 }}
        />
      </Row>
      <Row justify="center" style={{ marginBottom: 4 }}>
        <Text style={{ fontSize: 16, color: "#fff" }}>{temp}°</Text>
      </Row>
      <Row
        justify="center"
        style={{ fontSize: 12, color: "#ccc", marginBottom: 8 }}
      >
        {description}
      </Row>
      <Row gutter={[4, 4]} style={{ fontSize: 12, color: "#fff" }}>
        <Col span={12}>🌡 {feelsLike}°</Col>
        <Col span={12}>💧 {humidity}%</Col>
        <Col span={12}>🌬 {windSpeed} km/h</Col>
        <Col span={12}>☁ {cloud}%</Col>
        <Col span={24}>📈 {pressure} mb</Col>
      </Row>
    </Card>
  );
};

export default HourlyForecastCard;
