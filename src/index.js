import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import ServerStatus from './ServerStatus';
import WikiCluster from './WikiCluster';
import Links from './Links';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <div className="container">
      <div className="topbar">
        <div className="bannertext">
          <div>La meg designe <br /> frontend, easy (jk).</div>
          <a className="quoteAuthor" href="https://www.linkedin.com/in/martine-oppegaard-jakobsen-60727b16b/" >-Android dev</a>
        </div>
        <img className="kiwi" src={require("./kiwi.jpg")} alt="kiwi" />
      </div>
      <div className="linkbox">
        <Links />
      </div>
      <div className="serverstatus">
        <ServerStatus />
      </div>
      <div className="wikiCluster" id="WikiCluster">
        <WikiCluster />
      </div>
    </div>
  </React.StrictMode>
);
