import React from 'react';

import MessageBar from './MessageBar';
import IssueTable from './IssueTable';
import { sortable, classNames } from '@patternfly/react-table';
import { Title } from '@patternfly/react-core';
import { Spinner } from '@patternfly/react-core';

const standaloneColumns = [
    { title: "Number", transforms: [sortable] },
    { title: "Priority", transforms: [sortable] },
    { title: "Status", transforms: [sortable] },
    { title: "Name", columnTransforms: [classNames('issue-name')] },
    { title: "Type", columnTransforms: [classNames('issue-type')] },
    { title: "Acks" },
    { title: "PR Status", transforms: [sortable] },
    { title: "Upstream" }
];

const upgradeColumns = [
    { title: "Number" },
    { title: "Priority" },
    { title: "Status" },
    { title: "Name", columnTransforms: [classNames('issue-name')] },
    { title: "Type", columnTransforms: [classNames('issue-type')] },
    { title: "Acks" },
    { title: "PR Status" },
    { title: "Upstream" }
];

const IssueSeparateTable = ({data,setRows}) => {
    if (data.loading) {
        return <Spinner />
    }
    if (data.error != null || data.upgradesTotal === 0) {
        return <MessageBar error={data.error} />
    }

    const updateStandaloneRows = (standalone) => {
        setRows(prevState => ({
            ...prevState,
            standalone: {
              rows: standalone.rows,
              sortBy: standalone.sortBy
            }
        }))
    };

    return (
        <div>
            <Title headingLevel="h1" size="xl">{`${data.standalone.rows.length + data.upgrades.rows.length} issues in payload`}</Title>
            <IssueTable
                caption={`${data.standalone.rows.length} Standalone issues`}
                className="standalone"
                columns={standaloneColumns}
                rows={data.standalone.rows}
                sortBy={data.standalone.sortBy}
                updateRows={updateStandaloneRows}
            />
            <IssueTable
                caption={`${data.upgradesTotal} Component upgrades, ${data.upgrades.rows.length} issues total`}
                className="upgrades"
                columns={upgradeColumns}
                rows={data.upgrades.rows}
            />
        </div>
    )
}

export default IssueSeparateTable
