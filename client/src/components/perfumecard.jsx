const PerfumeCard = ({ perfume }) => {
  return (
    <div
      style={{
        backgroundColor: "white",
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
        transition: "0.3s ease",
      }}
    >
      <img
        src={perfume.image}
        alt={perfume.name}
        style={{
          width: "100%",
          height: "250px",
          objectFit: "cover",
        }}
      />

      <div style={{ padding: "18px" }}>
        <p
          style={{
            color: "#f43f5e",
            fontWeight: "700",
            marginBottom: "8px",
            fontSize: "0.9rem",
          }}
        >
          {perfume.gender}
        </p>

        <h3 style={{ margin: "0 0 8px", fontSize: "1.2rem" }}>
          {perfume.name}
        </h3>

        <p style={{ color: "#6b7280", margin: "0 0 10px" }}>
          {perfume.brand}
        </p>

        <p style={{ color: "#6b7280", margin: "0 0 10px" }}>
          {perfume.category}
        </p>

        <p style={{ fontWeight: "700", marginBottom: "14px" }}>
          £{perfume.price}
        </p>

        <button
          style={{
            width: "100%",
            padding: "10px",
            border: "none",
            borderRadius: "10px",
            backgroundColor: "#111827",
            color: "white",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default PerfumeCard;