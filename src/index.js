import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import SVGViewer from './SVGViewer';
import ServerStatus from './ServerStatus';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <div className="container">
      <div className="content">
        <ServerStatus />
        <SVGViewer />
      </div>
    </div>
  </React.StrictMode>
);
