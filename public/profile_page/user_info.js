const form = document.editProfile;

getUserInfo();

//fill Edit Account Profile info with user's current information
function getUserInfo() {
    fetch(`${url}/users/${userId}`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
    })
        .then((res) => res.json())
        .then((res) => {
            const { first_name, last_name, phone_number, country_code, gender, date_of_birth } = res;
            form.firstName.value = first_name;
            form.lastName.value = last_name;

            const genderRadio = document.getElementById(gender);
            genderRadio.checked = true;

            getDate(date_of_birth);

            form.phone.value = phone_number;
            form.countryCode = country_code;
        })
        .catch((err) => console.error(err));
}

function getDate(date) {
    const arr = date.split('-');
    const month = arr[1];
    form.day.value = parseInt(arr[2].split('T')[0]) + 1;
    form.year.value = arr[0];
    getMonth(month);
}

function updateInfo(e) {
    e.preventDefault();
    const info = retrieveUserInfo();

    fetch(`${url}/users/edit`, {
        method: "PATCH",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ user: info })
    })
        .then((res) => res.json())
        .then((res) => {
            if (res.status === 'SUCCESS') {
                popup.setAttribute('status', 'success');
                popup.setAttribute('text', `Account details were successfully edited.`);
                sessionStorage.setItem('firstName', info.first_name);
                if (localStorage.getItem('firstName') != 'null') {
                    localStorage.setItem('firstName', info.first_name);
                }
                location.reload();
            } else {
                popup.setAttribute('status', 'error');
                popup.setAttribute('text', `Uh oh, it seems there was a problem. If the issue persists, please try again later.`);
                getAddresses();
            }
        })
        .catch((err) => console.error(err));

    return false;
}


function retrieveUserInfo() {
    return {
        id: userId,
        first_name: form.firstName.value,
        last_name: form.lastName.value,
        gender: document.querySelector('input[name="gender"]:checked').value,
        date_of_birth: generateDate(form.year.value, form.month.value, form.day.value),
        country_code: form.countryCode.value,
        phone_number: form.phone.value,
    }
}

//formats inputed data into format that can be inserted into SQL
function generateDate(y, m, d) {
    const day = parseInt(d);
    const month = getMonthNumber(m);
    const year = parseInt(y);
    const date = `${year}-${month}-${day}`;
    return date;
}

//transform month number to month string
function getMonth(m) {
    for (let i = 0; i < months.length; i++) {
        if (i + 1 == m) {
            form.month.value = months[i];
        }
    }
}
//transforms month string to month number
function getMonthNumber(m) {
    for (let i = 0; i < months.length; i++) {
        if (m === months[i]) return i + 1;
    }
}