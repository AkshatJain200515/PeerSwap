import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/"); // Redirect to home/landing
  };

  return (
    <nav className="navbar-glass">
      <div className="navbar-container">
        <div className="navbar-logo" onClick={() => navigate("/dashboard")}>
          <div className="logo-icon-svg">
            <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
            </svg>
          </div>
          <span className="logo-text">PeerSwap</span>
        </div>

        <div className="navbar-links">
          <Link to="/dashboard" className="nav-link">Dashboard</Link>
          <button className="logout-btn-styled" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;