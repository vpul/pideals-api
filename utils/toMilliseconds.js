// converts to milliseconds

module.exports = (ttl) => {
  const formattedTTL = Number(ttl.slice(0, -1));
  if (ttl.slice(-1) === 's') {
    return 1000 * formattedTTL;
  }
  if (ttl.slice(-1) === 'm') {
    return 1000 * 60 * formattedTTL;
  }
  if (ttl.slice(-1) === 'h') {
    return 1000 * 60 * 60 * formattedTTL;
  }
  if (ttl.slice(-1) === 'd') {
    return 1000 * 60 * 60 * 24 * formattedTTL;
  }
  throw new Error('Invalid data format');
};
