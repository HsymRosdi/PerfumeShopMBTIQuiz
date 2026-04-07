import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { logoutUser } from "../services/authService";
import perfumes from "../data/perfume";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import PerfumeCard from "../components/PerfumeCard";
import QuickViewModal from "../components/quickView";

const Home = () => {
  const [userName, setUserName] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [selectedPerfume, setSelectedPerfume] = useState(null);

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

  const handleQuickView = (perfume) => {
    setSelectedPerfume(perfume);
  };

  const handleCloseModal = () => {
    setSelectedPerfume(null);
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
      <Navbar
        loggedIn={loggedIn}
        userName={userName}
        onLogout={handleLogout}
      />

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
          <Link to="/men">
  <button style={darkButtonStyle}>Shop Men's</button>
</Link>

<Link to="/women">
  <button style={lightButtonStyle}>Shop Women's</button>
</Link>
        </div>
      </section>

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
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "25px",
            maxWidth: "1400px",
            margin: "0 auto",
          }}
        >
          {perfumes.map((perfume) => (
            <PerfumeCard
              key={perfume.id}
              perfume={perfume}
              onQuickView={handleQuickView}
            />
          ))}
        </div>
      </section>

      <Footer />

      <QuickViewModal
        perfume={selectedPerfume}
        onClose={handleCloseModal}
        
      />
    </div>
  );
};

const lightButtonStyle = {
  padding: "10px 16px",
  border: "1px solid #111827",
  borderRadius: "10px",
  backgroundColor: "white",
  color: "#111827",
  cursor: "pointer",
  fontWeight: "600",
};

const darkButtonStyle = {
  padding: "10px 16px",
  border: "none",
  borderRadius: "10px",
  backgroundColor: "#111827",
  color: "white",
  cursor: "pointer",
  fontWeight: "600",
};

export default Home;