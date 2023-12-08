import React, { useState } from 'react';

import { Button, Select, SelectOption, MenuToggle, Panel, PanelMain } from '@patternfly/react-core';
import TypeAhead from './TypeAhead';

export const Link = ({url, className, text}) => <Button component="a" href={url} className={className} target="_blank" variant="plain" rel="noopener noreferrer">{text}</Button>;

export const ToolbarSelect = ({id, data, onSelectCallback, initialSelection, maxHeight, typeAhead}) => {
  const [isOpen, setOpen] = useState(false);
  const [selected, setSelected] = useState(initialSelection || "Choose…");

  const selectProps = {},
        decorations = {};

  selectProps.isOpen = isOpen;
  selectProps.selected = selected;

  selectProps.onSelect = (_e, value) => {
    setSelected(value);
    setOpen(!isOpen);
    onSelectCallback && onSelectCallback(value);
  }

  selectProps.onToggle = () => {
    setOpen(!isOpen);
  }

  decorations.className = 'selectHeight'
  decorations.style = {};
  decorations.style.maxHeight = maxHeight;

  const mapOver = data.map ? data : Object.keys(data);

  if (!typeAhead) {
    const toggle = toggleRef => (
      <MenuToggle ref={toggleRef} onClick={selectProps.onToggle} isExpanded={isOpen}>
        {selected}
      </MenuToggle>
    );

    return (
      <Select id={id} {...selectProps} {...decorations} toggle={toggle}>
        <Panel isScrollable>
          <PanelMain maxHeight={maxHeight} tabIndex={0}>
            {mapOver.map((item, index) => (
              <SelectOption key={index} value={item} children={item} />
            ))}
          </PanelMain>
        </Panel>
      </Select>
    );
  }

  return (
    <TypeAhead id={id} {...selectProps} {...decorations} options={mapOver} />
  );
};
