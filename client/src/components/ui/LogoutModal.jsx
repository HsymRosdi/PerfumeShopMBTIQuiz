const LogoutModal = ({ onConfirm, onCancel }) => {
  return (
    <div style={overlayStyle} onClick={onCancel}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <div style={iconStyle}>👋</div>
        <h2 style={titleStyle}>Leaving so soon?</h2>
        <p style={descStyle}>Are you sure you want to log out?</p>
        <div style={btnsStyle}>
          <button onClick={onCancel} style={cancelBtnStyle}>
            Stay
          </button>
          <button onClick={onConfirm} style={logoutBtnStyle}>
            Yes, Log Out
          </button>
        </div>
      </div>
    </div>
  );
};

const overlayStyle = { position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: "20px" };
const modalStyle = { backgroundColor: "white", borderRadius: "24px", padding: "48px 40px", maxWidth: "400px", width: "100%", textAlign: "center", boxShadow: "0 20px 60px rgba(0,0,0,0.2)", animation: "fadeInUp 0.25s ease" };
const iconStyle = { fontSize: "3rem", marginBottom: "16px" };
const titleStyle = { fontFamily: "'Playfair Display', serif", fontSize: "1.6rem", fontWeight: "700", color: "#111827", marginBottom: "10px" };
const descStyle = { color: "#6b7280", fontSize: "0.95rem", marginBottom: "32px", lineHeight: "1.6" };
const btnsStyle = { display: "flex", gap: "12px", justifyContent: "center" };
const cancelBtnStyle = { padding: "13px 32px", border: "1.5px solid #e5e7eb", borderRadius: "12px", backgroundColor: "white", color: "#374151", fontWeight: "600", cursor: "pointer", fontSize: "0.95rem", flex: 1 };
const logoutBtnStyle = { padding: "13px 32px", border: "none", borderRadius: "12px", backgroundColor: "#111827", color: "white", fontWeight: "700", cursor: "pointer", fontSize: "0.95rem", flex: 1 };

export default LogoutModal;