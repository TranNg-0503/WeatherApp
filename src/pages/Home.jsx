import stylesHome from "./Home.styles";
import React, { useEffect, useState, useRef, useContext } from "react";
import { Input, Spin, Typography, Card, Button, Radio, Switch } from "antd";
import { ThemeContext } from "../contexts/ThemeContext";
import WeatherCard from "../components/WeatherCard";
import HourlyForecastCard from "../components/HourlyForecastCard";
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
  const [hourlyForecast, setHourlyForecast] = useState([]); // có thể không dùng ngoài debug
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [groupedByDay, setGroupedByDay] = useState({});
  const [expandedAll, setExpandedAll] = useState(false);
  const [viewType, setViewType] = useState("rain");

  const [monthOffset, setMonthOffset] = useState(0);
  const [monthlyWeather, setMonthlyWeather] = useState([]);
  const [monthLabel, setMonthLabel] = useState("");

  const [tempUnit, setTempUnit] = useState("C"); // "C" hoặc "F"
  const dateScrollRef = useRef(null);
  const hourlyScrollRef = useRef(null);
  const [showHourlyScrollButtons, setShowHourlyScrollButtons] = useState(false);

  // Chuyển tempUnit thành unit của API
  const getApiUnit = (unit) => (unit === "C" ? "metric" : "imperial");

  const toggleTempUnit = () => {
    setTempUnit((prev) => (prev === "C" ? "F" : "C"));
  };

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

  // === Helpers: tạo khóa ngày & kiểm tra thuộc ngày theo timezone offset (giây) ===
  const makeDateKey = (unixUtcSec, tzOffsetSec) => {
    // cộng offset -> tạo Date tại "giờ địa phương thành phố", sau đó lấy UTC parts để tránh dính timezone máy
    const d = new Date((unixUtcSec + tzOffsetSec) * 1000);
    const y = d.getUTCFullYear();
    const m = String(d.getUTCMonth() + 1).padStart(2, "0");
    const day = String(d.getUTCDate()).padStart(2, "0");
    return `${y}-${m}-${day}`; // YYYY-MM-DD
  };

  const isInDateKey = (unixUtcSec, tzOffsetSec, dateKey) =>
    makeDateKey(unixUtcSec, tzOffsetSec) === dateKey;

  const loadWeather = async (cityName, unit = tempUnit) => {
    setLoading(true);
    try {
      const apiUnit = getApiUnit(unit);

      // Lấy current và forecast
      const current = await fetchCurrentWeather(cityName, apiUnit);
      const forecastRes = await fetchHourlyForecast(cityName, apiUnit);

      // Giữ lại để debug (không bắt buộc)
      setWeatherData(current);

      // forecastRes có thể là mảng (list) hoặc object { list, city }
      const list = Array.isArray(forecastRes)
        ? forecastRes
        : forecastRes?.list || [];
      const apiTzOffset =
        // Ưu tiên offset từ forecast.city, sau đó current.timezone; fallback +7h cho VN
        (forecastRes?.city?.timezone ??
          current?.timezone ??
          7 * 3600); // giây

      setHourlyForecast(list);

      // Group theo ngày dựa trên timezone offset của city
      const groups = {};
      for (const item of list) {
        // OpenWeather 5-day/3h: item.dt là UTC seconds
        const key = makeDateKey(item.dt, apiTzOffset);
        if (!groups[key]) groups[key] = [];
        groups[key].push(item);
      }

      // Sắp xếp các entry trong từng ngày theo thời gian tăng dần (an toàn)
      Object.keys(groups).forEach((k) =>
        groups[k].sort((a, b) => a.dt - b.dt)
      );

      setGroupedByDay(groups);

      // Chọn ngày đầu tiên theo thứ tự tăng dần, hoặc hôm nay nếu có
      const keys = Object.keys(groups).sort(); // YYYY-MM-DD nên sort string là đủ
      const todayKeyFromCurrent = current?.dt
        ? makeDateKey(current.dt, apiTzOffset)
        : null;
      setSelectedDate(
        (todayKeyFromCurrent && groups[todayKeyFromCurrent] && todayKeyFromCurrent) ||
          keys[0] ||
          null
      );
    } catch (err) {
      console.error("Lỗi khi lấy thời tiết:", err);
    }
    setLoading(false);
  };

  const loadMonthlyWeather = async (city, offset) => {
    try {
      const apiUnit = getApiUnit(tempUnit);
      const data = await fetchMonthlyWeather(city, offset, apiUnit);
      setMonthlyWeather(data.days);
      setMonthLabel(`${data.month}/${data.year}`);
    } catch (err) {
      console.error("Lỗi khi fetch monthly weather:", err);
    }
  };

  useEffect(() => {
    loadWeather(city, tempUnit);
    loadMonthlyWeather(city, monthOffset);
  }, []);

  // Khi đổi đơn vị → gọi lại API
  useEffect(() => {
    loadWeather(city, tempUnit);
    loadMonthlyWeather(city, monthOffset);
  }, [tempUnit]);

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
    return `${Math.round(Math.max(...temps))}°${tempUnit} / ${Math.round(
      Math.min(...temps)
    )}°${tempUnit}`;
  };

  const handleLoadNextMonthWeather = async () => {
    const newMonthOffset = monthOffset + 1;
    setMonthOffset(newMonthOffset);
    await loadMonthlyWeather(city, newMonthOffset);
  };

  const handleLoadPrevMonthWeather = async () => {
    const newMonthOffset = monthOffset - 1;
    setMonthOffset(newMonthOffset);
    await loadMonthlyWeather(city, newMonthOffset);
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <div style={styles.searchContainer}>
          {/* Thanh tìm kiếm */}
          <Input.Search
            placeholder="Tìm kiếm vị trí"
            onSearch={(value) => {
              if (!value) return;
              setCity(value);
              loadWeather(value, tempUnit);
              loadMonthlyWeather(value, monthOffset);
            }}
            enterButton
            size="large"
            style={styles.searchInput}
          />

          {/* Nút toggle đơn vị */}
          <Switch
            checkedChildren="°F"
            unCheckedChildren="°C"
            checked={tempUnit === "F"}
            onChange={toggleTempUnit}
          />
        </div>

        {loading ? (
          <Spin />
        ) : (
          <>
            {/* Thời tiết hiện tại */}
            <div style={styles.currentWeather}>
              <WeatherCard weatherData={weatherData} tempUnit={tempUnit} />
            </div>

            {/* Dự báo từng ngày */}
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

                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
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
                      {/* Vì đã group đúng theo timezone, chỉ cần map thẳng */}
                      {groupedByDay[selectedDate]?.map((hour, idx) => (
                        <div key={idx} style={{ minWidth: 160 }}>
                          <HourlyForecastCard
                            data={hour}
                            expandedAll={expandedAll}
                            viewType={viewType}
                            tempUnit={tempUnit}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              )}
            </Card>

            {/* Dự báo tháng */}
            <div style={styles.monthlyNav}>
              <Button onClick={handleLoadPrevMonthWeather}>
                Tháng trước
              </Button>
              <h2 style={styles.monthTitle}>Tháng {monthLabel}</h2>
              <Button  onClick={handleLoadNextMonthWeather}>
                Tháng sau
              </Button>
            </div>

            <div style={styles.monthlyGrid}>
              {monthlyWeather.map((day, idx) => (
                <Card key={idx} style={styles.monthlyCard}>
                  <div>{day.datetime}</div>
                  <div>
                    🌡️ {Math.round(day.tempmax)}°{tempUnit} /{" "}
                    {Math.round(day.tempmin)}°{tempUnit}
                  </div>
                  <div>☁️ {day.conditions}</div>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
