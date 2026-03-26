export const formatCurrency = (value) =>
  new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(Number(value || 0));

export const formatDate = (value) =>
  value
    ? new Intl.DateTimeFormat('es-MX', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }).format(new Date(value))
    : 'Sin fecha';

export const formatDateTime = (value) =>
  value
    ? new Intl.DateTimeFormat('es-MX', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(new Date(value))
    : 'Sin fecha';

export const formatPercent = (value) =>
  value === null || value === undefined ? 'Sin dato' : `${Number(value).toFixed(2)}%`;
