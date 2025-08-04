import React, { useContext } from "react";
import { Menu, Switch } from "antd";
import { Link } from "react-router-dom";
import { ThemeContext } from "../contexts/ThemeContext";

const Navbar = () => {
  const { darkMode, toggleTheme } = useContext(ThemeContext);

  const menuItems = [
    { key: "home", label: <Link to="/">Trang chủ</Link> },
    { key: "hourly", label: <Link to="/hourly">Dự báo theo giờ</Link> },
    { key: "monthly", label: <Link to="/monthly">Dự báo theo tháng</Link> },
    { key: "trends", label: <Link to="/trends">Xu hướng</Link> },
    { key: "news", label: <Link to="/news">Tin tức</Link> },
  ];

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 24px",
        backgroundColor: darkMode ? "#1f1f1f" : "#ffffff",
        borderBottom: darkMode ? "1px solid #333" : "1px solid #e8e8e8",
      }}
    >
      <Menu
        mode="horizontal"
        theme={darkMode ? "dark" : "light"}
        selectable={false}
        items={menuItems}
        style={{
          flex: 1,
          backgroundColor: "transparent",
        }}
      />

      <Switch
        checked={darkMode}
        onChange={toggleTheme}
        checkedChildren="🌙"
        unCheckedChildren="🌞"
      />
    </div>
  );
};

export default Navbar;
