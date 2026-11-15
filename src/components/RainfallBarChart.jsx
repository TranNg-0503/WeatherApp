import React, { useContext } from "react";
import { ThemeContext } from "../contexts/ThemeContext";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const RainfallBarChart = ({ dailyWeather }) => {
  const { darkMode } = useContext(ThemeContext);

  const labels = dailyWeather.map((item) =>
    new Date(item.date).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
    })
  );
  const rainfallData = dailyWeather.map((item) => item.precipitation);

  const textColor = darkMode ? "#fff" : "#000";
  const gridColor = darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)";
  const barColor = darkMode
    ? "rgba(255, 193, 7, 0.7)"
    : "rgba(54, 162, 235, 0.6)";
  const borderBarColor = darkMode
    ? "rgba(255, 193, 7, 1)"
    : "rgba(54, 162, 235, 1)";

  const data = {
    labels,
    datasets: [
      {
        label: "Lượng mưa (mm)",
        data: rainfallData,
        backgroundColor: barColor,
        borderColor: borderBarColor,
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: textColor,
        },
      },
      title: {
        display: true,
        text: "Lượng mưa hàng ngày",
        color: textColor,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "mm mưa",
          color: textColor,
        },
        ticks: {
          color: textColor,
        },
        grid: {
          color: gridColor,
        },
      },
      x: {
        title: {
          display: true,
          text: "Ngày",
          color: textColor,
        },
        ticks: {
          color: textColor,
        },
        grid: {
          color: gridColor,
        },
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default RainfallBarChart;
