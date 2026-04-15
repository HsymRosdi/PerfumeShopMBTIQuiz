import Navbar from "../components/layout/navbar";
import Footer from "../components/layout/footer";
import { useCart } from "../components/cart/CartContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { logoutUser } from "../services/authService";
import { createOrder } from "../services/orderService";

const Cart = () => {
  const [userName, setUserName] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();
  const { cartItems, removeFromCart, increaseQuantity, decreaseQuantity, clearCart, cartTotal } = useCart();

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

  const handleCheckout = async () => {
    const user = auth.currentUser;
    if (!user) { alert("Please log in before checking out."); navigate("/login"); return; }
    if (cartItems.length === 0) { alert("Your cart is empty."); return; }
    try {
      const orderId = await createOrder({ userId: user.uid, customerName: userName, customerEmail: user.email, items: cartItems, total: cartTotal, status: "Placed" });
      clearCart();
      navigate("/receipt", { state: { orderId, orderData: { userId: user.uid, customerName: userName, customerEmail: user.email, items: cartItems, total: cartTotal } } });
    } catch { alert("Something went wrong during checkout."); }
  };

  const handleLogout = async () => { try { await logoutUser(); navigate("/"); } catch {} };

  return (
    <div style={{ minHeight: "100vh", background: "#faf8f5" }}>
      <Navbar loggedIn={loggedIn} userName={userName} onLogout={handleLogout} />

      {/* Header */}
      <section style={pageHeaderStyle}>
        <div style={pageHeaderOverlayStyle} />
        <div style={{ position: "relative", textAlign: "center" }}>
          <p style={eyebrowStyle}>Your Selection</p>
          <h1 style={pageTitleStyle}>Shopping Cart</h1>
        </div>
      </section>

      <section style={sectionStyle}>
        {cartItems.length === 0 ? (
          <div style={emptyCartStyle}>
            <span style={{ fontSize: "4rem" }}>🛒</span>
            <h2 style={emptyTitleStyle}>Your cart is empty</h2>
            <p style={emptyDescStyle}>Discover our luxury fragrances and find your perfect scent.</p>
            <button onClick={() => navigate("/")} style={shopNowBtnStyle}>Shop Now</button>
          </div>
        ) : (
          <div style={cartLayoutStyle}>
            {/* Items */}
            <div style={itemsColStyle}>
              <h2 style={colTitleStyle}>Items ({cartItems.length})</h2>
              {cartItems.map((item) => (
                <div key={item.id} style={cartItemStyle}>
                  <img src={item.image} alt={item.name} style={cartImageStyle} />
                  <div style={{ flex: 1 }}>
                    <p style={itemBrandStyle}>{item.brand}</p>
                    <h3 style={itemNameStyle}>{item.name}</h3>
                    <p style={itemCategoryStyle}>{item.category}</p>
                  </div>
                  <div style={qtyWrapperStyle}>
                    <button onClick={() => decreaseQuantity(item.id)} style={qtyBtnStyle}>−</button>
                    <span style={qtyNumberStyle}>{item.quantity}</span>
                    <button onClick={() => increaseQuantity(item.id)} style={qtyBtnStyle}>+</button>
                  </div>
                  <div style={itemPriceColStyle}>
                    <p style={itemTotalStyle}>£{item.price * item.quantity}</p>
                    <p style={itemUnitStyle}>£{item.price} each</p>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} style={removeBtnStyle}>✕</button>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div style={summaryColStyle}>
              <h2 style={colTitleStyle}>Order Summary</h2>
              <div style={summaryCardStyle}>
                {cartItems.map(item => (
                  <div key={item.id} style={summaryRowStyle}>
                    <span style={summaryItemNameStyle}>{item.name} × {item.quantity}</span>
                    <span style={summaryItemPriceStyle}>£{item.price * item.quantity}</span>
                  </div>
                ))}
                <div style={summaryDividerStyle} />
                <div style={{ ...summaryRowStyle, marginTop: "4px" }}>
                  <span style={summaryLabelStyle}>Subtotal</span>
                  <span style={summaryValueStyle}>£{cartTotal}</span>
                </div>
                <div style={summaryRowStyle}>
                  <span style={summaryLabelStyle}>Shipping</span>
                  <span style={{ ...summaryValueStyle, color: "#16a34a" }}>{cartTotal >= 100 ? "Free" : "£5.99"}</span>
                </div>
                <div style={summaryDividerStyle} />
                <div style={summaryRowStyle}>
                  <span style={totalLabelStyle}>Total</span>
                  <span style={totalValueStyle}>£{cartTotal >= 100 ? cartTotal : cartTotal + 5.99}</span>
                </div>

                <button onClick={handleCheckout} style={checkoutBtnStyle}>
                  Checkout →
                </button>
                <button onClick={clearCart} style={clearBtnStyle}>
                  Clear Cart
                </button>

                {cartTotal < 100 && (
                  <p style={freeShippingNoteStyle}>
                    Add £{(100 - cartTotal).toFixed(2)} more for free shipping!
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
};

const pageHeaderStyle = { position: "relative", background: "linear-gradient(135deg, #0a0a0a, #1a1208)", padding: "60px 48px", overflow: "hidden" };
const pageHeaderOverlayStyle = { position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, rgba(201,168,76,0.1) 0%, transparent 70%)" };
const eyebrowStyle = { color: "#c9a84c", fontSize: "0.85rem", fontWeight: "600", letterSpacing: "3px", textTransform: "uppercase", marginBottom: "12px" };
const pageTitleStyle = { fontFamily: "'Playfair Display', serif", fontSize: "3rem", fontWeight: "700", color: "white" };
const sectionStyle = { padding: "60px 48px", maxWidth: "1200px", margin: "0 auto" };
const emptyCartStyle = { textAlign: "center", padding: "80px 20px", display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" };
const emptyTitleStyle = { fontFamily: "'Playfair Display', serif", fontSize: "2rem", color: "#111827" };
const emptyDescStyle = { color: "#6b7280", fontSize: "1rem" };
const shopNowBtnStyle = { padding: "14px 36px", border: "none", borderRadius: "25px", background: "linear-gradient(135deg, #c9a84c, #a07830)", color: "white", fontWeight: "700", cursor: "pointer", fontSize: "1rem", marginTop: "8px" };
const cartLayoutStyle = { display: "grid", gridTemplateColumns: "1fr 360px", gap: "40px", alignItems: "start" };
const itemsColStyle = { display: "flex", flexDirection: "column", gap: "16px" };
const summaryColStyle = {};
const colTitleStyle = { fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", fontWeight: "700", color: "#111827", marginBottom: "20px" };
const cartItemStyle = { display: "flex", alignItems: "center", gap: "20px", backgroundColor: "white", padding: "20px 24px", borderRadius: "16px", boxShadow: "0 4px 16px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6" };
const cartImageStyle = { width: "90px", height: "90px", objectFit: "cover", borderRadius: "12px", flexShrink: 0 };
const itemBrandStyle = { color: "#c9a84c", fontWeight: "600", fontSize: "0.78rem", letterSpacing: "1px", textTransform: "uppercase", margin: "0 0 4px" };
const itemNameStyle = { fontFamily: "'Playfair Display', serif", fontSize: "1.05rem", fontWeight: "700", color: "#111827", margin: "0 0 4px" };
const itemCategoryStyle = { color: "#9ca3af", fontSize: "0.85rem", margin: 0 };
const qtyWrapperStyle = { display: "flex", alignItems: "center", gap: "12px", backgroundColor: "#f9fafb", padding: "6px 12px", borderRadius: "25px", border: "1px solid #e5e7eb" };
const qtyBtnStyle = { width: "28px", height: "28px", border: "none", backgroundColor: "white", borderRadius: "50%", cursor: "pointer", fontWeight: "700", fontSize: "1.1rem", color: "#374151", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" };
const qtyNumberStyle = { fontWeight: "700", minWidth: "20px", textAlign: "center" };
const itemPriceColStyle = { textAlign: "right", minWidth: "80px" };
const itemTotalStyle = { fontFamily: "'Playfair Display', serif", fontWeight: "700", fontSize: "1.1rem", color: "#111827", margin: "0 0 2px" };
const itemUnitStyle = { color: "#9ca3af", fontSize: "0.8rem", margin: 0 };
const removeBtnStyle = { width: "32px", height: "32px", border: "none", backgroundColor: "#fee2e2", color: "#dc2626", borderRadius: "50%", cursor: "pointer", fontWeight: "700", fontSize: "0.85rem", flexShrink: 0 };
const summaryCardStyle = { backgroundColor: "white", borderRadius: "20px", padding: "28px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", border: "1px solid #f3f4f6" };
const summaryRowStyle = { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" };
const summaryItemNameStyle = { color: "#6b7280", fontSize: "0.88rem" };
const summaryItemPriceStyle = { color: "#374151", fontWeight: "600", fontSize: "0.88rem" };
const summaryDividerStyle = { height: "1px", backgroundColor: "#f3f4f6", margin: "16px 0" };
const summaryLabelStyle = { color: "#374151", fontWeight: "500", fontSize: "0.95rem" };
const summaryValueStyle = { color: "#374151", fontWeight: "600", fontSize: "0.95rem" };
const totalLabelStyle = { fontFamily: "'Playfair Display', serif", fontWeight: "700", fontSize: "1.1rem", color: "#111827" };
const totalValueStyle = { fontFamily: "'Playfair Display', serif", fontWeight: "700", fontSize: "1.2rem", color: "#111827" };
const checkoutBtnStyle = { width: "100%", padding: "15px", border: "none", borderRadius: "12px", background: "linear-gradient(135deg, #c9a84c, #a07830)", color: "white", fontSize: "1rem", fontWeight: "700", cursor: "pointer", marginTop: "20px", boxShadow: "0 6px 20px rgba(201,168,76,0.3)" };
const clearBtnStyle = { width: "100%", padding: "13px", border: "1.5px solid #e5e7eb", borderRadius: "12px", backgroundColor: "white", color: "#6b7280", fontSize: "0.95rem", fontWeight: "600", cursor: "pointer", marginTop: "10px" };
const freeShippingNoteStyle = { textAlign: "center", color: "#c9a84c", fontSize: "0.82rem", fontWeight: "600", marginTop: "12px", padding: "10px", backgroundColor: "rgba(201,168,76,0.08)", borderRadius: "8px" };

export default Cart;