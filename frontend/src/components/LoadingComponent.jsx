import { Dimmer, Loader, Segment } from 'semantic-ui-react';

const LoadingComponent = ({
  active = true,
  inline = false,
  text = 'Cargando información...',
  minHeight = '220px',
}) => {
  if (inline) {
    return (
      <Loader active inline="centered">
        {text}
      </Loader>
    );
  }

  return (
    <Segment className="surface-segment" style={{ minHeight }}>
      <Dimmer active={active} inverted>
        <Loader>{text}</Loader>
      </Dimmer>
    </Segment>
  );
};

export default LoadingComponent;
