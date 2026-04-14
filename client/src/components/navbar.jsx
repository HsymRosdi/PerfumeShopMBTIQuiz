import { Link, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";

const Navbar = ({ loggedIn, userName, onLogout }) => {
  const { cartCount } = useCart();
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Gold Top Bar */}
      <div style={topBarStyle}>
        <p style={topBarTextStyle}>✨ Free shipping on orders over £100 &nbsp;|&nbsp; New arrivals every week</p>
      </div>

      {/* Main Header */}
      <header style={headerStyle}>
        <Link to="/" style={{ textDecoration: "none" }}>
          <div style={logoStyle}>
            <span style={{ fontSize: "2rem" }}>🌸</span>
            <div>
              <div style={logoTitleStyle}>The Perfume Shop</div>
              <div style={logoTaglineStyle}>Luxury Fragrances</div>
            </div>
          </div>
        </Link>

        <nav style={navStyle}>
          {[{ path: "/", label: "Home" }, { path: "/men", label: "Men" }, { path: "/women", label: "Women" }, { path: "/unisex", label: "Unisex" }].map(({ path, label }) => (
            <Link key={path} to={path} style={{ ...navLinkStyle, color: isActive(path) ? "#c9a84c" : "white", borderBottom: isActive(path) ? "2px solid #c9a84c" : "2px solid transparent" }}>
              {label}
            </Link>
          ))}
          <Link to="/quiz" style={{ ...pillBtnStyle, background: "linear-gradient(135deg, #c9a84c, #a07830)" }}>🧠 Quiz</Link>
          <Link to="/mood" style={{ ...pillBtnStyle, background: "linear-gradient(135deg, #f43f5e, #e11d48)" }}>🌸 Mood</Link>
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          {loggedIn ? (
            <>
              <Link to="/cart" style={{ textDecoration: "none" }}>
                <div style={cartWrapperStyle}>
                  <span style={{ fontSize: "1.3rem" }}>🛒</span>
                  {cartCount > 0 && <span style={cartBadgeStyle}>{cartCount}</span>}
                </div>
              </Link>
              <span style={{ color: "#c9a84c", fontWeight: "600", fontSize: "0.9rem" }}>Hi, {userName}</span>
              <button onClick={onLogout} style={logoutBtnStyle}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login"><button style={loginBtnStyle}>Login</button></Link>
              <Link to="/signup"><button style={signupBtnStyle}>Sign Up</button></Link>
            </>
          )}
        </div>
      </header>
    </>
  );
};

const topBarStyle = { backgroundColor: "#c9a84c", padding: "8px 20px", textAlign: "center" };
const topBarTextStyle = { color: "#111827", fontSize: "0.82rem", fontWeight: "600", letterSpacing: "0.3px", margin: 0 };
const headerStyle = { backgroundColor: "#0a0a0a", color: "white", padding: "18px 48px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px", boxShadow: "0 2px 20px rgba(0,0,0,0.4)", position: "sticky", top: 0, zIndex: 1000 };
const logoStyle = { display: "flex", alignItems: "center", gap: "12px" };
const logoTitleStyle = { fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", fontWeight: "700", color: "#c9a84c", lineHeight: "1.2" };
const logoTaglineStyle = { fontSize: "0.7rem", color: "#9ca3af", letterSpacing: "2px", textTransform: "uppercase" };
const navStyle = { display: "flex", gap: "8px", alignItems: "center" };
const navLinkStyle = { textDecoration: "none", fontWeight: "500", fontSize: "0.95rem", padding: "6px 12px", borderRadius: "6px", transition: "all 0.2s ease" };
const pillBtnStyle = { color: "white", textDecoration: "none", fontWeight: "700", fontSize: "0.9rem", padding: "9px 18px", borderRadius: "25px", boxShadow: "0 4px 12px rgba(0,0,0,0.2)" };
const cartWrapperStyle = { position: "relative", display: "flex", alignItems: "center", justifyContent: "center", width: "42px", height: "42px", borderRadius: "50%", backgroundColor: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.3)", cursor: "pointer" };
const cartBadgeStyle = { position: "absolute", top: "-5px", right: "-5px", backgroundColor: "#f43f5e", color: "white", borderRadius: "50%", minWidth: "20px", height: "20px", fontSize: "0.72rem", fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "center", padding: "0 5px" };
const loginBtnStyle = { padding: "9px 20px", border: "1px solid rgba(201,168,76,0.5)", borderRadius: "25px", backgroundColor: "transparent", color: "#c9a84c", cursor: "pointer", fontWeight: "600", fontSize: "0.9rem" };
const signupBtnStyle = { padding: "9px 20px", border: "none", borderRadius: "25px", background: "linear-gradient(135deg, #c9a84c, #a07830)", color: "white", cursor: "pointer", fontWeight: "700", fontSize: "0.9rem" };
const logoutBtnStyle = { padding: "9px 20px", border: "none", borderRadius: "25px", backgroundColor: "#1f2937", color: "#c9a84c", cursor: "pointer", fontWeight: "600", fontSize: "0.9rem" };

export default Navbar;