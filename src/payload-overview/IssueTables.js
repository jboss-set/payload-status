import React from 'react';

import IssueTable from './IssueTable';
import { standaloneColumns, upgradeColumns } from './TableUtil';
import { Link } from '../common/Util';
import { Title } from '@patternfly/react-core';

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
        <Link url={link} text="View in PRBZ" />
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
