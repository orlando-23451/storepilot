const log = (level, payload) => {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    ...payload,
  };

  console[level === 'error' ? 'error' : 'log'](JSON.stringify(entry));
};

module.exports = {
  info(payload) {
    log('info', payload);
  },
  warning(payload) {
    log('warning', payload);
  },
  error(payload) {
    log('error', payload);
  },
};
