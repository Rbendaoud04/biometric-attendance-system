// ============================================================
// DashboardPage.jsx - Admin Dashboard
// Biometric Attendance System
// ============================================================

import React, { useState, useEffect, useCallback } from 'react';
import { getDashboardStats, getAttendanceLogs } from '../api/mockAPI';

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'time', direction: 'desc' });

  const fetchData = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const [statsData, logsData] = await Promise.all([
        getDashboardStats(),
        getAttendanceLogs()
      ]);

      setStats(statsData);
      setLogs(logsData);
    } catch (err) {
      setError('Failed to load dashboard data. Please try again.');
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRefresh = () => {
    fetchData(true);
  };

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const sortedLogs = [...logs].sort((a, b) => {
    const { key, direction } = sortConfig;
    let comparison = 0;
    
    if (key === 'name') {
      comparison = a.name.localeCompare(b.name);
    } else if (key === 'time') {
      comparison = a.time.localeCompare(b.time);
    } else if (key === 'confidence') {
      comparison = a.confidence - b.confidence;
    }
    
    return direction === 'desc' ? -comparison : comparison;
  });

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-container">
          <div className="spinner spinner-lg" />
          <p className="loading-text">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="error-container">
          <div className="error-icon">??</div>
          <h3 className="error-title">Error Loading Dashboard</h3>
          <p className="error-message">{error}</p>
          <button className="btn btn-primary" onClick={() => fetchData()}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header" style={styles.header}>
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Monitor attendance and system statistics</p>
        </div>
        <button 
          className="btn btn-secondary"
          onClick={handleRefresh}
          disabled={refreshing}
          style={styles.refreshBtn}
        >
          {refreshing ? (
            <>
              <span className="spinner spinner-sm" />
              Refreshing...
            </>
          ) : (
            <>
              ?? Refresh Data
            </>
          )}
        </button>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <StatCard
          icon="??"
          iconClass="primary"
          label="Total Registered"
          value={stats?.totalRegistered || 0}
        />
        <StatCard
          icon="?"
          iconClass="success"
          label="Present Today"
          value={stats?.presentToday || 0}
        />
        <StatCard
          icon="?"
          iconClass="warning"
          label="Late Today"
          value={stats?.lateToday || 0}
        />
        <StatCard
          icon="?"
          iconClass="error"
          label="Absent Today"
          value={stats?.absentToday || 0}
        />
      </div>

      {/* Two Column Layout */}
      <div className="two-column-grid">
        {/* Attendance Logs Table */}
        <div className="card" style={styles.tableCard}>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}>Attendance Log</h3>
            <span className="text-muted text-mono" style={styles.logCount}>
              {logs.length} entries
            </span>
          </div>
          
          {logs.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">??</div>
              <p>No attendance records yet</p>
            </div>
          ) : (
            <div className="table-container" style={styles.tableWrapper}>
              <table className="table">
                <thead>
                  <tr>
                    <th onClick={() => handleSort('name')} className={sortConfig.key === 'name' ? 'sorted' : ''}>
                      Name
                      <span className="sort-icon">
                        {sortConfig.key === 'name' ? (sortConfig.direction === 'asc' ? '?' : '?') : '?'}
                      </span>
                    </th>
                    <th>Department</th>
                    <th onClick={() => handleSort('time')} className={sortConfig.key === 'time' ? 'sorted' : ''}>
                      Time
                      <span className="sort-icon">
                        {sortConfig.key === 'time' ? (sortConfig.direction === 'asc' ? '?' : '?') : '?'}
                      </span>
                    </th>
                    <th onClick={() => handleSort('confidence')} className={sortConfig.key === 'confidence' ? 'sorted' : ''}>
                      Confidence
                      <span className="sort-icon">
                        {sortConfig.key === 'confidence' ? (sortConfig.direction === 'asc' ? '?' : '?') : '?'}
                      </span>
                    </th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedLogs.map((log, index) => (
                    <tr key={`${log.id}-${index}`} style={{ animation: `fadeIn 0.3s ease ${index * 0.05}s both` }}>
                      <td>
                        <div style={styles.nameCell}>
                          <div style={styles.avatar}>
                            {log.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <div style={styles.employeeName}>{log.name}</div>
                            <div className="text-mono text-muted" style={styles.employeeId}>{log.id}</div>
                          </div>
                        </div>
                      </td>
                      <td>{log.department}</td>
                      <td>
                        <div className="text-mono">{log.time}</div>
                        <div className="text-muted" style={styles.dateText}>{log.date}</div>
                      </td>
                      <td>
                        <div style={styles.confidenceCell}>
                          <div className="progress-bar" style={styles.confidenceBar}>
                            <div 
                              className="progress-fill success"
                              style={{ width: `${log.confidence * 100}%` }}
                            />
                          </div>
                          <span className="text-mono">{(log.confidence * 100).toFixed(0)}%</span>
                        </div>
                      </td>
                      <td>
                        <span className={`badge badge-${log.status}`}>
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="card">
          <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}>Recent Activity</h3>
          </div>
          
          {stats?.recentActivity?.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">??</div>
              <p>No recent activity</p>
            </div>
          ) : (
            <div style={styles.activityList}>
              {stats?.recentActivity?.map((activity, index) => (
                <div 
                  key={`${activity.id}-${index}`}
                  style={{
                    ...styles.activityItem,
                    animation: `slideIn 0.3s ease ${index * 0.1}s both`
                  }}
                >
                  <div style={styles.activityIcon}>
                    {activity.action === 'checked_in' ? '??' : '?'}
                  </div>
                  <div style={styles.activityContent}>
                    <div style={styles.activityText}>
                      <strong>{activity.name}</strong>
                      {activity.action === 'checked_in' ? ' checked in' : ' registered'}
                    </div>
                    <div style={styles.activityMeta}>
                      {activity.department} · {activity.timestamp}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ icon, iconClass, label, value }) => (
  <div className="stat-card">
    <div className={`stat-icon ${iconClass}`}>
      {icon}
    </div>
    <div className="stat-content">
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
    </div>
  </div>
);

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: 'var(--spacing-md)',
  },
  refreshBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-sm)',
  },
  tableCard: {
    padding: 0,
    overflow: 'hidden',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 'var(--spacing-lg) var(--spacing-xl)',
    borderBottom: '1px solid var(--color-border-primary)',
  },
  cardTitle: {
    fontSize: '1.125rem',
    fontWeight: '600',
    color: 'var(--color-text-primary)',
    margin: 0,
  },
  logCount: {
    fontSize: '0.75rem',
  },
  tableWrapper: {
    maxHeight: '500px',
    overflow: 'auto',
  },
  nameCell: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-sm)',
  },
  avatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, var(--color-accent-tertiary), var(--color-accent-primary))',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.75rem',
    fontWeight: '700',
    color: 'var(--color-bg-primary)',
    flexShrink: 0,
  },
  employeeName: {
    fontWeight: '500',
    color: 'var(--color-text-primary)',
  },
  employeeId: {
    fontSize: '0.7rem',
  },
  dateText: {
    fontSize: '0.7rem',
  },
  confidenceCell: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-sm)',
  },
  confidenceBar: {
    width: '60px',
  },
  activityList: {
    padding: 'var(--spacing-md)',
  },
  activityItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 'var(--spacing-md)',
    padding: 'var(--spacing-md)',
    borderRadius: 'var(--radius-md)',
    transition: 'background var(--transition-fast)',
  },
  activityIcon: {
    fontSize: '1.25rem',
    flexShrink: 0,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: '0.875rem',
    color: 'var(--color-text-primary)',
    marginBottom: 'var(--spacing-xs)',
  },
  activityMeta: {
    fontSize: '0.75rem',
    color: 'var(--color-text-muted)',
  },
};

export default DashboardPage;
