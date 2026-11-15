import React from "react";
import { motion } from "framer-motion";

// 🎨 Gradient nền theo loại dữ liệu
export const getBackgroundGradient = (dataKey) => {
  const gradients = {
    temp: "linear-gradient(135deg, #ff9a9e, #ff6a00, #ff3c00)",
    humidity: "linear-gradient(135deg, #2193b0, #6dd5ed)",
    rain: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
    wind: "linear-gradient(135deg, #8e2de2, #4a00e0)",
    default: "linear-gradient(135deg, #bdc3c7, #2c3e50)",
  };
  return gradients[dataKey] || gradients.default;
};

// 🎨 Gradient line chart
export const getLineGradient = (dataKey) => {
  const gradients = {
    temp: (
      <linearGradient id="line-temp" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#FFD700" stopOpacity={1} />
        <stop offset="100%" stopColor="#FFA500" stopOpacity={1} />
      </linearGradient>
    ),
    humidity: (
      <linearGradient id="line-humidity" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor="#00e5ff" stopOpacity={1} />
        <stop offset="95%" stopColor="#007bff" stopOpacity={0.8} />
      </linearGradient>
    ),
    rain: (
      <linearGradient id="line-rain" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor="#76ff03" stopOpacity={1} />
        <stop offset="95%" stopColor="#00c853" stopOpacity={0.8} />
      </linearGradient>
    ),
    wind: (
      <linearGradient id="line-wind" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor="#b388ff" stopOpacity={1} />
        <stop offset="95%" stopColor="#7c4dff" stopOpacity={0.8} />
      </linearGradient>
    ),
  };
  return gradients[dataKey] || null;
};

// 🌧 Hạt mưa
export const RainDrop = ({ x, delay, duration }) => (
  <motion.div
    initial={{ y: -20, opacity: 0 }}
    animate={{ y: "110%", opacity: [0, 1, 0] }}
    transition={{ repeat: Infinity, repeatType: "loop", ease: "easeIn", delay, duration }}
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

// 💦 Splash
export const RainSplash = ({ x, delay }) => (
  <motion.div
    initial={{ scale: 0, opacity: 0.7 }}
    animate={{ scale: [0, 1.5], opacity: [0.7, 0] }}
    transition={{ repeat: Infinity, repeatType: "loop", duration: 1, delay }}
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

// 🌡 Mặt trời
export const SunEffect = () => (
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

// 🌬 Gió
export const WindEffect = () => (
  <>
    {Array.from({ length: 3 }).map((_, i) => (
      <motion.div
        key={i}
        animate={{ x: ["-20%", "120%"] }}
        transition={{ repeat: Infinity, duration: 4 + i * 2, ease: "linear", delay: i }}
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
  </>
);

// 💧 Sóng
export const WaveEffect = () => (
  <motion.div
    animate={{ x: ["0%", "-100%"] }}
    transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
    style={{
      position: "absolute",
      bottom: 0,
      left: 0,
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
export const FogEffect = () => (
  <>
    {Array.from({ length: 2 }).map((_, i) => (
      <motion.div
        key={i}
        animate={{ x: ["-30%", "130%"] }}
        transition={{ repeat: Infinity, duration: 25 + i * 10, ease: "linear" }}
        style={{
          position: "absolute",
          top: `${25 + i * 25}%`,
          left: "-30%",
          width: "160%",
          height: "70px",
          background: "rgba(255,255,255,0.15)",
          filter: "blur(25px)",
        }}
      />
    ))}
  </>
);
