import svgfile from './erna.svg'
import './SVGViewer.css';
import { useRef, useState, useEffect } from 'react';
import Panzoom from '@panzoom/panzoom';

function fetchGraph() {
  let input = document.getElementById("queryNames").value;
  input = input.split("+");
  var queryText = input[0].trim();
  for (let i = 1; i < input.length; i++) {
    queryText = queryText + "+" + input[i].trim();
  }
  let graphSize = document.getElementById("graphSize").value;


  fetch("http://trygven.no:7200/getSVG?" + queryText + "+" + graphSize)
    .then(response => response.text())
    .then(svg => document.getElementById("panzoom-element").innerHTML = svg);

  //var panzoom;
  //panzoom = Panzoom(document.getElementById("panzoom-element"), {contain: 'outside'}); //contain: 'outside', startScale: 1.5 

  //todo if bad request output error message and keep old graph
}

function SVGViewer() {

  var panzoom;
  useEffect(() => {
    setTimeout(() => {
      panzoom = Panzoom(document.getElementById("panzoom-element"), { contain: 'outside', startScale: 1.5 })
    }, 1000)
  }, [])


  return (
    <div className="svgContainer">

      <div className="svgView">
        <svg id="panzoom-element" alt="svgImage"></svg>
      </div>

      <div className="controls">
        <p>Input field:</p>
        <input type="text" id="queryNames" required></input>

        <label htmlFor="graphsize">Graph size</label>
        <input type="range" id="graphSize" min="1" max="100" />
        <button type="button" id="createGraphBtn" onClick={fetchGraph}>Create Graph</button>
      </div>

    </div>
  );
}
export default SVGViewer;