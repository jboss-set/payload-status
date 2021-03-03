import React, { useState, useEffect } from 'react';

import { Select, SelectOption, Button } from '@patternfly/react-core';

export const Link = ({url, className, text}) => <Button component="a" href={url} className={className} target="_blank" variant="plain" rel="noopener noreferrer">{text}</Button>;

const defaultOption = <SelectOption key={0} value="Choose…" isPlaceholder={true} />;

export const ToolbarSelect = ({data, onSelectCallback, initialSelection, maxHeight}) => {
  const [isOpen, setOpen] = useState(false);
  const [selected, setSelected] = useState(initialSelection);

  useEffect(() => {
    setSelected(initialSelection);
  },[data]);

  const onSelect = (e, val, isPlaceholder) => {
    let value = isPlaceholder ? "" : val;
    setSelected(value);
    setOpen(!isOpen);
    onSelectCallback && onSelectCallback(value);
  }

  const onToggle = () => {
    setOpen(!isOpen);
  }

  const mapOver = data.map ? data : Object.keys(data);

  return (
    <Select onSelect={onSelect} onToggle={onToggle} isOpen={isOpen} selections={selected} maxHeight={maxHeight}>
      {defaultOption}
      {mapOver.map((item, index) => (
        <SelectOption key={index} value={item} />
      ))}
    </Select>
  );
};
