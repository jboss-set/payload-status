import React, { useState, useEffect } from 'react';

import { orderData, tablify } from '../common/Util';
import IssueTables from './IssueTables';
import PayloadPicker from './PayloadPicker';
import MessageBar from '../common/MessageBar';
import { Spinner } from '@patternfly/react-core';

const payloadUrl = (url, payload) => `${url}payload/${payload}`;

const PayloadOverview = ({url}) => {
  const [payloadsData, setPayloadsData] = useState({
      list: null
  });
  const [data, setData] = useState({
      upgradesTotal: 0,
      standalone: {},
      upgrades: {},
      payload: null
  });
  const [status, setStatus] = useState({
      loading: false,
      error: null
  });

  const setPayload = (payload) => {
    if (!payload) {
      setData(prevState => ({...prevState, payload: null}));
      return;
    }
    setStatus({loading: true});
    fetch(payloadUrl(url, payload))
      .then(response => response.json())
      .then(json => {
        if (!json.length) {
          setData(prevState => ({...prevState, payload: null}));
          setStatus({error: {name: "Error", message: "Empty payload (PRBZ still loading?)"}, loading: false});
          return;
        }
        let issues = orderData(json),
            standalone = tablify(issues.standalone, false),
            upgrades = tablify(issues.upgrades, true);
        setData(prevState => (
            {
            ...prevState,
            payload: payload,
            upgradesTotal: issues.upgrades.length,
            standalone: {
              rows: standalone,
              sortBy: {}
            },
            upgrades: {
              rows: upgrades
            }
        }));
        setStatus({loading: false});
      })
      .catch(error => setStatus({error: handleError(error), loading: false}));
  }

  const handleError = (error) => {
      if (error.message === "Failed to fetch") {
          return {
              name: "Error",
              message: "Cannot fetch payloads (PRBZ down?)"
          };
      }
      return error;
  }

  useEffect(() => {
    setStatus({loading: true});
    fetch(`${url}payloads/`)
      .then(response => response.json())
      .then(json => {
          setPayloadsData(prevState => ({...prevState, list: json}))
          setStatus({loading: false});
      })
      .catch(error => setStatus({error: handleError(error), loading: false}));
  },[1]);

  return (
    <div className="payload-overview">
      <PayloadPicker onSelect={setPayload} data={payloadsData} />
      {status.loading && <Spinner />}
      {status.error && <MessageBar error={status.error} />}
      {data.payload != null && <IssueTables data={data} setRows={setData} />}
    </div>
  );
}

export default PayloadOverview
