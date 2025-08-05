const stylesHome = (darkMode) => ({
  container: {
    // padding: 24,
    minHeight: "100vh",
    color: darkMode ? "#fff" : "#000",
    backgroundColor: darkMode ? "#1f1f1f" : "#f5f5f5",
  },
  searchInput: {
    maxWidth: 300,
    marginBottom: 24,
  },
  currentWeather: {
    marginBottom: 32,
  },
  forecastCard: {
    backgroundColor: "#1f243d",
    borderRadius: 16,
    marginTop: 0,
  },
  cardBody: {
    padding: 24,
  },
  cardTitle: {
    color: "#fff",
    marginBottom: 16,
  },
  dailyList: {
    display: "flex",
    gap: 16,
    overflowX: "auto",
    paddingBottom: 16,
    alignItems: "flex-start",
  },
  dailyItemContainer: {
    display: "flex",
    flexDirection: "column",
    flexShrink: 0,
  },
  dailyItemCard: {
    color: "#fff",
    cursor: "pointer",
    textAlign: "center",
  },
  dailyItemBody: {
    padding: 12,
  },
  dayLabel: {
    fontWeight: 600,
  },
  weatherIcon: {
    width: 40,
    height: 40,
  },
  tempRange: {
    fontSize: 14,
  },
  hourlyContainer: {
    background: "#2a2f4a",
    padding: 12,
    borderRadius: "0 0 12px 12px",
    border: "2px solid #fff",
    borderTop: "none",
  },
  hourlyTitle: {
    fontWeight: 500,
    fontSize: 14,
    marginBottom: 8,
    color: "#fff",
  },
  hourlyList: {
    display: "flex",
    gap: 12,
    overflowX: "auto",
  },
  hourlyItem: {
    minWidth: 100,
  },

  // Dự báo hàng tháng
  monthlyNav: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "40px 0 20px",
    gap: 16,
  },
  navButton: {
    padding: "8px 16px",
    fontSize: 16,
    cursor: "pointer",
    backgroundColor: "#1677ff",
    border: "none",
    borderRadius: 6,
    color: "#fff",
    fontWeight: 500,
  },
  monthTitle: {
    fontSize: 20,
    fontWeight: "bold",
    margin: "0 12px",
    color: darkMode ? "#fff" : "#000",
  },
  monthlyGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: 16,
    justifyContent: "center",
    paddingBottom: 40,
  },
  monthlyCard: {
    width: 200,
    textAlign: "center",
    backgroundColor: darkMode ? "#2a2f4a" : "#f0f0f0",
    borderRadius: 8,
    padding: 12,
    color: darkMode ? "#fff" : "#000",
  },
});

export default stylesHome;
