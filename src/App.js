import React from 'react';
import '@patternfly/react-core/dist/styles/base.css'

import UpgradeReport from './upgrade-report/UpgradeReport';
import PayloadOverview from './payload-overview/PayloadOverview';

import './App.css'; // !has to be after component import

const PRBZ_URL = "http://localhost:8080/prbz-overview/rest/api/";

const App = () => (
  <div className="App">
    <UpgradeReport url={PRBZ_URL} />
    <PayloadOverview url={PRBZ_URL} />
  </div>
);

export default App;
