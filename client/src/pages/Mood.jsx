import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { logoutUser } from "../services/authService";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import perfumes from "../data/perfume";
import { useCart } from "../context/CartContext";

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

// Score perfumes based on selected mood
function getMoodRecommendations(mood, allPerfumes) {
  const scored = allPerfumes.map((perfume) => {
    let score = 0;

    // Category match (40 pts)
    if (mood.categories.includes(perfume.category)) {
      score += 40;
    }

    // Personality tag match (35 pts)
    const matchedTags = perfume.personalityTags?.filter((tag) =>
      mood.tags.includes(tag)
    );
    if (matchedTags?.length > 0) {
      score += Math.min(matchedTags.length * 15, 35);
    }

    // Occasion match (25 pts)
    const matchedOccasions = perfume.occasion?.filter((occ) =>
      mood.occasions.includes(occ)
    );
    if (matchedOccasions?.length > 0) {
      score += Math.min(matchedOccasions.length * 12, 25);
    }

    return { ...perfume, moodScore: score };
  });

  return scored
    .filter((p) => p.moodScore > 0)
    .sort((a, b) => b.moodScore - a.moodScore)
    .slice(0, 4);
}

const Mood = () => {
  const [userName, setUserName] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [selectedMood, setSelectedMood] = useState(null);

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

  const handleLogout = async () => { try { await logoutUser(); } catch {} };
  const [recommendations, setRecommendations] = useState([]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleMoodSelect = (mood) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setSelectedMood(mood);
      const recs = getMoodRecommendations(mood, perfumes);
      setRecommendations(recs);
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

  const handleAddToCart = (perfume) => {
    addToCart(perfume, 1);
  };

  return (
    <>
      <Navbar loggedIn={loggedIn} userName={userName} onLogout={handleLogout} />
      <main style={mainStyle}>

        {/* Header */}
        <div style={headerStyle}>
          <div style={headerIconStyle}>🌸</div>
          <h1 style={titleStyle}>Find Your Mood Scent</h1>
          <p style={subtitleStyle}>
            How are you feeling today? Pick your mood and we'll find the
            perfect perfume for you.
          </p>
        </div>

        {/* Mood Selector */}
        {!selectedMood && (
          <div
            style={{
              ...moodGridStyle,
              opacity: isTransitioning ? 0 : 1,
              transform: isTransitioning ? "translateY(20px)" : "translateY(0)",
            }}
          >
            {moods.map((mood) => (
              <button
                key={mood.id}
                onClick={() => handleMoodSelect(mood)}
                style={{
                  ...moodCardStyle,
                  backgroundColor: mood.color,
                }}
              >
                <span style={moodEmojiStyle}>{mood.emoji}</span>
                <h3 style={{ ...moodLabelStyle, color: mood.textColor }}>
                  {mood.label}
                </h3>
                <p style={{ ...moodDescStyle, color: mood.textColor }}>
                  {mood.description}
                </p>
              </button>
            ))}
          </div>
        )}

        {/* Results Section */}
        {selectedMood && (
          <div
            style={{
              ...resultsContainerStyle,
              opacity: isTransitioning ? 0 : 1,
              transform: isTransitioning ? "translateY(20px)" : "translateY(0)",
            }}
          >
            {/* Selected Mood Banner */}
            <div
              style={{
                ...moodBannerStyle,
                backgroundColor: selectedMood.color,
              }}
            >
              <span style={{ fontSize: "3rem" }}>{selectedMood.emoji}</span>
              <div>
                <h2 style={{ ...moodBannerTitleStyle, color: selectedMood.textColor }}>
                  {selectedMood.label} Mood
                </h2>
                <p style={{ ...moodBannerDescStyle, color: selectedMood.textColor }}>
                  {selectedMood.description}
                </p>
              </div>
              <button onClick={handleReset} style={resetButtonStyle}>
                Change Mood
              </button>
            </div>

            {/* Recommended Perfumes */}
            <h3 style={recTitleStyle}>Perfect Scents For You</h3>
            <div style={perfumeGridStyle}>
              {recommendations.length > 0 ? (
                recommendations.map((perfume) => (
                  <div key={perfume.id} style={perfumeCardStyle}>
                    <div style={imageWrapperStyle}>
                      <img
                        src={perfume.image}
                        alt={perfume.name}
                        style={imageStyle}
                      />
                      <div style={scoreBadgeStyle}>
                        {perfume.moodScore}% match
                      </div>
                    </div>
                    <div style={{ padding: "18px" }}>
                      <p style={genderStyle}>{perfume.gender}</p>
                      <h3 style={nameStyle}>{perfume.name}</h3>
                      <p style={brandStyle}>{perfume.brand}</p>
                      <p style={categoryStyle}>{perfume.category}</p>
                      <div style={cardFooterStyle}>
                        <p style={priceStyle}>£{perfume.price}</p>
                        <button
                          onClick={() => handleAddToCart(perfume)}
                          style={addToCartButtonStyle}
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p style={{ color: "#6b7280", textAlign: "center", gridColumn: "1 / -1" }}>
                  No perfumes found for this mood. Try a different one!
                </p>
              )}
            </div>

            {/* Try Another Mood */}
            <div style={tryAnotherStyle}>
              <p style={{ color: "#6b7280", marginBottom: "16px" }}>
                Want to explore a different vibe?
              </p>
              <div style={moodChipsStyle}>
                {moods
                  .filter((m) => m.id !== selectedMood.id)
                  .map((mood) => (
                    <button
                      key={mood.id}
                      onClick={() => handleMoodSelect(mood)}
                      style={{
                        ...moodChipStyle,
                        backgroundColor: mood.color,
                        color: mood.textColor,
                      }}
                    >
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

// Styles
const mainStyle = {
  minHeight: "calc(100vh - 200px)",
  backgroundColor: "#fafafa",
  padding: "40px 20px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

const headerStyle = {
  textAlign: "center",
  marginBottom: "50px",
  maxWidth: "600px",
};

const headerIconStyle = {
  fontSize: "3rem",
  marginBottom: "16px",
};

const titleStyle = {
  fontSize: "2.5rem",
  fontWeight: "700",
  color: "#111827",
  marginBottom: "12px",
};

const subtitleStyle = {
  fontSize: "1.1rem",
  color: "#6b7280",
  lineHeight: "1.6",
};

const moodGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(5, 1fr)",
  gap: "20px",
  maxWidth: "1000px",
  width: "100%",
  transition: "opacity 0.3s ease, transform 0.3s ease",
};

const moodCardStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "30px 20px",
  borderRadius: "20px",
  border: "none",
  cursor: "pointer",
  transition: "transform 0.2s ease, box-shadow 0.2s ease",
  boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
  gap: "10px",
};

const moodEmojiStyle = {
  fontSize: "3rem",
};

const moodLabelStyle = {
  fontSize: "1.2rem",
  fontWeight: "700",
  margin: 0,
};

const moodDescStyle = {
  fontSize: "0.85rem",
  margin: 0,
  textAlign: "center",
  lineHeight: "1.4",
};

const resultsContainerStyle = {
  width: "100%",
  maxWidth: "1100px",
  transition: "opacity 0.3s ease, transform 0.3s ease",
};

const moodBannerStyle = {
  display: "flex",
  alignItems: "center",
  gap: "24px",
  padding: "30px 40px",
  borderRadius: "20px",
  marginBottom: "40px",
  flexWrap: "wrap",
};

const moodBannerTitleStyle = {
  fontSize: "1.8rem",
  fontWeight: "700",
  margin: "0 0 4px 0",
};

const moodBannerDescStyle = {
  margin: 0,
  fontSize: "1rem",
};

const resetButtonStyle = {
  marginLeft: "auto",
  padding: "12px 24px",
  backgroundColor: "#111827",
  color: "white",
  border: "none",
  borderRadius: "12px",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "0.95rem",
};

const recTitleStyle = {
  fontSize: "1.5rem",
  fontWeight: "700",
  color: "#111827",
  marginBottom: "24px",
  textAlign: "center",
};

const perfumeGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: "24px",
  marginBottom: "50px",
};

const perfumeCardStyle = {
  backgroundColor: "white",
  borderRadius: "16px",
  overflow: "hidden",
  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
};

const imageWrapperStyle = {
  position: "relative",
};

const imageStyle = {
  width: "100%",
  height: "220px",
  objectFit: "cover",
};

const scoreBadgeStyle = {
  position: "absolute",
  top: "12px",
  right: "12px",
  backgroundColor: "#111827",
  color: "white",
  padding: "4px 10px",
  borderRadius: "20px",
  fontSize: "0.8rem",
  fontWeight: "600",
};

const genderStyle = {
  color: "#f43f5e",
  fontWeight: "700",
  marginBottom: "6px",
  fontSize: "0.85rem",
};

const nameStyle = {
  margin: "0 0 6px",
  fontSize: "1.1rem",
  fontWeight: "700",
  color: "#111827",
};

const brandStyle = {
  color: "#6b7280",
  margin: "0 0 4px",
  fontSize: "0.9rem",
};

const categoryStyle = {
  color: "#6b7280",
  margin: "0 0 12px",
  fontSize: "0.9rem",
};

const cardFooterStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const priceStyle = {
  fontWeight: "700",
  fontSize: "1.1rem",
  margin: 0,
  color: "#111827",
};

const addToCartButtonStyle = {
  padding: "8px 14px",
  backgroundColor: "#111827",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "0.85rem",
};

const tryAnotherStyle = {
  textAlign: "center",
  paddingTop: "20px",
  borderTop: "1px solid #e5e7eb",
};

const moodChipsStyle = {
  display: "flex",
  justifyContent: "center",
  gap: "12px",
  flexWrap: "wrap",
};

const moodChipStyle = {
  padding: "10px 20px",
  borderRadius: "25px",
  border: "none",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "0.95rem",
  transition: "transform 0.2s ease",
};

export default Mood;