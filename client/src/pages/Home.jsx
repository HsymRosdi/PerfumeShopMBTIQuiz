import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { logoutUser } from "../services/authService";

const Home = () => {
  const [userName, setUserName] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setLoggedIn(true);

        try {
          const userRef = doc(db, "users", user.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            setUserName(userSnap.data().fullName);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        setLoggedIn(false);
        setUserName("");
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f8f5ff 0%, #fff9f2 100%)",
        padding: "30px",
        color: "#111827",
      }}
    >
      {/* Top Bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "40px",
        }}
      >
        <h2 style={{ margin: 0 }}>Perfume Shop</h2>

        {loggedIn ? (
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <p style={{ margin: 0, fontWeight: "600" }}>Hi, {userName}</p>
            <button
              onClick={handleLogout}
              style={{
                padding: "10px 16px",
                border: "none",
                borderRadius: "10px",
                backgroundColor: "#111827",
                color: "white",
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", gap: "10px" }}>
            <Link to="/login">
              <button
                style={{
                  padding: "10px 16px",
                  border: "1px solid #111827",
                  borderRadius: "10px",
                  backgroundColor: "white",
                  color: "#111827",
                  cursor: "pointer",
                }}
              >
                Login
              </button>
            </Link>

            <Link to="/signup">
              <button
                style={{
                  padding: "10px 16px",
                  border: "none",
                  borderRadius: "10px",
                  backgroundColor: "#111827",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                Sign Up
              </button>
            </Link>
          </div>
        )}
      </div>

      {/* Hero Section */}
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        <h1 style={{ fontSize: "3rem", marginBottom: "10px" }}>
          Discover Your Perfect Scent
        </h1>
        <p style={{ fontSize: "1.1rem", color: "#6b7280" }}>
          Find perfumes that match your personality and style.
        </p>
      </div>
    </div>
  );
};

export default Home;