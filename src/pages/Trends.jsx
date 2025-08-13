import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Trends = () => {
  const [chartData, setChartData] = useState(null);
  const [insight, setInsight] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      // Lấy dữ liệu lịch sử từ Open-Meteo
      const res = await fetch(
        "https://archive-api.open-meteo.com/v1/era5?latitude=10.8231&longitude=106.6297&start_date=2010-01-01&end_date=2024-12-31&daily=temperature_2m_max,temperature_2m_min&timezone=auto"
      );
      const data = await res.json();

      // Tính trung bình ngày
      const dailyAvg = data.daily.time.map((_, i) => {
        return (
          (data.daily.temperature_2m_max[i] +
            data.daily.temperature_2m_min[i]) /
          2
        );
      });

      // Gom theo năm → tính trung bình năm
      const yearlyData = {};
      data.daily.time.forEach((date, i) => {
        const year = date.split("-")[0];
        if (!yearlyData[year]) yearlyData[year] = [];
        yearlyData[year].push(dailyAvg[i]);
      });

      const years = Object.keys(yearlyData);
      const avgPerYear = years.map((year) => {
        const temps = yearlyData[year];
        return temps.reduce((sum, t) => sum + t, 0) / temps.length;
      });

      // Logic tạo insight giống MSN Weather
      const lastYear = years[years.length - 1];
      const lastTemp = avgPerYear[avgPerYear.length - 1];
      const recentTemps = avgPerYear.slice(-11, -1); // 10 năm trước
      const avg10Years =
        recentTemps.reduce((sum, t) => sum + t, 0) / recentTemps.length;
      const diff = lastTemp - avg10Years;

      let insightText = "";
      if (Math.abs(diff) < 0.2) {
        insightText = `Nhiệt độ năm ${lastYear} gần như bằng trung bình 10 năm qua (${lastTemp.toFixed(
          1
        )}°C).`;
      } else if (diff > 0) {
        insightText = `Năm ${lastYear} nóng hơn trung bình 10 năm qua ${diff.toFixed(
          1
        )}°C.`;
      } else {
        insightText = `Năm ${lastYear} mát hơn trung bình 10 năm qua ${Math.abs(
          diff
        ).toFixed(1)}°C.`;
      }

      setInsight(insightText);

      // Dữ liệu cho chart
      setChartData({
        labels: years,
        datasets: [
          {
            label: "Nhiệt độ trung bình năm (°C) - TP.HCM",
            data: avgPerYear,
            borderColor: "rgb(75, 192, 192)",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            tension: 0.3,
          },
        ],
      });
    };

    fetchData();
  }, []);

  return (
    <div style={{ width: "80%", margin: "0 auto" }}>
      <h2>Xu hướng nhiệt độ trung bình năm</h2>
      {chartData ? (
        <>
          <Line data={chartData} />
          <div
            style={{
              marginTop: "20px",
              padding: "10px",
              background: "#f1f1f1",
              borderRadius: "8px",
            }}
          >
            <strong>Insight: </strong>
            {insight}
          </div>
        </>
      ) : (
        <p>Đang tải dữ liệu...</p>
      )}
    </div>
  );
};

export default Trends;
