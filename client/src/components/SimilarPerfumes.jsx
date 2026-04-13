import { useMemo } from "react";
import perfumes from "../data/perfume";
import { getSimilarPerfumes, getSimilarityExplanation } from "../utils/similarPerfumes";

const SimilarPerfumes = ({ currentPerfume, onSelectPerfume }) => {
  // Calculate similar perfumes using the similarity algorithm
  const similarPerfumes = useMemo(() => {
    if (!currentPerfume) return [];
    return getSimilarPerfumes(currentPerfume, perfumes, 4, false);
  }, [currentPerfume]);

  if (!currentPerfume || similarPerfumes.length === 0) {
    return null;
  }

  return (
    <div style={containerStyle}>
      <h3 style={titleStyle}>You Might Also Like</h3>
      <p style={subtitleStyle}>Based on similar scent profiles</p>
      
      <div style={scrollContainerStyle}>
        <div style={perfumesGridStyle}>
          {similarPerfumes.map((perfume) => {
            const explanations = getSimilarityExplanation(perfume.similarityBreakdown);
            
            return (
              <div
                key={perfume.id}
                style={perfumeCardStyle}
                onClick={() => onSelectPerfume(perfume)}
              >
                {/* Similarity Badge */}
                <div style={similarityBadgeStyle}>
                  {perfume.similarityPercentage}% Similar
                </div>
                
                <div style={imageContainerStyle}>
                  <img
                    src={perfume.image}
                    alt={perfume.name}
                    style={imageStyle}
                  />
                </div>
                
                <div style={infoStyle}>
                  <p style={brandStyle}>{perfume.brand}</p>
                  <h4 style={nameStyle}>{perfume.name}</h4>
                  <p style={categoryStyle}>{perfume.category}</p>
                  <p style={priceStyle}>£{perfume.price}</p>
                  
                  {/* Similarity Reasons */}
                  {explanations.length > 0 && (
                    <div style={reasonsContainerStyle}>
                      {explanations.slice(0, 2).map((reason, index) => (
                        <span key={index} style={reasonTagStyle}>
                          {reason}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                
                <button style={viewButtonStyle}>
                  View
                </button>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Shared Notes Preview */}
      {similarPerfumes[0]?.similarityBreakdown?.sharedNotes?.length > 0 && (
        <div style={sharedNotesContainerStyle}>
          <span style={sharedNotesLabelStyle}>Common notes:</span>
          <div style={sharedNotesListStyle}>
            {similarPerfumes[0].similarityBreakdown.sharedNotes.slice(0, 5).map((note, index) => (
              <span key={index} style={noteTagStyle}>{note}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Styles
const containerStyle = {
  marginTop: "30px",
  paddingTop: "30px",
  borderTop: "1px solid #e5e7eb"
};

const titleStyle = {
  fontSize: "1.2rem",
  fontWeight: "700",
  color: "#111827",
  marginBottom: "6px"
};

const subtitleStyle = {
  fontSize: "0.9rem",
  color: "#6b7280",
  marginBottom: "20px"
};

const scrollContainerStyle = {
  overflowX: "auto",
  marginLeft: "-10px",
  marginRight: "-10px",
  paddingLeft: "10px",
  paddingRight: "10px"
};

const perfumesGridStyle = {
  display: "flex",
  gap: "16px",
  paddingBottom: "10px"
};

const perfumeCardStyle = {
  minWidth: "180px",
  maxWidth: "180px",
  backgroundColor: "#f9fafb",
  borderRadius: "14px",
  overflow: "hidden",
  cursor: "pointer",
  transition: "transform 0.2s ease, box-shadow 0.2s ease",
  position: "relative"
};

const similarityBadgeStyle = {
  position: "absolute",
  top: "8px",
  right: "8px",
  backgroundColor: "#111827",
  color: "white",
  padding: "4px 10px",
  borderRadius: "12px",
  fontSize: "0.7rem",
  fontWeight: "600",
  zIndex: 2
};

const imageContainerStyle = {
  width: "100%",
  height: "140px",
  overflow: "hidden"
};

const imageStyle = {
  width: "100%",
  height: "100%",
  objectFit: "cover"
};

const infoStyle = {
  padding: "14px"
};

const brandStyle = {
  fontSize: "0.7rem",
  color: "#6b7280",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
  marginBottom: "4px"
};

const nameStyle = {
  fontSize: "0.95rem",
  fontWeight: "600",
  color: "#111827",
  marginBottom: "4px",
  lineHeight: "1.3"
};

const categoryStyle = {
  fontSize: "0.75rem",
  color: "#f43f5e",
  fontWeight: "600",
  marginBottom: "6px"
};

const priceStyle = {
  fontSize: "1rem",
  fontWeight: "700",
  color: "#111827",
  marginBottom: "10px"
};

const reasonsContainerStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "4px",
  marginBottom: "10px"
};

const reasonTagStyle = {
  fontSize: "0.7rem",
  color: "#4b5563",
  backgroundColor: "#e5e7eb",
  padding: "3px 8px",
  borderRadius: "8px",
  display: "inline-block"
};

const viewButtonStyle = {
  width: "calc(100% - 28px)",
  margin: "0 14px 14px",
  padding: "10px",
  backgroundColor: "#111827",
  color: "white",
  border: "none",
  borderRadius: "8px",
  fontSize: "0.85rem",
  fontWeight: "600",
  cursor: "pointer",
  transition: "background-color 0.2s ease"
};

const sharedNotesContainerStyle = {
  marginTop: "20px",
  display: "flex",
  alignItems: "center",
  flexWrap: "wrap",
  gap: "10px"
};

const sharedNotesLabelStyle = {
  fontSize: "0.85rem",
  color: "#6b7280",
  fontWeight: "500"
};

const sharedNotesListStyle = {
  display: "flex",
  flexWrap: "wrap",
  gap: "8px"
};

const noteTagStyle = {
  padding: "4px 12px",
  backgroundColor: "#fef2f2",
  color: "#f43f5e",
  borderRadius: "12px",
  fontSize: "0.8rem",
  fontWeight: "500",
  textTransform: "capitalize"
};

export default SimilarPerfumes;
