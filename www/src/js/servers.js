let hostUrl = "https://srv.revoicechat.fr";

const currentState = {
    global: {
        sse: null,
    },
    server: {
        id: null,
    },
    room: {
        id: null,
    }
}

// Ready state
document.addEventListener('DOMContentLoaded', function () {
    Swal.fire({
        icon: "question",
        title: "Login",
        html: `<form id='swal-form'>
            <label>Host</label>
            <br/>
            <input type='text' name='host' class='swal2-input' placeholder='https://srv.revoicechat.fr' value='${hostUrl}'>

            <br/>
            <label>Username</label>
            <br/>
            <input type='text' name='username' class='swal2-input'>

            <br/>
            <label>Password</label>
            <br/>
            <input type='password' name='password' class='swal2-input'>

            </form>`,
        allowOutsideClick: false,
        allowEscapeKey: false,
        confirmButtonText: "Connect",
        width: "40em",
    }).then((result) => {
        if (result.value) {
            const FORM = document.getElementById("swal-form");
            const LOGIN = {
                'username': FORM.username.value,
                'password': FORM.password.value,
            };

            hostUrl = FORM.host.value;

            let connectingSwal = Swal.fire({
                icon: "info",
                title: `Connecting to\n ${hostUrl}`,
                focusConfirm: false,
                allowOutsideClick: false,
                timerProgressBar: true,
                animation: false,
                didOpen: () => {
                    Swal.showLoading();
                    login(LOGIN, connectingSwal);
                }
            })
        }
    })
});

async function login(loginData, connectingSwal) {
    try {
        const response = await fetch(`${hostUrl}/login`, {
            cache: "no-store",
            signal: AbortSignal.timeout(5000),
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify(loginData),
        });

        const result = await response.ok;

        connectingSwal.close();

        let loadingSwal = Swal.fire({
            icon: "info",
            title: `Loading server list from host\n ${hostUrl}`,
            focusConfirm: false,
            allowOutsideClick: false,
            timerProgressBar: true,
            animation: false,
            didOpen: () => {
                Swal.showLoading();
                getServers(loadingSwal);
                sseConnect();
            }
        })
    }
    catch (error) {
        connectingSwal.close();
        console.error("Error while login : ", error);
    }
}

async function getServers(loadingSwal) {
    try {
        const response = await fetch(`${hostUrl}/server`, {
            cache: "no-store",
            signal: AbortSignal.timeout(5000),
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        const result = await response.json();

        loadingSwal.close();
        buildServerList(result);
        selectServer(result[0]);
    }
    catch (error) {
        loadingSwal.close();
        console.error("Error while retrieving server list : ", error);
    }
}

function buildServerList(data) {
    /*const serverList = document.getElementById("srv-list");
    for (const neddle in data) {
        serverList.appendChild(createAnchor(data[neddle].name, () => selectServer(data[neddle].id), data[neddle].id));
    }*/
}

function selectServer(serverData) {
    if(serverData === undefined || serverData === null){
        console.error("serverData is null or undefined");
        return;
    }

    console.log(`Selected server : ${serverData.id}`);
    currentState.server.id = serverData.id;
    document.getElementById("server-name").innerText = serverData.name;
    getRooms(serverData.id);
}

function sseConnect() {
    console.log(`Connecting to "${hostUrl}/sse"`);

    if (currentState.global.sse !== null) {
        currentState.global.sse.close();
        currentState.global.sse = null;
    }

    currentState.global.sse = new EventSource(`${hostUrl}/sse`, { withCredentials: true });

    currentState.global.sse.onmessage = (event) => {
        eventData = JSON.parse(event.data);
        if (eventData.roomId === currentState.room.id) {
            const ROOM = document.getElementById("room-messages");
            ROOM.appendChild(createMessage(eventData));
            ROOM.scrollTop = ROOM.scrollHeight;
        }
    };

    currentState.global.sse.onerror = () => {
        console.error(`An error occurred while attempting to connect to "${hostUrl}/sse".\nRetry in 10 seconds`);
        setTimeout(() => {
            sseConnect();
            getMessages(currentState.room.id);
        }, 10000);
    }
}
