import React from 'react';

import classnames from 'classnames';

import CheckIcon from '@patternfly/react-icons/dist/js/icons/check-icon';
import FlagIcon from '@patternfly/react-icons/dist/js/icons/flag-icon';

const getKeyFromUrl = (url) => url.substr(url.lastIndexOf('/')+1);

const Link = ({url, text}) => <a href={url} target="_blank" rel="noopener noreferrer">{text}</a>;
const IssueLink = ({url}) => <Link url={url} text={getKeyFromUrl(url)}/>;

export const columns = [
  { title: "Number", sortable: true, className: 'column-number' },
  { title: "Priority", sortable: true, className: 'column-priority' },
  { title: "Status", sortable: true, className: 'column-status' },
  { title: "Assignee", sortable: true, className: 'column-assignee' },
  { title: "Name", className: 'column-name' },
  { title: "Type", className: 'column-type' },
  { title: "Target Release", className: 'column-release' },
  { title: "Acks", className: 'column-acks' },
  { title: "PR Status", sortable: true, className: 'column-pr' },
  { title: "Upstream", className: 'column-upstream' },
  { title: "Violations", className: 'column-violations' }
];

const shortName = (name) => {
  if (name == null) return "null";
  switch (name.toLowerCase()) {
    case 'coding in progress': return 'Coding …';
    case 'pull request sent': return 'PR sent';
    case 'component upgrade': return 'UPGRADE';
    default: return name;
  }
};

const getPRClassName = (status) => {
  switch(status) {
    case 'merged':
    case 'work branch':
      return ISSUE_SUCCESS
    case 'clean':
      return 'pr-clean';
    case 'failed to read':
      return 'pr-dnf';
    default:
      return 'pr-fail';
  }
};

export const translateMergeStatus = (status) => {
  switch(status) {
    case 'merged':
      return 'merged (full)'
    case 'work branch':
      return 'merged (work branch)'
    case 'failed to read':
      return status;
    default:
      return `open (${status})`;
  }
};

export const getMergeStatus = (pullRequest) => {
  let mergeStatus = pullRequest.mergeStatus.toLowerCase(),
      merged = pullRequest.merged.replaceAll('_', ' ').toLowerCase(),
      status = merged !== 'unmerged' ? merged : mergeStatus;
  if (status === 'unknown' && pullRequest.codebase === '') {
    status = 'failed to read';
  }
  return status;
};

const unescape = (text) => text.replaceAll("&quot;",'"');

const ISSUE_SUCCESS = 'issue-success';

export function orderData(data) {
  let result = {},
      standalone = [],
      bugs = {},
      upgrades = data.filter(issue => issue.rawType.toLowerCase() === "component upgrade");

  data.filter(issue => issue.rawType.toLowerCase() !== "component upgrade").forEach(item => {
    bugs[getKeyFromUrl(item.url)] = item;
  });

  upgrades.forEach(upgrade => {
    upgrade.nested = [];
    if (upgrade.linkedIncorporatesIssues) {
      upgrade.linkedIncorporatesIssues.forEach(inc => {
        let name = getKeyFromUrl(inc),
            issue = bugs[name];
        if (issue) {
          upgrade.nested.push(issue);
          delete bugs[name];
        }
      });
    }
  });

  for (let d in bugs) {
    standalone.push(bugs[d]);
  }

  result.standalone = standalone;
  result.upgrades = upgrades;

  return result;
};

export const markNewIssues = (rows, newIssues) => {
  rows.forEach((row) => {
    let isNew = newIssues.includes(row.cells[0].title.props.url);
    row.isNew = isNew;
    row.cells[0].icon = isNew ? <FlagIcon /> : null;
  });
}

export const tablify = (data, payload) =>
  [toTableData(data.standalone, payload, false), toTableData(data.upgrades, payload, true)];

// turn JSON into table data
const toTableData = (issues, payload, processNested) => {
  let result = [];

  issues.forEach((issue) => {
    let row = issueToRow(issue, payload);

    result.push(row);

    if (processNested) {
      for (let i = 0; i < 5; i++) {
        row.cells[i].className = classnames(row.cells[i].className, 'row-upgrade');
      }

      issue.nested.forEach((bug) => {
        result.push(issueToRow(bug, payload));
      })
    }
  });

  return result;
};

const issueToRow = ({url, priority, rawStatus, assignee, summary, rawType, acks, pullRequest, streamStatus, violations},
    payload) => {
  let row = {},
      cells = [
    makeCell(<IssueLink url={url} />, Number.parseInt(url.substr(url.lastIndexOf('-')+1))),  // number
    makeCell(priority),                                       // priority
    makeCell(shortName(rawStatus).toUpperCase()),             // status
    makeCell(assignee),                                       // assignee
    makeCell(unescape(summary)),                              // name
    makeCell(shortName(rawType).toUpperCase()),               // type
    makeReleaseCell(streamStatus, payload),                   // target release
    makeAckCell(acks),                                        // acks
    makePrCell(pullRequest),                                  // pr status
    makeUpstreamCell(pullRequest),                            // upstream
    makeViolationsCell(violations)                            // violations
  ];

  cells.map((cell, i) => {
    if (columns[i].sortable) {
      cell.sortKey = cell.sortKey ? cell.sortKey : cell.title;
    }
    cell.className = classnames(cell.className, columns[i].className);
    return cell;
  });

  row.cells = cells;
  row.className = rawType === 'BUG' ? 'row-bug' : (rawType === 'COMPONENT UPGRADE' ? 'row-comp' : 'row-other');
  return row;
};

const makeCell = (title, sortKey, className) => {
  let cell = { title: title };
  if (sortKey) {
    cell.sortKey = sortKey;
  }
  if (className) {
    cell.className = className;
    if (className === ISSUE_SUCCESS) {
      cell.icon = <CheckIcon />
    }
  }
  return cell;
};

const makeReleaseCell = (status, payload) => {
  if (status === undefined) {
    return makeCell('N/A');
  }
  let target = payload.substr(0,3) + ".z.GA";

  return makeCell(Object.keys(status).join(","), null, !!status[target] ? ISSUE_SUCCESS : '');
}

const makeAckCell = (acks) => {
  let flags = [];
  for (let flag in acks) {
    if (acks[flag] !== 'ACCEPTED') {
      flags.push(flag + (acks[flag] === 'SET' ? '?' : '-'));
    }
  }

  if (!flags.length) {
    return makeCell('All Clear', 'all', ISSUE_SUCCESS);
  }

  return makeCell(flags.join(' '));
};

const makePrCell = (prs) => {
  if (!prs || prs.length === 0) return makeCell('No PR');

  let list = prs.map((item) => {
    let status = getMergeStatus(item);
    let className = getPRClassName(status);
    return makeCell(<a href={item.link}>{translateMergeStatus(status)}</a>, status, className)
  });

  let titles = [],
      sortKey = list[0].sortKey,
      className = '',
      css = { [ISSUE_SUCCESS]: 0, 'pr-clean': 0, 'pr-fail': 0, 'pr-dnf': 0 }

  list.forEach((item, key) => {
    titles.push(<span key={key}>{item.title}<br/></span>);

    if (item.className) {
      css[item.className] += 1;
    }
  });

  className = classnames({...css});

  return makeCell(titles, sortKey, className);
};

const makeUpstreamCell = (prs) => {
  if (!prs || prs.length === 0) return makeCell("");

  let list = prs.map(upstreamIssues);

  let titles = [],
      sortKey = list[0].sortKey,
      className = '',
      css = { [ISSUE_SUCCESS]: 0 }

  list.forEach((item, key) => {
    titles.push(<div className="upstream-issues" key={key}>{item.title}</div>);

    if (item.className) {
      css[item.className] += 1;
    }
  })

  if (css[[ISSUE_SUCCESS]] > 0) {
    className = ISSUE_SUCCESS;
  }

  return makeCell(titles, sortKey, className);
};

const upstreamIssues = (pr) => {
  if (!pr.noUpstreamRequired && !pr.upstreamIssueFromPRDesc) return makeCell("Missing", 'missing');
  else if (pr.noUpstreamRequired) return makeCell("Not required", 'not-required', ISSUE_SUCCESS);

  let title =
    <>
      {"Issue: "}<IssueLink url={pr.upstreamIssueFromPRDesc}/><br/>
      {pr.upstreamPullRequestFromPRDesc && <>PR: <Link url={pr.upstreamPullRequestFromPRDesc} text={pr.upstreamPatchState}/></>}
    </>;

  return makeCell(title, '', pr.upstreamPatchState === 'CLOSED' ? ISSUE_SUCCESS : '');
};

const makeViolationsCell = (violations) => {
  if (violations === undefined) {
    return makeCell('N/A');
  }
  let text = violations.map((v,idx) => (
      <React.Fragment key={idx}><span>({v.level.toLowerCase()}): {v.message}</span><br /></React.Fragment>
    ));

  return makeCell(violations.length ? text : "No violations", '', violations.length ? '' : ISSUE_SUCCESS);
}
