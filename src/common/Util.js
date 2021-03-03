import React from 'react';

import { SelectOption, Button } from '@patternfly/react-core';

export const Link = ({url, className, text}) => <Button component="a" href={url} className={className} target="_blank" variant="plain" rel="noopener noreferrer">{text}</Button>;

export const defaultOption = <SelectOption key={0} value="Choose…" isPlaceholder={true} />;


