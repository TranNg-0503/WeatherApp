// src/pages/HourlyForecast.jsx
import React, { useEffect, useState } from "react";
import { Spin, Button, Card, Row, Col, Typography } from "antd";
import { fetchHourlyForecast } from "../services/weatherService";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const { Title, Text } = Typography;

const HourlyForecast = () => {
  const [hourlyForecast, setHourlyForecast] = useState([]);
  const [groupedByDay, setGroupedByDay] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [expandedAll, setExpandedAll] = useState(false);
  const [unit, setUnit] = useState("metric"); // metric = °C, imperial = °F
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadWeather();
  }, [unit]);

  const loadWeather = async () => {
    setLoading(true);
    try {
      // fetchHourlyForecast trả về mảng
      const list = await fetchHourlyForecast("Ho Chi Minh", unit);
      setHourlyForecast(list);
      groupByDay(list);
      setSelectedDate(list[0]?.dt_txt.split(" ")[0]);
    } catch (err) {
      console.error("Lỗi khi load weather:", err);
    }
    setLoading(false);
  };

  const groupByDay = (list) => {
    const grouped = {};
    list.forEach((item) => {
      const date = item.dt_txt.split(" ")[0];
      if (!grouped[date]) grouped[date] = [];
      grouped[date].push(item);
    });
    setGroupedByDay(grouped);
  };

  const handleUnitToggle = () => {
    setUnit((prev) => (prev === "metric" ? "imperial" : "metric"));
  };

  const formatTemp = (temp, symbol) => `${Math.round(temp)}${symbol}`;

  const getWeatherIcon = (weather) => {
    const iconCode = weather[0]?.icon || "01d";
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  // Dữ liệu chart
  const chartData =
    groupedByDay[selectedDate]?.map((item) => ({
      time: item.dt_txt.split(" ")[1].slice(0, 5),
      temp: item.main.temp,
    })) || [];

  return (
    <Spin spinning={loading}>
      <div style={{ padding: 16 }}>
        {/* Header */}
        <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
          <Title level={3}>Dự báo thời tiết theo giờ</Title>
          <Button onClick={handleUnitToggle}>
            Đổi sang °{unit === "metric" ? "F" : "C"}
          </Button>
        </Row>

        {/* Thanh chọn ngày */}
        <div style={{ display: "flex", overflowX: "auto", marginBottom: 20 }}>
          {Object.keys(groupedByDay).map((date) => (
            <Button
              key={date}
              type={date === selectedDate ? "primary" : "default"}
              style={{ marginRight: 8 }}
              onClick={() => setSelectedDate(date)}
            >
              {date}
            </Button>
          ))}
        </div>

        {/* Biểu đồ nhiệt độ */}
        <Card style={{ marginBottom: 20 }}>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis
                domain={["auto", "auto"]}
                tickFormatter={(t) => `${t}°`}
              />
              <RechartsTooltip
                formatter={(value) =>
                  `${Math.round(value)}°${unit === "metric" ? "C" : "F"}`
                }
              />
              <Line
                type="monotone"
                dataKey="temp"
                stroke="#ff7300"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Nút mở rộng / thu gọn */}
        <Button
          onClick={() => setExpandedAll((prev) => !prev)}
          style={{ marginBottom: 10 }}
        >
          {expandedAll ? "Thu gọn tất cả" : "Xem chi tiết tất cả"}
        </Button>

        {/* Danh sách dự báo */}
        {groupedByDay[selectedDate]?.map((item, index) => (
          <Card key={index} style={{ marginBottom: 10 }}>
            <Row align="middle" justify="space-between">
              <Col span={4}>
                <Text strong>{item.dt_txt.split(" ")[1].slice(0, 5)}</Text>
              </Col>
              <Col span={4}>
                <img src={getWeatherIcon(item.weather)} alt="icon" />
              </Col>
              <Col span={4}>
                <Text>{formatTemp(item.main.temp, item.tempSymbol)}</Text>
              </Col>
              <Col span={8}>
                {expandedAll && (
                  <div>
                    <div>Lượng mưa: {item.pop * 100}%</div>
                    <div>
                      Gió: {item.wind.speed}{" "}
                      {unit === "metric" ? "m/s" : "mph"}
                    </div>
                    <div>Độ ẩm: {item.main.humidity}%</div>
                    <div>Áp suất: {item.main.pressure} hPa</div>
                  </div>
                )}
              </Col>
            </Row>
          </Card>
        ))}
      </div>
    </Spin>
  );
};

export default HourlyForecast;
