import React, { useState } from 'react';

import IssueTable from './IssueTable';
import { columns, markNewIssues } from './TableUtil';
import { Link } from '../common/Util';
import { DatePicker, Switch, Title } from '@patternfly/react-core';
import { Toolbar , ToolbarItem, ToolbarContent } from '@patternfly/react-core';

const IssueTables = ({link,data,setRows,setNewSince}) => {

  const [isDevAckMode, setDevAckMode] = useState(false);
  const [isNewIssuesOnly, setNewIssuesOnly] = useState(false);

  const updateStandaloneRows = (standalone) => {
    setRows(prevState => ({
        ...prevState,
        standalone: {
          rows: standalone.rows,
          sortBy: standalone.sortBy
        }
    }))
  };

  const dateValidator = (date) => date > new Date() ? 'this is a future date' : ''

  const toolbarItems = (
    <>
      <ToolbarItem className="mode-switch" alignSelf="center">
        <Switch
          id="dev-ack-switch"
          className="dev-ack-switch"
          label="Dev Ack Readiness display"
          labelOff="Basic display"
          isChecked={isDevAckMode}
          onChange={(_event, val) => setDevAckMode(val)}
        />
      </ToolbarItem>
      <ToolbarItem variant="separator" />
      <ToolbarItem>
        <DatePicker value={data.newSince}
          validators={[dateValidator]}
          popoverProps={{position: 'right'}}
          appendTo={() => document.body}
          onChange={setNewSince}
          weekStart={1} />
      </ToolbarItem>
      <ToolbarItem alignSelf="center">
        <Switch id="new-issues-only" label="New issues only" labelOff="All issues" isChecked={isNewIssuesOnly} onChange={(_event, val) => setNewIssuesOnly(val)} />
      </ToolbarItem>
    </>
  );

  if (data.newIssues.length) {
    markNewIssues(data.standalone.rows, data.newIssues);
    markNewIssues(data.upgrades.rows, data.newIssues);
  }

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
        newIssuesOnly={isNewIssuesOnly}
      />
      <IssueTable
        caption={`${data.upgradesTotal} Component upgrades, ${data.upgrades.rows.length} issues total`}
        className="upgrades"
        columns={columns}
        rows={data.upgrades.rows}
        devAckModeOn={isDevAckMode}
        newIssuesOnly={isNewIssuesOnly}
      />
    </div>
  )
}

export default IssueTables
