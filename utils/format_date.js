function formatDate(isoString) {
  const date = new Date(isoString);
  
  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'long' });
  const year = date.getFullYear();

  // Add ordinal suffix (e.g., "st", "nd", "rd", "th")
  const ordinal = (n) => {
    if (n > 3 && n < 21) return 'th';
    switch (n % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };

  return `${day}${ordinal(day)} ${month}, ${year}`;
}


module.exports = {formatDate};