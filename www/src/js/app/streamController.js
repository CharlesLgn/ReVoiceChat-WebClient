import Stream from "./stream.js";

export default class StreamController {
    #streamUrl;
    #token;
    #streamer = [];
    #viewer = [];
    #room;
    #user;

    constructor(fetcher, alert, user, room, token, streamUrl) {
        this.#streamUrl = streamUrl;
        this.#token = token;
        this.#room = room;
        this.#user = user;
    }

    async startStream(type) {
        try {
            const position = this.#streamer.push(new Stream(this.#streamUrl, this.#user, this.#token, this.#room.id)) - 1;
            const streamerId = `stream${position}`;
            await this.#streamer[position].start(streamerId, type);
            console.log(`StreamerId : ${streamerId}`);
        }
        catch (error) {
            console.error(error);
        }
    }

    async stopStream(streamName){
        const id = streamName.replace('stream', '');
        if(this.#streamer[id]){
            await this.#streamer[id].stop();
        }
    }

    async joinStream(userId, streamName){
        this.#viewer[streamName] = new Stream(this.#streamUrl, this.#user, this.#token, this.#room.id);
        await this.#viewer[streamName].join(userId, streamName);
    }

    async leaveStream(streamName){
        if(this.#viewer[streamName]){
            await this.#viewer[streamName].stop();
        }
    }
}