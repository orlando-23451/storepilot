import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Button,
  Container,
  Form,
  Grid,
  Header,
  Icon,
  List,
  Segment,
} from 'semantic-ui-react';
import api, { normalizeApiError } from '../api';
import routeNames from '../routeNames';
import { saveSession } from '../utils/session';

const LoginPage = ({ onSessionStart, onNotify }) => {
  const navigate = useNavigate();
  const [formState, setFormState] = useState({
    email: 'admin@storepilot.local',
    password: 'Admin123!',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (_, { name, value }) => {
    setFormState((currentState) => ({
      ...currentState,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const response = await api.auth.login(formState);
      saveSession(response.data);
      onSessionStart(response.data.user);
      onNotify({
        type: 'success',
        title: 'Sesión iniciada',
        message: `Bienvenido(a), ${response.data.user.full_name}.`,
      });
      navigate(routeNames.dashboard, { replace: true });
    } catch (error) {
      const normalizedError = normalizeApiError(error);
      onNotify({
        type: 'error',
        title: 'No fue posible iniciar sesión',
        message: normalizedError.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Segment basic className="landing-hero">
      <Container>
        <Grid stackable verticalAlign="middle">
          <Grid.Row columns={2}>
            <Grid.Column computer={8} tablet={16} mobile={16}>
              <Header as="h1" size="huge">
                Entra a tu operación diaria
                <Header.Subheader className="muted-copy">
                  Accede al entorno de StorePilot con control por rol y datos separados por tienda.
                </Header.Subheader>
              </Header>
              <List relaxed="very">
                <List.Item>
                  <Icon name="lock" color="blue" />
                  Autenticación con acceso restringido por rol.
                </List.Item>
                <List.Item>
                  <Icon name="building" color="blue" />
                  Sesión ligada a tu tienda y a su configuración de margen.
                </List.Item>
                <List.Item>
                  <Icon name="help circle" color="blue" />
                  Textos y flujos diseñados para uso operativo simple.
                </List.Item>
              </List>
            </Grid.Column>
            <Grid.Column computer={8} tablet={16} mobile={16}>
              <Segment padded="very" className="surface-segment">
                <Header as="h2">Iniciar sesión</Header>
                <Form onSubmit={handleSubmit}>
                  <Form.Input
                    required
                    label="Correo electrónico"
                    name="email"
                    type="email"
                    value={formState.email}
                    onChange={handleChange}
                    placeholder="admin@storepilot.local"
                  />
                  <Form.Input
                    required
                    label="Contraseña"
                    name="password"
                    type="password"
                    value={formState.password}
                    onChange={handleChange}
                    placeholder="Ingresa tu contraseña"
                  />
                  <Button
                    fluid
                    primary
                    loading={loading}
                    disabled={loading}
                    className="storepilot-button"
                    type="submit"
                  >
                    Entrar al sistema
                  </Button>
                </Form>
                <Segment secondary className="section-spacing">
                  <Header as="h4">Credenciales demo</Header>
                  <List>
                    <List.Item>
                      <strong>Administrador:</strong> `admin@storepilot.local` / `Admin123!`
                    </List.Item>
                    <List.Item>
                      <strong>Cajero:</strong> `cajero@storepilot.local` / `Cashier123!`
                    </List.Item>
                  </List>
                </Segment>
                <Button as={Link} to={routeNames.landing} basic color="blue" fluid>
                  Volver a la landing
                </Button>
              </Segment>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    </Segment>
  );
};

export default LoginPage;
