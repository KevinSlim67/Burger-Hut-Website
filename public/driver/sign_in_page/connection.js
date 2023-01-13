const message = document.getElementById("message");
const errorColor = "#c30000";
const successColor = "#189c00";


//if driver already logged in before, redirect to home page immediately
if (localStorage.getItem('driverId') !== null) {
    sessionStorage.setItem('driverId', localStorage.getItem('driverId'));
    window.location.replace("./../orders_page/orders.html");
}

//attemps to log driver in
function authenticateDriver(e) {
    e.preventDefault();

    const data = {
        email: document.login.email.value,
        password: document.login.password.value,
        rememberMe: (() => {
            if (document.querySelector('#rememberMe:checked') !== null) {
                return true;
            }
            return false;
        })()
    };

    fetch(`${url}/drivers/auth`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
        .then((res) => res.json())
        .then((res) => {
            handleAuthenticationStatus(res, data.rememberMe);
        })
        .catch((err) => console.error(err));

    return false;
}

//checks if the password and password confirmation are identical
function checkPassword(password, confirmation) {
    if (password !== confirmation) {
        message.innerText = "Passwords do not match!";
        message.style.color = errorColor;
        return false;
    }
    return true;
}

//handles errors and success of authentication that are a result of server output 
function handleAuthenticationStatus(data, rememberMe) {
    const { status, id, firstName, branchId } = data;
    switch (status) {
        case "FOUND":
            //add user id and name to local storage so they can be used across the website
            if (rememberMe) {
                localStorage.setItem('driverId', id);
                localStorage.setItem('driverName', firstName);
            }
            sessionStorage.setItem('driverId', id);
            sessionStorage.setItem('driverName', firstName);
            sessionStorage.setItem('driverBranch', branchId);
            window.location.replace("/driver/orders");
            break;
        case "NOT FOUND":
            message.innerText = "Invalid Credentials!";
            message.style.color = errorColor;
            popup.setAttribute("status", "error");
            popup.setAttribute("text", `Invalid Credentials!`);
            break;
            break;
    }
}