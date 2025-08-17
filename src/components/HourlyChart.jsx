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

// 🎨 Gradient line chart (temp vàng neon + glow)
const getLineGradient = (dataKey) => {
  switch (dataKey) {
    case "temp":
      return (
        <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFD700" stopOpacity={1} />
          <stop offset="100%" stopColor="#FFD700" stopOpacity={1} />
        </linearGradient>
      );
    case "humidity":
      return (
        <linearGradient id="colorHumidity" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#00e5ff" stopOpacity={1} />
          <stop offset="95%" stopColor="#007bff" stopOpacity={0.8} />
        </linearGradient>
      );
    case "rain":
      return (
        <linearGradient id="colorRain" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#76ff03" stopOpacity={1} />
          <stop offset="95%" stopColor="#00c853" stopOpacity={0.8} />
        </linearGradient>
      );
    case "wind":
      return (
        <linearGradient id="colorWind" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#b388ff" stopOpacity={1} />
          <stop offset="95%" stopColor="#7c4dff" stopOpacity={0.8} />
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
      background: "rgba(173,216,230,0.9)",
      borderRadius: "1px",
    }}
  />
);

// 💦 Splash khi mưa chạm đáy
const RainSplash = ({ x, delay }) => (
  <motion.div
    initial={{ scale: 0, opacity: 0.7 }}
    animate={{ scale: [0, 1.5], opacity: [0.7, 0] }}
    transition={{
      repeat: Infinity,
      repeatType: "loop",
      duration: 1,
      delay,
    }}
    style={{
      position: "absolute",
      bottom: "5px",
      left: `${x}%`,
      width: "20px",
      height: "5px",
      borderRadius: "50%",
      background: "rgba(173,216,230,0.6)",
      filter: "blur(1px)",
    }}
  />
);

// 🌡 Mặt trời + shimmer
const SunEffect = () => (
  <>
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
    {/* shimmer nóng */}
    <motion.div
      animate={{ y: [0, -10, 0], opacity: [0.4, 0.8, 0.4] }}
      transition={{ repeat: Infinity, duration: 3 }}
      style={{
        position: "absolute",
        top: "60px",
        right: "25px",
        width: "20px",
        height: "60px",
        background: "linear-gradient(to top, rgba(255,200,0,0.4), transparent)",
        filter: "blur(3px)",
        borderRadius: "10px",
      }}
    />
  </>
);

// 🌬 Luồng gió + lá bay
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
          background: "rgba(255,255,255,0.4)",
          filter: "blur(2px)",
        }}
      />
    ))}
    {Array.from({ length: 5 }).map((_, i) => (
      <motion.div
        key={`leaf-${i}`}
        initial={{ x: "-10%", y: Math.random() * 100 }}
        animate={{ x: "120%", y: ["0%", "10%", "0%"] }}
        transition={{
          repeat: Infinity,
          duration: 6 + Math.random() * 3,
          ease: "easeInOut",
          delay: i * 1.2,
        }}
        style={{
          position: "absolute",
          width: "12px",
          height: "12px",
          background: "rgba(255,255,255,0.7)",
          borderRadius: "50%",
          filter: "blur(1px)",
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
        "radial-gradient(circle at 20% 40%, rgba(255,255,255,0.5) 25%, transparent 25%), radial-gradient(circle at 80% 60%, rgba(255,255,255,0.5) 25%, transparent 25%)",
      backgroundSize: "60px 60px",
      opacity: 0.5,
    }}
  />
);

// 🌫️ Sương mù
const FogEffect = () => (
  <>
    {Array.from({ length: 2 }).map((_, i) => (
      <motion.div
        key={i}
        animate={{ x: ["-20%", "120%"] }}
        transition={{
          repeat: Infinity,
          duration: 20 + i * 10,
          ease: "linear",
        }}
        style={{
          position: "absolute",
          top: `${30 + i * 20}%`,
          left: "-40%",
          width: "200%",
          height: "60px",
          background: "rgba(255,255,255,0.2)",
          filter: "blur(20px)",
        }}
      />
    ))}
  </>
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
    return Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 1 + Math.random() * 1.2,
    }));
  }, [dataKey]);

  // 🌧 splash
  const splashes = useMemo(() => {
    if (dataKey !== "rain") return [];
    return Array.from({ length: 8 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 2,
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
      {dataKey === "humidity" && (
        <>
          <WaveEffect />
          <FogEffect />
        </>
      )}
      {raindrops.map((drop) => (
        <RainDrop
          key={drop.id}
          x={drop.x}
          delay={drop.delay}
          duration={drop.duration}
        />
      ))}
      {splashes.map((s) => (
        <RainSplash key={s.id} x={s.x} delay={s.delay} />
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
            strokeWidth={dataKey === "temp" ? 5 : 4}
            dot={{ r: 4, strokeWidth: 2, fill: "#fff" }}
            activeDot={{ r: 7 }}
            isAnimationActive={true}
            animationDuration={1500}
            style={{
              filter:
                dataKey === "temp"
                  ? "drop-shadow(0px 0px 8px rgba(255, 215, 0, 0.9))"
                  : "none",
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default HourlyChart;
