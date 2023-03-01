import './ServerStatus.css';

function ServerStatus() {
    const servers = ["Rust", "Valheim", "etc"];
    var serverDivs = [];

    function restartServer(serverName, passcode){
        console.log("restarting server " + serverName + " with passcode " + passcode);
        //todo create fetch
    }
    //todo create if passcode == 1234, open inf rickrolls
    function restartPrompt(serverName){
        let passcode = prompt("Enter passcode to restart " + serverName);
        if(passcode != null && passcode != ""){
            return restartServer(serverName, passcode);
        }
    }


    for (let i = 0; i < servers.length; i++) {
        serverDivs.push(<><div className="server">{servers[i]} </div><div className="circle" /> <button type="button" onClick={function(){restartPrompt(servers[i])}}>Restart</button></>);
    }

    return (
        <div className="serverContainer">
            Server Status:
            {serverDivs}
        </div>
    );
}
export default ServerStatus;


