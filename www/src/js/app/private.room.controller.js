import TextController from "./text.controller.js";

export default class PrivateRoomController {
    /** @type {TextController} */
    textController;
    id;
    name;
    type;

    /** @param {UserController} user */
    constructor(user) {
        this.user = user;
        this.textController = new TextController(user, this, true);
    }

    load(){
        
    }
}