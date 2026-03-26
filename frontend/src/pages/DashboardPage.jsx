import { useEffect, useState } from 'react';
import { Grid, Header, List, Segment, Statistic, Table } from 'semantic-ui-react';
import api, { normalizeApiError } from '../api';
import HeaderPageComponent from '../components/HeaderPageComponent';
import LoadingComponent from '../components/LoadingComponent';
import { formatCurrency, formatDate, formatPercent } from '../utils/formatters';

const DashboardPage = ({ user, onNotify }) => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const response = await api.dashboard.get();
        setDashboardData(response.data);
      } catch (error) {
        const normalizedError = normalizeApiError(error);
        onNotify({
          type: 'error',
          title: 'No fue posible cargar el dashboard',
          message: normalizedError.message,
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [onNotify]);

  if (loading) {
    return <LoadingComponent text="Cargando dashboard..." />;
  }

  if (dashboardData?.role_scope === 'cashier') {
    return (
      <>
        <HeaderPageComponent
          title="Ventas"
          description="Terminal operativa para registrar ventas del día."
        />
        <Grid stackable columns={2}>
          <Grid.Row>
            <Grid.Column>
              <Segment className="metric-card surface-segment" padded="very">
                <Statistic size="tiny" color="blue">
                  <Statistic.Value>{dashboardData.sales_today.sales_today}</Statistic.Value>
                  <Statistic.Label>Ventas registradas hoy</Statistic.Label>
                </Statistic>
              </Segment>
            </Grid.Column>
            <Grid.Column>
              <Segment className="metric-card surface-segment" padded="very">
                <Statistic size="tiny" color="blue">
                  <Statistic.Value>
                    {formatCurrency(dashboardData.sales_today.total_sales_amount)}
                  </Statistic.Value>
                  <Statistic.Label>Importe capturado hoy</Statistic.Label>
                </Statistic>
              </Segment>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </>
    );
  }

  return (
    <>
      <HeaderPageComponent
        title="Dashboard"
        description="Visibilidad rápida del estado operativo de la tienda."
      />
      <Grid stackable columns={4}>
        <Grid.Row>
          <Grid.Column>
            <Segment className="metric-card surface-segment" padded="very">
              <div className="metric-value">{dashboardData.summary.total_products}</div>
              <p className="muted-copy">Productos activos</p>
            </Segment>
          </Grid.Column>
          <Grid.Column>
            <Segment className="metric-card surface-segment" padded="very">
              <div className="metric-value">{dashboardData.summary.low_stock_products}</div>
              <p className="muted-copy">Productos con inventario crítico</p>
            </Segment>
          </Grid.Column>
          <Grid.Column>
            <Segment className="metric-card surface-segment" padded="very">
              <div className="metric-value">{dashboardData.summary.low_margin_products}</div>
              <p className="muted-copy">Productos bajo margen</p>
            </Segment>
          </Grid.Column>
          <Grid.Column>
            <Segment className="metric-card surface-segment" padded="very">
              <div className="metric-value">{formatCurrency(dashboardData.summary.average_cost)}</div>
              <p className="muted-copy">Costo promedio del catálogo</p>
            </Segment>
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <Grid stackable>
        <Grid.Row>
          <Grid.Column computer={8} tablet={16} mobile={16}>
            <Segment className="surface-segment" padded="very">
              <Header as="h3">Ventas recientes</Header>
              <List relaxed divided>
                {dashboardData.recent_sales.map((sale) => (
                  <List.Item key={sale.sale_id}>
                    <List.Content floated="right">{formatCurrency(sale.total_amount)}</List.Content>
                    <List.Content>
                      <List.Header>{sale.sale_number}</List.Header>
                      <List.Description>{formatDate(sale.sale_date)}</List.Description>
                    </List.Content>
                  </List.Item>
                ))}
              </List>
            </Segment>
          </Grid.Column>
          <Grid.Column computer={8} tablet={16} mobile={16}>
            <Segment className="surface-segment" padded="very">
              <Header as="h3">Compras recientes</Header>
              <List relaxed divided>
                {dashboardData.recent_purchases.map((purchase) => (
                  <List.Item key={purchase.purchase_id}>
                    <List.Content floated="right">{formatCurrency(purchase.total_amount)}</List.Content>
                    <List.Content>
                      <List.Header>{purchase.supplier_name}</List.Header>
                      <List.Description>{formatDate(purchase.purchase_date)}</List.Description>
                    </List.Content>
                  </List.Item>
                ))}
              </List>
            </Segment>
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <Segment className="surface-segment" padded="very">
        <Header as="h3">Lectura sugerida del dashboard</Header>
        <Table basic="very">
          <Table.Body>
            <Table.Row>
              <Table.Cell width={4}><strong>Inventario crítico</strong></Table.Cell>
              <Table.Cell>Prioriza compras o ajustes de stock mínimo para evitar quiebres de inventario.</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell><strong>Margen bajo</strong></Table.Cell>
              <Table.Cell>Revisa sugerencias de precio y valida si el costo promedio cambió recientemente.</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell><strong>Costo promedio</strong></Table.Cell>
              <Table.Cell>Sirve como referencia operativa para reportes y sugerencias de precio.</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell><strong>Meta de margen</strong></Table.Cell>
              <Table.Cell>{formatPercent(user?.target_margin_percent)}</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      </Segment>
    </>
  );
};

export default DashboardPage;
