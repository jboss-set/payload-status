import { sortable, classNames } from '@patternfly/react-table';

const getKeyFromUrl = (url) => url.substr(url.lastIndexOf('/')+1);

const Link = ({url, text}) => <a href={url} target="_blank" rel="noopener noreferrer">{text}</a>;
const IssueLink = ({url}) => <Link url={url} text={getKeyFromUrl(url)}/>;

export const standaloneColumns = [
  { title: "Number", transforms: [sortable] },
  { title: "Priority", transforms: [sortable] },
  { title: "Status", transforms: [sortable] },
  { title: "Assignee", transforms: [sortable], columnTransforms: [classNames('issue-assignee')] },
  { title: "Name", columnTransforms: [classNames('issue-name')] },
  { title: "Type", columnTransforms: [classNames('issue-type')] },
  { title: "Acks" },
  { title: "PR Status", transforms: [sortable] },
  { title: "Upstream" }
];

export const upgradeColumns = [
  { title: "Number" },
  { title: "Priority" },
  { title: "Status" },
  { title: "Assignee" },
  { title: "Name", columnTransforms: [classNames('issue-name')] },
  { title: "Type", columnTransforms: [classNames('issue-type')] },
  { title: "Acks" },
  { title: "PR Status" },
  { title: "Upstream" }
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

const unescape = (text) => text.replaceAll("&quot;",'"');

export function orderData(data) {
  let result = [],
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

export const tablify = (data) => [toTableData(data.standalone, false), toTableData(data.upgrades, true)];

// turn JSON into table data
function toTableData(issues, processNested) {
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
  });

  return result;
};

function issueToRow({url, priority, rawStatus, assignee, summary, rawType, acks, pullRequest, ...rest}) {
  let row = {};

  row.cells = [
    makeCell(<IssueLink url={url} />, Number.parseInt(url.substr(url.lastIndexOf('-')+1))),
    makeCell(priority),
    makeCell(shortName(rawStatus).toUpperCase()),
    makeCell(assignee),
    makeCell(unescape(summary)),
    makeCell(shortName(rawType).toUpperCase()),
    ackCell(acks),
    prCell(pullRequest),
    upstreamCell(pullRequest)
  ];

  return row;
};

function makeCell(title, sortKey, className) {
  let cell = { title: title, sortKey: title };
  if (sortKey) {
    cell.sortKey = sortKey;
  }
  if (className) {
    cell.props = { className: className };
  }
  return cell;
};

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
};

const getPRClassName = (status) => {
  switch(status) {
    case 'merged':
    case 'work branch':
      return 'pr-merged'
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

function prCell(prs) {
  if (!prs || prs.length === 0) return makeCell('No PR');

  let list = prs.map((item) => {
    let status = getMergeStatus(item);
    let className = getPRClassName(status);
    return makeCell(<a href={item.link}>{translateMergeStatus(status)}</a>, status, className)
  });

  let titles = [],
      sortKey = list[0].sortKey,
      className = '',
      css = { 'pr-merged': 0, 'pr-clean': 0, 'pr-fail': 0, 'pr-dnf': 0 }

  list.forEach((item, key) => {
    titles.push(<span key={key}>{item.title}<br/></span>);

    if (item.props) {
      css[item.props.className] += 1;
    }
  });

  for (let c in css) {
    if (css[c]) {
      className += c + " ";
    }
  }

  return makeCell(titles, sortKey, className);
};

function upstreamCell(prs) {
  if (!prs || prs.length === 0) return "";

  let list = prs.map(upstreamIssues);

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
};

const upstreamIssues = (pr) => {
  if (!pr.noUpstreamRequired && !pr.upstreamIssueFromPRDesc) return makeCell("Missing", 'missing');
  else if (pr.noUpstreamRequired) return makeCell("Not required", 'not-required', 'issue-success');

  let title =
    <>
      {"Issue: "}<IssueLink url={pr.upstreamIssueFromPRDesc}/><br/>
      {"PR: "}<Link url={pr.upstreamPullRequestFromPRDesc} text={pr.upstreamPatchState}/>
    </>;

  return makeCell(title, '', pr.upstreamPatchState === 'CLOSED' ? 'issue-success' : '');
};
