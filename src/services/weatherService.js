import axios from "axios";

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const VC_API_KEY = import.meta.env.VITE_VISUALCROSSING_API_KEY;

export const fetchCurrentWeather = async (city) => {
  if (!API_KEY) {
    console.error("API_KEY is missing!");
    throw new Error("API key không tồn tại. Kiểm tra file .env.");
  }

  const url = `https://api.openweathermap.org/data/2.5/weather`;

  try {
    const response = await axios.get(url, {
      params: {
        q: city,
        appid: API_KEY,
        units: "metric",
        lang: "vi",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Lỗi khi fetch dữ liệu thời tiết:", error);
    throw new Error("Lỗi khi lấy dữ liệu thời tiết");
  }
};
export const fetchHourlyForecast = async (city) => {
  if (!API_KEY) {
    console.error("API_KEY is missing!");
    throw new Error("API key không tồn tại. Kiểm tra file .env.");
  }

  const url = `https://api.openweathermap.org/data/2.5/forecast`;

  try {
    const response = await axios.get(url, {
      params: {
        q: city,
        appid: API_KEY,
        units: "metric",
        lang: "vi",
      },
    });
    return response.data.list;
  } catch (error) {
    console.error("Lỗi khi fetch dữ liệu dự báo hàng giờ:", error);
    throw new Error("Lỗi khi lấy dữ liệu dự báo hàng giờ");
  }
};

// Lấy dữ liệu thời tiết theo tháng
export const fetchMonthlyWeather = async (city, monthOffset = 0) => {
  if (!VC_API_KEY) {
    console.error("VC_API_KEY is missing!");
    throw new Error("API key cho Visual Crossing không tồn tại.");
  }

  const today = new Date();
  today.setMonth(today.getMonth() + monthOffset);

  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, "0");
  const startDate = `${year}-${month}-01`;
  const endDate = `${year}-${month}-31`;

  const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURIComponent(
    city
  )}/${startDate}/${endDate}`;

  try {
    const response = await axios.get(url, {
      params: {
        unitGroup: "metric",
        key: VC_API_KEY,
        contentType: "json",
        lang: "vi",
      },
    });

    return {
      days: response.data.days,
      month: month,
      year: year,
    };
  } catch (error) {
    console.error("Lỗi khi fetch thời tiết hàng tháng:", error);
    throw new Error("Không thể tải dữ liệu thời tiết tháng.");
  }
};