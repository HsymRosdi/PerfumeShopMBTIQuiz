import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import SimilarPerfumes from "./SimilarPerfumes";

const QuickViewModal = ({ perfume, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedPerfume, setSelectedPerfume] = useState(null);
  const { addToCart } = useCart();

  // When perfume prop changes or user clicks a similar perfume, update displayed perfume
  useEffect(() => {
    if (perfume) {
      setSelectedPerfume(perfume);
      setQuantity(1);
    }
  }, [perfume]);

  if (!perfume) return null;

  const currentPerfume = selectedPerfume || perfume;

  const decreaseQty = () => { if (quantity > 1) setQuantity(quantity - 1); };
  const increaseQty = () => setQuantity(quantity + 1);

  const handleAdd = () => {
    addToCart(currentPerfume, quantity);
    onClose();
  };

  // When user clicks a similar perfume card, switch to that perfume
  const handleSelectSimilar = (similarPerfume) => {
    setSelectedPerfume(similarPerfume);
    setQuantity(1);
    // Scroll modal back to top
    document.getElementById("quickview-modal-inner")?.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>

        {/* Close Button */}
        <button onClick={onClose} style={closeButtonStyle}>×</button>

        {/* Scrollable inner */}
        <div id="quickview-modal-inner" style={innerScrollStyle}>

          {/* Main Content */}
          <div style={contentStyle}>
            {/* Image */}
            <div style={imageSectionStyle}>
              <img src={currentPerfume.image} alt={currentPerfume.name} style={imageStyle} />
              <div style={genderBadgeStyle}>{currentPerfume.gender}</div>
            </div>

            {/* Details */}
            <div style={detailsStyle}>
              <p style={brandStyle}>{currentPerfume.brand}</p>
              <h2 style={nameStyle}>{currentPerfume.name}</h2>
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
                    <div style={noteGroupStyle}>
                      <p style={noteGroupLabelStyle}>Top</p>
                      <p style={noteGroupValueStyle}>{currentPerfume.notes.top?.join(", ")}</p>
                    </div>
                    <div style={noteGroupStyle}>
                      <p style={noteGroupLabelStyle}>Middle</p>
                      <p style={noteGroupValueStyle}>{currentPerfume.notes.middle?.join(", ")}</p>
                    </div>
                    <div style={noteGroupStyle}>
                      <p style={noteGroupLabelStyle}>Base</p>
                      <p style={noteGroupValueStyle}>{currentPerfume.notes.base?.join(", ")}</p>
                    </div>
                  </div>
                </div>
              )}

              <p style={priceStyle}>£{currentPerfume.price}</p>

              {/* Quantity */}
              <div style={quantityWrapperStyle}>
                <button onClick={decreaseQty} style={qtyButtonStyle}>−</button>
                <span style={qtyTextStyle}>{quantity}</span>
                <button onClick={increaseQty} style={qtyButtonStyle}>+</button>
              </div>

              {/* Actions */}
              <div style={actionButtonsStyle}>
                <button onClick={handleAdd} style={addToCartStyle}>Add to Cart</button>
              </div>
            </div>
          </div>

          {/* Similar Perfumes Section */}
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
const genderBadgeStyle = { position: "absolute", top: "12px", left: "12px", backgroundColor: "#111827", color: "#c9a84c", padding: "4px 12px", borderRadius: "20px", fontSize: "0.75rem", fontWeight: "700" };
const detailsStyle = { flex: "1", minWidth: "260px" };
const brandStyle = { fontSize: "0.8rem", letterSpacing: "2px", textTransform: "uppercase", color: "#c9a84c", fontWeight: "700", marginBottom: "8px" };
const nameStyle = { fontFamily: "'Playfair Display', serif", fontSize: "2rem", marginBottom: "10px", color: "#111827", lineHeight: "1.2" };
const descStyle = { color: "#6b7280", marginBottom: "14px", lineHeight: "1.6", fontSize: "0.95rem" };
const tagsRowStyle = { display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "16px" };
const categoryTagStyle = { backgroundColor: "#fef3c7", color: "#92400e", padding: "4px 12px", borderRadius: "12px", fontSize: "0.8rem", fontWeight: "600" };
const occasionTagStyle = { backgroundColor: "#f3f4f6", color: "#6b7280", padding: "4px 12px", borderRadius: "12px", fontSize: "0.8rem" };
const notesContainerStyle = { backgroundColor: "#faf8f5", borderRadius: "12px", padding: "14px 16px", marginBottom: "16px", border: "1px solid #f3f4f6" };
const notesLabelStyle = { fontSize: "0.75rem", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "1px", fontWeight: "600", marginBottom: "10px" };
const notesRowStyle = { display: "flex", gap: "16px", flexWrap: "wrap" };
const noteGroupStyle = {};
const noteGroupLabelStyle = { fontSize: "0.75rem", color: "#c9a84c", fontWeight: "700", textTransform: "uppercase", marginBottom: "3px" };
const noteGroupValueStyle = { fontSize: "0.85rem", color: "#374151", margin: 0, textTransform: "capitalize" };
const priceStyle = { fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", fontWeight: "700", color: "#111827", marginBottom: "20px" };
const quantityWrapperStyle = { display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px" };
const qtyButtonStyle = { width: "38px", height: "38px", border: "1.5px solid #e5e7eb", backgroundColor: "white", borderRadius: "10px", cursor: "pointer", fontSize: "1.2rem", fontWeight: "600", color: "#374151" };
const qtyTextStyle = { fontSize: "1.1rem", fontWeight: "700", minWidth: "24px", textAlign: "center" };
const actionButtonsStyle = { display: "flex", gap: "12px", flexWrap: "wrap" };
const addToCartStyle = { padding: "13px 28px", border: "none", borderRadius: "12px", background: "linear-gradient(135deg, #c9a84c, #a07830)", color: "white", fontWeight: "700", cursor: "pointer", fontSize: "0.95rem", boxShadow: "0 4px 12px rgba(201,168,76,0.3)" };

export default QuickViewModal;