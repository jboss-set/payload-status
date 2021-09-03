import React, { useState, useEffect } from 'react';

import { Select, SelectOption, SelectVariant, Button } from '@patternfly/react-core';

export const Link = ({url, className, text}) => <Button component="a" href={url} className={className} target="_blank" variant="plain" rel="noopener noreferrer">{text}</Button>;

const defaultOption = <SelectOption key={0} value="Choose…" isPlaceholder={true} />;

export const ToolbarSelect = ({data, onSelectCallback, initialSelection, maxHeight, typeAhead}) => {
  const [isOpen, setOpen] = useState(false);
  const [selected, setSelected] = useState(initialSelection);

  const selectProps = {},
        decorations = {};

  useEffect(() => {
    setSelected(initialSelection);
  },[data, initialSelection]);

  selectProps.isOpen = isOpen;
  selectProps.selections = selected;

  selectProps.onSelect = (e, val, isPlaceholder) => {
    let value = isPlaceholder ? "" : val;
    setSelected(value);
    setOpen(!isOpen);
    onSelectCallback && onSelectCallback(value);
  }

  selectProps.onToggle = () => {
    setOpen(!isOpen);
  }

  decorations.maxHeight = maxHeight;
  if (typeAhead) {
    decorations.variant = SelectVariant.typeahead;
    decorations.placeholderText = "Choose…";
  } else {
    decorations.variant = SelectVariant.single;
  }

  const mapOver = data.map ? data : Object.keys(data);

  return (
    <Select {...selectProps} {...decorations}>
      {!typeAhead && defaultOption}
      {mapOver.map((item, index) => (
        <SelectOption key={index} value={item} />
      ))}
    </Select>
  );
};
