import React from 'react';
import {orderData, tablify} from './Util';
import {IssueTable} from './IssueCommon' ;
import {sortable, classNames} from '@patternfly/react-table';
import {Title} from '@patternfly/react-core'

const columns = [
    { title: "Number", transforms: [sortable] },
    { title: "Priority", transforms: [sortable] },
    { title: "Status", transforms: [sortable] },
    { title: "Name", columnTransforms: [classNames('issue-name')] },
    { title: "Type", columnTransforms: [classNames('issue-type')] },
    { title: "Acks" },
    { title: "PR Status", transforms: [sortable] },
    { title: "Upstream" }
];

const columns2 = [
    { title: "Number" },
    { title: "Priority" },
    { title: "Status" },
    { title: "Name", columnTransforms: [classNames('issue-name')] },
    { title: "Type", columnTransforms: [classNames('issue-type')] },
    { title: "Acks" },
    { title: "PR Status" },
    { title: "Upstream" }
];

const IssueSeparateTable = ({data}) => {
    let issues = orderData(data.issues),
        single = tablify(issues.standalone, false),
        upgrades = tablify(issues.upgrades, true);

    const updated = new Date(data.updated);

    return (
        <div>
            <Title headingLevel="h1" size="xl">{`${data.issues.length} issues in payload, last updated ${updated.toLocaleDateString('en-US')}`}</Title>
            <IssueTable caption={`${single.length} Standalone issues`} className="standalone" columns={columns} rows={single} />
            <IssueTable caption={`${issues.upgrades.length} Component upgrades, ${upgrades.length} issues total`} className="upgrades" columns={columns2} rows={upgrades} />
        </div>
    )
}

export default IssueSeparateTable
