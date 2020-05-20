import React from 'react';
import {getKeyFromUrl, safeClassName} from './Util';

export const IssueTableHead = () => {
    return (
        <thead>
          <tr>
            <th>Number</th>
            <th>Priority</th>
            <th>Name</th>
            <th>Type</th>
            <th>PR Status</th>
            <th>Upstream</th>
          </tr>
        </thead>
    )
}

export const IssueTable = ({caption, className, ...props}) => {
    return (
        <table className={safeClassName(className) + " list"}>
          <caption>{caption}</caption>
          <IssueTableHead />
          <tbody>
          {props.children}
          </tbody>
        </table>
    )
}

export const Issue = ({type, priority, url, summary, ...rest}) => {
    return (
        <>
        <tr className={safeClassName("issue-" + type)}>
            <td className="mono"><a href={url}>{getKeyFromUrl(url)}</a></td>
            <td>{priority}</td>
            <td>{summary}</td>
            <td>{type}</td>
            <PullRequestInfo data={rest['pull-requests']} />
        </tr>
        </>
    )
}

const PullRequestInfo = ({data}) => {
    if (data.length === 0) return (<><td>No PR</td><td/></>);
    if (data.length > 1) return (<><td>Many PRs</td><td/></>);

    return (
        <PullRequest {...data[0]} />
    )
}

const PullRequest = ({url, status, ...rest}) => {
    let textProps = {url, status};
    return (
        <>
            <PRStatus {...textProps} />
            <UpstreamPR {...rest} />
        </>
    )
}

const PRStatus = ({url, status}) => {
    let props = {url, status}
    return (
        <td className={safeClassName("pr-status-" + status)}>
            <PRText {...props} />
        </td>
    )
}

const PRText = ({url, status}) => {
    return (
        <a href={url}>{status}</a>
    )
}

const UpstreamPR = ({...upstream}) => {
    if (upstream['upstream-required'] && !upstream['upstream-jira']) {return (<td className="up-miss">Missing</td>)}
    else if (!upstream['upstream-required']) {return (<td className="up-not">Not required</td>)}

    return (
        <td>
          Issue: <a href={upstream['upstream-jira']}>{getKeyFromUrl(upstream['upstream-jira'])}</a><br/>
          PR: <PRText {...upstream['upstream-pull-request']} />
        </td>
    )
}
