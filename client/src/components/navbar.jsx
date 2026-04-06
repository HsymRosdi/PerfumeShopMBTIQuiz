import { Link } from "react-router-dom";

const Navbar = ({ loggedIn, userName, onLogout }) => {
  return (
    <>
      {/* Top Navbar */}
      <header
        style={{
          backgroundColor: "#111827",
          color: "white",
          padding: "18px 40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "15px",
        }}
      >
        <h2 style={{ margin: 0, fontSize: "1.5rem" }}>The Perfume Shop</h2>

        <nav style={{ display: "flex", gap: "20px", alignItems: "center" }}>
          <Link to="/" style={navLinkStyle}>
            Home
          </Link>
          <Link to="/men" style={navLinkStyle}>
            Men
          </Link>
          <Link to="/women" style={navLinkStyle}>
            Women
          </Link>
          <Link to="/unisex" style={navLinkStyle}>
            Unisex
          </Link>
          <Link to="/quiz" style={navLinkStyle}>
            Quiz
          </Link>
        </nav>

        {loggedIn ? (
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <p style={{ margin: 0, fontWeight: "600" }}>Hi, {userName}</p>
            <button onClick={onLogout} style={logoutButtonStyle}>
              Logout
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", gap: "10px" }}>
            <Link to="/login">
              <button style={loginButtonStyle}>Login</button>
            </Link>

            <Link to="/signup">
              <button style={signupButtonStyle}>Sign Up</button>
            </Link>
          </div>
        )}
      </header>

      {/* Category Bar */}
      <div
        style={{
          backgroundColor: "#f43f5e",
          display: "flex",
          justifyContent: "center",
          gap: "40px",
          padding: "14px 20px",
          flexWrap: "wrap",
        }}
      >
        <Link to="/men" style={categoryLinkStyle}>
          MEN'S
        </Link>
        <Link to="/women" style={categoryLinkStyle}>
          WOMEN'S
        </Link>
        <Link to="/unisex" style={categoryLinkStyle}>
          UNISEX
        </Link>
        <Link to="/quiz" style={categoryLinkStyle}>
          DISCOVERY QUIZ
        </Link>
      </div>
    </>
  );
};

const navLinkStyle = {
  color: "white",
  textDecoration: "none",
  fontWeight: "500",
};

const categoryLinkStyle = {
  color: "white",
  textDecoration: "none",
  fontWeight: "600",
  letterSpacing: "0.5px",
};

const loginButtonStyle = {
  padding: "10px 16px",
  border: "1px solid #111827",
  borderRadius: "10px",
  backgroundColor: "white",
  color: "#111827",
  cursor: "pointer",
  fontWeight: "600",
};

const signupButtonStyle = {
  padding: "10px 16px",
  border: "none",
  borderRadius: "10px",
  backgroundColor: "#111827",
  color: "white",
  cursor: "pointer",
  fontWeight: "600",
};

const logoutButtonStyle = {
  padding: "10px 16px",
  border: "none",
  borderRadius: "10px",
  backgroundColor: "#f43f5e",
  color: "white",
  cursor: "pointer",
  fontWeight: "600",
};

export default Navbar;