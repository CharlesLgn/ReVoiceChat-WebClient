async function getServers() {
    const result = await fetchCoreAPI("/server", 'GET');

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

    console.info(`SERVER : Selected server : ${serverData.id}`);

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

function sseOpen() {
    console.info(`SERVER : Connecting to "${getGlobal().url.core}/api/sse"`);

    // Close current if it exist before openning a new connection
    sseClose();

    getGlobal().sse = new EventSource(`${getGlobal().url.core}/api/sse?jwt=${getGlobal().jwtToken}`);

    getGlobal().sse.onmessage = (event) => {
        event = JSON.parse(event.data);
        const type = event.type;
        const data = event.data;

        console.debug("SSE : ", event);

        switch (type) {
            case "PING":
                console.info("SSE : Pinged by server.");
                return;

            case "SERVER_UPDATE":
                serverUpdate(data);
                return;

            case "ROOM_UPDATE":
                roomUpdate(data);
                return;

            case "ROOM_MESSAGE":
                roomMessage(data);
                return;

            case "DIRECT_MESSAGE":
                return;

            case "USER_STATUS_CHANGE":
                return;

            case "USER_UPDATE":
                userUpdate(data);
                return;

            case "VOICE_JOINING":
                voiceUserJoining(data);
                return;

            case "VOICE_LEAVING":
                voiceUserLeaving(data);
                return;

            default:
                console.error("SSE type unknowned: ", type);
                return;
        }
    };

    getGlobal().sse.onerror = () => {
        console.error(`An error occurred while attempting to connect to "${getGlobal().url.core}/api/sse".\nRetry in 10 seconds`);
        setTimeout(() => {
            sseOpen();
            getMessages(getGlobal().room.id);
        }, 10000);
    }
}
