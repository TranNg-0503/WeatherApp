import React, { useEffect, useState } from "react";
import { Input, Spin } from "antd";
import WeatherCard from "../components/WeatherCard";
import { fetchCurrentWeather } from "../services/weatherService";

const Home = () => {
  const [city, setCity] = useState("Ho Chi Minh");
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadWeather = async (cityName) => {
    setLoading(true);
    try {
      const data = await fetchCurrentWeather(cityName);
      setWeatherData(data);
    } catch (err) {
      console.error("Lỗi khi lấy thời tiết:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadWeather(city);
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <Input.Search
        placeholder="Tìm kiếm vị trí"
        onSearch={(value) => {
          setCity(value);
          loadWeather(value);
        }}
        enterButton
        style={{ maxWidth: 300, marginBottom: 24 }}
      />
      {loading ? <Spin /> : <WeatherCard weatherData={weatherData} />}
    </div>
  );
};

export default Home;
