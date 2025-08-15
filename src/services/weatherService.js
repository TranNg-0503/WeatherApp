import axios from "axios";

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const NEWSAPI_KEY = import.meta.env.VITE_NEWSAPI_KEY; // NewsAPI key

/**
 * Lấy tin tức thời tiết từ NewsAPI
 */
export const fetchWeatherNews = async () => {
  if (!NEWSAPI_KEY) {
    console.error("NEWSAPI_KEY is missing!");
    throw new Error("API key cho NewsAPI không tồn tại.");
  }

  try {
    const response = await axios.get("https://newsapi.org/v2/everything", {
      params: {
        q: "thời tiết",
        language: "vi",
        sortBy: "publishedAt",
        pageSize: 12, // số tin muốn lấy
        apiKey: NEWSAPI_KEY,
      },
    });

    // Chuyển đổi dữ liệu từ NewsAPI sang format cũ để News.jsx vẫn dùng được
    return (response.data.articles || []).map((article) => ({
      title: article.title,
      description: article.description,
      image: article.urlToImage,
      link: article.url,
      source: article.source?.name || "Nguồn tin",
      publishedAt: article.publishedAt,
    }));
  } catch (error) {
    if (error.response) {
      console.error(
        `Lỗi khi lấy tin tức từ NewsAPI: ${error.response.status} - ${error.response.statusText}`
      );

      if (error.response.status === 401) {
        throw new Error("API key NewsAPI không hợp lệ hoặc đã hết hạn.");
      }
      if (error.response.status === 429) {
        throw new Error("Bạn đã vượt quá giới hạn gọi NewsAPI, vui lòng thử lại sau.");
      }
    } else {
      console.error("Lỗi khi kết nối NewsAPI:", error.message);
    }
    throw new Error("Không thể tải tin tức thời tiết.");
  }
};

// Lấy thời tiết hiện tại
export const fetchCurrentWeather = async (city, unit = "metric") => {
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
        units: unit,
        lang: "vi",
      },
    });

    const symbol = unit === "metric" ? "°C" : "°F";
    return { ...response.data, tempSymbol: symbol };
  } catch (error) {
    console.error("Lỗi khi fetch dữ liệu thời tiết:", error);
    throw new Error("Lỗi khi lấy dữ liệu thời tiết");
  }
};

// Lấy dự báo hàng giờ
export const fetchHourlyForecast = async (city, unit = "metric") => {
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
        units: unit,
        lang: "vi",
      },
    });

    const symbol = unit === "metric" ? "°C" : "°F";
    return response.data.list.map((item) => ({
      ...item,
      tempSymbol: symbol,
    }));
  } catch (error) {
    console.error("Lỗi khi fetch dữ liệu dự báo hàng giờ:", error);
    throw new Error("Lỗi khi lấy dữ liệu dự báo hàng giờ");
  }
};

const weatherTypeMap = {
  type_21: "Nhiều mây",
  type_42: "Mưa",
  type_41: "Mây dày",
  type_43: "Trời quang",
};

// Lấy dữ liệu thời tiết theo tháng (mock data cho tháng 7 và 8)
export const fetchMonthlyWeather = async (
  city,
  monthOffset = 0,
  unit = "metric"
) => {
  const today = new Date();
  today.setMonth(today.getMonth() + monthOffset);

  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, "0");

  let url = "";

  if (month === "07") {
    url = "/mock/weather_july.json";
  } else if (month === "08") {
    url = "/mock/weather_august.json";
  } else {
    throw new Error(`Không có dữ liệu thời tiết mẫu cho tháng ${month}`);
  }

  const response = await fetch(url);
  const data = await response.json();

  const mappedDays = data.days.map((day) => ({
    ...day,
    conditions: day.conditions
      .split(", ")
      .map((type) => weatherTypeMap[type] || type)
      .join(", "),
    tempSymbol: unit === "metric" ? "°C" : "°F",
  }));

  return {
    days: mappedDays,
    month,
    year,
  };
};





// Lấy dữ liệu thời tiết theo tháng
// export const fetchMonthlyWeather = async (city, monthOffset = 0) => {
//   if (!VC_API_KEY) {
//     console.error("VC_API_KEY is missing!");
//     throw new Error("API key cho Visual Crossing không tồn tại.");
//   }

//   const today = new Date();
//   today.setMonth(today.getMonth() + monthOffset);

//   const year = today.getFullYear();
//   const month = (today.getMonth() + 1).toString().padStart(2, "0");
//   const startDate = `${year}-${month}-01`;
//   const endDate = `${year}-${month}-31`;

//   const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURIComponent(
//     city
//   )}/${startDate}/${endDate}`;

//   try {
//     const response = await axios.get(url, {
//       params: {
//         unitGroup: "metric",
//         key: VC_API_KEY,
//         contentType: "json",
//         lang: "vi",
//       },
//     });

//     return {
//       days: response.data.days,
//       month: month,
//       year: year,
//     };
//   } catch (error) {
//     console.error("Lỗi khi fetch thời tiết hàng tháng:", error);
//     throw new Error("Không thể tải dữ liệu thời tiết tháng.");
//   }
// };
