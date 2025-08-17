import React, { useEffect, useState, useContext } from "react";
import { Spin, Button, Typography, Card, Select } from "antd";
import { fetchHourlyForecast } from "../services/weatherService";
import DaySelectorHourly from "../components/DaySelectorHourly";
import HourlyChart from "../components/HourlyChart";
import ForecastRowHourly from "../components/ForecastRowHourly";
import styles from "../css/HourlyPage.style";
import { ThemeContext } from "../contexts/ThemeContext";

const { Title } = Typography;
const { Option } = Select;

const HourlyForecast = () => {
  const { darkMode } = useContext(ThemeContext);

  const [groupedByDay, setGroupedByDay] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [expandedRows, setExpandedRows] = useState({});
  const [expandedAll, setExpandedAll] = useState(false);
  const [unit, setUnit] = useState("metric");
  const [loading, setLoading] = useState(false);
  const [chartType, setChartType] = useState("temp");

  useEffect(() => {
    loadWeather();
  }, [unit]);

  const loadWeather = async () => {
    setLoading(true);
    try {
      const list = await fetchHourlyForecast("Ho Chi Minh", unit);
      groupByDay(list);
      setSelectedDate(list[0]?.dt_txt.split(" ")[0]);
      setExpandedRows({});
      setExpandedAll(false);
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

  const toggleRow = (index) => {
    setExpandedRows((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const toggleAllRows = () => {
    if (expandedAll) {
      setExpandedRows({});
      setExpandedAll(false);
    } else {
      const allOpen = {};
      groupedByDay[selectedDate]?.forEach((_, idx) => {
        allOpen[idx] = true;
      });
      setExpandedRows(allOpen);
      setExpandedAll(true);
    }
  };

  return (
    <Spin spinning={loading}>
      <div style={styles.container(darkMode)}>
        {/* Header */}
        <div style={styles.header(darkMode)}>
          <Title level={3} style={styles.title(darkMode)}>
            Dự báo thời tiết theo giờ
          </Title>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <Button type="primary" onClick={handleUnitToggle} style={styles.button(darkMode)}>
              Đổi sang °{unit === "metric" ? "F" : "C"}
            </Button>
            <Select value={chartType} onChange={setChartType} style={styles.select(darkMode)}>
              <Option value="temp">Nhiệt độ</Option>
              <Option value="humidity">Độ ẩm</Option>
              <Option value="rain">Lượng mưa</Option>
              <Option value="wind">Tốc độ gió</Option>
            </Select>
          </div>
        </div>

        {/* Bộ chọn ngày */}
        <DaySelectorHourly
          dates={Object.keys(groupedByDay)}
          selectedDate={selectedDate}
          onSelect={setSelectedDate}
        />

        {/* Biểu đồ */}
        <Card style={styles.chartCard(darkMode)}>
          <HourlyChart
            data={
              groupedByDay[selectedDate]?.map((item) => ({
                time: item.dt_txt.split(" ")[1].slice(0, 5),
                temp: item.main.temp,
                humidity: item.main.humidity,
                rain: item.rain?.["3h"] || 0,
                wind: item.wind.speed,
              })) || []
            }
            unit={unit}
            dataKey={chartType}
            label={
              chartType === "temp"
                ? "Nhiệt độ"
                : chartType === "humidity"
                ? "Độ ẩm"
                : chartType === "rain"
                ? "Lượng mưa"
                : "Tốc độ gió"
            }
            darkMode={darkMode}
          />
        </Card>

        {/* Nút xem tất cả */}
        <Button onClick={toggleAllRows} style={styles.toggleAllButton(darkMode)}>
          {expandedAll ? "Thu gọn tất cả" : "Xem chi tiết tất cả"}
        </Button>

        {/* Các dòng dự báo */}
        {groupedByDay[selectedDate]?.map((item, index) => (
          <ForecastRowHourly
            key={index}
            item={item}
            index={index}
            isOpen={expandedRows[index] || false}
            onToggle={() => toggleRow(index)}
            unit={unit}
            darkMode={darkMode}
            style={styles.forecastRow(darkMode, index)}
          />
        ))}
      </div>
    </Spin>
  );
};

export default HourlyForecast;
