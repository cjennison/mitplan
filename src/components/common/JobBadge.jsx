import PropTypes from 'prop-types';
import { JOBS } from '../../utils/ffxivData';
import styles from './JobBadge.module.css';

const JobBadge = ({ job, role: explicitRole, className = '' }) => {
  if (!job) return null;

  // Determine role: use explicit prop, or look up from job code, or default to 'dps'
  const role = explicitRole || JOBS[job]?.role || 'dps';

  return (
    <span className={`${styles.badge} ${styles[role]} ${className}`}>
      {job}
    </span>
  );
};

JobBadge.propTypes = {
  job: PropTypes.string.isRequired,
  role: PropTypes.string,
  className: PropTypes.string,
};

export default JobBadge;
