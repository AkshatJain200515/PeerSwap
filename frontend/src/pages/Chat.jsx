import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import Navbar from "../components/Navbar";
import "./Chat.css";

export default function Chat() {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const [chat, setChat] = useState(null);
  const [text, setText] = useState("");
  const messagesEndRef = useRef(null);
  const userId = localStorage.getItem("userId");

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchChat = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get(`/chat/${chatId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setChat(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchChat();
    const interval = setInterval(fetchChat, 2500); 
    return () => clearInterval(interval);
  }, [chatId]);

  useEffect(() => {
    scrollToBottom();
  }, [chat?.messages]);

  const sendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!text.trim()) return;

    try {
      const token = localStorage.getItem("token");
      await api.post(
        `/chat/${chatId}/message`,
        { text },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setText("");
      fetchChat();
    } catch (err) {
      console.error(err);
    }
  };

  if (!chat) return <div className="loading-chat">Opening conversation...</div>;

  const peer = chat.participants.find(p => p._id !== userId);

  return (
    <div className="chat-page-wrapper">
      <Navbar />
      
      <div className="chat-main-container fade-in">
        {/* Chat Header */}
        <div className="chat-header">
          <button className="chat-back-btn" onClick={() => navigate("/dashboard")}>←</button>
          <div className="chat-user-info">
            <div className="chat-avatar-sm">{peer?.name?.charAt(0) || "P"}</div>
            <div>
              <h3>{peer?.name || "Study Peer"}</h3>
              <span className="online-status">Active Session</span>
            </div>
          </div>
        </div>

        {/* Message Area */}
        <div className="chat-messages-box">
          {chat.messages.map((msg, i) => {
            const isSelf = msg.sender._id === userId;
            return (
              <div key={i} className={`message-row ${isSelf ? "self" : "peer"}`}>
                <div className="message-bubble">
                  {!isSelf && <span className="sender-name">{msg.sender.name}</span>}
                  <p>{msg.text}</p>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form className="chat-input-area" onSubmit={sendMessage}>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message..."
          />
          <button type="submit" className="chat-send-btn">
            <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
