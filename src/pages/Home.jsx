import stylesHome from "./Home.styles";
import React, { useEffect, useState, useRef, useContext } from "react";
import {
  Input,
  Spin,
  Typography,
  Card,
  Button,
  Radio,
} from "antd";
import {
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import WeatherCard from "../components/WeatherCard";
import HourlyForecastCard from "../components/HourlyForecastCard";
import { ThemeContext } from "../contexts/ThemeContext";
import DaySelector from "../components/DaySelector";

import {
  fetchCurrentWeather,
  fetchHourlyForecast,
  fetchMonthlyWeather,
} from "../services/weatherService";

const { Title } = Typography;

const Home = () => {
  const { darkMode } = useContext(ThemeContext);
  const styles = stylesHome(darkMode);

  const [city, setCity] = useState("Ho Chi Minh");
  const [weatherData, setWeatherData] = useState(null);
  const [hourlyForecast, setHourlyForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [groupedByDay, setGroupedByDay] = useState({});
  const [expandedAll, setExpandedAll] = useState(false);
  const [viewType, setViewType] = useState("rain");

  const [monthOffset, setMonthOffset] = useState(0);
  const [monthlyWeather, setMonthlyWeather] = useState([]);
  const [monthLabel, setMonthLabel] = useState("");

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

  const formatDateLabel = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("vi-VN", {
      weekday: "short",
      day: "numeric",
      month: "numeric",
    });
  };

  useEffect(() => {
    loadWeather(city);
  }, []);

  useEffect(() => {
    checkHourlyOverflow();
  }, [selectedDate, groupedByDay]);

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

            <Radio.Group
              value={viewType}
              onChange={(e) => setViewType(e.target.value)}
              style={{ marginBottom: 16 }}
            >
              <Radio.Button value="rain">Lượng mưa</Radio.Button>
              <Radio.Button value="temp">Nhiệt độ</Radio.Button>
              <Radio.Button value="wind">Gió</Radio.Button>
            </Radio.Group>

            {/* ✅ Đã thay thế bằng DaySelector */}
            <DaySelector
              groupedByDay={groupedByDay}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              getIconFromDate={getIconFromDate}
              getTempRange={getTempRange}
              dateScrollRef={dateScrollRef}
              scrollX={scrollX}
              viewType={viewType}
            />

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
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div style={{ fontWeight: 500, fontSize: 14 }}>
                    Dự báo theo giờ
                  </div>
                  <Button
                    size="small"
                    onClick={() => setExpandedAll((prev) => !prev)}
                  >
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
                        <HourlyForecastCard
                          data={hour}
                          expandedAll={expandedAll}
                          viewType={viewType}
                        />
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

          {/* Monthly Forecast */}
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
