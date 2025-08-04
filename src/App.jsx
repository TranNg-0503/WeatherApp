// src/App.jsx
import React from "react";
import { BrowserRouter } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Routing from "./Routing";

const App = () => {
  return (
    <BrowserRouter>
      <div
        style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        <Navbar />
        <div style={{ flex: 1 }}>
          <Routing />
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;
