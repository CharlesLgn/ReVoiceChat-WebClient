import Alert from './utils/alert.js';
import Swal from '../lib/sweetalert2.esm.all.min.js';
import { sanitizeString, SwalCustomClass, timestampToText, humanFileSize } from "../lib/tools.js";
import { i18n } from "../lib/i18n.js";
import MediaServer from "./media/media.server.js";
import CoreServer from "./core/core.server.js";

export default class TextController {
    static MODE_SEND = 0;
    static MODE_EDIT = 1;

    mode = 0;

    /** @type {UserController} */
    #user;
    /** @type {Room} */
    #room;
    /** @type {string|null} */
    #editId;
    #attachmentMaxSize = 0;
    #page = 1;
    #totalPages = 1;

    /**
     * @param {UserController} user
     * @param {Room} room
     */
    constructor(user, room) {
        this.#user = user;
        this.#room = room;
        this.#getAttachmentMaxSize();
    }

    attachEvents() {
        const textInput = document.getElementById("text-input");
        textInput.addEventListener('keydown', async (event) => await this.#eventHandler(event));
        textInput.addEventListener('oninput', () => this.oninput(textInput));
        textInput.addEventListener('paste', (event) => this.#pasteHandler(event));

        document.getElementById("attachment-button-add").addEventListener('click', () => this.#addAttachment());
        document.getElementById("attachment-button-remove").addEventListener('click', () => this.#removeAttachment());

        const textContent = document.getElementById("text-content")
        textContent.addEventListener("scroll", (event) => { this.#loadMore(textContent) });
    }

    async #eventHandler(event) {
        if (event.key === 'Enter') {
            if (event.shiftKey) {
                return;
            }
            event.preventDefault();
            await this.send();
            return;
        }

        if (event.key === 'Escape') {
            document.getElementById("text-input").value = "";
            this.mode = TextController.MODE_SEND;
        }
    }

    async #loadMore(element) {
        if (element.scrollTop === 0 && this.#page !== this.#totalPages) {
            let lastScrollHeight = element.scrollHeight;

            /** @type {PageResult<MessageRepresentation>} */
            const result = await CoreServer.fetch(`/room/${this.#room.id}/message?page=${this.#page}`, 'GET');
            if (result !== null) {
                this.#page = Math.min(result.pageNumber + 1, result.totalPages);

                const ROOM = document.getElementById("text-content");
    
                const invertedSortedResult = [...result.content].sort((a, b) => {
                    return new Date(a.createdDate) + new Date(b.createdDate);
                });

                for (const message of invertedSortedResult) {
                    ROOM.prepend(this.#create(message));
                }

                element.scrollTop = element.scrollHeight - lastScrollHeight;
            }
        }
    }

    async getLatestFrom(roomId) {
        /** @type {PageResult<MessageRepresentation>} */
        const result = await CoreServer.fetch(`/room/${roomId}/message`, 'GET');

        if (result !== null) {
            const ROOM = document.getElementById("text-content");

            const sortedResult = [...result.content].sort((a, b) => {
                return new Date(a.createdDate) - new Date(b.createdDate);
            });

            ROOM.innerHTML = "";
            for (const message of sortedResult) {
                ROOM.appendChild(this.#create(message));
            }

            ROOM.scrollTop = ROOM.scrollHeight;
            this.#totalPages = result.totalPages;
        }
    }

    /** @param {MessageNotification} data */
    message(data) {
        if (data.action === "ADD" && this.#user.id != data.message.user.id) {
            Alert.play('messageNew');
        }

        if (data.message.roomId !== this.#room.id) {
            return;
        }

        const message = data.message;
        const room = document.getElementById("text-content");
        switch (data.action) {
            case "ADD":
                room.appendChild(this.#create(message));
                break;
            case "MODIFY":
                document.getElementById(message.id).replaceWith(this.#createContent(message));
                document.getElementById(`header-message-${message.id}`).replaceWith(this.#createHeader(message));
                break;
            case "REMOVE":
                document.getElementById(`container-${message.id}`).remove();
                break;
            default:
                console.error("Unsupported action : ", data.action);
                break;
        }

        room.scrollTop = room.scrollHeight;
    }

    #addAttachment() {
        const fileInput = document.getElementById("text-attachment");
        fileInput.click();
        document.getElementById("text-attachment-div").classList.remove('hidden');
        document.getElementById("text-input").focus()
    }

    #removeAttachment() {
        const fileInput = document.getElementById("text-attachment");
        fileInput.value = "";
        document.getElementById("text-attachment-div").classList.add('hidden');
        document.getElementById("text-input").focus()
    }

    #addFileToInput(file) {
        const fileInput = document.getElementById("text-attachment");
        const dataTransfer = new DataTransfer();

        // Keep existing files
        for (const existingFile of fileInput.files) {
            dataTransfer.items.add(existingFile);
        }

        // Add new file
        dataTransfer.items.add(file);

        fileInput.files = dataTransfer.files;
    }

    #pasteHandler(event) {
        const items = event.clipboardData?.items;
        if (!items) return;

        let hasFile = false
        for (const item of items) {
            // Handle images or files
            if (item.kind === "file") {
                const file = item.getAsFile();
                if (file) {
                    this.#addFileToInput(file);
                    hasFile = true;
                }
            }
        }

        // Prevent default paste if files were detected
        if (hasFile) {
            document.getElementById("text-attachment-div").classList.remove('hidden');
            event.preventDefault();
        }
    }

    async send() {
        let result = null;

        const attachments_input = document.getElementById("text-attachment");
        let textInput = sanitizeString(document.getElementById('text-input').value);

        if ((textInput == "" || textInput == null) && !attachments_input) {
            return;
        }

        const data = {
            text: textInput,
            medias: []
        }

        // Attachments
        const attachments = [];
        if (attachments_input && this.mode === TextController.MODE_SEND) {
            for (const element of attachments_input.files) {
                if (element.size < this.#attachmentMaxSize) {
                    data.medias.push({ name: element.name });
                    attachments[element.name] = element;
                }
                else {
                    await Swal.fire({
                        icon: "error",
                        title: i18n.translateOne("attachement.error.size.title"),
                        html: i18n.translateOne("attachement.error.size.body", [element.name, humanFileSize(this.#attachmentMaxSize), humanFileSize(element.size)]),
                        animation: true,
                        customClass: {
                            title: "swalTitle",
                            popup: "swalPopup",
                            confirmButton: "swalConfirm",
                        },
                        showCancelButton: false,
                        focusConfirm: false,
                        confirmButtonText: "OK",
                    });
                    return;
                }
            }
        }

        switch (this.mode) {
            case TextController.MODE_SEND:
                result = await CoreServer.fetch(`/room/${this.#room.id}/message`, 'PUT', data);
                break;

            case TextController.MODE_EDIT:
                result = await CoreServer.fetch(`/message/${this.#editId}`, 'PATCH', data);
                break;

            default:
                console.error('Invalid mode');
                break;
        }

        if (result) {

            // Send attachments
            if (this.mode === TextController.MODE_SEND) {
                for (const media of result.medias) {
                    const formData = new FormData();
                    formData.append("file", attachments[media.name]);
                    await MediaServer.fetch(`/attachments/${media.id}`, 'POST', formData, false);
                }
            }

            // Clean file input
            this.#removeAttachment();

            // Clean text input
            const textarea = document.getElementById("text-input");
            textarea.value = "";
            textarea.style.height = "auto";

            // Default mode
            this.mode = TextController.MODE_SEND;
            this.#editId = null;
            return;
        }

        Swal.fire({
            icon: 'error',
            title: i18n.translateOne("attachement.error.title"),
            text: i18n.translateOne("attachement.error.body"),
            animation: false,
            customClass: SwalCustomClass,
            showCancelButton: false,
            confirmButtonText: "OK",
            allowOutsideClick: false,
        });
    }

    oninput(input) {
        input.style.height = "auto";
        input.style.height = input.scrollHeight + "px";
        if (input.value == "") {
            this.mode = TextController.MODE_SEND;
            this.#editId = null;
        }
    }

    /** @param {MessageRepresentation} messageData */
    #create(messageData) {
        const CONTAINER = document.createElement('div');
        CONTAINER.className = `message-container-message`;
        CONTAINER.appendChild(this.#createHeader(messageData));
        CONTAINER.appendChild(this.#createContent(messageData));
        const MESSAGE = document.createElement('div');
        MESSAGE.id = `container-${messageData.id}`;
        MESSAGE.className = "message-container";
        if (RVC.userSettings().messageSetting.showPicture) {
            this.#addPicture(messageData, MESSAGE);
        }
        MESSAGE.appendChild(CONTAINER);
        return MESSAGE;
    }

    #createHeader(messageData) {
        const header = document.createElement('div');
        header.className = "message-header";
        header.id = `header-message-${messageData.id}`;
        const title = document.createElement('h3')
        title.className = "message-owner"
        title.innerHTML = `<span>${messageData.user.displayName}</span>
                           <span class="message-timestamp">${timestampToText(messageData.createdDate)}</span>
                           ${messageData.updatedDate ? '<span class="message-timestamp" data-i18n="message.edit">(edit)</span>' : ''}`;
        header.appendChild(title);
        const CONTEXT_MENU = this.#createContextMenu(messageData)
        if (CONTEXT_MENU) {
            header.appendChild(CONTEXT_MENU);
        }
        i18n.translatePage(header);
        return header
    }

    #addPicture(messageData, MESSAGE) {
        const picture = document.createElement('img');
        picture.src = MediaServer.profiles(messageData.user.id);
        picture.alt = "PFP"
        picture.className = "icon ring-2"
        picture.name = `user-picture-${messageData.user.id}`
        MESSAGE.appendChild(picture);
    }

    /** @param {MessageRepresentation} messageData */
    #createContent(messageData) {
        const CONTENT = document.createElement('revoice-message');
        CONTENT.id = messageData.id;
        CONTENT.innerHTML = `
            <script type="application/json" slot="medias">
                ${JSON.stringify(messageData.medias)}
            </script>
            <script type="text/markdown" slot="content">
                ${messageData.text}
            </script>
            <script type="application/json" slot="emotes">
                ${JSON.stringify(messageData.emotes)}
            </script>
        `;
        return CONTENT;
    }

    async #edit(id) {
        const result = await CoreServer.fetch(`/message/${id}`, 'GET');

        if (result) {
            const textarea = document.getElementById("text-input");
            textarea.value = result.text;
            textarea.style.height = "auto";
            textarea.style.height = textarea.scrollHeight + "px";
            this.mode = TextController.MODE_EDIT;
            this.#editId = id;
            document.getElementById("text-input").focus();
        }
    }

    async #delete(id) {
        await CoreServer.fetch(`/message/${id}`, 'DELETE');
    }

    /**
     * @param {MessageRepresentation} messageData
     * @return {HTMLElement|null}
     */
    #createContextMenu(messageData) {
        if (messageData.user.id != this.#user.id) {
            return null;
        }

        const DIV = document.createElement('div');
        DIV.className = "message-context-menu";

        const EDIT = document.createElement('div');
        EDIT.className = "icon";
        EDIT.innerHTML = "<revoice-icon-pencil></revoice-icon-pencil>";
        EDIT.onclick = () => this.#edit(messageData.id);

        const DELETE = document.createElement('div');
        DELETE.className = "icon";
        DELETE.innerHTML = "<revoice-icon-trash></revoice-icon-trash>";
        DELETE.onclick = () => this.#delete(messageData.id);

        DIV.appendChild(EDIT);
        DIV.appendChild(DELETE);

        return DIV
    }

    async #getAttachmentMaxSize() {
        /** @type {MediaSettings} */
        const response = await MediaServer.fetch('/maxfilesize');
        if (response) {
            this.#attachmentMaxSize = response.maxFileSize;
        }
    }
}