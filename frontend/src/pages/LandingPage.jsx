import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Accordion,
  Button,
  Container,
  Divider,
  Grid,
  Header,
  Icon,
  List,
  Segment,
} from 'semantic-ui-react';
import routeNames from '../routeNames';

const faqItems = [
  {
    key: 'faq-1',
    title: '¿Para qué tipo de negocio sirve?',
    content: 'Está pensado para tiendas físicas de abarrotes, ropa y artículos generales que necesitan orden operativo sin complejidad innecesaria.',
  },
  {
    key: 'faq-2',
    title: '¿El cobro ocurre dentro de StorePilot?',
    content: 'No en el MVP. La venta se registra en la plataforma, pero el cobro se realiza por fuera con efectivo, terminal externa u otro medio.',
  },
  {
    key: 'faq-3',
    title: '¿Cómo se protegen los datos por tienda?',
    content: 'El sistema opera por tenant y cada usuario solo puede consultar o modificar la información de su propia tienda según su rol.',
  },
  {
    key: 'faq-4',
    title: '¿Qué pasa si un producto no tiene costo confiable?',
    content: 'La plataforma lo marca como no calculable y evita sugerencias de precio engañosas.',
  },
  {
    key: 'faq-5',
    title: '¿Puedo usarlo desde celular?',
    content: 'Sí. La aplicación está diseñada como web responsive y lista para anclarse como web app.',
  },
];

const LandingPage = () => {
  const [activeFaqIndex, setActiveFaqIndex] = useState(0);

  return (
    <div className="app-root">
    <Segment basic className="landing-hero">
      <Container>
        <Grid stackable verticalAlign="middle">
          <Grid.Row columns={2}>
            <Grid.Column computer={9} tablet={16} mobile={16}>
              <Header as="h1" size="huge">
                Controla tu tienda física con inventario confiable, ventas registradas y precios mejor informados.
                <Header.Subheader className="muted-copy">
                  StorePilot centraliza compras, catálogo, inventario y sugerencias de precio para operar con más claridad.
                </Header.Subheader>
              </Header>
              <div className="page-actions">
                <Button as={Link} to={routeNames.login} primary size="large" className="storepilot-button">
                  Entrar a la app
                </Button>
                <Button as={Link} to={routeNames.help} basic color="blue" size="large">
                  Ver ayuda del sistema
                </Button>
              </div>
              <List horizontal relaxed size="large" className="section-spacing">
                <List.Item>
                  <Icon name="shield alternate" color="blue" />
                  Multi-tenant con separación estricta
                </List.Item>
                <List.Item>
                  <Icon name="calculator" color="blue" />
                  Costos y margen sugerido
                </List.Item>
                <List.Item>
                  <Icon name="mobile alternate" color="blue" />
                  Responsive para operación diaria
                </List.Item>
              </List>
            </Grid.Column>
            <Grid.Column computer={7} tablet={16} mobile={16}>
              <Segment padded="very" className="surface-segment">
                <Header as="h2">Cómo se ve el flujo principal</Header>
                <List relaxed="very">
                  <List.Item>
                    <Icon name="sign-in" color="blue" />
                    <List.Content>
                      <List.Header>1. Inicia sesión por tienda</List.Header>
                      <List.Description>Acceso por rol con información aislada por tenant.</List.Description>
                    </List.Content>
                  </List.Item>
                  <List.Item>
                    <Icon name="truck" color="blue" />
                    <List.Content>
                      <List.Header>2. Registra compras</List.Header>
                      <List.Description>El inventario sube y el costo promedio se recalcula.</List.Description>
                    </List.Content>
                  </List.Item>
                  <List.Item>
                    <Icon name="percent" color="blue" />
                    <List.Content>
                      <List.Header>3. Revisa sugerencias de precio</List.Header>
                      <List.Description>La recomendación se explica con margen objetivo y costo actual.</List.Description>
                    </List.Content>
                  </List.Item>
                  <List.Item>
                    <Icon name="cart" color="blue" />
                    <List.Content>
                      <List.Header>4. Registra ventas</List.Header>
                      <List.Description>La salida de inventario se aplica automáticamente.</List.Description>
                    </List.Content>
                  </List.Item>
                </List>
              </Segment>
            </Grid.Column>
          </Grid.Row>
        </Grid>

        <Segment padded="very" className="surface-segment section-spacing">
          <Grid stackable columns={3}>
            <Grid.Row>
              <Grid.Column>
                <Header as="h3">Para quién es</Header>
                <p className="muted-copy">
                  Dueños, administradores y cajeros de tiendas físicas que necesitan orden operativo sin implementar un POS complejo.
                </p>
              </Grid.Column>
              <Grid.Column>
                <Header as="h3">Qué problema resuelve</Header>
                <p className="muted-copy">
                  Reduce desorden en inventario, da visibilidad al costo y permite registrar ventas con trazabilidad clara.
                </p>
              </Grid.Column>
              <Grid.Column>
                <Header as="h3">Qué valor entrega</Header>
                <p className="muted-copy">
                  Decisiones de precio más informadas y una operación diaria más consistente entre compras, inventario y ventas.
                </p>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>

        <Segment padded="very" className="surface-segment section-spacing">
          <Header as="h2">Beneficios principales</Header>
          <Grid stackable columns={4}>
            <Grid.Row>
              <Grid.Column>
                <Header as="h4"><Icon name="boxes" color="blue" /> Inventario consistente</Header>
                <p className="muted-copy">Compras y ventas alimentan existencias de forma automática y auditable.</p>
              </Grid.Column>
              <Grid.Column>
                <Header as="h4"><Icon name="dollar sign" color="blue" /> Costo visible</Header>
                <p className="muted-copy">Cada producto conserva costo promedio y último costo para revisión operativa.</p>
              </Grid.Column>
              <Grid.Column>
                <Header as="h4"><Icon name="line graph" color="blue" /> Precio sugerido</Header>
                <p className="muted-copy">Las recomendaciones se calculan con una regla simple y transparente.</p>
              </Grid.Column>
              <Grid.Column>
                <Header as="h4"><Icon name="users" color="blue" /> Roles claros</Header>
                <p className="muted-copy">Administrador con control total y cajero con acceso operativo restringido.</p>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>

        <Segment padded="very" className="surface-segment section-spacing">
          <Header as="h2">Características clave y diferenciadores</Header>
          <List relaxed="very" divided>
            <List.Item>
              <List.Icon name="check circle" color="blue" />
              <List.Content>
                <List.Header>Catálogo administrable con baja lógica</List.Header>
                <List.Description>Los productos permanecen trazables sin eliminaciones físicas.</List.Description>
              </List.Content>
            </List.Item>
            <List.Item>
              <List.Icon name="check circle" color="blue" />
              <List.Content>
                <List.Header>Dashboard operativo para decisiones rápidas</List.Header>
                <List.Description>Muestra foco en inventario crítico, compras recientes y ventas capturadas.</List.Description>
              </List.Content>
            </List.Item>
            <List.Item>
              <List.Icon name="check circle" color="blue" />
              <List.Content>
                <List.Header>Ayuda integrada por módulo</List.Header>
                <List.Description>La app incorpora manual operativo breve para reducir fricción de adopción.</List.Description>
              </List.Content>
            </List.Item>
          </List>
        </Segment>

        <Segment padded="very" className="surface-segment section-spacing">
          <Header as="h2">Preguntas frecuentes</Header>
          <Accordion fluid styled>
            {faqItems.map((item, index) => (
              <div key={item.key}>
                <Accordion.Title
                  active={activeFaqIndex === index}
                  index={index}
                  onClick={() =>
                    setActiveFaqIndex((currentIndex) => (currentIndex === index ? -1 : index))
                  }
                >
                  <Icon name="dropdown" />
                  {item.title}
                </Accordion.Title>
                <Accordion.Content active={activeFaqIndex === index}>
                  <p>{item.content}</p>
                </Accordion.Content>
              </div>
            ))}
          </Accordion>
        </Segment>

        <Divider hidden />
        <Segment padded="very" textAlign="center" className="surface-segment section-spacing">
          <Header as="h2">Empieza con una operación más ordenada</Header>
          <p className="muted-copy">
            Ingresa con el entorno demo para revisar catálogo, compras, ventas y sugerencias de precio.
          </p>
          <Button as={Link} to={routeNames.login} primary size="large" className="storepilot-button">
            Probar StorePilot
          </Button>
        </Segment>

        <div className="footer-copy">
          StorePilot SaaS · Inventario, costos y ventas para tiendas físicas
        </div>
      </Container>
    </Segment>
    </div>
  );
};

export default LandingPage;
