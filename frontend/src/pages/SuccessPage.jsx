// ============================================================
// SuccessPage.jsx - Registration Success Confirmation
// Biometric Attendance System - Cinematic Design
// ============================================================

import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const SuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(null);
  const [showContent, setShowContent] = useState(false);
  const [showFlash, setShowFlash] = useState(true);

  useEffect(() => {
    // Get user data from navigation state or localStorage
    const stateUser = location.state?.user;
    const storedUser = localStorage.getItem("registeredUser");

    if (stateUser) {
      setUser(stateUser);
    } else if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse stored user:", e);
      }
    }

    // Green flash effect on success
    setTimeout(() => setShowFlash(false), 300);

    // Trigger content animation after icon animation
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 800);

    return () => clearTimeout(timer);
  }, [location.state]);

  // Handle navigation
  const handleMarkAttendance = () => {
    navigate("/scan");
  };

  const handleRegisterAnother = () => {
    localStorage.removeItem("registeredUser");
    navigate("/register");
  };

  // Format registration date
  const formatDate = (isoString) => {
    if (!isoString) return "Just now";
    const date = new Date(isoString);
    return date.toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div style={styles.pageWrapper}>
      {/* Green Flash Effect */}
      {showFlash && <div style={styles.flashOverlay} />}

      {/* Background Effects */}
      <div style={styles.bgGlow1} />
      <div style={styles.bgGlow2} />

      <div style={styles.container}>
        {/* Animated Success Icon */}
        <div style={styles.iconContainer}>
          <svg viewBox="0 0 100 100" style={styles.successSvg}>
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="var(--color-success)"
              strokeWidth="3"
              style={styles.successCircle}
            />
            <polyline
              points="30,50 45,65 70,35"
              fill="none"
              stroke="var(--color-success)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={styles.successCheck}
            />
          </svg>
        </div>

        {/* Content (animated in) */}
        <div
          style={{
            ...styles.content,
            opacity: showContent ? 1 : 0,
            transform: showContent ? "translateY(0)" : "translateY(30px)",
          }}
        >
          <h1 style={styles.title}>ENROLLMENT COMPLETE</h1>
          <p style={styles.subtitle}>
            Your biometric profile has been successfully created
          </p>

          {/* User Card */}
          {user && (
            <div style={styles.userCard}>
              <div style={styles.userHeader}>
                <div style={styles.avatar}>
                  {user.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("") || "U"}
                </div>
                <div style={styles.userDetails}>
                  <h3 style={styles.userName}>{user.name || "User"}</h3>
                  <p style={styles.userDepartment}>
                    {user.department || "Department"}
                  </p>
                </div>
              </div>

              <div style={styles.infoGrid}>
                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}>USER ID</span>
                  <span style={styles.infoValueAccent}>
                    {user.id || "USR-XXXX"}
                  </span>
                </div>
                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}>EMPLOYEE ID</span>
                  <span style={styles.infoValue}>
                    {user.employeeId || "EMP-XXX"}
                  </span>
                </div>
                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}>REGISTERED</span>
                  <span style={styles.infoValue}>
                    {formatDate(user.registeredAt)}
                  </span>
                </div>
                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}>STATUS</span>
                  <span style={styles.statusBadge}>● ACTIVE</span>
                </div>
              </div>

              {/* Security Note */}
              <div style={styles.securityNote}>
                <span style={styles.lockIcon}>🔒</span>
                <span>Face embedding stored securely. No video retained.</span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div style={styles.actions}>
            <button
              style={styles.primaryButton}
              onClick={handleMarkAttendance}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 0 30px rgba(0,255,136,0.4)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "none";
              }}
            >
              GO TO ATTENDANCE
            </button>
            <button
              style={styles.secondaryButton}
              onClick={handleRegisterAnother}
              onMouseEnter={(e) => {
                e.target.style.background = "var(--color-accent-primary)";
                e.target.style.color = "#000";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "transparent";
                e.target.style.color = "var(--color-accent-primary)";
              }}
            >
              REGISTER ANOTHER
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  pageWrapper: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 20px",
    position: "relative",
    overflow: "hidden",
  },
  flashOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,255,136,0.3)",
    zIndex: 100,
    animation: "fadeOut 0.3s ease forwards",
  },
  bgGlow1: {
    position: "absolute",
    top: "20%",
    left: "-10%",
    width: "400px",
    height: "400px",
    background:
      "radial-gradient(circle, rgba(0,255,136,0.1) 0%, transparent 70%)",
    filter: "blur(60px)",
    pointerEvents: "none",
  },
  bgGlow2: {
    position: "absolute",
    bottom: "10%",
    right: "-5%",
    width: "350px",
    height: "350px",
    background:
      "radial-gradient(circle, rgba(0,245,255,0.1) 0%, transparent 70%)",
    filter: "blur(80px)",
    pointerEvents: "none",
  },
  container: {
    maxWidth: "520px",
    width: "100%",
    textAlign: "center",
    position: "relative",
    zIndex: 1,
  },
  iconContainer: {
    width: "140px",
    height: "140px",
    margin: "0 auto 32px",
  },
  successSvg: {
    width: "100%",
    height: "100%",
    filter: "drop-shadow(0 0 20px rgba(0,255,136,0.5))",
  },
  successCircle: {
    strokeDasharray: 314,
    strokeDashoffset: 314,
    animation: "circleFill 0.6s ease forwards",
  },
  successCheck: {
    strokeDasharray: 100,
    strokeDashoffset: 100,
    animation: "checkmark 0.4s ease forwards 0.4s",
  },
  content: {
    transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
  },
  title: {
    fontFamily: "var(--font-display)",
    fontSize: "32px",
    fontWeight: 800,
    color: "var(--color-success)",
    marginBottom: "8px",
    letterSpacing: "0.05em",
  },
  subtitle: {
    fontFamily: "var(--font-primary)",
    color: "var(--color-text-secondary)",
    fontSize: "16px",
    marginBottom: "40px",
  },
  userCard: {
    background: "rgba(255,255,255,0.03)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(0,255,136,0.2)",
    borderRadius: "16px",
    padding: "28px",
    textAlign: "left",
    marginBottom: "32px",
  },
  userHeader: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    marginBottom: "24px",
    paddingBottom: "20px",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
  },
  avatar: {
    width: "64px",
    height: "64px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, var(--color-success), #00cc6a)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "var(--font-display)",
    fontSize: "22px",
    fontWeight: 700,
    color: "#000",
    boxShadow: "0 0 30px rgba(0,255,136,0.3)",
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontFamily: "var(--font-display)",
    fontSize: "22px",
    fontWeight: 700,
    color: "var(--color-text-primary)",
    margin: 0,
    marginBottom: "4px",
  },
  userDepartment: {
    fontFamily: "var(--font-primary)",
    color: "var(--color-text-muted)",
    margin: 0,
    fontSize: "14px",
  },
  infoGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
  },
  infoItem: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  infoLabel: {
    fontFamily: "var(--font-mono)",
    fontSize: "10px",
    color: "var(--color-text-muted)",
    letterSpacing: "0.1em",
  },
  infoValue: {
    fontFamily: "var(--font-mono)",
    fontSize: "14px",
    color: "var(--color-text-primary)",
  },
  infoValueAccent: {
    fontFamily: "var(--font-mono)",
    fontSize: "14px",
    color: "var(--color-accent-primary)",
    fontWeight: 600,
  },
  statusBadge: {
    fontFamily: "var(--font-mono)",
    fontSize: "12px",
    color: "var(--color-success)",
    fontWeight: 600,
  },
  securityNote: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginTop: "20px",
    padding: "12px",
    background: "rgba(0,255,136,0.05)",
    borderRadius: "8px",
    fontFamily: "var(--font-primary)",
    fontSize: "12px",
    color: "var(--color-text-muted)",
  },
  lockIcon: {
    fontSize: "14px",
  },
  actions: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  primaryButton: {
    width: "100%",
    padding: "18px 32px",
    background: "var(--color-success)",
    border: "none",
    borderRadius: "8px",
    fontFamily: "var(--font-display)",
    fontSize: "14px",
    fontWeight: 600,
    color: "#000",
    cursor: "pointer",
    transition: "all 300ms ease",
    letterSpacing: "0.1em",
  },
  secondaryButton: {
    width: "100%",
    padding: "16px 32px",
    background: "transparent",
    border: "2px solid var(--color-accent-primary)",
    borderRadius: "8px",
    fontFamily: "var(--font-display)",
    fontSize: "14px",
    fontWeight: 600,
    color: "var(--color-accent-primary)",
    cursor: "pointer",
    transition: "all 300ms ease",
    letterSpacing: "0.1em",
  },
};

export default SuccessPage;
