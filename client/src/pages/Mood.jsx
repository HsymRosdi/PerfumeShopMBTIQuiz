import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { logoutUser } from "../services/authService";
import Navbar from "../components/layout/navbar";
import Footer from "../components/layout/footer";
import perfumes from "../data/perfume";
import { useCart } from "../components/cart/CartContext";

// ─── Mood Definitions ───────────────────────────────────────────────────────
const moods = [
  {
    id: "happy",
    label: "Happy",
    emoji: "😊",
    description: "Bright, fresh and uplifting scents",
    color: "#FEF08A",
    textColor: "#854D0E",
    tags: ["energetic", "clean", "relaxed"],
    categories: ["Fresh", "Citrus"],
    occasions: ["daily", "summer"],
  },
  {
    id: "romantic",
    label: "Romantic",
    emoji: "🌹",
    description: "Soft, floral and dreamy scents",
    color: "#FECDD3",
    textColor: "#9F1239",
    tags: ["romantic", "soft", "feminine"],
    categories: ["Floral", "Sweet"],
    occasions: ["date", "night"],
  },
  {
    id: "energetic",
    label: "Energetic",
    emoji: "⚡",
    description: "Bold, spicy and powerful scents",
    color: "#FED7AA",
    textColor: "#9A3412",
    tags: ["bold", "sporty", "charismatic"],
    categories: ["Fresh", "Citrus"],
    occasions: ["daily", "party"],
  },
  {
    id: "calm",
    label: "Calm",
    emoji: "😌",
    description: "Gentle, clean and comforting scents",
    color: "#BBF7D0",
    textColor: "#14532D",
    tags: ["calm", "clean", "simple", "easygoing"],
    categories: ["Fresh", "Woody"],
    occasions: ["daily"],
  },
  {
    id: "mysterious",
    label: "Mysterious",
    emoji: "🌙",
    description: "Deep, oriental and seductive scents",
    color: "#E9D5FF",
    textColor: "#581C87",
    tags: ["mysterious", "bold", "elegant", "mature"],
    categories: ["Oriental", "Woody"],
    occasions: ["night", "formal"],
  },
];

// ─── MBTI × Mood Compatibility ───────────────────────────────────────────────
// Each MBTI type has mood weights — higher = stronger match for that mood
const mbtiMoodWeights = {
  INTJ: { happy: 0.6, romantic: 0.7, energetic: 0.8, calm: 0.9, mysterious: 1.0 },
  INTP: { happy: 0.7, romantic: 0.6, energetic: 0.7, calm: 1.0, mysterious: 0.9 },
  ENTJ: { happy: 0.8, romantic: 0.7, energetic: 1.0, calm: 0.6, mysterious: 0.8 },
  ENTP: { happy: 0.9, romantic: 0.7, energetic: 1.0, calm: 0.6, mysterious: 0.8 },
  INFJ: { happy: 0.7, romantic: 1.0, energetic: 0.6, calm: 0.9, mysterious: 0.9 },
  INFP: { happy: 0.8, romantic: 1.0, energetic: 0.5, calm: 0.9, mysterious: 0.7 },
  ENFJ: { happy: 1.0, romantic: 0.9, energetic: 0.8, calm: 0.7, mysterious: 0.6 },
  ENFP: { happy: 1.0, romantic: 0.9, energetic: 0.9, calm: 0.6, mysterious: 0.7 },
  ISTJ: { happy: 0.7, romantic: 0.6, energetic: 0.7, calm: 1.0, mysterious: 0.7 },
  ISFJ: { happy: 0.8, romantic: 0.9, energetic: 0.5, calm: 1.0, mysterious: 0.6 },
  ESTJ: { happy: 0.8, romantic: 0.6, energetic: 1.0, calm: 0.7, mysterious: 0.7 },
  ESFJ: { happy: 1.0, romantic: 0.9, energetic: 0.8, calm: 0.7, mysterious: 0.5 },
  ISTP: { happy: 0.7, romantic: 0.6, energetic: 0.9, calm: 1.0, mysterious: 0.8 },
  ISFP: { happy: 0.8, romantic: 0.9, energetic: 0.6, calm: 0.9, mysterious: 0.7 },
  ESTP: { happy: 0.9, romantic: 0.7, energetic: 1.0, calm: 0.5, mysterious: 0.7 },
  ESFP: { happy: 1.0, romantic: 0.9, energetic: 1.0, calm: 0.5, mysterious: 0.6 },
};

// ─── Scoring Algorithm ────────────────────────────────────────────────────────
/**
 * Scores a perfume based on mood + MBTI personality
 * 
 * Weights:
 * - Category match:     30 pts
 * - Personality tags:   25 pts
 * - MBTI direct match:  25 pts
 * - Occasion match:     10 pts
 * - MBTI mood weight:   10 pts (multiplier)
 */
function getMoodMbtiScore(perfume, mood, mbtiType) {
  let score = 0;
  const breakdown = {};

  // 1. Category match (30 pts)
  if (mood.categories.includes(perfume.category)) {
    score += 30;
    breakdown.category = 30;
  } else {
    breakdown.category = 0;
  }

  // 2. Personality tag match (25 pts)
  const matchedTags = perfume.personalityTags?.filter(tag => mood.tags.includes(tag)) || [];
  const tagScore = Math.min(matchedTags.length * 10, 25);
  score += tagScore;
  breakdown.tags = tagScore;
  breakdown.matchedTags = matchedTags;

  // 3. MBTI direct match (25 pts)
  if (mbtiType && perfume.mbtiTypes?.includes(mbtiType)) {
    score += 25;
    breakdown.mbti = 25;
  } else {
    breakdown.mbti = 0;
  }

  // 4. Occasion match (10 pts)
  const matchedOccasions = perfume.occasion?.filter(occ => mood.occasions.includes(occ)) || [];
  const occasionScore = Math.min(matchedOccasions.length * 5, 10);
  score += occasionScore;
  breakdown.occasion = occasionScore;

  // 5. MBTI × Mood compatibility multiplier (10 pts)
  if (mbtiType && mbtiMoodWeights[mbtiType]) {
    const moodWeight = mbtiMoodWeights[mbtiType][mood.id] || 0.7;
    const compatibilityScore = Math.round(moodWeight * 10);
    score += compatibilityScore;
    breakdown.compatibility = compatibilityScore;
  } else {
    breakdown.compatibility = 5; // neutral if no MBTI
  }

  return { score: Math.min(score, 100), breakdown };
}

// ─── Explanation Generator ────────────────────────────────────────────────────
function getExplanation(perfume, mood, mbtiType, breakdown) {
  const reasons = [];

  if (breakdown.category > 0) {
    reasons.push(`${perfume.category} scent family matches ${mood.label.toLowerCase()} mood`);
  }
  if (breakdown.matchedTags?.length > 0) {
    reasons.push(`Personality notes: ${breakdown.matchedTags.join(", ")}`);
  }
  if (breakdown.mbti > 0) {
    reasons.push(`Curated for ${mbtiType} personality types`);
  }
  if (breakdown.compatibility >= 8) {
    reasons.push(`High personality-mood compatibility`);
  }

  return reasons.slice(0, 3);
}

// ─── Main Component ───────────────────────────────────────────────────────────
const Mood = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [userName, setUserName] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [mbtiType, setMbtiType] = useState(null);
  const [mbtiProfileName, setMbtiProfileName] = useState(null);
  const [selectedMood, setSelectedMood] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [loadingMbti, setLoadingMbti] = useState(true);

  // Auth + fetch saved MBTI from Firestore
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setLoggedIn(true);
        try {
          const snap = await getDoc(doc(db, "users", user.uid));
          if (snap.exists()) {
            const data = snap.data();
            setUserName(data.fullName || user.email);
            if (data.mbtiType) {
              setMbtiType(data.mbtiType);
              setMbtiProfileName(data.mbtiProfile);
            }
          }
        } catch { setUserName("User"); }
      } else {
        setLoggedIn(false);
        setUserName("");
      }
      setLoadingMbti(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => { try { await logoutUser(); } catch {} };

  const handleMoodSelect = (mood) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setSelectedMood(mood);

      // Score all perfumes using mood + MBTI
      const scored = perfumes.map(perfume => {
        const { score, breakdown } = getMoodMbtiScore(perfume, mood, mbtiType);
        return {
          ...perfume,
          moodScore: score,
          scoreBreakdown: breakdown,
          explanation: getExplanation(perfume, mood, mbtiType, breakdown),
        };
      });

      const top = scored
        .filter(p => p.moodScore > 0)
        .sort((a, b) => b.moodScore - a.moodScore)
        .slice(0, 4);

      setRecommendations(top);
      setIsTransitioning(false);
    }, 300);
  };

  const handleReset = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setSelectedMood(null);
      setRecommendations([]);
      setIsTransitioning(false);
    }, 300);
  };

  return (
    <>
      <Navbar loggedIn={loggedIn} userName={userName} onLogout={handleLogout} />
      <main style={mainStyle}>

        {/* Header */}
        <div style={headerStyle}>
          <p style={eyebrowStyle}>Smart Recommender</p>
          <h1 style={titleStyle}>Find Your Mood Scent</h1>
          <p style={subtitleStyle}>
            How are you feeling today? Pick your mood and we'll find the perfect perfume for you.
          </p>

          {/* MBTI Status Banner */}
          {!loadingMbti && (
            <div style={mbtiType ? mbtiActiveBannerStyle : mbtiMissingBannerStyle}>
              {mbtiType ? (
                <>🧠 Personalising with your <strong>{mbtiType} — {mbtiProfileName}</strong> personality</>
              ) : (
                <>
                  💡 Take the <span onClick={() => navigate("/quiz")} style={quizLinkStyle}>MBTI Quiz</span> first for smarter personalised recommendations!
                </>
              )}
            </div>
          )}
        </div>

        {/* Mood Selector */}
        {!selectedMood && (
          <div style={{ ...moodGridStyle, opacity: isTransitioning ? 0 : 1, transform: isTransitioning ? "translateY(20px)" : "translateY(0)" }}>
            {moods.map((mood) => (
              <button key={mood.id} onClick={() => handleMoodSelect(mood)} style={{ ...moodCardStyle, backgroundColor: mood.color }}>
                <span style={moodEmojiStyle}>{mood.emoji}</span>
                <h3 style={{ ...moodLabelStyle, color: mood.textColor }}>{mood.label}</h3>
                <p style={{ ...moodDescStyle, color: mood.textColor }}>{mood.description}</p>
              </button>
            ))}
          </div>
        )}

        {/* Results */}
        {selectedMood && (
          <div style={{ ...resultsContainerStyle, opacity: isTransitioning ? 0 : 1, transform: isTransitioning ? "translateY(20px)" : "translateY(0)" }}>

            {/* Mood Banner */}
            <div style={{ ...moodBannerStyle, backgroundColor: selectedMood.color }}>
              <span style={{ fontSize: "3rem" }}>{selectedMood.emoji}</span>
              <div style={{ flex: 1 }}>
                <h2 style={{ ...moodBannerTitleStyle, color: selectedMood.textColor }}>
                  {selectedMood.label} Mood
                  {mbtiType && <span style={mbtiChipStyle}> + {mbtiType}</span>}
                </h2>
                <p style={{ ...moodBannerDescStyle, color: selectedMood.textColor }}>
                  {mbtiType
                    ? `Personalised for your ${mbtiType} personality and ${selectedMood.label.toLowerCase()} mood`
                    : selectedMood.description}
                </p>
              </div>
              <button onClick={handleReset} style={resetBtnStyle}>Change Mood</button>
            </div>

            {/* Algorithm info */}
            <div style={algorithmInfoStyle}>
              <p style={algorithmTextStyle}>
                🔬 Scored using: <strong>Category match</strong> + <strong>Personality tags</strong>
                {mbtiType && <> + <strong>MBTI ({mbtiType}) match</strong> + <strong>Personality-mood compatibility</strong></>}
              </p>
            </div>

            {/* Recommended Perfumes */}
            <h3 style={recTitleStyle}>Perfect Scents For You</h3>
            <div style={perfumeGridStyle}>
              {recommendations.length > 0 ? recommendations.map((perfume) => (
                <div key={perfume.id} style={perfumeCardStyle}>
                  <div style={imageWrapperStyle}>
                    <img src={perfume.image} alt={perfume.name} style={imageStyle} />
                    <div style={scoreBadgeStyle}>{perfume.moodScore}% match</div>
                  </div>
                  <div style={{ padding: "18px" }}>
                    <p style={cardBrandStyle}>{perfume.brand}</p>
                    <h3 style={cardNameStyle}>{perfume.name}</h3>
                    <p style={cardCategoryStyle}>{perfume.category} · {perfume.gender}</p>

                    {/* Why recommended */}
                    <div style={explanationBoxStyle}>
                      <p style={explanationTitleStyle}>Why recommended:</p>
                      {perfume.explanation.map((reason, i) => (
                        <p key={i} style={explanationItemStyle}>✓ {reason}</p>
                      ))}
                    </div>

                    <div style={cardFooterStyle}>
                      <p style={priceStyle}>£{perfume.price}</p>
                      <button onClick={() => addToCart(perfume, 1)} style={addCartBtnStyle}>Add to Cart</button>
                    </div>
                  </div>
                </div>
              )) : (
                <p style={{ color: "#6b7280", textAlign: "center", gridColumn: "1 / -1" }}>No perfumes found. Try a different mood!</p>
              )}
            </div>

            {/* Try another mood */}
            <div style={tryAnotherStyle}>
              <p style={{ color: "#6b7280", marginBottom: "16px", fontSize: "0.95rem" }}>Want to explore a different vibe?</p>
              <div style={moodChipsStyle}>
                {moods.filter(m => m.id !== selectedMood.id).map(mood => (
                  <button key={mood.id} onClick={() => handleMoodSelect(mood)} style={{ ...moodChipStyle, backgroundColor: mood.color, color: mood.textColor }}>
                    {mood.emoji} {mood.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const mainStyle = { minHeight: "calc(100vh - 200px)", backgroundColor: "#faf8f5", padding: "40px 20px", display: "flex", flexDirection: "column", alignItems: "center" };
const headerStyle = { textAlign: "center", marginBottom: "50px", maxWidth: "650px", width: "100%" };
const eyebrowStyle = { color: "#c9a84c", fontSize: "0.85rem", fontWeight: "600", letterSpacing: "3px", textTransform: "uppercase", marginBottom: "12px" };
const titleStyle = { fontFamily: "'Playfair Display', serif", fontSize: "2.5rem", fontWeight: "700", color: "#111827", marginBottom: "12px" };
const subtitleStyle = { fontSize: "1.05rem", color: "#6b7280", lineHeight: "1.6", marginBottom: "20px" };
const mbtiActiveBannerStyle = { backgroundColor: "#dcfce7", color: "#166534", padding: "12px 20px", borderRadius: "12px", fontSize: "0.9rem", border: "1px solid #bbf7d0", marginTop: "8px" };
const mbtiMissingBannerStyle = { backgroundColor: "#fef3c7", color: "#92400e", padding: "12px 20px", borderRadius: "12px", fontSize: "0.9rem", border: "1px solid #fde68a", marginTop: "8px" };
const quizLinkStyle = { color: "#c9a84c", fontWeight: "700", cursor: "pointer", textDecoration: "underline" };
const moodGridStyle = { display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "20px", maxWidth: "1000px", width: "100%", transition: "opacity 0.3s ease, transform 0.3s ease" };
const moodCardStyle = { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "30px 20px", borderRadius: "20px", border: "none", cursor: "pointer", transition: "transform 0.2s ease, box-shadow 0.2s ease", boxShadow: "0 4px 15px rgba(0,0,0,0.08)", gap: "10px" };
const moodEmojiStyle = { fontSize: "3rem" };
const moodLabelStyle = { fontSize: "1.2rem", fontWeight: "700", margin: 0 };
const moodDescStyle = { fontSize: "0.82rem", margin: 0, textAlign: "center", lineHeight: "1.4" };
const resultsContainerStyle = { width: "100%", maxWidth: "1100px", transition: "opacity 0.3s ease, transform 0.3s ease" };
const moodBannerStyle = { display: "flex", alignItems: "center", gap: "24px", padding: "28px 36px", borderRadius: "20px", marginBottom: "20px", flexWrap: "wrap" };
const moodBannerTitleStyle = { fontFamily: "'Playfair Display', serif", fontSize: "1.6rem", fontWeight: "700", margin: "0 0 4px" };
const mbtiChipStyle = { fontSize: "1rem", fontWeight: "600", opacity: 0.8 };
const moodBannerDescStyle = { margin: 0, fontSize: "0.95rem" };
const resetBtnStyle = { marginLeft: "auto", padding: "11px 22px", backgroundColor: "#111827", color: "white", border: "none", borderRadius: "12px", cursor: "pointer", fontWeight: "600", fontSize: "0.9rem" };
const algorithmInfoStyle = { backgroundColor: "white", border: "1px solid #f3f4f6", borderRadius: "12px", padding: "12px 20px", marginBottom: "28px" };
const algorithmTextStyle = { fontSize: "0.85rem", color: "#6b7280", margin: 0 };
const recTitleStyle = { fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", fontWeight: "700", color: "#111827", marginBottom: "24px", textAlign: "center" };
const perfumeGridStyle = { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "24px", marginBottom: "50px" };
const perfumeCardStyle = { backgroundColor: "white", borderRadius: "16px", overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.07)", border: "1px solid #f3f4f6" };
const imageWrapperStyle = { position: "relative" };
const imageStyle = { width: "100%", height: "200px", objectFit: "cover" };
const scoreBadgeStyle = { position: "absolute", top: "12px", right: "12px", background: "linear-gradient(135deg, #c9a84c, #a07830)", color: "white", padding: "4px 10px", borderRadius: "20px", fontSize: "0.78rem", fontWeight: "700" };
const cardBrandStyle = { color: "#c9a84c", fontWeight: "600", fontSize: "0.75rem", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "4px" };
const cardNameStyle = { fontFamily: "'Playfair Display', serif", fontSize: "1rem", fontWeight: "700", color: "#111827", marginBottom: "4px" };
const cardCategoryStyle = { color: "#9ca3af", fontSize: "0.82rem", marginBottom: "12px" };
const explanationBoxStyle = { backgroundColor: "#f9fafb", borderRadius: "10px", padding: "10px 12px", marginBottom: "14px", border: "1px solid #f3f4f6" };
const explanationTitleStyle = { fontSize: "0.75rem", color: "#9ca3af", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "6px" };
const explanationItemStyle = { fontSize: "0.78rem", color: "#166534", margin: "2px 0", fontWeight: "500" };
const cardFooterStyle = { display: "flex", justifyContent: "space-between", alignItems: "center" };
const priceStyle = { fontFamily: "'Playfair Display', serif", fontWeight: "700", fontSize: "1.1rem", color: "#111827", margin: 0 };
const addCartBtnStyle = { padding: "8px 14px", background: "linear-gradient(135deg, #c9a84c, #a07830)", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "700", fontSize: "0.82rem" };
const tryAnotherStyle = { textAlign: "center", paddingTop: "20px", borderTop: "1px solid #e5e7eb" };
const moodChipsStyle = { display: "flex", justifyContent: "center", gap: "12px", flexWrap: "wrap" };
const moodChipStyle = { padding: "10px 20px", borderRadius: "25px", border: "none", cursor: "pointer", fontWeight: "600", fontSize: "0.92rem", transition: "transform 0.2s ease" };

export default Mood;