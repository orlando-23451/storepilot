import { Confirm } from 'semantic-ui-react';

const ConfirmComponent = ({
  open,
  title = 'Confirmar acción',
  content,
  confirmButton = 'Confirmar',
  cancelButton = 'Cancelar',
  onCancel,
  onConfirm,
}) => (
  <Confirm
    open={open}
    header={title}
    content={content}
    cancelButton={cancelButton}
    confirmButton={confirmButton}
    onCancel={onCancel}
    onConfirm={onConfirm}
  />
);

export default ConfirmComponent;
