import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../services/authService";

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ fullName: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    const { fullName, email, password, confirmPassword } = formData;
    if (!fullName || !email || !password || !confirmPassword) { setError("Please fill in all fields."); return; }
    if (password !== confirmPassword) { setError("Passwords do not match."); return; }
    try {
      setLoading(true);
      await registerUser(fullName, email, password);
      setSuccess("Account created! Redirecting...");
      setTimeout(() => navigate("/login"), 1000);
    } catch (err) { setError(err.message); }
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
          <h2 style={leftTitleStyle}>Join the world of luxury fragrances</h2>
          <p style={leftDescStyle}>Create your account and unlock a personalised scent experience tailored to your personality.</p>
          <div style={leftFeaturesStyle}>
            {["🧠 Personality-based perfume quiz", "🌸 Mood-based recommendations", "🛒 Save cart & track orders", "✨ Exclusive member access"].map(f => (
              <p key={f} style={leftFeatureItemStyle}>{f}</p>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div style={rightPanelStyle}>
        <div style={cardStyle}>
          <h1 style={titleStyle}>Create Account</h1>
          <p style={subtitleStyle}>Join and discover your perfect scent</p>

          <form onSubmit={handleSubmit}>
            <label style={labelStyle}>Full Name</label>
            <input style={inputStyle} type="text" name="fullName" placeholder="Enter your full name" value={formData.fullName} onChange={handleChange} />

            <label style={labelStyle}>Email</label>
            <input style={inputStyle} type="email" name="email" placeholder="Enter your email" value={formData.email} onChange={handleChange} />

            <label style={labelStyle}>Password</label>
            <input style={inputStyle} type="password" name="password" placeholder="Create a password" value={formData.password} onChange={handleChange} />

            <label style={labelStyle}>Confirm Password</label>
            <input style={inputStyle} type="password" name="confirmPassword" placeholder="Confirm your password" value={formData.confirmPassword} onChange={handleChange} />

            {error && <p style={errorStyle}>{error}</p>}
            {success && <p style={successStyle}>{success}</p>}

            <button type="submit" style={submitBtnStyle} disabled={loading}>
              {loading ? "Creating account..." : "Create Account →"}
            </button>
          </form>

          <p style={footerTextStyle}>
            Already have an account?{" "}
            <Link to="/login" style={linkStyle}>Login here</Link>
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
const cardStyle = { width: "100%", maxWidth: "440px", backgroundColor: "white", borderRadius: "24px", padding: "48px 40px", boxShadow: "0 20px 60px rgba(0,0,0,0.1)" };
const titleStyle = { fontFamily: "'Playfair Display', serif", fontSize: "2rem", fontWeight: "700", textAlign: "center", color: "#111827", marginBottom: "8px" };
const subtitleStyle = { textAlign: "center", color: "#6b7280", marginBottom: "28px", fontSize: "0.95rem" };
const labelStyle = { display: "block", marginBottom: "6px", fontWeight: "600", fontSize: "0.88rem", color: "#374151" };
const inputStyle = { width: "100%", padding: "13px 16px", borderRadius: "12px", border: "1.5px solid #e5e7eb", outline: "none", fontSize: "0.95rem", boxSizing: "border-box", marginBottom: "16px", fontFamily: "'Inter', sans-serif" };
const errorStyle = { color: "#dc2626", marginBottom: "12px", fontSize: "0.88rem" };
const successStyle = { color: "#16a34a", marginBottom: "12px", fontSize: "0.88rem" };
const submitBtnStyle = { width: "100%", padding: "15px", border: "none", borderRadius: "12px", background: "linear-gradient(135deg, #c9a84c, #a07830)", color: "white", fontSize: "1rem", fontWeight: "700", cursor: "pointer", marginTop: "4px", boxShadow: "0 6px 20px rgba(201,168,76,0.3)" };
const footerTextStyle = { marginTop: "20px", textAlign: "center", color: "#6b7280", fontSize: "0.9rem" };
const linkStyle = { color: "#c9a84c", fontWeight: "700", textDecoration: "none" };

export default SignUp;