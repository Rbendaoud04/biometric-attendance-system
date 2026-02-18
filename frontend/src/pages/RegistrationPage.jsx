// ============================================================
// RegistrationPage.jsx - User Registration Flow
// Biometric Attendance System - Enhanced Cinematic Design
// ============================================================

import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/mockAPI";

const DEPARTMENTS = [
  "Engineering",
  "Human Resources",
  "Marketing",
  "Finance",
  "Operations",
  "Research & Development",
  "Sales",
  "Customer Support",
  "Legal",
  "IT Security",
];

const RegistrationPage = () => {
  const navigate = useNavigate();

  // Step management
  const [currentStep, setCurrentStep] = useState(1);

  // Form data
  const [formData, setFormData] = useState({
    name: "",
    employeeId: "",
    department: "",
  });
  const [formErrors, setFormErrors] = useState({});

  // Camera state
  const [cameraError, setCameraError] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [recordingProgress, setRecordingProgress] = useState(0);

  // Processing state
  // eslint-disable-next-line no-unused-vars
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingMessage, setProcessingMessage] = useState("");

  // Refs
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const countdownTimerRef = useRef(null);
  const recordingTimerRef = useRef(null);

  // Initialize camera when on step 2
  const initializeCamera = useCallback(async () => {
    try {
      setCameraError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: "user",
        },
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera access error:", err);
      if (err.name === "NotAllowedError") {
        setCameraError(
          "Camera access denied. Please allow camera permissions to continue.",
        );
      } else if (err.name === "NotFoundError") {
        setCameraError(
          "No camera found. Please connect a camera and try again.",
        );
      } else {
        setCameraError(
          "Failed to access camera. Please check your device settings.",
        );
      }
    }
  }, []);

  // Cleanup camera on unmount or step change
  const cleanupCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
    }
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
    }
  }, []);

  useEffect(() => {
    if (currentStep === 2) {
      initializeCamera();
    }
    return cleanupCamera;
  }, [currentStep, initializeCamera, cleanupCamera]);

  // Form validation
  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = "Full name is required";
    } else if (formData.name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters";
    }

    if (!formData.employeeId.trim()) {
      errors.employeeId = "Employee ID is required";
    } else if (!/^[A-Za-z0-9-]+$/.test(formData.employeeId)) {
      errors.employeeId =
        "Employee ID can only contain letters, numbers, and hyphens";
    }

    if (!formData.department) {
      errors.department = "Please select a department";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Handle step 1 submission
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setCurrentStep(2);
    }
  };

  // Handle recording start
  const handleStartRecording = () => {
    setCountdown(3);

    countdownTimerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownTimerRef.current);
          startActualRecording();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Start actual recording
  const startActualRecording = () => {
    setIsRecording(true);
    setRecordingProgress(0);

    const recordingDuration = 5000; // 5 seconds
    const intervalTime = 100;
    let elapsed = 0;

    recordingTimerRef.current = setInterval(() => {
      elapsed += intervalTime;
      setRecordingProgress((elapsed / recordingDuration) * 100);

      if (elapsed >= recordingDuration) {
        clearInterval(recordingTimerRef.current);
        finishRecording();
      }
    }, intervalTime);
  };

  // Finish recording and process
  const finishRecording = async () => {
    setIsRecording(false);
    setCurrentStep(3);
    setIsProcessing(true);

    const messages = [
      "Capturing facial features...",
      "Analyzing biometric data...",
      "Extracting face embedding...",
      "Generating secure profile...",
      "Finalizing registration...",
    ];

    for (let i = 0; i < messages.length; i++) {
      setProcessingMessage(messages[i]);
      await new Promise((resolve) => setTimeout(resolve, 400));
    }

    try {
      const result = await registerUser(formData);

      if (result.success) {
        localStorage.setItem("registeredUser", JSON.stringify(result.user));
        navigate("/success", { state: { user: result.user } });
      } else {
        setCurrentStep(4);
      }
    } catch (err) {
      console.error("Registration error:", err);
      setCurrentStep(4);
    } finally {
      setIsProcessing(false);
      cleanupCamera();
    }
  };

  // Retry registration
  const handleRetry = () => {
    setCurrentStep(1);
    setCameraError(null);
    setIsRecording(false);
    setCountdown(0);
    setRecordingProgress(0);
    setIsProcessing(false);
  };

  // Render steps
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return renderFormStep();
      case 2:
        return renderCameraStep();
      case 3:
        return renderProcessingStep();
      case 4:
        return renderErrorStep();
      default:
        return renderFormStep();
    }
  };

  // Step 1: Form with floating labels
  const renderFormStep = () => (
    <div style={styles.formContainer}>
      <div style={styles.formHeader}>
        <h2 style={styles.formTitle}>New User Registration</h2>
        <p style={styles.formSubtitle}>
          Enter your details to begin biometric enrollment
        </p>
      </div>

      <form onSubmit={handleFormSubmit} style={styles.form}>
        <div style={styles.inputGroup}>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            style={{
              ...styles.floatingInput,
              borderColor: formErrors.name
                ? "var(--color-error)"
                : formData.name
                  ? "var(--color-accent-primary)"
                  : "rgba(255,255,255,0.2)",
            }}
          />
          <label
            style={{
              ...styles.floatingLabel,
              ...(formData.name ? styles.floatingLabelActive : {}),
            }}
          >
            Full Name
          </label>
          {formErrors.name && (
            <span
              style={{
                color: "var(--color-error)",
                fontSize: "12px",
                marginTop: "4px",
                display: "block",
              }}
            >
              {formErrors.name}
            </span>
          )}
        </div>

        <div style={styles.inputGroup}>
          <input
            type="text"
            name="employeeId"
            value={formData.employeeId}
            onChange={handleInputChange}
            style={{
              ...styles.floatingInput,
              fontFamily: "var(--font-mono)",
              borderColor: formErrors.employeeId
                ? "var(--color-error)"
                : formData.employeeId
                  ? "var(--color-accent-primary)"
                  : "rgba(255,255,255,0.2)",
            }}
          />
          <label
            style={{
              ...styles.floatingLabel,
              ...(formData.employeeId ? styles.floatingLabelActive : {}),
            }}
          >
            Employee ID
          </label>
          {formErrors.employeeId && (
            <span
              style={{
                color: "var(--color-error)",
                fontSize: "12px",
                marginTop: "4px",
                display: "block",
              }}
            >
              {formErrors.employeeId}
            </span>
          )}
        </div>

        <div style={styles.inputGroup}>
          <select
            name="department"
            value={formData.department}
            onChange={handleInputChange}
            style={{
              ...styles.floatingInput,
              paddingTop: formData.department ? "20px" : "14px",
              borderColor: formErrors.department
                ? "var(--color-error)"
                : formData.department
                  ? "var(--color-accent-primary)"
                  : "rgba(255,255,255,0.2)",
              appearance: "none",
              cursor: "pointer",
            }}
          >
            <option value="">Select department...</option>
            {DEPARTMENTS.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
          <label
            style={{
              ...styles.floatingLabel,
              ...(formData.department ? styles.floatingLabelActive : {}),
            }}
          >
            Department
          </label>
          {formErrors.department && (
            <span
              style={{
                color: "var(--color-error)",
                fontSize: "12px",
                marginTop: "4px",
                display: "block",
              }}
            >
              {formErrors.department}
            </span>
          )}
        </div>

        <button
          type="submit"
          style={styles.continueBtn}
          onMouseEnter={(e) => {
            e.target.style.background = "var(--color-accent-primary)";
            e.target.style.color = "#000";
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "transparent";
            e.target.style.color = "var(--color-accent-primary)";
          }}
        >
          CONTINUE <span>→</span>
        </button>
      </form>
    </div>
  );

  // Step 2: Enhanced Camera with viewfinder
  const renderCameraStep = () => (
    <div style={styles.cameraContainer}>
      <div style={styles.cameraHeader}>
        <h2 style={styles.formTitle}>Gesture Recording</h2>
        <p style={styles.formSubtitle}>Position your face and wave to begin</p>
      </div>

      {cameraError ? (
        <div style={styles.cameraErrorBox}>
          <div style={{ fontSize: "64px", marginBottom: "16px" }}>📷</div>
          <h3
            style={{
              ...styles.formTitle,
              fontSize: "20px",
              color: "var(--color-error)",
            }}
          >
            Camera Access Required
          </h3>
          <p
            style={{
              color: "var(--color-text-secondary)",
              marginBottom: "24px",
            }}
          >
            {cameraError}
          </p>
          <div style={styles.cameraErrorActions}>
            <button className="btn btn-secondary" onClick={handleRetry}>
              Go Back
            </button>
            <button className="btn btn-primary" onClick={initializeCamera}>
              Try Again
            </button>
          </div>
        </div>
      ) : (
        <>
          <div style={styles.videoWrapper}>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transform: "scaleX(-1)",
                background: "#0a0e1a",
              }}
            />

            {/* Viewfinder Corners */}
            <div style={styles.viewfinderCorners}>
              <div style={{ ...styles.corner, ...styles.cornerTL }} />
              <div style={{ ...styles.corner, ...styles.cornerTR }} />
              <div style={{ ...styles.corner, ...styles.cornerBL }} />
              <div style={{ ...styles.corner, ...styles.cornerBR }} />
            </div>

            {/* Scanline Effect */}
            <div style={styles.scanlineEffect} />

            {/* Countdown Display */}
            {countdown > 0 && (
              <div style={styles.countdownOverlay}>{countdown}</div>
            )}

            {/* Recording Indicator */}
            {isRecording && (
              <div style={styles.recordingIndicator}>
                <span style={styles.recordingDot} />
                REC
              </div>
            )}

            {/* Gesture Prompt */}
            {!isRecording && countdown === 0 && (
              <div style={styles.gesturePrompt}>
                <span style={styles.waveIcon}>👋</span>
                <span style={styles.gestureText}>WAVE YOUR HAND TO BEGIN</span>
              </div>
            )}

            {/* Timer Display */}
            {isRecording && (
              <div style={styles.timerDisplay}>
                {Math.floor(recordingProgress / 20)}:0
                {Math.floor((recordingProgress % 20) / 4)} / 00:05
              </div>
            )}

            {/* Recording Progress */}
            {isRecording && (
              <div style={styles.progressWrapper}>
                <div
                  style={{
                    height: "4px",
                    background: "rgba(255,255,255,0.2)",
                    borderRadius: "2px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${recordingProgress}%`,
                      height: "100%",
                      background:
                        "linear-gradient(90deg, var(--color-accent-tertiary), var(--color-accent-primary))",
                      transition: "width 100ms linear",
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          <div style={styles.cameraControls}>
            {!isRecording && countdown === 0 && (
              <>
                <p style={styles.cameraInstructions}>
                  Look directly at the camera and click "Start Recording".
                  <br />
                  Keep your face visible for 5 seconds.
                </p>
                <div style={styles.buttonGroup}>
                  <button
                    className="btn btn-secondary"
                    onClick={() => {
                      cleanupCamera();
                      setCurrentStep(1);
                    }}
                  >
                    ← Back
                  </button>
                  <button
                    className="btn btn-primary btn-lg"
                    onClick={handleStartRecording}
                    style={{
                      background: "var(--color-accent-primary)",
                      color: "#000",
                      fontFamily: "var(--font-display)",
                    }}
                  >
                    ◉ Start Recording
                  </button>
                </div>
              </>
            )}

            {countdown > 0 && <p style={styles.countdownText}>Get ready...</p>}

            {isRecording && (
              <p style={styles.recordingText}>
                <span style={{ color: "var(--color-success)" }}>✓</span> GESTURE
                DETECTED — RECORDING...
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );

  // Step 3: Processing with orbital spinner
  const renderProcessingStep = () => (
    <div style={styles.processingContainer}>
      <div style={styles.orbitalSpinner}>
        <div style={styles.spinnerRing} />
        <div style={styles.spinnerRing2} />
      </div>
      <h3 style={styles.processingTitle}>Processing Biometric Data</h3>
      <p style={styles.processingMessage}>{processingMessage}</p>
      <div style={styles.processingDots}>
        <span style={styles.dot} />
        <span style={{ ...styles.dot, animationDelay: "0.2s" }} />
        <span style={{ ...styles.dot, animationDelay: "0.4s" }} />
      </div>
    </div>
  );

  // Step 4: Error
  const renderErrorStep = () => (
    <div style={styles.errorContainer}>
      <div style={styles.errorIcon}>✗</div>
      <h3 style={styles.errorTitle}>Registration Failed</h3>
      <p style={styles.errorMessage}>
        No gesture detected. Please wave clearly in front of the camera and
        ensure proper lighting.
      </p>
      <div style={styles.buttonGroup}>
        <button className="btn btn-secondary" onClick={() => navigate("/")}>
          Go to Home
        </button>
        <button className="btn btn-primary" onClick={handleRetry}>
          Try Again
        </button>
      </div>
    </div>
  );

  return (
    <div style={styles.pageWrapper}>
      {/* Background Effects */}
      <div style={styles.bgGlow1} />
      <div style={styles.bgGlow2} />

      {/* Back Navigation */}
      <button style={styles.backBtn} onClick={() => navigate("/")}>
        ← Back to Home
      </button>

      <div style={styles.container}>
        {/* Enhanced Step Indicator */}
        <div style={styles.stepper}>
          {[
            { num: 1, label: "Personal Info" },
            { num: 2, label: "Face Capture" },
            { num: 3, label: "Processing" },
            { num: 4, label: "Complete" },
          ].map((step, idx) => (
            <div key={step.num} style={styles.stepWrapper}>
              <div
                style={{
                  ...styles.stepNode,
                  ...(currentStep > step.num ? styles.stepCompleted : {}),
                  ...(currentStep === step.num ? styles.stepActive : {}),
                  ...(currentStep < step.num ? styles.stepInactive : {}),
                }}
              >
                {currentStep > step.num ? "✓" : step.num}
              </div>
              <span
                style={{
                  ...styles.stepLabel,
                  ...(currentStep >= step.num ? styles.stepLabelActive : {}),
                }}
              >
                {step.label}
              </span>
              {idx < 3 && (
                <div style={styles.stepConnector}>
                  <div
                    style={{
                      ...styles.stepConnectorFill,
                      width: currentStep > step.num ? "100%" : "0%",
                    }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div style={styles.stepContent}>{renderStep()}</div>
      </div>
    </div>
  );
};

const styles = {
  pageWrapper: {
    minHeight: "100vh",
    padding: "40px 20px",
    position: "relative",
    overflow: "hidden",
  },
  bgGlow1: {
    position: "absolute",
    top: "10%",
    left: "-5%",
    width: "400px",
    height: "400px",
    background:
      "radial-gradient(circle, rgba(0,245,255,0.1) 0%, transparent 70%)",
    filter: "blur(60px)",
    pointerEvents: "none",
  },
  bgGlow2: {
    position: "absolute",
    bottom: "20%",
    right: "-5%",
    width: "350px",
    height: "350px",
    background:
      "radial-gradient(circle, rgba(0,150,199,0.15) 0%, transparent 70%)",
    filter: "blur(80px)",
    pointerEvents: "none",
  },
  backBtn: {
    position: "absolute",
    top: "24px",
    left: "24px",
    background: "transparent",
    border: "none",
    color: "var(--color-text-muted)",
    fontFamily: "var(--font-primary)",
    fontSize: "14px",
    cursor: "pointer",
    padding: "8px 0",
    transition: "color 200ms ease",
    zIndex: 10,
  },
  container: {
    maxWidth: "800px",
    margin: "0 auto",
    position: "relative",
    zIndex: 1,
  },
  stepper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    marginBottom: "48px",
    gap: "0",
  },
  stepWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    position: "relative",
  },
  stepNode: {
    width: "44px",
    height: "44px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "var(--font-display)",
    fontSize: "16px",
    fontWeight: 700,
    transition: "all 300ms ease",
    position: "relative",
    zIndex: 2,
  },
  stepInactive: {
    background: "rgba(255,255,255,0.05)",
    border: "2px solid rgba(255,255,255,0.2)",
    color: "var(--color-text-muted)",
  },
  stepActive: {
    background: "var(--color-accent-primary)",
    border: "2px solid var(--color-accent-primary)",
    color: "#000",
    boxShadow: "0 0 20px rgba(0,245,255,0.5)",
  },
  stepCompleted: {
    background: "var(--color-success)",
    border: "2px solid var(--color-success)",
    color: "#000",
  },
  stepLabel: {
    fontFamily: "var(--font-primary)",
    fontSize: "12px",
    color: "var(--color-text-muted)",
    marginTop: "8px",
    textAlign: "center",
    width: "80px",
  },
  stepLabelActive: {
    color: "var(--color-text-secondary)",
  },
  stepConnector: {
    position: "absolute",
    top: "22px",
    left: "50%",
    width: "80px",
    height: "2px",
    background: "rgba(255,255,255,0.1)",
    marginLeft: "22px",
    overflow: "hidden",
  },
  stepConnectorFill: {
    height: "100%",
    background: "var(--color-accent-primary)",
    transition: "width 500ms ease",
  },
  stepContent: {
    maxWidth: "640px",
    margin: "0 auto",
    animation: "fadeIn 0.4s ease",
  },
  formContainer: {
    background: "rgba(255,255,255,0.03)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(0,245,255,0.15)",
    borderRadius: "16px",
    padding: "40px",
  },
  formHeader: {
    textAlign: "center",
    marginBottom: "40px",
  },
  formTitle: {
    fontFamily: "var(--font-display)",
    fontSize: "28px",
    fontWeight: "700",
    color: "var(--color-text-primary)",
    marginBottom: "8px",
  },
  formSubtitle: {
    fontFamily: "var(--font-primary)",
    color: "var(--color-text-muted)",
    fontSize: "15px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  inputGroup: {
    position: "relative",
  },
  floatingInput: {
    width: "100%",
    padding: "20px 16px 8px",
    background: "transparent",
    border: "none",
    borderBottom: "1px solid rgba(255,255,255,0.2)",
    borderRadius: 0,
    fontFamily: "var(--font-primary)",
    fontSize: "16px",
    color: "var(--color-text-primary)",
    outline: "none",
    transition: "border-color 300ms ease",
  },
  floatingLabel: {
    position: "absolute",
    top: "50%",
    left: "16px",
    transform: "translateY(-50%)",
    fontFamily: "var(--font-primary)",
    fontSize: "15px",
    color: "var(--color-text-muted)",
    pointerEvents: "none",
    transition: "all 200ms ease",
  },
  floatingLabelActive: {
    top: "8px",
    transform: "translateY(0)",
    fontSize: "11px",
    color: "var(--color-accent-primary)",
  },
  continueBtn: {
    marginTop: "16px",
    padding: "18px 32px",
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
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  },
  cameraContainer: {
    background: "rgba(255,255,255,0.03)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(0,245,255,0.15)",
    borderRadius: "16px",
    padding: "32px",
  },
  cameraHeader: {
    textAlign: "center",
    marginBottom: "24px",
  },
  videoWrapper: {
    position: "relative",
    borderRadius: "16px",
    overflow: "hidden",
    maxWidth: "480px",
    margin: "0 auto",
    aspectRatio: "4/3",
    animation: "viewfinderPulse 2s ease-in-out infinite",
  },
  cameraErrorBox: {
    padding: "48px",
    textAlign: "center",
  },
  cameraErrorActions: {
    display: "flex",
    gap: "16px",
    justifyContent: "center",
    marginTop: "24px",
  },
  progressWrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: "8px 12px",
    background: "linear-gradient(transparent, rgba(0,0,0,0.8))",
  },
  viewfinderCorners: {
    position: "absolute",
    inset: "24px",
    pointerEvents: "none",
  },
  corner: {
    position: "absolute",
    width: "24px",
    height: "24px",
    border: "3px solid var(--color-accent-primary)",
  },
  cornerTL: { top: 0, left: 0, borderRight: "none", borderBottom: "none" },
  cornerTR: { top: 0, right: 0, borderLeft: "none", borderBottom: "none" },
  cornerBL: { bottom: 0, left: 0, borderRight: "none", borderTop: "none" },
  cornerBR: { bottom: 0, right: 0, borderLeft: "none", borderTop: "none" },
  scanlineEffect: {
    position: "absolute",
    left: "24px",
    right: "24px",
    height: "2px",
    background:
      "linear-gradient(90deg, transparent, var(--color-accent-primary), transparent)",
    boxShadow: "0 0 10px var(--color-accent-primary)",
    animation: "scanline 2.5s linear infinite",
    opacity: 0.6,
  },
  gesturePrompt: {
    position: "absolute",
    bottom: "60px",
    left: "50%",
    transform: "translateX(-50%)",
    padding: "8px 16px",
    background: "rgba(0,0,0,0.7)",
    borderRadius: "20px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  gestureText: {
    fontFamily: "var(--font-mono)",
    fontSize: "12px",
    color: "var(--color-accent-primary)",
    animation: "blink 1.5s infinite",
    letterSpacing: "0.05em",
  },
  waveIcon: {
    fontSize: "18px",
    animation: "handWave 1s ease-in-out infinite",
  },
  cameraControls: {
    textAlign: "center",
    marginTop: "32px",
  },
  cameraInstructions: {
    fontFamily: "var(--font-primary)",
    color: "var(--color-text-secondary)",
    fontSize: "14px",
    marginBottom: "24px",
    lineHeight: "1.7",
  },
  buttonGroup: {
    display: "flex",
    gap: "16px",
    justifyContent: "center",
  },
  countdownText: {
    fontFamily: "var(--font-mono)",
    fontSize: "18px",
    color: "var(--color-accent-primary)",
    animation: "pulse 1s infinite",
  },
  recordingText: {
    fontFamily: "var(--font-mono)",
    fontSize: "14px",
    color: "var(--color-success)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  },
  countdownOverlay: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    fontFamily: "var(--font-mono)",
    fontSize: "96px",
    fontWeight: 700,
    color: "var(--color-accent-primary)",
    textShadow: "0 0 40px rgba(0,245,255,0.6)",
    animation: "countdownPulse 1s ease-in-out infinite",
    zIndex: 10,
  },
  processingContainer: {
    minHeight: "400px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "48px",
    background: "rgba(255,255,255,0.03)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(0,245,255,0.15)",
    borderRadius: "16px",
  },
  orbitalSpinner: {
    position: "relative",
    width: "80px",
    height: "80px",
    marginBottom: "32px",
  },
  spinnerRing: {
    position: "absolute",
    inset: 0,
    border: "3px solid transparent",
    borderTopColor: "var(--color-accent-primary)",
    borderRadius: "50%",
    animation: "orbitalSpin 1s linear infinite",
  },
  spinnerRing2: {
    position: "absolute",
    inset: "8px",
    border: "3px solid transparent",
    borderTopColor: "var(--color-accent-tertiary)",
    borderRadius: "50%",
    animation: "orbitalSpin 1.5s linear infinite reverse",
  },
  processingTitle: {
    fontFamily: "var(--font-display)",
    fontSize: "22px",
    fontWeight: "600",
    color: "var(--color-text-primary)",
    marginBottom: "12px",
  },
  processingMessage: {
    fontFamily: "var(--font-mono)",
    fontSize: "14px",
    color: "var(--color-accent-primary)",
    animation: "textFlicker 4s infinite",
  },
  processingDots: {
    display: "flex",
    gap: "8px",
    marginTop: "32px",
  },
  dot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    background: "var(--color-accent-primary)",
    animation: "pulse 1s infinite",
  },
  errorContainer: {
    padding: "48px",
    background: "rgba(255,255,255,0.03)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255,45,85,0.3)",
    borderRadius: "16px",
    textAlign: "center",
  },
  errorIcon: {
    fontSize: "64px",
    marginBottom: "24px",
    filter: "drop-shadow(0 0 20px rgba(255,45,85,0.5))",
  },
  errorTitle: {
    fontFamily: "var(--font-display)",
    fontSize: "24px",
    color: "var(--color-error)",
    marginBottom: "12px",
  },
  errorMessage: {
    fontFamily: "var(--font-primary)",
    fontSize: "15px",
    color: "var(--color-text-secondary)",
    marginBottom: "32px",
    lineHeight: 1.6,
  },
  recordingIndicator: {
    position: "absolute",
    top: "16px",
    right: "16px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "6px 12px",
    background: "rgba(255,45,85,0.9)",
    borderRadius: "20px",
    fontFamily: "var(--font-mono)",
    fontSize: "11px",
    fontWeight: 600,
    color: "white",
    letterSpacing: "0.1em",
    zIndex: 5,
  },
  recordingDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    background: "white",
    animation: "recordPulse 1s infinite",
  },
  timerDisplay: {
    position: "absolute",
    bottom: "16px",
    left: "50%",
    transform: "translateX(-50%)",
    fontFamily: "var(--font-mono)",
    fontSize: "14px",
    color: "var(--color-text-primary)",
    background: "rgba(0,0,0,0.7)",
    padding: "4px 12px",
    borderRadius: "4px",
    zIndex: 5,
  },
};

export default RegistrationPage;
