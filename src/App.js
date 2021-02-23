import React from 'react';
import {
  BrowserRouter as Router,
} from "react-router-dom";

import '@patternfly/react-core/dist/styles/base.css'

import InfoDrawer from './info-drawer/InfoDrawer';
import UpgradeReport from './upgrade-report/UpgradeReport';
import PayloadOverview from './payload-overview/PayloadOverview';

import './App.css'; // !has to be after component import

const { REACT_APP_PRBZ_URL } = process.env;

const drawerContent = (
  <>
    <UpgradeReport url={REACT_APP_PRBZ_URL} />
    <Router>
      <PayloadOverview url={REACT_APP_PRBZ_URL} />
    </Router>
  </>
);

const App = () => (
  <div className="App">
    <InfoDrawer pageContent={drawerContent} />
  </div>
);

export default App;
