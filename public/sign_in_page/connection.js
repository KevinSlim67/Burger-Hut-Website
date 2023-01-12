const message = document.getElementById("message");
const errorColor = "#c30000";
const successColor = "#189c00";


//if user already logged in before, redirect to home page immediately
if (localStorage.getItem('userId') !== null) {
    sessionStorage.setItem('userId', localStorage.getItem('userId'));
    sessionStorage.setItem('firstName', localStorage.getItem('firstName'));
    window.location.replace("/home");
}

//attemps to log user in
function authenticateUser(e) {
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

    fetch(`${url}/users/auth`, {
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

//attemps to create a user account
function registerUser(e) {
    e.preventDefault();

    const data = extractData();
    if (data === null) return;

    fetch(`${url}/users/register`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
        .then((res) => res.json())
        .then((data) => {
            handleRegistrationStatus(data);
        })
        .catch((err) => console.error(err));

    return false;
}

//gets data submitted by Sign Up form
function extractData() {
    const { firstName, lastName, email, password, passwordConfirmation, gender, day, month, year, countryCode, phone, } = document.register;

    if (checkPassword(password.value, passwordConfirmation.value)) {
        return {
            firstName: firstName.value,
            lastName: lastName.value,
            email: email.value,
            password: password.value,
            gender: gender.value,
            dob: generateDate(year.value, month.value, day.value),
            countryCode: countryCode.value,
            phone: phone.value,
        };
    }
    return null;
}

//formats inputed data into format that can be inserted into SQL
function generateDate(y, m, d) {
    const day = parseInt(d);
    const month = getMonth(m);
    const year = parseInt(y);
    const date = `${year}-${month}-${day}`;
    return date;
}

//transforms month string to month number
function getMonth(m) {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August",
        "September", "October", "November", "December"];

    for (let i = 0; i < months.length; i++) {
        if (m === months[i]) return i + 1;
    }
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

//handles errors and success of registration that are a result of server output 
function handleRegistrationStatus(data) {
    switch (data.status) {
        case 'SUCCESS':
            message.innerText = "Account created!";
            message.style.color = successColor;
            //window.location.replace("./../home_page/home.html");
            break;
        case "DUPLICATE":
            message.innerText = "Email already exists!";
            message.style.color = errorColor;
            break;
    }
}

//handles errors and success of authentication that are a result of server output 
function handleAuthenticationStatus(data, rememberMe) {
    const { status, id, firstName, email } = data;
    switch (status) {
        case "FOUND":
            //add user id and name to local storage so they can be used across the website
            if (rememberMe) {
                localStorage.setItem('userId', id);
                localStorage.setItem('firstName', firstName);
                localStorage.setItem('userEmail', email);
            }
            sessionStorage.setItem('userId', id);
            sessionStorage.setItem('firstName', firstName);
            sessionStorage.setItem('userEmail', email);
            sessionStorage.setItem('cart', JSON.stringify([]));
            window.location.replace("/home");
            break;
        case "NOT FOUND":
            message.innerText = "Invalid Credentials!";
            message.style.color = errorColor;
            break;
    }
}