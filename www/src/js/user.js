async function getUsername() {
    const result = await getRequestOnCore(`/user/me`);

    if (result !== null) {
        current.user = result;

        document.getElementById("user-name").innerText = result.displayName;
        document.getElementById("user-status").innerText = result.status;
        document.getElementById("user-dot").className = `user-dot ${statusToDotClassName(result.status)}`;

        if (await fileExistOnMedia(`/profiles/${result.id}`)) {
            document.getElementById("user-picture").src = `${current.mediaUrl}/profiles/${result.id}`;
        }
    }
}

async function getServerUsers(serverId) {
    const result = await getRequestOnCore(`/server/${serverId}/user`);

    const sortedName = [...result].sort((a, b) => {
        return a.displayName.localeCompare(b.displayName);
    });

    const sortedStatus = [...sortedName].sort((a, b) => {
        if (a.status === b.status) {
            return 0;
        }
        else {
            if (a.status === "ONLINE") {
                return -1;
            }
            if (b.status === "ONLINE") {
                return 1;
            }
        }
    });

    if (sortedStatus !== null) {
        const userList = document.getElementById("user-list");
        userList.innerHTML = "";

        for (const neddle in sortedStatus) {
            userList.appendChild(await createUser(sortedStatus[neddle]));
        }
    }
}

async function createUser(data) {
    const DIV = document.createElement('div');
    DIV.id = data.id;
    DIV.className = "user-profile";

    let profilePicture = "src/img/default-avatar.webp";
    if (await fileExistOnMedia(`/profiles/${data.id}`)) {
        profilePicture = `${current.mediaUrl}/profiles/${data.id}`;
    }

    DIV.innerHTML = `
        <div class="relative">
            <img src="${profilePicture}" alt="PFP" class="icon ring-2" />
            <div id="dot-${data.id}" class="user-dot ${statusToDotClassName(data.status)}"></div>
        </div>
        <div class="user">
            <h2 class="name" id="user-name">${data.displayName}</h2>
            <p class="status" id="user-status">${data.status}</p>
        </div>
    `;

    return DIV;
}

function statusToDotClassName(status) {
    switch (status) {
        case "ONLINE":
            return "user-dot-online";
        case "AWAY":
            return "user-dot-away";
        case "DO_NOT_DISTURB":
            return "user-dot-dnd";
        case "INVISIBLE":
        default:
            return "user-dot-offline";
    }
}