import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/authService";

const Login = () => {
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
    try {
      setLoading(true);
      await loginUser(email, password);
      navigate("/");
    } catch { setError("Invalid email or password."); }
    finally { setLoading(false); }
  };

  return (
    <div style={pageStyle}>
      {/* Left Panel */}
      <div style={leftPanelStyle}>
        <div style={leftContentStyle}>
          <div style={leftLogoStyle}>
            <span style={{ fontSize: "3rem" }}>🌸</span>
            <span style={leftLogoTextStyle}>The Perfume Shop</span>
          </div>
          <h2 style={leftTitleStyle}>Welcome back to luxury</h2>
          <p style={leftDescStyle}>Sign in to access your personalised fragrance journey, cart, and exclusive recommendations.</p>
          <div style={leftFeaturesStyle}>
            {["🧠 MBTI-based perfume matching", "🌸 Mood Finder recommendations", "🛒 Saved cart & order history"].map(f => (
              <p key={f} style={leftFeatureItemStyle}>{f}</p>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div style={rightPanelStyle}>
        <div style={cardStyle}>
          <h1 style={titleStyle}>Welcome Back</h1>
          <p style={subtitleStyle}>Log in to continue your perfume journey</p>

          <form onSubmit={handleSubmit}>
            <label style={labelStyle}>Email</label>
            <input style={inputStyle} type="email" name="email" placeholder="Enter your email" value={formData.email} onChange={handleChange} />

            <label style={labelStyle}>Password</label>
            <input style={inputStyle} type="password" name="password" placeholder="Enter your password" value={formData.password} onChange={handleChange} />

            {error && <p style={errorStyle}>{error}</p>}

            <button type="submit" style={submitBtnStyle} disabled={loading}>
              {loading ? "Signing in..." : "Login →"}
            </button>
          </form>

          <div style={dividerStyle}><span style={dividerTextStyle}>or</span></div>

          <p style={footerTextStyle}>
            Don't have an account?{" "}
            <Link to="/signup" style={linkStyle}>Create one here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

const pageStyle = { minHeight: "100vh", display: "flex" };
const leftPanelStyle = { flex: 1, background: "linear-gradient(135deg, #0a0a0a 0%, #1a1208 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: "60px 48px" };
const leftContentStyle = { maxWidth: "420px" };
const leftLogoStyle = { display: "flex", alignItems: "center", gap: "12px", marginBottom: "40px" };
const leftLogoTextStyle = { fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", fontWeight: "700", color: "#c9a84c" };
const leftTitleStyle = { fontFamily: "'Playfair Display', serif", fontSize: "2.2rem", fontWeight: "700", color: "white", lineHeight: "1.3", marginBottom: "16px" };
const leftDescStyle = { color: "#9ca3af", fontSize: "1rem", lineHeight: "1.7", marginBottom: "32px" };
const leftFeaturesStyle = { display: "flex", flexDirection: "column", gap: "12px" };
const leftFeatureItemStyle = { color: "#d1d5db", fontSize: "0.95rem", margin: 0, padding: "10px 16px", backgroundColor: "rgba(201,168,76,0.08)", borderRadius: "10px", borderLeft: "3px solid #c9a84c" };
const rightPanelStyle = { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 48px", background: "#faf8f5" };
const cardStyle = { width: "100%", maxWidth: "420px", backgroundColor: "white", borderRadius: "24px", padding: "48px 40px", boxShadow: "0 20px 60px rgba(0,0,0,0.1)" };
const titleStyle = { fontFamily: "'Playfair Display', serif", fontSize: "2rem", fontWeight: "700", textAlign: "center", color: "#111827", marginBottom: "8px" };
const subtitleStyle = { textAlign: "center", color: "#6b7280", marginBottom: "32px", fontSize: "0.95rem" };
const labelStyle = { display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "0.9rem", color: "#374151" };
const inputStyle = { width: "100%", padding: "14px 16px", borderRadius: "12px", border: "1.5px solid #e5e7eb", outline: "none", fontSize: "1rem", boxSizing: "border-box", marginBottom: "20px", fontFamily: "'Inter', sans-serif", transition: "border 0.2s" };
const errorStyle = { color: "#dc2626", marginBottom: "12px", fontSize: "0.9rem" };
const submitBtnStyle = { width: "100%", padding: "15px", border: "none", borderRadius: "12px", background: "linear-gradient(135deg, #c9a84c, #a07830)", color: "white", fontSize: "1rem", fontWeight: "700", cursor: "pointer", marginTop: "4px", boxShadow: "0 6px 20px rgba(201,168,76,0.3)" };
const dividerStyle = { display: "flex", alignItems: "center", margin: "24px 0", gap: "12px" };
const dividerTextStyle = { color: "#d1d5db", fontSize: "0.85rem", whiteSpace: "nowrap" };
const footerTextStyle = { textAlign: "center", color: "#6b7280", fontSize: "0.9rem" };
const linkStyle = { color: "#c9a84c", fontWeight: "700", textDecoration: "none" };

export default Login;