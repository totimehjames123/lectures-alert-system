/**
 * Formats a date string into a relative time (e.g., "2 days ago", "now", "yesterday").
 * @param {string} isoDate - The ISO date string to format.
 * @returns {string} - The formatted relative time.
 */
export const formatRelativeTime = (isoDate) => {
    const date = new Date(isoDate);
    const now = new Date();
    
    const secondsAgo = Math.floor((now - date) / 1000);
    const minutesAgo = Math.floor(secondsAgo / 60);
    const hoursAgo = Math.floor(minutesAgo / 60);
    const daysAgo = Math.floor(hoursAgo / 24);
    const monthsAgo = Math.floor(daysAgo / 30);  // Rough approximation
    const yearsAgo = Math.floor(daysAgo / 365);  // Rough approximation
  
    if (secondsAgo < 60) {
      return 'now';
    } else if (minutesAgo === 1) {
      return '1 min ago';
    } else if (minutesAgo < 60) {
      return `${minutesAgo} min ago`;
    } else if (hoursAgo === 1) {
      return '1 hour ago';
    } else if (hoursAgo < 24) {
      return `${hoursAgo} hrs ago`;
    } else if (daysAgo === 1) {
      return 'yesterday';
    } else if (daysAgo < 30) {
      return `${daysAgo} days ago`;
    } else if (monthsAgo === 1) {
      return '1 mon ago';
    } else if (monthsAgo < 12) {
      return `${monthsAgo} mons ago`;
    } else if (yearsAgo === 1) {
      return '1 yr ago';
    } else {
      return `${yearsAgo} yrs ago`;
    }
  };
  
  