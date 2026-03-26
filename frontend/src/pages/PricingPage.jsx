import { useEffect, useState } from 'react';
import { Button, Form, Header, Input, Segment, Table } from 'semantic-ui-react';
import api, { normalizeApiError } from '../api';
import HeaderPageComponent from '../components/HeaderPageComponent';
import LoadingComponent from '../components/LoadingComponent';
import { formatCurrency, formatPercent } from '../utils/formatters';

const PricingPage = ({ onNotify }) => {
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({ target_margin_percent: 30 });
  const [suggestions, setSuggestions] = useState([]);
  const [search, setSearch] = useState('');
  const [saving, setSaving] = useState(false);

  const loadData = async (nextSearch = search) => {
    try {
      setLoading(true);
      const [settingsResponse, suggestionsResponse] = await Promise.all([
        api.pricing.settings(),
        api.pricing.suggestions({ search: nextSearch, page_size: 25 }),
      ]);
      setSettings(settingsResponse.data);
      setSuggestions(suggestionsResponse.data);
    } catch (error) {
      const normalizedError = normalizeApiError(error);
      onNotify({
        type: 'error',
        title: 'No fue posible cargar sugerencias de precio',
        message: normalizedError.message,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const updateMargin = async () => {
    try {
      setSaving(true);
      await api.pricing.updateSettings({
        target_margin_percent: Number(settings.target_margin_percent),
      });
      onNotify({
        type: 'success',
        title: 'Margen objetivo actualizado',
        message: 'Las sugerencias de precio fueron recalculadas con el nuevo margen.',
      });
      loadData(search);
    } catch (error) {
      const normalizedError = normalizeApiError(error);
      onNotify({
        type: 'error',
        title: 'No fue posible actualizar el margen',
        message: normalizedError.message,
      });
    } finally {
      setSaving(false);
    }
  };

  const applySuggestedPrice = async (productId, suggestedPrice) => {
    try {
      const productResponse = await api.products.get(productId);
      const product = productResponse.data;
      await api.products.update(productId, {
        category_id: product.category_id,
        sku: product.sku,
        barcode: product.barcode || '',
        name: product.name,
        description: product.description || '',
        sale_price: suggestedPrice,
        minimum_stock: product.minimum_stock,
        active: Boolean(product.active),
      });
      onNotify({
        type: 'success',
        title: 'Precio actualizado',
        message: `El producto ${product.name} recibió el precio sugerido.`,
      });
      loadData(search);
    } catch (error) {
      const normalizedError = normalizeApiError(error);
      onNotify({
        type: 'error',
        title: 'No fue posible aplicar el precio',
        message: normalizedError.message,
      });
    }
  };

  if (loading) {
    return <LoadingComponent text="Calculando sugerencias de precio..." />;
  }

  const calculableSuggestions = suggestions.filter((item) => item.calculable);
  const estimatedImpact = calculableSuggestions.reduce(
    (accumulator, item) => accumulator + (Number(item.suggested_price) - Number(item.sale_price)),
    0
  );

  return (
    <>
      <HeaderPageComponent
        title="Sugerencias de precio"
        description="Optimiza rentabilidad con una regla simple basada en costo promedio y margen objetivo."
      />
      <Segment className="surface-segment" padded="very">
        <Header as="h3">Margen objetivo sugerido</Header>
        <p className="metric-value">{Number(settings.target_margin_percent).toFixed(0)}%</p>
        <Form.Field>
          <input
            type="range"
            min="5"
            max="75"
            value={settings.target_margin_percent}
            onChange={(event) =>
              setSettings((current) => ({
                ...current,
                target_margin_percent: Number(event.target.value),
              }))
            }
            style={{ width: '100%' }}
          />
        </Form.Field>
        <Segment secondary>
          <strong>Impacto estimado en precio:</strong> {formatCurrency(estimatedImpact)}
        </Segment>
        <Button
          primary
          className="storepilot-button"
          loading={saving}
          disabled={saving}
          onClick={updateMargin}
        >
          Recalcular sugerencias
        </Button>
      </Segment>
      <Segment className="surface-segment" padded="very">
        <Input
          fluid
          icon="search"
          placeholder="Buscar producto por nombre o SKU"
          value={search}
          onChange={(_, { value }) => setSearch(value)}
          action={{
            color: 'blue',
            content: 'Buscar',
            onClick: () => loadData(search),
          }}
        />
      </Segment>
      <Segment className="surface-segment" padded="very">
        <HeaderPageComponent
          title="Revisión individual de precios"
          description="Aplica el sugerido solo cuando el costo sea confiable y la decisión sea válida para la tienda."
        />
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Producto</Table.HeaderCell>
              <Table.HeaderCell>Costo promedio</Table.HeaderCell>
              <Table.HeaderCell>Precio actual</Table.HeaderCell>
              <Table.HeaderCell>Sugerido</Table.HeaderCell>
              <Table.HeaderCell>Margen actual</Table.HeaderCell>
              <Table.HeaderCell>Acción</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {suggestions.map((item) => (
              <Table.Row key={item.product_id}>
                <Table.Cell>
                  <strong>{item.name}</strong>
                  <div className="muted-copy">{item.sku}</div>
                </Table.Cell>
                <Table.Cell>{formatCurrency(item.average_cost || 0)}</Table.Cell>
                <Table.Cell>{formatCurrency(item.sale_price)}</Table.Cell>
                <Table.Cell>
                  {item.calculable ? formatCurrency(item.suggested_price) : 'No calculable'}
                </Table.Cell>
                <Table.Cell>{formatPercent(item.estimated_margin_percent)}</Table.Cell>
                <Table.Cell>
                  {item.calculable ? (
                    <Button
                      basic
                      color="blue"
                      size="small"
                      onClick={() => applySuggestedPrice(item.product_id, item.suggested_price)}
                    >
                      Aplicar sugerido
                    </Button>
                  ) : (
                    <span className="muted-copy">{item.warning}</span>
                  )}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Segment>
    </>
  );
};

export default PricingPage;
