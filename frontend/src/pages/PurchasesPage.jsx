import { useEffect, useState } from 'react';
import {
  Button,
  Dropdown,
  Form,
  Grid,
  Header,
  Icon,
  Segment,
  Table,
} from 'semantic-ui-react';
import api, { normalizeApiError } from '../api';
import HeaderPageComponent from '../components/HeaderPageComponent';
import LoadingComponent from '../components/LoadingComponent';
import { formatCurrency, formatDate } from '../utils/formatters';

const today = new Date().toISOString().slice(0, 10);

const PurchasesPage = ({ onNotify }) => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [formState, setFormState] = useState({
    supplier_name: '',
    purchase_date: today,
    notes: '',
    items: [{ product_id: '', quantity: 1, unit_cost: '' }],
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [productsResponse, purchasesResponse] = await Promise.all([
        api.products.list({ status: 'active', page_size: 50 }),
        api.purchases.list({ page_size: 10 }),
      ]);
      setProducts(productsResponse.data);
      setPurchases(purchasesResponse.data);
    } catch (error) {
      const normalizedError = normalizeApiError(error);
      onNotify({
        type: 'error',
        title: 'No fue posible cargar compras',
        message: normalizedError.message,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const updateItem = (index, field, value) => {
    setFormState((current) => ({
      ...current,
      items: current.items.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const addItem = () => {
    setFormState((current) => ({
      ...current,
      items: [...current.items, { product_id: '', quantity: 1, unit_cost: '' }],
    }));
  };

  const removeItem = (index) => {
    setFormState((current) => ({
      ...current,
      items: current.items.filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const submitPurchase = async () => {
    try {
      await api.purchases.create({
        supplier_name: formState.supplier_name,
        purchase_date: formState.purchase_date,
        notes: formState.notes,
        items: formState.items.map((item) => ({
          product_id: Number(item.product_id),
          quantity: Number(item.quantity),
          unit_cost: Number(item.unit_cost),
        })),
      });

      onNotify({
        type: 'success',
        title: 'Compra registrada',
        message: 'La compra impactó inventario y actualizó costo promedio.',
      });
      setFormState({
        supplier_name: '',
        purchase_date: today,
        notes: '',
        items: [{ product_id: '', quantity: 1, unit_cost: '' }],
      });
      loadData();
    } catch (error) {
      const normalizedError = normalizeApiError(error);
      onNotify({
        type: 'error',
        title: 'No fue posible registrar la compra',
        message: normalizedError.message,
      });
    }
  };

  if (loading) {
    return <LoadingComponent text="Cargando compras..." />;
  }

  const productOptions = products.map((product) => ({
    key: product.product_id,
    text: `${product.name} · ${product.sku}`,
    value: product.product_id,
  }));

  const estimatedTotal = formState.items.reduce(
    (accumulator, item) => accumulator + Number(item.quantity || 0) * Number(item.unit_cost || 0),
    0
  );

  return (
    <>
      <HeaderPageComponent
        title="Compras a proveedores"
        description="Cada compra incrementa existencias y recalcula el costo promedio."
      />
      <Grid stackable>
        <Grid.Row>
          <Grid.Column computer={10} tablet={16} mobile={16}>
            <Segment className="surface-segment" padded="very">
              <Header as="h3">Registrar compra</Header>
              <Form>
                <Form.Group widths="equal">
                  <Form.Input
                    required
                    label="Proveedor"
                    value={formState.supplier_name}
                    onChange={(_, { value }) =>
                      setFormState((current) => ({ ...current, supplier_name: value }))
                    }
                  />
                  <Form.Input
                    required
                    type="date"
                    label="Fecha"
                    value={formState.purchase_date}
                    onChange={(_, { value }) =>
                      setFormState((current) => ({ ...current, purchase_date: value }))
                    }
                  />
                </Form.Group>
                <Form.TextArea
                  label="Notas"
                  value={formState.notes}
                  onChange={(_, { value }) =>
                    setFormState((current) => ({ ...current, notes: value }))
                  }
                />
                {formState.items.map((item, index) => (
                  <Segment key={`purchase-item-${index}`} secondary>
                    <Form.Group widths="equal">
                      <Form.Field
                        control={Dropdown}
                        search
                        selection
                        label={`Producto ${index + 1}`}
                        options={productOptions}
                        value={item.product_id || null}
                        onChange={(_, { value }) => updateItem(index, 'product_id', value)}
                        placeholder="Selecciona un producto"
                      />
                      <Form.Input
                        type="number"
                        min="1"
                        label="Cantidad"
                        value={item.quantity}
                        onChange={(_, { value }) => updateItem(index, 'quantity', value)}
                      />
                      <Form.Input
                        type="number"
                        min="0.01"
                        step="0.01"
                        label="Costo unitario"
                        value={item.unit_cost}
                        onChange={(_, { value }) => updateItem(index, 'unit_cost', value)}
                      />
                      <Form.Field>
                        <label>&nbsp;</label>
                        <Button
                          basic
                          color="red"
                          icon
                          onClick={() => removeItem(index)}
                          disabled={formState.items.length === 1}
                        >
                          <Icon name="trash" />
                        </Button>
                      </Form.Field>
                    </Form.Group>
                  </Segment>
                ))}
                <div className="page-actions">
                  <Button basic color="blue" onClick={addItem}>
                    Agregar producto
                  </Button>
                  <Button primary className="storepilot-button" onClick={submitPurchase}>
                    Registrar compra
                  </Button>
                </div>
              </Form>
            </Segment>
          </Grid.Column>
          <Grid.Column computer={6} tablet={16} mobile={16}>
            <Segment className="surface-segment sticky-summary" padded="very">
              <Header as="h3">Resumen de captura</Header>
              <Table basic="very">
                <Table.Body>
                  <Table.Row>
                    <Table.Cell>Proveedor</Table.Cell>
                    <Table.Cell>{formState.supplier_name || 'Pendiente'}</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>Productos</Table.Cell>
                    <Table.Cell>{formState.items.length}</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>Total estimado</Table.Cell>
                    <Table.Cell>{formatCurrency(estimatedTotal)}</Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>
            </Segment>
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <Segment className="surface-segment" padded="very">
        <HeaderPageComponent
          title="Historial de compras"
          description="Últimos registros capturados en la tienda."
        />
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Proveedor</Table.HeaderCell>
              <Table.HeaderCell>Fecha</Table.HeaderCell>
              <Table.HeaderCell>Total</Table.HeaderCell>
              <Table.HeaderCell>Capturado por</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {purchases.map((purchase) => (
              <Table.Row key={purchase.purchase_id}>
                <Table.Cell>{purchase.supplier_name}</Table.Cell>
                <Table.Cell>{formatDate(purchase.purchase_date)}</Table.Cell>
                <Table.Cell>{formatCurrency(purchase.total_amount)}</Table.Cell>
                <Table.Cell>{purchase.created_by_name}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Segment>
    </>
  );
};

export default PurchasesPage;
