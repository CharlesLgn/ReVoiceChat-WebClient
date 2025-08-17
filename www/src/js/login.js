let host = null;

function userLogin() {
    const FORM = document.getElementById("login-form");
    const LOGIN = {
        'username': FORM.username.value,
        'password': FORM.password.value,
    };

    host = FORM.host.value;
    login(LOGIN);
}

async function login(loginData) {
    try {
        const response = await fetch(`${host}/login`, {
            cache: "no-store",
            signal: AbortSignal.timeout(5000),
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify(loginData),
        });

        const result = await response.ok;
        sessionStorage.setItem('host', host);
        document.location.href = `app.html`;
    }
    catch (error) {
        console.error("Error while login : ", error);
        Swal.fire({
            icon: "error",
            title: `Unable to connect to\n ${host}`,
            focusConfirm: false,
            allowOutsideClick: false,
            animation: false,
        })
    }
}