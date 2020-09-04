import React, { useState } from 'react';
import MessageBar from './MessageBar';
import { Toolbar , ToolbarItem, ToolbarContent } from '@patternfly/react-core';
import { Select, SelectOption } from '@patternfly/react-core';

const PayloadPicker = ({onSelect, data}) => {
    const [isOpen, setOpen] = useState(false);
    const [selected, setSelected] = useState(null);

    if (data.error != null || data.list == null || Object.keys(data.list).length === 0) {
        return <MessageBar error={data.error || "No payloads loaded"} />
    }

    const select = (e, value) => {
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
          {flatList.map((item, index) => (
            <SelectOption key={index} value={item} />
          ))}
          </Select>
        </ToolbarItem>
      </>);

    console.log(items);

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
