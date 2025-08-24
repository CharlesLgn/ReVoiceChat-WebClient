const currentSetting = {
    active: null,
}

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('config-user-name').value = current.user.displayName;
    document.getElementById("config-user-theme").value = localStorage.getItem("Theme");
    selectSettingItem("overview");
});

document.getRootNode().addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        document.location.href = "app.html";
    }
});

function selectSettingItem(name) {
    if (currentSetting.active !== null) {
        document.getElementById(currentSetting.active).classList.remove("active");
        document.getElementById(`${currentSetting.active}-config`).classList.add("hidden");
    }

    currentSetting.active = name;
    document.getElementById(name).classList.add('active');
    document.getElementById(`${name}-config`).classList.remove('hidden');

}

function changeTheme(theme) {
    localStorage.setItem("Theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
}

async function updateDisplayName(input) {
    const displayName = input.value;

    if (displayName === "" || displayName === null || displayName === undefined) {
        console.error("Display name is incorrect");
        return;
    }

    const result = await patchRequestOnCore(`/user/me`, { displayName: displayName });

    if (result) {
        document.getElementById('config-user-name').value = result.displayName;
        current.user.displayName = result.displayName
    }
}