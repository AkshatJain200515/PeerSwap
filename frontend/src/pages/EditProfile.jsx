import { useState, useEffect } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./EditProfile.css";

const SUBJECT_OPTIONS = [
  "Mathematics", "Physics", "Chemistry", "Biology", 
  "Computer Science", "History", "Geography", 
  "English", "Economics", "German",
];

export default function EditProfile() {
  const [name, setName] = useState("");
  const [strongSubjects, setStrongSubjects] = useState([]);
  const [weakSubjects, setWeakSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/");
      try {
        const res = await api.get("/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setName(res.data.name || "");
        setStrongSubjects(res.data.strongSubjects || []);
        setWeakSubjects(res.data.weakSubjects || []);
      } catch (err) {
        console.error(err);
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [navigate]);

  const toggleSubject = (subj, type) => {
    if (type === "strong") {
      setStrongSubjects(prev => 
        prev.includes(subj) ? prev.filter(s => s !== subj) : [...prev, subj]
      );
    } else {
      setWeakSubjects(prev => 
        prev.includes(subj) ? prev.filter(s => s !== subj) : [...prev, subj]
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      await api.put("/users/me", 
        { name, strongSubjects, weakSubjects },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Profile updated successfully!");
      navigate("/dashboard");
    } catch (err) {
      alert("Failed to update profile");
    }
  };

  if (loading) return <div className="loading">Loading Profile...</div>;

  return (
    <div className="edit-profile-wrapper">
      <Navbar />
      <div className="edit-container">
        <div className="edit-card-glass fade-in">
          <h2>Edit Profile</h2>
          <p className="edit-subtitle">Update your info and study preferences</p>
          
          <form onSubmit={handleSubmit}>
            <div className="edit-input-group">
              <label>Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                required
              />
            </div>

            <div className="subject-selection-block">
              <label>I am strong in (Expertise):</label>
              <div className="subject-grid">
                {SUBJECT_OPTIONS.map((subj) => (
                  <button
                    type="button"
                    key={subj}
                    className={`subject-tag ${strongSubjects.includes(subj) ? 'active-strong' : ''}`}
                    onClick={() => toggleSubject(subj, "strong")}
                  >
                    {subj}
                  </button>
                ))}
              </div>
            </div>

            <div className="subject-selection-block">
              <label>I need help with (Learning):</label>
              <div className="subject-grid">
                {SUBJECT_OPTIONS.map((subj) => (
                  <button
                    type="button"
                    key={subj}
                    className={`subject-tag ${weakSubjects.includes(subj) ? 'active-weak' : ''}`}
                    onClick={() => toggleSubject(subj, "weak")}
                  >
                    {subj}
                  </button>
                ))}
              </div>
            </div>

            <div className="edit-form-actions">
              <button type="button" className="cancel-btn" onClick={() => navigate("/dashboard")}>Cancel</button>
              <button type="submit" className="save-btn">Save Changes</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}