import React, { useState } from 'react';

import {
  Drawer,
  DrawerPanelContent,
  DrawerContent,
  DrawerContentBody,
  DrawerPanelBody,
  DrawerHead
} from '@patternfly/react-core';

import { List, ListItem } from '@patternfly/react-core';
import { Button, Title } from '@patternfly/react-core';

import InfoCircleIcon from '@patternfly/react-icons/dist/js/icons/info-circle-icon';
import GithubIcon from '@patternfly/react-icons/dist/js/icons/github-icon';

import info from './info.json';

const { REACT_APP_VERSION } = process.env;

const InfoDrawer = ({pageContent}) => {
  const [isExpanded, setExpanded] = useState(false);

  const toggle = () => {
    setExpanded(!isExpanded);
  }

  let newsList = info['new'].map(item =>
    <ListItem>{item}</ListItem>
  );

  let issueList = info['known-issues'].map(item =>
    <ListItem>{item}</ListItem>
  );

  const panelContent = (
    <DrawerPanelContent>
      <DrawerHead>
        <Title headingLevel="h1">Payload status viewer v{REACT_APP_VERSION}</Title>
      </DrawerHead>
      <DrawerPanelBody>
      {newsList.length &&
        <div className="info info-news">
          <Title headingLevel="h3">New</Title>
          <List>{newsList}</List>
        </div>
      }
      {issueList.length &&
        <div className="info info-issues">
          <Title headingLevel="h3">Known issues</Title>
          <List>{issueList}</List>
        </div>
      }
      </DrawerPanelBody>
    </DrawerPanelContent>
  );

  return (
    <React.Fragment>
      <div className="top">
      <Button aria-expanded={isExpanded} onClick={toggle} icon={<InfoCircleIcon/>} variant="link" className="top-button" />
      <Button component="a" href="https://github.com/jboss-set/payload-status" className="top-button" variant="plain" target="_blank">
        <GithubIcon />
      </Button>
      </div>
      <Drawer isExpanded={isExpanded} className="info-drawer">
        <DrawerContent panelContent={panelContent}>
          <DrawerContentBody>{pageContent}</DrawerContentBody>
        </DrawerContent>
      </Drawer>
    </React.Fragment>
  );
}

export default InfoDrawer;
