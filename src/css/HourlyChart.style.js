// 🎨 Gradient nền theo loại dữ liệu
export const getBackgroundGradient = (dataKey) => {
  switch (dataKey) {
    case "temp":
      return "linear-gradient(135deg, #ff9a9e, #ff6a00, #ff3c00)";
    case "humidity":
      return "linear-gradient(135deg, #2193b0, #6dd5ed)";
    case "rain":
      return "linear-gradient(135deg, #0f2027, #203a43, #2c5364)";
    case "wind":
      return "linear-gradient(135deg, #8e2de2, #4a00e0)";
    default:
      return "linear-gradient(135deg, #bdc3c7, #2c3e50)";
  }
};

// 🎨 Gradient line chart
export const getLineGradient = (dataKey) => {
  switch (dataKey) {
    case "temp":
      return (
        <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#ffdd00" stopOpacity={1} />
          <stop offset="95%" stopColor="#ff6600" stopOpacity={0.3} />
        </linearGradient>
      );
    case "humidity":
      return (
        <linearGradient id="colorHumidity" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#00c6ff" stopOpacity={1} />
          <stop offset="95%" stopColor="#0072ff" stopOpacity={0.3} />
        </linearGradient>
      );
    case "rain":
      return (
        <linearGradient id="colorRain" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#00ff99" stopOpacity={1} />
          <stop offset="95%" stopColor="#33ccff" stopOpacity={0.3} />
        </linearGradient>
      );
    case "wind":
      return (
        <linearGradient id="colorWind" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#a18cd1" stopOpacity={1} />
          <stop offset="95%" stopColor="#fbc2eb" stopOpacity={0.3} />
        </linearGradient>
      );
    default:
      return null;
  }
};

// 🎨 Styles
const styles = {
  container: (dataKey) => ({
    position: "relative",
    overflow: "hidden",
    background: getBackgroundGradient(dataKey),
    borderRadius: "20px",
    padding: "20px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.25)",
  }),

  tooltip: {
    backgroundColor: "#222",
    borderRadius: "10px",
    color: "#fff",
    border: "1px solid #555",
  },

  rainDrop: (x) => ({
    position: "absolute",
    left: `${x}%`,
    width: "2px",
    height: "15px",
    background: "rgba(173,216,230,0.8)",
    borderRadius: "1px",
  }),

  sun: {
    position: "absolute",
    top: "10px",
    right: "10px",
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    background: "radial-gradient(circle, #FFD700, #FF8C00)",
    boxShadow: "0 0 25px 12px rgba(255,140,0,0.6)",
  },

  wind: (i) => ({
    position: "absolute",
    top: `${40 + i * 15}%`,
    left: "-30%",
    width: "70%",
    height: "3px",
    borderRadius: "2px",
    background: "rgba(255,255,255,0.5)",
    filter: "blur(2px)",
  }),

  wave: {
    position: "absolute",
    bottom: "0",
    left: "-100%",
    width: "200%",
    height: "50px",
    background:
      "radial-gradient(circle at 20% 40%, rgba(255,255,255,0.6) 25%, transparent 25%), radial-gradient(circle at 80% 60%, rgba(255,255,255,0.6) 25%, transparent 25%)",
    backgroundSize: "60px 60px",
    opacity: 0.5,
  },
};

export default styles;
