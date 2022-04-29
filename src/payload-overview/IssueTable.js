import React from 'react';
import { SortByDirection } from '@patternfly/react-table';
import { TableComposable, Thead, Tbody, Tr, Th, Td, Caption } from '@patternfly/react-table';

const IssueTable = ({caption, className, columns, rows, sortBy, updateRows}) => {

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
    <TableComposable className={className}>
      <Caption>{caption}</Caption>
      <Thead>
        <Tr>
          {columns.map((column, columnIndex) => {
            const sortParams =
              column.sortable
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
          <Tr key={rowIndex}>
            {row.cells.map((cell, cellIndex) => {
              const decorations = cell.className ? {className: cell.className} : {};
              return <Td key={`${rowIndex}_${cellIndex}`} dataLabel={columns[cellIndex].title} {...decorations}>
                {cell.title}{cell.icon}
              </Td>
            })}
          </Tr>
        ))}
      </Tbody>
    </TableComposable>
  );
}

export default IssueTable
