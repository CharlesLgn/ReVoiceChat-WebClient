let newProfilPictureFile = null;

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