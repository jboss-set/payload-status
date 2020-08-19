import React, { useState } from 'react';

import { Table, TableHeader, TableBody, TableVariant  } from '@patternfly/react-table';
import { Toolbar, ToolbarItem, ToolbarContent, Button } from '@patternfly/react-core';
import { Select, SelectOption } from '@patternfly/react-core';

const repos = {
  'EAP': {
    id: 'jbossas-jboss-eap7',
    filter: (tags) => tags.filter(tag => tag.includes("EAP_7.")).slice(0,20).concat(tags.filter(tag => tag.includes(".x")).slice(0,10))
  },
  'EAP Core': {
    id: 'jbossas-wildfly-core-eap',
    filter: (tags) => tags.slice(0,20)
  }
}

const tagURL = (repo) => `http://localhost:8080/prbz-overview/rest/api/tags/${repo}`;
const compareURL = (repo, tag1, tag2) => `http://localhost:8080/prbz-overview/rest/api/upgrades/${repo}/${tag1}/${tag2}`;

const tablify = (upgrades) => upgrades.map(u => [u.componentId, u.oldVersion, u.newVersion]);

const RepoSelect = ({onSelect}) => {
  const [isOpen, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const select = (e, value) => {
    onSelect(value);
    setSelected(value);
    setOpen(!isOpen);
  }

  return (
    <ToolbarItem>
      <Select onSelect={select} onToggle={setOpen} isOpen={isOpen} selections={selected}>
        <SelectOption key={0} value="" isPlaceholder={true} />
        {Object.keys(repos).map((item, index) => (
          <SelectOption key={index} value={item} />
        ))}
      </Select>
    </ToolbarItem>
  )
}

const UpgradeSelects = ({loadTags, loadReport, data}) => {
  const [isOpenLeft, setOpenLeft] = useState(false);
  const [isOpenRight, setOpenRight] = useState(false);

  const [selectedLeft, setSelectedLeft] = useState(null);
  const [selectedRight, setSelectedRight] = useState(null);

  const selectLeft = (e, value) => {
    setSelectedLeft(value);
    setOpenLeft(!isOpenLeft);
  }

  const selectRight = (e, value) => {
    setSelectedRight(value);
    setOpenRight(!isOpenRight);
  }

  const clearAll = () => {
    setSelectedLeft(null);
    setSelectedRight(null);
  }

  const onRepoSelect = (repo) => {
    loadTags(repo);
    clearAll();
  }

  return (
    <Toolbar id="cu-toolbar">
      <ToolbarContent>
        <ToolbarItem variant="label">Upgrade Report</ToolbarItem>
        <RepoSelect onSelect={onRepoSelect} />
        {data.repo && <CompareSelector data={data[data.repo]} report={loadReport}
            isOpenLeft={isOpenLeft} setOpenLeft={setOpenLeft}
            isOpenRight={isOpenRight} setOpenRight={setOpenRight}
            selectedLeft={selectedLeft} selectLeft={selectLeft}
            selectedRight={selectedRight} selectRight={selectRight}
          />}
      </ToolbarContent>
    </Toolbar>
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
        <Button onClick={click}>Generate</Button>
      </ToolbarItem>
    </>
  )
}

const TagSelect = ({onSelect, onToggle, isOpen, selections, data}) => (
  <ToolbarItem>
    <Select onSelect={onSelect} onToggle={onToggle} isOpen={isOpen} selections={selections}>
      <SelectOption key={0} value="" isPlaceholder={true} />
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

const UpgradeReport = () => {
  const [data, setData] = useState({
    repo: null,
    'jbossas-jboss-eap7': null,
    'jbossas-wildfly-core-eap': null,
    upgrades: null
  })

  const loadTags = (repoName) => {
    let repoId = repos[repoName].id;
    if (!data[repoId]) {
      fetch(tagURL(repoId))
        .then(response => response.json())
        .then(json => {
          setData(prevState => {
            let newState = {...prevState};
            newState[repoId] = repos[repoName].filter(json);
            newState['repo'] = repoId;
            newState['upgrades'] = null;
            return newState;
          });
        })
    } else {
      setData(prevState => ({...prevState, repo: repoId, upgrades: null}));
    }
  }

  const loadReport = (tag1, tag2) => {
    fetch(compareURL(data.repo, tag1, tag2))
      .then(response => response.json())
      .then(json => {
        console.log(tablify(json));
        setData(prevState => ({...prevState, upgrades: tablify(json)}))
      })
  }

  return (
    <div>
      <UpgradeSelects loadTags={loadTags} loadReport={loadReport} data={data} />
      {data.upgrades && <ReportTable data={data.upgrades} />}
    </div>
  )
}

export default UpgradeReport;
