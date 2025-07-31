import React from "react";
import { Menu } from "antd";
import { Link } from "react-router-dom";

const Navbar = () => {
  const menuItems = [
    {
      key: "home",
      label: <Link to="/">Trang chủ</Link>,
    },
    {
      key: "hourly",
      label: <Link to="/hourly">Dự báo theo giờ</Link>,
    },
    {
      key: "monthly",
      label: <Link to="/monthly">Dự báo theo tháng</Link>,
    },
    {
      key: "trends",
      label: <Link to="/trends">Xu hướng</Link>,
    },
    {
      key: "news",
      label: <Link to="/news">Tin tức</Link>,
    },
  ];

  return (
    <Menu
      mode="horizontal"
      theme="light"
      selectable={false}
      items={menuItems}
    />
  );
};

export default Navbar;
