import React, { useContext } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { ThemeContext } from "../contexts/ThemeContext";

ChartJS.register(ArcElement, Tooltip, Legend);

const weatherTypeMap = {
  type_21: "Nhiều mây",
  type_41: "Mây dày",
  type_42: "Mưa",
  type_43: "Trời quang",
};

const WeatherConditionPieChart = ({ days }) => {
  const { darkMode } = useContext(ThemeContext);

  if (!days || days.length === 0) return <p>Không có dữ liệu.</p>;

  let counts = { sunny: 0, rainy: 0, cloudy: 0 };

  days.forEach((day) => {
    const conditions = day.conditions.split(",").map((c) => c.trim());
    const mappedConditions = conditions.map(
      (cond) => weatherTypeMap[cond] || cond
    );

    if (mappedConditions.includes("Mưa")) {
      counts.rainy++;
    } else if (
      mappedConditions.includes("Nhiều mây") ||
      mappedConditions.includes("Mây dày")
    ) {
      counts.cloudy++;
    } else if (mappedConditions.includes("Trời quang")) {
      counts.sunny++;
    } else {
      counts.sunny++;
    }
  });

  // 🎨 Màu theo theme
  const colors = darkMode
    ? {
        sunny: "#FFD666", // vàng đậm
        rainy: "#40A9FF", // xanh dương sáng
        cloudy: "#8C8C8C", // xám sáng
      }
    : {
        sunny: "#FFD666", // vàng tươi
        rainy: "#69C0FF", // xanh dương nhạt
        cloudy: "#A0A0A0", // xám nhạt
      };

  const hoverColors = darkMode
    ? {
        sunny: "#FFE58F",
        rainy: "#69C0FF",
        cloudy: "#BFBFBF",
      }
    : {
        sunny: "#FFF1B8",
        rainy: "#91D5FF",
        cloudy: "#D9D9D9",
      };

  const data = {
    labels: ["Ngày nắng", "Ngày mưa", "Ngày nhiều mây"],
    datasets: [
      {
        data: [counts.sunny, counts.rainy, counts.cloudy],
        backgroundColor: [colors.sunny, colors.rainy, colors.cloudy],
        hoverBackgroundColor: [
          hoverColors.sunny,
          hoverColors.rainy,
          hoverColors.cloudy,
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    cutout: "60%",
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: darkMode ? "#ffffff" : "#000000", // màu chữ legend
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || "";
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} ngày (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div style={{ width: "300px", margin: "auto" }}>
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default WeatherConditionPieChart;
