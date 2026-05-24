import { useState, useMemo, useCallback } from 'react';
import Navbar from './components/Navbar';
import FilterSidebar from './components/FilterSidebar';
import InternshipCard from './components/InternshipCard';
import SkeletonCard from './components/SkeletonCard';
import FilterChips from './components/FilterChips';
import { useInternships } from './hooks/useInternships';
import {
  applyFilters,
  sortInternships,
  extractOptions,
  countActiveFilters,
  INITIAL_FILTERS,
} from './utils/filterUtils';
import {
  SlidersHorizontal,
  X,
  SearchX,
  Info,
  ChevronDown,
} from 'lucide-react';
import styles from './App.module.css';

export default function App() {
  const { internships, loading, usingFallback } = useInternships();
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [sortKey, setSortKey] = useState('newest');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  /* ── Handlers ── */
  const handleFilterChange = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleSearchChange = useCallback((query) => {
    setFilters(prev => ({ ...prev, query }));
  }, []);

  const handleReset = useCallback(() => {
    setFilters(INITIAL_FILTERS);
  }, []);

  /* ── Derived data ── */
  const filterOptions = useMemo(() => extractOptions(internships), [internships]);
  const activeCount   = countActiveFilters(filters);

  const results = useMemo(() => {
    const filtered = applyFilters(internships, filters);
    return sortInternships(filtered, sortKey);
  }, [internships, filters, sortKey]);

  /* ── Render ── */
  return (
    <div className={styles.app}>
      <Navbar searchQuery={filters.query} onSearchChange={handleSearchChange} />

      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <h1 className={styles.heroHeading}>
            Find the best <span className={styles.heroHighlight}>internships</span>
          </h1>
          <p className={styles.heroSub}>
            {loading
              ? 'Fetching listings…'
              : `${internships.length.toLocaleString()} internships across India`}
          </p>
        </div>
      </section>

      {/* ── Page body ── */}
      <div className={styles.pageBody}>

        {/* ── Mobile filter toggle bar ── */}
        <div className={styles.mobileBar}>
          <button
            className={styles.mobileFilterBtn}
            onClick={() => setMobileSidebarOpen(true)}
          >
            <SlidersHorizontal size={15} />
            Filters
            {activeCount > 0 && (
              <span className={styles.mobileBadge}>{activeCount}</span>
            )}
            <ChevronDown size={14} />
          </button>
          <span className={styles.mobileCount}>{results.length} internships</span>
        </div>

        <div className={styles.columns}>
          {/* ── Mobile overlay ── */}
          {mobileSidebarOpen && (
            <div
              className={styles.overlay}
              onClick={() => setMobileSidebarOpen(false)}
            />
          )}

          {/* ── Sidebar ── */}
          <div className={`${styles.sidebarCol} ${mobileSidebarOpen ? styles.sidebarOpen : ''}`}>
            {mobileSidebarOpen && (
              <div className={styles.mobileSidebarHeader}>
                <span className={styles.mobileSidebarTitle}>Filters</span>
                <button onClick={() => setMobileSidebarOpen(false)}>
                  <X size={20} />
                </button>
              </div>
            )}
            <FilterSidebar
              filters={filters}
              onChange={handleFilterChange}
              options={filterOptions}
              onReset={handleReset}
            />
          </div>

          {/* ── Results ── */}
          <main className={styles.resultsCol}>
            {/* Results toolbar */}
            <div className={styles.toolbar}>
              <div className={styles.toolbarLeft}>
                <p className={styles.resultsCount}>
                  {loading
                    ? 'Loading…'
                    : <><strong>{results.length}</strong> internships found</>
                  }
                </p>
                <FilterChips filters={filters} onChange={handleFilterChange} />
              </div>
              <div className={styles.toolbarRight}>
                <label className={styles.sortLabel} htmlFor="sort">Sort by:</label>
                <select
                  id="sort"
                  className={styles.sortSelect}
                  value={sortKey}
                  onChange={e => setSortKey(e.target.value)}
                >
                  <option value="newest">Newest first</option>
                  <option value="stipend_desc">Highest stipend</option>
                </select>
              </div>
            </div>

            {/* Fallback notice */}
            {usingFallback && !loading && (
              <div className={styles.notice}>
                <Info size={15} />
                <span>
                  Live API blocked by browser (CORS). Showing sample data — all filters work the same.
                </span>
              </div>
            )}

            {/* Card grid */}
            {loading ? (
              <div className={styles.grid}>
                {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : results.length === 0 ? (
              <div className={styles.empty}>
                <SearchX size={52} className={styles.emptyIcon} />
                <h3 className={styles.emptyTitle}>No internships found</h3>
                <p className={styles.emptyText}>
                  Try adjusting your filters or clearing the search.
                </p>
                <button className={styles.clearBtn} onClick={handleReset}>
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className={styles.grid}>
                {results.map(item => (
                  <InternshipCard key={item.id} internship={item} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* ── Footer ── */}
      <footer className={styles.footer}>
        <p>© 2024 Internshala Clone · Built for SDE Internship Assignment</p>
      </footer>
    </div>
  );
}
