const getPagination = (query) => {
  const page = Math.max(Number(query.page || 1), 1);
  const pageSize = Math.min(Math.max(Number(query.page_size || 10), 1), 50);

  return {
    page,
    pageSize,
    offset: (page - 1) * pageSize,
  };
};

module.exports = {
  getPagination,
};
