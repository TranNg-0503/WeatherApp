import React, { useEffect, useState } from "react";
import { Spin, Button, Typography, Card } from "antd";
import { fetchHourlyForecast } from "../services/weatherService";
import DaySelectorHourly from "../components/DaySelectorHourly";
import HourlyChart from "../components/HourlyChart";
import ForecastRowHourly from "../components/ForecastRowHourly";
import styles from "../css/HourlyPage.style";

const { Title } = Typography;

const HourlyForecast = () => {
  const [groupedByDay, setGroupedByDay] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [expandedRows, setExpandedRows] = useState({});
  const [expandedAll, setExpandedAll] = useState(false);
  const [unit, setUnit] = useState("metric");
  const [loading, setLoading] = useState(false);

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
      <div style={styles.container}>
        <div style={styles.header}>
          <Title level={3}>Dự báo thời tiết theo giờ</Title>
          <Button onClick={handleUnitToggle}>
            Đổi sang °{unit === "metric" ? "F" : "C"}
          </Button>
        </div>

        <DaySelectorHourly
          dates={Object.keys(groupedByDay)}
          selectedDate={selectedDate}
          onSelect={setSelectedDate}
        />

        <Card style={styles.chartCard}>
          <HourlyChart
            data={
              groupedByDay[selectedDate]?.map((item) => ({
                time: item.dt_txt.split(" ")[1].slice(0, 5),
                temp: item.main.temp,
              })) || []
            }
            unit={unit}
          />
        </Card>

        <Button onClick={toggleAllRows} style={styles.toggleAllButton}>
          {expandedAll ? "Thu gọn tất cả" : "Xem chi tiết tất cả"}
        </Button>

        {groupedByDay[selectedDate]?.map((item, index) => (
          <ForecastRowHourly
            key={index}
            item={item}
            index={index}
            isOpen={expandedRows[index] || false}
            onToggle={() => toggleRow(index)}
            unit={unit}
          />
        ))}
      </div>
    </Spin>
  );
};

export default HourlyForecast;
