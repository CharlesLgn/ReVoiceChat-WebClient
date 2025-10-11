class ReVoiceChat {
    // Token
    #token;

    setToken(token){
        this.#token = token;
    }

    getToken(){
        return this.#token;
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