import React from 'react';
import {getKeyFromUrl} from './Util';
import {IssueTable, Issue} from './IssueCommon' ;

function orderData(data) {
    let result = {};

    let upgrades = data.filter(issue => issue.type === "UPGRADE");
    let rest = {};

    data.filter(issue => issue.type !== "UPGRADE").forEach(item => {
        rest[getKeyFromUrl(item.url)] = item;
    });

    upgrades.forEach(upgrade => {
        upgrade.nested = [];
        upgrade.incorporated.forEach(inc => {
            let name = getKeyFromUrl(inc);
            let issue = rest[name];
            if (issue) {
                upgrade.nested.push(issue);
                delete rest[name];
            }
        });
    });

    let standalone = [];

    for (let r in rest) {
        standalone.push(rest[r]);
    }

    result.upgrades = upgrades;
    result.standalone = standalone;

    return result;
}

const IssueSeparateTable = ({data}) => {
    let issues = orderData(data);

    return (
        <div>
            <IssueTable caption="Component upgrades" className="upgrades">
              {issues.upgrades.map((issue,i) =>
                  <React.Fragment key={getKeyFromUrl(issue.url)}>
                    <Issue class="upgrade" {...issue} />
                    <NestedIssues data={issue.nested} />
                  </React.Fragment>
              )}
            </IssueTable>
            <IssueTable caption="Standalone issues" className="single">
              {issues.standalone.map((issue,i) =>
                  <Issue key={getKeyFromUrl(issue.url)} {...issue} />
              )}
            </IssueTable>
        </div>
    )
}

const NestedIssues = ({data}) => {
    return (
        <>
        {data.map((nested, j) =>
            <Issue key={getKeyFromUrl(nested.url)} {...nested} />
        )}
        </>
    )
}

export default IssueSeparateTable
