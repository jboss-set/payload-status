import React from 'react';
import {getKeyFromUrl, safeClassName, shortStatus} from './Util';

export const IssueTableHead = () => {
    return (
        <thead>
          <tr>
            <th>Number</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Name</th>
            <th className="type">Type</th>
            <th>Acks</th>
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

export const Issue = ({url, priority, status, summary, type, acks, ...rest}) => {
    return (
        <>
        <tr className={safeClassName("issue-" + type)}>
            <td className="url mono"><a href={url}>{getKeyFromUrl(url)}</a></td>
            <td className="priority">{priority}</td>
            <td className="status">{shortStatus(status)}</td>
            <td className="summary">{summary}</td>
            <td className="type">{type}</td>
            <Acks data={acks} />
            <PullRequestInfo data={rest['pull-requests']} />
        </tr>
        </>
    )
}

const Acks = ({data}) => {
    let flags = [];
    for (let flag in data) {
        if (data[flag] !== 'ACCEPTED') {
            flags.push(flag + (data[flag] === 'SET' ? '?' : '-'));
        }
    }

    if (!flags.length) {
        return (
            <td className="acks all-acks">All clear</td>
        )
    }
    return (
        <td className="acks">{flags.join(' ')}</td>
    )
}

const PullRequestInfo = ({data}) => {
    if (data.length === 0) return (<><td className="pr">No PR</td><td className="up"/></>);
    if (data.length > 1) return (<><td className="pr">Many PRs</td><td className="up"/></>);

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
        <td className={"pr " + safeClassName("pr-status-" + status)}>
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
    if (upstream['upstream-required'] && !upstream['upstream-jira']) {return (<td className="up up-miss">Missing</td>)}
    else if (!upstream['upstream-required']) {return (<td className="up up-not">Not required</td>)}

    return (
        <td className="up">
          Issue: <a href={upstream['upstream-jira']}>{getKeyFromUrl(upstream['upstream-jira'])}</a><br/>
          PR: <PRText {...upstream['upstream-pull-request']} />
        </td>
    )
}
