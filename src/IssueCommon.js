import React from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  SortByDirection
} from '@patternfly/react-table';

export class IssueTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: props.columns,
      rows: props.rows,
      sortBy: {}
    };
    this.onSort = this.onSort.bind(this);
  }

  onSort(_event, index, direction) {
    const sortedRows = this.state.rows.sort((a, b) => {
        let [first, second] = [a.cells[index].sortKey, b.cells[index].sortKey];
        return first < second ? -1 : first > second ? 1 : 0;
    });
    this.setState({
      sortBy: {
        index,
        direction
      },
      rows: direction === SortByDirection.asc ? sortedRows : sortedRows.reverse()
    });
  }

  render() {
    const { columns, rows, sortBy } = this.state;

    return (
      <Table aria-label="Simple Table" caption={this.props.caption} className={this.props.className} sortBy={sortBy} onSort={this.onSort} cells={columns} rows={rows}>
        <TableHeader />
        <TableBody />
      </Table>
    );
  }
}
