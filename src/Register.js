import React, { useState } from "react";
import "./Auth.css";

function Register({ onBackToLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (data.success) {
        alert("🎉 Registration Successful! Please Login.");
        onBackToLogin();
      } else {
        alert("⚠️ " + data.message);
      }
    } catch (err) {
      alert("❌ Backend not reachable");
    }

    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-box">

        <h1 className="auth-title">Create Account</h1>
        <p className="auth-sub">Join Cozmek Learning Platform</p>

        <form onSubmit={handleRegister}>
          <input
            className="auth-input"
            type="text"
            placeholder="Choose username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <input
            className="auth-input"
            type="password"
            placeholder="Create password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button className="auth-btn" type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="auth-link-text">
          Already have an account?
          <button className="link-btn" onClick={onBackToLogin}> Login</button>
        </p>
      </div>
    </div>
  );
}

export default Register;
