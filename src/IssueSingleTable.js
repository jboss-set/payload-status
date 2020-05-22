import React from 'react';
import {IssueTable, Issue} from './IssueCommon' ;

const IssueSingleTable = ({data}) => {
    return (
        <IssueTable caption="All 7.3.2 issues" className="single">
          {data.map((issue,i) =>
              <Issue key={i} {...issue} />
          )}
        </IssueTable>
    )
}

export default IssueSingleTable
