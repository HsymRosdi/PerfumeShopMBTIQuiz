import { useEffect, useState } from "react";
import { useCart } from "../cart/CartContext";
import SimilarPerfumes from "./SimilarPerfumes";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase";

const QuickViewModal = ({ perfume, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedPerfume, setSelectedPerfume] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(null);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    if (perfume) {
      setSelectedPerfume(perfume);
      setQuantity(1);
    }
  }, [perfume]);

  // Fetch reviews when perfume changes
  useEffect(() => {
    if (!selectedPerfume) return;
    const fetchReviews = async () => {
      setLoadingReviews(true);
      try {
        const q = query(
          collection(db, "ratings"),
          where("perfumeId", "==", selectedPerfume.id)
        );
        const snap = await getDocs(q);
        const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setReviews(data);

        if (data.length > 0) {
          const avg = data.reduce((sum, r) => sum + r.rating, 0) / data.length;
          setAvgRating({ average: Math.round(avg * 10) / 10, count: data.length });
        } else {
          setAvgRating(null);
        }
      } catch (err) {
        console.error("Error fetching reviews:", err);
      } finally {
        setLoadingReviews(false);
      }
    };
    fetchReviews();
  }, [selectedPerfume]);

  if (!perfume) return null;

  const currentPerfume = selectedPerfume || perfume;

  const decreaseQty = () => { if (quantity > 1) setQuantity(quantity - 1); };
  const increaseQty = () => setQuantity(quantity + 1);

  const handleAdd = () => {
    addToCart(currentPerfume, quantity);
    onClose();
  };

  const handleSelectSimilar = (similarPerfume) => {
    setSelectedPerfume(similarPerfume);
    setQuantity(1);
    document.getElementById("quickview-modal-inner")?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} style={closeButtonStyle}>×</button>

        <div id="quickview-modal-inner" style={innerScrollStyle}>

          {/* Main Content */}
          <div style={contentStyle}>
            {/* Image */}
            <div style={imageSectionStyle}>
              <img src={currentPerfume.image} alt={currentPerfume.name} style={imageStyle} />
              <div style={{
                ...genderBadgeStyle,
                backgroundColor: currentPerfume.gender === "Male" ? "#0a0a0a" : currentPerfume.gender === "Female" ? "#f43f5e" : "#c9a84c",
              }}>
                {currentPerfume.gender}
              </div>
            </div>

            {/* Details */}
            <div style={detailsStyle}>
              <p style={brandStyle}>{currentPerfume.brand}</p>
              <h2 style={nameStyle}>{currentPerfume.name}</h2>

              {/* Average Rating */}
              {avgRating && (
                <div style={avgRatingRowStyle}>
                  <span style={avgStarsStyle}>
                    {"★".repeat(Math.round(avgRating.average))}{"☆".repeat(5 - Math.round(avgRating.average))}
                  </span>
                  <span style={avgRatingTextStyle}>
                    {avgRating.average} ({avgRating.count} {avgRating.count === 1 ? "review" : "reviews"})
                  </span>
                </div>
              )}

              <p style={descStyle}>{currentPerfume.description}</p>

              <div style={tagsRowStyle}>
                <span style={categoryTagStyle}>{currentPerfume.category}</span>
                {currentPerfume.occasion?.map(occ => (
                  <span key={occ} style={occasionTagStyle}>{occ}</span>
                ))}
              </div>

              {/* Scent Notes */}
              {currentPerfume.notes && (
                <div style={notesContainerStyle}>
                  <p style={notesLabelStyle}>Scent Notes</p>
                  <div style={notesRowStyle}>
                    <div>
                      <p style={noteGroupLabelStyle}>Top</p>
                      <p style={noteGroupValueStyle}>{currentPerfume.notes.top?.join(", ")}</p>
                    </div>
                    <div>
                      <p style={noteGroupLabelStyle}>Middle</p>
                      <p style={noteGroupValueStyle}>{currentPerfume.notes.middle?.join(", ")}</p>
                    </div>
                    <div>
                      <p style={noteGroupLabelStyle}>Base</p>
                      <p style={noteGroupValueStyle}>{currentPerfume.notes.base?.join(", ")}</p>
                    </div>
                  </div>
                </div>
              )}

              <p style={priceStyle}>£{currentPerfume.price}</p>

              <div style={quantityWrapperStyle}>
                <button onClick={decreaseQty} style={qtyButtonStyle}>−</button>
                <span style={qtyTextStyle}>{quantity}</span>
                <button onClick={increaseQty} style={qtyButtonStyle}>+</button>
              </div>

              <button onClick={handleAdd} style={addToCartStyle}>Add to Cart</button>
            </div>
          </div>

          {/* ── Reviews Section ── */}
          <div style={reviewsSectionStyle}>
            <h3 style={reviewsTitleStyle}>
              Customer Reviews
              {avgRating && (
                <span style={reviewsAvgBadgeStyle}>
                  ★ {avgRating.average} · {avgRating.count} {avgRating.count === 1 ? "review" : "reviews"}
                </span>
              )}
            </h3>

            {loadingReviews ? (
              <p style={reviewsEmptyStyle}>Loading reviews...</p>
            ) : reviews.length === 0 ? (
              <div style={noReviewsStyle}>
                <p style={reviewsEmptyStyle}>No reviews yet. Be the first to review after purchasing!</p>
              </div>
            ) : (
              <div style={reviewsListStyle}>
                {reviews.map(review => (
                  <div key={review.id} style={reviewItemStyle}>
                    <div style={reviewHeaderStyle}>
                      <div style={reviewAvatarStyle}>{getInitials(review.userName || "User")}</div>
                      <div style={{ flex: 1 }}>
                        <div style={reviewNameStyle}>{review.userName || "Verified Buyer"}</div>
                        <div style={reviewDateStyle}>{formatDate(review.createdAt)}</div>
                      </div>
                      <div style={reviewStarsStyle}>
                        {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                      </div>
                    </div>
                    {review.comment && (
                      <p style={reviewCommentStyle}>"{review.comment}"</p>
                    )}
                    {review.source && (
                      <span style={{
                        ...reviewSourceStyle,
                        backgroundColor: review.source === "purchase" ? "#dcfce7" : "#dbeafe",
                        color: review.source === "purchase" ? "#166534" : "#1e40af",
                      }}>
                        {review.source === "purchase" ? "Verified Purchase" : review.source === "quiz" ? "Via Quiz" : "Via Mood"}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Similar Perfumes */}
          <SimilarPerfumes
            currentPerfume={currentPerfume}
            onSelectPerfume={handleSelectSimilar}
          />
        </div>
      </div>
    </div>
  );
};

// Styles
const overlayStyle = { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.6)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000, padding: "20px" };
const modalStyle = { backgroundColor: "white", borderRadius: "20px", width: "100%", maxWidth: "900px", position: "relative", boxShadow: "0 20px 60px rgba(0,0,0,0.3)", maxHeight: "90vh", display: "flex", flexDirection: "column" };
const closeButtonStyle = { position: "absolute", top: "15px", right: "15px", border: "none", background: "#111827", color: "white", width: "36px", height: "36px", borderRadius: "50%", fontSize: "1.2rem", cursor: "pointer", zIndex: 10 };
const innerScrollStyle = { overflowY: "auto", padding: "30px" };
const contentStyle = { display: "flex", gap: "40px", alignItems: "flex-start", flexWrap: "wrap", marginBottom: "10px" };
const imageSectionStyle = { flex: "1", minWidth: "260px", position: "relative" };
const imageStyle = { width: "100%", maxWidth: "300px", height: "340px", objectFit: "cover", borderRadius: "16px", display: "block" };
const genderBadgeStyle = { position: "absolute", top: "12px", left: "12px", color: "white", padding: "4px 12px", borderRadius: "20px", fontSize: "0.75rem", fontWeight: "700" };
const detailsStyle = { flex: "1", minWidth: "260px" };
const brandStyle = { fontSize: "0.8rem", letterSpacing: "2px", textTransform: "uppercase", color: "#c9a84c", fontWeight: "700", marginBottom: "8px" };
const nameStyle = { fontFamily: "'Playfair Display', serif", fontSize: "2rem", marginBottom: "8px", color: "#111827", lineHeight: "1.2" };
const avgRatingRowStyle = { display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" };
const avgStarsStyle = { color: "#c9a84c", fontSize: "16px", letterSpacing: "2px" };
const avgRatingTextStyle = { fontSize: "0.85rem", color: "#6b7280", fontWeight: "500" };
const descStyle = { color: "#6b7280", marginBottom: "14px", lineHeight: "1.6", fontSize: "0.95rem" };
const tagsRowStyle = { display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "16px" };
const categoryTagStyle = { backgroundColor: "#fef3c7", color: "#92400e", padding: "4px 12px", borderRadius: "12px", fontSize: "0.8rem", fontWeight: "600" };
const occasionTagStyle = { backgroundColor: "#f3f4f6", color: "#6b7280", padding: "4px 12px", borderRadius: "12px", fontSize: "0.8rem" };
const notesContainerStyle = { backgroundColor: "#faf8f5", borderRadius: "12px", padding: "14px 16px", marginBottom: "16px", border: "1px solid #f3f4f6" };
const notesLabelStyle = { fontSize: "0.75rem", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "1px", fontWeight: "600", marginBottom: "10px" };
const notesRowStyle = { display: "flex", gap: "16px", flexWrap: "wrap" };
const noteGroupLabelStyle = { fontSize: "0.75rem", color: "#c9a84c", fontWeight: "700", textTransform: "uppercase", marginBottom: "3px" };
const noteGroupValueStyle = { fontSize: "0.85rem", color: "#374151", margin: 0, textTransform: "capitalize" };
const priceStyle = { fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", fontWeight: "700", color: "#111827", marginBottom: "20px" };
const quantityWrapperStyle = { display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px" };
const qtyButtonStyle = { width: "38px", height: "38px", border: "1.5px solid #e5e7eb", backgroundColor: "white", borderRadius: "10px", cursor: "pointer", fontSize: "1.2rem", fontWeight: "600", color: "#374151" };
const qtyTextStyle = { fontSize: "1.1rem", fontWeight: "700", minWidth: "24px", textAlign: "center" };
const addToCartStyle = { padding: "13px 28px", border: "none", borderRadius: "12px", background: "linear-gradient(135deg, #c9a84c, #a07830)", color: "white", fontWeight: "700", cursor: "pointer", fontSize: "0.95rem", boxShadow: "0 4px 12px rgba(201,168,76,0.3)" };
const reviewsSectionStyle = { marginTop: "30px", paddingTop: "28px", borderTop: "1px solid #f3f4f6" };
const reviewsTitleStyle = { fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", fontWeight: "700", color: "#111827", marginBottom: "20px", display: "flex", alignItems: "center", gap: "12px" };
const reviewsAvgBadgeStyle = { fontSize: "0.85rem", fontWeight: "600", color: "#c9a84c", backgroundColor: "rgba(201,168,76,0.1)", padding: "4px 12px", borderRadius: "20px", border: "1px solid rgba(201,168,76,0.2)" };
const noReviewsStyle = { backgroundColor: "#faf8f5", borderRadius: "12px", padding: "24px", textAlign: "center" };
const reviewsEmptyStyle = { color: "#9ca3af", fontSize: "0.9rem", margin: 0 };
const reviewsListStyle = { display: "flex", flexDirection: "column", gap: "16px" };
const reviewItemStyle = { backgroundColor: "#faf8f5", borderRadius: "14px", padding: "18px 20px", border: "1px solid #f3f4f6" };
const reviewHeaderStyle = { display: "flex", alignItems: "center", gap: "12px", marginBottom: "10px" };
const reviewAvatarStyle = { width: "36px", height: "36px", borderRadius: "50%", backgroundColor: "#dbeafe", color: "#1e40af", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "700", flexShrink: 0 };
const reviewNameStyle = { fontWeight: "600", color: "#111827", fontSize: "0.9rem" };
const reviewDateStyle = { fontSize: "0.78rem", color: "#9ca3af" };
const reviewStarsStyle = { color: "#c9a84c", fontSize: "14px", letterSpacing: "1px", marginLeft: "auto" };
const reviewCommentStyle = { color: "#374151", fontSize: "0.9rem", lineHeight: "1.6", margin: "0 0 10px", fontStyle: "italic" };
const reviewSourceStyle = { display: "inline-block", padding: "3px 10px", borderRadius: "10px", fontSize: "0.75rem", fontWeight: "600" };

export default QuickViewModal;