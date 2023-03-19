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
        fetch("https://trygven.no:7201/Restart?" + passcode + "+" + serverName);
    }

    function updateStatus() {
        for (let i = 0; i < servers.length; i++) {
            if (servers[i] == "Web") {
                document.getElementById(servers[i] + "Status").style.backgroundColor = "#39FF14";
            } else {
                fetch("https://trygven.no:7201/Status?" + servers[i])
                    .then((response) => {
                        response.text().then((status) => {
                            if (status == "true") {
                                document.getElementById(servers[i] + "Status").style.backgroundColor = "#39FF14";
                            } else {
                                document.getElementById(servers[i] + "Status").style.backgroundColor = "#FF3131";
                            }
                        });
                    });
            }
        }
    }
    setInterval(updateStatus, 5000);

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

    setTimeout(updateStatus, 100);
    return (
        <div className="serverContainer">
            <div className="serverHeader">Server status</div>
            {serverDivs}
        </div>
    );
}
export default ServerStatus;


