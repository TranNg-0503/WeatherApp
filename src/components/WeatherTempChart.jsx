import React, { useContext } from "react";
import { ThemeContext } from "../contexts/ThemeContext";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const WeatherTempChart = ({ days }) => {
  const { darkMode } = useContext(ThemeContext); // ✅ Lấy đúng darkMode từ context

  if (!days || days.length === 0) return <p>Không có dữ liệu.</p>;

  const labels = days.map((day) => day.datetime.split("-")[2]);

  const tempMaxData = days.map((day) => day.tempmax);
  const tempMinData = days.map((day) => day.tempmin);
  const avgTempData = days.map((day) => (day.tempmax + day.tempmin) / 2);

  const dataMin = Math.min(...tempMinData);
  const dataMax = Math.max(...tempMaxData);

  const textColor = darkMode ? "#ffffff" : "#000000";
  const gridColor = darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)";

  const data = {
    labels,
    datasets: [
      {
        type: "bar",
        label: "Nhiệt độ cao nhất (°C)",
        data: tempMaxData,
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
        barPercentage: 0.6,
        categoryPercentage: 0.6,
      },
      {
        type: "bar",
        label: "Nhiệt độ thấp nhất (°C)",
        data: tempMinData,
        backgroundColor: "rgba(54, 162, 235, 0.5)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
        barPercentage: 0.6,
        categoryPercentage: 0.6,
      },
      {
        type: "line",
        label: "Nhiệt độ trung bình (°C)",
        data: avgTempData,
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 3,
        fill: false,
        tension: 0.3,
        pointRadius: 4,
        pointHoverRadius: 6,
        yAxisID: "y",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: { color: textColor },
      },
      title: {
        display: true,
        text: "Nhiệt độ cao nhất, thấp nhất và trung bình theo ngày",
        color: textColor,
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
    interaction: {
      mode: "nearest",
      axis: "x",
      intersect: false,
    },
    scales: {
      y: {
        beginAtZero: false,
        min: Math.floor(dataMin - 5),
        max: Math.ceil(dataMax + 5),
        title: { display: true, text: "Nhiệt độ (°C)", color: textColor },
        ticks: { color: textColor },
        grid: { color: gridColor },
      },
      x: {
        title: { display: true, text: "Ngày trong tháng", color: textColor },
        ticks: { color: textColor },
        grid: { color: gridColor },
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default WeatherTempChart;
