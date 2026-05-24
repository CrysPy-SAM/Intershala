import { MapPin, Clock, Calendar, BadgeIndianRupee, Bookmark, ExternalLink, Zap } from 'lucide-react';
import styles from './InternshipCard.module.css';

const LOGO_CDN = 'https://internshala-uploads.internshala.com/logo/';

function Avatar({ logo, name }) {
  const initials = (name || '?')
    .split(' ')
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase();

  if (logo) {
    return (
      <div className={styles.avatarWrap}>
        <img
          src={`${LOGO_CDN}${logo}`}
          alt={name}
          className={styles.logoImg}
          onError={e => {
            e.currentTarget.style.display = 'none';
            e.currentTarget.nextSibling.style.display = 'flex';
          }}
        />
        <div className={styles.logoFallback} style={{ display: 'none' }}>
          {initials}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.avatarWrap}>
      <div className={styles.logoFallback}>{initials}</div>
    </div>
  );
}

export default function InternshipCard({ internship }) {
  const {
    title, company_name, company_logo,
    work_from_home, location_names,
    start_date, duration, stipend,
    posted_by_label, is_ppo, part_time,
    profile_name, actively_hiring,
  } = internship;

  const isNew    = posted_by_label === 'Today';
  const locLabel = work_from_home
    ? 'Work From Home'
    : location_names.slice(0, 2).join(' / ')
      + (location_names.length > 2 ? ` +${location_names.length - 2}` : '');

  return (
    <article className={`${styles.card} ${isNew ? styles.cardNew : ''}`}>

      {/* ── Top badges row ── */}
      <div className={styles.topRow}>
        <div className={styles.badges}>
          {isNew && (
            <span className={`${styles.badge} ${styles.badgeNew}`}>
              <Zap size={10} /> Actively hiring
            </span>
          )}
          {is_ppo && (
            <span className={`${styles.badge} ${styles.badgePpo}`}>PPO</span>
          )}
          {part_time && (
            <span className={`${styles.badge} ${styles.badgePart}`}>Part-time</span>
          )}
          {work_from_home && (
            <span className={`${styles.badge} ${styles.badgeWfh}`}>Remote</span>
          )}
        </div>
        <button className={styles.bookmarkBtn} aria-label="Save">
          <Bookmark size={16} />
        </button>
      </div>

      {/* ── Identity ── */}
      <div className={styles.identity}>
        <Avatar logo={company_logo} name={company_name} />
        <div className={styles.titleBlock}>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.company}>{company_name}</p>
        </div>
      </div>

      {/* ── Profile tag ── */}
      <span className={styles.profileTag}>{profile_name}</span>

      {/* ── Meta grid ── */}
      <ul className={styles.metaGrid}>
        <li className={styles.metaItem}>
          <MapPin size={13} className={styles.metaIcon} />
          <span>{locLabel}</span>
        </li>
        <li className={styles.metaItem}>
          <Calendar size={13} className={styles.metaIcon} />
          <span>{start_date}</span>
        </li>
        <li className={styles.metaItem}>
          <Clock size={13} className={styles.metaIcon} />
          <span>{duration}</span>
        </li>
        <li className={`${styles.metaItem} ${styles.stipend}`}>
          <BadgeIndianRupee size={13} className={styles.metaIcon} />
          <span>{stipend?.salary ?? 'Unpaid'}</span>
        </li>
      </ul>

      {/* ── Footer ── */}
      <div className={styles.footer}>
        <span className={styles.posted}>
          {posted_by_label === 'Today' ? '🟢 Posted today' : `Posted ${posted_by_label?.toLowerCase()}`}
        </span>
        <a
          href={
            internship.url
              ? `https://internshala.com/internship/${internship.url}`
              : `https://internshala.com/internships/${
                  (profile_name || 'internship')
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                }-internship`
          }
          target="_blank"
          rel="noopener noreferrer"
          className={styles.applyBtn}
        >
          Apply now
          <ExternalLink size={12} />
        </a>
      </div>
    </article>
  );
}
