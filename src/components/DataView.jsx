import React from "react";
import { Card, Typography, Progress } from "antd";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import weekday from "dayjs/plugin/weekday";
import isToday from "dayjs/plugin/isToday";
import isYesterday from "dayjs/plugin/isYesterday";
import isTomorrow from "dayjs/plugin/isTomorrow";

import { Droplet } from "lucide-react";

const { Text } = Typography;

dayjs.extend(weekday);
dayjs.extend(isToday);
dayjs.extend(isYesterday);
dayjs.extend(isTomorrow);
dayjs.locale("vi");

const formatDay = (dateStr) => {
  const date = dayjs(dateStr);
  if (date.isToday()) return "Hôm nay";
  if (date.isYesterday()) return "Hôm qua";
  if (date.isTomorrow()) return "Ngày mai";
  return `${date.format("dd")}\n${date.format("D")}`;
};

const DataView = ({ data, type }) => {
  const groupedData = {};

  data.forEach((item) => {
    const date = item.dt_txt.split(" ")[0];
    if (!groupedData[date]) groupedData[date] = [];
    groupedData[date].push(item);
  });

  const renderValue = (entries) => {
    if (type === "rain") {
      const total = entries.reduce((sum, entry) => sum + (entry.rain?.["3h"] || 0), 0);
      const percent = Math.min(100, Math.round((total / 1) * 100));
      return {
        value: `${total.toFixed(2)} cm`,
        percent,
        icon: <Droplet size={16} />,
      };
    } else if (type === "temp") {
      const temps = entries.map((e) => e.main.temp);
      const max = Math.max(...temps);
      const min = Math.min(...temps);
      return {
        value: `${Math.round(min)}° / ${Math.round(max)}°`,
        percent: Math.round(((max + min) / 2 / 40) * 100),
        icon: <Text style={{ fontSize: 14 }}>🌡️</Text>,
      };
    }
    return {};
  };

  return (
    <div
      style={{
        display: "flex",
        overflowX: "auto",
        gap: 16,
        paddingBottom: 8,
      }}
    >
      {Object.entries(groupedData).map(([date, entries]) => {
        const { value, percent, icon } = renderValue(entries);
        return (
          <Card
            key={date}
            style={{
              minWidth: 100,
              background: "#2a2d4a",
              color: "white",
              borderRadius: 12,
              textAlign: "center",
            }}
            bodyStyle={{ padding: 12 }}
          >
            <div style={{ fontSize: 12, color: "#aaa" }}>{formatDay(date)}</div>
            <div style={{ fontSize: 18, margin: "4px 0" }}>{value}</div>
            <Progress
              percent={percent}
              showInfo={false}
              strokeColor="#4096ff"
              strokeWidth={6}
            />
            <div style={{ marginTop: 6 }}>{icon}</div>
          </Card>
        );
      })}
    </div>
  );
};

export default DataView;
