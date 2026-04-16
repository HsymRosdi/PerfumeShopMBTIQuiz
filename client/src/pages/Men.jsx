import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { logoutUser } from "../services/authService";
import perfumes from "../data/perfume";
import Navbar from "../components/layout/navbar";
import Footer from "../components/layout/footer";
import PerfumeCard from "../components/perfume/perfumecard";
import QuickViewModal from "../components/perfume/quickView";
import useRatings from "../hooks/useRatings";

const Men = () => {
  const [userName, setUserName] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [selectedPerfume, setSelectedPerfume] = useState(null);
  const [filter, setFilter] = useState("All");
  const navigate = useNavigate();
  const { ratingsMap } = useRatings();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setLoggedIn(true);
        try {
          const snap = await getDoc(doc(db, "users", user.uid));
          setUserName(snap.exists() ? snap.data().fullName || user.email : user.email);
        } catch { setUserName("User"); }
      } else { setLoggedIn(false); setUserName(""); }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => { try { await logoutUser(); navigate("/"); } catch {} };

  const basePerfumes = perfumes.filter(p => p.gender === "Male" || p.gender === "Unisex");
  const pageTitle = "Men's Fragrances";
  const pageSubtitle = "Bold, sophisticated and timeless scents for the modern man";
  const accentColor = "#c9a84c";

  const categories = ["All", ...new Set(basePerfumes.map(p => p.category))];
  const filtered = filter === "All" ? basePerfumes : basePerfumes.filter(p => p.category === filter);

  return (
    <div style={{ minHeight: "100vh", background: "#faf8f5" }}>
      <Navbar loggedIn={loggedIn} userName={userName} onLogout={handleLogout} />

      <section style={{ ...pageHeaderStyle, background: "linear-gradient(135deg, #0a0a0a, #1a1208)" }}>
        <div style={pageHeaderOverlayStyle} />
        <div style={{ position: "relative", textAlign: "center" }}>
          <p style={{ ...eyebrowStyle, color: accentColor }}>The Collection</p>
          <h1 style={pageTitleStyle}>{pageTitle}</h1>
          <p style={pageSubtitleStyle}>{pageSubtitle}</p>
        </div>
      </section>

      <section style={filterBarStyle}>
        <p style={filterLabelStyle}>Filter by:</p>
        <div style={filterBtnsStyle}>
          {categories.map(cat => (
            <button key={cat} onClick={() => setFilter(cat)} style={{ ...filterBtnStyle, backgroundColor: filter === cat ? "#0a0a0a" : "white", color: filter === cat ? "#c9a84c" : "#6b7280", border: filter === cat ? "1px solid #0a0a0a" : "1px solid #e5e7eb" }}>
              {cat}
            </button>
          ))}
        </div>
        <p style={countStyle}>{filtered.length} fragrances</p>
      </section>

      <section style={sectionStyle}>
        <div style={gridStyle}>
          {filtered.map(perfume => (
            <PerfumeCard
              key={perfume.id}
              perfume={perfume}
              onQuickView={setSelectedPerfume}
              avgRating={ratingsMap[perfume.id] || null}
            />
          ))}
        </div>
      </section>

      <Footer />
      <QuickViewModal perfume={selectedPerfume} onClose={() => setSelectedPerfume(null)} />
    </div>
  );
};

const pageHeaderStyle = { position: "relative", padding: "80px 48px", overflow: "hidden" };
const pageHeaderOverlayStyle = { position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, rgba(201,168,76,0.1) 0%, transparent 70%)" };
const eyebrowStyle = { fontSize: "0.85rem", fontWeight: "600", letterSpacing: "3px", textTransform: "uppercase", marginBottom: "12px" };
const pageTitleStyle = { fontFamily: "'Playfair Display', serif", fontSize: "3rem", fontWeight: "700", color: "white", marginBottom: "12px" };
const pageSubtitleStyle = { color: "#9ca3af", fontSize: "1.05rem" };
const filterBarStyle = { backgroundColor: "white", padding: "20px 48px", display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap", borderBottom: "1px solid #f3f4f6", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" };
const filterLabelStyle = { color: "#6b7280", fontWeight: "600", fontSize: "0.9rem", margin: 0, whiteSpace: "nowrap" };
const filterBtnsStyle = { display: "flex", gap: "8px", flexWrap: "wrap", flex: 1 };
const filterBtnStyle = { padding: "8px 18px", borderRadius: "25px", cursor: "pointer", fontWeight: "600", fontSize: "0.85rem", transition: "all 0.2s ease" };
const countStyle = { color: "#9ca3af", fontSize: "0.85rem", margin: 0, whiteSpace: "nowrap" };
const sectionStyle = { padding: "60px 48px", maxWidth: "1400px", margin: "0 auto" };
const gridStyle = { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "28px" };

export default Men;