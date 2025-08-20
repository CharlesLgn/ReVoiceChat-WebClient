const currentConfig = {
    active: null,
}

document.addEventListener('DOMContentLoaded', function () {
    selectConfigItem("overview");
});

function selectConfigItem(name){
    if(currentConfig.active !== null){
        document.getElementById(currentConfig.active).classList.remove("active");
    }

    currentConfig.active = name;
    document.getElementById(name).classList.add('active');
}