async function getRooms(serverId) {
    try {
        const response = await fetch(`${current.host}/server/${serverId}/room`, {
            cache: "no-store",
            signal: AbortSignal.timeout(5000),
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const result = await response.json();

        createRoomList(result);
        selectRoom(result[0]);
    }
    catch (error) {
        connectingSwal.close();
        console.error("Error getting room : ", error);
    }
}

function createRoomList(data) {
    const roomList = document.getElementById("room-container");
    roomList.innerHTML = "";
    for (const neddle in data) {
        roomList.appendChild(createRoom(data[neddle], () => selectRoom(data[neddle])));
    }
}

function createRoom(roomData, onclick) {
    const DIV = document.createElement('div');
    DIV.id = roomData.id;
    DIV.className = "room";
    DIV.onclick = onclick;
    DIV.innerHTML = `<h3 class="room-title">${roomData.name}</h3>`;
    return DIV;
}

function selectRoom(roomData) {
    if (roomData === undefined || roomData === null) {
        console.error("roomData is null or undefined");
        return;
    }

    if (roomData.type === "TEXT") {
        console.log(`Selected room : ${roomData.id}`);
        if (current.room.id !== null) {
            document.getElementById(current.room.id).classList.remove("active");
        }
        current.room = roomData;

        document.getElementById(roomData.id).classList.add("active");
        document.getElementById("room-name").innerText = roomData.name;
        document.getElementById("chat-input").placeholder = `Send a message in ${roomData.name}`;
        document.getElementById("chat-input").focus();
        
        getMessages(roomData.id);
    }
}