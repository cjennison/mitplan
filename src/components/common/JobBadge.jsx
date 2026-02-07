import PropTypes from 'prop-types';
import { getJobDisplayInfo } from '../../utils/ffxivData';
import styles from './JobBadge.module.css';

const JobBadge = ({ job, role: explicitRole, className = '' }) => {
  if (!job) return null;

  const { displayName, role } = getJobDisplayInfo(job);
  const finalRole = explicitRole || role || 'dps';

  return <span className={`${styles.badge} ${styles[finalRole]} ${className}`}>{displayName}</span>;
};

JobBadge.propTypes = {
  job: PropTypes.string.isRequired,
  role: PropTypes.string,
  className: PropTypes.string,
};

export default JobBadge;
