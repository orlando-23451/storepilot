import { useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Accordion, Container, Grid, Icon, Menu, Segment, Sidebar } from 'semantic-ui-react';
import routeNames from '../routeNames';

const navigationGroups = [
  {
    key: 'overview',
    title: 'Operación',
    icon: 'chart bar',
    items: [
      { key: routeNames.dashboard, label: 'Dashboard', icon: 'chart line', route: routeNames.dashboard },
      { key: routeNames.sales, label: 'Ventas', icon: 'cart', route: routeNames.sales },
      { key: routeNames.inventory, label: 'Inventario', icon: 'boxes', route: routeNames.inventory },
    ],
  },
  {
    key: 'management',
    title: 'Gestión',
    icon: 'warehouse',
    items: [
      { key: routeNames.products, label: 'Catálogo', icon: 'archive', route: routeNames.products },
      { key: routeNames.purchases, label: 'Compras', icon: 'truck', route: routeNames.purchases },
      { key: routeNames.pricing, label: 'Precios', icon: 'percent', route: routeNames.pricing },
      { key: routeNames.reports, label: 'Reportes', icon: 'file alternate', route: routeNames.reports },
      { key: routeNames.users, label: 'Usuarios', icon: 'users', route: routeNames.users, roles: ['admin'] },
      { key: routeNames.help, label: 'Ayuda', icon: 'life ring', route: routeNames.help },
    ],
  },
];

const LayoutComponent = ({
  user,
  titleContent,
  children,
  footerContent,
  onLogout,
}) => {
  const location = useLocation();
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState('overview');

  const groups = useMemo(
    () =>
      navigationGroups.map((group) => ({
        ...group,
        items: group.items.filter((item) => !item.roles || item.roles.includes(user?.role_code)),
      })),
    [user?.role_code]
  );

  const renderNavigation = () => (
    <Menu inverted borderless fluid vertical className="app-sidebar">
      <Menu.Item>
        <div className="app-brand">
          <span className="app-brand-mark">SP</span>
          <div>
            <strong>StorePilot</strong>
            <div style={{ color: '#2185d0', fontSize: '10px', fontWeight: 'bold' }}>
            🧪 QA VERIFIED - MODO TEST
            </div>
            <div className="muted-copy">{user?.store_name || 'Tienda actual'}</div>
          </div>
        </div>
      </Menu.Item>
      {groups.map((group) => (
        <Menu.Item key={group.key}>
          <Accordion fluid styled={false}>
            <Accordion.Title
              active={activeAccordion === group.key}
              index={group.key}
              onClick={() =>
                setActiveAccordion(activeAccordion === group.key ? null : group.key)
              }
            >
              <Icon name={activeAccordion === group.key ? 'dropdown' : 'angle right'} />
              <Icon name={group.icon} />
              {group.title}
            </Accordion.Title>
            <Accordion.Content active={activeAccordion === group.key}>
              <Menu.Menu>
                {group.items.map((item) => (
                  <Menu.Item
                    as={Link}
                    key={item.key}
                    to={item.route}
                    active={location.pathname === item.route}
                    onClick={() => setSidebarVisible(false)}
                  >
                    <Icon name={item.icon} />
                    {item.label}
                  </Menu.Item>
                ))}
              </Menu.Menu>
            </Accordion.Content>
          </Accordion>
        </Menu.Item>
      ))}
      <Menu.Item onClick={onLogout}>
        <Icon name="sign-out" />
        Cerrar sesión
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="app-shell">
      <Sidebar.Pushable as={Segment} basic>
        <Sidebar
          as={Menu}
          animation="overlay"
          vertical
          visible={sidebarVisible}
          width="wide"
          className="app-sidebar"
        >
          {renderNavigation()}
        </Sidebar>
        <Sidebar.Pusher dimmed={sidebarVisible}>
          <Menu borderless fixed="top" className="app-header">
            <Menu.Item onClick={() => setSidebarVisible(!sidebarVisible)}>
              <Icon name="sidebar" />
            </Menu.Item>
            <Menu.Item header>
              <div className="app-brand">
                <span className="app-brand-mark">SP</span>
                <div>
                  <strong>StorePilot</strong>
                  <div className="muted-copy">{user?.role_code === 'admin' ? 'Administrador' : 'Cajero'}</div>
                </div>
              </div>
            </Menu.Item>
            <Menu.Menu position="right">
              <Menu.Item>
                <Icon name="user circle" color="blue" />
                {user?.full_name}
              </Menu.Item>
            </Menu.Menu>
          </Menu>
          <Container fluid className="app-content-grid">
            <Grid centered>
              <Grid.Row>
              <Grid.Column computer={4} only="computer">
                {renderNavigation()}
              </Grid.Column>
                <Grid.Column
                  className="app-main-column"
                  computer={11}
                  tablet={16}
                  mobile={16}
                >
                  {titleContent}
                  {children}
                  <div className="footer-copy">
                    {footerContent || 'StorePilot SaaS · Operación confiable para tiendas físicas'}
                  </div>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Container>
        </Sidebar.Pusher>
      </Sidebar.Pushable>
    </div>
  );
};

export default LayoutComponent;
