import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import SVGViewer from './SVGViewer';
import ServerStatus from './ServerStatus';
import Links from './Links';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <div className="container">
      <div className="content">
        <Links/>
        <ServerStatus />
        <SVGViewer />
      </div>
    </div>
  </React.StrictMode>
);
