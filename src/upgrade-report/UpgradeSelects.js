import React, { useState } from 'react';

import { ToolbarItem, Button, Select, SelectOption } from '@patternfly/react-core';
import { defaultOption } from '../common/Util';

const TagSelect = ({onSelect, onToggle, isOpen, selections, data}) => (
  <ToolbarItem>
    <Select onSelect={onSelect} onToggle={onToggle} isOpen={isOpen} selections={selections} maxHeight="400px">
      {defaultOption}
      {data.map((item, index) => (
        <SelectOption key={index} value={item} />
      ))}
    </Select>
  </ToolbarItem>
);

const UpgradeSelects = ({reportCallback, data}) => {
  const [isOpen, setOpen] = useState({left: false, right: false});
  const [selected, setSelected] = useState({left: "", right: ""});

  const toggle = (kind) => (() => {
    setOpen(prev => ({...prev, [kind]: !prev[kind]}));
  });

  const select = (kind) => ((e, val, isPlaceholder) => {
    let value = isPlaceholder ? "" : val;
    setSelected(prev => ({...prev, [kind]: value}));
    toggle(kind)();
  });

  const onClick = () => {
    if (selected.left && selected.right) {
      reportCallback(selected.left, selected.right);
    }
  }

  const [left, right] = ['left', 'right'];

  if (!data.selectedRepo) {
    return null;
  }

  return (
    <>
      <TagSelect onSelect={select(left)} onToggle={toggle(left)} isOpen={isOpen[left]} selections={selected[left]} data={data} />
      <TagSelect onSelect={select(right)} onToggle={toggle(right)} isOpen={isOpen[right]} selections={selected[right]} data={data} />
      <ToolbarItem>
        <Button onClick={onClick} isDisabled={!selected[left] || !selected[right]}>Generate</Button>
      </ToolbarItem>
    </>
  )
};

export default UpgradeSelects;
