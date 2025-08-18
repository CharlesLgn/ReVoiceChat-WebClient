async function getUsername() {
    try {
        const response = await fetch(`${current.host}/user/me`, {
            cache: "no-store",
            signal: AbortSignal.timeout(5000),
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        const result = await response.json();
        document.getElementById("user-name").innerText = result.username;
    }
    catch (error) {
        console.error("Error while retrieving username : ", error);
    }
}