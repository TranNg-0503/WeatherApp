import React from "react";
import { Button, Card } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

const DaySelector = ({
  groupedByDay,
  selectedDate,
  setSelectedDate,
  getIconFromDate,

  dateScrollRef,
  scrollX,
  viewType,
}) => {
  const formatDateLabel = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("vi-VN", {
      weekday: "short",
      day: "numeric",
      month: "numeric",
    });
  };

  const getDataByViewType = (entries) => {
    if (!entries?.length) return 0;
    switch (viewType) {
      case "rain":
        return entries.reduce((sum, e) => sum + (e.rain?.["3h"] || 0), 0);
      case "wind":
        return Math.max(...entries.map((e) => e.wind?.speed || 0));
      case "temp":
      default: {
        const temps = entries.map((e) => e.main.temp);
        const max = Math.max(...temps);
        const min = Math.min(...temps);
        return (max + min) / 2;
      }
    }
  };

  const getDisplayText = (entries) => {
    if (!entries?.length) return "";
    switch (viewType) {
      case "rain":
        return `${Math.round(getDataByViewType(entries))} mm`;
      case "wind":
        return `${Math.round(getDataByViewType(entries))} m/s`;
      case "temp":
      default: {
        const temps = entries.map((e) => e.main.temp);
        const max = Math.max(...temps);
        const min = Math.min(...temps);
        return `${Math.round(max)}° / ${Math.round(min)}°`;
      }
    }
  };

  const allValues = Object.values(groupedByDay).map(getDataByViewType);
  const maxValue = Math.max(...allValues, 1); // tránh chia 0

  return (
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
          const isSelected = selectedDate === dateStr;
          const value = getDataByViewType(groupedByDay[dateStr]);
          const heightPercent = Math.min(100, (value / maxValue) * 100);

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
                  position: "relative",
                }}
                bodyStyle={{ padding: 12 }}
              >
                {/* ✅ Pill nằm BÊN PHẢI */}
                <div
                  style={{
                    position: "absolute",
                    right: 6,
                    top: 12,
                    bottom: 12,
                    width: 6,
                    borderRadius: 4,
                    backgroundColor: "#00c6ae44",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: `${heightPercent}%`,
                      backgroundColor: "#00C6AE",
                      borderRadius: 4,
                      width: "100%",
                      transition: "height 0.3s ease",
                      position: "absolute",
                      bottom: 0,
                    }}
                  />
                </div>

                <div style={{ fontWeight: 600, paddingRight: 8 }}>
                  {formatDateLabel(dateStr)}
                </div>
                {icon && (
                  <img
                    src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
                    alt="weather-icon"
                    style={{ width: 40, height: 40 }}
                  />
                )}
                <div style={{ fontSize: 14 }}>
                  {getDisplayText(groupedByDay[dateStr])}
                </div>
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
  );
};

export default DaySelector;
