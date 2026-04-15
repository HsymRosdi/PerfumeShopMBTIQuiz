import { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, duration = 3000) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast Container — bottom center */}
      <div style={containerStyle}>
        {toasts.map(toast => (
          <div key={toast.id} style={toastStyle}>
            <span style={iconStyle}>🛒</span>
            <span style={messageStyle}>{toast.message}</span>
            <span style={checkStyle}>✓</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

const containerStyle = {
  position: "fixed",
  bottom: "32px",
  left: "50%",
  transform: "translateX(-50%)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "10px",
  zIndex: 9999,
  pointerEvents: "none",
};

const toastStyle = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  padding: "14px 24px",
  background: "linear-gradient(135deg, #1a1208, #0a0a0a)",
  border: "1px solid rgba(201,168,76,0.4)",
  borderRadius: "50px",
  boxShadow: "0 8px 32px rgba(0,0,0,0.3), 0 0 0 1px rgba(201,168,76,0.1)",
  animation: "toastIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)",
  fontFamily: "'Inter', sans-serif",
};

const iconStyle = {
  fontSize: "16px",
};

const messageStyle = {
  color: "#e8c97a",
  fontSize: "0.9rem",
  fontWeight: "600",
  whiteSpace: "nowrap",
  letterSpacing: "0.2px",
};

const checkStyle = {
  color: "#c9a84c",
  fontSize: "0.85rem",
  fontWeight: "700",
  marginLeft: "4px",
};