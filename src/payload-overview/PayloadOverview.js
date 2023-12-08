import React, { useState, useEffect, useCallback } from 'react';
import { useHistory, useLocation } from "react-router-dom";

import { orderData, tablify } from './TableUtil';
import Stats from './Stats';
import IssueTables from './IssueTables';
import PayloadPicker from './PayloadPicker';
import ComponentView from './ComponentView';
import MessageBar from '../common/MessageBar';
import { Spinner } from '@patternfly/react-core';
import { handleError, handleResponse } from '../common/Errors';
import { conf } from '../common/Conf';

import { Tabs, Tab, TabTitleText, TabTitleIcon } from '@patternfly/react-core';
import PackageIcon from '@patternfly/react-icons/dist/esm/icons/package-icon';
import ModuleIcon from '@patternfly/react-icons/dist/esm/icons/module-icon';

const fullPayloadName = (name, separator) => {
  let majorMinor = name.match(/(\d+\.\d+)[.\s]/)[1];
  return `jboss-eap-${majorMinor}.z${separator}${name}`;
};

const payloadDataUrl = (url, payload) => `${url}payload/${fullPayloadName(payload,'/')}`;

const payloadPageUrl = (url, payload) =>
  `${url.replace('/api/','/')}streampayload/${fullPayloadName(payload,'/payload/')}`;

const newPayloadIssuesUrl = (url, payload, date) => `${url}new-issues/${payload}/${date}`;

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
      newIssues: [],
      newSince: '',
      payload: payloadKey
  });

  const [status, setStatus] = useState({
      loading: false,
      error: null
  });

  const setErrorStatus = (error) => {
    setStatus({error: handleError(error), loading: false});
  }

  const [activeTabKey, setActiveTabKey] = useState(0);

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

  const setNewSince = (_event, newSince) => {
    if (!newSince) {
      setData(prevState => ({...prevState, newSince: ''}))
      return;
    }
    setData(prevState => ({...prevState, newSince: newSince}));
  }

  const tryBaseUrl = useCallback(() => {
    fetch(url.replace('/rest/api','/'), { mode: 'no-cors' })
      .then(handleResponse)
      .catch(setErrorStatus);
  },[url]);

  useEffect(() => {
    setStatus({loading: true});
    fetch(`${url}payloads/`)
      .then(handleResponse)
      .then(json => {
          setPayloadsData(prevState => ({...prevState, list: json}))
          setStatus({loading: false});
      })
      .catch(tryBaseUrl);
  },[url, tryBaseUrl]);

  useEffect(() => {
    if (data.payload) {
      setStatus({loading: true});
      fetch(payloadDataUrl(url, data.payload))
        .then(handleResponse)
        .then(json => {
          if (!json.length) {
            setData(prevState => ({...prevState, payload: null, issues: null}));
            setErrorStatus({ message: "Empty Payload" });
            return;
          }
          let issues = orderData(json),
              [standalone, upgrades] = tablify(issues, data.payload);
          setData(prevState => ({
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
        .catch(error => {
          console.log(error);
          tryBaseUrl()
        });
    }
  },[data.payload, url, tryBaseUrl]);

  useEffect(() => {
    if (data.newSince) {
      setStatus({loading: true});
      fetch(newPayloadIssuesUrl(url, data.payload, data.newSince))
        .then(handleResponse)
        .then(json => {
            setData(prevState => ({...prevState, newIssues: json}))
            setStatus({loading: false});
        })
        .catch(tryBaseUrl);
    }
  },[data.payload, data.newSince, url, tryBaseUrl]);

  const handleTabClick = (event, tabIndex) => setActiveTabKey(tabIndex);

  return (
    <div className="payload-overview">
      <PayloadPicker onSelect={setPayload} data={payloadsData} />
      {status.loading && <Spinner />}
      {status.error && <MessageBar error={status.error} />}
      {data.issues &&
        <Tabs activeKey={activeTabKey} onSelect={handleTabClick} isBox>
          <Tab eventKey={0} title={<><TabTitleIcon><PackageIcon /></TabTitleIcon> <TabTitleText>Payload</TabTitleText>  </>}>
            <Stats data={data.issues} />
            <IssueTables link={payloadPageUrl(url, data.payload)} data={data} setRows={setData} setNewSince={setNewSince} />
          </Tab>
          <Tab eventKey={1} title={<><TabTitleIcon><ModuleIcon /></TabTitleIcon> <TabTitleText>Component Upgrade View</TabTitleText>  </>}>
            <ComponentView data={data} />
          </Tab>
        </Tabs>
      }
    </div>
  );
};

export default PayloadOverview;
