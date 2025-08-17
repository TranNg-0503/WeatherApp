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
  const [records, setRecords] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(
        "https://archive-api.open-meteo.com/v1/era5?latitude=10.8231&longitude=106.6297&start_date=2010-01-01&end_date=2024-12-31&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,relative_humidity_2m_mean&timezone=auto"
      );
      const data = await res.json();

      // Tính nhiệt độ trung bình ngày
      const dailyAvgTemp = data.daily.time.map((_, i) => {
        return (
          (data.daily.temperature_2m_max[i] +
            data.daily.temperature_2m_min[i]) /
          2
        );
      });

      const dailyRain = data.daily.precipitation_sum;
      const dailyHumidity = data.daily.relative_humidity_2m_mean;

      // Gom theo năm
      const yearlyTemp = {};
      const yearlyRain = {};
      const yearlyHumidity = {};

      data.daily.time.forEach((date, i) => {
        const year = date.split("-")[0];
        if (!yearlyTemp[year]) {
          yearlyTemp[year] = [];
          yearlyRain[year] = [];
          yearlyHumidity[year] = [];
        }
        yearlyTemp[year].push(dailyAvgTemp[i]);
        yearlyRain[year].push(dailyRain[i]);
        yearlyHumidity[year].push(dailyHumidity[i]);
      });

      const years = Object.keys(yearlyTemp);
      const avgTempPerYear = years.map(
        (year) =>
          yearlyTemp[year].reduce((a, b) => a + b, 0) / yearlyTemp[year].length
      );
      const totalRainPerYear = years.map((year) =>
        yearlyRain[year].reduce((a, b) => a + b, 0)
      );
      const avgHumidityPerYear = years.map(
        (year) =>
          yearlyHumidity[year].reduce((a, b) => a + b, 0) /
          yearlyHumidity[year].length
      );

      // Tạo insight
      const lastYear = years[years.length - 1];
      const tempChange =
        avgTempPerYear[avgTempPerYear.length - 1] - avgTempPerYear[0];
      const rainChange =
        totalRainPerYear[totalRainPerYear.length - 1] - totalRainPerYear[0];
      const humChange =
        avgHumidityPerYear[avgHumidityPerYear.length - 1] -
        avgHumidityPerYear[0];

      let insightText = `Từ ${years[0]} đến ${lastYear}: `;
      insightText +=
        tempChange > 0
          ? `Nhiệt độ trung bình tăng ${tempChange.toFixed(1)}°C, `
          : `Nhiệt độ trung bình giảm ${Math.abs(tempChange).toFixed(1)}°C, `;
      insightText +=
        rainChange > 0
          ? `Lượng mưa tăng ${rainChange.toFixed(1)} mm, `
          : `Lượng mưa giảm ${Math.abs(rainChange).toFixed(1)} mm, `;
      insightText +=
        humChange > 0
          ? `Độ ẩm tăng ${humChange.toFixed(1)}%.`
          : `Độ ẩm giảm ${Math.abs(humChange).toFixed(1)}%.`;

      setInsight(insightText);

      // Tính kỷ lục
      const recordsData = {
        hottest: {
          year: years[avgTempPerYear.indexOf(Math.max(...avgTempPerYear))],
          value: Math.max(...avgTempPerYear).toFixed(1),
        },
        coldest: {
          year: years[avgTempPerYear.indexOf(Math.min(...avgTempPerYear))],
          value: Math.min(...avgTempPerYear).toFixed(1),
        },
        wettest: {
          year: years[totalRainPerYear.indexOf(Math.max(...totalRainPerYear))],
          value: Math.max(...totalRainPerYear).toFixed(1),
        },
        driest: {
          year: years[totalRainPerYear.indexOf(Math.min(...totalRainPerYear))],
          value: Math.min(...totalRainPerYear).toFixed(1),
        },
        mostHumid: {
          year: years[
            avgHumidityPerYear.indexOf(Math.max(...avgHumidityPerYear))
          ],
          value: Math.max(...avgHumidityPerYear).toFixed(1),
        },
        leastHumid: {
          year: years[
            avgHumidityPerYear.indexOf(Math.min(...avgHumidityPerYear))
          ],
          value: Math.min(...avgHumidityPerYear).toFixed(1),
        },
      };

      setRecords(recordsData);

      // Biểu đồ nhiều đường
      setChartData({
        labels: years,
        datasets: [
          {
            label: "Nhiệt độ trung bình (°C)",
            data: avgTempPerYear,
            borderColor: "rgb(255, 99, 132)",
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            yAxisID: "y1",
            tension: 0.3,
          },
          {
            label: "Tổng lượng mưa (mm)",
            data: totalRainPerYear,
            borderColor: "rgb(54, 162, 235)",
            backgroundColor: "rgba(54, 162, 235, 0.2)",
            yAxisID: "y2",
            tension: 0.3,
          },
          {
            label: "Độ ẩm trung bình (%)",
            data: avgHumidityPerYear,
            borderColor: "rgb(75, 192, 192)",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            yAxisID: "y3",
            tension: 0.3,
          },
        ],
      });
    };

    fetchData();
  }, []);

  return (
    <div style={{ width: "90%", margin: "0 auto" }}>
      <h2 style={{ marginBottom: "16px" }}>Xu hướng thời tiết (TP.HCM)</h2>
      {chartData ? (
        <>
          <Line
            data={chartData}
            options={{
              responsive: true,
              interaction: { mode: "index", intersect: false },
              stacked: false,
              plugins: {
                legend: { position: "top" },
              },
              scales: {
                y1: {
                  type: "linear",
                  position: "left",
                  title: { display: true, text: "Nhiệt độ (°C)" },
                },
                y2: {
                  type: "linear",
                  position: "right",
                  title: { display: true, text: "Lượng mưa (mm)" },
                  grid: { drawOnChartArea: false },
                },
                y3: {
                  type: "linear",
                  position: "right",
                  title: { display: true, text: "Độ ẩm (%)" },
                  grid: { drawOnChartArea: false },
                  offset: true,
                },
              },
            }}
          />
          {/* Insight */}
          <div
            style={{
              marginTop: "20px",
              padding: "12px",
              background: "#f9f9f9",
              borderRadius: "8px",
            }}
          >
            <strong>Insight: </strong>
            {insight}
          </div>

          {/* Bảng kỷ lục */}
          {records && (
            <div
              style={{
                marginTop: "20px",
                padding: "12px",
                background: "#fff",
                borderRadius: "8px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              }}
            >
              <h3>Kỷ lục thời tiết</h3>
              <ul>
                <li>
                  Nóng nhất: {records.hottest.year} ({records.hottest.value}
                  °C)
                </li>
                <li>
                  Lạnh nhất: {records.coldest.year} ({records.coldest.value}
                  °C)
                </li>
                <li>
                  Mưa nhiều nhất: {records.wettest.year} (
                  {records.wettest.value} mm)
                </li>
                <li>
                  Khô hạn nhất: {records.driest.year} ({records.driest.value}{" "}
                  mm)
                </li>
                <li>
                  Ẩm nhất: {records.mostHumid.year} ({records.mostHumid.value}%)
                </li>
                <li>
                  Ít ẩm nhất: {records.leastHumid.year} (
                  {records.leastHumid.value}%)
                </li>
              </ul>
            </div>
          )}
        </>
      ) : (
        <p>Đang tải dữ liệu...</p>
      )}
    </div>
  );
};

export default Trends;
