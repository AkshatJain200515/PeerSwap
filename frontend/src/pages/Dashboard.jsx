import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import Navbar from "../components/Navbar";
import "./Dashboard.css";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(""); 
  const navigate = useNavigate();

  const startChat = async (otherUserId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.post(
        "/chat/start",
        { participantId: otherUserId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate(`/chat/${res.data._id}`);
    } catch (err) {
      console.error("Chat Start Error:", err);
    }
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/");
        return;
      }

      try {
        const [userRes, matchesRes] = await Promise.all([
          api.get("/auth/me", { headers: { Authorization: `Bearer ${token}` } }),
          api.get("/users/match", { headers: { Authorization: `Bearer ${token}` } })
        ]);
        
        setUser(userRes.data);
        setMatches(matchesRes.data);
        setLoading(false);
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/");
        } else {
          setLoading(false);
        }
      }
    };

    fetchDashboardData();
  }, [navigate]);


  const filteredMatches = matches.filter((match) => {
    const query = searchQuery.toLowerCase();
    const nameMatch = match.name?.toLowerCase().includes(query) || 
                      match.email?.toLowerCase().includes(query);
    const subjectMatch = match.strongSubjects?.some(s => s.toLowerCase().includes(query));
    
    return nameMatch || subjectMatch;
  });

  if (loading) return (
    <div className="loading-screen">
      <div className="spinner"></div>
      <p>Syncing with your peers...</p>
    </div>
  );

  return (
    <div className="dashboard-wrapper">
      <Navbar />
      
      <div className="dashboard-content">
        {/* Left Sidebar */}
        <aside className="profile-sidebar">
          <div className="user-info">
            <div className="user-avatar">
              {user?.name ? user.name.charAt(0).toUpperCase() : "?"}
            </div>
            <h2>{user?.name || "User"}</h2>
            <p className="user-email">{user?.email}</p>
          </div>

          <div className="sidebar-stats">
            <div className="stat-item">
              <label>My Strengths</label>
              <div className="tags-container">
                {user?.strongSubjects?.map(s => <span key={s} className="tag strong">{s}</span>)}
              </div>
            </div>
            <div className="stat-item">
              <label>Learning Goals</label>
              <div className="tags-container">
                {user?.weakSubjects?.map(s => <span key={s} className="tag weak">{s}</span>)}
              </div>
            </div>
          </div>

          <button className="edit-profile-link" onClick={() => navigate("/edit-profile")}>
            Edit Profile
          </button>
        </aside>

        {/* Main Feed */}
        <main className="matches-feed">
          <header className="feed-header">
            <div className="header-text">
              <h1>Suggested Partners</h1>
              <p>Found {filteredMatches.length} matches for you</p>
            </div>
            
            {/* Search Bar Component */}
            <div className="search-box">
              <input 
                type="text" 
                placeholder="Search by name or subject..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="dashboard-search-input"
              />
              <span className="search-icon">🔍</span>
            </div>
          </header>

          {filteredMatches.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <p>{searchQuery ? `No matches found for "${searchQuery}"` : "No matches yet. Try adding more subjects!"}</p>
            </div>
          ) : (
            <div className="matches-grid">
              {filteredMatches.map((match) => (
                <div key={match._id} className="match-card fade-in">
                  <div className="match-card-top">
                    <div className="match-avatar">{match.name?.charAt(0) || "P"}</div>
                    <div className="match-meta">
                      <h4>{match.name || "Peer Student"}</h4>
                      <p className="match-status-online">Available to help</p>
                    </div>
                  </div>
                  
                  <div className="match-subjects">
                    <p className="subject-label">Can help you with:</p>
                    <div className="tags-container">
                      {match.strongSubjects?.map(s => (
                        <span key={s} className="tag-pill">{s}</span>
                      ))}
                    </div>
                  </div>

                  <button className="chat-btn" onClick={() => startChat(match._id)}>
                    Start Chatting
                  </button>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
