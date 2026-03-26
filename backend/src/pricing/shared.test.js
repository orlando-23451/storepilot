const { buildSuggestion } = require('./shared');

describe('buildSuggestion', () => {
  test('calculates suggested price from average cost and target margin', () => {
    const suggestion = buildSuggestion(
      {
        product_id: 1,
        sale_price: 120,
        average_cost: 84,
      },
      30
    );

    expect(suggestion.calculable).toBe(true);
    expect(suggestion.suggested_price).toBe(120);
    expect(suggestion.estimated_margin_percent).toBe(30);
  });

  test('returns warning when product cost is missing', () => {
    const suggestion = buildSuggestion(
      {
        product_id: 2,
        sale_price: 120,
        average_cost: null,
      },
      30
    );

    expect(suggestion.calculable).toBe(false);
    expect(suggestion.suggested_price).toBeNull();
    expect(suggestion.warning).toMatch(/costo confiable/i);
  });
});
