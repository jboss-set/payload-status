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
    makeCell(shortName(type)),
    ackCell(acks),
    prCell(rest['pull-requests']),
    upstreamCell(rest['pull-requests'])
  ]

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

function prCell(prs) {
  if (!prs || prs.length === 0) return makeCell('No PR');

  let list = prs.map((item) => (
      makeCell(<a href={item.url}>{item.status}</a>, item.status, item.status === 'clean' ? 'issue-success' : 'issue-fail')
    )
  );

  let titles = [],
      sortKey = list[0].sortKey,
      className = '',
      css = { 'issue-success': 0, 'issue-fail': 0 }

  list.forEach((item, key) => {
    titles.push(<span key={key}>{item.title}<br/></span>);

    if (item.props) {
      css[item.props.className] += 1;
    }
  })

  if (css['issue-success'] > 0 && css['issue-fail'] > 0) {
      className = 'issue-success-fail';
  } else if (css['issue-success'] > 0) {
      className = 'issue-success';
  } else if (css['issue-fail'] > 0) {
      className = 'issue-fail';
  }

  return makeCell(titles, sortKey, className);
}

function upstreamCell(prs) {
  if (!prs || prs.length === 0) return "";

  let list = prs.map(upstream);

  let titles = [],
      sortKey = list[0].sortKey,
      className = '',
      css = { 'issue-success': 0 }

  list.forEach((item, key) => {
    titles.push(<span key={key}>{item.title}<br/></span>);

    if (item.props) {
      css[item.props.className] += 1;
    }
  })

  if (css['issue-success'] > 0) {
    className = 'issue-success';
  }

  return makeCell(titles, sortKey, className);
}

function upstream(pr) {
  if (pr['upstream-required'] && !pr['upstream-jira']) return makeCell("Missing", 'missing');
  else if (!pr['upstream-required']) return makeCell("Not required", 'not-required', 'issue-success');

  let title =
    <>
      {"Issue: "}<Link url={getKeyFromUrl(pr['upstream-jira'])}/><br/>
      {"PR: " + pr['upstream-pull-request'].status}
    </>;

  return makeCell(title, '', pr['upstream-pull-request'].status === 'CLOSED' ? 'issue-success' : '');
}
