import axios from "axios";

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const VC_API_KEY = import.meta.env.VITE_VISUALCROSSING_API_KEY;

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
        units: unit, // metric hoặc imperial
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

// Lấy dự báo theo giờ
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
        units: unit, // metric hoặc imperial
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

// Mock dữ liệu tháng
const weatherTypeMap = {
  type_21: "Nhiều mây",
  type_42: "Mưa",
  type_41: "Mây dày",
  type_43: "Trời quang",
};

export const fetchMonthlyWeather = async (city, monthOffset = 0, unit = "metric") => {
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
