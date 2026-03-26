import { useEffect, useState } from 'react';
import { Button, Form, Grid, Segment, Table } from 'semantic-ui-react';
import api, { normalizeApiError } from '../api';
import HeaderPageComponent from '../components/HeaderPageComponent';
import LoadingComponent from '../components/LoadingComponent';
import { formatCurrency, formatDateTime } from '../utils/formatters';

const InventoryPage = ({ onNotify }) => {
  const [loading, setLoading] = useState(true);
  const [inventory, setInventory] = useState([]);
  const [movements, setMovements] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    stock_state: 'all',
    movement_type: '',
  });

  const loadData = async (appliedFilters = filters) => {
    try {
      setLoading(true);
      const [inventoryResponse, movementsResponse] = await Promise.all([
        api.inventory.list({
          search: appliedFilters.search,
          stock_state: appliedFilters.stock_state,
          page_size: 25,
        }),
        api.inventory.movements({
          movement_type: appliedFilters.movement_type || undefined,
          page_size: 10,
        }),
      ]);
      setInventory(inventoryResponse.data);
      setMovements(movementsResponse.data);
    } catch (error) {
      const normalizedError = normalizeApiError(error);
      onNotify({
        type: 'error',
        title: 'No fue posible cargar inventario',
        message: normalizedError.message,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return <LoadingComponent text="Cargando inventario..." />;
  }

  const lowStockItems = inventory.filter(
    (product) => Number(product.stock_quantity) <= Number(product.minimum_stock)
  ).length;
  const outOfStockItems = inventory.filter((product) => Number(product.stock_quantity) === 0).length;

  return (
    <>
      <HeaderPageComponent
        title="Inventario y movimientos"
        description="Consulta existencias actuales y trazabilidad por compras o ventas."
      />
      <Grid stackable columns={3}>
        <Grid.Row>
          <Grid.Column>
            <Segment className="metric-card surface-segment" padded="very">
              <div className="metric-value">{inventory.length}</div>
              <p className="muted-copy">Productos visibles</p>
            </Segment>
          </Grid.Column>
          <Grid.Column>
            <Segment className="metric-card surface-segment" padded="very">
              <div className="metric-value">{lowStockItems}</div>
              <p className="muted-copy">Bajo stock</p>
            </Segment>
          </Grid.Column>
          <Grid.Column>
            <Segment className="metric-card surface-segment" padded="very">
              <div className="metric-value">{outOfStockItems}</div>
              <p className="muted-copy">Sin existencias</p>
            </Segment>
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <Segment className="surface-segment" padded="very">
        <Form>
          <Form.Group widths="equal">
            <Form.Input
              label="Buscar producto"
              value={filters.search}
              onChange={(_, { value }) => setFilters((current) => ({ ...current, search: value }))}
            />
            <Form.Select
              label="Estado de stock"
              options={[
                { key: 'all', text: 'Todos', value: 'all' },
                { key: 'low', text: 'Bajo stock', value: 'low' },
                { key: 'out', text: 'Sin existencias', value: 'out' },
              ]}
              value={filters.stock_state}
              onChange={(_, { value }) => setFilters((current) => ({ ...current, stock_state: value }))}
            />
            <Form.Select
              label="Tipo de movimiento"
              options={[
                { key: '', text: 'Todos', value: '' },
                { key: 'PURCHASE', text: 'Compras', value: 'PURCHASE' },
                { key: 'SALE', text: 'Ventas', value: 'SALE' },
              ]}
              value={filters.movement_type}
              onChange={(_, { value }) =>
                setFilters((current) => ({ ...current, movement_type: value }))
              }
            />
          </Form.Group>
          <Button primary className="storepilot-button" onClick={() => loadData(filters)}>
            Aplicar filtros
          </Button>
        </Form>
      </Segment>
      <Segment className="surface-segment" padded="very">
        <HeaderPageComponent
          title="Existencias actuales"
          description="Estado actual del catálogo activo."
        />
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Producto</Table.HeaderCell>
              <Table.HeaderCell>SKU</Table.HeaderCell>
              <Table.HeaderCell>Existencia</Table.HeaderCell>
              <Table.HeaderCell>Stock mínimo</Table.HeaderCell>
              <Table.HeaderCell>Costo promedio</Table.HeaderCell>
              <Table.HeaderCell>Precio</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {inventory.map((product) => (
              <Table.Row key={product.product_id}>
                <Table.Cell>{product.name}</Table.Cell>
                <Table.Cell>{product.sku}</Table.Cell>
                <Table.Cell>{product.stock_quantity}</Table.Cell>
                <Table.Cell>{product.minimum_stock}</Table.Cell>
                <Table.Cell>{formatCurrency(product.average_cost || 0)}</Table.Cell>
                <Table.Cell>{formatCurrency(product.sale_price)}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Segment>
      <Segment className="surface-segment" padded="very">
        <HeaderPageComponent
          title="Movimientos recientes"
          description="Entradas y salidas registradas del inventario."
        />
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Fecha</Table.HeaderCell>
              <Table.HeaderCell>Producto</Table.HeaderCell>
              <Table.HeaderCell>Tipo</Table.HeaderCell>
              <Table.HeaderCell>Cambio</Table.HeaderCell>
              <Table.HeaderCell>Saldo</Table.HeaderCell>
              <Table.HeaderCell>Nota</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {movements.map((movement) => (
              <Table.Row key={movement.inventory_movement_id}>
                <Table.Cell>{formatDateTime(movement.creation_date)}</Table.Cell>
                <Table.Cell>{movement.product_name}</Table.Cell>
                <Table.Cell>{movement.movement_type}</Table.Cell>
                <Table.Cell>{movement.quantity_change}</Table.Cell>
                <Table.Cell>{movement.balance_after}</Table.Cell>
                <Table.Cell>{movement.notes}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Segment>
    </>
  );
};

export default InventoryPage;
