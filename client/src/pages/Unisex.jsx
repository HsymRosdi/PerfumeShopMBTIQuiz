import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { logoutUser } from "../services/authService";
import perfumes from "../data/perfume";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import PerfumeCard from "../components/PerfumeCard";
import QuickViewModal from "../components/quickView";

const Unisex = () => {
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

  const handleAddToCart = (perfume, quantity) => {
    console.log("Added to cart:", perfume.name, "Quantity:", quantity);
  };

  const unisexPerfumes = Array.isArray(perfumes)
    ? perfumes.filter((perfume) => perfume.gender === "Unisex")
    : [];

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

      <section style={{ padding: "50px 40px" }}>
        <h1
          style={{
            textAlign: "center",
            fontSize: "2.5rem",
            marginBottom: "10px",
          }}
        >
          Unisex Perfumes
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#6b7280",
            marginBottom: "30px",
          }}
        >
          Explore fragrances designed for everyone.
        </p>

        {unisexPerfumes.length === 0 ? (
          <p style={{ textAlign: "center", color: "#6b7280" }}>
            No perfumes found for this category.
          </p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "25px",
              maxWidth: "1400px",
              margin: "0 auto",
            }}
          >
            {unisexPerfumes.map((perfume) => (
              <PerfumeCard
                key={perfume.id}
                perfume={perfume}
                onQuickView={handleQuickView}
              />
            ))}
          </div>
        )}
      </section>

      <Footer />

      <QuickViewModal
        perfume={selectedPerfume}
        onClose={handleCloseModal}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
};

export default Unisex;