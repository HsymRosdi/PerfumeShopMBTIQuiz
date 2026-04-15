import { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { logoutUser } from "../services/authService";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { useCart } from "../context/CartContext";
import perfumes from "../data/perfume";
import { calculateMbtiType, getQuizRecommendations, getMatchExplanation } from "../utils/quizRecommendation";

const QuizResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [userName, setUserName] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [mbtiResult, setMbtiResult] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [genderPreference, setGenderPreference] = useState("Unisex");
  const [expandedCard, setExpandedCard] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [savedToFirestore, setSavedToFirestore] = useState(false);

  // Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setLoggedIn(true);
        try {
          const snap = await getDoc(doc(db, "users", user.uid));
          setUserName(snap.exists() ? snap.data().fullName || user.email : user.email);
        } catch { setUserName("User"); }
      } else {
        setLoggedIn(false);
        setUserName("");
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => { try { await logoutUser(); navigate("/"); } catch {} };

  // Calculate MBTI and save to Firestore
  useEffect(() => {
    const answers = location.state?.answers;
    if (!answers || answers.length === 0) {
      navigate("/quiz");
      return;
    }

    const genderAnswer = answers.find(a => a.dimension === "gender");
    const gender = genderAnswer?.value || "Unisex";
    setGenderPreference(gender);

    const result = calculateMbtiType(answers);
    setMbtiResult(result);

    const recs = getQuizRecommendations(perfumes, result, gender, 5);
    setRecommendations(recs);

    setTimeout(() => setIsLoaded(true), 100);

    // Save MBTI result to Firestore if user is logged in
    const saveToFirestore = async () => {
      const user = auth.currentUser;
      if (!user) return;
      try {
        await setDoc(doc(db, "users", user.uid), {
          mbtiType: result.type,
          mbtiProfile: result.profile.name,
          mbtiStrengths: result.strengths,
          genderPreference: gender,
          mbtiUpdatedAt: new Date().toISOString(),
        }, { merge: true }); // merge: true so we don't overwrite other user data
        setSavedToFirestore(true);
      } catch (err) {
        console.error("Error saving MBTI result:", err);
      }
    };

    // Small delay to ensure auth is ready
    setTimeout(saveToFirestore, 1000);
  }, [location.state, navigate]);

  const handleAddToCart = (perfume) => addToCart(perfume, 1);
  const handleRetakeQuiz = () => navigate("/quiz");

  if (!mbtiResult) {
    return (
      <>
        <Navbar loggedIn={loggedIn} userName={userName} onLogout={handleLogout} />
        <main style={loadingStyle}>
          <div style={loadingSpinnerStyle} />
          <p>Analysing your personality...</p>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar loggedIn={loggedIn} userName={userName} onLogout={handleLogout} />
      <main style={mainStyle}>

        {/* Saved indicator */}
        {savedToFirestore && loggedIn && (
          <div style={savedBannerStyle}>
            ✅ Your MBTI result has been saved! The Mood Finder will now use your personality for smarter recommendations.
          </div>
        )}

        {/* Hero Result Section */}
        <div style={{
          ...heroSectionStyle,
          opacity: isLoaded ? 1 : 0,
          transform: isLoaded ? "translateY(0)" : "translateY(30px)"
        }}>
          <div style={mbtiTypeContainerStyle}>
            <p style={youAreTextStyle}>Your Fragrance Personality</p>
            <h1 style={mbtiTypeStyle}>{mbtiResult.type}</h1>
            <h2 style={mbtiNameStyle}>{mbtiResult.profile.name}</h2>
          </div>

          <p style={descriptionStyle}>{mbtiResult.profile.description}</p>

          <div style={fragranceStyleBoxStyle}>
            <p style={fragranceStyleLabelStyle}>Your Fragrance Style</p>
            <p style={fragranceStyleTextStyle}>{mbtiResult.profile.fragranceStyle}</p>
          </div>

          {/* Traits */}
          <div style={traitsContainerStyle}>
            {mbtiResult.profile.traits.map((trait, index) => (
              <span key={index} style={traitTagStyle}>{trait}</span>
            ))}
          </div>

          {/* Dimension Bars */}
          <div style={dimensionsContainerStyle}>
            {[
              { label: mbtiResult.type[0] === 'E' ? 'Extraversion' : 'Introversion', value: mbtiResult.strengths.EI },
              { label: mbtiResult.type[1] === 'S' ? 'Sensing' : 'Intuition', value: mbtiResult.strengths.SN },
              { label: mbtiResult.type[2] === 'T' ? 'Thinking' : 'Feeling', value: mbtiResult.strengths.TF },
              { label: mbtiResult.type[3] === 'J' ? 'Judging' : 'Perceiving', value: mbtiResult.strengths.JP },
            ].map(({ label, value }) => (
              <div key={label} style={dimensionRowStyle}>
                <span style={dimensionLabelStyle}>{label}</span>
                <div style={dimensionBarContainerStyle}>
                  <div style={{ ...dimensionBarStyle, width: `${value}%` }} />
                </div>
                <span style={dimensionPercentStyle}>{value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div style={recommendationsSectionStyle}>
          <h2 style={recTitleStyle}>Your Personalised Recommendations</h2>
          <p style={recSubtitleStyle}>
            Based on your {mbtiResult.profile.name} personality, here are the fragrances we recommend for you
          </p>

          <div style={perfumeGridStyle}>
            {recommendations.map((perfume) => (
              <div key={perfume.id} style={perfumeCardStyle}>
                <div style={imageWrapperStyle}>
                  <img src={perfume.image} alt={perfume.name} style={perfumeImageStyle} />
                  <div style={matchBadgeStyle}>{perfume.matchScore}% match</div>
                </div>

                <div style={cardContentStyle}>
                  <p style={cardBrandStyle}>{perfume.brand}</p>
                  <h3 style={cardNameStyle}>{perfume.name}</h3>
                  <p style={cardCategoryStyle}>{perfume.category} · {perfume.gender}</p>

                  {/* Why recommended */}
                  <div style={reasonsContainerStyle}>
                    {getMatchExplanation(perfume.scoreBreakdown, mbtiResult.profile).slice(0, 2).map((reason, i) => (
                      <span key={i} style={reasonTagStyle}>✓ {reason}</span>
                    ))}
                  </div>

                  <div style={cardFooterStyle}>
                    <span style={cardPriceStyle}>£{perfume.price}</span>
                    <button onClick={() => handleAddToCart(perfume)} style={addToCartBtnStyle}>
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={actionsStyle}>
            <button onClick={handleRetakeQuiz} style={retakeBtnStyle}>Retake Quiz</button>
            <Link to="/mood">
              <button style={moodBtnStyle}>🌸 Try Mood Finder</button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

// Styles
const mainStyle = { minHeight: "calc(100vh - 200px)", backgroundColor: "#faf8f5", padding: "40px 20px", display: "flex", flexDirection: "column", alignItems: "center" };
const loadingStyle = { minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "16px" };
const loadingSpinnerStyle = { width: "40px", height: "40px", border: "3px solid #e5e7eb", borderTop: "3px solid #c9a84c", borderRadius: "50%", animation: "spin 0.8s linear infinite" };
const savedBannerStyle = { width: "100%", maxWidth: "800px", backgroundColor: "#dcfce7", color: "#166534", padding: "12px 20px", borderRadius: "12px", fontSize: "0.9rem", fontWeight: "600", marginBottom: "20px", textAlign: "center", border: "1px solid #bbf7d0" };
const heroSectionStyle = { width: "100%", maxWidth: "800px", backgroundColor: "white", borderRadius: "24px", padding: "50px 40px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", marginBottom: "40px", textAlign: "center", transition: "opacity 0.5s ease, transform 0.5s ease" };
const mbtiTypeContainerStyle = { marginBottom: "24px" };
const youAreTextStyle = { color: "#c9a84c", fontSize: "0.85rem", fontWeight: "600", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "12px" };
const mbtiTypeStyle = { fontFamily: "'Playfair Display', serif", fontSize: "4rem", fontWeight: "700", color: "#111827", marginBottom: "8px" };
const mbtiNameStyle = { fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", color: "#6b7280", fontWeight: "400" };
const descriptionStyle = { color: "#374151", fontSize: "1rem", lineHeight: "1.7", marginBottom: "24px", maxWidth: "600px", margin: "0 auto 24px" };
const fragranceStyleBoxStyle = { backgroundColor: "#faf8f5", borderRadius: "12px", padding: "16px 24px", marginBottom: "24px", border: "1px solid #f3f4f6" };
const fragranceStyleLabelStyle = { color: "#c9a84c", fontSize: "0.8rem", fontWeight: "600", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "6px" };
const fragranceStyleTextStyle = { color: "#374151", fontSize: "0.95rem", fontStyle: "italic", margin: 0 };
const traitsContainerStyle = { display: "flex", flexWrap: "wrap", gap: "8px", justifyContent: "center", marginBottom: "32px" };
const traitTagStyle = { backgroundColor: "#111827", color: "#c9a84c", padding: "6px 16px", borderRadius: "20px", fontSize: "0.85rem", fontWeight: "600" };
const dimensionsContainerStyle = { display: "flex", flexDirection: "column", gap: "12px", maxWidth: "500px", margin: "0 auto" };
const dimensionRowStyle = { display: "flex", alignItems: "center", gap: "12px" };
const dimensionLabelStyle = { fontSize: "0.85rem", color: "#6b7280", minWidth: "120px", textAlign: "right" };
const dimensionBarContainerStyle = { flex: 1, height: "8px", backgroundColor: "#f3f4f6", borderRadius: "4px", overflow: "hidden" };
const dimensionBarStyle = { height: "100%", background: "linear-gradient(135deg, #c9a84c, #a07830)", borderRadius: "4px", transition: "width 0.8s ease" };
const dimensionPercentStyle = { fontSize: "0.82rem", color: "#9ca3af", minWidth: "36px" };
const recommendationsSectionStyle = { width: "100%", maxWidth: "1100px" };
const recTitleStyle = { fontFamily: "'Playfair Display', serif", fontSize: "2rem", fontWeight: "700", color: "#111827", textAlign: "center", marginBottom: "8px" };
const recSubtitleStyle = { color: "#6b7280", textAlign: "center", marginBottom: "40px", fontSize: "0.95rem" };
const perfumeGridStyle = { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px", marginBottom: "40px" };
const perfumeCardStyle = { backgroundColor: "white", borderRadius: "16px", overflow: "hidden", boxShadow: "0 4px 16px rgba(0,0,0,0.07)", border: "1px solid #f3f4f6" };
const imageWrapperStyle = { position: "relative" };
const perfumeImageStyle = { width: "100%", height: "220px", objectFit: "cover" };
const matchBadgeStyle = { position: "absolute", top: "12px", right: "12px", background: "linear-gradient(135deg, #c9a84c, #a07830)", color: "white", padding: "4px 12px", borderRadius: "20px", fontSize: "0.8rem", fontWeight: "700" };
const cardContentStyle = { padding: "18px 20px" };
const cardBrandStyle = { color: "#c9a84c", fontSize: "0.75rem", fontWeight: "600", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "4px" };
const cardNameStyle = { fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", fontWeight: "700", color: "#111827", marginBottom: "4px" };
const cardCategoryStyle = { color: "#9ca3af", fontSize: "0.85rem", marginBottom: "12px" };
const reasonsContainerStyle = { display: "flex", flexDirection: "column", gap: "4px", marginBottom: "16px" };
const reasonTagStyle = { color: "#166534", fontSize: "0.8rem", backgroundColor: "#dcfce7", padding: "4px 10px", borderRadius: "8px", fontWeight: "500" };
const cardFooterStyle = { display: "flex", justifyContent: "space-between", alignItems: "center" };
const cardPriceStyle = { fontFamily: "'Playfair Display', serif", fontWeight: "700", fontSize: "1.1rem", color: "#111827" };
const addToCartBtnStyle = { padding: "9px 16px", border: "none", borderRadius: "10px", background: "linear-gradient(135deg, #c9a84c, #a07830)", color: "white", fontWeight: "700", cursor: "pointer", fontSize: "0.85rem" };
const actionsStyle = { display: "flex", justifyContent: "center", gap: "16px", paddingTop: "20px", borderTop: "1px solid #f3f4f6" };
const retakeBtnStyle = { padding: "14px 32px", border: "2px solid #e5e7eb", borderRadius: "25px", backgroundColor: "white", color: "#374151", fontWeight: "600", cursor: "pointer", fontSize: "0.95rem" };
const moodBtnStyle = { padding: "14px 32px", border: "none", borderRadius: "25px", background: "linear-gradient(135deg, #f43f5e, #e11d48)", color: "white", fontWeight: "700", cursor: "pointer", fontSize: "0.95rem" };

export default QuizResults;