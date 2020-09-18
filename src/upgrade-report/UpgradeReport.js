import React, { useState } from 'react';

import { Table, TableHeader, TableBody, TableVariant  } from '@patternfly/react-table';
import { Toolbar, ToolbarItem, ToolbarContent, Button } from '@patternfly/react-core';
import { Select, SelectOption, Spinner } from '@patternfly/react-core';
import TimesIcon from '@patternfly/react-icons/dist/js/icons/times-icon';
import { defaultOption } from '../common/Util';
import MessageBar from '../common/MessageBar';
import { errors } from '../common/Errors'

const repos = {
  'EAP': {
    id: 'wildfly-wildfly',
    filter: (tags) => tags.filter(tag => tag.includes("EAP_7.")).slice(0,20).concat(tags.filter(tag => tag.includes(".x")).slice(0,10))
  },
  'EAP Core': {
    id: 'wildfly-wildfly-core',
    filter: (tags) => tags.slice(0,20)
  }
}

const tagURL = (url, repo) => `${url}tags/${repo}`;
const compareURL = (url, repo, tag1, tag2) => `${url}upgrades/${repo}/${tag1}/${tag2}`;

const tablify = (upgrades) => upgrades.map(u => [u.componentId, u.oldVersion, u.newVersion]);

const RepoSelect = ({onSelect}) => {
  const [isOpen, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const select = (e, value, isPlaceholder) => {
    if (isPlaceholder) {
      onSelect("");
      setSelected("");
    } else {
      onSelect(value);
      setSelected(value);
    }
    setOpen(!isOpen);
  }

  return (
    <ToolbarItem>
      <Select onSelect={select} onToggle={setOpen} isOpen={isOpen} selections={selected}>
        {defaultOption}
        {Object.keys(repos).map((item, index) => (
          <SelectOption key={index} value={item} />
        ))}
      </Select>
    </ToolbarItem>
  )
}

const UpgradeSelects = ({loadTags, loadReport, unload, data}) => {
  const [isOpen, setOpen] = useState({left: false, right: false});
  const [selected, setSelected] = useState({left: "", right: ""});

  const openLeft = (open) => {
    setOpen(prev => ({...prev, left: open}));
  }

  const openRight = (open) => {
    setOpen(prev => ({...prev, right: open}));
  }

  const selectLeft = (e, val, isPlaceholder) => {
    let value = isPlaceholder ? "" : val;
    setSelected(prev => ({...prev, left: value}));
    openLeft(!isOpen.left);
  }

  const selectRight = (e, val, isPlaceholder) => {
    let value = isPlaceholder ? "" : val;
    setSelected(prev => ({...prev, right: value}));
    openRight(!isOpen.right);
  }

  const clearAll = () => {
    setSelected({left: "", right: ""});
  }

  const onRepoSelect = (repo) => {
    loadTags(repo);
    clearAll();
  }

  return (
    <>
      <ToolbarItem variant="label">Upgrade Report</ToolbarItem>
      <RepoSelect onSelect={onRepoSelect} />
      {data.repo && <CompareSelector data={data[data.repo]} report={loadReport}
          isOpenLeft={isOpen.left} setOpenLeft={openLeft}
          isOpenRight={isOpen.right} setOpenRight={openRight}
          selectedLeft={selected.left} selectLeft={selectLeft}
          selectedRight={selected.right} selectRight={selectRight}
        />}
      {data.upgrades && <ToolbarItem><Button variant="secondary" onClick={unload}>Clear <TimesIcon/></Button></ToolbarItem>}
    </>
  )
}

const CompareSelector = ({isOpenLeft, setOpenLeft, isOpenRight, setOpenRight,
                        selectedLeft, selectLeft, selectedRight, selectRight, data, report}) => {

  const click = () => {
    if (selectedLeft && selectedRight) {
      report(selectedLeft, selectedRight);
    }
  }

  return (
    <>
      <TagSelect onSelect={selectLeft} onToggle={setOpenLeft} isOpen={isOpenLeft} selections={selectedLeft} data={data} />
      <TagSelect onSelect={selectRight} onToggle={setOpenRight} isOpen={isOpenRight} selections={selectedRight} data={data} />
      <ToolbarItem>
        <Button onClick={click} isDisabled={!selectedLeft || !selectedRight}>Generate</Button>
      </ToolbarItem>
    </>
  )
}

const TagSelect = ({onSelect, onToggle, isOpen, selections, data}) => (
  <ToolbarItem>
    <Select onSelect={onSelect} onToggle={onToggle} isOpen={isOpen} selections={selections}>
      {defaultOption}
      {data.map((item, index) => (
        <SelectOption key={index} value={item} />
      ))}
    </Select>
  </ToolbarItem>
)

const ReportTable = ({data}) => (
  <Table aria-label="Simple Table" cells={["Component", "Old", "New"]} rows={data} variant={TableVariant.compact}>
    <TableHeader />
    <TableBody />
  </Table>
);

const UpgradeReport = ({url}) => {
  const [data, setData] = useState({
    repo: null,
    'jbossas-jboss-eap7': null,
    'jbossas-wildfly-core-eap': null,
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
    let repoId = repos[repoName].id;
    if (!data[repoId]) {
      fetch(tagURL(url, repoId))
        .then(response => response.json())
        .then(json => {
          setData(prevState => {
            let newState = {...prevState};
            newState[repoId] = repos[repoName].filter(json);
            newState['repo'] = repoId;
            newState['upgrades'] = null;
            return newState;
          });
          setStatus({loading: false});
        })
        .catch(error => setStatus({error: handleError(error), loading: false}))
    } else {
      setData(prevState => ({...prevState, repo: repoId, upgrades: null}));
      setStatus({loading: false});
    }
  }

  const loadReport = (tag1, tag2) => {
    setStatus({loading: true});
    fetch(compareURL(url, data.repo, tag1, tag2))
      .then(response => response.json())
      .then(json => {
        setData(prevState => ({...prevState, upgrades: tablify(json)}));
        setStatus({loading: false});
      })
      .catch(error => setStatus({error: handleError(error), loading: false}))
  }

  const unload = () => setData(prevState => ({...prevState, upgrades: null}))

  const handleError = (error) => {
    if (error.message === "Failed to fetch") {
      return errors["tag-fetch-fail"];
    }
    return error;
  }

  return (
    <div>
      <Toolbar id="cu-toolbar">
        <ToolbarContent>
          <UpgradeSelects loadTags={loadTags} loadReport={loadReport} unload={unload} data={data} />
          {status.loading && <ToolbarItem><Spinner size="lg"/></ToolbarItem>}
        </ToolbarContent>
      </Toolbar>
      {status.error && <MessageBar error={status.error} />}
      {data.upgrades && <ReportTable data={data.upgrades} />}
    </div>
  )
}

export default UpgradeReport;
