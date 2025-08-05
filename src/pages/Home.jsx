import stylesHome from "./Home.styles";
import React, { useEffect, useState, useContext } from "react";
import { Input, Spin, Typography, Card, Switch } from "antd";
import WeatherCard from "../components/WeatherCard";
import HourlyForecastCard from "../components/HourlyForecastCard";
import { ThemeContext } from "../contexts/ThemeContext";
import {
  fetchCurrentWeather,
  fetchHourlyForecast,
  fetchMonthlyWeather,
} from "../services/weatherService";

const { Title } = Typography;

const Home = () => {
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  const [city, setCity] = useState("Ho Chi Minh");
  const [weatherData, setWeatherData] = useState(null);
  const [hourlyForecast, setHourlyForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [groupedByDay, setGroupedByDay] = useState({});
  const styles = stylesHome(darkMode);
  const [monthOffset, setMonthOffset] = useState(0);
  const [monthlyWeather, setMonthlyWeather] = useState([]);
  const [monthLabel, setMonthLabel] = useState("");

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

  useEffect(() => {
    const loadMonthlyWeather = async () => {
      try {
        const data = await fetchMonthlyWeather(city, monthOffset);
        setMonthlyWeather(data.days);
        setMonthLabel(`${data.month}/${data.year}`);
      } catch (err) {
        console.error(err);
      }
    };

    loadMonthlyWeather();
  }, [monthOffset, city]);

  return (
    <div style={styles.container}>
      <Input.Search
        placeholder="Tìm kiếm vị trí"
        onSearch={(value) => {
          if (!value) return;
          setCity(value);
          loadWeather(value);
        }}
        enterButton
        style={styles.searchInput}
      />

      {loading ? (
        <Spin />
      ) : (
        <>
          <div style={styles.currentWeather}>
            <WeatherCard weatherData={weatherData} />
          </div>

          <Card style={styles.forecastCard} styles={{ body: styles.cardBody }}>
            <Title level={4} style={styles.cardTitle}>
              Dự báo từng ngày (chọn ngày để xem chi tiết theo giờ)
            </Title>

            <div style={styles.dailyList}>
              {Object.keys(groupedByDay).map((dateStr) => {
                const icon = getIconFromDate(dateStr);
                const temps = getTempRange(groupedByDay[dateStr]);
                const isSelected = selectedDate === dateStr;

                return (
                  <div
                    key={dateStr}
                    style={{
                      ...styles.dailyItemContainer,
                      minWidth: isSelected ? 360 : 120,
                    }}
                  >
                    <Card
                      onClick={() => setSelectedDate(dateStr)}
                      hoverable
                      style={{
                        ...styles.dailyItemCard,
                        backgroundColor: isSelected ? "#1677ff" : "#2a2f4a",
                        borderRadius: isSelected ? "12px 12px 0 0" : "12px",
                        border: isSelected
                          ? "2px solid #fff"
                          : "1px solid transparent",
                      }}
                      styles={{ body: styles.dailyItemBody }}
                    >
                      <div style={styles.dayLabel}>
                        {formatDateLabel(dateStr)}
                      </div>
                      {icon && (
                        <img
                          src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
                          alt="weather-icon"
                          style={styles.weatherIcon}
                        />
                      )}
                      <div style={styles.tempRange}>{temps}</div>
                    </Card>

                    {isSelected && (
                      <div style={styles.hourlyContainer}>
                        <div style={styles.hourlyTitle}>Dự báo theo giờ</div>
                        <div style={styles.hourlyList}>
                          {groupedByDay[dateStr]?.map((hour, idx) => (
                            <div key={idx} style={styles.hourlyItem}>
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

          {/* === Dự báo hàng tháng === */}
          <div style={styles.monthlyNav}>
            <button
              style={styles.navButton}
              onClick={() => setMonthOffset((prev) => prev - 1)}
            >
              Tháng trước
            </button>
            <h2 style={styles.monthTitle}>Tháng {monthLabel}</h2>
            <button
              style={styles.navButton}
              onClick={() => setMonthOffset((prev) => prev + 1)}
            >
              Tháng sau
            </button>
          </div>

          <div style={styles.monthlyGrid}>
            {monthlyWeather.map((day, idx) => (
              <Card key={idx} style={styles.monthlyCard}>
                <div>{day.datetime}</div>
                <div>
                  🌡️ {day.tempmax}° / {day.tempmin}°
                </div>
                <div>☁️ {day.conditions}</div>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
