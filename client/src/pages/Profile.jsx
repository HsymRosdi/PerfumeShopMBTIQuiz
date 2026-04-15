import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "../firebase";
import { logoutUser } from "../services/authService";
import Navbar from "../components/layout/navbar";
import Footer from "../components/layout/footer";

const Profile = () => {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");

  // User data
  const [userData, setUserData] = useState(null);

  // MBTI data
  const [mbtiType, setMbtiType] = useState(null);
  const [mbtiProfile, setMbtiProfile] = useState(null);
  const [mbtiStrengths, setMbtiStrengths] = useState(null);
  const [genderPreference, setGenderPreference] = useState(null);

  // Orders
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate("/login");
        return;
      }
      setLoggedIn(true);

      try {
        // Fetch user profile
        const userSnap = await getDoc(doc(db, "users", user.uid));
        if (userSnap.exists()) {
          const data = userSnap.data();
          setUserData(data);
          if (data.mbtiType) {
            setMbtiType(data.mbtiType);
            setMbtiProfile(data.mbtiProfile);
            setMbtiStrengths(data.mbtiStrengths);
            setGenderPreference(data.genderPreference);
          }
        }

        // Fetch user orders
        const ordersQuery = query(collection(db, "orders"), where("userId", "==", user.uid));
        const ordersSnap = await getDocs(ordersQuery);
        const ordersData = ordersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        ordersData.sort((a, b) => {
          const aDate = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0);
          const bDate = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0);
          return bDate - aDate;
        });
        setOrders(ordersData);
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await logoutUser();
    navigate("/");
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "—";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  };

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "placed": return { backgroundColor: "#dbeafe", color: "#1e40af" };
      case "processing": return { backgroundColor: "#fef3c7", color: "#92400e" };
      case "delivered": return { backgroundColor: "#dcfce7", color: "#166534" };
      default: return { backgroundColor: "#f3f4f6", color: "#6b7280" };
    }
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const totalSpent = orders.reduce((sum, o) => sum + (o.total || 0), 0);

  if (loading) {
    return (
      <div style={loadingStyle}>
        <div style={spinnerStyle} />
        <p style={{ color: "#6b7280", marginTop: "16px" }}>Loading your profile...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#faf8f5" }}>
      <Navbar loggedIn={loggedIn} userName={userData?.fullName || ""} onLogout={handleLogout} />

      {/* Hero Header */}
      <section style={heroStyle}>
        <div style={heroOverlayStyle} />
        <div style={heroContentStyle}>
          <div style={avatarStyle}>{getInitials(userData?.fullName)}</div>
          <div>
            <h1 style={heroNameStyle}>{userData?.fullName || "User"}</h1>
            <p style={heroEmailStyle}>{userData?.email}</p>
            <p style={heroJoinedStyle}>Member since {formatDate(userData?.createdAt)}</p>
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <div style={statsStripStyle}>
        {[
          { label: "Total Orders", value: orders.length },
          { label: "Total Spent", value: `£${totalSpent.toFixed(2)}` },
          { label: "MBTI Type", value: mbtiType || "Not taken" },
          { label: "Fragrance Preference", value: genderPreference || "—" },
        ].map(({ label, value }) => (
          <div key={label} style={statItemStyle}>
            <div style={statValueStyle}>{value}</div>
            <div style={statLabelStyle}>{label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={tabsContainerStyle}>
        <div style={tabsBarStyle}>
          {[
            { id: "profile", label: "👤 Profile" },
            { id: "personality", label: "🧠 Personality" },
            { id: "orders", label: "📦 Orders" },
          ].map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              style={{
                ...tabBtnStyle,
                borderBottom: activeTab === id ? "3px solid #c9a84c" : "3px solid transparent",
                color: activeTab === id ? "#111827" : "#6b7280",
                fontWeight: activeTab === id ? "700" : "400",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        <div style={tabContentStyle}>

          {/* ── Profile Tab ── */}
          {activeTab === "profile" && (
            <div style={sectionStyle}>
              <div style={cardStyle}>
                <h3 style={cardTitleStyle}>Personal Information</h3>
                <div style={infoGridStyle}>
                  <div style={infoItemStyle}>
                    <p style={infoLabelStyle}>Full Name</p>
                    <p style={infoValueStyle}>{userData?.fullName || "—"}</p>
                  </div>
                  <div style={infoItemStyle}>
                    <p style={infoLabelStyle}>Email Address</p>
                    <p style={infoValueStyle}>{userData?.email || "—"}</p>
                  </div>
                  <div style={infoItemStyle}>
                    <p style={infoLabelStyle}>Member Since</p>
                    <p style={infoValueStyle}>{formatDate(userData?.createdAt)}</p>
                  </div>
                  <div style={infoItemStyle}>
                    <p style={infoLabelStyle}>Fragrance Preference</p>
                    <p style={infoValueStyle}>{genderPreference || "Not set"}</p>
                  </div>
                </div>
              </div>

              <div style={cardStyle}>
                <h3 style={cardTitleStyle}>Quick Actions</h3>
                <div style={quickActionsStyle}>
                  <Link to="/quiz">
                    <button style={actionBtnStyle}>
                      🧠 {mbtiType ? "Retake MBTI Quiz" : "Take MBTI Quiz"}
                    </button>
                  </Link>
                  <Link to="/mood">
                    <button style={actionBtnStyle}>🌸 Try Mood Finder</button>
                  </Link>
                  <Link to="/cart">
                    <button style={actionBtnStyle}>🛒 View Cart</button>
                  </Link>
                  <button onClick={handleLogout} style={logoutActionBtnStyle}>
                    🚪 Logout
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── Personality Tab ── */}
          {activeTab === "personality" && (
            <div style={sectionStyle}>
              {mbtiType ? (
                <>
                  {/* MBTI Result Card */}
                  <div style={mbtiHeroCardStyle}>
                    <div style={mbtiHeroLeftStyle}>
                      <p style={mbtiEyebrowStyle}>Your Personality Type</p>
                      <h2 style={mbtiTypeDisplayStyle}>{mbtiType}</h2>
                      <h3 style={mbtiProfileNameStyle}>{mbtiProfile}</h3>
                      <p style={mbtiUpdatedStyle}>
                        Last updated: {formatDate(userData?.mbtiUpdatedAt)}
                      </p>
                    </div>
                    <div style={mbtiHeroRightStyle}>
                      <p style={mbtiGenderStyle}>
                        Fragrance Preference: <strong>{genderPreference || "Unisex"}</strong>
                      </p>
                      {/* Dimension Bars */}
                      {mbtiStrengths && (
                        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                          {[
                            { label: mbtiType[0] === 'E' ? 'Extraversion' : 'Introversion', value: mbtiStrengths.EI },
                            { label: mbtiType[1] === 'S' ? 'Sensing' : 'Intuition', value: mbtiStrengths.SN },
                            { label: mbtiType[2] === 'T' ? 'Thinking' : 'Feeling', value: mbtiStrengths.TF },
                            { label: mbtiType[3] === 'J' ? 'Judging' : 'Perceiving', value: mbtiStrengths.JP },
                          ].map(({ label, value }) => (
                            <div key={label} style={dimRowStyle}>
                              <span style={dimLabelStyle}>{label}</span>
                              <div style={dimBarContainerStyle}>
                                <div style={{ ...dimBarStyle, width: `${value}%` }} />
                              </div>
                              <span style={dimPercentStyle}>{value}%</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* What your type means */}
                  <div style={cardStyle}>
                    <h3 style={cardTitleStyle}>What Your Type Means for Fragrances</h3>
                    <div style={mbtiInsightStyle}>
                      <div style={insightItemStyle}>
                        <p style={insightIconStyle}>🌸</p>
                        <div>
                          <p style={insightTitleStyle}>Mood + Personality</p>
                          <p style={insightDescStyle}>
                            Your {mbtiType} personality is factored into your Mood Finder recommendations, giving you smarter, more personalised perfume suggestions.
                          </p>
                        </div>
                      </div>
                      <div style={insightItemStyle}>
                        <p style={insightIconStyle}>🎯</p>
                        <div>
                          <p style={insightTitleStyle}>Retake Anytime</p>
                          <p style={insightDescStyle}>
                            Your personality can evolve. Retake the quiz anytime to update your profile and get fresh recommendations.
                          </p>
                        </div>
                      </div>
                    </div>
                    <Link to="/quiz">
                      <button style={retakeBtnStyle}>Retake MBTI Quiz</button>
                    </Link>
                  </div>
                </>
              ) : (
                // No MBTI yet
                <div style={noMbtiCardStyle}>
                  <span style={{ fontSize: "3rem" }}>🧠</span>
                  <h3 style={noMbtiTitleStyle}>No Personality Result Yet</h3>
                  <p style={noMbtiDescStyle}>
                    Take the MBTI quiz to discover your personality type and unlock smarter, personalised perfume recommendations.
                  </p>
                  <Link to="/quiz">
                    <button style={takQuizBtnStyle}>Take the MBTI Quiz</button>
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* ── Orders Tab ── */}
          {activeTab === "orders" && (
            <div style={sectionStyle}>
              {orders.length === 0 ? (
                <div style={noOrdersStyle}>
                  <span style={{ fontSize: "3rem" }}>📦</span>
                  <h3 style={noMbtiTitleStyle}>No orders yet</h3>
                  <p style={noMbtiDescStyle}>Start shopping and your orders will appear here.</p>
                  <Link to="/"><button style={takQuizBtnStyle}>Shop Now</button></Link>
                </div>
              ) : (
                orders.map(order => (
                  <div key={order.id} style={orderCardStyle}>
                    <div style={orderHeaderStyle}>
                      <div>
                        <p style={orderIdStyle}>Order #{order.id.slice(0, 8)}</p>
                        <p style={orderDateStyle}>{formatDate(order.createdAt)}</p>
                      </div>
                      <div style={orderRightStyle}>
                        <span style={{ ...orderStatusStyle, ...getStatusStyle(order.status) }}>
                          {order.status || "Placed"}
                        </span>
                        <p style={orderTotalStyle}>£{order.total}</p>
                      </div>
                    </div>
                    <div style={orderItemsStyle}>
                      {order.items?.map((item, i) => (
                        <div key={i} style={orderItemRowStyle}>
                          <img src={item.image} alt={item.name} style={orderItemImageStyle} />
                          <div style={{ flex: 1 }}>
                            <p style={orderItemNameStyle}>{item.name}</p>
                            <p style={orderItemBrandStyle}>{item.brand} · x{item.quantity}</p>
                          </div>
                          <p style={orderItemPriceStyle}>£{item.price * item.quantity}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

// Styles
const loadingStyle = { minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" };
const spinnerStyle = { width: "40px", height: "40px", border: "3px solid #f3f4f6", borderTop: "3px solid #c9a84c", borderRadius: "50%", animation: "spin 0.8s linear infinite" };
const heroStyle = { position: "relative", background: "linear-gradient(135deg, #0a0a0a, #1a1208)", padding: "60px 48px" };
const heroOverlayStyle = { position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, rgba(201,168,76,0.12) 0%, transparent 70%)" };
const heroContentStyle = { position: "relative", display: "flex", alignItems: "center", gap: "28px", maxWidth: "1000px", margin: "0 auto" };
const avatarStyle = { width: "90px", height: "90px", borderRadius: "50%", background: "linear-gradient(135deg, #c9a84c, #a07830)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem", fontWeight: "700", color: "white", flexShrink: 0, boxShadow: "0 8px 24px rgba(201,168,76,0.3)" };
const heroNameStyle = { fontFamily: "'Playfair Display', serif", fontSize: "2rem", fontWeight: "700", color: "white", margin: "0 0 6px" };
const heroEmailStyle = { color: "#9ca3af", fontSize: "0.95rem", margin: "0 0 4px" };
const heroJoinedStyle = { color: "#6b7280", fontSize: "0.85rem", margin: 0 };
const statsStripStyle = { backgroundColor: "white", padding: "20px 48px", display: "flex", justifyContent: "center", gap: "60px", flexWrap: "wrap", borderBottom: "1px solid #f3f4f6", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" };
const statItemStyle = { textAlign: "center" };
const statValueStyle = { fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", fontWeight: "700", color: "#111827" };
const statLabelStyle = { fontSize: "0.8rem", color: "#9ca3af", marginTop: "4px", textTransform: "uppercase", letterSpacing: "0.5px" };
const tabsContainerStyle = { maxWidth: "1000px", margin: "0 auto", padding: "0 48px 60px" };
const tabsBarStyle = { display: "flex", borderBottom: "1px solid #e5e7eb", marginBottom: "32px", gap: "8px" };
const tabBtnStyle = { padding: "16px 24px", border: "none", backgroundColor: "transparent", cursor: "pointer", fontSize: "0.95rem", transition: "all 0.2s ease" };
const tabContentStyle = {};
const sectionStyle = { display: "flex", flexDirection: "column", gap: "20px" };
const cardStyle = { backgroundColor: "white", borderRadius: "16px", padding: "28px", boxShadow: "0 4px 16px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6" };
const cardTitleStyle = { fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", fontWeight: "700", color: "#111827", marginBottom: "20px", paddingBottom: "12px", borderBottom: "1px solid #f3f4f6" };
const infoGridStyle = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" };
const infoItemStyle = {};
const infoLabelStyle = { fontSize: "0.8rem", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "4px" };
const infoValueStyle = { fontSize: "1rem", color: "#111827", fontWeight: "500" };
const quickActionsStyle = { display: "flex", gap: "12px", flexWrap: "wrap" };
const actionBtnStyle = { padding: "12px 20px", border: "1.5px solid #e5e7eb", borderRadius: "12px", backgroundColor: "white", color: "#374151", fontWeight: "600", cursor: "pointer", fontSize: "0.9rem", transition: "all 0.2s" };
const logoutActionBtnStyle = { padding: "12px 20px", border: "1.5px solid #fecaca", borderRadius: "12px", backgroundColor: "white", color: "#dc2626", fontWeight: "600", cursor: "pointer", fontSize: "0.9rem" };
const mbtiHeroCardStyle = { backgroundColor: "white", borderRadius: "16px", padding: "32px", boxShadow: "0 4px 16px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "40px", alignItems: "center" };
const mbtiHeroLeftStyle = { textAlign: "center", padding: "20px", background: "linear-gradient(135deg, #0a0a0a, #1a1208)", borderRadius: "16px" };
const mbtiEyebrowStyle = { color: "#c9a84c", fontSize: "0.75rem", fontWeight: "600", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "12px" };
const mbtiTypeDisplayStyle = { fontFamily: "'Playfair Display', serif", fontSize: "3.5rem", fontWeight: "700", color: "#c9a84c", margin: "0 0 8px" };
const mbtiProfileNameStyle = { fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", color: "white", fontWeight: "400", margin: "0 0 16px" };
const mbtiUpdatedStyle = { color: "#6b7280", fontSize: "0.8rem", margin: 0 };
const mbtiHeroRightStyle = { display: "flex", flexDirection: "column", gap: "16px" };
const mbtiGenderStyle = { color: "#6b7280", fontSize: "0.9rem", marginBottom: "8px" };
const dimRowStyle = { display: "flex", alignItems: "center", gap: "12px" };
const dimLabelStyle = { fontSize: "0.85rem", color: "#6b7280", minWidth: "110px" };
const dimBarContainerStyle = { flex: 1, height: "8px", backgroundColor: "#f3f4f6", borderRadius: "4px", overflow: "hidden" };
const dimBarStyle = { height: "100%", background: "linear-gradient(135deg, #c9a84c, #a07830)", borderRadius: "4px" };
const dimPercentStyle = { fontSize: "0.8rem", color: "#9ca3af", minWidth: "32px" };
const mbtiInsightStyle = { display: "flex", flexDirection: "column", gap: "16px", marginBottom: "20px" };
const insightItemStyle = { display: "flex", gap: "16px", alignItems: "flex-start" };
const insightIconStyle = { fontSize: "1.5rem", margin: 0 };
const insightTitleStyle = { fontWeight: "700", color: "#111827", marginBottom: "4px", fontSize: "0.95rem" };
const insightDescStyle = { color: "#6b7280", fontSize: "0.88rem", lineHeight: "1.6", margin: 0 };
const retakeBtnStyle = { padding: "12px 28px", border: "none", borderRadius: "12px", background: "linear-gradient(135deg, #c9a84c, #a07830)", color: "white", fontWeight: "700", cursor: "pointer", fontSize: "0.9rem" };
const noMbtiCardStyle = { backgroundColor: "white", borderRadius: "16px", padding: "60px 40px", textAlign: "center", boxShadow: "0 4px 16px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" };
const noMbtiTitleStyle = { fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", fontWeight: "700", color: "#111827" };
const noMbtiDescStyle = { color: "#6b7280", fontSize: "0.95rem", lineHeight: "1.7", maxWidth: "400px" };
const takQuizBtnStyle = { padding: "14px 32px", border: "none", borderRadius: "25px", background: "linear-gradient(135deg, #c9a84c, #a07830)", color: "white", fontWeight: "700", cursor: "pointer", fontSize: "0.95rem", boxShadow: "0 6px 20px rgba(201,168,76,0.3)" };
const noOrdersStyle = { ...noMbtiCardStyle };
const orderCardStyle = { backgroundColor: "white", borderRadius: "16px", padding: "24px", boxShadow: "0 4px 16px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6" };
const orderHeaderStyle = { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px", paddingBottom: "16px", borderBottom: "1px solid #f9fafb" };
const orderIdStyle = { fontFamily: "'Playfair Display', serif", fontWeight: "700", color: "#111827", margin: "0 0 4px", fontSize: "1rem" };
const orderDateStyle = { color: "#9ca3af", fontSize: "0.85rem", margin: 0 };
const orderRightStyle = { textAlign: "right", display: "flex", flexDirection: "column", gap: "6px", alignItems: "flex-end" };
const orderStatusStyle = { display: "inline-block", padding: "3px 12px", borderRadius: "12px", fontSize: "11px", fontWeight: "600" };
const orderTotalStyle = { fontFamily: "'Playfair Display', serif", fontWeight: "700", fontSize: "1.1rem", color: "#111827", margin: 0 };
const orderItemsStyle = { display: "flex", flexDirection: "column", gap: "12px" };
const orderItemRowStyle = { display: "flex", alignItems: "center", gap: "14px" };
const orderItemImageStyle = { width: "56px", height: "56px", objectFit: "cover", borderRadius: "10px", flexShrink: 0 };
const orderItemNameStyle = { fontWeight: "600", color: "#111827", margin: "0 0 2px", fontSize: "0.9rem" };
const orderItemBrandStyle = { color: "#9ca3af", fontSize: "0.82rem", margin: 0 };
const orderItemPriceStyle = { fontWeight: "700", color: "#111827", fontSize: "0.95rem", margin: 0 };

export default Profile;