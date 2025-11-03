const currentSetting = {
    active: null,
    password: {
        password: '',
        newPassword: '',
        confirmPassword: '',
    },
    voiceAdvanced: false,
}

let newProfilPictureFile = null;

function settingLoad() {
    document.getElementById("setting-user-uuid").innerText = RVC.user.id;
    document.getElementById("setting-user-name").value = RVC.user.displayName;
    document.getElementById("setting-user-picture").src = `${RVC.mediaUrl}/profiles/${RVC.user.id}`;
    settingThemeShow();
    settingEmoteShow();
    RVC.user.settings.updateUI();
    selectSettingItem("overview");

    const settingUserPictureNewPath = document.getElementById("setting-user-picture-new-path");
    const settingUserPictureNewFile = document.getElementById("setting-user-picture-new-file");
    const settingUserPicture = document.getElementById("setting-user-picture");
    newProfilPictureFile = null
    settingUserPictureNewFile.addEventListener("change", () => {
        const file = settingUserPictureNewFile.files[0];
        if (file) {
            newProfilPictureFile = file;
            settingUserPictureNewPath.value = file.name;
            settingUserPicture.src = URL.createObjectURL(file);
            settingUserPicture.style.display = "block";
        }
    });

}

function settingThemeShow() {
    const themeForm = document.getElementById("setting-themes-form");
    let html = "";
    for (const theme of getAllDeclaredDataThemes()) {
        html += `<button style="padding: 0" class="theme-select-button" type="button" onclick="changeTheme('${theme}')">
                     <revoice-theme-preview theme="${theme}"></revoice-theme-preview>
                 </button>`;
    }
    themeForm.innerHTML = html;
}

function settingEmoteShow() {
    RVC.fetcher.fetchCore(`/emote/me`).then(response => {
        const emoteForm = document.getElementById("setting-emotes-form");
        emoteForm.innerHTML = `
            <script type="application/json" slot="emojis-data">
                ${JSON.stringify(response)}
            </script>`;
    });
}

function selectSettingItem(name) {
    if (currentSetting.active !== null) {
        document.getElementById(`setting-tab-${currentSetting.active}`).classList.remove("active");
        document.getElementById(`setting-content-${currentSetting.active}`).classList.add("hidden");
    }

    currentSetting.active = name;
    document.getElementById(`setting-tab-${name}`).classList.add('active');
    document.getElementById(`setting-content-${name}`).classList.remove('hidden');
}

function changeTheme(theme) {
    localStorage.setItem("Theme", theme);
    for (const elt of document.querySelectorAll("revoice-message")) {
        elt.dataset.theme = theme;
    }
    document.documentElement.dataset.theme = theme;
    for (const elt of document.querySelectorAll(`revoice-theme-preview`)) {
        elt.parentElement.disabled = false
    }
    document.querySelector(`revoice-theme-preview[theme="${theme}"]`).parentElement.disabled = true;
}

function settingPassword() {
    Swal.fire({
        title: `Change password`,
        animation: false,
        customClass: SwalCustomClass,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: "Change",
        allowOutsideClick: false,
        html: `
            <form class='popup'>
                <label>Current password</label>
                <input type='password' oninput='currentSetting.password.password=this.value'>
                <br/>
                <br/>
                <label>New password</label>
                <input type='password' oninput='currentSetting.password.newPassword=this.value'>
                <br/>
                <br/>
                <label>Confirm password</label>
                <input type='password' oninput='currentSetting.password.confirmPassword=this.value'>
            </form>       
        `,
    }).then(async (result) => {
        if (result.value) {
            await RVC.fetcher.fetchCore(`/user/me`, 'PATCH', { password: currentSetting.password });

        }
    });
}

async function saveSetting() {
    const spinner = new SpinnerOnButton("save-setting-button")
    spinner.run()
    await settingProfilePicture();
    const settingUserName = document.getElementById("setting-user-name");
    await settingDisplayName(settingUserName.value);
    spinner.success()
}

async function settingDisplayName(displayName) {
    if (displayName === "" || displayName === null || displayName === undefined) {
        Swal.fire({
            icon: 'error',
            title: `Display name invalid`,
            animation: false,
            customClass: SwalCustomClass,
            showCancelButton: false,
            confirmButtonText: "OK",
            allowOutsideClick: false,
        });
        return;
    }
    const result = await RVC.fetcher.fetchCore(`/user/me`, 'PATCH', { displayName: displayName });
    if (result) {
        RVC.user.displayName = result.displayName
        document.getElementById('setting-user-name').value = result.displayName;
    }
}

async function settingProfilePicture() {
    const settingUserPictureNewPath = document.getElementById("setting-user-picture-new-path");
    if (settingUserPictureNewPath.value && newProfilPictureFile) {
        const formData = new FormData();
        formData.append("file", newProfilPictureFile);
        await fetch(`${RVC.mediaUrl}/profiles/${RVC.user.id}`, {
            method: "POST",
            signal: AbortSignal.timeout(5000),
            headers: {
                'Authorization': `Bearer ${RVC.getToken()}`
            },
            body: formData
        });
        newProfilPictureFile = null
        settingUserPictureNewPath.value = null
    }
}

function uploadNewProfilePicture() {
    const fileInput = document.getElementById("setting-user-picture-new-file");
    fileInput.click();
}

function settingVoiceMode() {
    currentSetting.voiceAdvanced = !currentSetting.voiceAdvanced;

    const button = document.getElementById("voice-mode");
    if (currentSetting.voiceAdvanced) {
        button.innerText = "Simple";
        document.getElementById('voice-sensitivity').innerText = "Noise gate";
        document.getElementById('noise-gate-threshold-label').innerText = `Threshold : ${RVC.user.settings.voice.gate.threshold}dB`;
        document.getElementById('voice-default-all').classList.add("hidden");
    } else {
        button.innerText = "Advanced";
        document.getElementById('voice-sensitivity').innerText = "Voice detection";
        document.getElementById('noise-gate-threshold-label').innerText = `Sensitivity ${RVC.user.settings.voice.gate.threshold}dB`;
        document.getElementById('voice-default-all').classList.remove("hidden");
    }

    const toggleable = document.getElementsByClassName('voice-toggleable');
    for (element of toggleable) {
        if (currentSetting.voiceAdvanced) {
            element.classList.remove('hidden');
        } else {
            element.classList.add('hidden');
        }
    }
}
