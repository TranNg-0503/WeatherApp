import React, { useEffect, useState, useRef } from "react";
import { Input, Spin, Typography, Card, Radio, Collapse } from "antd";
import WeatherCard from "../components/WeatherCard";
import {
  fetchCurrentWeather,
  fetchHourlyForecast,
} from "../services/weatherService";
import DaySelector from "../components/DaySelector";
import HourlyForecastList from "../components/HourlyForecastList";
import DataView from "../components/DataView";

const { Title } = Typography;
const { Panel } = Collapse;

const Home = () => {
  const [city, setCity] = useState("Ho Chi Minh");
  const [weatherData, setWeatherData] = useState(null);
  const [hourlyForecast, setHourlyForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [groupedByDay, setGroupedByDay] = useState({});
  const [expandedAll, setExpandedAll] = useState(false);
  const [showHourlyScrollButtons, setShowHourlyScrollButtons] = useState(false);
  const [viewType, setViewType] = useState("rain");

  const dateScrollRef = useRef(null);
  const hourlyScrollRef = useRef(null);

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

            {/* ✅ Thêm Radio chọn kiểu xem: lượng mưa, nhiệt độ, gió */}
            <Radio.Group
              value={viewType}
              onChange={(e) => setViewType(e.target.value)}
              style={{ marginBottom: 16 }}
            >
              <Radio.Button value="rain">Lượng mưa</Radio.Button>
              <Radio.Button value="temp">Nhiệt độ</Radio.Button>
              <Radio.Button value="wind">Gió</Radio.Button>
            </Radio.Group>

            <DaySelector
              groupedByDay={groupedByDay}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              getIconFromDate={getIconFromDate}
              getTempRange={getTempRange}
              dateScrollRef={dateScrollRef}
              scrollX={scrollX}
              viewType={viewType} // ✅ Truyền viewType vào DaySelector
              
            />

            {selectedDate && (
              <>
                <HourlyForecastList
                  selectedDate={selectedDate}
                  groupedByDay={groupedByDay}
                  hourlyScrollRef={hourlyScrollRef}
                  scrollX={scrollX}
                  expandedAll={expandedAll}
                  setExpandedAll={setExpandedAll}
                  showHourlyScrollButtons={showHourlyScrollButtons}
                />


              </>
            )}
          </Card>
        </>
      )}
    </div>
  );
};

export default Home;
