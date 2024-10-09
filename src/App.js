// src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
// import About from "./components/About";
// import Login from "./components/Login";
// import Signup from "./components/Signup";
//import ForgotPassword from "./components/ForgotPassword"; // Import ForgotPassword component
import Footer from "./components/Footer";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            {/* <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} /> New route */}
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
