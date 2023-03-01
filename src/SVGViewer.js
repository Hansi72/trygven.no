import svgfile from './erna.svg'
import './SVGViewer.css';

function SVGViewer() {
  return (
    <div className="svgContainer">
      <div className="svgView">
        <p>SVGViewer</p>
        <img src={svgfile} alt="svgImage"></img>
      </div>
      <div className="controls">
        <p>Input field:</p>
        <input type="text" id="name" name="name" required
          minLength="4" maxLength="8" size="10"></input>

        <label htmlFor="graphsize">Graph size</label>
        <input type="range" id="graphsize" min="0" max="100" />

        <button type="button">Create Graph</button>
      </div>
      
    </div>
  );
}
//<img src={svgfile} alt="svgImage"></img>
export default SVGViewer;