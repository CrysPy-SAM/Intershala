// ─── Constants ────────────────────────────────────────────────────────────────

export const DURATION_PRESETS = [
  { label: 'Any Duration', value: null },
  { label: '1 Month',      value: 1 },
  { label: '2 Months',     value: 2 },
  { label: '3 Months',     value: 3 },
  { label: '6 Months',     value: 6 },
];

export const STIPEND_PRESETS = [
  { label: 'Any Stipend',   value: null },
  { label: '₹ 2,000+',     value: 2000 },
  { label: '₹ 5,000+',     value: 5000 },
  { label: '₹ 10,000+',    value: 10000 },
  { label: '₹ 20,000+',    value: 20000 },
  { label: '₹ 40,000+',    value: 40000 },
];

export const INITIAL_FILTERS = {
  profile:    '',
  location:   '',
  duration:   null,  // max months
  stipend:    null,  // min value
  workType:   'all', // 'all' | 'wfh' | 'office' | 'parttime'
  query:      '',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Parse "3 Months" → 3
 */
export function parseDurationMonths(str = '') {
  const match = str.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

/**
 * Extract unique sorted values for filter dropdowns from live data.
 */
export function extractOptions(internships) {
  const profiles = [...new Set(
    internships.map(i => i.profile_name).filter(Boolean)
  )].sort();

  const locations = [...new Set(
    internships
      .flatMap(i => i.location_names)
      .filter(l => l && l !== 'Work From Home')
  )].sort();

  return { profiles, locations };
}

/**
 * Count how many filters are actively applied (excluding query).
 */
export function countActiveFilters(filters) {
  let n = 0;
  if (filters.profile)               n++;
  if (filters.location)              n++;
  if (filters.duration !== null)     n++;
  if (filters.stipend  !== null)     n++;
  if (filters.workType !== 'all')    n++;
  return n;
}

// ─── Core filter function ─────────────────────────────────────────────────────

/**
 * Apply all filters to the internship list.
 * Pure function — returns a new array.
 */
export function applyFilters(internships, filters) {
  return internships.filter(item => {
    // 1. Profile
    if (filters.profile && item.profile_name !== filters.profile) return false;

    // 2. Location
    if (filters.location) {
      const locs = item.location_names.map(l => l.toLowerCase());
      if (!locs.includes(filters.location.toLowerCase())) return false;
    }

    // 3. Duration (max months)
    if (filters.duration !== null) {
      if (parseDurationMonths(item.duration) > filters.duration) return false;
    }

    // 4. Stipend (minimum)
    if (filters.stipend !== null) {
      const val = item.stipend?.salaryValue1 ?? 0;
      if (val < filters.stipend) return false;
    }

    // 5. Work type
    if (filters.workType === 'wfh'     && !item.work_from_home)  return false;
    if (filters.workType === 'office'  &&  item.work_from_home)  return false;
    if (filters.workType === 'parttime'&& !item.part_time)        return false;

    // 6. Search query
    if (filters.query) {
      const q = filters.query.toLowerCase().trim();
      const haystack = [
        item.title,
        item.profile_name,
        item.company_name,
        ...item.location_names,
      ].join(' ').toLowerCase();
      if (!haystack.includes(q)) return false;
    }

    return true;
  });
}

// ─── Sort function ────────────────────────────────────────────────────────────

export function sortInternships(list, sortKey) {
  const copy = [...list];
  if (sortKey === 'stipend_desc') {
    copy.sort((a, b) => (b.stipend?.salaryValue1 ?? 0) - (a.stipend?.salaryValue1 ?? 0));
  }
  // 'newest' keeps original API order
  return copy;
}
