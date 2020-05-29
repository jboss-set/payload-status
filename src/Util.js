import React from 'react';

export function getKeyFromUrl(url) {
  return url.substr(url.lastIndexOf('/')+1);
}

export function safeClassName(name) {
  return name.replace(' ', '-').toLowerCase();
}

export function shortName(name) {
  switch (name.toLowerCase()) {
    case 'coding in progress': return 'Coding …';
    case 'pull request sent': return 'PR SENT';
    case 'component upgrade': return 'UPGRADE';
    default: return name;
  }
}

export function orderData(data) {
  let result = {},
      bugs = {},
      upgrades = data.filter(issue => issue.type.toLowerCase() === "component upgrade");

  data.filter(issue => issue.type.toLowerCase() !== "component upgrade").forEach(item => {
    bugs[getKeyFromUrl(item.url)] = item;
  });

  upgrades.forEach(upgrade => {
    upgrade.nested = [];
    upgrade.incorporated.forEach(inc => {
      let name = getKeyFromUrl(inc),
          issue = bugs[name];
      if (issue) {
        upgrade.nested.push(issue);
        delete bugs[name];
      }
    });
  });

  let standalone = [];

  for (let d in bugs) {
    standalone.push(bugs[d]);
  }

  result.upgrades = upgrades;
  result.standalone = standalone;

  return result;
}

export const Link = ({url}) => <a href={url}>{getKeyFromUrl(url)}</a>

export function tablify(issues, processNested) {
  let result = [];

  issues.forEach((issue) => {
    let row = issueToRow(issue);

    result.push(row);

    if (processNested) {
      for (let i = 0; i < 5; i++) {
        row.cells[i].props = { className: 'row-upgrade' };
      }

      issue.nested.forEach((bug) => {
        result.push(issueToRow(bug));
      })
    }
  })

  return result;
}

function issueToRow({url, priority, status, summary, type, acks, ...rest}) {
  let row = {};

  row.cells = [
    makeCell(<Link url={url} />, Number.parseInt(url.substr(url.lastIndexOf('-')+1))),
    makeCell(priority),
    makeCell(shortName(status)),
    makeCell(summary),
    makeCell(shortName(type))
  ].concat(ackCell(acks))
  .concat(tablifyPR(rest['pull-requests']));

  return row;
}

function makeCell(title, sortKey, className) {
  let cell = { title: title, sortKey: title };
  if (sortKey) {
    cell.sortKey = sortKey;
  }
  if (className) {
    cell.props = { className: className };
  }
  return cell;
}

function ackCell(acks) {
  let flags = [];
  for (let flag in acks) {
    if (acks[flag] !== 'ACCEPTED') {
      flags.push(flag + (acks[flag] === 'SET' ? '?' : '-'));
    }
  }

  if (!flags.length) {
    return makeCell('All Clear', 'all', 'issue-success');
  }

  return makeCell(flags.join(' '));
}

function tablifyPR(pr) {
  if (pr.length === 0) return [ makeCell('No PR'), "" ];
  if (pr.length > 1) return [ makeCell('Many PRs') , "" ];

  return [
    makeCell(<a href={pr[0].url}>{pr[0].status}</a>, pr[0].status, pr[0].status === 'clean' ? 'issue-success' : 'issue-fail'),
    upstream(pr[0])
  ];
}

function upstream(pr) {
  if (pr['upstream-required'] && !pr['upstream-jira']) return makeCell('Missing');
  else if (!pr['upstream-required']) return makeCell('Not required', 'not-required', 'issue-success');

  let title =
    <>
      <span>{"Issue: "}<Link url={getKeyFromUrl(pr['upstream-jira'])}/></span><br/>
      <span>{"PR: " + pr['upstream-pull-request'].status}</span>
    </>;

  return makeCell(title, '', pr['upstream-pull-request'].status === 'CLOSED' ? 'issue-success' : '');
}

export function shortStatus(status) {
    return status === 'Pull Request Sent' ? 'PR Sent' : status;
}
