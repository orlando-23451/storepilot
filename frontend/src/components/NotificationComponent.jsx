import { Message } from 'semantic-ui-react';

const NotificationComponent = ({ notification, onDismiss }) => {
  if (!notification) {
    return null;
  }

  const colorMap = {
    success: 'green',
    warning: 'yellow',
    error: 'red',
    info: 'blue',
  };

  return (
    <Message
      className="storepilot-message"
      color={colorMap[notification.type] || 'blue'}
      onDismiss={onDismiss}
      header={notification.title}
      content={notification.message}
    />
  );
};

export default NotificationComponent;
