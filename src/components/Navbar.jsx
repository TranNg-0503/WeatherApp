import React, { useContext } from "react";
import { Menu, Switch } from "antd";
import { Link } from "react-router-dom";
import { ThemeContext } from "../contexts/ThemeContext";

const Navbar = () => {
  const { darkMode, toggleTheme } = useContext(ThemeContext);

  const menuItems = [
    {
      key: "home",
      label: <Link to="/">Trang chủ</Link>,
      style: { margin: "0 20px" },
    },
    {
      key: "hourly",
      label: <Link to="/hourly">Dự báo theo giờ</Link>,
      style: { margin: "0 20px" },
    },
    {
      key: "monthly",
      label: <Link to="/monthly">Dự báo theo tháng</Link>,
      style: { margin: "0 20px" },
    },
    {
      key: "trends",
      label: <Link to="/trends">Xu hướng</Link>,
      style: { margin: "0 20px" },
    },
    {
      key: "news",
      label: <Link to="/news">Tin tức</Link>,
      style: { margin: "0 20px" },
    },
  ];

  return (
    <div
      style={{
        padding: "20px 40px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: darkMode ? "#1f1f1f" : "#ffffff",
        borderBottom: darkMode ? "1px solid #333" : "1px solid #ddd",
        overflow: "auto",
      }}
    >
      <Menu
        mode="horizontal"
        theme={darkMode ? "dark" : "light"}
        selectable={false}
        items={menuItems}
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          background: "transparent",
          fontSize: "20px",
          fontWeight: "600",
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
