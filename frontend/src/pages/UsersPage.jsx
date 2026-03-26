import { useEffect, useState } from 'react';
import { Button, Form, Input, Modal, Segment, Table } from 'semantic-ui-react';
import api, { normalizeApiError } from '../api';
import ConfirmComponent from '../components/ConfirmComponent';
import HeaderPageComponent from '../components/HeaderPageComponent';
import ListComponent from '../components/ListComponent';
import LoadingComponent from '../components/LoadingComponent';
import { formatDateTime } from '../utils/formatters';

const initialFormState = {
  full_name: '',
  email: '',
  password: '',
  role_code: 'cashier',
  active: true,
};

const UsersPage = ({ onNotify }) => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [meta, setMeta] = useState({ page: 1, page_size: 10, total: 0 });
  const [filters, setFilters] = useState({ search: '', status: 'active' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formState, setFormState] = useState(initialFormState);
  const [confirmingUser, setConfirmingUser] = useState(null);

  const loadUsers = async (page = 1, appliedFilters = filters) => {
    try {
      setLoading(true);
      const response = await api.users.list({
        ...appliedFilters,
        page,
      });
      setUsers(response.data);
      setMeta(response.meta);
    } catch (error) {
      const normalizedError = normalizeApiError(error);
      onNotify({
        type: 'error',
        title: 'No fue posible cargar los usuarios',
        message: normalizedError.message,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const openCreateModal = () => {
    setEditingUser(null);
    setFormState(initialFormState);
    setIsModalOpen(true);
  };

  const openEditModal = async (userId) => {
    try {
      const response = await api.users.get(userId);
      const user = response.data;
      setEditingUser(user);
      setFormState({
        full_name: user.full_name,
        email: user.email,
        password: '',
        role_code: user.role_code,
        active: Boolean(user.active),
      });
      setIsModalOpen(true);
    } catch (error) {
      const normalizedError = normalizeApiError(error);
      onNotify({
        type: 'error',
        title: 'No fue posible cargar el usuario',
        message: normalizedError.message,
      });
    }
  };

  const submitForm = async () => {
    try {
      if (editingUser) {
        await api.users.update(editingUser.user_id, {
          full_name: formState.full_name,
          email: formState.email,
          role_code: formState.role_code,
          active: formState.active,
        });
      } else {
        await api.users.create({
          full_name: formState.full_name,
          email: formState.email,
          password: formState.password,
          role_code: formState.role_code,
        });
      }

      onNotify({
        type: 'success',
        title: editingUser ? 'Usuario actualizado' : 'Usuario creado',
        message: editingUser
          ? 'La cuenta del usuario fue actualizada.'
          : 'La cuenta del usuario fue creada.',
      });
      setIsModalOpen(false);
      loadUsers(meta.page, filters);
    } catch (error) {
      const normalizedError = normalizeApiError(error);
      onNotify({
        type: 'error',
        title: 'No fue posible guardar el usuario',
        message: normalizedError.message,
      });
    }
  };

  const deactivateUser = async () => {
    try {
      await api.users.deactivate(confirmingUser.user_id);
      onNotify({
        type: 'success',
        title: 'Usuario desactivado',
        message: 'El usuario quedó inactivo y ya no podrá iniciar sesión.',
      });
      setConfirmingUser(null);
      loadUsers(meta.page, filters);
    } catch (error) {
      const normalizedError = normalizeApiError(error);
      onNotify({
        type: 'error',
        title: 'No fue posible desactivar el usuario',
        message: normalizedError.message,
      });
    }
  };

  if (loading) {
    return <LoadingComponent text="Cargando usuarios..." />;
  }

  return (
    <>
      <HeaderPageComponent
        title="Usuarios de la tienda"
        description="Alta, actualización y desactivación lógica de cuentas por rol."
        actions={
          <Button primary className="storepilot-button" onClick={openCreateModal}>
            Nuevo usuario
          </Button>
        }
      />
      <Segment className="surface-segment" padded="very">
        <Form>
          <Form.Group widths="equal">
            <Form.Field
              control={Input}
              label="Buscar"
              name="search"
              placeholder="Nombre o correo"
              value={filters.search}
              onChange={(_, { name, value }) => setFilters((current) => ({ ...current, [name]: value }))}
            />
            <Form.Select
              label="Estado"
              name="status"
              options={[
                { key: 'active', text: 'Activos', value: 'active' },
                { key: 'inactive', text: 'Inactivos', value: 'inactive' },
                { key: 'all', text: 'Todos', value: 'all' },
              ]}
              value={filters.status}
              onChange={(_, { name, value }) => setFilters((current) => ({ ...current, [name]: value }))}
            />
          </Form.Group>
          <Button primary className="storepilot-button" onClick={() => loadUsers(1, filters)}>
            Aplicar filtros
          </Button>
        </Form>
      </Segment>
      <Segment className="surface-segment" padded="very">
        <ListComponent
          columns={[
            { key: 'full_name', label: 'Nombre' },
            { key: 'email', label: 'Correo' },
            { key: 'role', label: 'Rol' },
            { key: 'last_login_date', label: 'Último acceso' },
            { key: 'actions', label: 'Acciones' },
          ]}
          rows={users}
          pagination={meta}
          onPageChange={(page) => loadUsers(page, filters)}
          renderRow={(item) => (
            <Table.Row key={item.user_id}>
              <Table.Cell>{item.full_name}</Table.Cell>
              <Table.Cell>{item.email}</Table.Cell>
              <Table.Cell>{item.role_name}</Table.Cell>
              <Table.Cell>{formatDateTime(item.last_login_date)}</Table.Cell>
              <Table.Cell>
                <Button basic size="small" color="blue" onClick={() => openEditModal(item.user_id)}>
                  Editar
                </Button>
                {item.active ? (
                  <Button basic size="small" color="red" onClick={() => setConfirmingUser(item)}>
                    Desactivar
                  </Button>
                ) : null}
              </Table.Cell>
            </Table.Row>
          )}
        />
      </Segment>
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} closeIcon size="small">
        <Modal.Header>{editingUser ? 'Editar usuario' : 'Nuevo usuario'}</Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Input
              required
              label="Nombre completo"
              value={formState.full_name}
              onChange={(_, { value }) => setFormState((current) => ({ ...current, full_name: value }))}
            />
            <Form.Input
              required
              label="Correo"
              type="email"
              value={formState.email}
              onChange={(_, { value }) => setFormState((current) => ({ ...current, email: value }))}
            />
            {!editingUser ? (
              <Form.Input
                required
                label="Contraseña"
                type="password"
                value={formState.password}
                onChange={(_, { value }) => setFormState((current) => ({ ...current, password: value }))}
              />
            ) : null}
            <Form.Select
              label="Rol"
              options={[
                { key: 'admin', text: 'Administrador', value: 'admin' },
                { key: 'cashier', text: 'Cajero', value: 'cashier' },
              ]}
              value={formState.role_code}
              onChange={(_, { value }) => setFormState((current) => ({ ...current, role_code: value }))}
            />
            {editingUser ? (
              <Form.Checkbox
                label="Usuario activo"
                checked={formState.active}
                onChange={(_, { checked }) => setFormState((current) => ({ ...current, active: checked }))}
              />
            ) : null}
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button basic onClick={() => setIsModalOpen(false)}>
            Cancelar
          </Button>
          <Button primary className="storepilot-button" onClick={submitForm}>
            Guardar usuario
          </Button>
        </Modal.Actions>
      </Modal>
      <ConfirmComponent
        open={Boolean(confirmingUser)}
        title="Desactivar usuario"
        content={`La cuenta de ${confirmingUser?.full_name || ''} quedará inactiva.`}
        confirmButton="Desactivar"
        onCancel={() => setConfirmingUser(null)}
        onConfirm={deactivateUser}
      />
    </>
  );
};

export default UsersPage;
