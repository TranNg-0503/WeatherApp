import React, { useState, useEffect, useContext } from "react";
import { BrowserRouter } from "react-router-dom";
import { ConfigProvider, theme as antdTheme } from "antd";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Routing from "./Routing";
import { ThemeProvider, ThemeContext } from "./contexts/ThemeContext"; // Thêm dòng này

const ThemedApp = () => {
  const { darkMode } = useContext(ThemeContext);

  return (
    <ConfigProvider
      theme={{
        algorithm: darkMode
          ? antdTheme.darkAlgorithm
          : antdTheme.defaultAlgorithm,
        token: {
          colorBgBase: darkMode ? "#0d1117" : "#ffffff",
          colorTextBase: darkMode ? "#ffffff" : "#000000",
        },
      }}
    >
      <BrowserRouter>
        <Navbar />
        <div style={{ minHeight: "80vh" }}>
          <Routing />
        </div>
        <Footer />
      </BrowserRouter>
    </ConfigProvider>
  );
};

const App = () => (
  <ThemeProvider>
    <ThemedApp />
  </ThemeProvider>
);

export default App;
