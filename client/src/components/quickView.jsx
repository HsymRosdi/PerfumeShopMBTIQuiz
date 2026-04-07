import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";

const QuickViewModal = ({ perfume, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    if (perfume) {
      setQuantity(1);
    }
  }, [perfume]);

  if (!perfume) return null;

  const decreaseQty = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQty = () => {
    setQuantity(quantity + 1);
  };

  const handleAdd = () => {
    addToCart(perfume, quantity);
    onClose();
  };

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} style={closeButtonStyle}>
          ×
        </button>

        <div style={contentStyle}>
          <div style={imageSectionStyle}>
            <img src={perfume.image} alt={perfume.name} style={imageStyle} />
          </div>

          <div style={detailsStyle}>
            <p style={brandStyle}>{perfume.brand}</p>
            <h2 style={nameStyle}>{perfume.name}</h2>
            <p style={descStyle}>{perfume.description}</p>
            <p style={categoryStyle}>{perfume.category}</p>
            <p style={priceStyle}>£{perfume.price}</p>

            <div style={quantityWrapperStyle}>
              <button onClick={decreaseQty} style={qtyButtonStyle}>-</button>
              <span style={qtyTextStyle}>{quantity}</span>
              <button onClick={increaseQty} style={qtyButtonStyle}>+</button>
            </div>

            <div style={actionButtonsStyle}>
              <button onClick={handleAdd} style={addToCartStyle}>
                Add to Cart
              </button>
              <button style={moreDetailsStyle}>More Details</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
  padding: "20px",
};

const modalStyle = {
  backgroundColor: "white",
  borderRadius: "20px",
  width: "100%",
  maxWidth: "900px",
  position: "relative",
  padding: "30px",
  boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
};

const closeButtonStyle = {
  position: "absolute",
  top: "15px",
  right: "15px",
  border: "none",
  background: "#111827",
  color: "white",
  width: "35px",
  height: "35px",
  borderRadius: "50%",
  fontSize: "1.2rem",
  cursor: "pointer",
};

const contentStyle = {
  display: "flex",
  gap: "40px",
  alignItems: "center",
  flexWrap: "wrap",
};

const imageSectionStyle = {
  flex: "1",
  minWidth: "280px",
  textAlign: "center",
};

const imageStyle = {
  width: "100%",
  maxWidth: "300px",
  height: "350px",
  objectFit: "cover",
  borderRadius: "16px",
};

const detailsStyle = {
  flex: "1",
  minWidth: "280px",
};

const brandStyle = {
  fontSize: "1.2rem",
  letterSpacing: "2px",
  textTransform: "uppercase",
  color: "#374151",
  marginBottom: "10px",
};

const nameStyle = {
  fontSize: "2.2rem",
  marginBottom: "10px",
  color: "#111827",
};

const descStyle = {
  color: "#6b7280",
  marginBottom: "10px",
  lineHeight: "1.6",
};

const categoryStyle = {
  color: "#f43f5e",
  fontWeight: "700",
  marginBottom: "12px",
};

const priceStyle = {
  fontSize: "1.8rem",
  fontWeight: "700",
  marginBottom: "25px",
};

const quantityWrapperStyle = {
  display: "flex",
  alignItems: "center",
  gap: "20px",
  marginBottom: "25px",
};

const qtyButtonStyle = {
  width: "40px",
  height: "40px",
  border: "1px solid #d1d5db",
  backgroundColor: "white",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "1.2rem",
};

const qtyTextStyle = {
  fontSize: "1.2rem",
  fontWeight: "600",
};

const actionButtonsStyle = {
  display: "flex",
  gap: "15px",
  flexWrap: "wrap",
};

const addToCartStyle = {
  padding: "12px 24px",
  border: "none",
  borderRadius: "10px",
  backgroundColor: "#111827",
  color: "white",
  fontWeight: "600",
  cursor: "pointer",
};

const moreDetailsStyle = {
  padding: "12px 24px",
  border: "1px solid #111827",
  borderRadius: "10px",
  backgroundColor: "white",
  color: "#111827",
  fontWeight: "600",
  cursor: "pointer",
};

export default QuickViewModal;