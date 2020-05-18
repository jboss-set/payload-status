import React from 'react';
import {IssueTable, Issue} from './IssueCommon' ;

function sortData(data) {
    return data.sort((a,b) => {
        if (a.type === "UPGRADE" && b.type !== "UPGRADE") {
            return -1;
        }

        if (a.type !== "UPGRADE" && b.type === "UPGRADE") {
            return 1;
        }

        return 0;
    });
}

const IssueSingleTable = ({data}) => {
    data = sortData(data);

    return (
        <IssueTable caption="All 7.3.2 issues" className="single">
          {data.map((issue,i) =>
              <Issue key={i} {...issue} />
          )}
        </IssueTable>
    )
}

export default IssueSingleTable
