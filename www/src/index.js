let hostUrl = "https://srv.revoicechat.fr";

// Ready state
document.addEventListener('DOMContentLoaded', async function () {
    const { value: inputUrl } = await Swal.fire({
        icon: "question",
        input: "text",
        inputLabel: "Choose your host",
        inputPlaceholder: "Enter the URL",
        inputValue: hostUrl,
        allowOutsideClick: false,
        allowEscapeKey: false
    });
    if (inputUrl) {
        hostUrl = inputUrl;

        let loadingSwal = Swal.fire({
            icon: "info",
            title: `Connecting to \n ${inputUrl}`,
            focusConfirm: false,
            allowOutsideClick: false,
            timerProgressBar: true,
            didOpen: () => {
                Swal.showLoading();
                getServers(loadingSwal);
            }
        })
    }
});

async function getServers(loadingSwal) {
    try {
        fetch(hostUrl + "/server", {
            mode: "no-cors",
            cache: "no-store",
            signal: AbortSignal.timeout(5000),
            headers: {
                'Content-Type': 'application/json'
            },
        }).then((res) => {
            console.log(res);
            res.json();
        }).then((body) => {
            console.log("Server list : ", body);
            loadingSwal.close();
        });

    } catch (error) {
        console.error(`Error while loading server list : ${error.message}`);
        loadingSwal.close();
        Swal.fire({
            title: 'Unable to retrieve server list',
            icon: 'error',
            confirmButtonText: 'OK'
        })
    }
}

async function getRooms(serverId) {
    try {
        const response = await fetch(hostUrl + `/server/${serverId}/room`, {
            cache: "no-cache",
            signal: AbortSignal.timeout(5000)
        });

        console.log(`Room list from server ${serverId}: `, reponse);
    } catch (error) {
        console.error(`Error while loading room list : ${error.message}`);

        Swal.fire({
            title: 'Unable to retrieve server list',
            icon: 'error',
            confirmButtonText: 'OK'
        })
    }
}