import { useNavigate } from "react-router-dom";
import "./LearnMore.css";

export default function LearnMore() {
  const navigate = useNavigate();

  return (
    <div className="learn-more-page">
      <div className="overlay">
        <div className="content-container fade-in">
          
          <header className="learn-header">
            <button onClick={() => navigate("/")} className="back-home">← Back</button>
            <h1>How PeerSwap Works</h1>
            <p className="tagline">Bridging the gap between what you know and what you want to learn.</p>
          </header>

          <div className="features-grid">
            {/* Card 1 */}
            <div className="glass-info-card">
              <div className="icon-circle">🤝</div>
              <h3>Smart Matching</h3>
              <p>Our algorithm connects you with peers who are strong in subjects you find challenging, and vice-versa. It’s a true knowledge exchange.</p>
            </div>

            {/* Card 2 */}
            <div className="glass-info-card">
              <div className="icon-circle">💬</div>
              <h3>Instant Chat</h3>
              <p>Once you match, jump straight into a conversation. Coordinate study times, share resources, or ask a quick question instantly.</p>
            </div>

            {/* Card 3 */}
            <div className="glass-info-card">
              <div className="icon-circle">🚀</div>
              <h3>Academic Growth</h3>
              <p>Teaching others is the best way to learn. By helping peers, you reinforce your own knowledge while gaining help where you need it most.</p>
            </div>
          </div>

          <div className="cta-section">
            <h2>Ready to find your study partner?</h2>
            <button className="cta-btn" onClick={() => navigate("/register")}>
              Create Your Profile
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
}