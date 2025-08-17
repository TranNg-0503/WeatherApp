const styles = {
  container: (darkMode) => ({
    backgroundColor: darkMode ? "#1e1e1e" : "#f0f7ff",
    color: darkMode ? "#f5f5f5" : "#1f1f1f",
    minHeight: "100vh",
    transition: "all 0.3s ease",
    padding: "16px",
  }),

  header: (darkMode) => ({
    backgroundColor: darkMode ? "transparent" : "#e6f4ff",
    padding: "16px 20px",
    borderRadius: "8px",
    marginBottom: "16px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  }),

  title: (darkMode) => ({
    color: darkMode ? "#fff" : "#003366",
    margin: 0,
  }),

  button: (darkMode) => ({
    background: darkMode ? "#555" : "#1890ff",
    borderColor: darkMode ? "#555" : "#1890ff",
    color: "#fff",
  }),

  select: (darkMode) => ({
    width: 160,
    background: darkMode ? "#2d2d2d" : "#ffffff",
  }),

  chartCard: (darkMode) => ({
    backgroundColor: darkMode ? "#2d2d2d" : "#ffffff",
    boxShadow: darkMode
      ? "0 2px 8px rgba(0,0,0,0.3)"
      : "0 4px 12px rgba(24,144,255,0.15)",
    borderRadius: "12px",
    marginBottom: "16px",
  }),

  toggleAllButton: (darkMode) => ({
    marginBottom: "16px",
    background: darkMode ? "#444" : "#bae7ff",
    color: darkMode ? "#fff" : "#003366",
    border: "none",
  }),

  forecastRow: (darkMode, index) => ({
    backgroundColor: darkMode
      ? index % 2 === 0
        ? "#2a2a2a"
        : "#242424"
      : index % 2 === 0
      ? "#ffffff"
      : "#f9fbff",
    borderRadius: "8px",
    marginBottom: "8px",
    padding: "12px",
    boxShadow: darkMode
      ? "0 1px 3px rgba(0,0,0,0.4)"
      : "0 2px 6px rgba(0,0,0,0.05)",
  }),

  // 🌟 Thêm style cho box ForecastDetailsHourly
  forecastDetailsBox: (darkMode) => ({
    padding: "12px 16px",
    borderRadius: "8px",
    marginTop: "8px",
    backgroundColor: darkMode ? "#2b2b2b" : "#ffffff",
    boxShadow: darkMode
      ? "0 1px 4px rgba(0,0,0,0.5)"
      : "0 2px 8px rgba(0,0,0,0.1)",
    border: darkMode ? "1px solid #444" : "1px solid #ddd",
  }),

  forecastDetailsCol: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "14px",
  },
};

export default styles;
