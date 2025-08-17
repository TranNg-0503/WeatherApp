// src/components/HourlyChart.jsx
import React, { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { motion } from "framer-motion";

// 🎨 Gradient nền theo loại dữ liệu
const getBackgroundGradient = (dataKey) => {
  switch (dataKey) {
    case "temp":
      return "linear-gradient(135deg, #ff9a9e, #ff6a00, #ff3c00)";
    case "humidity":
      return "linear-gradient(135deg, #2193b0, #6dd5ed)";
    case "rain":
      return "linear-gradient(135deg, #0f2027, #203a43, #2c5364)";
    case "wind":
      return "linear-gradient(135deg, #8e2de2, #4a00e0)";
    default:
      return "linear-gradient(135deg, #bdc3c7, #2c3e50)";
  }
};

// 🎨 Gradient line chart
const getLineGradient = (dataKey) => {
  switch (dataKey) {
    case "temp":
      return (
        <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#ff7300" stopOpacity={0.9} />
          <stop offset="95%" stopColor="#ff0000" stopOpacity={0.3} />
        </linearGradient>
      );
    case "humidity":
      return (
        <linearGradient id="colorHumidity" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#007bff" stopOpacity={0.9} />
          <stop offset="95%" stopColor="#66b2ff" stopOpacity={0.3} />
        </linearGradient>
      );
    case "rain":
      return (
        <linearGradient id="colorRain" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#00c853" stopOpacity={0.9} />
          <stop offset="95%" stopColor="#b9f6ca" stopOpacity={0.3} />
        </linearGradient>
      );
    case "wind":
      return (
        <linearGradient id="colorWind" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#6a1b9a" stopOpacity={0.9} />
          <stop offset="95%" stopColor="#ba68c8" stopOpacity={0.3} />
        </linearGradient>
      );
    default:
      return null;
  }
};

// 🌧 Hạt mưa
const RainDrop = ({ x, delay, duration }) => (
  <motion.div
    initial={{ y: -20, opacity: 0 }}
    animate={{ y: "110%", opacity: [0, 1, 0] }}
    transition={{
      repeat: Infinity,
      repeatType: "loop",
      ease: "easeIn",
      delay,
      duration,
    }}
    style={{
      position: "absolute",
      left: `${x}%`,
      width: "2px",
      height: "15px",
      background: "rgba(173,216,230,0.8)",
      borderRadius: "1px",
    }}
  />
);

// 🌡 Mặt trời + tỏa sáng
const SunEffect = () => (
  <motion.div
    animate={{ rotate: 360, scale: [1, 1.1, 1] }}
    transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
    style={{
      position: "absolute",
      top: "10px",
      right: "10px",
      width: "50px",
      height: "50px",
      borderRadius: "50%",
      background: "radial-gradient(circle, #FFD700, #FF8C00)",
      boxShadow: "0 0 25px 12px rgba(255,140,0,0.6)",
    }}
  />
);

// 🌬 Nhiều luồng gió
const WindEffect = () => (
  <>
    {Array.from({ length: 3 }).map((_, i) => (
      <motion.div
        key={i}
        animate={{ x: ["-20%", "120%"] }}
        transition={{
          repeat: Infinity,
          duration: 4 + i * 2,
          ease: "linear",
          delay: i,
        }}
        style={{
          position: "absolute",
          top: `${40 + i * 15}%`,
          left: "-30%",
          width: "70%",
          height: "3px",
          borderRadius: "2px",
          background: "rgba(255,255,255,0.5)",
          filter: "blur(2px)",
        }}
      />
    ))}
  </>
);

// 💧 Sóng nước
const WaveEffect = () => (
  <motion.div
    animate={{ x: ["0%", "100%"] }}
    transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
    style={{
      position: "absolute",
      bottom: "0",
      left: "-100%",
      width: "200%",
      height: "50px",
      background:
        "radial-gradient(circle at 20% 40%, rgba(255,255,255,0.6) 25%, transparent 25%), radial-gradient(circle at 80% 60%, rgba(255,255,255,0.6) 25%, transparent 25%)",
      backgroundSize: "60px 60px",
      opacity: 0.5,
    }}
  />
);

const HourlyChart = ({ data, unit, dataKey, label }) => {
  const formatValue = (value) => {
    if (dataKey === "temp") {
      return `${Math.round(value)}°${unit === "metric" ? "C" : "F"}`;
    } else if (dataKey === "humidity") {
      return `${value}%`;
    } else if (dataKey === "rain") {
      return `${value} mm`;
    } else if (dataKey === "wind") {
      return `${value} ${unit === "metric" ? "m/s" : "mph"}`;
    }
    return value;
  };

  // 🌧 tạo nhiều hạt mưa
  const raindrops = useMemo(() => {
    if (dataKey !== "rain") return [];
    return Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 1 + Math.random() * 1.2,
    }));
  }, [dataKey]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      style={{
        position: "relative",
        overflow: "hidden",
        background: getBackgroundGradient(dataKey),
        borderRadius: "20px",
        padding: "20px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.25)",
      }}
    >
      {/* Hiệu ứng riêng */}
      {dataKey === "temp" && <SunEffect />}
      {dataKey === "wind" && <WindEffect />}
      {dataKey === "humidity" && <WaveEffect />}
      {raindrops.map((drop) => (
        <RainDrop
          key={drop.id}
          x={drop.x}
          delay={drop.delay}
          duration={drop.duration}
        />
      ))}

      {/* Chart */}
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data}>
          <defs>{getLineGradient(dataKey)}</defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff55" />
          <XAxis dataKey="time" stroke="#fff" />
          <YAxis
            domain={["auto", "auto"]}
            tickFormatter={formatValue}
            stroke="#fff"
          />
          <RechartsTooltip
            formatter={(value) => formatValue(value)}
            labelFormatter={(t) => `${t} - ${label}`}
            contentStyle={{
              backgroundColor: "#222",
              borderRadius: "10px",
              color: "#fff",
            }}
          />
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={
              dataKey === "temp"
                ? "url(#colorTemp)"
                : dataKey === "humidity"
                ? "url(#colorHumidity)"
                : dataKey === "rain"
                ? "url(#colorRain)"
                : "url(#colorWind)"
            }
            strokeWidth={3}
            dot={{ r: 4, strokeWidth: 2, fill: "#fff" }}
            activeDot={{ r: 7 }}
            isAnimationActive={true}
            animationDuration={1500}
          />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default HourlyChart;
