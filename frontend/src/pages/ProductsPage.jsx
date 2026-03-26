import { useEffect, useState } from 'react';
import {
  Button,
  Dropdown,
  Form,
  Input,
  Modal,
  Segment,
  Table,
} from 'semantic-ui-react';
import api, { normalizeApiError } from '../api';
import ConfirmComponent from '../components/ConfirmComponent';
import HeaderPageComponent from '../components/HeaderPageComponent';
import ListComponent from '../components/ListComponent';
import LoadingComponent from '../components/LoadingComponent';
import { formatCurrency } from '../utils/formatters';

const initialFormState = {
  category_id: null,
  sku: '',
  barcode: '',
  name: '',
  description: '',
  sale_price: '',
  minimum_stock: 0,
  active: true,
};

const ProductsPage = ({ user, onNotify }) => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [meta, setMeta] = useState({ page: 1, page_size: 10, total: 0 });
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({ search: '', status: 'active', category_id: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formState, setFormState] = useState(initialFormState);
  const [editingProduct, setEditingProduct] = useState(null);
  const [confirmingProduct, setConfirmingProduct] = useState(null);

  const loadData = async (page = 1, appliedFilters = filters) => {
    try {
      setLoading(true);
      const [productsResponse, categoriesResponse] = await Promise.all([
        api.products.list({
          ...appliedFilters,
          page,
          category_id: appliedFilters.category_id || undefined,
        }),
        api.products.categories(),
      ]);

      setProducts(productsResponse.data);
      setMeta(productsResponse.meta);
      setCategories(categoriesResponse.data);
    } catch (error) {
      const normalizedError = normalizeApiError(error);
      onNotify({
        type: 'error',
        title: 'No fue posible cargar el catálogo',
        message: normalizedError.message,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleFilterChange = (_, { name, value }) => {
    const nextFilters = {
      ...filters,
      [name]: value,
    };
    setFilters(nextFilters);
  };

  const applyFilters = () => loadData(1, filters);

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormState(initialFormState);
    setIsModalOpen(true);
  };

  const openEditModal = async (productId) => {
    try {
      const response = await api.products.get(productId);
      const product = response.data;
      setEditingProduct(product);
      setFormState({
        category_id: product.category_id,
        sku: product.sku,
        barcode: product.barcode || '',
        name: product.name,
        description: product.description || '',
        sale_price: product.sale_price,
        minimum_stock: product.minimum_stock,
        active: Boolean(product.active),
      });
      setIsModalOpen(true);
    } catch (error) {
      const normalizedError = normalizeApiError(error);
      onNotify({
        type: 'error',
        title: 'No fue posible cargar el producto',
        message: normalizedError.message,
      });
    }
  };

  const handleFormChange = (_, { name, value, type, checked }) => {
    setFormState((currentState) => ({
      ...currentState,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const submitForm = async () => {
    try {
      const payload = {
        ...formState,
        category_id: formState.category_id || null,
        sale_price: Number(formState.sale_price),
        minimum_stock: Number(formState.minimum_stock),
      };

      if (editingProduct) {
        await api.products.update(editingProduct.product_id, payload);
        onNotify({
          type: 'success',
          title: 'Producto actualizado',
          message: 'Los cambios del producto se guardaron correctamente.',
        });
      } else {
        await api.products.create(payload);
        onNotify({
          type: 'success',
          title: 'Producto creado',
          message: 'El producto se agregó al catálogo.',
        });
      }

      setIsModalOpen(false);
      loadData(meta.page, filters);
    } catch (error) {
      const normalizedError = normalizeApiError(error);
      onNotify({
        type: 'error',
        title: 'No fue posible guardar el producto',
        message: normalizedError.message,
      });
    }
  };

  const deactivateProduct = async () => {
    try {
      await api.products.deactivate(confirmingProduct.product_id);
      onNotify({
        type: 'success',
        title: 'Producto desactivado',
        message: 'El producto quedó inactivo sin eliminarse físicamente.',
      });
      setConfirmingProduct(null);
      loadData(meta.page, filters);
    } catch (error) {
      const normalizedError = normalizeApiError(error);
      onNotify({
        type: 'error',
        title: 'No fue posible desactivar el producto',
        message: normalizedError.message,
      });
    }
  };

  if (loading) {
    return <LoadingComponent text="Cargando catálogo..." />;
  }

  const columns =
    user.role_code === 'admin'
      ? [
          { key: 'name', label: 'Producto' },
          { key: 'sku', label: 'SKU' },
          { key: 'stock_quantity', label: 'Existencia' },
          { key: 'average_cost', label: 'Costo promedio' },
          { key: 'sale_price', label: 'Precio de venta' },
          { key: 'actions', label: 'Acciones' },
        ]
      : [
          { key: 'name', label: 'Producto' },
          { key: 'sku', label: 'SKU' },
          { key: 'stock_quantity', label: 'Existencia' },
          { key: 'sale_price', label: 'Precio de venta' },
        ];

  const categoryOptions = categories.map((category) => ({
    key: category.category_id,
    text: category.name,
    value: category.category_id,
  }));

  return (
    <>
      <HeaderPageComponent
        title="Catálogo de productos"
        description="Administra SKU, precios, stock mínimo y estado operativo del catálogo."
        actions={
          user.role_code === 'admin' ? (
            <Button primary className="storepilot-button" onClick={openCreateModal}>
              Nuevo producto
            </Button>
          ) : null
        }
      />
      <Segment className="surface-segment" padded="very">
        <Form>
          <Form.Group widths="equal">
            <Form.Field
              control={Input}
              label="Buscar"
              name="search"
              placeholder="Nombre, SKU o código"
              value={filters.search}
              onChange={handleFilterChange}
            />
            <Form.Field
              control={Dropdown}
              selection
              label="Estado"
              name="status"
              options={[
                { key: 'active', text: 'Activos', value: 'active' },
                { key: 'inactive', text: 'Inactivos', value: 'inactive' },
                { key: 'all', text: 'Todos', value: 'all' },
              ]}
              value={filters.status}
              onChange={handleFilterChange}
            />
            <Form.Field
              control={Dropdown}
              clearable
              selection
              label="Categoría"
              name="category_id"
              options={categoryOptions}
              value={filters.category_id || null}
              onChange={handleFilterChange}
              placeholder="Todas"
            />
          </Form.Group>
          <Button primary className="storepilot-button" onClick={applyFilters}>
            Aplicar filtros
          </Button>
        </Form>
      </Segment>
      <Segment className="surface-segment" padded="very">
        <ListComponent
          columns={columns}
          rows={products}
          pagination={meta}
          onPageChange={(page) => loadData(page, filters)}
          renderRow={(product) => (
            <Table.Row key={product.product_id}>
              <Table.Cell>
                <strong>{product.name}</strong>
                <div className="muted-copy">{product.category_name || 'Sin categoría'}</div>
              </Table.Cell>
              <Table.Cell>{product.sku}</Table.Cell>
              <Table.Cell>{product.stock_quantity}</Table.Cell>
              {user.role_code === 'admin' ? (
                <Table.Cell>{formatCurrency(product.average_cost || 0)}</Table.Cell>
              ) : null}
              <Table.Cell>{formatCurrency(product.sale_price)}</Table.Cell>
              {user.role_code === 'admin' ? (
                <Table.Cell>
                  <Button basic size="small" color="blue" onClick={() => openEditModal(product.product_id)}>
                    Editar
                  </Button>
                  <Button
                    basic
                    size="small"
                    color="red"
                    onClick={() => setConfirmingProduct(product)}
                  >
                    Desactivar
                  </Button>
                </Table.Cell>
              ) : null}
            </Table.Row>
          )}
        />
      </Segment>
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        closeIcon
        size="small"
      >
        <Modal.Header>{editingProduct ? 'Editar producto' : 'Nuevo producto'}</Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Group widths="equal">
              <Form.Input required label="SKU" name="sku" value={formState.sku} onChange={handleFormChange} />
              <Form.Input label="Código de barras" name="barcode" value={formState.barcode} onChange={handleFormChange} />
            </Form.Group>
            <Form.Input required label="Nombre" name="name" value={formState.name} onChange={handleFormChange} />
            <Form.TextArea label="Descripción" name="description" value={formState.description} onChange={handleFormChange} />
            <Form.Group widths="equal">
              <Form.Field
                control={Dropdown}
                clearable
                selection
                label="Categoría"
                name="category_id"
                options={categoryOptions}
                value={formState.category_id}
                onChange={handleFormChange}
              />
              <Form.Input
                required
                type="number"
                min="0"
                step="0.01"
                label="Precio de venta"
                name="sale_price"
                value={formState.sale_price}
                onChange={handleFormChange}
              />
              <Form.Input
                required
                type="number"
                min="0"
                label="Stock mínimo"
                name="minimum_stock"
                value={formState.minimum_stock}
                onChange={handleFormChange}
              />
            </Form.Group>
            {editingProduct ? (
              <Form.Checkbox
                label="Producto activo"
                name="active"
                checked={formState.active}
                onChange={handleFormChange}
              />
            ) : null}
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button basic onClick={() => setIsModalOpen(false)}>
            Cancelar
          </Button>
          <Button primary className="storepilot-button" onClick={submitForm}>
            Guardar producto
          </Button>
        </Modal.Actions>
      </Modal>
      <ConfirmComponent
        open={Boolean(confirmingProduct)}
        title="Desactivar producto"
        content={`El producto ${confirmingProduct?.name || ''} quedará inactivo, pero seguirá en trazabilidad histórica.`}
        confirmButton="Desactivar"
        onCancel={() => setConfirmingProduct(null)}
        onConfirm={deactivateProduct}
      />
    </>
  );
};

export default ProductsPage;
