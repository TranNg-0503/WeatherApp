import React, { useContext } from "react";
import { ThemeContext } from "../contexts/ThemeContext";

const Footer = () => {
  const { darkMode } = useContext(ThemeContext);

  return (
    <footer
      style={{
        textAlign: "center",
        padding: "16px 0",
        background: darkMode ? "#161b22" : "#f0f0f0",
        color: darkMode ? "#ffffff" : "#000000",
      }}
    >
      <p>© 2025 Weather App</p>
    </footer>
  );
};

export default Footer;
