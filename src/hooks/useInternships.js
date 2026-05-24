import { useState, useEffect } from 'react';
import { SEED_INTERNSHIPS } from '../data/seedData';

const API_URL = 'https://internshala.com/hiring/search';

/**
 * Normalize raw API internship object to our expected shape.
 */
function normalize(raw) {
  return {
    id: raw.id,
    title: raw.title,
    profile_name: raw.profile_name,
    company_name: raw.company_name,
    company_logo: raw.company_logo,
    work_from_home: raw.work_from_home,
    location_names: raw.location_names || [],
    start_date: raw.start_date,
    duration: raw.duration,
    stipend: raw.stipend,
    posted_by_label: raw.posted_by_label,
    is_ppo: raw.is_ppo,
    part_time: raw.part_time,
    actively_hiring: raw.application_status_message?.to_show ?? false,
  };
}

/**
 * Custom hook that:
 *  1. Attempts to fetch live data from Internshala API
 *  2. Falls back to seed data on CORS / network failure
 */
export function useInternships() {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

    async function fetchInternships() {
      try {
        const res = await fetch(API_URL, {
          signal: controller.signal,
          headers: { Accept: 'application/json' },
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const json = await res.json();
        const meta = json?.internships_meta ?? {};
        const list = Object.values(meta).map(normalize);

        if (list.length === 0) throw new Error('Empty response');

        setInternships(list);
        setUsingFallback(false);
      } catch (err) {
        if (err.name === 'AbortError') return;
        // CORS / network error — use seed data silently
        setInternships(SEED_INTERNSHIPS);
        setUsingFallback(true);
      } finally {
        clearTimeout(timeoutId);
        setLoading(false);
      }
    }

    fetchInternships();
    return () => {
      controller.abort();
      clearTimeout(timeoutId);
    };
  }, []);

  return { internships, loading, usingFallback };
}
