import { Message, Pagination, Table } from 'semantic-ui-react';

const ListComponent = ({
  columns,
  rows,
  renderRow,
  emptyTitle = 'Sin registros',
  emptyMessage = 'Todavía no hay información disponible.',
  pagination = null,
  onPageChange,
}) => (
  <>
    <Table celled unstackable={false} className="storepilot-table">
      <Table.Header>
        <Table.Row>
          {columns.map((column) => (
            <Table.HeaderCell key={column.key}>{column.label}</Table.HeaderCell>
          ))}
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {rows.length > 0 ? (
          rows.map((row) => renderRow(row))
        ) : (
          <Table.Row>
            <Table.Cell colSpan={columns.length}>
              <Message info>
                <Message.Header>{emptyTitle}</Message.Header>
                <p>{emptyMessage}</p>
              </Message>
            </Table.Cell>
          </Table.Row>
        )}
      </Table.Body>
    </Table>
    {pagination && pagination.total > pagination.page_size ? (
      <Pagination
        activePage={pagination.page}
        totalPages={Math.ceil(pagination.total / pagination.page_size)}
        onPageChange={(_, data) => onPageChange?.(Number(data.activePage))}
      />
    ) : null}
  </>
);

export default ListComponent;
