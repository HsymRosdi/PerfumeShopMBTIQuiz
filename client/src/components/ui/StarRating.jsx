import { useState } from "react";

const StarRating = ({ perfumeId, perfumeName, initialRating = 0, onRate, size = "normal" }) => {
  const [hovered, setHovered] = useState(0);
  const [selected, setSelected] = useState(initialRating);
  const [submitted, setSubmitted] = useState(initialRating > 0);

  const starSize = size === "small" ? "18px" : "24px";
  const fontSize = size === "small" ? "0.75rem" : "0.82rem";

  const handleRate = async (rating) => {
    setSelected(rating);
    setSubmitted(true);
    if (onRate) await onRate(perfumeId, perfumeName, rating);
  };

  return (
    <div style={wrapperStyle}>
      <p style={{ ...labelStyle, fontSize }}>
        {submitted ? "Thanks for rating!" : "Rate this recommendation"}
      </p>
      <div style={starsRowStyle}>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => !submitted && handleRate(star)}
            onMouseEnter={() => !submitted && setHovered(star)}
            onMouseLeave={() => !submitted && setHovered(0)}
            style={{
              ...starBtnStyle,
              fontSize: starSize,
              color: star <= (hovered || selected) ? "#c9a84c" : "#d1d5db",
              cursor: submitted ? "default" : "pointer",
              transform: !submitted && hovered >= star ? "scale(1.2)" : "scale(1)",
            }}
          >
            ★
          </button>
        ))}
      </div>
      {submitted && (
        <p style={{ ...ratedTextStyle, fontSize }}>
          You rated {selected}/5 ⭐
        </p>
      )}
    </div>
  );
};

const wrapperStyle = { display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", padding: "10px 0 4px", borderTop: "1px solid #f3f4f6", marginTop: "10px" };
const labelStyle = { color: "#9ca3af", margin: 0, fontWeight: "500" };
const starsRowStyle = { display: "flex", gap: "2px" };
const starBtnStyle = { background: "none", border: "none", padding: "2px", transition: "all 0.15s ease", lineHeight: 1 };
const ratedTextStyle = { color: "#c9a84c", fontWeight: "600", margin: 0 };

export default StarRating;