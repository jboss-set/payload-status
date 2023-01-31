import React, { useState } from 'react';

import IssueTable from './IssueTable';
import { columns } from './TableUtil';
import { Link } from '../common/Util';
import { Switch, Title } from '@patternfly/react-core';
import { Toolbar , ToolbarItem, ToolbarContent } from '@patternfly/react-core';

const IssueTables = ({link,data,setRows}) => {

  const [isDevAckMode, setDevAckMode] = useState(false);

  const updateStandaloneRows = (standalone) => {
    setRows(prevState => ({
        ...prevState,
        standalone: {
          rows: standalone.rows,
          sortBy: standalone.sortBy
        }
    }))
  };

  const toolbarItems = (
    <ToolbarItem className="mode-switch">
      <Switch
        id="dev-ack-switch"
        label="Dev Ack Readiness display"
        labelOff="Basic display"
        isChecked={isDevAckMode}
        onChange={setDevAckMode}
      />
    </ToolbarItem>
  );

  return (
    <div>
      <Title headingLevel="h1" size="xl">
        {`${data.standalone.rows.length + data.upgrades.rows.length} issues in payload`}
        <Link url={link} text="View in PRBZ" />
      </Title>
      <Toolbar>
        <ToolbarContent>{toolbarItems}</ToolbarContent>
      </Toolbar>
      <IssueTable
        caption={`${data.standalone.rows.length} Standalone issues`}
        className="standalone"
        columns={columns}
        rows={data.standalone.rows}
        sortBy={data.standalone.sortBy}
        updateRows={updateStandaloneRows}
        devAckModeOn={isDevAckMode}
      />
      <IssueTable
        caption={`${data.upgradesTotal} Component upgrades, ${data.upgrades.rows.length} issues total`}
        className="upgrades"
        columns={columns}
        rows={data.upgrades.rows}
        devAckModeOn={isDevAckMode}
      />
    </div>
  )
}

export default IssueTables
