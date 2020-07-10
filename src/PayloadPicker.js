import React, { useState } from 'react';
import MessageBar from './MessageBar';
import { Toolbar , ToolbarItem, ToolbarContent } from '@patternfly/react-core';
import { Select, SelectOption } from '@patternfly/react-core';

const PayloadPicker = ({onSelect, data}) => {
    const [isOpen, setOpen] = useState(false);
    const [selected, setSelected] = useState(null);

    if (data.error != null || data.list == null) {
        return <MessageBar error={data.error} />
    }

    const select = (e, value) => {
        onSelect(value);
        setSelected(value);
        setOpen(!isOpen);
    }

    const flatList = flattenList(data.list);

    const items = <React.Fragment>
      <ToolbarItem>
        <Select onSelect={select} onToggle={setOpen} isOpen={isOpen} selections={selected}>
        {flatList.map((item, index) => (
          <SelectOption key={index} value={item} />
        ))}
        </Select>
      </ToolbarItem>
    </React.Fragment>;

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
