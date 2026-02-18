// ============================================================
// ScanPage.jsx - Face Recognition Attendance
// Biometric Attendance System - Cinematic Dark Futurism
// ============================================================

import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getRecentAttendance, recognizeUser } from "../api/mockAPI";

const ScanPage = () => {
  const navigate = useNavigate();

  // Camera state
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState(null);

  // Recognition state machine: idle | scanning | detected | verifying | matched | mismatch
  const [status, setStatus] = useState("idle");
  const [scanResult, setScanResult] = useState(null);
  const [scanError, setScanError] = useState(null);

  // Live datetime
  const [dateTime, setDateTime] = useState(new Date());

  // Recent attendance log
  const [recentLog, setRecentLog] = useState([]);

  // Refs
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Update datetime every second
  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Load recent attendance
  useEffect(() => {
    getRecentAttendance().then((data) => setRecentLog(data.slice(0, 5)));
  }, [scanResult]);

  // Initialize camera
  const initializeCamera = useCallback(async () => {
    try {
      setCameraError(null);
      setCameraReady(false);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user",
        },
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          setCameraReady(true);
        };
      }
    } catch (err) {
      console.error("Camera access error:", err);
      if (err.name === "NotAllowedError") {
        setCameraError("CAMERA ACCESS DENIED");
      } else if (err.name === "NotFoundError") {
        setCameraError("NO CAMERA DETECTED");
      } else {
        setCameraError("CAMERA INITIALIZATION FAILED");
      }
    }
  }, []);

  // Cleanup camera
  const cleanupCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, []);

  useEffect(() => {
    initializeCamera();
    return cleanupCamera;
  }, [initializeCamera, cleanupCamera]);

  // Handle face scan with state machine
  const handleScanFace = async () => {
    setStatus("scanning");
    setScanResult(null);
    setScanError(null);

    try {
      // Simulate face detection delay
      await new Promise((r) => setTimeout(r, 800));
      setStatus("detected");

      // Simulate verification
      await new Promise((r) => setTimeout(r, 600));
      setStatus("verifying");

      // Capture frame
      const canvas = document.createElement("canvas");
      canvas.width = 1280;
      canvas.height = 720;
      const ctx = canvas.getContext("2d");

      if (videoRef.current) {
        ctx.drawImage(videoRef.current, 0, 0, 1280, 720);
      }

      const blob = await new Promise((resolve) => {
        canvas.toBlob(resolve, "image/jpeg", 0.9);
      });

      const result = await recognizeUser(blob);

      if (result.success) {
        setStatus("matched");
        setScanResult(result);
      } else {
        setStatus("mismatch");
        setScanError(result.message);
      }
    } catch (err) {
      console.error("Scan error:", err);
      setStatus("mismatch");
      setScanError("RECOGNITION SYSTEM ERROR");
    }
  };

  // Reset to idle
  const handleReset = () => {
    setStatus("idle");
    setScanResult(null);
    setScanError(null);
  };

  // Get status config
  const getStatusConfig = () => {
    const configs = {
      idle: {
        label: "AWAITING SCAN",
        color: "var(--color-text-muted)",
        icon: "◇",
      },
      scanning: { label: "SCANNING...", color: "var(--color-cyan)", icon: "◈" },
      detected: {
        label: "FACE DETECTED",
        color: "var(--color-cyan)",
        icon: "◉",
      },
      verifying: {
        label: "VERIFYING IDENTITY",
        color: "var(--color-warning)",
        icon: "⟳",
      },
      matched: {
        label: "IDENTITY VERIFIED",
        color: "var(--color-success)",
        icon: "✓",
      },
      mismatch: {
        label: "NOT RECOGNIZED",
        color: "var(--color-error)",
        icon: "✕",
      },
    };
    return configs[status] || configs.idle;
  };

  const statusConfig = getStatusConfig();

  return (
    <div style={styles.pageWrapper}>
      {/* Ambient Effects */}
      <div style={styles.ambientGlow} />

      <div style={styles.mainContainer}>
        {/* Left: Camera Section */}
        <div style={styles.cameraSection}>
          {/* Header with datetime */}
          <div style={styles.cameraHeader}>
            <div style={styles.systemLabel}>
              <span style={styles.hexIcon}>⬡</span>
              BIOMETRIC SCANNER
            </div>
            <div style={styles.liveDateTime}>
              <span style={styles.dateText}>
                {dateTime.toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
              </span>
              <span style={styles.timeText}>
                {dateTime.toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </span>
            </div>
          </div>

          {/* Camera Feed */}
          <div style={styles.cameraFrame}>
            {cameraError ? (
              <div style={styles.errorOverlay}>
                <div style={styles.errorIcon}>⚠</div>
                <div style={styles.errorText}>{cameraError}</div>
                <button style={styles.retryButton} onClick={initializeCamera}>
                  RETRY CONNECTION
                </button>
              </div>
            ) : (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  style={styles.video}
                />

                {/* Viewfinder Overlay */}
                <div style={styles.viewfinderOverlay}>
                  {/* Corner brackets */}
                  <div style={{ ...styles.corner, ...styles.cornerTL }} />
                  <div style={{ ...styles.corner, ...styles.cornerTR }} />
                  <div style={{ ...styles.corner, ...styles.cornerBL }} />
                  <div style={{ ...styles.corner, ...styles.cornerBR }} />

                  {/* Scanline */}
                  {(status === "scanning" ||
                    status === "detected" ||
                    status === "verifying") && <div style={styles.scanline} />}

                  {/* Face bounding box (appears on detection) */}
                  {(status === "detected" ||
                    status === "verifying" ||
                    status === "matched") && (
                    <div
                      style={{
                        ...styles.boundingBox,
                        borderColor:
                          status === "matched"
                            ? "var(--color-success)"
                            : "var(--color-cyan)",
                        boxShadow:
                          status === "matched"
                            ? "0 0 20px rgba(0, 255, 136, 0.4), inset 0 0 20px rgba(0, 255, 136, 0.1)"
                            : "0 0 20px rgba(0, 245, 255, 0.4), inset 0 0 20px rgba(0, 245, 255, 0.1)",
                      }}
                    />
                  )}

                  {/* Camera initializing */}
                  {!cameraReady && !cameraError && (
                    <div style={styles.initOverlay}>
                      <div style={styles.initSpinner} />
                      <div style={styles.initText}>INITIALIZING CAMERA</div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Status Bar */}
          <div style={{ ...styles.statusBar, borderColor: statusConfig.color }}>
            <span style={{ ...styles.statusIcon, color: statusConfig.color }}>
              {statusConfig.icon}
            </span>
            <span style={{ ...styles.statusLabel, color: statusConfig.color }}>
              {statusConfig.label}
            </span>
            {(status === "scanning" || status === "verifying") && (
              <div style={styles.statusDots}>
                <span style={{ ...styles.dot, animationDelay: "0s" }} />
                <span style={{ ...styles.dot, animationDelay: "0.2s" }} />
                <span style={{ ...styles.dot, animationDelay: "0.4s" }} />
              </div>
            )}
          </div>

          {/* Action Button */}
          <div style={styles.actionArea}>
            {status === "idle" && (
              <button
                style={styles.scanButton}
                onClick={handleScanFace}
                disabled={!cameraReady}
              >
                <span style={styles.scanButtonIcon}>⬡</span>
                INITIATE SCAN
              </button>
            )}
            {(status === "matched" || status === "mismatch") && (
              <button style={styles.resetButton} onClick={handleReset}>
                ↻ SCAN AGAIN
              </button>
            )}
          </div>
        </div>

        {/* Right: Info Panel */}
        <div style={styles.infoPanel}>
          {/* Recognition Result Card */}
          <div style={styles.resultCard}>
            <div style={styles.cardHeader}>
              <span style={styles.cardTitle}>RECOGNITION STATUS</span>
              <span
                style={{ ...styles.cardBadge, background: statusConfig.color }}
              >
                {status.toUpperCase()}
              </span>
            </div>

            {status === "matched" && scanResult && (
              <div style={styles.matchedContent}>
                <div style={styles.userAvatar}>
                  {scanResult.user.photo_placeholder}
                </div>
                <div style={styles.userDetails}>
                  <div style={styles.userName}>{scanResult.user.name}</div>
                  <div style={styles.userMeta}>
                    {scanResult.user.department}
                  </div>
                  <div style={styles.userId}>{scanResult.user.id}</div>
                </div>
                <div style={styles.confidenceBlock}>
                  <div style={styles.confidenceLabel}>MATCH CONFIDENCE</div>
                  <div style={styles.confidenceValue}>
                    {(scanResult.confidence * 100).toFixed(1)}%
                  </div>
                  <div style={styles.confidenceBar}>
                    <div
                      style={{
                        ...styles.confidenceFill,
                        width: `${scanResult.confidence * 100}%`,
                      }}
                    />
                  </div>
                </div>
                <div style={styles.timestampBlock}>
                  <span style={styles.timestampIcon}>◷</span>
                  <span style={styles.timestampText}>
                    {new Date(scanResult.timestamp).toLocaleString()}
                  </span>
                </div>
              </div>
            )}

            {status === "mismatch" && (
              <div style={styles.mismatchContent}>
                <div style={styles.mismatchIcon}>✕</div>
                <div style={styles.mismatchTitle}>IDENTITY NOT FOUND</div>
                <div style={styles.mismatchText}>
                  {scanError || "No matching profile in database"}
                </div>
                <button
                  style={styles.registerLink}
                  onClick={() => navigate("/register")}
                >
                  → REGISTER NEW PROFILE
                </button>
              </div>
            )}

            {(status === "idle" ||
              status === "scanning" ||
              status === "detected" ||
              status === "verifying") && (
              <div style={styles.idleContent}>
                <div style={styles.idleVisual}>
                  <div style={styles.idleRing} />
                  <div style={styles.idleCore}>
                    {status === "idle" ? "⬡" : "◈"}
                  </div>
                </div>
                <div style={styles.idleText}>
                  {status === "idle" &&
                    "Position face in frame and initiate scan"}
                  {status === "scanning" && "Detecting facial features..."}
                  {status === "detected" && "Face detected, analyzing..."}
                  {status === "verifying" && "Matching against database..."}
                </div>
                <div style={styles.idleTips}>
                  <div style={styles.tipItem}>◇ Ensure adequate lighting</div>
                  <div style={styles.tipItem}>◇ Face camera directly</div>
                  <div style={styles.tipItem}>◇ Remove obstructions</div>
                </div>
              </div>
            )}
          </div>

          {/* Recent Activity Log */}
          <div style={styles.logCard}>
            <div style={styles.cardHeader}>
              <span style={styles.cardTitle}>RECENT ACTIVITY</span>
              <span style={styles.logCount}>{recentLog.length} entries</span>
            </div>
            <div style={styles.logList}>
              {recentLog.map((entry, idx) => (
                <div
                  key={entry.id}
                  style={{
                    ...styles.logItem,
                    animationDelay: `${idx * 0.1}s`,
                  }}
                >
                  <div style={styles.logAvatar}>{entry.name.charAt(0)}</div>
                  <div style={styles.logInfo}>
                    <div style={styles.logName}>{entry.name}</div>
                    <div style={styles.logDept}>{entry.department}</div>
                  </div>
                  <div style={styles.logTime}>
                    {new Date(entry.timestamp).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              ))}
              {recentLog.length === 0 && (
                <div style={styles.emptyLog}>No recent activity</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  pageWrapper: {
    minHeight: "100vh",
    padding: "2rem",
    position: "relative",
    overflow: "hidden",
  },
  ambientGlow: {
    position: "fixed",
    top: "30%",
    left: "20%",
    width: "400px",
    height: "400px",
    background:
      "radial-gradient(circle, rgba(0, 245, 255, 0.08) 0%, transparent 70%)",
    borderRadius: "50%",
    pointerEvents: "none",
    filter: "blur(60px)",
  },
  mainContainer: {
    display: "grid",
    gridTemplateColumns: "1.2fr 1fr",
    gap: "2rem",
    maxWidth: "1400px",
    margin: "0 auto",
    position: "relative",
    zIndex: 1,
  },

  // Camera Section
  cameraSection: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  cameraHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 0.5rem",
  },
  systemLabel: {
    fontFamily: "var(--font-display)",
    fontSize: "0.875rem",
    fontWeight: "700",
    color: "var(--color-cyan)",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    letterSpacing: "0.1em",
  },
  hexIcon: {
    fontSize: "1.25rem",
  },
  liveDateTime: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    fontFamily: "var(--font-mono)",
  },
  dateText: {
    fontSize: "0.75rem",
    color: "var(--color-text-muted)",
    textTransform: "uppercase",
  },
  timeText: {
    fontSize: "1.25rem",
    color: "var(--color-cyan)",
    fontWeight: "600",
    animation: "textFlicker 4s infinite",
  },

  cameraFrame: {
    position: "relative",
    aspectRatio: "16/9",
    background: "rgba(0, 0, 0, 0.6)",
    borderRadius: "12px",
    overflow: "hidden",
    border: "1px solid rgba(0, 245, 255, 0.2)",
    boxShadow:
      "0 0 40px rgba(0, 245, 255, 0.1), inset 0 0 60px rgba(0, 0, 0, 0.5)",
  },
  video: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transform: "scaleX(-1)",
  },
  viewfinderOverlay: {
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
  },
  corner: {
    position: "absolute",
    width: "60px",
    height: "60px",
    border: "2px solid var(--color-cyan)",
    opacity: 0.8,
  },
  cornerTL: {
    top: "20px",
    left: "20px",
    borderRight: "none",
    borderBottom: "none",
    animation: "viewfinderPulse 2s ease-in-out infinite",
  },
  cornerTR: {
    top: "20px",
    right: "20px",
    borderLeft: "none",
    borderBottom: "none",
    animation: "viewfinderPulse 2s ease-in-out infinite 0.5s",
  },
  cornerBL: {
    bottom: "20px",
    left: "20px",
    borderRight: "none",
    borderTop: "none",
    animation: "viewfinderPulse 2s ease-in-out infinite 1s",
  },
  cornerBR: {
    bottom: "20px",
    right: "20px",
    borderLeft: "none",
    borderTop: "none",
    animation: "viewfinderPulse 2s ease-in-out infinite 1.5s",
  },
  scanline: {
    position: "absolute",
    left: "10%",
    right: "10%",
    height: "2px",
    background:
      "linear-gradient(90deg, transparent, var(--color-cyan), transparent)",
    boxShadow: "0 0 20px var(--color-cyan), 0 0 40px var(--color-cyan)",
    animation: "scanline 2s ease-in-out infinite",
  },
  boundingBox: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "200px",
    height: "240px",
    border: "2px solid var(--color-cyan)",
    borderRadius: "8px",
    animation: "viewfinderPulse 1s ease-in-out infinite",
    transition: "all 0.3s ease",
  },
  initOverlay: {
    position: "absolute",
    inset: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "1rem",
    background: "rgba(0, 0, 0, 0.8)",
  },
  initSpinner: {
    width: "48px",
    height: "48px",
    border: "2px solid rgba(0, 245, 255, 0.2)",
    borderTopColor: "var(--color-cyan)",
    borderRadius: "50%",
    animation: "orbitalSpin 1s linear infinite",
  },
  initText: {
    fontFamily: "var(--font-mono)",
    fontSize: "0.875rem",
    color: "var(--color-cyan)",
    letterSpacing: "0.1em",
  },
  errorOverlay: {
    position: "absolute",
    inset: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "1rem",
    background: "rgba(10, 10, 15, 0.95)",
  },
  errorIcon: {
    fontSize: "3rem",
    color: "var(--color-error)",
  },
  errorText: {
    fontFamily: "var(--font-mono)",
    fontSize: "0.875rem",
    color: "var(--color-error)",
    letterSpacing: "0.1em",
  },
  retryButton: {
    marginTop: "1rem",
    padding: "0.75rem 1.5rem",
    background: "transparent",
    border: "1px solid var(--color-error)",
    borderRadius: "6px",
    color: "var(--color-error)",
    fontFamily: "var(--font-mono)",
    fontSize: "0.75rem",
    letterSpacing: "0.1em",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },

  statusBar: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    padding: "1rem 1.5rem",
    background: "rgba(0, 0, 0, 0.4)",
    borderRadius: "8px",
    border: "1px solid",
    borderColor: "var(--color-text-muted)",
    transition: "border-color 0.3s ease",
  },
  statusIcon: {
    fontSize: "1.25rem",
    transition: "color 0.3s ease",
  },
  statusLabel: {
    fontFamily: "var(--font-mono)",
    fontSize: "0.875rem",
    fontWeight: "600",
    letterSpacing: "0.1em",
    transition: "color 0.3s ease",
  },
  statusDots: {
    display: "flex",
    gap: "4px",
    marginLeft: "auto",
  },
  dot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    background: "var(--color-cyan)",
    animation: "statusPulse 1s ease-in-out infinite",
  },

  actionArea: {
    display: "flex",
    justifyContent: "center",
    padding: "0.5rem 0",
  },
  scanButton: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    padding: "1rem 2.5rem",
    background:
      "linear-gradient(135deg, rgba(0, 245, 255, 0.15), rgba(0, 245, 255, 0.05))",
    border: "2px solid var(--color-cyan)",
    borderRadius: "8px",
    color: "var(--color-cyan)",
    fontFamily: "var(--font-display)",
    fontSize: "1rem",
    fontWeight: "700",
    letterSpacing: "0.15em",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 0 30px rgba(0, 245, 255, 0.2)",
  },
  scanButtonIcon: {
    fontSize: "1.25rem",
    animation: "viewfinderPulse 2s ease-in-out infinite",
  },
  resetButton: {
    padding: "0.875rem 2rem",
    background: "transparent",
    border: "1px solid var(--color-text-muted)",
    borderRadius: "6px",
    color: "var(--color-text-secondary)",
    fontFamily: "var(--font-mono)",
    fontSize: "0.875rem",
    letterSpacing: "0.1em",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },

  // Info Panel
  infoPanel: {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  },
  resultCard: {
    background: "rgba(255, 255, 255, 0.02)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255, 255, 255, 0.06)",
    borderRadius: "12px",
    padding: "1.5rem",
    flex: 1,
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1.5rem",
    paddingBottom: "1rem",
    borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
  },
  cardTitle: {
    fontFamily: "var(--font-display)",
    fontSize: "0.75rem",
    fontWeight: "700",
    color: "var(--color-text-muted)",
    letterSpacing: "0.15em",
  },
  cardBadge: {
    padding: "0.25rem 0.75rem",
    borderRadius: "4px",
    fontFamily: "var(--font-mono)",
    fontSize: "0.625rem",
    fontWeight: "600",
    color: "#000",
    letterSpacing: "0.1em",
  },

  // Matched content
  matchedContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "1.5rem",
    animation: "clipReveal 0.5s ease-out",
  },
  userAvatar: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    background:
      "linear-gradient(135deg, var(--color-success), rgba(0, 255, 136, 0.3))",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "2rem",
    boxShadow: "0 0 40px rgba(0, 255, 136, 0.3)",
  },
  userDetails: {
    textAlign: "center",
  },
  userName: {
    fontFamily: "var(--font-display)",
    fontSize: "1.5rem",
    fontWeight: "700",
    color: "var(--color-text-primary)",
    marginBottom: "0.25rem",
  },
  userMeta: {
    fontSize: "0.875rem",
    color: "var(--color-text-secondary)",
    marginBottom: "0.25rem",
  },
  userId: {
    fontFamily: "var(--font-mono)",
    fontSize: "0.75rem",
    color: "var(--color-text-muted)",
  },
  confidenceBlock: {
    width: "100%",
    padding: "1rem",
    background: "rgba(0, 255, 136, 0.05)",
    borderRadius: "8px",
    border: "1px solid rgba(0, 255, 136, 0.1)",
  },
  confidenceLabel: {
    fontFamily: "var(--font-mono)",
    fontSize: "0.625rem",
    color: "var(--color-text-muted)",
    letterSpacing: "0.1em",
    marginBottom: "0.5rem",
  },
  confidenceValue: {
    fontFamily: "var(--font-mono)",
    fontSize: "2rem",
    fontWeight: "700",
    color: "var(--color-success)",
  },
  confidenceBar: {
    height: "4px",
    background: "rgba(0, 255, 136, 0.2)",
    borderRadius: "2px",
    marginTop: "0.5rem",
    overflow: "hidden",
  },
  confidenceFill: {
    height: "100%",
    background: "var(--color-success)",
    borderRadius: "2px",
    transition: "width 0.5s ease",
  },
  timestampBlock: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    fontFamily: "var(--font-mono)",
    fontSize: "0.75rem",
    color: "var(--color-text-muted)",
  },
  timestampIcon: {
    color: "var(--color-cyan)",
  },
  timestampText: {},

  // Mismatch content
  mismatchContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "1rem",
    padding: "2rem 0",
    animation: "clipReveal 0.5s ease-out",
  },
  mismatchIcon: {
    width: "64px",
    height: "64px",
    borderRadius: "50%",
    background: "rgba(255, 45, 85, 0.1)",
    border: "2px solid var(--color-error)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.5rem",
    color: "var(--color-error)",
  },
  mismatchTitle: {
    fontFamily: "var(--font-display)",
    fontSize: "1.25rem",
    fontWeight: "700",
    color: "var(--color-error)",
  },
  mismatchText: {
    fontSize: "0.875rem",
    color: "var(--color-text-secondary)",
    textAlign: "center",
  },
  registerLink: {
    marginTop: "1rem",
    padding: "0.75rem 1.5rem",
    background: "transparent",
    border: "1px solid var(--color-cyan)",
    borderRadius: "6px",
    color: "var(--color-cyan)",
    fontFamily: "var(--font-mono)",
    fontSize: "0.75rem",
    letterSpacing: "0.1em",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },

  // Idle content
  idleContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "1.5rem",
    padding: "2rem 0",
  },
  idleVisual: {
    position: "relative",
    width: "80px",
    height: "80px",
  },
  idleRing: {
    position: "absolute",
    inset: 0,
    border: "2px solid rgba(0, 245, 255, 0.3)",
    borderRadius: "50%",
    animation: "viewfinderPulse 2s ease-in-out infinite",
  },
  idleCore: {
    position: "absolute",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "2rem",
    color: "var(--color-cyan)",
    opacity: 0.6,
  },
  idleText: {
    fontSize: "0.875rem",
    color: "var(--color-text-secondary)",
    textAlign: "center",
    maxWidth: "250px",
  },
  idleTips: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  tipItem: {
    fontFamily: "var(--font-mono)",
    fontSize: "0.75rem",
    color: "var(--color-text-muted)",
  },

  // Log Card
  logCard: {
    background: "rgba(255, 255, 255, 0.02)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255, 255, 255, 0.06)",
    borderRadius: "12px",
    padding: "1.5rem",
  },
  logCount: {
    fontFamily: "var(--font-mono)",
    fontSize: "0.625rem",
    color: "var(--color-text-muted)",
  },
  logList: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
  },
  logItem: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    padding: "0.75rem",
    background: "rgba(0, 0, 0, 0.2)",
    borderRadius: "8px",
    animation: "clipReveal 0.4s ease-out backwards",
  },
  logAvatar: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    background:
      "linear-gradient(135deg, rgba(0, 245, 255, 0.2), rgba(0, 245, 255, 0.05))",
    border: "1px solid rgba(0, 245, 255, 0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "var(--font-display)",
    fontSize: "0.875rem",
    fontWeight: "700",
    color: "var(--color-cyan)",
  },
  logInfo: {
    flex: 1,
  },
  logName: {
    fontSize: "0.875rem",
    fontWeight: "600",
    color: "var(--color-text-primary)",
  },
  logDept: {
    fontSize: "0.75rem",
    color: "var(--color-text-muted)",
  },
  logTime: {
    fontFamily: "var(--font-mono)",
    fontSize: "0.75rem",
    color: "var(--color-cyan)",
  },
  emptyLog: {
    textAlign: "center",
    padding: "2rem",
    color: "var(--color-text-muted)",
    fontSize: "0.875rem",
  },
};

export default ScanPage;
