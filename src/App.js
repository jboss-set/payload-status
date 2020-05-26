import React from 'react';
import IssueSeparateTable from './IssueSeparateTables';
import '@patternfly/react-core/dist/styles/base.css'
import './App.css';

let data = require('./data/7.3.2.json');

function App() {
  return (
    <div className="App">
      <IssueSeparateTable data={data} />
    </div>
  );
}

export default App;
