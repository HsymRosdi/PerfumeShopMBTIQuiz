import { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
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

  useEffect(() => {
    const answers = location.state?.answers;

    if (!answers || answers.length === 0) {
      navigate("/quiz");
      return;
    }

    // Extract gender preference from answers
    const genderAnswer = answers.find(a => a.dimension === "gender");
    const gender = genderAnswer?.value || "Unisex";
    setGenderPreference(gender);

    // Calculate MBTI type
    const result = calculateMbtiType(answers);
    setMbtiResult(result);

    // Get recommendations
    const recs = getQuizRecommendations(perfumes, result, gender, 5);
    setRecommendations(recs);

    // Trigger animation
    setTimeout(() => setIsLoaded(true), 100);
  }, [location.state, navigate]);

  const handleAddToCart = (perfume) => {
    addToCart(perfume, 1);
  };

  const handleRetakeQuiz = () => {
    navigate("/quiz");
  };

  if (!mbtiResult) {
    return (
      <>
        <Navbar loggedIn={loggedIn} userName={userName} onLogout={handleLogout} />
        <main style={loadingStyle}>
          <div style={loadingSpinnerStyle} />
          <p>Analyzing your personality...</p>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar loggedIn={loggedIn} userName={userName} onLogout={handleLogout} />
      <main style={mainStyle}>
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
            <h3 style={fragranceStyleTitleStyle}>Your Ideal Fragrance Style</h3>
            <p style={fragranceStyleTextStyle}>{mbtiResult.profile.fragranceStyle}</p>
          </div>

          {/* Personality Traits */}
          <div style={traitsContainerStyle}>
            {mbtiResult.profile.traits.map((trait, index) => (
              <span key={index} style={traitTagStyle}>{trait}</span>
            ))}
          </div>

          {/* Dimension Strengths */}
          <div style={dimensionsContainerStyle}>
            <div style={dimensionItemStyle}>
              <span style={dimensionLabelStyle}>
                {mbtiResult.type[0] === 'E' ? 'Extraversion' : 'Introversion'}
              </span>
              <div style={dimensionBarContainerStyle}>
                <div style={{ ...dimensionBarStyle, width: `${mbtiResult.strengths.EI}%` }} />
              </div>
              <span style={dimensionPercentStyle}>{mbtiResult.strengths.EI}%</span>
            </div>
            <div style={dimensionItemStyle}>
              <span style={dimensionLabelStyle}>
                {mbtiResult.type[1] === 'S' ? 'Sensing' : 'Intuition'}
              </span>
              <div style={dimensionBarContainerStyle}>
                <div style={{ ...dimensionBarStyle, width: `${mbtiResult.strengths.SN}%` }} />
              </div>
              <span style={dimensionPercentStyle}>{mbtiResult.strengths.SN}%</span>
            </div>
            <div style={dimensionItemStyle}>
              <span style={dimensionLabelStyle}>
                {mbtiResult.type[2] === 'T' ? 'Thinking' : 'Feeling'}
              </span>
              <div style={dimensionBarContainerStyle}>
                <div style={{ ...dimensionBarStyle, width: `${mbtiResult.strengths.TF}%` }} />
              </div>
              <span style={dimensionPercentStyle}>{mbtiResult.strengths.TF}%</span>
            </div>
            <div style={dimensionItemStyle}>
              <span style={dimensionLabelStyle}>
                {mbtiResult.type[3] === 'J' ? 'Judging' : 'Perceiving'}
              </span>
              <div style={dimensionBarContainerStyle}>
                <div style={{ ...dimensionBarStyle, width: `${mbtiResult.strengths.JP}%` }} />
              </div>
              <span style={dimensionPercentStyle}>{mbtiResult.strengths.JP}%</span>
            </div>
          </div>
        </div>

        {/* Recommendations Section */}
        <section style={{
          ...recommendationsSectionStyle,
          opacity: isLoaded ? 1 : 0,
          transform: isLoaded ? "translateY(0)" : "translateY(30px)",
          transitionDelay: "0.2s"
        }}>
          <h2 style={sectionTitleStyle}>Your Perfect Matches</h2>
          <p style={sectionSubtitleStyle}>
            Based on your {mbtiResult.profile.name} personality, here are the fragrances we recommend for you
          </p>

          <div style={recommendationsGridStyle}>
            {recommendations.map((perfume, index) => (
              <div
                key={perfume.id}
                style={{
                  ...recommendationCardStyle,
                  animationDelay: `${index * 0.1}s`
                }}
              >
                {/* Match Badge */}
                <div style={matchBadgeStyle}>
                  {perfume.matchPercentage}% Match
                </div>

                {/* Ranking Badge */}
                {index === 0 && (
                  <div style={topPickBadgeStyle}>Top Pick</div>
                )}

                <div style={cardImageContainerStyle}>
                  <img
                    src={perfume.image}
                    alt={perfume.name}
                    style={cardImageStyle}
                  />
                </div>

                <div style={cardContentStyle}>
                  <p style={cardBrandStyle}>{perfume.brand}</p>
                  <h3 style={cardNameStyle}>{perfume.name}</h3>
                  <p style={cardCategoryStyle}>{perfume.category}</p>
                  <p style={cardPriceStyle}>£{perfume.price}</p>

                  {/* Match Reasons (Expandable) */}
                  <button
                    onClick={() => setExpandedCard(expandedCard === perfume.id ? null : perfume.id)}
                    style={whyMatchButtonStyle}
                  >
                    {expandedCard === perfume.id ? "Hide Details" : "Why This Matched"}
                    <span style={{
                      transform: expandedCard === perfume.id ? "rotate(180deg)" : "rotate(0)",
                      transition: "transform 0.2s ease",
                      display: "inline-block",
                      marginLeft: "8px"
                    }}>
                      ▼
                    </span>
                  </button>

                  {expandedCard === perfume.id && (
                    <div style={matchReasonsStyle}>
                      {getMatchExplanation(perfume.scoreBreakdown, mbtiResult.profile).map((reason, i) => (
                        <div key={i} style={matchReasonItemStyle}>
                          <span style={checkIconStyle}>✓</span>
                          {reason}
                        </div>
                      ))}
                      <div style={scoreBreakdownStyle}>
                        <div style={scoreItemStyle}>
                          <span>MBTI Match</span>
                          <span>{perfume.scoreBreakdown.mbti} pts</span>
                        </div>
                        <div style={scoreItemStyle}>
                          <span>Scent Family</span>
                          <span>{perfume.scoreBreakdown.category} pts</span>
                        </div>
                        <div style={scoreItemStyle}>
                          <span>Notes</span>
                          <span>{perfume.scoreBreakdown.notes} pts</span>
                        </div>
                        <div style={scoreItemStyle}>
                          <span>Personality</span>
                          <span>{perfume.scoreBreakdown.personality} pts</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div style={cardActionsStyle}>
                    <button
                      onClick={() => handleAddToCart(perfume)}
                      style={addToCartButtonStyle}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Preferred Scent Info */}
        <section style={{
          ...preferencesSectionStyle,
          opacity: isLoaded ? 1 : 0,
          transform: isLoaded ? "translateY(0)" : "translateY(30px)",
          transitionDelay: "0.3s"
        }}>
          <h2 style={sectionTitleStyle}>Your Scent Preferences</h2>
          <div style={preferencesGridStyle}>
            <div style={preferenceCardStyle}>
              <h4 style={preferenceCardTitleStyle}>Preferred Categories</h4>
              <div style={preferenceTagsStyle}>
                {mbtiResult.profile.preferredCategories.map((cat, i) => (
                  <span key={i} style={categoryTagStyle}>{cat}</span>
                ))}
              </div>
            </div>
            <div style={preferenceCardStyle}>
              <h4 style={preferenceCardTitleStyle}>Notes You Love</h4>
              <div style={preferenceTagsStyle}>
                {mbtiResult.profile.preferredNotes.slice(0, 6).map((note, i) => (
                  <span key={i} style={noteTagStyle}>{note}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Action Buttons */}
        <div style={actionsContainerStyle}>
          <button onClick={handleRetakeQuiz} style={retakeButtonStyle}>
            Retake Quiz
          </button>
          <Link to={`/${genderPreference.toLowerCase()}`} style={shopLinkStyle}>
            <button style={shopButtonStyle}>
              Shop {genderPreference === "Unisex" ? "All" : genderPreference + "'s"} Fragrances
            </button>
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
};

// Styles
const mainStyle = {
  minHeight: "calc(100vh - 200px)",
  backgroundColor: "#fafafa",
  padding: "40px 20px 80px"
};

const loadingStyle = {
  minHeight: "calc(100vh - 200px)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "20px"
};

const loadingSpinnerStyle = {
  width: "50px",
  height: "50px",
  border: "4px solid #e5e7eb",
  borderTop: "4px solid #f43f5e",
  borderRadius: "50%",
  animation: "spin 1s linear infinite"
};

const heroSectionStyle = {
  maxWidth: "800px",
  margin: "0 auto 60px",
  textAlign: "center",
  backgroundColor: "white",
  borderRadius: "24px",
  padding: "60px 40px",
  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
  transition: "opacity 0.5s ease, transform 0.5s ease"
};

const mbtiTypeContainerStyle = {
  marginBottom: "30px"
};

const youAreTextStyle = {
  fontSize: "1rem",
  color: "#6b7280",
  textTransform: "uppercase",
  letterSpacing: "2px",
  marginBottom: "12px"
};

const mbtiTypeStyle = {
  fontSize: "4.5rem",
  fontWeight: "800",
  color: "#111827",
  letterSpacing: "8px",
  marginBottom: "8px"
};

const mbtiNameStyle = {
  fontSize: "1.5rem",
  fontWeight: "600",
  color: "#f43f5e",
  marginBottom: "0"
};

const descriptionStyle = {
  fontSize: "1.1rem",
  color: "#4b5563",
  lineHeight: "1.7",
  maxWidth: "600px",
  margin: "0 auto 30px"
};

const fragranceStyleBoxStyle = {
  backgroundColor: "#f9fafb",
  borderRadius: "16px",
  padding: "24px 30px",
  marginBottom: "30px"
};

const fragranceStyleTitleStyle = {
  fontSize: "0.9rem",
  color: "#6b7280",
  textTransform: "uppercase",
  letterSpacing: "1px",
  marginBottom: "8px"
};

const fragranceStyleTextStyle = {
  fontSize: "1.2rem",
  color: "#111827",
  fontWeight: "600",
  margin: "0"
};

const traitsContainerStyle = {
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center",
  gap: "12px",
  marginBottom: "40px"
};

const traitTagStyle = {
  padding: "8px 20px",
  backgroundColor: "#111827",
  color: "white",
  borderRadius: "25px",
  fontSize: "0.9rem",
  fontWeight: "500",
  textTransform: "capitalize"
};

const dimensionsContainerStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: "20px",
  maxWidth: "600px",
  margin: "0 auto"
};

const dimensionItemStyle = {
  display: "flex",
  alignItems: "center",
  gap: "12px"
};

const dimensionLabelStyle = {
  fontSize: "0.85rem",
  color: "#374151",
  fontWeight: "500",
  minWidth: "90px",
  textAlign: "left"
};

const dimensionBarContainerStyle = {
  flex: "1",
  height: "8px",
  backgroundColor: "#e5e7eb",
  borderRadius: "4px",
  overflow: "hidden"
};

const dimensionBarStyle = {
  height: "100%",
  backgroundColor: "#f43f5e",
  borderRadius: "4px",
  transition: "width 0.8s ease"
};

const dimensionPercentStyle = {
  fontSize: "0.85rem",
  color: "#6b7280",
  fontWeight: "600",
  minWidth: "40px",
  textAlign: "right"
};

const recommendationsSectionStyle = {
  maxWidth: "1200px",
  margin: "0 auto 60px",
  transition: "opacity 0.5s ease, transform 0.5s ease"
};

const sectionTitleStyle = {
  fontSize: "2rem",
  fontWeight: "700",
  color: "#111827",
  textAlign: "center",
  marginBottom: "12px"
};

const sectionSubtitleStyle = {
  fontSize: "1rem",
  color: "#6b7280",
  textAlign: "center",
  marginBottom: "40px"
};

const recommendationsGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  gap: "24px"
};

const recommendationCardStyle = {
  backgroundColor: "white",
  borderRadius: "20px",
  overflow: "hidden",
  boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
  position: "relative",
  transition: "transform 0.3s ease, box-shadow 0.3s ease"
};

const matchBadgeStyle = {
  position: "absolute",
  top: "16px",
  right: "16px",
  backgroundColor: "#111827",
  color: "white",
  padding: "6px 14px",
  borderRadius: "20px",
  fontSize: "0.85rem",
  fontWeight: "600",
  zIndex: 2
};

const topPickBadgeStyle = {
  position: "absolute",
  top: "16px",
  left: "16px",
  backgroundColor: "#f43f5e",
  color: "white",
  padding: "6px 14px",
  borderRadius: "20px",
  fontSize: "0.85rem",
  fontWeight: "600",
  zIndex: 2
};

const cardImageContainerStyle = {
  width: "100%",
  height: "220px",
  overflow: "hidden"
};

const cardImageStyle = {
  width: "100%",
  height: "100%",
  objectFit: "cover"
};

const cardContentStyle = {
  padding: "24px"
};

const cardBrandStyle = {
  fontSize: "0.85rem",
  color: "#6b7280",
  textTransform: "uppercase",
  letterSpacing: "1px",
  marginBottom: "6px"
};

const cardNameStyle = {
  fontSize: "1.3rem",
  fontWeight: "700",
  color: "#111827",
  marginBottom: "8px"
};

const cardCategoryStyle = {
  fontSize: "0.9rem",
  color: "#f43f5e",
  fontWeight: "600",
  marginBottom: "8px"
};

const cardPriceStyle = {
  fontSize: "1.4rem",
  fontWeight: "700",
  color: "#111827",
  marginBottom: "16px"
};

const whyMatchButtonStyle = {
  width: "100%",
  padding: "10px",
  backgroundColor: "#f9fafb",
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  fontSize: "0.9rem",
  color: "#374151",
  cursor: "pointer",
  marginBottom: "16px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
};

const matchReasonsStyle = {
  backgroundColor: "#f9fafb",
  borderRadius: "12px",
  padding: "16px",
  marginBottom: "16px"
};

const matchReasonItemStyle = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  fontSize: "0.9rem",
  color: "#374151",
  marginBottom: "8px"
};

const checkIconStyle = {
  color: "#10b981",
  fontWeight: "bold"
};

const scoreBreakdownStyle = {
  marginTop: "16px",
  paddingTop: "12px",
  borderTop: "1px solid #e5e7eb"
};

const scoreItemStyle = {
  display: "flex",
  justifyContent: "space-between",
  fontSize: "0.85rem",
  color: "#6b7280",
  marginBottom: "4px"
};

const cardActionsStyle = {
  display: "flex",
  gap: "12px"
};

const addToCartButtonStyle = {
  flex: "1",
  padding: "14px",
  backgroundColor: "#111827",
  color: "white",
  border: "none",
  borderRadius: "10px",
  fontSize: "1rem",
  fontWeight: "600",
  cursor: "pointer",
  transition: "background-color 0.2s ease"
};

const preferencesSectionStyle = {
  maxWidth: "800px",
  margin: "0 auto 60px",
  transition: "opacity 0.5s ease, transform 0.5s ease"
};

const preferencesGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
  gap: "24px"
};

const preferenceCardStyle = {
  backgroundColor: "white",
  borderRadius: "16px",
  padding: "24px",
  boxShadow: "0 4px 15px rgba(0,0,0,0.08)"
};

const preferenceCardTitleStyle = {
  fontSize: "1rem",
  color: "#6b7280",
  marginBottom: "16px",
  fontWeight: "600"
};

const preferenceTagsStyle = {
  display: "flex",
  flexWrap: "wrap",
  gap: "10px"
};

const categoryTagStyle = {
  padding: "8px 16px",
  backgroundColor: "#f43f5e",
  color: "white",
  borderRadius: "20px",
  fontSize: "0.9rem",
  fontWeight: "500"
};

const noteTagStyle = {
  padding: "8px 16px",
  backgroundColor: "#f3f4f6",
  color: "#374151",
  borderRadius: "20px",
  fontSize: "0.9rem",
  fontWeight: "500",
  textTransform: "capitalize"
};

const actionsContainerStyle = {
  display: "flex",
  justifyContent: "center",
  gap: "16px",
  flexWrap: "wrap"
};

const retakeButtonStyle = {
  padding: "16px 36px",
  backgroundColor: "white",
  color: "#111827",
  border: "2px solid #111827",
  borderRadius: "12px",
  fontSize: "1rem",
  fontWeight: "600",
  cursor: "pointer",
  transition: "all 0.2s ease"
};

const shopLinkStyle = {
  textDecoration: "none"
};

const shopButtonStyle = {
  padding: "16px 36px",
  backgroundColor: "#111827",
  color: "white",
  border: "none",
  borderRadius: "12px",
  fontSize: "1rem",
  fontWeight: "600",
  cursor: "pointer",
  transition: "all 0.2s ease"
};

export default QuizResults;