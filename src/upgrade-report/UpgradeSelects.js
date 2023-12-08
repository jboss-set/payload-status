import React, { useState, useEffect } from 'react';

import { ToolbarItem, Button } from '@patternfly/react-core';
import { ToolbarSelect } from '../common/Util';

const UpgradeSelects = ({reportCallback, data}) => {
  const [selected, setSelected] = useState({left: "", right: ""});

  useEffect(() => {
    setSelected({left: "", right: ""});
  },[data.selectedRepo]);

  const select = (kind) => ((value) => {
    setSelected(prev => ({...prev, [kind]: value}));
  });

  const onClick = () => {
    if (selected.left && selected.right) {
      reportCallback(selected.left, selected.right);
    }
  }

  const keys = ['left', 'right'];

  if (!data.selectedRepo) {
    return null;
  }

  return (
    <>
      {keys.map((key, i) => (
        <ToolbarItem key={i}>
          <ToolbarSelect id={`${key}-select`} typeAhead={true} onSelectCallback={select(key)} data={data[data.selectedRepo]} maxHeight="360px" />
        </ToolbarItem>
      ))}
      <ToolbarItem>
        <Button onClick={onClick} isDisabled={!selected.left || !selected.right}>Generate</Button>
      </ToolbarItem>
    </>
  )
};

export default UpgradeSelects;
