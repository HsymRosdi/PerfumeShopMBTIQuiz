import { useState } from "react";
import { useCart } from "../cart/CartContext";

const PerfumeCard = ({ perfume, onQuickView }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart } = useCart();

  return (
    <div
      style={{
        ...cardStyle,
        transform: isHovered ? "translateY(-6px)" : "translateY(0)",
        boxShadow: isHovered
          ? "0 20px 40px rgba(0, 0, 0, 0.15)"
          : "0 4px 16px rgba(0,0,0,0.07)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image */}
      <div style={imageWrapperStyle}>
        <img src={perfume.image} alt={perfume.name} style={imageStyle} />

        {/* Gender Badge */}
        <div style={{
          ...genderBadgeStyle,
          backgroundColor: perfume.gender === "Male" ? "#0a0a0a" : perfume.gender === "Female" ? "#f43f5e" : "#c9a84c",
        }}>
          {perfume.gender}
        </div>

        {/* Hover Overlay */}
        {isHovered && (
          <div style={overlayStyle}>
            <button style={quickViewBtnStyle} onClick={() => onQuickView && onQuickView(perfume)}>
              Quick View
            </button>
            <button style={addCartBtnStyle} onClick={() => addToCart(perfume, 1)}>
              + Add to Cart
            </button>
          </div>
        )}
      </div>

      {/* Info */}
      <div style={infoStyle}>
        <p style={brandStyle}>{perfume.brand}</p>
        <h3 style={nameStyle}>{perfume.name}</h3>
        <div style={metaRowStyle}>
          <span style={categoryTagStyle}>{perfume.category}</span>
          <span style={priceStyle}>£{perfume.price}</span>
        </div>
      </div>

      {/* Gold Accent Line */}
      <div style={{
        ...accentLineStyle,
        width: isHovered ? "100%" : "0%",
      }} />
    </div>
  );
};

const cardStyle = {
  backgroundColor: "white",
  borderRadius: "16px",
  overflow: "hidden",
  transition: "all 0.3s ease",
  cursor: "pointer",
  position: "relative",
  border: "1px solid #f3f4f6",
};

const imageWrapperStyle = {
  position: "relative",
  overflow: "hidden",
};

const imageStyle = {
  width: "100%",
  height: "240px",
  objectFit: "cover",
  transition: "transform 0.4s ease",
  display: "block",
};

const genderBadgeStyle = {
  position: "absolute",
  top: "12px",
  left: "12px",
  color: "white",
  padding: "4px 12px",
  borderRadius: "20px",
  fontSize: "0.75rem",
  fontWeight: "700",
  letterSpacing: "0.5px",
};

const overlayStyle = {
  position: "absolute",
  inset: 0,
  backgroundColor: "rgba(10,10,10,0.55)",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  gap: "10px",
};

const quickViewBtnStyle = {
  padding: "11px 28px",
  border: "2px solid white",
  borderRadius: "25px",
  backgroundColor: "transparent",
  color: "white",
  fontWeight: "600",
  cursor: "pointer",
  fontSize: "0.9rem",
  transition: "all 0.2s ease",
};

const addCartBtnStyle = {
  padding: "11px 28px",
  border: "none",
  borderRadius: "25px",
  background: "linear-gradient(135deg, #c9a84c, #a07830)",
  color: "white",
  fontWeight: "700",
  cursor: "pointer",
  fontSize: "0.9rem",
};

const infoStyle = {
  padding: "18px 20px 20px",
};

const brandStyle = {
  color: "#c9a84c",
  fontWeight: "600",
  fontSize: "0.78rem",
  letterSpacing: "1.5px",
  textTransform: "uppercase",
  marginBottom: "6px",
};

const nameStyle = {
  fontFamily: "'Playfair Display', serif",
  fontSize: "1.1rem",
  fontWeight: "700",
  color: "#111827",
  marginBottom: "12px",
  lineHeight: "1.3",
};

const metaRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const categoryTagStyle = {
  backgroundColor: "#f3f4f6",
  color: "#6b7280",
  padding: "4px 10px",
  borderRadius: "10px",
  fontSize: "0.78rem",
  fontWeight: "500",
};

const priceStyle = {
  fontFamily: "'Playfair Display', serif",
  fontWeight: "700",
  fontSize: "1.15rem",
  color: "#111827",
};

const accentLineStyle = {
  position: "absolute",
  bottom: 0,
  left: 0,
  height: "3px",
  background: "linear-gradient(135deg, #c9a84c, #a07830)",
  transition: "width 0.35s ease",
};

export default PerfumeCard;