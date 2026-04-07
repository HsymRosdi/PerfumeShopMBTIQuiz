import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { useCart } from "../context/CartContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { logoutUser } from "../services/authService";

const Cart = () => {
  const [userName, setUserName] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();

  const {
    cartItems,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    cartTotal,
  } = useCart();

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

  return (
    <div style={pageStyle}>
      <Navbar
        loggedIn={loggedIn}
        userName={userName}
        onLogout={handleLogout}
      />

      <section style={{ padding: "50px 40px", maxWidth: "1200px", margin: "0 auto" }}>
        <h1 style={{ fontSize: "2.5rem", marginBottom: "30px", textAlign: "center" }}>
          Your Cart
        </h1>

        {cartItems.length === 0 ? (
          <p style={{ textAlign: "center", color: "#6b7280" }}>
            Your cart is empty.
          </p>
        ) : (
          <>
            {cartItems.map((item) => (
              <div key={item.id} style={cartItemStyle}>
                <img src={item.image} alt={item.name} style={cartImageStyle} />

                <div style={{ flex: 1 }}>
                  <h3 style={{ marginBottom: "10px" }}>{item.name}</h3>
                  <p style={{ color: "#6b7280", marginBottom: "8px" }}>{item.brand}</p>
                  <p style={{ fontWeight: "600" }}>£{item.price}</p>
                </div>

                <div style={qtyWrapperStyle}>
                  <button onClick={() => decreaseQuantity(item.id)} style={qtyButtonStyle}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => increaseQuantity(item.id)} style={qtyButtonStyle}>+</button>
                </div>

                <div style={{ fontWeight: "700", minWidth: "100px", textAlign: "right" }}>
                  £{item.price * item.quantity}
                </div>

                <button onClick={() => removeFromCart(item.id)} style={removeButtonStyle}>
                  Remove
                </button>
              </div>
            ))}

            <div style={{ textAlign: "right", marginTop: "30px" }}>
              <h2>Total: £{cartTotal}</h2>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "15px", marginTop: "15px" }}>
                <button onClick={clearCart} style={secondaryButtonStyle}>Clear Cart</button>
                <button style={primaryButtonStyle}>Checkout</button>
              </div>
            </div>
          </>
        )}
      </section>

      <Footer />
    </div>
  );
};

const pageStyle = {
  minHeight: "100vh",
  background: "#fffafc",
  color: "#111827",
  fontFamily: "Arial, sans-serif",
};

const cartItemStyle = {
  display: "flex",
  alignItems: "center",
  gap: "20px",
  backgroundColor: "white",
  padding: "20px",
  borderRadius: "16px",
  marginBottom: "20px",
  boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
};

const cartImageStyle = {
  width: "100px",
  height: "100px",
  objectFit: "cover",
  borderRadius: "12px",
};

const qtyWrapperStyle = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
};

const qtyButtonStyle = {
  width: "32px",
  height: "32px",
  border: "1px solid #d1d5db",
  backgroundColor: "white",
  borderRadius: "8px",
  cursor: "pointer",
};

const removeButtonStyle = {
  padding: "8px 14px",
  border: "none",
  borderRadius: "8px",
  backgroundColor: "#ef4444",
  color: "white",
  cursor: "pointer",
};

const primaryButtonStyle = {
  padding: "12px 20px",
  border: "none",
  borderRadius: "10px",
  backgroundColor: "#111827",
  color: "white",
  fontWeight: "600",
  cursor: "pointer",
};

const secondaryButtonStyle = {
  padding: "12px 20px",
  border: "1px solid #111827",
  borderRadius: "10px",
  backgroundColor: "white",
  color: "#111827",
  fontWeight: "600",
  cursor: "pointer",
};

export default Cart;