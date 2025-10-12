async function getServers() {
    const result = await RVC.fetchCore("/server", 'GET');

    if (result === null) {
        return;
    }

    if (getGlobal().server.id) {
        selectServer(getGlobal().server);
    } else {
        selectServer(result[0]);
    }
}

function selectServer(serverData) {
    if (serverData === undefined || serverData === null) {
        console.error("serverData is null or undefined");
        return;
    }

    getGlobal().server = serverData;
    document.getElementById("server-name").innerText = serverData.name;

    getServerUsers(serverData.id);
    getRooms(serverData.id);
}

function serverUpdate(data) {
    switch (data.action) {
        case "MODIFY":
            getRooms(getGlobal().server.id);
            return;

        default:
            return;
    }
}
