// ============================================================
// Navbar.jsx - Navigation Component
// Biometric Attendance System
// ============================================================

import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  const navLinks = [
    { path: '/', label: 'Dashboard', icon: '??' },
    { path: '/register', label: 'Register', icon: '?' },
    { path: '/scan', label: 'Scan', icon: '??' }
  ];

  return (
    <nav style={styles.navbar}>
      <div style={styles.container}>
        {/* Logo */}
        <NavLink to="/" style={styles.logoLink}>
          <div style={styles.logo}>
            {/* Biometric Eye Icon SVG */}
            <svg
              viewBox="0 0 40 40"
              style={styles.logoIcon}
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Outer ring */}
              <circle
                cx="20"
                cy="20"
                r="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                opacity="0.3"
              />
              {/* Middle ring */}
              <circle
                cx="20"
                cy="20"
                r="12"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                opacity="0.6"
              />
              {/* Inner eye */}
              <circle
                cx="20"
                cy="20"
                r="6"
                fill="currentColor"
              />
              {/* Pupil */}
              <circle
                cx="20"
                cy="20"
                r="2.5"
                fill="var(--color-bg-primary)"
              />
              {/* Scan lines */}
              <line
                x1="20"
                y1="2"
                x2="20"
                y2="8"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <line
                x1="20"
                y1="32"
                x2="20"
                y2="38"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <line
                x1="2"
                y1="20"
                x2="8"
                y2="20"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <line
                x1="32"
                y1="20"
                x2="38"
                y2="20"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            <span style={styles.logoText}>BioAuth</span>
          </div>
        </NavLink>

        {/* Navigation Links */}
        <div style={styles.navLinks}>
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                style={{
                  ...styles.navLink,
                  ...(isActive ? styles.navLinkActive : {})
                }}
              >
                <span style={styles.navIcon}>{link.icon}</span>
                <span>{link.label}</span>
                {isActive && <span style={styles.activeIndicator} />}
              </NavLink>
            );
          })}
        </div>

        {/* Status Indicator */}
        <div style={styles.status}>
          <span style={styles.statusDot} />
          <span style={styles.statusText}>System Online</span>
        </div>
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    height: '70px',
    background: 'rgba(10, 14, 23, 0.85)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderBottom: '1px solid var(--color-border-primary)',
    zIndex: 'var(--z-navbar)',
  },
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 var(--spacing-xl)',
  },
  logoLink: {
    textDecoration: 'none',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-sm)',
  },
  logoIcon: {
    width: '36px',
    height: '36px',
    color: 'var(--color-accent-primary)',
  },
  logoText: {
    fontFamily: 'var(--font-primary)',
    fontSize: '1.25rem',
    fontWeight: '700',
    color: 'var(--color-text-primary)',
    letterSpacing: '1px',
  },
  navLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-xs)',
  },
  navLink: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-sm)',
    padding: 'var(--spacing-sm) var(--spacing-lg)',
    color: 'var(--color-text-secondary)',
    textDecoration: 'none',
    fontSize: '0.9rem',
    fontWeight: '500',
    borderRadius: 'var(--radius-md)',
    transition: 'all var(--transition-fast)',
  },
  navLinkActive: {
    color: 'var(--color-accent-primary)',
    background: 'var(--color-accent-subtle)',
  },
  navIcon: {
    fontSize: '1rem',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: '-1px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '20px',
    height: '2px',
    background: 'var(--color-accent-primary)',
    borderRadius: 'var(--radius-full)',
    boxShadow: '0 0 10px var(--color-accent-glow)',
  },
  status: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-sm)',
  },
  statusDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: 'var(--color-success)',
    boxShadow: '0 0 10px var(--color-success-glow)',
    animation: 'pulse 2s infinite',
  },
  statusText: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.75rem',
    color: 'var(--color-text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
};

export default Navbar;
