const stylesHome = (darkMode) => ({
  container: {
    position: "relative",
    padding: 24,
    color: darkMode ? "#fff" : "#000",
    backgroundColor: darkMode ? "#1f1f1f" : "#f5f5f5",
  },
  content: {
    maxWidth: "1200px",
    margin: "0 auto",
  },
  searchContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 40,
  },
  searchInput: {
    width: "50%",
    fontSize: 24,
  },
  currentWeather: {
    marginBottom: 80,
  },
  forecastCard: {
    backgroundColor: "#1f243d",
    borderRadius: 16,
    marginTop: 0,
    marginBottom: 80,
  },
  cardBody: {
    padding: 24,
  },
  cardTitle: {
    fontSize: 28,
    color: "#fff",
    margin: "0 0 16px 0",
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
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 40,
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
    fontSize: 30,
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
