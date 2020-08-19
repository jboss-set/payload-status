import React, { useState, useEffect } from 'react';
import '@patternfly/react-core/dist/styles/base.css'

import {orderData, tablify} from './Util';
import UpgradeReport from './UpgradeReport';
import IssueSeparateTable from './IssueSeparateTables';
import PayloadPicker from './PayloadPicker';

import './App.css'; // !has to be after component import

function App() {
  const [payloadsData, setPayloadsData] = useState({
      list: null,
      error: null
  });
  const [data, setData] = useState({
      upgradesTotal: 0,
      standalone: {},
      upgrades: {},
      payload: null,
      error: null
  });

  const setPayload = (payload) => {
      setData(prevState => ({...prevState, payload: payload}));
      fetch(`http://localhost:8080/prbz-overview/rest/api/payload/${payload}`)
        .then(response => response.json())
        .then(json => {
            let issues = orderData(json),
                standalone = tablify(issues.standalone, false),
                upgrades = tablify(issues.upgrades, true);
            setData(prevState => ({
                ...prevState,
                upgradesTotal: issues.upgrades.length,
                standalone: {
                    rows: standalone,
                    sortBy: {}
                },
                upgrades: {
                    rows: upgrades
                }
            }))
        })
//        .catch(error => setData(prevState => ({...prevState, error: error})));
  }

  useEffect(() => {
      fetch(`http://localhost:8080/prbz-overview/rest/api/payloads/`)
        .then(response => response.json())
        .then(json => setPayloadsData(prevState => ({...prevState, list: json})))
        .catch(error => setPayloadsData(prevState => ({...prevState, error: error})));
  },[1]);

  return (
    <div className="App">
      <UpgradeReport />
      <PayloadPicker onSelect={setPayload} data={payloadsData} />
      {data.payload != null && <IssueSeparateTable data={data} setRows={setData} />}
    </div>
  );
}

export default App;
