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
          setUserName(userSnap.exists() ? userSnap.data().fullName || user.email : user.email || "User");
        } catch { setUserName("User"); }
      } else {
        setLoggedIn(false);
        setUserName("");
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => { try { await logoutUser(); navigate("/"); } catch {} };

  return (
    <div style={{ minHeight: "100vh", background: "#faf8f5" }}>
      <Navbar loggedIn={loggedIn} userName={userName} onLogout={handleLogout} />

      {/* Hero Section */}
      <section style={heroStyle}>
        <div style={heroOverlayStyle} />
        <div style={heroContentStyle}>
          <p style={heroEyebrowStyle}>✦ Luxury Fragrances</p>
          <h1 style={heroTitleStyle}>Discover Your<br />Perfect Scent</h1>
          <p style={heroSubtitleStyle}>
            Find perfumes that match your personality, mood, and style — curated just for you.
          </p>
          <div style={heroBtnsStyle}>
            <Link to="/quiz">
              <button style={heroPrimaryBtnStyle}>🧠 Take the MBTI Quiz</button>
            </Link>
            <Link to="/mood">
              <button style={heroSecondaryBtnStyle}>🌸 Find by Mood</button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Strip */}
      <section style={featuresStripStyle}>
        {[
          { icon: "🚚", title: "Free Shipping", desc: "On orders over £100" },
          { icon: "🌸", title: "Mood Finder", desc: "Match scents to your vibe" },
          { icon: "🧠", title: "MBTI Quiz", desc: "Personality-based picks" },
          { icon: "✨", title: "Luxury Brands", desc: "Dior, Chanel & more" },
        ].map((f) => (
          <div key={f.title} style={featureItemStyle}>
            <span style={{ fontSize: "1.8rem" }}>{f.icon}</span>
            <div>
              <p style={featureTitleStyle}>{f.title}</p>
              <p style={featureDescStyle}>{f.desc}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Featured Perfumes */}
      <section style={sectionStyle}>
        <div style={sectionHeaderStyle}>
          <p style={sectionEyebrowStyle}>Our Collection</p>
          <h2 style={sectionTitleStyle}>Featured Perfumes</h2>
          <div style={titleUnderlineStyle} />
        </div>

        <div style={gridStyle}>
          {perfumes.map((perfume) => (
            <PerfumeCard key={perfume.id} perfume={perfume} onQuickView={setSelectedPerfume} />
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section style={ctaBannerStyle}>
        <div style={ctaInnerStyle}>
          <h2 style={ctaTitleStyle}>Not sure what to pick?</h2>
          <p style={ctaDescStyle}>Let our smart tools help you find the perfect fragrance based on your personality or mood.</p>
          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/quiz"><button style={ctaBtnGoldStyle}>🧠 Take the MBTI Quiz</button></Link>
            <Link to="/mood"><button style={ctaBtnWhiteStyle}>🌸 Try Mood Finder</button></Link>
          </div>
        </div>
      </section>

      <Footer />
      <QuickViewModal perfume={selectedPerfume} onClose={() => setSelectedPerfume(null)} />
    </div>
  );
};

const heroStyle = {
  position: "relative",
  minHeight: "600px",
  background: "linear-gradient(135deg, #0a0a0a 0%, #1a1208 50%, #0a0a0a 100%)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
};

const heroOverlayStyle = {
  position: "absolute",
  inset: 0,
  background: "radial-gradient(ellipse at center, rgba(201,168,76,0.15) 0%, transparent 70%)",
};

const heroContentStyle = {
  position: "relative",
  textAlign: "center",
  padding: "80px 20px",
  maxWidth: "700px",
};

const heroEyebrowStyle = {
  color: "#c9a84c",
  fontSize: "0.9rem",
  fontWeight: "600",
  letterSpacing: "3px",
  textTransform: "uppercase",
  marginBottom: "20px",
};

const heroTitleStyle = {
  fontFamily: "'Playfair Display', serif",
  fontSize: "4rem",
  fontWeight: "700",
  color: "white",
  lineHeight: "1.15",
  marginBottom: "24px",
};

const heroSubtitleStyle = {
  color: "#d1d5db",
  fontSize: "1.15rem",
  lineHeight: "1.7",
  marginBottom: "40px",
};

const heroBtnsStyle = {
  display: "flex",
  gap: "16px",
  justifyContent: "center",
  flexWrap: "wrap",
};

const heroPrimaryBtnStyle = {
  padding: "16px 36px",
  background: "linear-gradient(135deg, #c9a84c, #a07830)",
  color: "white",
  border: "none",
  borderRadius: "50px",
  fontWeight: "700",
  fontSize: "1rem",
  cursor: "pointer",
  boxShadow: "0 8px 24px rgba(201,168,76,0.35)",
};

const heroSecondaryBtnStyle = {
  padding: "16px 36px",
  background: "transparent",
  color: "white",
  border: "2px solid rgba(255,255,255,0.3)",
  borderRadius: "50px",
  fontWeight: "600",
  fontSize: "1rem",
  cursor: "pointer",
};

const featuresStripStyle = {
  backgroundColor: "white",
  padding: "28px 48px",
  display: "flex",
  justifyContent: "center",
  gap: "60px",
  flexWrap: "wrap",
  borderBottom: "1px solid #f3f4f6",
  boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
};

const featureItemStyle = {
  display: "flex",
  alignItems: "center",
  gap: "14px",
};

const featureTitleStyle = {
  fontWeight: "700",
  fontSize: "0.9rem",
  color: "#111827",
  margin: 0,
};

const featureDescStyle = {
  fontSize: "0.82rem",
  color: "#6b7280",
  margin: 0,
};

const sectionStyle = {
  padding: "80px 48px",
  maxWidth: "1400px",
  margin: "0 auto",
};

const sectionHeaderStyle = {
  textAlign: "center",
  marginBottom: "50px",
};

const sectionEyebrowStyle = {
  color: "#c9a84c",
  fontSize: "0.85rem",
  fontWeight: "600",
  letterSpacing: "3px",
  textTransform: "uppercase",
  marginBottom: "12px",
};

const sectionTitleStyle = {
  fontFamily: "'Playfair Display', serif",
  fontSize: "2.5rem",
  fontWeight: "700",
  color: "#111827",
  marginBottom: "16px",
};

const titleUnderlineStyle = {
  width: "60px",
  height: "3px",
  background: "linear-gradient(135deg, #c9a84c, #a07830)",
  borderRadius: "2px",
  margin: "0 auto",
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: "28px",
};

const ctaBannerStyle = {
  background: "linear-gradient(135deg, #0a0a0a 0%, #1a1208 100%)",
  padding: "80px 48px",
  margin: "0 0 0 0",
};

const ctaInnerStyle = {
  maxWidth: "700px",
  margin: "0 auto",
  textAlign: "center",
};

const ctaTitleStyle = {
  fontFamily: "'Playfair Display', serif",
  fontSize: "2.5rem",
  fontWeight: "700",
  color: "white",
  marginBottom: "16px",
};

const ctaDescStyle = {
  color: "#9ca3af",
  fontSize: "1.05rem",
  lineHeight: "1.7",
  marginBottom: "36px",
};

const ctaBtnGoldStyle = {
  padding: "16px 36px",
  background: "linear-gradient(135deg, #c9a84c, #a07830)",
  color: "white",
  border: "none",
  borderRadius: "50px",
  fontWeight: "700",
  fontSize: "1rem",
  cursor: "pointer",
  boxShadow: "0 8px 24px rgba(201,168,76,0.3)",
};

const ctaBtnWhiteStyle = {
  padding: "16px 36px",
  background: "transparent",
  color: "white",
  border: "2px solid rgba(255,255,255,0.3)",
  borderRadius: "50px",
  fontWeight: "600",
  fontSize: "1rem",
  cursor: "pointer",
};

export default Home;