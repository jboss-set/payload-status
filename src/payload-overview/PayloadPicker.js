import React, { useState } from 'react';
import { useLocation } from "react-router-dom";

import { Toolbar, ToolbarItem, ToolbarContent } from '@patternfly/react-core';
import { Switch } from '@patternfly/react-core';
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
        <ToolbarSelect id="payload-select" data={payloadList} onSelectCallback={onSelect} initialSelection={payloadKey} maxHeight="400px" />
      </ToolbarItem>
      <ToolbarItem alignSelf="center">
        <Switch label="Latest only" labelOff="All payloads" aria-label="latest only" id="latest-check"
          isChecked={isLatestOnly} onChange={(_event, val) => setLatestOnly(val)} />
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
  result = result.sort(sortMajorMinorVersions).flat();
  if (short) {
    result = result.slice(0,4);
  }
  return result;
}

const majorMinorMatcher = /(\d+)\.(\d+)[.\s]/;
const microMatcher      = /\d+\.\d+[.\s](\d+)/;

const sortMajorMinorVersions = (a,b) => {
  let aa = a[0].match(majorMinorMatcher),
      bb = b[0].match(majorMinorMatcher);

  return aa[1] === bb[1] ? bb[2] - aa[2] : bb[1] - aa[1];
}

const sortMicroVersions = (a,b) => {
  let amatch = a.match(microMatcher),
      bmatch = b.match(microMatcher),
      aa = amatch ? amatch[1] : a,
      bb = bmatch ? bmatch[1] : b;

  let result = bb - aa;
  if (isNaN(result)) {
    return bb > aa ? 1 : -1;
  }

  return result;
}

export default PayloadPicker;
