// src/App.jsx
import React from "react";
import { BrowserRouter } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Routing from "./Routing";
const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <div style={{ minHeight: "80vh", padding: "24px" }}>
        <Routing />
      </div>
      <Footer />
    </BrowserRouter>
  );
};

export default App;
