// ============================================================
// LandingPage.jsx - Cinematic Hero Landing
// Biometric Attendance System
// ============================================================

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();
  const [recentEvents, setRecentEvents] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Mock recent attendance events for ticker
  useEffect(() => {
    const events = [
      { name: "ZARA AHMED", time: "09:42:13" },
      { name: "MARCUS CHEN", time: "09:38:27" },
      { name: "AISHA PATEL", time: "09:35:41" },
      { name: "DEV NAIR", time: "09:31:15" },
      { name: "LAYLA HASSAN", time: "09:28:03" },
    ];
    setRecentEvents(events);
  }, []);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <div style={styles.container}>
      {/* Floating Hexagons Background */}
      <div style={styles.hexContainer}>
        {[...Array(6)].map((_, i) => (
          <div key={i} style={{ ...styles.hexagon, ...hexPositions[i] }} />
        ))}
      </div>

      {/* Ambient Glow Effects */}
      <div style={styles.glowCyan} />
      <div style={styles.glowBlue} />
      <div style={styles.glowPurple} />

      {/* Navigation Bar */}
      <nav style={styles.navbar}>
        <div style={styles.navContent}>
          <div style={styles.logo}>
            <span style={styles.logoIcon}>⬡</span>
            <span style={styles.logoText}>BIOMETRIC OS</span>
            <span style={styles.logoVersion}>v2.4</span>
          </div>
          <div style={styles.systemStatus}>
            <span style={styles.statusDot} />
            <span style={styles.statusText}>SYSTEM ONLINE</span>
            <span style={styles.timeDisplay}>{formatTime(currentTime)}</span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main style={styles.hero}>
        <div style={styles.heroContent}>
          {/* Main Headline */}
          <h1 style={styles.headline}>
            IDENTITY<span style={styles.headlineAccent}> VERIFIED.</span>
          </h1>
          <h2 style={styles.subheadline}>
            ATTENDANCE <span style={styles.accentText}>AUTOMATED.</span>
          </h2>

          {/* Description */}
          <p style={styles.description}>
            Next-generation biometric enrollment and recognition.
            <br />
            Wave to register. Look to attend.
          </p>

          {/* CTA Buttons */}
          <div style={styles.ctaContainer}>
            <button
              style={styles.btnOutline}
              onClick={() => navigate("/register")}
              onMouseEnter={(e) => {
                e.target.style.background = "var(--color-accent-primary)";
                e.target.style.color = "#000";
                e.target.style.boxShadow = "0 0 30px rgba(0,245,255,0.4)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "transparent";
                e.target.style.color = "var(--color-accent-primary)";
                e.target.style.boxShadow = "none";
              }}
            >
              REGISTER
            </button>
            <button
              style={styles.btnSolid}
              onClick={() => navigate("/scan")}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.filter = "brightness(1.1)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.filter = "brightness(1)";
              }}
            >
              MARK ATTENDANCE
            </button>
          </div>

          {/* Admin Link */}
          <button style={styles.adminLink} onClick={() => navigate("/admin")}>
            Admin Dashboard →
          </button>
        </div>

        {/* Biometric Visual Element */}
        <div style={styles.visualContainer}>
          <div style={styles.biometricRing}>
            <div style={styles.ringOuter} />
            <div style={styles.ringMiddle} />
            <div style={styles.ringInner} />
            <div style={styles.ringCore}>
              <svg viewBox="0 0 100 100" style={styles.eyeIcon}>
                <circle
                  cx="50"
                  cy="50"
                  r="30"
                  fill="none"
                  stroke="var(--color-accent-primary)"
                  strokeWidth="1"
                  opacity="0.3"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="20"
                  fill="none"
                  stroke="var(--color-accent-primary)"
                  strokeWidth="1.5"
                  opacity="0.6"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="10"
                  fill="var(--color-accent-primary)"
                  opacity="0.8"
                />
                <circle cx="50" cy="50" r="4" fill="#050810" />
              </svg>
            </div>
            <div style={styles.scanlineVertical} />
          </div>
        </div>
      </main>

      {/* Recent Events Ticker */}
      <div style={styles.tickerContainer}>
        <div style={styles.tickerContent}>
          {[...recentEvents, ...recentEvents].map((event, i) => (
            <span key={i} style={styles.tickerItem}>
              <span style={styles.tickerDot}>●</span>
              {event.name} — VERIFIED {event.time}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

// Hexagon positions for background
const hexPositions = [
  { top: "10%", left: "5%", animationDelay: "0s", opacity: 0.1 },
  { top: "60%", left: "10%", animationDelay: "2s", opacity: 0.08 },
  { top: "20%", right: "15%", animationDelay: "1s", opacity: 0.12 },
  { top: "70%", right: "5%", animationDelay: "3s", opacity: 0.06 },
  { top: "40%", left: "50%", animationDelay: "1.5s", opacity: 0.05 },
  { bottom: "20%", left: "30%", animationDelay: "2.5s", opacity: 0.07 },
];

const styles = {
  container: {
    minHeight: "100vh",
    position: "relative",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  },

  // Hexagon Background
  hexContainer: {
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
    zIndex: 0,
  },
  hexagon: {
    position: "absolute",
    width: "120px",
    height: "140px",
    background:
      "linear-gradient(135deg, rgba(0,245,255,0.1) 0%, transparent 50%)",
    clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
    animation: "hexDrift 20s ease-in-out infinite",
  },

  // Ambient Glows
  glowCyan: {
    position: "absolute",
    top: "20%",
    left: "-10%",
    width: "400px",
    height: "400px",
    background:
      "radial-gradient(circle, rgba(0,245,255,0.15) 0%, transparent 70%)",
    filter: "blur(60px)",
    pointerEvents: "none",
  },
  glowBlue: {
    position: "absolute",
    top: "50%",
    right: "-5%",
    width: "350px",
    height: "350px",
    background:
      "radial-gradient(circle, rgba(0,150,199,0.2) 0%, transparent 70%)",
    filter: "blur(80px)",
    pointerEvents: "none",
  },
  glowPurple: {
    position: "absolute",
    bottom: "10%",
    left: "30%",
    width: "300px",
    height: "300px",
    background:
      "radial-gradient(circle, rgba(100,50,150,0.1) 0%, transparent 70%)",
    filter: "blur(100px)",
    pointerEvents: "none",
  },

  // Navbar
  navbar: {
    position: "relative",
    zIndex: 10,
    padding: "20px 40px",
    borderBottom: "1px solid rgba(0,245,255,0.15)",
    backdropFilter: "blur(10px)",
    background: "rgba(5,8,16,0.5)",
  },
  navContent: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    maxWidth: "1400px",
    margin: "0 auto",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  logoIcon: {
    fontSize: "28px",
    color: "var(--color-accent-primary)",
    filter: "drop-shadow(0 0 10px rgba(0,245,255,0.5))",
  },
  logoText: {
    fontFamily: "var(--font-display)",
    fontSize: "18px",
    fontWeight: 700,
    color: "var(--color-text-primary)",
    letterSpacing: "0.1em",
  },
  logoVersion: {
    fontFamily: "var(--font-mono)",
    fontSize: "11px",
    color: "var(--color-text-muted)",
    background: "rgba(0,245,255,0.1)",
    padding: "2px 8px",
    borderRadius: "4px",
  },
  systemStatus: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  statusDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    background: "var(--color-success)",
    animation: "statusPulse 2s infinite",
  },
  statusText: {
    fontFamily: "var(--font-mono)",
    fontSize: "12px",
    color: "var(--color-success)",
    letterSpacing: "0.05em",
  },
  timeDisplay: {
    fontFamily: "var(--font-mono)",
    fontSize: "12px",
    color: "var(--color-text-muted)",
    marginLeft: "8px",
    animation: "textFlicker 4s infinite",
  },

  // Hero
  hero: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "60px 80px",
    maxWidth: "1400px",
    margin: "0 auto",
    width: "100%",
    position: "relative",
    zIndex: 1,
  },
  heroContent: {
    maxWidth: "600px",
  },
  headline: {
    fontFamily: "var(--font-display)",
    fontSize: "clamp(48px, 8vw, 96px)",
    fontWeight: 800,
    color: "var(--color-text-primary)",
    lineHeight: 1,
    marginBottom: "8px",
  },
  headlineAccent: {
    display: "block",
  },
  subheadline: {
    fontFamily: "var(--font-display)",
    fontSize: "clamp(24px, 4vw, 40px)",
    fontWeight: 600,
    color: "var(--color-text-secondary)",
    marginBottom: "32px",
  },
  accentText: {
    color: "var(--color-accent-primary)",
  },
  description: {
    fontFamily: "var(--font-primary)",
    fontSize: "18px",
    color: "rgba(240,244,255,0.6)",
    lineHeight: 1.7,
    marginBottom: "48px",
  },

  // CTA Buttons
  ctaContainer: {
    display: "flex",
    gap: "20px",
    marginBottom: "32px",
  },
  btnOutline: {
    fontFamily: "var(--font-display)",
    fontSize: "16px",
    fontWeight: 600,
    padding: "18px 40px",
    background: "transparent",
    color: "var(--color-accent-primary)",
    border: "2px solid var(--color-accent-primary)",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 400ms ease",
    letterSpacing: "0.1em",
  },
  btnSolid: {
    fontFamily: "var(--font-display)",
    fontSize: "16px",
    fontWeight: 600,
    padding: "18px 40px",
    background: "var(--color-warning)",
    color: "#000",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 300ms ease",
    letterSpacing: "0.1em",
  },
  adminLink: {
    fontFamily: "var(--font-primary)",
    fontSize: "14px",
    color: "var(--color-text-muted)",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    padding: "0",
    transition: "color 200ms ease",
  },

  // Visual Element
  visualContainer: {
    position: "relative",
    width: "400px",
    height: "400px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  biometricRing: {
    position: "relative",
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  ringOuter: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: "50%",
    border: "1px solid rgba(0,245,255,0.2)",
    animation: "orbitalSpin 20s linear infinite",
  },
  ringMiddle: {
    position: "absolute",
    width: "75%",
    height: "75%",
    borderRadius: "50%",
    border: "2px solid rgba(0,245,255,0.3)",
    animation: "orbitalSpin 15s linear infinite reverse",
  },
  ringInner: {
    position: "absolute",
    width: "50%",
    height: "50%",
    borderRadius: "50%",
    border: "2px solid rgba(0,245,255,0.5)",
    animation: "viewfinderPulse 2s ease-in-out infinite",
  },
  ringCore: {
    position: "absolute",
    width: "120px",
    height: "120px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  eyeIcon: {
    width: "100%",
    height: "100%",
  },
  scanlineVertical: {
    position: "absolute",
    width: "2px",
    height: "100%",
    background:
      "linear-gradient(to bottom, transparent, var(--color-accent-primary), transparent)",
    opacity: 0.3,
    animation: "scan 3s linear infinite",
  },

  // Ticker
  tickerContainer: {
    position: "relative",
    zIndex: 10,
    padding: "12px 0",
    background: "rgba(0,245,255,0.03)",
    borderTop: "1px solid rgba(0,245,255,0.1)",
    overflow: "hidden",
  },
  tickerContent: {
    display: "flex",
    gap: "60px",
    whiteSpace: "nowrap",
    animation: "tickerScroll 30s linear infinite",
  },
  tickerItem: {
    fontFamily: "var(--font-mono)",
    fontSize: "12px",
    color: "rgba(0,245,255,0.6)",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  tickerDot: {
    color: "var(--color-success)",
    fontSize: "8px",
  },
};

export default LandingPage;
