import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from "react-router-dom";

import { orderData, tablify, fullPayloadName } from '../common/Util';
import Stats from './Stats';
import IssueTables from './IssueTables';
import PayloadPicker from './PayloadPicker';
import MessageBar from '../common/MessageBar';
import { Spinner } from '@patternfly/react-core';
import { errors } from '../common/Errors';

const payloadUrl = (url, payload) => `${url}payload/${fullPayloadName(payload)}`;

const PayloadOverview = ({url}) => {
  const history = useHistory();
  const location = useLocation();
  const payloadKey = new URLSearchParams(location.search).get("payload");
  const [payloadsData, setPayloadsData] = useState({
      list: null
  });
  const [data, setData] = useState({
      issues: null,
      upgradesTotal: 0,
      standalone: {},
      upgrades: {},
      payload: payloadKey
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
    history.push({
      "pathname": "/",
      "search": `?payload=${payload}`
    });
    setData(prevState => ({...prevState, payload: payload}));
  }

  const handleError = (error) => {
    if (error.message === "Failed to fetch") {
      return errors["payload-fetch-fail"];
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

  useEffect(() => {
    if (data.payload) {
        setStatus({loading: true});
        fetch(payloadUrl(url, data.payload))
          .then(response => response.json())
          .then(json => {
            if (!json.length) {
              setData(prevState => ({...prevState, payload: null}));
              setStatus({error: errors["empty-payload"], loading: false});
              return;
            }
            let issues = orderData(json),
                standalone = tablify(issues.standalone, false),
                upgrades = tablify(issues.upgrades, true);
            setData(prevState => (
                {
                ...prevState,
                issues: issues,
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
  },[data.payload]);

  return (
    <div className="payload-overview">
      <PayloadPicker onSelect={setPayload} data={payloadsData} />
      {status.loading && <Spinner />}
      {status.error && <MessageBar error={status.error} />}
      {data.issues != null && <Stats data={data.issues} />}
      {data.issues != null && <IssueTables data={data} setRows={setData} />}
    </div>
  );
}

export default PayloadOverview
