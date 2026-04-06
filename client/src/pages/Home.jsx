import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { logoutUser } from "../services/authService";
import perfumes from "../data/perfume";

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
            setUserName(userSnap.data().fullName || user.email || "User");
          } else {
            setUserName(user.email || "User");
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
        background: "#fffafc",
        color: "#111827",
        fontFamily: "Arial, sans-serif",
      }}
    >
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
            <button onClick={handleLogout} style={logoutButtonStyle}>
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

      {/* Hero Section */}
      <section
        style={{
          textAlign: "center",
          padding: "80px 20px 60px",
          background: "linear-gradient(135deg, #fff1f2 0%, #fdf2f8 100%)",
        }}
      >
        <h1 style={{ fontSize: "3rem", marginBottom: "16px" }}>
          Discover Your Perfect Scent
        </h1>
        <p
          style={{
            fontSize: "1.1rem",
            color: "#6b7280",
            marginBottom: "30px",
          }}
        >
          Find perfumes that match your personality, style, and mood.
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "15px",
            flexWrap: "wrap",
          }}
        >
          <Link to="/quiz">
            <button style={signupButtonStyle}>Take the Quiz</button>
          </Link>

          <Link to="/shop">
            <button style={loginButtonStyle}>Shop Now</button>
          </Link>
        </div>
      </section>

      {/* Featured Perfumes */}
      <section style={{ padding: "50px 40px" }}>
        <h2
          style={{
            textAlign: "center",
            marginBottom: "30px",
            fontSize: "2rem",
          }}
        >
          Featured Perfumes
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "25px",
          }}
        >
          {perfumes.map((perfume) => (
            <div
              key={perfume.id}
              style={{
                backgroundColor: "white",
                borderRadius: "16px",
                overflow: "hidden",
                boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
                transition: "0.3s ease",
              }}
            >
              <img
                src={perfume.image}
                alt={perfume.name}
                style={{
                  width: "100%",
                  height: "250px",
                  objectFit: "cover",
                }}
              />

              <div style={{ padding: "18px" }}>
                <p
                  style={{
                    color: "#f43f5e",
                    fontWeight: "700",
                    marginBottom: "8px",
                    fontSize: "0.9rem",
                  }}
                >
                  {perfume.gender}
                </p>

                <h3 style={{ margin: "0 0 8px", fontSize: "1.2rem" }}>
                  {perfume.name}
                </h3>

                <p style={{ color: "#6b7280", margin: "0 0 10px" }}>
                  {perfume.brand}
                </p>

                <p style={{ color: "#6b7280", margin: "0 0 10px" }}>
                  {perfume.category}
                </p>

                <p style={{ fontWeight: "700", marginBottom: "14px" }}>
                  £{perfume.price}
                </p>

                <button style={cardButtonStyle}>View Details</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
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

const cardButtonStyle = {
  width: "100%",
  padding: "10px",
  border: "none",
  borderRadius: "10px",
  backgroundColor: "#111827",
  color: "white",
  cursor: "pointer",
  fontWeight: "600",
};

export default Home;