import React, { useState } from "react";
import "./AuthForm.css"; // We'll create this CSS file

function AuthForm({ onLogin }) {
  const [page, setPage] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = page === "login" ? "/login" : "/register";
      const response = await fetch(`http://localhost:5000${url}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();

      if (data.success) {
        if (page === "login") onLogin(username);
        else alert("✅ Registration successful! You can now login.");
      } else {
        alert("❌ " + data.message);
      }
    } catch (error) {
      alert("❌ Backend not reachable.");
    }

    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <img src="/cozmeklogo.jpeg" alt="Cozmek Logo" className="logo" />
        <h2>{page === "login" ? "Login" : "Register"}</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Please wait..." : page === "login" ? "Login" : "Register"}
          </button>
        </form>

        <p className="toggle-text">
          {page === "login" ? "Don't have an account?" : "Already have an account?"}
          <span onClick={() => setPage(page === "login" ? "register" : "login")}>
            {page === "login" ? " Register" : " Login"}
          </span>
        </p>
      </div>
    </div>
  );
}

export default AuthForm;
