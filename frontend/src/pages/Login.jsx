import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Attempting login for:", email); // Debug check

    try {
      const response = await api.post("/login", { 
  email: email.trim().toLowerCase(), 
  password: password 
});
      
      
      console.log("LOGIN RESPONSE:", response.data);

      
      localStorage.setItem("token", response.data.token);

    
      const idToSave = response.data.user?._id || response.data.userId || response.data._id;
      if (idToSave) {
        localStorage.setItem("userId", idToSave);
        console.log("Saved userId to localStorage:", idToSave);
      } else {
        console.warn("Login successful, but no userId found in response. Data structure:", response.data);
      }

      navigate("/dashboard");
    } catch (error) {
      
      console.error("LOGIN FAILED ERROR:", error.response?.data || error);
      
      const errorMessage = error.response?.data?.message || "Login failed. Please check your credentials.";
      alert(errorMessage);
    }
  };

  return (
    <div className="login-page">
      <div className="login-form-container">
        <div className="login-header">
          <button onClick={() => navigate("/")} className="back-link">
            ← Back to Home
          </button>
          <div className="login-logo" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
            <div className="logo-icon">
              <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
              </svg>
            </div>
            <span className="logo-text">PeerSwap</span>
          </div>
        </div>

        <div className="form-content">
          <h1>Welcome Back!</h1>
          <p className="subtitle">Login to connect with your study peers.</p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                placeholder="name@email.com"
                required
                autoComplete="email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="input-group">
              <div className="label-row">
                <label htmlFor="password">Password</label>
              </div>
              <input
                type="password"
                id="password"
                placeholder="••••••••"
                required
                autoComplete="current-password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="login-submit-btn">
              Login
            </button>
          </form>

          <p className="register-redirect">
            Don't have an account?{" "}
            <button
              type="button"
              className="link-btn"
              onClick={() => navigate("/register")}
            >
              Sign up for free
            </button>
          </p>
        </div>
      </div>

      <div className="login-visual">
        <div className="visual-overlay">
          <h2>"Study is better when we do it together."</h2>
        </div>
      </div>
    </div>
  );
}
