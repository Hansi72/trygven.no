import './WikiCluster.css';
import Panzoom from '@panzoom/panzoom';

var panzoom;

function fetchGraph() {
    document.getElementById("loader").style.display = "block";
    document.getElementById("SVG").style.display = "none";
    let input = document.getElementById("queryNames").value;
    if (input.includes("+")) {
        input = input.split("+");
    } else {
        input = input.split(",");
    }
    var queryText = input[0].trim();
    for (let i = 1; i < input.length; i++) {
        queryText = queryText + "+" + input[i].trim();
    }
    let graphSize = document.getElementById("graphSize").value;

    fetch("http://trygven.no:7200/getSVG?" + queryText + "+" + graphSize)
        .then((response) => response.text())
        .then(svg => {
            let SVGElement = document.getElementById("SVG");
            //if (response.status == "200") {
            document.getElementById("loader").style.display = "none";
            SVGElement.innerHTML = svg;
            document.getElementById("SVG").style.display = "block";
            //multiplied by 1.33 to convert from pt to px
            let SVGWidth = parseInt(SVGElement.childNodes[6].getAttribute("width")) * 1.33;
            let SVGHeight = parseInt(SVGElement.childNodes[6].getAttribute("height")) * 1.33;
            let clientWidth = document.getElementById("SVGViewer").clientWidth;
            let clientHeight = document.getElementById("SVGViewer").clientHeight;

            let startScale = Math.min(clientWidth / Math.abs(SVGWidth), clientHeight / Math.abs(SVGHeight));
            let startX = clientWidth / 2 - SVGWidth / 2;
            let startY = (clientHeight / 2 - SVGHeight / 2) / startScale;

            panzoom = Panzoom(SVGElement, { startX: startX, startY: startY, startScale: startScale });
            document.getElementById("SVG").parentElement.addEventListener('wheel', panzoom.zoomWithWheel);
            // } else {
            //    document.getElementById("errors").innerHTML = response.text();
            //}
        });


    //todo if bad request output error message and keep old graph
}
function test() {
    console.log(panzoom.getPan());
}
//setInterval(test, 1000);

function WikiCluster() {
    return (
        <div className="WikiContainer">
            <div className="SVGViewer" id="SVGViewer">
                <div id="loader" className='loader'/>
                <div id="SVG"></div>
            </div>
            <div className="userControls">
                <div className="WikiHeader">Lag din egen graf</div>
                Graf noder
                <input type="text" id="queryNames" defaultValue="Kiwi" required></input>
                <label htmlFor="graphsize">Graf størrelse</label>
                <input type="range" id="graphSize" defaultValue="20" min="1" max="100" />
                <button type="button" className="Btn" onClick={fetchGraph}>Hent graf</button>
                <div className="errorMessage" id="errors"> </div>
            </div>
        </div>
    );
}
export default WikiCluster;