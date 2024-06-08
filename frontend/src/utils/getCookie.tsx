export default function getCookie(cookieName: string) {
    const cookies = document.cookie.split(";");

    let returnValue = null;

    cookies.forEach((cookie) => {
        cookie = cookie.trim();
        const [key, value] = cookie.split("=");

        if (key === cookieName) {
            returnValue = value;
            return;
        };
    })

    return returnValue;
}

