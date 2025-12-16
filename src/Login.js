import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import logo from "./logo.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!data.success) {
        alert(data.message);
        return;
      }

      if (data.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }

    } catch (error) {
      alert("Backend not running");
    }
  };

  return (
    <div className="login-container">
      <video className="login-background-video" autoPlay loop muted>
        <source src="/backgroundvideo.mp4" type="video/mp4" />
      </video>

      <div className="login-box">
        <img src={logo} alt="logo" className="login-logo" />
        <h2 className="login-title">Login</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter Email"
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Enter Password"
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="login-btn">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
