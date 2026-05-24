import { useState } from 'react';
import { Search, Menu, X, ChevronDown } from 'lucide-react';
import styles from './Navbar.module.css';

export default function Navbar({ searchQuery, onSearchChange }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className={styles.navbar}>
      <div className={styles.inner}>

        {/* ── Logo ── */}
        <a href="/" className={styles.logo}>
          <span className={styles.logoBlue}>Internshala</span>
        </a>

        {/* ── Desktop Nav ── */}
        <nav className={styles.desktopNav}>
          <div className={styles.navGroup}>
            <button className={`${styles.navBtn} ${styles.active}`}>
              Internships <ChevronDown size={14} />
            </button>
            <button className={styles.navBtn}>
              Jobs <ChevronDown size={14} />
            </button>
            <button className={styles.navBtn}>
              Courses <ChevronDown size={14} />
            </button>
          </div>
        </nav>

        {/* ── Search ── */}
        <div className={styles.searchBox}>
          <Search size={15} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search role, skills, company…"
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            className={styles.searchInput}
          />
          {searchQuery && (
            <button
              className={styles.clearSearch}
              onClick={() => onSearchChange('')}
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* ── Auth ── */}
        <div className={styles.authGroup}>
          <button className={styles.loginBtn}>Login</button>
          <button className={styles.registerBtn}>Register free</button>
        </div>

        {/* ── Hamburger ── */}
        <button
          className={styles.hamburger}
          onClick={() => setMobileOpen(p => !p)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* ── Mobile drawer ── */}
      {mobileOpen && (
        <div className={styles.mobileDrawer}>
          <div className={styles.mobileSearch}>
            <Search size={15} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search role, skills, company…"
              value={searchQuery}
              onChange={e => onSearchChange(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          <nav className={styles.mobileLinks}>
            <a className={`${styles.mobileLink} ${styles.active}`}>Internships</a>
            <a className={styles.mobileLink}>Jobs</a>
            <a className={styles.mobileLink}>Courses</a>
          </nav>
          <div className={styles.mobileAuth}>
            <button className={styles.loginBtn}>Login</button>
            <button className={styles.registerBtn}>Register free</button>
          </div>
        </div>
      )}
    </header>
  );
}
