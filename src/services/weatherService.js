import axios from "axios";

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

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
}