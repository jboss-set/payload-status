import React, { useState } from 'react';

import { Table, Thead, Tbody, Tr, Th, Td, TableVariant } from '@patternfly/react-table';
import { Toolbar, ToolbarItem, ToolbarContent } from '@patternfly/react-core';
import { Spinner, Button } from '@patternfly/react-core';
import TimesIcon from '@patternfly/react-icons/dist/js/icons/times-icon';
import { ToolbarSelect } from '../common/Util';
import MessageBar from '../common/MessageBar';
import { handleError, handleResponse } from '../common/Errors';
import { conf } from '../common/Conf';
import UpgradeSelects from './UpgradeSelects';

const repos = {
  'EAP': {
    id: 'wildfly-wildfly',
    filter: (tags) => tags.filter(tag => tag.includes("EAP_7.")).concat(tags.filter(tag => tag.includes(".x")))
  },
  'EAP Core': {
    id: 'wildfly-wildfly-core',
    filter: (tags) => tags.filter(tag => tag.match(/^1\d\./))
  }
};

const tagURL = (url, repo) => `${url}tags/${repo}`;
const compareURL = (url, repo, tag1, tag2) => `${url}upgrades/${repo}/${tag1}/${tag2}`;

const tablify = (upgrades) => upgrades.map(u => [u.componentId, u.oldVersion, u.newVersion]);

const ReportTable = ({data}) => (
  <Table aria-label="Simple Table" variant={TableVariant.compact}>
    <Thead>
      <Tr>
        <Th>Component</Th>
        <Th>Old</Th>
        <Th>New</Th>
      </Tr>
    </Thead>
    <Tbody>
      {data.map(row => (
      <Tr key={row[0]}>
        <Td>{row[0]}</Td><Td>{row[1]}</Td><Td>{row[2]}</Td>
      </Tr>
      ))}
    </Tbody>
  </Table>
);

const UpgradeReport = () => {
  const url = conf.url;
  const [data, setData] = useState({
    selectedRepo: null,
    upgrades: null
  });

  const [status, setStatus] = useState({
    loading: false,
    error: null
  });

  const loadTags = (repoName) => {
    if (!repoName) {
      setData(prevState => ({...prevState, repo: null}));
      return;
    }
    setStatus({loading: true});
    let selected = repos[repoName].id;
    if (!data[selected]) {
      fetch(tagURL(url, selected))
        .then(handleResponse)
        .then(json => {
          setData(prevState => ({...prevState, [selected]: repos[repoName].filter(json), selectedRepo: selected, upgrades: null}));
          setStatus({loading: false});
        })
        .catch(error => setStatus({error: handleError(error), loading: false}));
    } else {
      setData(prevState => ({...prevState, selectedRepo: selected, upgrades: null}));
      setStatus({loading: false});
    }
  }

  const loadReport = (tag1, tag2) => {
    setStatus({loading: true});
    fetch(compareURL(url, data.selectedRepo, tag1, tag2))
      .then(handleResponse)
      .then(json => {
        setData(prevState => ({...prevState, upgrades: tablify(json)}));
        setStatus({loading: false});
      })
      .catch(error => setStatus({error: handleError(error), loading: false}))
  }

  const unload = () => setData(prevState => ({...prevState, upgrades: null}));

  return (
    <div>
      <Toolbar id="cu-toolbar">
        <ToolbarContent>
          <ToolbarItem variant="label">Upgrade Report</ToolbarItem>
          <ToolbarItem>
            <ToolbarSelect id="repo-select" data={repos} onSelectCallback={loadTags} />
          </ToolbarItem>
          <UpgradeSelects reportCallback={loadReport} repos={repos} data={data} />
          {data.upgrades && <ToolbarItem><Button variant="secondary" onClick={unload}>Clear <TimesIcon/></Button></ToolbarItem>}
          {status.loading && <ToolbarItem><Spinner size="lg"/></ToolbarItem>}
        </ToolbarContent>
      </Toolbar>
      {status.error && <MessageBar error={status.error} />}
      {data.upgrades?.length && <ReportTable data={data.upgrades} />}
      {data.upgrades?.length === 0 && <span>No upgrades</span>}
    </div>
  )
};

export default UpgradeReport;
