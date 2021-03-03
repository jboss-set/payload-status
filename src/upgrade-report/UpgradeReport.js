import React, { useState } from 'react';

import { Table, TableHeader, TableBody, TableVariant  } from '@patternfly/react-table';
import { Toolbar, ToolbarItem, ToolbarContent } from '@patternfly/react-core';
import { Spinner, Button, Select, SelectOption } from '@patternfly/react-core';
import TimesIcon from '@patternfly/react-icons/dist/js/icons/times-icon';
import { defaultOption } from '../common/Util';
import MessageBar from '../common/MessageBar';
import { handleError, handleResponse } from '../common/Errors';
import { conf } from '../common/Conf';
import UpgradeSelects from './UpgradeSelects';

const repos = {
  'EAP': {
    id: 'wildfly-wildfly',
    filter: (tags) => tags.filter(tag => tag.includes("EAP_7.")).slice(0,20).concat(tags.filter(tag => tag.includes(".x")).slice(0,10))
  },
  'EAP Core': {
    id: 'wildfly-wildfly-core',
    filter: (tags) => tags.slice(0,20)
  }
};

const tagURL = (url, repo) => `${url}tags/${repo}`;
const compareURL = (url, repo, tag1, tag2) => `${url}upgrades/${repo}/${tag1}/${tag2}`;

const tablify = (upgrades) => upgrades.map(u => [u.componentId, u.oldVersion, u.newVersion]);

const RepoSelect = ({onSelectCallback}) => {
  const [isOpen, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const onSelect = (e, value, isPlaceholder) => {
    if (isPlaceholder) {
      onSelectCallback("");
      setSelected("");
    } else {
      onSelectCallback(value);
      setSelected(value);
    }
    setOpen(!isOpen);
  }

  return (
    <ToolbarItem>
      <Select onSelect={onSelect} onToggle={setOpen} isOpen={isOpen} selections={selected}>
        {defaultOption}
        {Object.keys(repos).map((item, index) => (
          <SelectOption key={index} value={item} />
        ))}
      </Select>
    </ToolbarItem>
  )
};

const ReportTable = ({data}) => (
  <Table aria-label="Simple Table" cells={["Component", "Old", "New"]} rows={data} variant={TableVariant.compact}>
    <TableHeader />
    <TableBody />
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
          <RepoSelect onSelectCallback={loadTags}/>
          <UpgradeSelects reportCallback={loadReport} repos={repos} data={data} />
          {data.upgrades && <ToolbarItem><Button variant="secondary" onClick={unload}>Clear <TimesIcon/></Button></ToolbarItem>}
          {status.loading && <ToolbarItem><Spinner size="lg"/></ToolbarItem>}
        </ToolbarContent>
      </Toolbar>
      {status.error && <MessageBar error={status.error} />}
      {data.upgrades && <ReportTable data={data.upgrades} />}
    </div>
  )
};

export default UpgradeReport;
