import React from 'react';

export function getKeyFromUrl(url) {
  return url.substr(url.lastIndexOf('/')+1);
}

export function safeClassName(name) {
  return name.replace(' ', '-').toLowerCase();
}

export function shortName(name) {
  if (name == null) return "null";
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

  let standalone = [];

  for (let d in bugs) {
    standalone.push(bugs[d]);
  }

  result.upgrades = upgrades;
  result.standalone = standalone;

  return result;
}

export const Link = ({url, text}) => url ? <a href={url}>{text}</a> : <span>Not Found</span>

export const IssueLink = ({url}) => <Link url={url} text={getKeyFromUrl(url)}/>

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

function issueToRow({url, priority, rawStatus, summary, rawType, acks, ...rest}) {
  let row = {};

  row.cells = [
    makeCell(<IssueLink url={url} />, Number.parseInt(url.substr(url.lastIndexOf('-')+1))),
    makeCell(priority),
    makeCell(shortName(rawStatus).toUpperCase()),
    makeCell(summary),
    makeCell(shortName(rawType).toUpperCase()),
    ackCell(acks),
    prCell(rest.pullRequest),
    upstreamCell(rest.pullRequest)
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

const cleanMergeStates = {
    'clean': 1,
    'merged': 2
}

function prCell(prs) {
  if (!prs || prs.length === 0) return makeCell('No PR');

  let list = prs.map((item) => {
    let status = item.mergeStatus.toLowerCase();
    if (status === 'unknown' && item.patchState.toLowerCase() === 'closed') {
        status = 'merged';
    }
    return makeCell(<a href={item.link}>{status}</a>,
      status, status in cleanMergeStates ? 'issue-success' : 'issue-fail')
    }
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
    titles.push(<div className="upstream-issues" key={key}>{item.title}</div>);

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
  if (!pr.noUpstreamRequired && !pr.upstreamIssueFromPRDesc) return makeCell("Missing", 'missing');
  else if (pr.noUpstreamRequired) return makeCell("Not required", 'not-required', 'issue-success');

  let title =
    <>
      {"Issue: "}<IssueLink url={pr.upstreamIssueFromPRDesc}/><br/>
      {"PR: "}<Link url={pr.upstreamPullRequestFromPRDesc} text={pr.upstreamPatchState}/>
    </>;

  return makeCell(title, '', pr.upstreamPatchState === 'CLOSED' ? 'issue-success' : '');
}
