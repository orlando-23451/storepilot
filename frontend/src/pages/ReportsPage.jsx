import { useEffect, useState } from 'react';
import { Button, Form, Grid, Segment, Table } from 'semantic-ui-react';
import api, { normalizeApiError } from '../api';
import HeaderPageComponent from '../components/HeaderPageComponent';
import LoadingComponent from '../components/LoadingComponent';
import { formatCurrency, formatPercent } from '../utils/formatters';

const today = new Date().toISOString().slice(0, 10);

const ReportsPage = ({ onNotify }) => {
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    start_date: today,
    end_date: today,
  });
  const [reportData, setReportData] = useState(null);

  const loadReport = async (appliedFilters = filters) => {
    try {
      setLoading(true);
      const response = await api.reports.summary(appliedFilters);
      setReportData(response.data);
    } catch (error) {
      const normalizedError = normalizeApiError(error);
      onNotify({
        type: 'error',
        title: 'No fue posible cargar el reporte',
        message: normalizedError.message,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReport();
  }, []);

  if (loading) {
    return <LoadingComponent text="Cargando reportes..." />;
  }

  return (
    <>
      <HeaderPageComponent
        title="Reportes operativos"
        description="Consulta ventas, compras, inventario y productos de bajo margen."
      />
      <Segment className="surface-segment" padded="very">
        <Form>
          <Form.Group widths="equal">
            <Form.Input
              label="Fecha inicial"
              type="date"
              value={filters.start_date}
              onChange={(_, { value }) => setFilters((current) => ({ ...current, start_date: value }))}
            />
            <Form.Input
              label="Fecha final"
              type="date"
              value={filters.end_date}
              onChange={(_, { value }) => setFilters((current) => ({ ...current, end_date: value }))}
            />
          </Form.Group>
          <Button primary className="storepilot-button" onClick={() => loadReport(filters)}>
            Actualizar reporte
          </Button>
        </Form>
      </Segment>
      <Grid stackable columns={4}>
        <Grid.Row>
          <Grid.Column>
            <Segment className="metric-card surface-segment" padded="very">
              <div className="metric-value">{reportData.sales.total_sales}</div>
              <p className="muted-copy">Ventas del periodo</p>
            </Segment>
          </Grid.Column>
          <Grid.Column>
            <Segment className="metric-card surface-segment" padded="very">
              <div className="metric-value">{formatCurrency(reportData.sales.gross_sales)}</div>
              <p className="muted-copy">Importe vendido</p>
            </Segment>
          </Grid.Column>
          <Grid.Column>
            <Segment className="metric-card surface-segment" padded="very">
              <div className="metric-value">{reportData.purchases.total_purchases}</div>
              <p className="muted-copy">Compras del periodo</p>
            </Segment>
          </Grid.Column>
          <Grid.Column>
            <Segment className="metric-card surface-segment" padded="very">
              <div className="metric-value">{formatCurrency(reportData.inventory.estimated_inventory_value)}</div>
              <p className="muted-copy">Valor estimado del inventario</p>
            </Segment>
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <Segment className="surface-segment" padded="very">
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Indicador</Table.HeaderCell>
              <Table.HeaderCell>Valor</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell>Productos activos</Table.Cell>
              <Table.Cell>{reportData.inventory.total_products}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Productos con inventario crítico</Table.Cell>
              <Table.Cell>{reportData.inventory.low_stock_products}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Importe comprado</Table.Cell>
              <Table.Cell>{formatCurrency(reportData.purchases.gross_purchases)}</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      </Segment>
      <Segment className="surface-segment" padded="very">
        <HeaderPageComponent
          title="Productos con menor margen"
          description="Prioriza revisión comercial sobre estos productos."
        />
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Producto</Table.HeaderCell>
              <Table.HeaderCell>SKU</Table.HeaderCell>
              <Table.HeaderCell>Costo promedio</Table.HeaderCell>
              <Table.HeaderCell>Precio actual</Table.HeaderCell>
              <Table.HeaderCell>Margen actual</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {reportData.low_margin_products.map((item) => (
              <Table.Row key={item.product_id}>
                <Table.Cell>{item.name}</Table.Cell>
                <Table.Cell>{item.sku}</Table.Cell>
                <Table.Cell>{formatCurrency(item.average_cost || 0)}</Table.Cell>
                <Table.Cell>{formatCurrency(item.sale_price)}</Table.Cell>
                <Table.Cell>{formatPercent(item.current_margin_percent)}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Segment>
    </>
  );
};

export default ReportsPage;
