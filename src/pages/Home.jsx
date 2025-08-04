import React, { useEffect, useState } from "react";
import { Input, Spin, Typography, Card } from "antd";
import WeatherCard from "../components/WeatherCard";
import HourlyForecastCard from "../components/HourlyForecastCard";
import {
  fetchCurrentWeather,
  fetchHourlyForecast,
  fetchCurrentWeatherByCityName,
} from "../services/weatherService";

const { Title } = Typography;

const Home = () => {
  const [city, setCity] = useState("Ho Chi Minh");
  const [weatherData, setWeatherData] = useState(null);
  const [hourlyForecast, setHourlyForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [groupedByDay, setGroupedByDay] = useState({});

  const loadWeather = async (cityName) => {
    setLoading(true);
    try {
      const current = await fetchCurrentWeatherByCityName(cityName);
      const { coord } = current;

      const hourly = await fetchHourlyForecast({
        lat: coord.lat,
        lon: coord.lon,
      });

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

      if (err?.response?.status === 404) {
        alert("Không tìm thấy thành phố này. Vui lòng thử lại.");
      } else {
        alert("Đã xảy ra lỗi khi lấy dữ liệu thời tiết.");
      }

      // Xoá dữ liệu cũ nếu lỗi
      setWeatherData(null);
      setHourlyForecast([]);
      setGroupedByDay({});
      setSelectedDate(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWeather(city);
  }, []);

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
          {/* Vùng hiển thị thông tin hiện tại */}
          <div style={{ marginBottom: 32 }}>
            {weatherData ? (
              <WeatherCard weatherData={weatherData} />
            ) : (
              <div>Không có dữ liệu thời tiết</div>
            )}
          </div>

          {/* Dashboard Dự báo */}
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
                gap: 16,
                overflowX: "auto",
                paddingBottom: 16,
                alignItems: "flex-start",
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
                      minWidth: isSelected ? 360 : 120,
                    }}
                  >
                    <Card
                      onClick={() => setSelectedDate(dateStr)}
                      hoverable
                      style={{
                        backgroundColor: isSelected ? "#1677ff" : "#2a2f4a",
                        color: "#fff",
                        borderRadius: isSelected ? "12px 12px 0 0" : "12px",
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

                    {isSelected && (
                      <div
                        style={{
                          background: "#2a2f4a",
                          padding: 12,
                          borderRadius: "0 0 12px 12px",
                          border: "2px solid #fff",
                          borderTop: "none",
                        }}
                      >
                        <div
                          style={{
                            fontWeight: 500,
                            fontSize: 14,
                            marginBottom: 8,
                            color: "#fff",
                          }}
                        >
                          Dự báo theo giờ
                        </div>
                        <div
                          style={{
                            display: "flex",
                            gap: 12,
                            overflowX: "auto",
                          }}
                        >
                          {groupedByDay[dateStr]?.map((hour, idx) => (
                            <div key={idx} style={{ minWidth: 100 }}>
                              <HourlyForecastCard data={hour} />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        </>
      )}
    </div>
  );
};

export default Home;
