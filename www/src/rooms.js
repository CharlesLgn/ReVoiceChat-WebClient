async function getRooms(serverId) {
    fetch(`${hostUrl}/server/${serverId}/room`, {
        cache: "no-store",
        signal: AbortSignal.timeout(5000),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then((response) => {
        return response.json();
    }).then((body) => {
        buildRoomList(body);
        selectRoom(body[0].id);
    }).catch((error) => {
        console.log(error)
    });
}

function createRoom(room, onclick) {
    const DIV = document.createElement('div');
    DIV.id = room.id;
    DIV.className = "chat-hover p-4 border-b border-gray-700 cursor-pointer relative";

    const ANCHOR = document.createElement('a');
    ANCHOR.onclick = onclick;
    ANCHOR.innerHTML = `
        <div class="flex items-center space-x-3">
            <div class="flex-1 min-w-0">
                <div class="flex justify-between items-start">
                    <h3 class="font-semibold text-white truncate">${room.name}</h3>
                </div>
            </div>
        </div>`;

    DIV.appendChild(ANCHOR);
    return DIV;
}

function selectRoom(roomId) {
    console.log(`Select room : ${roomId}`);

    if (currentState.roomId !== null) {
        document.getElementById(currentState.roomId).classList.remove("bg-green-900", "bg-opacity-20", "border-l-4", "border-green-400");
    }
    currentState.roomId = roomId;
    
    document.getElementById(roomId).classList.add("bg-green-900", "bg-opacity-20", "border-l-4", "border-green-400");

    getRoomContent(roomId);
}

async function getRoomContent(roomId) {
    fetch(`${hostUrl}/room/${roomId}/chat`, {
        cache: "no-store",
        signal: AbortSignal.timeout(5000),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then((response) => {
        return response.json();
    }).then((body) => {
        console.log("Text from room : ", body);
    }).catch((error) => {
        console.log(error)
    });
}