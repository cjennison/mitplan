import PropTypes from 'prop-types';
import { getJobDisplayInfo } from '../../utils/ffxivData';
import styles from './JobBadge.module.css';

/**
 * JobBadge - Displays a job or job type badge with appropriate styling
 *
 * Supports both specific jobs (WAR, SCH, etc.) and job types (Tank, Healer, Melee, etc.)
 */
const JobBadge = ({ job, role: explicitRole, className = '' }) => {
  if (!job) return null;

  // Get display info (works for both specific jobs and job types)
  const { displayName, role } = getJobDisplayInfo(job);

  // Use explicit role if provided, otherwise use determined role
  const finalRole = explicitRole || role || 'dps';

  return <span className={`${styles.badge} ${styles[finalRole]} ${className}`}>{displayName}</span>;
};

JobBadge.propTypes = {
  job: PropTypes.string.isRequired,
  role: PropTypes.string,
  className: PropTypes.string,
};

export default JobBadge;
