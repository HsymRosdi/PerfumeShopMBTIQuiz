import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer style={footerStyle}>
      <div style={footerInnerStyle}>
        {/* Brand */}
        <div style={brandColStyle}>
          <div style={footerLogoStyle}>
            <span style={{ fontSize: "1.8rem" }}>🌸</span>
            <span style={footerLogoTextStyle}>The Perfume Shop</span>
          </div>
          <p style={footerDescStyle}>
            Discover fragrances that match your personality, mood, and style. 
            Luxury scents for every occasion.
          </p>
        </div>

        {/* Shop Links */}
        <div style={colStyle}>
          <h4 style={colTitleStyle}>Shop</h4>
          <Link to="/men" style={footerLinkStyle}>Men's Fragrances</Link>
          <Link to="/women" style={footerLinkStyle}>Women's Fragrances</Link>
          <Link to="/unisex" style={footerLinkStyle}>Unisex Collection</Link>
          <Link to="/cart" style={footerLinkStyle}>Your Cart</Link>
        </div>

        {/* Discover */}
        <div style={colStyle}>
          <h4 style={colTitleStyle}>Discover</h4>
          <Link to="/quiz" style={footerLinkStyle}>🧠 MBTI Quiz</Link>
          <Link to="/mood" style={footerLinkStyle}>🌸 Mood Finder</Link>
        </div>

        {/* Account */}
        <div style={colStyle}>
          <h4 style={colTitleStyle}>Account</h4>
          <Link to="/login" style={footerLinkStyle}>Login</Link>
          <Link to="/signup" style={footerLinkStyle}>Sign Up</Link>
        </div>
      </div>

      <div style={dividerStyle} />

      <div style={bottomStyle}>
        <p style={copyrightStyle}>© 2026 The Perfume Shop. All rights reserved.</p>
        <p style={madeByStyle}>Made with 🌸 for FYP</p>
      </div>
    </footer>
  );
};

const footerStyle = { backgroundColor: "#0a0a0a", color: "white", padding: "60px 48px 30px", marginTop: "80px" };
const footerInnerStyle = { display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "48px", maxWidth: "1200px", margin: "0 auto", paddingBottom: "40px" };
const brandColStyle = { display: "flex", flexDirection: "column", gap: "16px" };
const footerLogoStyle = { display: "flex", alignItems: "center", gap: "10px" };
const footerLogoTextStyle = { fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", fontWeight: "700", color: "#c9a84c" };
const footerDescStyle = { color: "#9ca3af", fontSize: "0.9rem", lineHeight: "1.7" };
const colStyle = { display: "flex", flexDirection: "column", gap: "12px" };
const colTitleStyle = { fontFamily: "'Playfair Display', serif", color: "#c9a84c", fontSize: "1rem", fontWeight: "700", marginBottom: "4px" };
const footerLinkStyle = { color: "#d1d5db", fontSize: "0.9rem", textDecoration: "none", transition: "color 0.2s", lineHeight: "1.6" };
const dividerStyle = { height: "1px", backgroundColor: "#1f2937", maxWidth: "1200px", margin: "0 auto 24px" };
const bottomStyle = { display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: "1200px", margin: "0 auto", flexWrap: "wrap", gap: "10px" };
const copyrightStyle = { color: "#6b7280", fontSize: "0.85rem", margin: 0 };
const madeByStyle = { color: "#6b7280", fontSize: "0.85rem", margin: 0 };

export default Footer;