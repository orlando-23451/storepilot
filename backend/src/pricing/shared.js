const buildSuggestion = (product, targetMarginPercent) => {
  const cost = product.average_cost === null ? null : Number(product.average_cost);
  const calculable = cost !== null && cost > 0;
  const suggestedPrice = calculable
    ? Number((cost / (1 - targetMarginPercent / 100)).toFixed(2))
    : null;
  const marginPercent =
    calculable && Number(product.sale_price) > 0
      ? Number((((Number(product.sale_price) - cost) / Number(product.sale_price)) * 100).toFixed(2))
      : null;

  return {
    ...product,
    calculable,
    target_margin_percent: targetMarginPercent,
    suggested_price: suggestedPrice,
    estimated_margin_percent: marginPercent,
    warning: calculable
      ? null
      : 'Este producto no tiene un costo confiable para calcular sugerencia.',
  };
};

module.exports = {
  buildSuggestion,
};
