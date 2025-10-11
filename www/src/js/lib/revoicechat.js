class ReVoiceChat {
    // Token
    #token;

    setToken(token) {
        this.#token = token;
    }

    getToken() {
        return this.#token;
    }

    // Server Send Event
    #sse;

    openSSE() {
        this.#sse = new EventSource(`${getGlobal().url.core}/api/sse?jwt=${RVC.getToken()}`);

        this.#sse.onmessage = (event) => {
            event = JSON.parse(event.data);
            const type = event.type;
            const data = event.data;

            console.debug("SSE : ", event);

            switch (type) {
                case "PING":
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

        this.#sse.onerror = () => {
            console.error(`An error occurred while attempting to connect to "${getGlobal().url.core}/api/sse".\nRetry in 10 seconds`);
            setTimeout(() => {
                sseOpen();
                getMessages(getGlobal().room.id);
            }, 10000);
        }
    }

    closeSSE() {
        if (this.#sse) {
            this.#sse.close();
            this.#sse = null;
        }
    }

    // Notifications
    #defaultSounds = {
        messageNew: 'src/audio/messageNew.ogg',
        voiceUserJoin: 'src/audio/userJoinMale.mp3',
        voiceUserLeft: 'src/audio/userLeftMale.mp3',
        voiceConnected: 'src/audio/userConnectedMale.mp3',
        voiceDisconnected: 'src/audio/userDisconnectedMale.mp3',
    }

    playNotification(type) {
        if (!this.#defaultSounds[type]) {
            console.error('Notification type is null or undefined');
        }

        let audio = new Audio(this.#defaultSounds[type]);
        audio.volume = 0.25;
        audio.play();
    }
}