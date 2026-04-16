import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [checking, setChecking] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
      }
      setChecking(false);
    });
    return () => unsubscribe();
  }, []);

  // Still checking auth state
  if (checking) {
    return (
      <div style={loadingStyle}>
        <div style={spinnerStyle} />
      </div>
    );
  }

  // Not logged in — show login required screen
  if (!loggedIn) {
    return (
      <div style={pageStyle}>
        <div style={cardStyle}>
          <div style={iconStyle}>🔒</div>
          <h2 style={titleStyle}>Login Required</h2>
          <p style={descStyle}>
            You need to be logged in to access this page. Please login or create an account to continue.
          </p>
          <div style={btnsStyle}>
            <button
              onClick={() => navigate("/login", { state: { from: location.pathname } })}
              style={loginBtnStyle}
            >
              Login
            </button>
            <button
              onClick={() => navigate("/signup")}
              style={signupBtnStyle}
            >
              Create Account
            </button>
          </div>
          <button onClick={() => navigate("/")} style={backBtnStyle}>
            ← Back to Home
          </button>
        </div>
      </div>
    );
  }

  // Logged in — show the page
  return children;
};

const loadingStyle = { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#faf8f5" };
const spinnerStyle = { width: "40px", height: "40px", border: "3px solid #f3f4f6", borderTop: "3px solid #c9a84c", borderRadius: "50%", animation: "spin 0.8s linear infinite" };
const pageStyle = { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#faf8f5", padding: "20px" };
const cardStyle = { backgroundColor: "white", borderRadius: "24px", padding: "60px 48px", maxWidth: "460px", width: "100%", textAlign: "center", boxShadow: "0 20px 60px rgba(0,0,0,0.1)", border: "1px solid #f3f4f6" };
const iconStyle = { fontSize: "3.5rem", marginBottom: "20px" };
const titleStyle = { fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", fontWeight: "700", color: "#111827", marginBottom: "12px" };
const descStyle = { color: "#6b7280", fontSize: "0.95rem", lineHeight: "1.7", marginBottom: "32px" };
const btnsStyle = { display: "flex", gap: "12px", justifyContent: "center", marginBottom: "20px" };
const loginBtnStyle = { padding: "13px 32px", border: "none", borderRadius: "12px", background: "linear-gradient(135deg, #c9a84c, #a07830)", color: "white", fontWeight: "700", cursor: "pointer", fontSize: "0.95rem", boxShadow: "0 6px 20px rgba(201,168,76,0.3)" };
const signupBtnStyle = { padding: "13px 32px", border: "1.5px solid #e5e7eb", borderRadius: "12px", backgroundColor: "white", color: "#374151", fontWeight: "600", cursor: "pointer", fontSize: "0.95rem" };
const backBtnStyle = { background: "none", border: "none", color: "#9ca3af", cursor: "pointer", fontSize: "0.88rem" };

export default ProtectedRoute;