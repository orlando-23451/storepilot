import { Card, Header, Icon, List, Segment } from 'semantic-ui-react';
import HeaderPageComponent from '../components/HeaderPageComponent';
import moduleManuals from '../utils/moduleManuals';

const HelpPage = () => (
  <>
    <HeaderPageComponent
      title="Ayuda y manuales"
      description="Guía rápida por módulo para operar la aplicación con claridad."
    />
    <Segment className="surface-segment" padded="very">
      <Card.Group itemsPerRow={2} stackable>
        {moduleManuals.map((manual) => (
          <Card key={manual.key} fluid className="surface-segment">
            <Card.Content>
              <Card.Header>{manual.title}</Card.Header>
              <Card.Meta>{manual.summary}</Card.Meta>
              <Card.Description>
                <List ordered relaxed className="manual-step-list">
                  {manual.steps.map((step) => (
                    <List.Item key={step}>{step}</List.Item>
                  ))}
                </List>
              </Card.Description>
            </Card.Content>
          </Card>
        ))}
      </Card.Group>
      <Segment secondary className="section-spacing">
        <Header as="h4">
          <Icon name="life ring" color="blue" />
          Soporte operativo
        </Header>
        <p>
          Para el entorno demo usa el correo{' '}
          <strong>{process.env.REACT_APP_HELP_EMAIL || 'soporte@storepilot.local'}</strong>.
        </p>
      </Segment>
    </Segment>
  </>
);

export default HelpPage;
