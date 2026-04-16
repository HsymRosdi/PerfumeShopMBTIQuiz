import { useLocation, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { logoutUser } from "../services/authService";
import Navbar from "../components/layout/navbar";
import Footer from "../components/layout/footer";

const Receipt = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderId = location.state?.orderId;
  const orderData = location.state?.orderData;

  const [loggedIn, setLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");

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

  if (!orderData) {
    return (
      <div style={{ minHeight: "100vh", background: "#faf8f5" }}>
        <Navbar loggedIn={loggedIn} userName={userName} onLogout={handleLogout} />
        <section style={{ padding: "60px 20px", textAlign: "center" }}>
          <span style={{ fontSize: "3rem" }}>📦</span>
          <h1 style={noOrderTitleStyle}>Receipt not found</h1>
          <p style={{ color: "#6b7280", marginBottom: "24px" }}>No order information is available.</p>
          <Link to="/"><button style={primaryBtnStyle}>Back to Home</button></Link>
        </section>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#faf8f5" }}>
      <Navbar loggedIn={loggedIn} userName={userName} onLogout={handleLogout} />

      {/* Hero */}
      <section style={heroStyle}>
        <div style={heroOverlayStyle} />
        <div style={{ position: "relative", textAlign: "center" }}>
          <div style={{ fontSize: "3rem", marginBottom: "12px" }}>🎉</div>
          <h1 style={heroTitleStyle}>Order Confirmed!</h1>
          <p style={heroSubtitleStyle}>Thank you for your purchase, {orderData.customerName}!</p>
        </div>
      </section>

      <section style={sectionStyle}>

        {/* Order Info Card */}
        <div style={cardStyle}>
          <h3 style={cardTitleStyle}>Order Details</h3>
          <div style={infoGridStyle}>
            <div style={infoItemStyle}>
              <p style={infoLabelStyle}>Order ID</p>
              <p style={infoValueStyle}>#{orderId?.slice(0, 12)}</p>
            </div>
            <div style={infoItemStyle}>
              <p style={infoLabelStyle}>Customer</p>
              <p style={infoValueStyle}>{orderData.customerName}</p>
            </div>
            <div style={infoItemStyle}>
              <p style={infoLabelStyle}>Email</p>
              <p style={infoValueStyle}>{orderData.customerEmail}</p>
            </div>
            <div style={infoItemStyle}>
              <p style={infoLabelStyle}>Status</p>
              <span style={statusBadgeStyle}>{orderData.status}</span>
            </div>
          </div>
        </div>

        {/* Items */}
        <div style={cardStyle}>
          <h3 style={cardTitleStyle}>Your Items</h3>

          {orderData.items.map((item) => (
            <div key={item.id} style={itemStyle}>
              <img src={item.image} alt={item.name} style={imageStyle} />
              <div style={{ flex: 1 }}>
                <p style={itemBrandStyle}>{item.brand}</p>
                <h3 style={itemNameStyle}>{item.name}</h3>
                <p style={itemQtyStyle}>Quantity: {item.quantity}</p>
              </div>
              <p style={itemPriceStyle}>£{item.price * item.quantity}</p>
            </div>
          ))}

          {/* Total */}
          <div style={totalRowStyle}>
            <span style={totalLabelStyle}>Total Paid</span>
            <span style={totalValueStyle}>£{orderData.total}</span>
          </div>
        </div>

        {/* Actions */}
        <div style={actionsStyle}>
          <Link to="/"><button style={primaryBtnStyle}>Continue Shopping</button></Link>
          <Link to="/profile"><button style={secondaryBtnStyle}>View Order History</button></Link>
        </div>

      </section>
      <Footer />
    </div>
  );
};

const heroStyle = { position: "relative", background: "linear-gradient(135deg, #0a0a0a, #1a1208)", padding: "60px 48px", overflow: "hidden" };
const heroOverlayStyle = { position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, rgba(201,168,76,0.12) 0%, transparent 70%)" };
const heroTitleStyle = { fontFamily: "'Playfair Display', serif", fontSize: "2.5rem", fontWeight: "700", color: "white", marginBottom: "10px" };
const heroSubtitleStyle = { color: "#9ca3af", fontSize: "1.05rem" };
const sectionStyle = { padding: "50px 48px", maxWidth: "900px", margin: "0 auto" };
const cardStyle = { backgroundColor: "white", borderRadius: "16px", padding: "28px", boxShadow: "0 4px 16px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", marginBottom: "24px" };
const cardTitleStyle = { fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", fontWeight: "700", color: "#111827", marginBottom: "20px", paddingBottom: "12px", borderBottom: "1px solid #f3f4f6" };
const infoGridStyle = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" };
const infoItemStyle = {};
const infoLabelStyle = { fontSize: "0.78rem", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "4px" };
const infoValueStyle = { fontSize: "0.95rem", color: "#111827", fontWeight: "500", margin: 0 };
const statusBadgeStyle = { display: "inline-block", backgroundColor: "#dcfce7", color: "#166534", padding: "4px 12px", borderRadius: "12px", fontSize: "0.82rem", fontWeight: "600" };
const itemStyle = { display: "flex", alignItems: "center", gap: "20px", padding: "16px 0", borderBottom: "1px solid #f9fafb" };
const imageStyle = { width: "80px", height: "80px", objectFit: "cover", borderRadius: "12px", flexShrink: 0 };
const itemBrandStyle = { color: "#c9a84c", fontSize: "0.75rem", fontWeight: "600", letterSpacing: "1px", textTransform: "uppercase", margin: "0 0 4px" };
const itemNameStyle = { fontFamily: "'Playfair Display', serif", fontSize: "1rem", fontWeight: "700", color: "#111827", margin: "0 0 4px" };
const itemQtyStyle = { color: "#9ca3af", fontSize: "0.85rem", margin: 0 };
const itemPriceStyle = { fontFamily: "'Playfair Display', serif", fontWeight: "700", fontSize: "1.1rem", color: "#111827", margin: 0 };
const totalRowStyle = { display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "16px", marginTop: "8px" };
const totalLabelStyle = { fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", fontWeight: "700", color: "#111827" };
const totalValueStyle = { fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", fontWeight: "700", color: "#111827" };
const actionsStyle = { display: "flex", gap: "16px", justifyContent: "center" };
const primaryBtnStyle = { padding: "14px 32px", border: "none", borderRadius: "25px", background: "linear-gradient(135deg, #c9a84c, #a07830)", color: "white", fontWeight: "700", cursor: "pointer", fontSize: "0.95rem", boxShadow: "0 6px 20px rgba(201,168,76,0.3)" };
const secondaryBtnStyle = { padding: "14px 32px", border: "1.5px solid #e5e7eb", borderRadius: "25px", backgroundColor: "white", color: "#374151", fontWeight: "600", cursor: "pointer", fontSize: "0.95rem" };
const noOrderTitleStyle = { fontFamily: "'Playfair Display', serif", fontSize: "2rem", fontWeight: "700", color: "#111827", margin: "16px 0 8px" };

export default Receipt;