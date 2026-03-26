import { Button, Header, Segment } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import routeNames from '../routeNames';

const NotFoundPage = () => (
  <Segment placeholder className="surface-segment">
    <Header icon>La pantalla solicitada no existe o ya no está disponible.</Header>
    <Button as={Link} to={routeNames.dashboard} primary className="storepilot-button">
      Volver al dashboard
    </Button>
  </Segment>
);

export default NotFoundPage;
