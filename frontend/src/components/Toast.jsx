// ============================================================
// Toast.jsx - Global Toast Notification System
// Biometric Attendance System - Cinematic Design
// Slides in from right, auto-dismisses after 4s
// Types: success, error, warning, info
// ============================================================

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

// Toast Context
const ToastContext = createContext(null);

// Toast Provider Component
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "info", duration = 4000) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type, duration }]);
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Convenience methods
  const toast = {
    success: (message, duration) => addToast(message, "success", duration),
    error: (message, duration) => addToast(message, "error", duration),
    warning: (message, duration) => addToast(message, "warning", duration),
    info: (message, duration) => addToast(message, "info", duration),
  };

  return (
    <ToastContext.Provider value={{ toast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

// Toast Container - Renders all active toasts
const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div style={styles.container}>
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={removeToast} />
      ))}
    </div>
  );
};

// Individual Toast Item
const ToastItem = ({ toast, onClose }) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => onClose(toast.id), 300);
    }, toast.duration);

    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onClose]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => onClose(toast.id), 300);
  };

  const getTypeStyles = () => {
    switch (toast.type) {
      case "success":
        return {
          borderColor: "var(--color-success)",
          iconColor: "var(--color-success)",
          glowColor: "rgba(0,255,136,0.15)",
          icon: "✓",
        };
      case "error":
        return {
          borderColor: "var(--color-error)",
          iconColor: "var(--color-error)",
          glowColor: "rgba(255,45,85,0.15)",
          icon: "✕",
        };
      case "warning":
        return {
          borderColor: "var(--color-warning)",
          iconColor: "var(--color-warning)",
          glowColor: "rgba(255,184,0,0.15)",
          icon: "⚠",
        };
      case "info":
      default:
        return {
          borderColor: "var(--color-accent-primary)",
          iconColor: "var(--color-accent-primary)",
          glowColor: "rgba(0,245,255,0.15)",
          icon: "ℹ",
        };
    }
  };

  const typeStyles = getTypeStyles();

  return (
    <div
      style={{
        ...styles.toast,
        borderLeft: `3px solid ${typeStyles.borderColor}`,
        boxShadow: `0 4px 24px rgba(0,0,0,0.4), inset 0 0 30px ${typeStyles.glowColor}`,
        animation: isExiting
          ? "slideOutRight 0.3s ease forwards"
          : "slideInRight 0.3s ease forwards",
      }}
    >
      <span
        style={{
          ...styles.icon,
          color: typeStyles.iconColor,
        }}
      >
        {typeStyles.icon}
      </span>
      <span style={styles.message}>{toast.message}</span>
      <button
        onClick={handleClose}
        style={styles.closeButton}
        onMouseEnter={(e) =>
          (e.target.style.color = "var(--color-text-primary)")
        }
        onMouseLeave={(e) => (e.target.style.color = "var(--color-text-muted)")}
      >
        ×
      </button>
    </div>
  );
};

// Custom Hook for using toast
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context.toast;
};

// Styles
const styles = {
  container: {
    position: "fixed",
    top: "20px",
    right: "20px",
    zIndex: 9999,
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    pointerEvents: "none",
  },
  toast: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "14px 16px",
    minWidth: "320px",
    maxWidth: "420px",
    background: "rgba(10, 14, 26, 0.95)",
    backdropFilter: "blur(20px)",
    borderRadius: "8px",
    pointerEvents: "auto",
  },
  icon: {
    fontSize: "16px",
    fontWeight: 700,
    flexShrink: 0,
    width: "24px",
    height: "24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    background: "rgba(255,255,255,0.05)",
  },
  message: {
    flex: 1,
    fontFamily: "var(--font-primary)",
    fontSize: "14px",
    color: "var(--color-text-primary)",
    lineHeight: 1.4,
  },
  closeButton: {
    background: "none",
    border: "none",
    color: "var(--color-text-muted)",
    fontSize: "20px",
    cursor: "pointer",
    padding: "4px",
    lineHeight: 1,
    transition: "color 200ms ease",
    flexShrink: 0,
  },
};

export default ToastProvider;
