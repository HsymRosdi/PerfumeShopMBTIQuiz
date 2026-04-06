import { useState } from "react";

const PerfumeCard = ({ perfume, onQuickView }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleQuickViewClick = () => {
    if (onQuickView) {
      onQuickView(perfume);
    }
  };

  return (
    <div
      style={cardStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={imageWrapperStyle}>
        <img
          src={perfume.image}
          alt={perfume.name}
          style={imageStyle}
        />

        {isHovered && (
          <div style={overlayStyle}>
            <button
              style={quickViewButtonStyle}
              onClick={handleQuickViewClick}
            >
              Quick View
            </button>
          </div>
        )}
      </div>

      <div style={{ padding: "18px" }}>
        <p style={genderStyle}>{perfume.gender}</p>
        <h3 style={nameStyle}>{perfume.name}</h3>
        <p style={textStyle}>{perfume.brand}</p>
        <p style={textStyle}>{perfume.category}</p>
        <p style={priceStyle}>£{perfume.price}</p>
      </div>
    </div>
  );
};

const cardStyle = {
  backgroundColor: "white",
  borderRadius: "16px",
  overflow: "hidden",
  boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
  transition: "0.3s ease",
};

const imageWrapperStyle = {
  position: "relative",
};

const imageStyle = {
  width: "100%",
  height: "220px",
  objectFit: "cover",
};

const overlayStyle = {
  position: "absolute",
  inset: 0,
  backgroundColor: "rgba(0, 0, 0, 0.35)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const quickViewButtonStyle = {
  padding: "12px 20px",
  border: "none",
  borderRadius: "10px",
  backgroundColor: "white",
  color: "#111827",
  fontWeight: "600",
  cursor: "pointer",
};

const genderStyle = {
  color: "#f43f5e",
  fontWeight: "700",
  marginBottom: "8px",
  fontSize: "0.9rem",
};

const nameStyle = {
  margin: "0 0 8px",
  fontSize: "1.2rem",
};

const textStyle = {
  color: "#6b7280",
  margin: "0 0 10px",
};

const priceStyle = {
  fontWeight: "700",
  marginBottom: "0",
};

export default PerfumeCard;