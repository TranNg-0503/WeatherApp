import React from "react";

const HourlyForecast = ({ data }) => {
  const sliced = data.slice(0, 12); // lấy 12 giờ tiếp theo

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>Dự báo hàng giờ</h2>
      <div
        style={{
          display: "flex",
          gap: 12,
          overflowX: "auto",
          paddingBottom: 8,
        }}
      >
        {sliced.map((hour, idx) => (
          <div
            key={idx}
            style={{
              minWidth: 100,
              backgroundColor: "#1e293b",
              color: "#fff",
              padding: 12,
              borderRadius: 12,
              textAlign: "center",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <div style={{ fontSize: 12, marginBottom: 4 }}>
              {new Date(hour.dt * 1000).getHours()}:00
            </div>
            <div style={{ fontSize: 20 }}>{Math.round(hour.temp)}°</div>
            <div style={{ fontSize: 12, marginBottom: 8 }}>
              {hour.weather[0].description}
            </div>
            <div style={{ fontSize: 11 }}>
              🌡️ {Math.round(hour.feels_like)}° <br />
              💧 {hour.humidity}% <br />
              🌬️ {hour.wind_speed} km/h
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HourlyForecast;
