import { createContext, useContext, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";
import { useToast } from "../ui/ToastContext";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const isFirstLoad = useRef(true);
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Load cart from Firestore when user logs in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Clear previous user's cart first, then load this user's cart
        setCartItems([]);
        setCurrentUserId(user.uid);
        try {
          const userRef = doc(db, "users", user.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists() && userSnap.data().cart) {
            setCartItems(userSnap.data().cart);
          } else {
            setCartItems([]);
          }
        } catch (err) {
          console.error("Error loading cart:", err);
          setCartItems([]);
        }
      } else {
        // User logged out — keep cart visible, just stop saving
        setCurrentUserId(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // Save cart to Firestore whenever cartItems changes
  // Only save if user is logged in
  useEffect(() => {
    if (!currentUserId) return;
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return;
    }
    const saveCart = async () => {
      try {
        await setDoc(
          doc(db, "users", currentUserId),
          { cart: cartItems },
          { merge: true }
        );
      } catch (err) {
        console.error("Error saving cart:", err);
      }
    };
    saveCart();
  }, [cartItems, currentUserId]);

  const addToCart = (perfume, quantity = 1) => {
    const user = auth.currentUser;
    if (!user) {
      showToast("Please login to add items to cart!");
      setTimeout(() => navigate("/login"), 1500);
      return;
    }

    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === perfume.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === perfume.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevItems, { ...perfume, quantity }];
    });

    showToast(`${perfume.name} added to cart!`);
  };

  const removeFromCart = (perfumeId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== perfumeId));
  };

  const increaseQuantity = (perfumeId) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === perfumeId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQuantity = (perfumeId) => {
    setCartItems((prevItems) =>
      prevItems
        .map((item) =>
          item.id === perfumeId ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const clearCart = () => setCartItems([]);

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};