import { useEffect, useMemo, useState } from 'react';
import {
  Button,
  Card,
  Dropdown,
  Form,
  Grid,
  Header,
  Icon,
  Input,
  Segment,
  Table,
} from 'semantic-ui-react';
import api, { normalizeApiError } from '../api';
import EmptyStateComponent from '../components/EmptyStateComponent';
import HeaderPageComponent from '../components/HeaderPageComponent';
import LoadingComponent from '../components/LoadingComponent';
import { formatCurrency, formatDateTime } from '../utils/formatters';

const today = new Date().toISOString().slice(0, 10);

const SalesPage = ({ onNotify }) => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({ search: '', category_id: '' });
  const [cart, setCart] = useState([]);
  const [saleForm, setSaleForm] = useState({
    sale_date: today,
    payment_method: 'efectivo',
    notes: '',
  });

  const loadData = async (appliedFilters = filters) => {
    try {
      setLoading(true);
      const [productsResponse, salesResponse, categoriesResponse] = await Promise.all([
        api.products.list({
          status: 'active',
          search: appliedFilters.search,
          category_id: appliedFilters.category_id || undefined,
          page_size: 24,
        }),
        api.sales.list({ page_size: 5 }),
        api.products.categories(),
      ]);
      setProducts(productsResponse.data.filter((product) => Number(product.stock_quantity) > 0));
      setSales(salesResponse.data);
      setCategories(categoriesResponse.data);
    } catch (error) {
      const normalizedError = normalizeApiError(error);
      onNotify({
        type: 'error',
        title: 'No fue posible cargar ventas',
        message: normalizedError.message,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const addToCart = (product) => {
    setCart((currentCart) => {
      const existingItem = currentCart.find((item) => item.product_id === product.product_id);
      if (existingItem) {
        return currentCart.map((item) =>
          item.product_id === product.product_id
            ? { ...item, quantity: Math.min(item.quantity + 1, product.stock_quantity) }
            : item
        );
      }

      return [
        ...currentCart,
        {
          product_id: product.product_id,
          name: product.name,
          sku: product.sku,
          unit_price: Number(product.sale_price),
          quantity: 1,
          stock_quantity: Number(product.stock_quantity),
        },
      ];
    });
  };

  const updateCartQuantity = (productId, nextQuantity) => {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.product_id === productId
            ? {
                ...item,
                quantity: Math.max(0, Math.min(nextQuantity, item.stock_quantity)),
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const submitSale = async () => {
    try {
      await api.sales.create({
        ...saleForm,
        items: cart.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
          unit_price: item.unit_price,
        })),
      });
      onNotify({
        type: 'success',
        title: 'Venta registrada',
        message: 'La venta se guardó y el inventario fue descontado.',
      });
      setCart([]);
      setSaleForm({
        sale_date: today,
        payment_method: 'efectivo',
        notes: '',
      });
      loadData(filters);
    } catch (error) {
      const normalizedError = normalizeApiError(error);
      onNotify({
        type: 'error',
        title: 'No fue posible registrar la venta',
        message: normalizedError.message,
      });
    }
  };

  const cartTotal = useMemo(
    () =>
      cart.reduce(
        (accumulator, item) => accumulator + Number(item.quantity) * Number(item.unit_price),
        0
      ),
    [cart]
  );

  if (loading) {
    return <LoadingComponent text="Cargando módulo de ventas..." />;
  }

  const categoryOptions = categories.map((category) => ({
    key: category.category_id,
    text: category.name,
    value: category.category_id,
  }));

  return (
    <>
      <HeaderPageComponent
        title="Ventas"
        description="Captura ventas rápidas y mantén trazabilidad de salida de inventario."
      />
      <Segment className="surface-segment" padded="very">
        <Form>
          <Form.Group widths="equal">
            <Form.Field
              control={Input}
              icon="search"
              label="Buscar"
              placeholder="Producto, SKU o código"
              value={filters.search}
              onChange={(_, { value }) => setFilters((current) => ({ ...current, search: value }))}
            />
            <Form.Field
              control={Dropdown}
              clearable
              selection
              label="Categoría"
              options={categoryOptions}
              value={filters.category_id || null}
              onChange={(_, { value }) => setFilters((current) => ({ ...current, category_id: value || '' }))}
              placeholder="Todas"
            />
          </Form.Group>
          <Button primary className="storepilot-button" onClick={() => loadData(filters)}>
            Actualizar productos
          </Button>
        </Form>
      </Segment>
      <Grid stackable>
        <Grid.Row>
          <Grid.Column computer={10} tablet={16} mobile={16}>
            <Segment className="surface-segment" padded="very">
              <Header as="h3">Productos disponibles</Header>
              {products.length === 0 ? (
                <EmptyStateComponent
                  title="Sin productos disponibles"
                  description="No hay productos con existencia para vender en este momento."
                />
              ) : (
                <Card.Group itemsPerRow={2} stackable>
                  {products.map((product) => (
                    <Card key={product.product_id} className="product-card" fluid>
                      <div className="product-card-visual">
                        <Icon name="shopping bag" size="huge" />
                      </div>
                      <Card.Content>
                        <Card.Meta>{product.category_name || 'General'}</Card.Meta>
                        <Card.Header>{product.name}</Card.Header>
                        <Card.Description>
                          <strong>{formatCurrency(product.sale_price)}</strong>
                          <div className="muted-copy">Stock: {product.stock_quantity}</div>
                        </Card.Description>
                      </Card.Content>
                      <Card.Content extra>
                        <Button fluid basic color="blue" onClick={() => addToCart(product)}>
                          Agregar al carrito
                        </Button>
                      </Card.Content>
                    </Card>
                  ))}
                </Card.Group>
              )}
            </Segment>
          </Grid.Column>
          <Grid.Column computer={6} tablet={16} mobile={16}>
            <Segment className="surface-segment sticky-summary" padded="very">
              <Header as="h3">Resumen de venta</Header>
              <Form>
                <Form.Input
                  type="date"
                  label="Fecha"
                  value={saleForm.sale_date}
                  onChange={(_, { value }) => setSaleForm((current) => ({ ...current, sale_date: value }))}
                />
                <Form.Select
                  label="Medio de cobro externo"
                  options={[
                    { key: 'efectivo', text: 'Efectivo', value: 'efectivo' },
                    { key: 'terminal_externa', text: 'Terminal externa', value: 'terminal_externa' },
                    { key: 'transferencia', text: 'Transferencia', value: 'transferencia' },
                  ]}
                  value={saleForm.payment_method}
                  onChange={(_, { value }) =>
                    setSaleForm((current) => ({ ...current, payment_method: value }))
                  }
                />
                <Form.TextArea
                  label="Notas"
                  value={saleForm.notes}
                  onChange={(_, { value }) => setSaleForm((current) => ({ ...current, notes: value }))}
                />
              </Form>
              <Table basic="very">
                <Table.Body>
                  {cart.map((item) => (
                    <Table.Row key={item.product_id}>
                      <Table.Cell>
                        <strong>{item.name}</strong>
                        <div className="muted-copy">{item.sku}</div>
                      </Table.Cell>
                      <Table.Cell textAlign="right">{formatCurrency(item.unit_price)}</Table.Cell>
                      <Table.Cell>
                        <Button
                          basic
                          icon="minus"
                          onClick={() => updateCartQuantity(item.product_id, item.quantity - 1)}
                        />
                        {item.quantity}
                        <Button
                          basic
                          icon="plus"
                          onClick={() => updateCartQuantity(item.product_id, item.quantity + 1)}
                        />
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
              <Segment secondary>
                <strong>Total:</strong> {formatCurrency(cartTotal)}
              </Segment>
              <Button
                fluid
                primary
                className="storepilot-button"
                disabled={cart.length === 0}
                onClick={submitSale}
              >
                Registrar venta
              </Button>
            </Segment>
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <Segment className="surface-segment" padded="very">
        <HeaderPageComponent
          title="Ventas recientes"
          description="Últimos tickets registrados en la tienda."
        />
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Folio</Table.HeaderCell>
              <Table.HeaderCell>Fecha</Table.HeaderCell>
              <Table.HeaderCell>Método</Table.HeaderCell>
              <Table.HeaderCell>Total</Table.HeaderCell>
              <Table.HeaderCell>Capturado por</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {sales.map((sale) => (
              <Table.Row key={sale.sale_id}>
                <Table.Cell>{sale.sale_number}</Table.Cell>
                <Table.Cell>{formatDateTime(sale.sale_date)}</Table.Cell>
                <Table.Cell>{sale.payment_method}</Table.Cell>
                <Table.Cell>{formatCurrency(sale.total_amount)}</Table.Cell>
                <Table.Cell>{sale.created_by_name}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Segment>
    </>
  );
};

export default SalesPage;
