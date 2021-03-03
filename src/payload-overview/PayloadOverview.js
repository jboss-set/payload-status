import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from "react-router-dom";

import { orderData, tablify } from './TableUtil';
import Stats from './Stats';
import IssueTables from './IssueTables';
import PayloadPicker from './PayloadPicker';
import MessageBar from '../common/MessageBar';
import { Spinner } from '@patternfly/react-core';
import { handleError, handleResponse } from '../common/Errors';
import { conf } from '../common/Conf';

const fullPayloadName = (name, separator) => {
  let majorMinor = name.match(/(\d+\.\d+)\.\d+/)[1];
  return `jboss-eap-${majorMinor}.z${separator}${name}`;
};

const payloadDataUrl = (url, payload) => `${url}payload/${fullPayloadName(payload,'/')}`;

const payloadPageUrl = (url, payload) =>
  `${url.replace('/api/','/')}streampayload/${fullPayloadName(payload,'/payload/')}`;

const PayloadOverview = () => {
  const url = conf.url;
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
      "search": `?payload=${payload}`
    });
    setData(prevState => ({...prevState, payload: payload}));
  }

  useEffect(() => {
    setStatus({loading: true});
    fetch(`${url}payloads/`)
      .then(handleResponse)
      .then(json => {
          setPayloadsData(prevState => ({...prevState, list: json}))
          setStatus({loading: false});
      })
      .catch(error => setStatus({error: handleError(error), loading: false}));
  },[url]);

  useEffect(() => {
    if (data.payload) {
        setStatus({loading: true});
        fetch(payloadDataUrl(url, data.payload))
          .then(handleResponse)
          .then(json => {
            if (!json.length) {
              setData(prevState => ({...prevState, payload: null}));
              setStatus({error: handleError("Empty Payload"), loading: false});
              return;
            }
            let issues = orderData(json),
                [standalone, upgrades] = tablify(issues);
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
  },[data.payload, url]);

  return (
    <div className="payload-overview">
      <PayloadPicker onSelect={setPayload} data={payloadsData} />
      {status.loading && <Spinner />}
      {status.error && <MessageBar error={status.error} />}
      {data.issues != null && <Stats data={data.issues} />}
      {data.issues != null && <IssueTables link={payloadPageUrl(url, data.payload)} data={data} setRows={setData} />}
    </div>
  );
};

export default PayloadOverview;
