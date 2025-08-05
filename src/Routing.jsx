import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import HourlyForecast from "./pages/HourlyForecast";
import MonthlyForecast from "./pages/MonthlyForecast";
import Trends from "./pages/Trends";
import News from "./pages/News";
import NotFound from "./pages/NotFound";

const Routing = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/hourly" element={<HourlyForecast />} />
      <Route path="/monthly" element={<MonthlyForecast />} />
      <Route path="/trends" element={<Trends />} />
      <Route path="/news" element={<News />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Routing;
