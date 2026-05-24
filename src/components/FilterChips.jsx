import { X } from 'lucide-react';
import { DURATION_PRESETS, STIPEND_PRESETS } from '../utils/filterUtils';
import styles from './FilterChips.module.css';

export default function FilterChips({ filters, onChange }) {
  const chips = [];

  if (filters.profile)
    chips.push({ key: 'profile', label: filters.profile, clear: () => onChange('profile', '') });

  if (filters.location)
    chips.push({ key: 'location', label: filters.location, clear: () => onChange('location', '') });

  if (filters.workType !== 'all') {
    const labels = { wfh: 'Work From Home', office: 'In Office', parttime: 'Part-time' };
    chips.push({ key: 'workType', label: labels[filters.workType], clear: () => onChange('workType', 'all') });
  }

  if (filters.duration !== null) {
    const opt = DURATION_PRESETS.find(o => o.value === filters.duration);
    if (opt) chips.push({ key: 'duration', label: opt.label, clear: () => onChange('duration', null) });
  }

  if (filters.stipend !== null) {
    const opt = STIPEND_PRESETS.find(o => o.value === filters.stipend);
    if (opt) chips.push({ key: 'stipend', label: opt.label, clear: () => onChange('stipend', null) });
  }

  if (chips.length === 0) return null;

  return (
    <div className={styles.chips}>
      {chips.map(chip => (
        <span key={chip.key} className={styles.chip}>
          {chip.label}
          <button className={styles.remove} onClick={chip.clear} aria-label={`Remove ${chip.label}`}>
            <X size={11} />
          </button>
        </span>
      ))}
    </div>
  );
}
