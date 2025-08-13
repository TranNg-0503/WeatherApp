// Đổi từ °C sang °F
export const celsiusToFahrenheit = (celsius) => (celsius * 9) / 5 + 32;

// Đổi từ °F sang °C
export const fahrenheitToCelsius = (fahrenheit) => ((fahrenheit - 32) * 5) / 9;

// Hàm đổi nhiệt độ dựa vào đơn vị mong muốn
export const convertTemp = (tempC, unit = "C") => {
  if (unit === "C") return Math.round(tempC);
  return Math.round(celsiusToFahrenheit(tempC));
};

