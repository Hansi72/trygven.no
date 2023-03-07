import './ServerStatus.css';

function ServerStatus() {
    //List of servers to include. (affects both visible text and backend queries)
    const servers = ["Web", "Valheim", "Rust"];


    //todo if passcode == 1234, open inf rickrolls
    function restartPrompt(serverName) {
        let passcode = prompt("Enter passcode to restart " + serverName);
        if (passcode != null && passcode != "") {
            return restartServer(serverName, passcode);
        }
    }

    function restartServer(serverName, passcode) {
        console.log("restarting server " + serverName + " with passcode " + passcode);
        //todo create fetch
    }

    function updateStatus() {
        for (let i = 0; i < servers.length; i++) {
            if (checkStatus(servers[i])) {
                document.getElementById(servers[i] + "Status").style.backgroundColor = "#39FF14";
            } else {
                document.getElementById(servers[i] + "Status").style.backgroundColor = "#FF3131";
            }
        }
    }
    setInterval(updateStatus, 1000);

    function checkStatus(serverName) {
        if(serverName == "Web"){
            return true;
        }
        //todo fetch server status of serverName
        return false;
    }

    var serverDivs = [];
    for (let i = 0; i < servers.length; i++) {
        serverDivs.push(
            <div className="server" key={servers[i]}>
                <div className="circle" id={servers[i] + "Status"} />
                <div className="serverName"> {servers[i]} </div>
                <button className="Btn" key={servers[i] + "btn"} type="button" onClick={function () { restartPrompt(servers[i]) }}>Restart</button>
            </div>
        );
    }

    return (
        <div className="serverContainer">
            <div className="serverHeader">Server status</div>
            {serverDivs}
        </div>
    );
}
export default ServerStatus;


