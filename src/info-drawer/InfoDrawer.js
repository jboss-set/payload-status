import React, { useState } from 'react';

import {
  Drawer,
  DrawerPanelContent,
  DrawerContent,
  DrawerContentBody,
  DrawerPanelBody,
  DrawerHead
} from '@patternfly/react-core';

import { List, ListItem, Title, Button } from '@patternfly/react-core';
import { conf } from '../common/Conf';
import { Link } from '../common/Util';

import InfoCircleIcon from '@patternfly/react-icons/dist/js/icons/info-circle-icon';
import GithubIcon from '@patternfly/react-icons/dist/js/icons/github-icon';

import info from './info.json';

const InfoDrawer = ({pageContent}) => {
  const [isExpanded, setExpanded] = useState(false);

  const toggle = () => {
    setExpanded(!isExpanded);
  }

  const listItem = (item) => <ListItem>{item}</ListItem>

  let newsList = info['new'].map(listItem),
      issueList = info['known-issues'].map(listItem);

  const panelContent = (
    <DrawerPanelContent>
      <DrawerHead>
        <Title headingLevel="h1">Payload status viewer v{conf.version}</Title>
      </DrawerHead>
      <DrawerPanelBody>
      {!!newsList.length &&
        <div className="info info-news">
          <Title headingLevel="h3">New</Title>
          <List>{newsList}</List>
        </div>
      }
      {!!issueList.length &&
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
        <Link url="https://github.com/jboss-set/payload-status" className="top-button" text={<GithubIcon />} />
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
