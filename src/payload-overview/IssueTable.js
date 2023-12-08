import React from 'react';
import { SortByDirection } from '@patternfly/react-table';
import { Table, Thead, Tbody, Tr, Th, Td, Caption } from '@patternfly/react-table';

import classnames from 'classnames';

const IssueTable = ({caption, className, columns, rows, sortBy, updateRows, devAckModeOn, newIssuesOnly}) => {

  const onSort = (_event, index, direction) => {
    const sortedRows = rows.sort((a, b) => {
        let [first, second] = [a.cells[index].sortKey, b.cells[index].sortKey];
        return first < second ? -1 : first > second ? 1 : 0;
    });
    updateRows({
      sortBy: {
        index,
        direction
      },
      rows: direction === SortByDirection.asc ? sortedRows : sortedRows.reverse()
    });
  }

  return (
    <Table className={classnames(className, !devAckModeOn ? 'mode-plain' : 'mode-dev-ack', newIssuesOnly ? 'new-only' : '')}>
      <Caption>{caption}</Caption>
      <Thead>
        <Tr>
          {columns.map((column, columnIndex) => {
            const sortParams =
              column.sortable && sortBy
                ? {
                  sort: {
                    sortBy: sortBy,
                    onSort,
                    columnIndex
                  }
                }
                : {};
            const decorations = column.className ? {className: column.className} : {};
            return <Th key={columnIndex} {...sortParams} {...decorations}>{column.title}</Th>;
          })}
        </Tr>
      </Thead>
      <Tbody>
        {rows.map((row, rowIndex) => (
          <Tr key={rowIndex} className={`${row.className} ${row.isNew ? 'row-new' : 'row-old'}`}>
            {row.cells.map((cell, cellIndex) => {
              const decorations = cell.className ? {className: cell.className} : {};
              return <Td key={`${rowIndex}_${cellIndex}`} dataLabel={columns[cellIndex].title} {...decorations}>
                {cell.title}{cell.icon}
              </Td>
            })}
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
}

export default IssueTable
