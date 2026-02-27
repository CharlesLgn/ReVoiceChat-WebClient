import CoreServer from "../core/core.server.js";

export class AdminSettingsEmoteController {
    constructor() {

    }

    async #load() {
        const response = await CoreServer.fetch(`/emote/global`);

        const oldManager = document.getElementById("server-setting-emotes-form");
        if (oldManager) {
            oldManager.remove();
        }

        const emoji_manager = document.createElement('revoice-emoji-manager');
        emoji_manager.setAttribute('path', `global`);
        emoji_manager.id = "server-setting-emotes-form";
        emoji_manager.innerHTML = `<script type="application/json" slot="emojis-data">${JSON.stringify(response)}</script>`;
        document.getElementById("admin-setting-content-emotes").appendChild(emoji_manager);
    }
}