import React from 'react';
import {
  BrowserRouter as Router,
} from "react-router-dom";

import '@patternfly/react-core/dist/styles/base.css'

import InfoDrawer from './info-drawer/InfoDrawer';
import UpgradeReport from './upgrade-report/UpgradeReport';
import PayloadOverview from './payload-overview/PayloadOverview';
import { BackToTop } from '@patternfly/react-core';

import './App.css'; // !has to be after component import

const drawerContent = (
  <>
    <UpgradeReport />
    <Router>
      <PayloadOverview />
    </Router>
  </>
);

const App = () => (
  <>
  <div className="App">
    <InfoDrawer pageContent={drawerContent} />
  </div>
  <BackToTop isAlwaysVisible className="back-to-top"/>
  </>
);

export default App;
