import axios from "axios";

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

if (!API_KEY) {
  console.error("API_KEY is missing!");
  throw new Error("API key không tồn tại. Kiểm tra file .env.");
}

// Lấy thời tiết hiện tại
export const fetchCurrentWeather = async ({ lat, lon }) => {
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather`,
      {
        params: {
          lat,
          lon,
          appid: API_KEY,
          units: "metric",
          lang: "vi",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Lỗi khi fetch dữ liệu thời tiết:", error);
    throw new Error("Lỗi khi lấy dữ liệu thời tiết");
  }
};

// Lấy dự báo thời tiết theo giờ
export const fetchHourlyForecast = async ({ lat, lon }) => {
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast`,
      {
        params: {
          lat,
          lon,
          appid: API_KEY,
          units: "metric",
          lang: "vi",
        },
      }
    );

    return response.data.list;
  } catch (error) {
    console.error("Lỗi khi fetch dữ liệu dự báo hàng giờ:", error);
    throw new Error("Lỗi khi lấy dữ liệu dự báo hàng giờ");
  }
};

export const fetchCurrentWeatherByCityName = async (cityName) => {
  if (!API_KEY) {
    throw new Error("API key không tồn tại. Kiểm tra file .env.");
  }

  const url = `https://api.openweathermap.org/data/2.5/weather`;

  try {
    const response = await axios.get(url, {
      params: {
        q: cityName,
        appid: API_KEY,
        units: "metric",
        lang: "vi",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Lỗi khi fetch thời tiết theo tên thành phố:", error);
    throw new Error("Không thể lấy dữ liệu thời tiết");
  }
};
