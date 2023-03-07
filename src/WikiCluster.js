import './WikiCluster.css';
import { useRef, useState, useEffect } from 'react';
import Panzoom from '@panzoom/panzoom';

var panzoom;

function fetchGraph() {
    let input = document.getElementById("queryNames").value;
    input = input.split("+");
    var queryText = input[0].trim();
    for (let i = 1; i < input.length; i++) {
        queryText = queryText + "+" + input[i].trim();
    }
    let graphSize = document.getElementById("graphSize").value;

    fetch("http://trygven.no:7200/getSVG?" + queryText + "+" + graphSize)
    .then((response) => response.text())
    .then(svg => {
            let SVGElement = document.getElementById("SVG");
            SVGElement.innerHTML = svg;
            let width = parseInt(SVGElement.childNodes[6].getAttribute("width"));
            let height = parseInt(SVGElement.childNodes[6].getAttribute("height"));
            let clientWidth = document.getElementById("SVGViewer").clientWidth;
            let clientHeight = document.getElementById("SVGViewer").clientHeight;
            let scaling = Math.min(Math.abs(clientWidth/width), Math.abs(clientHeight/height));
            console.log("width: " + width + "   height: " + height);
            console.log("clientWidth: "+ clientWidth   + " clientHeight: " + clientHeight );
            console.log("startX: "+ (clientWidth/2*1.33 + width/2*1.33)   + " startY: " + (clientHeight/2*1.33 + height/2*1.33));
            panzoom = Panzoom(SVGElement, {startX: (clientWidth/2 - width/2)*1.33, startY: (clientHeight/2*1.33 - height/2*1.33), startScale: scaling}); //todo , startScale: scaling
            document.getElementById("SVG").parentElement.addEventListener('wheel', panzoom.zoomWithWheel);
        });

   
    //todo if bad request output error message and keep old graph
}
function test() {
    console.log(panzoom.getPan());
}
//setInterval(test, 1000);

function WikiCluster() {
console.log("reload");
    /*
  var panzoom;
  useEffect(() => {
    setTimeout(() => {
      panzoom = Panzoom(document.getElementById("panzoom-element"), { contain: 'outside', startScale: 1.5 })
    }, 1000)
  }, [])*/


    return (
        <div className="WikiContainer">

            <div className="SVGViewer" id="SVGViewer">
                <div id="SVG" />
            </div>
            <div className="userControls">
                <div className="WikiHeader">Lag din egen graf</div>
                Graf noder
                <input type="text" id="queryNames" defaultValue="Kiwi" required></input>
                <label htmlFor="graphsize">Graf størrelse</label>
                <input type="range" id="graphSize" defaultValue="20" min="1" max="100" />
                <button type="button" className="Btn" onClick={fetchGraph}>Hent graf</button>
                <div className="errorMessage"> </div>
            </div>
        </div>
    );
}
export default WikiCluster;