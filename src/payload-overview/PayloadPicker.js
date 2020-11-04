import React, { useState } from 'react';
import { Toolbar , ToolbarItem, ToolbarContent } from '@patternfly/react-core';
import { Select, SelectOption } from '@patternfly/react-core';
import { Checkbox } from '@patternfly/react-core';
import { defaultOption } from '../common/Util';

const PayloadPicker = ({onSelect, data}) => {
  const [isOpen, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [isLatestOnly, setLatestOnly] = useState(true);

  const select = (e, val, isPlaceholder) => {
    let value = isPlaceholder ? "" : val;
    onSelect(value);
    setSelected(value);
    setOpen(!isOpen);
  }

  let flatList = flattenList(data.list).sort().reverse();
  if (isLatestOnly) {
    flatList = flatList.filter(item => item.includes("7.3")).slice(0,2).concat(flatList.filter(item => item.includes("7.2")).slice(0,2));
  }

  const items = (
    <>
      <ToolbarItem variant="label">Payload Overview</ToolbarItem>
      <ToolbarItem>
        <Select onSelect={select} onToggle={setOpen} isOpen={isOpen} selections={selected} maxHeight="400px">
          {defaultOption}
        {flatList.map((item, index) => (
          <SelectOption key={index} value={item} />
        ))}
        </Select>
      </ToolbarItem>
      <ToolbarItem>
        <Checkbox label="Latest only" aria-label="latest only" id="latest-check" isChecked={isLatestOnly} onChange={setLatestOnly} />
      </ToolbarItem>
    </>
  );

  return <Toolbar id="toolbar"><ToolbarContent>{items}</ToolbarContent></Toolbar>;
}

const flattenList = (list) => {
  let flatList = [];
  for (let key in list) {
    list[key].forEach(item => flatList.push(`${key}/${item}`));
  }
  return flatList;
}

export default PayloadPicker;
