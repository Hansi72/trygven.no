import './Links.css';
import CV from './HANS-TRYGVE-RØRLIEN-CV23.pdf';

function Links() {

    return (
        <div className="linksContainer">
            <div className="linkHeader">Lenker</div>
            <a className="link" href="https://github.com/Hansi72">
            Github
            </a>
            <a className="link" href="https://git.app.uib.no/hans.rorlien">
            Gitlab
            </a>
            <a className="link" href="https://www.linkedin.com/in/hans-trygve-r%C3%B8rlien-a70392228/">
            LinkedIn
            </a>
            <a className="link" href={CV}>
            CV
            </a>
            <a className="link" href="http://trygven.no:7200/help">
                Wiki Cluster
            </a>
            <a className="link" href="https://lykilinn.no">
            Molecular Moods
            </a>
            
        
        </div>
    );
}
export default Links;


