import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import { useToast } from "../ui/ToastContext";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("cartItems");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (perfume, quantity = 1) => {
    // Check if user is logged in
    const user = auth.currentUser;
    if (!user) {
      showToast("Please login to add items to cart!");
      
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
  const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

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