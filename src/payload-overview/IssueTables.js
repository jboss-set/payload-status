import React from 'react';

import IssueTable from './IssueTable';
import { sortable, classNames } from '@patternfly/react-table';
import { Title, Button } from '@patternfly/react-core';

const standaloneColumns = [
  { title: "Number", transforms: [sortable] },
  { title: "Priority", transforms: [sortable] },
  { title: "Status", transforms: [sortable] },
  { title: "Name", columnTransforms: [classNames('issue-name')] },
  { title: "Type", columnTransforms: [classNames('issue-type')] },
  { title: "Acks" },
  { title: "PR Status", transforms: [sortable] },
  { title: "Upstream" }
];

const upgradeColumns = [
  { title: "Number" },
  { title: "Priority" },
  { title: "Status" },
  { title: "Name", columnTransforms: [classNames('issue-name')] },
  { title: "Type", columnTransforms: [classNames('issue-type')] },
  { title: "Acks" },
  { title: "PR Status" },
  { title: "Upstream" }
];

const IssueTables = ({link,data,setRows}) => {

  const updateStandaloneRows = (standalone) => {
    setRows(prevState => ({
        ...prevState,
        standalone: {
          rows: standalone.rows,
          sortBy: standalone.sortBy
        }
    }))
  };

  return (
    <div>
      <Title headingLevel="h1" size="xl">
        {`${data.standalone.rows.length + data.upgrades.rows.length} issues in payload`}
        <Button component="a" href={link} target="_blank" variant="link">View in PRBZ</Button>
      </Title>
      <IssueTable
        caption={`${data.standalone.rows.length} Standalone issues`}
        className="standalone"
        columns={standaloneColumns}
        rows={data.standalone.rows}
        sortBy={data.standalone.sortBy}
        updateRows={updateStandaloneRows}
      />
      <IssueTable
        caption={`${data.upgradesTotal} Component upgrades, ${data.upgrades.rows.length} issues total`}
        className="upgrades"
        columns={upgradeColumns}
        rows={data.upgrades.rows}
      />
    </div>
  )
}

export default IssueTables
