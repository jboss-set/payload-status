import React, { useState } from 'react';
import { Toolbar , ToolbarItem, ToolbarContent } from '@patternfly/react-core';
import { Select, SelectOption } from '@patternfly/react-core';
import { defaultOption } from '../common/Util';

const PayloadPicker = ({onSelect, data}) => {
  const [isOpen, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const select = (e, val, isPlaceholder) => {
    let value = isPlaceholder ? "" : val;
    onSelect(value);
    setSelected(value);
    setOpen(!isOpen);
  }

  const flatList = flattenList(data.list);

  const items = (
    <>
      <ToolbarItem variant="label">Payload Overview</ToolbarItem>
      <ToolbarItem>
        <Select onSelect={select} onToggle={setOpen} isOpen={isOpen} selections={selected}>
          {defaultOption}
        {flatList.map((item, index) => (
          <SelectOption key={index} value={item} />
        ))}
        </Select>
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
