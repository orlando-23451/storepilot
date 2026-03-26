import { Button, Header, Icon, Message } from 'semantic-ui-react';

const EmptyStateComponent = ({
  icon = 'inbox',
  title,
  description,
  actionLabel,
  onAction,
}) => (
  <Message icon className="storepilot-message">
    <Icon name={icon} />
    <Message.Content>
      <Header as="h3">{title}</Header>
      <p>{description}</p>
      {actionLabel ? (
        <Button primary className="storepilot-button" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </Message.Content>
  </Message>
);

export default EmptyStateComponent;
