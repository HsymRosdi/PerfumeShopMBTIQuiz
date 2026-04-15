import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";

const ADMIN_EMAIL = "admin@perfumeshop.com"; // change this to your admin email

const AdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const { email, password } = formData;

    if (!email || !password) { setError("Please fill in all fields."); return; }

    if (email !== ADMIN_EMAIL) {
      setError("Access denied. You are not an admin.");
      return;
    }

    try {
      setLoading(true);
      await loginUser(email, password);
      navigate("/admin/dashboard");
    } catch {
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={pageStyle}>
      {/* Left Panel */}
      <div style={leftPanelStyle}>
        <div style={leftContentStyle}>
          <div style={logoStyle}>
            <span style={{ fontSize: "2.5rem" }}>🌸</span>
            <div>
              <div style={logoTitleStyle}>The Perfume Shop</div>
              <div style={logoSubStyle}>Admin Portal</div>
            </div>
          </div>
          <h2 style={leftTitleStyle}>Manage your store from one place</h2>
          <p style={leftDescStyle}>Access orders, users, and your perfume catalogue all in one dashboard.</p>
          <div style={featuresStyle}>
            {["📊 Real-time order tracking", "👥 User management", "🧴 Perfume catalogue", "💰 Revenue overview"].map(f => (
              <div key={f} style={featureItemStyle}>{f}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div style={rightPanelStyle}>
        <div style={cardStyle}>
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <div style={lockIconStyle}>🔐</div>
            <h1 style={titleStyle}>Admin Login</h1>
            <p style={subtitleStyle}>Restricted access — admins only</p>
          </div>

          <form onSubmit={handleSubmit}>
            <label style={labelStyle}>Admin Email</label>
            <input
              style={inputStyle}
              type="email"
              name="email"
              placeholder="Enter admin email"
              value={formData.email}
              onChange={handleChange}
            />

            <label style={labelStyle}>Password</label>
            <input
              style={inputStyle}
              type="password"
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
            />

            {error && <div style={errorStyle}>{error}</div>}

            <button type="submit" style={submitBtnStyle} disabled={loading}>
              {loading ? "Signing in..." : "Login to Dashboard →"}
            </button>
          </form>

          <div style={backLinkStyle}>
            <a href="/" style={backAnchorStyle}>← Back to website</a>
          </div>
        </div>
      </div>
    </div>
  );
};

const pageStyle = { minHeight: "100vh", display: "flex", fontFamily: "'Inter', sans-serif" };
const leftPanelStyle = { flex: 1, background: "linear-gradient(135deg, #0a0a0a 0%, #1a1208 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: "60px 48px" };
const leftContentStyle = { maxWidth: "400px" };
const logoStyle = { display: "flex", alignItems: "center", gap: "14px", marginBottom: "48px" };
const logoTitleStyle = { fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", fontWeight: "700", color: "#c9a84c" };
const logoSubStyle = { fontSize: "0.7rem", color: "#6b7280", letterSpacing: "2px", textTransform: "uppercase", marginTop: "2px" };
const leftTitleStyle = { fontFamily: "'Playfair Display', serif", fontSize: "2rem", fontWeight: "700", color: "white", lineHeight: "1.3", marginBottom: "16px" };
const leftDescStyle = { color: "#9ca3af", fontSize: "0.95rem", lineHeight: "1.7", marginBottom: "32px" };
const featuresStyle = { display: "flex", flexDirection: "column", gap: "10px" };
const featureItemStyle = { color: "#d1d5db", fontSize: "0.9rem", padding: "10px 16px", backgroundColor: "rgba(201,168,76,0.08)", borderRadius: "10px", borderLeft: "3px solid #c9a84c" };
const rightPanelStyle = { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 48px", background: "#f9fafb" };
const cardStyle = { width: "100%", maxWidth: "420px", backgroundColor: "white", borderRadius: "24px", padding: "48px 40px", boxShadow: "0 20px 60px rgba(0,0,0,0.1)" };
const lockIconStyle = { fontSize: "2.5rem", marginBottom: "16px" };
const titleStyle = { fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", fontWeight: "700", color: "#111827", marginBottom: "8px" };
const subtitleStyle = { color: "#9ca3af", fontSize: "0.9rem" };
const labelStyle = { display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "0.88rem", color: "#374151" };
const inputStyle = { width: "100%", padding: "14px 16px", borderRadius: "12px", border: "1.5px solid #e5e7eb", outline: "none", fontSize: "0.95rem", boxSizing: "border-box", marginBottom: "20px", fontFamily: "'Inter', sans-serif" };
const errorStyle = { backgroundColor: "#fef2f2", color: "#dc2626", padding: "12px 16px", borderRadius: "10px", fontSize: "0.88rem", marginBottom: "16px", border: "1px solid #fecaca" };
const submitBtnStyle = { width: "100%", padding: "15px", border: "none", borderRadius: "12px", background: "linear-gradient(135deg, #c9a84c, #a07830)", color: "white", fontSize: "1rem", fontWeight: "700", cursor: "pointer", boxShadow: "0 6px 20px rgba(201,168,76,0.3)", marginTop: "4px" };
const backLinkStyle = { textAlign: "center", marginTop: "24px" };
const backAnchorStyle = { color: "#9ca3af", fontSize: "0.88rem", textDecoration: "none" };

export default AdminLogin;