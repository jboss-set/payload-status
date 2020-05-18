import React, {useState} from 'react';
import logo from './logo.svg';
import IssueSingleTable from './IssueSingleTable';
import IssueSeparateTable from './IssueSeparateTables';
import './App.css';

let data = require('./data/7.3.2.json');

function App() {
  const [single, setSingle] = useState(true);

  return (
    <div className="App">
      <button onClick={()=>setSingle(!single)}>Switch to {single ? 'separate' : 'single'} view</button>
      {single ?
          <IssueSingleTable data={data} /> :
          <IssueSeparateTable data={data} />
      }
    </div>
  );
}

export default App;
