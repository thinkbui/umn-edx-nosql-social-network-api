const dayjs = require('dayjs');

const format_date = (date) => {
  return dayjs(date).format('MMMM DD, YYYY');
};

// Export the functions for use in seed.js
module.exports = {
  format_date,
};
