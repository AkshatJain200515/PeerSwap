import { useNavigate } from "react-router-dom";
import "./home.css";
import heroImageSource from "../assets/home.jpg"; // put your image in src/assets

export default function Home() {
  const navigate = useNavigate();
  
  return (
    <div className="peerswap-container">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="logo">
          <div className="logo-icon">
            <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
            </svg>
          </div>
          <span className="logo-text">PeerSwap</span>
        </div>
        <div className="nav-auth-group">
          <a href="/login" className="nav-btn-login">Login</a>
          <a href="/register" className="nav-btn-register">Register</a>
        </div>
      </nav>

      {/* Hero Content */}
      <main className="hero-content">
        <div className="text-section">
          <h1 className="main-title">
            Connect & Study<br />with Peers
          </h1>
          <p className="description">
            Find study partners to boost your learning.
          </p>
          <div className="cta-buttons">
            {/* Points to /register as requested */}
            <a href="/register" className="btn-get-started">Get Started</a>
            <a href="/about" className="btn-learn-more">Learn More</a>
          </div>
        </div>
      </main>
    </div>
  );
};