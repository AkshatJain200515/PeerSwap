import { useState } from "react";
import api from "../api"; 
import { useNavigate } from "react-router-dom";
import { SUBJECTS } from "../constants/subjects"; 
import "./register.css";
import Validateemail from "../Utils/validate";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [strongSubjects, setStrongSubjects] = useState([]);
  const [weakSubjects, setWeakSubjects] = useState([]);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nameRegex = /^[a-zA-Z\s]+$/;
  if (!nameRegex.test(name)) {
    return alert("Invalid Name: Please use only letters (no numbers or symbols).");
  }

  if (!Validateemail(email)) {
        return alert("Validation Error: Please enter a valid email. ");
    }

 
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return alert("Invalid Email: Please enter a real email address (e.g., name@school.edu).");
  }
  
    if (password.length < 6) {
    return alert("Engineering Requirement: Password must be at least 6 characters.");
  }
  if (strongSubjects.length === 0 || weakSubjects.length === 0) {
    return alert("Please select at least one strength and one weakness to allow for matching.");
  }
   
    const payload = { 
      name: name.trim(), 
      email: email.trim().toLowerCase(), 
      password: password, 
      strongSubjects: [...strongSubjects],
      weakSubjects: [...weakSubjects]   
    };

    console.log("PAYLOAD BEING SENT:", payload);

    try {
      const response = await api.post("/auth/register", payload);

      if (response.data && response.data.token) {
        localStorage.setItem("token", response.data.token);
        
        const userId = response.data.user?._id || response.data.userId || response.data._id;
        if (userId) localStorage.setItem("userId", userId);
        
        navigate("/dashboard");
      }
    } catch (error) {
      
      const errorDetail = error.response?.data;
      console.error("FULL ERROR OBJECT:", errorDetail);

      
      if (errorDetail?.errors) {
        const firstError = Object.values(errorDetail.errors)[0];
        alert(`Validation Error: ${firstError.message || firstError}`);
      } else {
        alert("Registration failed: " + (errorDetail?.message || "Check console for 400 details"));
      }
    }
  };

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

  return (
    <div className="login-page">
      <div className="login-form-container fade-in" style={{ flex: '1.2', overflowY: 'auto' }}>
        
        <div className="register-header">
          <button onClick={() => navigate("/")} className="back-link">← Home</button>
          <div className="login-logo" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
            <div className="logo-icon-svg">
               <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
              </svg>
            </div>
            <span className="logo-text">PeerSwap</span>
          </div>
        </div>

        <div className="form-content" style={{ maxWidth: '500px' }}>
          <h1>Create Account</h1>
          <p className="subtitle">Join the study community today.</p>

          <form onSubmit={handleSubmit}>
            <div className="input-row" style={{ display: 'flex', gap: '15px' }}>
              <div className="input-group">
                <label>Name</label>
                <input type="text" placeholder="John" value={name} onChange={e => setName(e.target.value)} required />
              </div>
              <div className="input-group">
                <label>Email</label>
                <input type="email" placeholder="john@email.com" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
            </div>

            <div className="input-group">
              <label>Password</label>
              <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>

            <div className="tag-section">
              <label className="tag-label">I'm strong in:</label>
              <div className="reg-tag-grid">
                {/*  */}
                {SUBJECTS.map(subj => (
                  <button key={subj} type="button" 
                    className={`reg-tag ${strongSubjects.includes(subj) ? 'selected-strong' : ''}`}
                    onClick={() => toggleSubject(subj, 'strong')}>{subj}</button>
                ))}
              </div>
            </div>

            <div className="tag-section" style={{ marginTop: '20px' }}>
              <label className="tag-label">I need help with:</label>
              <div className="reg-tag-grid">
                {/* */}
                {SUBJECTS.map(subj => (
                  <button key={subj} type="button" 
                    className={`reg-tag ${weakSubjects.includes(subj) ? 'selected-weak' : ''}`}
                    onClick={() => toggleSubject(subj, 'weak')}>{subj}</button>
                ))}
              </div>
            </div>

            <button type="submit" className="login-submit-btn" style={{ marginTop: '30px' }}>Register</button>
          </form>

          <p className="register-redirect">
            Already a member? <button type="button" className="link-btn" onClick={() => navigate("/login")}>Login</button>
          </p>
        </div>
      </div>
      <div className="login-visual-space"></div>
    </div>
  );
}
