import React, { useEffect, useState, useRef } from "react";
import { Input, Spin, Typography, Card, Button } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import WeatherCard from "../components/WeatherCard";
import HourlyForecastCard from "../components/HourlyForecastCard";
import {
  fetchCurrentWeather,
  fetchHourlyForecast,
} from "../services/weatherService";

const { Title } = Typography;

const Home = () => {
  const [city, setCity] = useState("Ho Chi Minh");
  const [weatherData, setWeatherData] = useState(null);
  const [hourlyForecast, setHourlyForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [groupedByDay, setGroupedByDay] = useState({});
  const [expandedAll, setExpandedAll] = useState(false);

  const dateScrollRef = useRef(null);
  const hourlyScrollRef = useRef(null);
  const [showHourlyScrollButtons, setShowHourlyScrollButtons] = useState(false);

  const scrollX = (ref, direction) => {
    if (ref.current) {
      ref.current.scrollBy({ left: direction * 300, behavior: "smooth" });
    }
  };

  const checkHourlyOverflow = () => {
    const el = hourlyScrollRef.current;
    if (el) {
      setShowHourlyScrollButtons(el.scrollWidth > el.clientWidth);
    }
  };

  const loadWeather = async (cityName) => {
    setLoading(true);
    try {
      const current = await fetchCurrentWeather(cityName);
      const hourly = await fetchHourlyForecast(cityName);

      setWeatherData(current);
      setHourlyForecast(hourly);

      const groups = {};
      hourly.forEach((item) => {
        const date = new Date(item.dt_txt).toISOString().split("T")[0];
        if (!groups[date]) groups[date] = [];
        groups[date].push(item);
      });

      setGroupedByDay(groups);
      setSelectedDate(Object.keys(groups)[0]);
    } catch (err) {
      console.error("Lỗi khi lấy thời tiết:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadWeather(city);
  }, []);

  useEffect(() => {
    checkHourlyOverflow();
  }, [selectedDate, groupedByDay]);

  const formatDateLabel = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("vi-VN", {
      weekday: "short",
      day: "numeric",
      month: "numeric",
    });
  };

  const getIconFromDate = (dateStr) => {
    const entries = groupedByDay[dateStr];
    return entries?.[Math.floor(entries.length / 2)]?.weather[0]?.icon;
  };

  const getTempRange = (entries) => {
    if (!entries?.length) return "";
    const temps = entries.map((e) => e.main.temp);
    return `${Math.round(Math.max(...temps))}° / ${Math.round(
      Math.min(...temps)
    )}°`;
  };

  return (
    <div
      style={{
        padding: 24,
        backgroundColor: "#101336",
        minHeight: "100vh",
        color: "#fff",
      }}
    >
      <Input.Search
        placeholder="Tìm kiếm vị trí"
        onSearch={(value) => {
          if (!value) return;
          setCity(value);
          loadWeather(value);
        }}
        enterButton
        style={{ maxWidth: 300, marginBottom: 24 }}
      />

      {loading ? (
        <Spin />
      ) : (
        <>
          <div style={{ marginBottom: 32 }}>
            <WeatherCard weatherData={weatherData} />
          </div>

          <Card
            style={{
              backgroundColor: "#1f243d",
              borderRadius: 16,
              marginTop: 0,
            }}
            bodyStyle={{ padding: 24 }}
          >
            <Title level={4} style={{ color: "#fff", marginBottom: 16 }}>
              Dự báo từng ngày (chọn ngày để xem chi tiết theo giờ)
            </Title>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 24,
              }}
            >
              <Button
                icon={<LeftOutlined />}
                onClick={() => scrollX(dateScrollRef, -1)}
              />
              <div
                ref={dateScrollRef}
                style={{
                  display: "flex",
                  overflowX: "auto",
                  gap: 16,
                  flex: 1,
                  padding: "0 8px",
                }}
              >
                {Object.keys(groupedByDay).map((dateStr) => {
                  const icon = getIconFromDate(dateStr);
                  const temps = getTempRange(groupedByDay[dateStr]);
                  const isSelected = selectedDate === dateStr;

                  return (
                    <div
                      key={dateStr}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        flexShrink: 0,
                        width: 160,
                      }}
                    >
                      <Card
                        onClick={() => setSelectedDate(dateStr)}
                        hoverable
                        style={{
                          backgroundColor: isSelected ? "#1677ff" : "#2a2f4a",
                          color: "#fff",
                          borderRadius: 12,
                          border: isSelected
                            ? "2px solid #fff"
                            : "1px solid transparent",
                          cursor: "pointer",
                          textAlign: "center",
                        }}
                        bodyStyle={{ padding: 12 }}
                      >
                        <div style={{ fontWeight: 600 }}>
                          {formatDateLabel(dateStr)}
                        </div>
                        {icon && (
                          <img
                            src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
                            alt="weather-icon"
                            style={{ width: 40, height: 40 }}
                          />
                        )}
                        <div style={{ fontSize: 14 }}>{temps}</div>
                      </Card>
                    </div>
                  );
                })}
              </div>
              <Button
                icon={<RightOutlined />}
                onClick={() => scrollX(dateScrollRef, 1)}
              />
            </div>

            {/* Dự báo theo giờ */}
            {selectedDate && (
              <Card
                style={{
                  background: "#2a2f4a",
                  color: "#fff",
                  marginTop: 16,
                  borderRadius: 12,
                  width: "100%",
                }}
                bodyStyle={{
                  padding: 12,
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontWeight: 500, fontSize: 14 }}>Dự báo theo giờ</div>
                  <Button size="small" onClick={() => setExpandedAll((prev) => !prev)}>
                    {expandedAll ? "Thu gọn tất cả" : "Xem tất cả"}
                  </Button>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    width: "100%",
                  }}
                >
                  {showHourlyScrollButtons && (
                    <Button
                      icon={<LeftOutlined />}
                      onClick={() => scrollX(hourlyScrollRef, -1)}
                    />
                  )}
                  <div
                    ref={hourlyScrollRef}
                    style={{
                      display: "flex",
                      gap: 12,
                      overflowX: "auto",
                      flex: 1,
                      padding: "0 8px",
                    }}
                  >
                    {groupedByDay[selectedDate]?.map((hour, idx) => (
                      <div key={idx} style={{ minWidth: 160 }}>
                        <HourlyForecastCard data={hour} expandedAll={expandedAll} />
                      </div>
                    ))}
                  </div>
                  {showHourlyScrollButtons && (
                    <Button
                      icon={<RightOutlined />}
                      onClick={() => scrollX(hourlyScrollRef, 1)}
                    />
                  )}
                </div>
              </Card>
            )}
          </Card>
        </>
      )}
    </div>
  );
};

export default Home;
