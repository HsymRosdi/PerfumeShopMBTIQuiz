import { useState } from "react";

const ReviewModal = ({ perfume, orderId, onSubmit, onClose }) => {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const wordCount = comment.trim() === "" ? 0 : comment.trim().split(/\s+/).length;

  const handleSubmit = async () => {
    if (rating === 0) { setError("Please select a star rating."); return; }
    if (wordCount > 100) { setError("Comment must be 100 words or less."); return; }
    setError("");
    setSubmitting(true);
    await onSubmit(perfume.id, perfume.name, orderId, rating, comment.trim());
    setSubmitting(false);
    setSubmitted(true);
  };

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} style={closeBtnStyle}>×</button>

        {submitted ? (
          <div style={successStyle}>
            <div style={{ fontSize: "3rem", marginBottom: "12px" }}>🎉</div>
            <h3 style={successTitleStyle}>Thank you for your review!</h3>
            <p style={successDescStyle}>Your feedback helps other shoppers find their perfect scent.</p>
            <button onClick={onClose} style={submitBtnStyle}>Close</button>
          </div>
        ) : (
          <>
            <div style={perfumeRowStyle}>
              <img src={perfume.image} alt={perfume.name} style={perfumeImgStyle} />
              <div>
                <p style={perfumeBrandStyle}>{perfume.brand}</p>
                <h3 style={perfumeNameStyle}>{perfume.name}</h3>
              </div>
            </div>

            <div style={ratingSection}>
              <p style={sectionLabelStyle}>Your Rating</p>
              <div style={starsRowStyle}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHovered(star)}
                    onMouseLeave={() => setHovered(0)}
                    style={{
                      ...starBtnStyle,
                      color: star <= (hovered || rating) ? "#c9a84c" : "#d1d5db",
                      transform: hovered >= star ? "scale(1.2)" : "scale(1)",
                    }}
                  >
                    ★
                  </button>
                ))}
              </div>
              {rating > 0 && (
                <p style={ratingLabelStyle}>
                  {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][rating]} ({rating}/5)
                </p>
              )}
            </div>

            <div style={{ marginBottom: "20px" }}>
              <p style={sectionLabelStyle}>
                Your Review <span style={{ color: "#9ca3af", fontWeight: "400" }}>(optional)</span>
              </p>
              <textarea
                style={textareaStyle}
                placeholder="Share your thoughts about this perfume... (max 100 words)"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
              />
              <p style={{ ...wordCountStyle, color: wordCount > 100 ? "#dc2626" : "#9ca3af" }}>
                {wordCount}/100 words
              </p>
            </div>

            {error && <p style={errorStyle}>{error}</p>}

            <div style={btnRowStyle}>
              <button onClick={onClose} style={cancelBtnStyle}>Cancel</button>
              <button onClick={handleSubmit} disabled={submitting} style={submitBtnStyle}>
                {submitting ? "Submitting..." : "Submit Review"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const overlayStyle = { position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: "20px" };
const modalStyle = { backgroundColor: "white", borderRadius: "24px", padding: "36px", maxWidth: "480px", width: "100%", position: "relative", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" };
const closeBtnStyle = { position: "absolute", top: "16px", right: "16px", background: "#f3f4f6", border: "none", width: "32px", height: "32px", borderRadius: "50%", cursor: "pointer", fontSize: "1.1rem", color: "#374151" };
const perfumeRowStyle = { display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px", paddingBottom: "20px", borderBottom: "1px solid #f3f4f6" };
const perfumeImgStyle = { width: "64px", height: "64px", objectFit: "cover", borderRadius: "12px", flexShrink: 0 };
const perfumeBrandStyle = { color: "#c9a84c", fontSize: "0.75rem", fontWeight: "600", letterSpacing: "1px", textTransform: "uppercase", margin: "0 0 4px" };
const perfumeNameStyle = { fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", fontWeight: "700", color: "#111827", margin: 0 };
const ratingSection = { marginBottom: "20px" };
const sectionLabelStyle = { fontSize: "0.88rem", fontWeight: "600", color: "#374151", marginBottom: "10px" };
const starsRowStyle = { display: "flex", gap: "4px", marginBottom: "8px" };
const starBtnStyle = { background: "none", border: "none", fontSize: "32px", cursor: "pointer", transition: "all 0.15s ease", padding: "2px", lineHeight: 1 };
const ratingLabelStyle = { fontSize: "0.85rem", color: "#c9a84c", fontWeight: "600", margin: 0 };
const textareaStyle = { width: "100%", padding: "14px 16px", borderRadius: "12px", border: "1.5px solid #e5e7eb", outline: "none", fontSize: "0.9rem", fontFamily: "'Inter', sans-serif", resize: "vertical", boxSizing: "border-box", lineHeight: "1.6" };
const wordCountStyle = { fontSize: "0.78rem", textAlign: "right", marginTop: "6px" };
const errorStyle = { color: "#dc2626", fontSize: "0.85rem", marginBottom: "12px" };
const btnRowStyle = { display: "flex", gap: "12px" };
const cancelBtnStyle = { flex: 1, padding: "13px", border: "1.5px solid #e5e7eb", borderRadius: "12px", backgroundColor: "white", color: "#374151", fontWeight: "600", cursor: "pointer", fontSize: "0.9rem" };
const submitBtnStyle = { flex: 1, padding: "13px", border: "none", borderRadius: "12px", background: "linear-gradient(135deg, #c9a84c, #a07830)", color: "white", fontWeight: "700", cursor: "pointer", fontSize: "0.9rem", boxShadow: "0 4px 12px rgba(201,168,76,0.3)" };
const successStyle = { textAlign: "center", padding: "20px 0" };
const successTitleStyle = { fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", fontWeight: "700", color: "#111827", marginBottom: "8px" };
const successDescStyle = { color: "#6b7280", fontSize: "0.9rem", marginBottom: "24px", lineHeight: "1.6" };

export default ReviewModal;