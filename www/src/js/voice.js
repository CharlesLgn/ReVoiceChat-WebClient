const voice = {
    encoder: null,
    socket: null,
}

const opusConfig = {
    application: "voip",
    complexity: 9,
    signal: "voice",
    usedtx: true,
    frameDuration: 20000, //20ms
    useinbanddec: true,
};

const codecConfig = {
    codec: "opus",
    sampleRate: 48000, //48 kHz
    numberOfChannels: 1, // Mono
    bitrate: 64000, // 64 kbits
    bitrateMode: "variable",
    opus: opusConfig,
}

async function voiceCodecInit() {
    const supported = await AudioEncoder.isConfigSupported(encoderConfig)
    console.log(supported);
    if (supported.supported) {
        // Setup Encoder
        voice.encoder = new AudioEncoder({
            output: sendAudioChunk,
            error: (error) => { throw Error(`Error during codec setup:\n${error}\nCurrent codec :${codecConfig}`) },
        });

        voice.encoder.configure(encoderConfig)
        return true;
    }
}


async function voiceJoin(roomId) {
    try {
        await voiceCodecInit();



    }
    catch (error) {
        console.error(error);
    }
}

function voiceLeave(roomId) {

}

async function voiceShowConnnectedUsers(roomId) {
    const result = await getCoreAPI(`/server/${global.server.id}/user`); // TO DO : Replace with actual Endpoint

    if (result === null) {
        console.info("VOICE : No user in room");
        return;
    }

    const sortedByDisplayName = [...result].sort((a, b) => {
        return a.displayName.localeCompare(b.displayName);
    });

    const VOICE_CONTENT = document.getElementById("voice-content");
    VOICE_CONTENT.innerHTML = "";

    let tempList = [];

    for (const i in sortedByDisplayName) {
        tempList.push(sortedByDisplayName[i].id);
    }

    const usersPfpExist = await fileBulkExistMedia("/profiles/bulk", tempList);

    for (const i in sortedByDisplayName) {
        VOICE_CONTENT.appendChild(voiceCreateConnectedUser(sortedByDisplayName[i], usersPfpExist ? [sortedByDisplayName[i].id] : false));
    }

    // Room is currently active
    if (global.voice.roomId === global.room.id) {
        voiceUpdateUsersControls();
    }
}

function voiceCreateConnectedUser(userData, userPfpExist) {
    const DIV = document.createElement('div');
    DIV.id = `voice-${userData.id}`;
    DIV.className = "voice-profile";

    let profilePicture = "src/img/default-avatar.webp";
    if (userPfpExist === true) {
        profilePicture = `${global.url.media}/profiles/${userData.id}`;
    }

    DIV.innerHTML = `
        <div class='block-user'>
            <div class='relative'>
                <img src='${profilePicture}' alt='PFP' class='icon ring-2' />
            </div>
            <div class='user'>
                <h2 class='name'>${userData.displayName}</h2>
            </div>
        </div>
    `;

    return DIV;
}

async function voiceUpdateUsersControls() {
    const result = await getCoreAPI(`/server/${global.server.id}/user`); // TO DO : Replace with actual Endpoint

    if (result === null) {
        console.info("VOICE : No user in room");
        return;
    }

    for (const i in result) {
        voiceUpdateUser(result[i].id);
    }
}

function voiceUpdateUser(userId) {

}

function voiceUpdateSelfControls() {
    const VOICE_ACTION = document.getElementById("voice-join-action");
    const readyState = (global.voice.socket !== null && global.voice.roomId === global.room.id) ? global.voice.socket.readyState : WebSocket.CLOSED;

    switch (readyState) {
        case WebSocket.CONNECTING:
            // Set disconnect actions
            VOICE_ACTION.className = "join";
            VOICE_ACTION.classList.add('waiting');
            VOICE_ACTION.innerText = "Leave";
            VOICE_ACTION.onclick = () => voiceLeave();
            break;

        case WebSocket.CLOSED:
            // Set connect actions
            VOICE_ACTION.className = "join";
            VOICE_ACTION.classList.add('disconnected');
            VOICE_ACTION.innerText = "Join";
            VOICE_ACTION.onclick = () => voiceJoin(global.room.id);
            break;

        case WebSocket.OPEN:
            VOICE_ACTION.className = "join";
            VOICE_ACTION.classList.add('connected');
            VOICE_ACTION.innerText = "Leave";
            VOICE_ACTION.onclick = () => voiceLeave();
            break;
    }
}

/* Those don't do shit yet, only show it */

function voiceControlVolume(userId, volumeInput) {
    volumeInput.title = volume * 100 + "%";
}

function voiceControlMute(userId, muteButton) {
    if (global.voice.users[userId].audio.muted) {
        muteButton.classList.remove('active');
    }
    else {
        muteButton.classList.add('active');
    }
}

function voiceControlSelfMute() {
    const mute = document.getElementById("voice-self-mute");

    if (global.voice.selfMute) {
        // Unmute
        console.info("VOICE : Self unmute");
        global.voice.selfMute = false;
        mute.classList.remove('active');
    }
    else {
        // Mute
        console.info("VOICE : Self mute");
        global.voice.selfMute = true;
        mute.classList.add('active');
    }
}