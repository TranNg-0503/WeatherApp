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

import {
  getBackgroundGradient,
  getLineGradient,
  RainDrop,
  RainSplash,
  SunEffect,
  WindEffect,
  WaveEffect,
  FogEffect,
} from "../css/HourlyChart.style";

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

  const raindrops = useMemo(() => {
    if (dataKey !== "rain") return [];
    return Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 1 + Math.random() * 1.2,
    }));
  }, [dataKey]);

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
                ? "url(#line-temp)"
                : dataKey === "humidity"
                ? "url(#line-humidity)"
                : dataKey === "rain"
                ? "url(#line-rain)"
                : "url(#line-wind)"
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
