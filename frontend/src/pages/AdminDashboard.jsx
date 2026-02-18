// ============================================================
// AdminDashboard.jsx - Full Admin Dashboard with Sidebar
// Biometric Attendance System
// ============================================================

import { useCallback, useEffect, useState } from "react";
import {
  getAttendanceLogs,
  getDashboardStats,
  getRegisteredUsers,
  getSystemStatus,
} from "../api/mockAPI";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState(null);
  const [logs, setLogs] = useState([]);
  const [users, setUsers] = useState([]);
  const [systemStatus, setSystemStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [currentTime, setCurrentTime] = useState(new Date());

  const itemsPerPage = 10;

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [statsData, logsData, usersData, statusData] = await Promise.all([
        getDashboardStats(),
        getAttendanceLogs(),
        getRegisteredUsers(),
        getSystemStatus(),
      ]);
      setStats(statsData);
      setLogs(logsData);
      setUsers(usersData);
      setSystemStatus(statusData);
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Animated count-up effect
  const AnimatedNumber = ({ value, duration = 1500 }) => {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
      let start = 0;
      const end = value;
      const incrementTime = duration / end;

      const timer = setInterval(() => {
        start += 1;
        setDisplayValue(start);
        if (start >= end) clearInterval(timer);
      }, incrementTime);

      return () => clearInterval(timer);
    }, [value, duration]);

    return <span>{displayValue}</span>;
  };

  // Filter logs by search
  const filteredLogs = logs.filter(
    (log) =>
      log.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.employeeId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.department?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Pagination
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Generate initials color from name
  const getInitialsColor = (name) => {
    const colors = [
      "#00F5FF",
      "#00FF88",
      "#FFB800",
      "#FF2D55",
      "#8B5CF6",
      "#EC4899",
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const formatDate = () => {
    return currentTime
      .toLocaleDateString("en-US", {
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
      .toUpperCase();
  };

  const formatTime = () => {
    return currentTime.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const handleExportCSV = () => {
    // Mock export
    const csvContent =
      "Employee ID,Name,Department,Time,Confidence,Status\n" +
      logs
        .map(
          (l) =>
            `${l.employeeId},${l.name},${l.department},${l.time},${l.confidence}%,${l.status}`,
        )
        .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `attendance_log_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  // Tab content renderers
  const renderOverview = () => (
    <div style={styles.overviewContent}>
      {/* Stats Cards */}
      <div style={styles.statsGrid}>
        <StatCard
          label="Total Enrolled Users"
          value={stats?.totalUsers || 0}
          trend="+12 this week"
          icon="👤"
          color="var(--color-accent-primary)"
        />
        <StatCard
          label="Today's Attendance"
          value={stats?.todayAttendance || 0}
          trend="↑ 8% vs yesterday"
          icon="✓"
          color="var(--color-success)"
        />
        <StatCard
          label="Average Confidence"
          value={`${stats?.avgConfidence || 0}%`}
          trend="Excellent"
          icon="◎"
          color="var(--color-warning)"
        />
        <StatCard
          label="Failed Attempts"
          value={stats?.failedAttempts || 0}
          trend="-2 vs yesterday"
          icon="✗"
          color="var(--color-error)"
        />
      </div>

      {/* Attendance Chart */}
      <div style={styles.chartCard}>
        <h3 style={styles.cardTitle}>Attendance Timeline — Today</h3>
        <div style={styles.barChart}>
          {[...Array(12)].map((_, i) => {
            const hour = 7 + i;
            const height = Math.random() * 80 + 20;
            return (
              <div key={i} style={styles.barContainer}>
                <div
                  style={{
                    ...styles.bar,
                    height: `${height}%`,
                    animationDelay: `${i * 0.1}s`,
                  }}
                />
                <span style={styles.barLabel}>{hour}:00</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div style={styles.activityCard}>
        <h3 style={styles.cardTitle}>Recent Activity</h3>
        <div style={styles.activityList}>
          {logs.slice(0, 8).map((log, i) => (
            <div
              key={i}
              style={{ ...styles.activityItem, animationDelay: `${i * 0.05}s` }}
            >
              <div
                style={{
                  ...styles.activityAvatar,
                  background: getInitialsColor(log.name),
                }}
              >
                {log.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div style={styles.activityInfo}>
                <span style={styles.activityName}>{log.name}</span>
                <span style={styles.activityTime}>
                  {log.time} • {log.department}
                </span>
              </div>
              <span
                style={{
                  ...styles.activityBadge,
                  background:
                    log.status === "VERIFIED"
                      ? "rgba(0,255,136,0.15)"
                      : "rgba(255,45,85,0.15)",
                  color:
                    log.status === "VERIFIED"
                      ? "var(--color-success)"
                      : "var(--color-error)",
                }}
              >
                {log.confidence}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAttendanceLog = () => (
    <div style={styles.logContent}>
      {/* Search & Export */}
      <div style={styles.logHeader}>
        <input
          type="text"
          placeholder="Search by name, ID, or department..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />
        <button style={styles.exportBtn} onClick={handleExportCSV}>
          ↓ EXPORT CSV
        </button>
      </div>

      {/* Table */}
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Employee ID</th>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Department</th>
              <th style={styles.th}>Time In</th>
              <th style={styles.th}>Confidence</th>
              <th style={styles.th}>Status</th>
            </tr>
          </thead>
          <tbody>
            {paginatedLogs.map((log, i) => (
              <tr key={i} style={styles.tr}>
                <td style={styles.td}>
                  <span style={styles.employeeId}>{log.employeeId}</span>
                </td>
                <td style={styles.td}>
                  <div style={styles.nameCell}>
                    <div
                      style={{
                        ...styles.tableAvatar,
                        background: getInitialsColor(log.name),
                      }}
                    >
                      {log.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    {log.name}
                  </div>
                </td>
                <td style={styles.td}>{log.department}</td>
                <td style={{ ...styles.td, fontFamily: "var(--font-mono)" }}>
                  {log.time}
                </td>
                <td style={styles.td}>
                  <div style={styles.confidenceBar}>
                    <div
                      style={{
                        ...styles.confidenceFill,
                        width: `${log.confidence}%`,
                      }}
                    />
                    <span>{log.confidence}%</span>
                  </div>
                </td>
                <td style={styles.td}>
                  <span
                    style={{
                      ...styles.statusBadge,
                      background:
                        log.status === "VERIFIED"
                          ? "rgba(0,255,136,0.15)"
                          : "rgba(255,45,85,0.15)",
                      color:
                        log.status === "VERIFIED"
                          ? "var(--color-success)"
                          : "var(--color-error)",
                    }}
                  >
                    {log.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div style={styles.pagination}>
        <span style={styles.pageInfo}>
          Showing {(currentPage - 1) * itemsPerPage + 1} -{" "}
          {Math.min(currentPage * itemsPerPage, filteredLogs.length)} of{" "}
          {filteredLogs.length}
        </span>
        <div style={styles.pageButtons}>
          <button
            style={styles.pageBtn}
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            ←
          </button>
          {[...Array(Math.min(5, totalPages))].map((_, i) => (
            <button
              key={i}
              style={{
                ...styles.pageBtn,
                ...(currentPage === i + 1 ? styles.pageBtnActive : {}),
              }}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button
            style={styles.pageBtn}
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            →
          </button>
        </div>
      </div>
    </div>
  );

  const renderRegisteredUsers = () => (
    <div style={styles.usersGrid}>
      {users.map((user, i) => (
        <div
          key={i}
          style={{ ...styles.userCard, animationDelay: `${i * 0.05}s` }}
        >
          <div
            style={{
              ...styles.userAvatar,
              background: `linear-gradient(135deg, ${getInitialsColor(user.name)}, ${getInitialsColor(user.name)}88)`,
            }}
          >
            {user.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>
          <h4 style={styles.userName}>{user.name}</h4>
          <span style={styles.userEmployeeId}>{user.employeeId}</span>
          <span style={styles.userDept}>{user.department}</span>
          <div style={styles.userMeta}>
            <span style={styles.embeddingStatus}>
              <span style={styles.embeddingDot}>●</span> Embedding Stored
            </span>
            <span style={styles.enrollDate}>Enrolled: {user.enrolledAt}</span>
          </div>
        </div>
      ))}
    </div>
  );

  const renderSystemStatus = () => (
    <div style={styles.systemContent}>
      <div style={styles.terminalCard}>
        <div style={styles.terminalHeader}>
          <span style={styles.terminalDot} />
          <span style={styles.terminalDot} />
          <span style={styles.terminalDot} />
          <span style={styles.terminalTitle}>SYSTEM DIAGNOSTICS</span>
        </div>
        <div style={styles.terminalBody}>
          <div style={styles.statusRow}>
            <span style={styles.statusLabel}>
              Face Recognition Model (ArcFace)
            </span>
            <span
              style={{ ...styles.statusValue, color: "var(--color-success)" }}
            >
              ● OPERATIONAL
            </span>
          </div>
          <div style={styles.statusRow}>
            <span style={styles.statusLabel}>
              Gesture Detection (MediaPipe)
            </span>
            <span
              style={{ ...styles.statusValue, color: "var(--color-success)" }}
            >
              ● OPERATIONAL
            </span>
          </div>
          <div style={styles.statusRow}>
            <span style={styles.statusLabel}>Embedding Database</span>
            <span
              style={{ ...styles.statusValue, color: "var(--color-success)" }}
            >
              ● OPERATIONAL
            </span>
          </div>
          <div style={styles.statusRow}>
            <span style={styles.statusLabel}>API Server</span>
            <span
              style={{ ...styles.statusValue, color: "var(--color-success)" }}
            >
              ● OPERATIONAL
            </span>
          </div>

          <div style={styles.divider} />

          <div style={styles.infoRow}>
            <span>Model Accuracy:</span>
            <span style={styles.infoValue}>
              {systemStatus?.accuracy || "99.2"}%
            </span>
          </div>
          <div style={styles.infoRow}>
            <span>Avg Inference Time (CPU):</span>
            <span style={styles.infoValue}>
              {systemStatus?.inferenceTime || "142"}ms
            </span>
          </div>
          <div style={styles.infoRow}>
            <span>Recognition Threshold:</span>
            <span style={styles.infoValue}>
              {systemStatus?.threshold || "0.65"}
            </span>
          </div>
          <div style={styles.infoRow}>
            <span>Database Entries:</span>
            <span style={styles.infoValue}>
              {systemStatus?.dbEntries || stats?.totalUsers || 247}
            </span>
          </div>
          <div style={styles.infoRow}>
            <span>Last Model Update:</span>
            <span style={styles.infoValue}>
              {systemStatus?.lastUpdate || "2026-02-15 03:42:00"}
            </span>
          </div>
          <div style={styles.infoRow}>
            <span>Server Uptime:</span>
            <span style={styles.infoValue}>
              {systemStatus?.uptime || "14d 7h 23m"}
            </span>
          </div>

          <div style={styles.terminalFooter}>
            <span style={{ animation: "textFlicker 4s infinite" }}>
              &gt; All systems nominal_
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  // Stat Card Component
  const StatCard = ({ label, value, trend, icon, color }) => (
    <div style={styles.statCard}>
      <div style={{ ...styles.statIcon, background: `${color}15`, color }}>
        {icon}
      </div>
      <div style={styles.statInfo}>
        <span style={styles.statLabel}>{label}</span>
        <span style={styles.statValue}>
          {typeof value === "number" ? <AnimatedNumber value={value} /> : value}
        </span>
        <span style={styles.statTrend}>{trend}</span>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.orbitalSpinner}>
          <div style={styles.spinnerRing} />
          <div style={styles.spinnerRing2} />
        </div>
        <p style={styles.loadingText}>Loading dashboard data...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <div style={styles.sidebarLogo}>
          <span style={styles.logoIcon}>⬡</span>
          <span style={styles.logoText}>BIOMETRIC OS</span>
        </div>

        <nav style={styles.sidebarNav}>
          {[
            { id: "overview", label: "Overview", icon: "◧" },
            { id: "attendance", label: "Attendance Log", icon: "☰" },
            { id: "users", label: "Registered Users", icon: "◉" },
            { id: "system", label: "System Status", icon: "⚙" },
          ].map((item) => (
            <button
              key={item.id}
              style={{
                ...styles.navItem,
                ...(activeTab === item.id ? styles.navItemActive : {}),
              }}
              onClick={() => setActiveTab(item.id)}
            >
              <span style={styles.navIcon}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div style={styles.sidebarFooter}>
          <div style={styles.adminProfile}>
            <div style={styles.adminAvatar}>A</div>
            <div style={styles.adminInfo}>
              <span style={styles.adminName}>Admin User</span>
              <span style={styles.adminSession}>
                <span style={styles.sessionDot}>●</span> ADMIN SESSION
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main style={styles.main}>
        {/* Header */}
        <header style={styles.header}>
          <div>
            <h1 style={styles.pageTitle}>
              {activeTab === "overview" && "Dashboard Overview"}
              {activeTab === "attendance" && "Attendance Log"}
              {activeTab === "users" && "Registered Users"}
              {activeTab === "system" && "System Status"}
            </h1>
            <p style={styles.pageSubtitle}>
              {activeTab === "overview" &&
                "Real-time biometric system monitoring"}
              {activeTab === "attendance" && "Complete attendance records"}
              {activeTab === "users" && "All enrolled biometric profiles"}
              {activeTab === "system" && "System health and diagnostics"}
            </p>
          </div>
          <div style={styles.headerRight}>
            <div style={styles.dateTime}>
              <span style={styles.date}>{formatDate()}</span>
              <span style={styles.time}>{formatTime()}</span>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div style={styles.content}>
          {activeTab === "overview" && renderOverview()}
          {activeTab === "attendance" && renderAttendanceLog()}
          {activeTab === "users" && renderRegisteredUsers()}
          {activeTab === "system" && renderSystemStatus()}
        </div>
      </main>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    minHeight: "100vh",
    background:
      "radial-gradient(ellipse at 20% 50%, #0a0e1a 0%, #050810 60%, #000305 100%)",
  },

  // Sidebar
  sidebar: {
    width: "260px",
    background: "rgba(10,14,26,0.95)",
    borderRight: "1px solid rgba(0,245,255,0.1)",
    display: "flex",
    flexDirection: "column",
    padding: "24px 0",
    position: "fixed",
    height: "100vh",
    backdropFilter: "blur(20px)",
  },
  sidebarLogo: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "0 24px 24px",
    borderBottom: "1px solid rgba(0,245,255,0.1)",
    marginBottom: "24px",
  },
  logoIcon: {
    fontSize: "24px",
    color: "var(--color-accent-primary)",
    filter: "drop-shadow(0 0 10px rgba(0,245,255,0.5))",
  },
  logoText: {
    fontFamily: "var(--font-display)",
    fontSize: "14px",
    fontWeight: 700,
    letterSpacing: "0.1em",
    color: "var(--color-text-primary)",
  },
  sidebarNav: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    padding: "0 12px",
  },
  navItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "14px 16px",
    background: "transparent",
    border: "none",
    borderRadius: "8px",
    fontFamily: "var(--font-primary)",
    fontSize: "14px",
    color: "var(--color-text-secondary)",
    cursor: "pointer",
    transition: "all 200ms ease",
    textAlign: "left",
  },
  navItemActive: {
    background: "rgba(0,245,255,0.08)",
    color: "var(--color-accent-primary)",
    borderLeft: "3px solid var(--color-accent-primary)",
  },
  navIcon: {
    fontSize: "18px",
    opacity: 0.7,
  },
  sidebarFooter: {
    padding: "24px",
    borderTop: "1px solid rgba(0,245,255,0.1)",
  },
  adminProfile: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  adminAvatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    background:
      "linear-gradient(135deg, var(--color-accent-primary), var(--color-accent-tertiary))",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "var(--font-display)",
    fontWeight: 700,
    fontSize: "16px",
    color: "#000",
  },
  adminInfo: {
    display: "flex",
    flexDirection: "column",
  },
  adminName: {
    fontFamily: "var(--font-primary)",
    fontSize: "14px",
    fontWeight: 600,
    color: "var(--color-text-primary)",
  },
  adminSession: {
    fontFamily: "var(--font-mono)",
    fontSize: "10px",
    color: "var(--color-success)",
    display: "flex",
    alignItems: "center",
    gap: "4px",
  },
  sessionDot: {
    fontSize: "8px",
    animation: "statusPulse 2s infinite",
  },

  // Main Content
  main: {
    flex: 1,
    marginLeft: "260px",
    padding: "32px",
    minHeight: "100vh",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "32px",
  },
  pageTitle: {
    fontFamily: "var(--font-display)",
    fontSize: "28px",
    fontWeight: 700,
    color: "var(--color-text-primary)",
    marginBottom: "4px",
  },
  pageSubtitle: {
    fontFamily: "var(--font-primary)",
    fontSize: "14px",
    color: "var(--color-text-muted)",
  },
  headerRight: {
    textAlign: "right",
  },
  dateTime: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },
  date: {
    fontFamily: "var(--font-mono)",
    fontSize: "14px",
    color: "var(--color-text-secondary)",
    letterSpacing: "0.05em",
  },
  time: {
    fontFamily: "var(--font-mono)",
    fontSize: "24px",
    fontWeight: 600,
    color: "var(--color-accent-primary)",
    animation: "textFlicker 4s infinite",
  },
  content: {
    animation: "fadeIn 0.3s ease",
  },

  // Stats Grid
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "20px",
    marginBottom: "32px",
  },
  statCard: {
    background: "rgba(255,255,255,0.03)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "12px",
    padding: "20px",
    display: "flex",
    alignItems: "flex-start",
    gap: "16px",
    transition: "all 200ms ease",
  },
  statIcon: {
    width: "48px",
    height: "48px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
  },
  statInfo: {
    display: "flex",
    flexDirection: "column",
  },
  statLabel: {
    fontFamily: "var(--font-primary)",
    fontSize: "13px",
    color: "var(--color-text-muted)",
    marginBottom: "4px",
  },
  statValue: {
    fontFamily: "var(--font-display)",
    fontSize: "32px",
    fontWeight: 700,
    color: "var(--color-text-primary)",
    lineHeight: 1,
    marginBottom: "4px",
  },
  statTrend: {
    fontFamily: "var(--font-mono)",
    fontSize: "11px",
    color: "var(--color-success)",
  },

  // Chart
  chartCard: {
    background: "rgba(255,255,255,0.03)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "12px",
    padding: "24px",
    marginBottom: "32px",
  },
  cardTitle: {
    fontFamily: "var(--font-display)",
    fontSize: "16px",
    fontWeight: 600,
    color: "var(--color-text-primary)",
    marginBottom: "24px",
  },
  barChart: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    height: "200px",
    gap: "8px",
  },
  barContainer: {
    flex: 1,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  bar: {
    width: "100%",
    background:
      "linear-gradient(to top, var(--color-accent-tertiary), var(--color-accent-primary))",
    borderRadius: "4px 4px 0 0",
    animation: "scaleIn 0.5s ease forwards",
    transformOrigin: "bottom",
  },
  barLabel: {
    fontFamily: "var(--font-mono)",
    fontSize: "10px",
    color: "var(--color-text-muted)",
    marginTop: "8px",
  },

  // Activity
  activityCard: {
    background: "rgba(255,255,255,0.03)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "12px",
    padding: "24px",
  },
  activityList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  activityItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px",
    borderRadius: "8px",
    background: "rgba(255,255,255,0.02)",
    animation: "fadeIn 0.3s ease forwards",
  },
  activityAvatar: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "var(--font-display)",
    fontSize: "12px",
    fontWeight: 700,
    color: "#000",
  },
  activityInfo: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  activityName: {
    fontFamily: "var(--font-primary)",
    fontSize: "14px",
    fontWeight: 600,
    color: "var(--color-text-primary)",
  },
  activityTime: {
    fontFamily: "var(--font-mono)",
    fontSize: "11px",
    color: "var(--color-text-muted)",
  },
  activityBadge: {
    fontFamily: "var(--font-mono)",
    fontSize: "12px",
    fontWeight: 600,
    padding: "4px 10px",
    borderRadius: "20px",
  },

  // Attendance Log
  logContent: {},
  logHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: "16px",
    marginBottom: "24px",
  },
  searchInput: {
    flex: 1,
    maxWidth: "400px",
    padding: "12px 16px",
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "8px",
    fontFamily: "var(--font-primary)",
    fontSize: "14px",
    color: "var(--color-text-primary)",
    outline: "none",
    transition: "all 200ms ease",
  },
  exportBtn: {
    padding: "12px 24px",
    background: "transparent",
    border: "1px solid var(--color-accent-primary)",
    borderRadius: "8px",
    fontFamily: "var(--font-display)",
    fontSize: "12px",
    fontWeight: 600,
    letterSpacing: "0.05em",
    color: "var(--color-accent-primary)",
    cursor: "pointer",
    transition: "all 200ms ease",
  },
  tableContainer: {
    background: "rgba(255,255,255,0.02)",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.08)",
    overflow: "hidden",
    marginBottom: "24px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    padding: "16px",
    textAlign: "left",
    fontFamily: "var(--font-primary)",
    fontSize: "12px",
    fontWeight: 600,
    color: "var(--color-text-muted)",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    background: "rgba(0,0,0,0.3)",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
  },
  tr: {
    borderBottom: "1px solid rgba(255,255,255,0.05)",
    transition: "background 200ms ease",
  },
  td: {
    padding: "14px 16px",
    fontFamily: "var(--font-primary)",
    fontSize: "14px",
    color: "var(--color-text-secondary)",
  },
  nameCell: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  tableAvatar: {
    width: "28px",
    height: "28px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "var(--font-display)",
    fontSize: "10px",
    fontWeight: 700,
    color: "#000",
  },
  employeeId: {
    fontFamily: "var(--font-mono)",
    fontSize: "12px",
    background: "rgba(0,245,255,0.1)",
    padding: "4px 8px",
    borderRadius: "4px",
    color: "var(--color-accent-primary)",
  },
  confidenceBar: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  confidenceFill: {
    height: "4px",
    background: "var(--color-accent-primary)",
    borderRadius: "2px",
    maxWidth: "80px",
  },
  statusBadge: {
    fontFamily: "var(--font-mono)",
    fontSize: "10px",
    fontWeight: 600,
    padding: "4px 10px",
    borderRadius: "20px",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  pagination: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  pageInfo: {
    fontFamily: "var(--font-primary)",
    fontSize: "13px",
    color: "var(--color-text-muted)",
  },
  pageButtons: {
    display: "flex",
    gap: "4px",
  },
  pageBtn: {
    width: "36px",
    height: "36px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "6px",
    fontFamily: "var(--font-mono)",
    fontSize: "13px",
    color: "var(--color-text-secondary)",
    cursor: "pointer",
    transition: "all 200ms ease",
  },
  pageBtnActive: {
    background: "var(--color-accent-primary)",
    borderColor: "var(--color-accent-primary)",
    color: "#000",
  },

  // Users Grid
  usersGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "20px",
  },
  userCard: {
    background: "rgba(255,255,255,0.03)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "12px",
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    transition: "all 200ms ease",
    animation: "fadeIn 0.3s ease forwards",
    cursor: "pointer",
  },
  userAvatar: {
    width: "64px",
    height: "64px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "var(--font-display)",
    fontSize: "20px",
    fontWeight: 700,
    color: "#000",
    marginBottom: "16px",
  },
  userName: {
    fontFamily: "var(--font-display)",
    fontSize: "16px",
    fontWeight: 600,
    color: "var(--color-text-primary)",
    marginBottom: "4px",
  },
  userEmployeeId: {
    fontFamily: "var(--font-mono)",
    fontSize: "12px",
    color: "var(--color-accent-primary)",
    background: "rgba(0,245,255,0.1)",
    padding: "2px 8px",
    borderRadius: "4px",
    marginBottom: "8px",
  },
  userDept: {
    fontFamily: "var(--font-primary)",
    fontSize: "13px",
    color: "var(--color-text-muted)",
    marginBottom: "16px",
  },
  userMeta: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    width: "100%",
    borderTop: "1px solid rgba(255,255,255,0.08)",
    paddingTop: "12px",
  },
  embeddingStatus: {
    fontFamily: "var(--font-mono)",
    fontSize: "11px",
    color: "var(--color-success)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "4px",
  },
  embeddingDot: {
    fontSize: "8px",
  },
  enrollDate: {
    fontFamily: "var(--font-mono)",
    fontSize: "10px",
    color: "var(--color-text-muted)",
  },

  // System Status
  systemContent: {},
  terminalCard: {
    background: "rgba(0,0,0,0.4)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "12px",
    overflow: "hidden",
    maxWidth: "700px",
  },
  terminalHeader: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "12px 16px",
    background: "rgba(255,255,255,0.05)",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
  },
  terminalDot: {
    width: "12px",
    height: "12px",
    borderRadius: "50%",
    background: "rgba(255,255,255,0.2)",
  },
  terminalTitle: {
    fontFamily: "var(--font-mono)",
    fontSize: "12px",
    color: "var(--color-text-muted)",
    marginLeft: "8px",
    letterSpacing: "0.1em",
  },
  terminalBody: {
    padding: "24px",
    fontFamily: "var(--font-mono)",
  },
  statusRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "12px 0",
    borderBottom: "1px solid rgba(255,255,255,0.05)",
  },
  statusLabel: {
    fontSize: "13px",
    color: "var(--color-text-secondary)",
  },
  statusValue: {
    fontSize: "12px",
    fontWeight: 600,
    letterSpacing: "0.05em",
  },
  divider: {
    height: "1px",
    background: "rgba(0,245,255,0.2)",
    margin: "20px 0",
  },
  infoRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "8px 0",
    fontSize: "12px",
    color: "var(--color-text-muted)",
  },
  infoValue: {
    color: "var(--color-accent-primary)",
    fontWeight: 600,
  },
  terminalFooter: {
    marginTop: "24px",
    paddingTop: "16px",
    borderTop: "1px solid rgba(255,255,255,0.05)",
    fontSize: "12px",
    color: "var(--color-success)",
  },

  // Loading
  loadingContainer: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "24px",
  },
  orbitalSpinner: {
    position: "relative",
    width: "60px",
    height: "60px",
  },
  spinnerRing: {
    position: "absolute",
    inset: 0,
    border: "2px solid transparent",
    borderTopColor: "var(--color-accent-primary)",
    borderRadius: "50%",
    animation: "orbitalSpin 1s linear infinite",
  },
  spinnerRing2: {
    position: "absolute",
    inset: "8px",
    border: "2px solid transparent",
    borderTopColor: "var(--color-accent-tertiary)",
    borderRadius: "50%",
    animation: "orbitalSpin 1.5s linear infinite reverse",
  },
  loadingText: {
    fontFamily: "var(--font-mono)",
    fontSize: "14px",
    color: "var(--color-text-muted)",
    animation: "pulse 1.5s infinite",
  },

  overviewContent: {},
};

export default AdminDashboard;
