import React, { useState } from 'react';
import { useLocation } from "react-router-dom";

import { Toolbar , ToolbarItem, ToolbarContent } from '@patternfly/react-core';
import { Checkbox } from '@patternfly/react-core';
import { ToolbarSelect } from '../common/Util';

const PayloadPicker = ({onSelect, data}) => {
  const location = useLocation();
  const payloadKey = new URLSearchParams(location.search).get("payload");
  const [isLatestOnly, setLatestOnly] = useState(true);

  let payloadList = processList(data.list, isLatestOnly);

  const items = (
    <>
      <ToolbarItem variant="label">Payload Overview</ToolbarItem>
      <ToolbarItem>
        <ToolbarSelect data={payloadList} onSelectCallback={onSelect} initialSelection={payloadKey} maxHeight="400px" />
      </ToolbarItem>
      <ToolbarItem>
        <Checkbox label="Latest only" aria-label="latest only" id="latest-check" isChecked={isLatestOnly} onChange={setLatestOnly} />
      </ToolbarItem>
    </>
  );

  return <Toolbar id="toolbar"><ToolbarContent>{items}</ToolbarContent></Toolbar>;
}

const processList = (list, short) => {
  let result = [];
  for (let key in list) {
    let flatList = [];
    list[key].forEach(item => flatList.push(item));
    if (!flatList.length) continue;
    flatList = flatList.sort(sortMicroVersions);
    if (short) {
      flatList = flatList.slice(0,2);
    }
    result.push(flatList);
  }
  result = result.sort(sortMinorVersions).flat();
  if (short) {
    result = result.slice(0,4);
  }
  return result;
}

const minorMatcher = /\d+\.(\d+)\.\d+/;
const microMatcher = /\d+\.\d+\.(\d+)/;

const sortMinorVersions = (a,b) => {
  let aa = a[0].match(minorMatcher)[1],
      bb = b[0].match(minorMatcher)[1];

  return bb - aa;
}

const sortMicroVersions = (a,b) => {
  let aa = a.match(microMatcher)[1],
      bb = b.match(microMatcher)[1];

  return bb - aa;
}

export default PayloadPicker;
