import React from 'react';
import { Alert } from '@patternfly/react-core';

const MessageBar = ({error}) => (
  <Alert isInline variant="danger" title={error ? error.name : "Unknown error"} className="message-bar">{error ? error.message : ""}</Alert>
);

export default MessageBar;
