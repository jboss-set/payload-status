import React from 'react';
import { Title } from '@patternfly/react-core';

const MessageBar = ({error}) => {
  return (
    <div>
      <Title headingLevel="h1" size="xl">{error ? error.toString() : "Unknown Error"}</Title>
    </div>
  )
}

export default MessageBar;
