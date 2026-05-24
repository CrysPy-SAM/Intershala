import { useState } from 'react';
import { ChevronDown, ChevronUp, SlidersHorizontal, RotateCcw } from 'lucide-react';
import {
  DURATION_PRESETS,
  STIPEND_PRESETS,
  countActiveFilters,
} from '../utils/filterUtils';
import styles from './FilterSidebar.module.css';

// ─── Collapsible section wrapper ─────────────────────────────────────────────
function Section({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={styles.section}>
      <button
        className={styles.sectionHeader}
        onClick={() => setOpen(p => !p)}
        aria-expanded={open}
      >
        <span className={styles.sectionTitle}>{title}</span>
        {open ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
      </button>
      {open && <div className={styles.sectionBody}>{children}</div>}
    </div>
  );
}

// ─── Radio option ─────────────────────────────────────────────────────────────
function RadioOption({ name, value, checked, onChange, label }) {
  return (
    <label className={`${styles.option} ${checked ? styles.optionActive : ''}`}>
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        className={styles.radio}
      />
      <span className={styles.optionLabel}>{label}</span>
    </label>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function FilterSidebar({ filters, onChange, options, onReset }) {
  const activeCount = countActiveFilters(filters);

  return (
    <aside className={styles.sidebar}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <SlidersHorizontal size={16} />
          <span className={styles.headerTitle}>Filters</span>
          {activeCount > 0 && (
            <span className={styles.badge}>{activeCount}</span>
          )}
        </div>
        {activeCount > 0 && (
          <button className={styles.resetBtn} onClick={onReset}>
            <RotateCcw size={13} />
            Reset
          </button>
        )}
      </div>

      {/* ── Profile ── */}
      <Section title="Profile">
        <RadioOption
          name="profile" value="" label="All Profiles"
          checked={!filters.profile}
          onChange={() => onChange('profile', '')}
        />
        {options.profiles.map(p => (
          <RadioOption
            key={p} name="profile" value={p} label={p}
            checked={filters.profile === p}
            onChange={v => onChange('profile', v)}
          />
        ))}
      </Section>

      {/* ── Location ── */}
      <Section title="Location">
        <RadioOption
          name="location" value="" label="All Locations"
          checked={!filters.location}
          onChange={() => onChange('location', '')}
        />
        {options.locations.map(l => (
          <RadioOption
            key={l} name="location" value={l} label={l}
            checked={filters.location === l}
            onChange={v => onChange('location', v)}
          />
        ))}
      </Section>

      {/* ── Work Type ── */}
      <Section title="Work Type">
        {[
          { label: 'All',          value: 'all' },
          { label: 'Work From Home', value: 'wfh' },
          { label: 'In Office',    value: 'office' },
          { label: 'Part-time',    value: 'parttime' },
        ].map(opt => (
          <RadioOption
            key={opt.value} name="workType" value={opt.value} label={opt.label}
            checked={filters.workType === opt.value}
            onChange={v => onChange('workType', v)}
          />
        ))}
      </Section>

      {/* ── Duration ── */}
      <Section title="Duration">
        {DURATION_PRESETS.map(opt => (
          <RadioOption
            key={opt.label} name="duration" value={opt.value} label={opt.label}
            checked={filters.duration === opt.value}
            onChange={() => onChange('duration', opt.value)}
          />
        ))}
      </Section>

      {/* ── Stipend ── */}
      <Section title="Desired Stipend">
        {STIPEND_PRESETS.map(opt => (
          <RadioOption
            key={opt.label} name="stipend" value={opt.value} label={opt.label}
            checked={filters.stipend === opt.value}
            onChange={() => onChange('stipend', opt.value)}
          />
        ))}
      </Section>
    </aside>
  );
}
