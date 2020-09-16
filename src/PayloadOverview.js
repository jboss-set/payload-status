import React, { useState, useEffect } from 'react';

import {orderData, tablify} from './Util';
import IssueTables from './IssueTables';
import PayloadPicker from './PayloadPicker';

const payloadUrl = (url, payload) => `${url}payload/${payload}`;

const PayloadOverview = ({url}) => {
  const [payloadsData, setPayloadsData] = useState({
      list: null,
      error: null
  });
  const [data, setData] = useState({
      upgradesTotal: 0,
      standalone: {},
      upgrades: {},
      payload: null,
      error: null,
      loading: false
  });

  const setPayload = (payload) => {
    if (!payload) {
      setData(prevState => ({...prevState, payload: null}));
      return;
    }
    setData(prevState => ({...prevState, payload: payload, loading: true}));
    fetch(payloadUrl(url, payload))
      .then(response => response.json())
      .then(json => {
        if (!json.length) {
          setData(prevState => ({...prevState, error: "Empty payload (prbz still loading?)", loading: false}))
          return;
        }
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
            },
            loading: false
        }))
      })
      .catch(error => setData(prevState => ({...prevState, error: error, loading: false})));
  }

  useEffect(() => {
    fetch(`${url}payloads/`)
      .then(response => response.json())
      .then(json => setPayloadsData(prevState => ({...prevState, list: json})))
      .catch(error => setPayloadsData(prevState => ({...prevState, error: error})));
  },[1]);

  return (
    <div className="payload-overview">
      <PayloadPicker onSelect={setPayload} data={payloadsData} />
      {data.payload != null && <IssueTables data={data} setRows={setData} />}
    </div>
  );
}

export default PayloadOverview
