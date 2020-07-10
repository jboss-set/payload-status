import React from 'react';
import { Table, TableHeader, TableBody, SortByDirection } from '@patternfly/react-table';

export default class IssueTable extends React.Component {
  constructor(props) {
    super(props);
    this.onSort = this.onSort.bind(this);
  }

  onSort(_event, index, direction) {
    const sortedRows = this.props.rows.sort((a, b) => {
        let [first, second] = [a.cells[index].sortKey, b.cells[index].sortKey];
        return first < second ? -1 : first > second ? 1 : 0;
    });
    this.props.updateRows({
      sortBy: {
        index,
        direction
      },
      rows: direction === SortByDirection.asc ? sortedRows : sortedRows.reverse()
    });
  }

  render() {
    const { caption, className, columns, rows, sortBy } = this.props;
    return (
      <Table aria-label="Simple Table" caption={caption} className={className} sortBy={sortBy} onSort={this.onSort} cells={columns} rows={rows}>
        <TableHeader />
        <TableBody />
      </Table>
    );
  }
}
