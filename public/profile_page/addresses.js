getAddresses();

function closeCreateAddress() {
    const body = document.body;
    const div = document.getElementsByClassName('create-form')[0];
    if (div !== undefined) body.removeChild(div);
}

function fetchDistricts() {
    fetch('./../components/account_form/districts.json')
        .then(response => response.json())
        .then(data => {
            const districts = document.getElementById('district');
            for (key in data) {
                const option = document.createElement('option');
                option.value = key;
                option.innerText = key;
                districts.appendChild(option);
            }
            districts.onchange = () => getDistrictCities(districts.value);
            getDistrictCities(districts.value);
        });
}

function getDistrictCities(district) {
    if (district === 'District') return;
    fetch('./../components/account_form/districts.json')
        .then(response => response.json())
        .then(data => {
            const cities = document.getElementById('city');
            cities.innerHTML = '';
            const districts = [...data[district]];
            districts.map(d => {
                const option = document.createElement('option');
                option.value = d;
                option.innerText = d;
                cities.appendChild(option);
            })
        });
}

function addAddress(e) {
    e.preventDefault();
    const address = extractData();
    if (address === null) return;

    fetch(`${url}/addresses/add`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...address, userId: userId }),
    })
        .then((res) => res.json())
        .then((data) => {
            if (data.status !== 'ERROR') {
                popup.setAttribute('status', 'success');
                popup.setAttribute('text', `Address successfully added`);
                getAddresses();
                closeCreateAddress();
            }
        })
        .catch((err) => {
            popup.setAttribute('status', 'error');
            popup.setAttribute('text', `Uh oh, there appears to have been a problem. If the issue persists, try again later.`);
            console.error(err)
        });

    return false;
}

function editAddress(e, id) {
    e.preventDefault();
    const beforeAddress = extractData();
    const address = {};

    //turn keys that are in camel case to snake case so they align with the sql properties
    if (beforeAddress === null) return;
    for (const a in beforeAddress) {
        let newA;
        if (a === 'additionalInfo') {
            newA = 'additional_information';
        } else {
            newA = camelCaseToUnderscore(a);
        }
        address[newA] = beforeAddress[a];
        console.log(a, newA);
    }


    fetch(`${url}/addresses/edit`, {
        method: "PATCH",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ address: address, id: id }),
    })
        .then((res) => res.json())
        .then((data) => {
            if (data.status !== 'ERROR') {
                popup.setAttribute('status', 'success');
                popup.setAttribute('text', `Address successfully edited`);
                getAddresses();
                closeCreateAddress();
            }
        })
        .catch((err) => {
            popup.setAttribute('status', 'error');
            popup.setAttribute('text', `Uh oh, there appears to have been a problem. If the issue persists, try again later.`);
            console.error(err)
        });

    return false;
}

function camelCaseToUnderscore(string) {
    return string.split(/(?=[A-Z])/).map(part => part.toLowerCase()).join('_');
}

//gets data submitted by Sign Up form
function extractData() {
    const { name, district, city, streetName, buildingName, floorNumber, roomNumber, landmark, companyName, additionalInfo } = document.createAddress;
    return {
        name: name.value,
        district: district.value,
        city: city.value,
        streetName: streetName.value,
        buildingName: buildingName.value,
        floorNumber: floorNumber.value,
        roomNumber: roomNumber.value,
        landmark: landmark.value,
        companyName: companyName.value,
        additionalInfo: additionalInfo.value,
    };
}

function createAddressBox(address) {
    const { id, name, district, city, street_name, building_name, floor_number, room_number, company_name, landmark } = address;
    const streetField = street_name !== null ? `, ${street_name}` : '';
    const buildingField = building_name !== null ? `${building_name} Building` : '';
    const floorNumField = floor_number !== null ? `Floor ${floor_number}` : '';
    const roomNumField = room_number !== null ? `Room ${room_number}` : '';
    const companyNameField = company_name !== null ? `At ${company_name}` : '';
    const landmarkField = landmark !== null ? `Near ${landmark}` : '';

    const addressBox = document.createElement('div');
    addressBox.classList.add('address');
    addressBox.setAttribute('id', id);

    addressBox.innerHTML = `
        <h3>${name}</h3>
        <p> ${district} District, ${city} ${streetField} </p>
        <p>${[buildingField, floorNumField, roomNumField].filter(e => e !== '').join(', ')} </p>
        <p>${[companyNameField, landmarkField].filter(e => e !== '').join(' - ')} </p>

        <button class="delete" onclick="deleteAddress(${id})"></button>
        <button id="${`${id}-edit`}" class="edit"></button>
    `;
    return addressBox;
}

//Get all of the user's addresses
function getAddresses() {
    let userId = sessionStorage.getItem('userId');
    return fetch(`${url}/addresses/${userId}`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
    })
        .then((res) => res.json())
        .then((res) => {
            fillAddressBook(res);
        })
        .catch((err) => console.error(err));
}

//fill address book with addresses from user
function fillAddressBook(arr) {
    //empties current food list
    const list = document.getElementById('address-list');
    list.innerHTML = '';

    arr.forEach(e => {
        list.appendChild(createAddressBox(e));
        const id = e.id;
        const editBtn = document.getElementById(`${id}-edit`);
        editBtn.onclick = () => editAddressForm(e, id);
    });
}

function deleteAddress(id) {
    fetch(`${url}/addresses/delete`, {
        method: "DELETE",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: id })
    })
        .then((res) => res.json())
        .then((res) => {
            popup.setAttribute('status', 'success');
            popup.setAttribute('text', `Address successfully deleted`);
            getAddresses();
        })
        .catch((err) => {
            console.error(err);
            popup.setAttribute('status', 'error');
            popup.setAttribute('text', `Uh oh, there appears to have been a problem. If the issue persists, try again later.`);
        });
}

function createAddress() {
    closeCreateAddress();
    const body = document.body;
    const div = document.createElement('div');
    div.classList.add('create-form');

    div.innerHTML = `
            <form class="account-form" name="createAddress" onsubmit="addAddress(event)">
                <div class="shape1"></div>
                <div class="shape2"></div>
                <button class="exit" onclick="closeCreateAddress()"></button>
                <h2 class="title">Create New Address</h2>

                <div class="input-box">
                    <input class="style1" type="text" name="name" id="name" placeholder=" "/>
                    <span>Address Name</span>
                </div>

                <div class="double-field">
                    <select name="district" id="district" required>
                        <option disabled selected>District</option>
                    </select>

                    <select name="city" id="city" required>
                        <option disabled selected>City</option>
                    </select>
                </div>

                <div class="double-field">
                    <div class="input-box">
                        <input class="style1" type="text" name="streetName" id="streetName" placeholder=" " required/>
                        <span>Street Name</span>
                    </div>

                    <div class="input-box">
                        <input class="style1" type="text" name="buildingName" id="buildingName" placeholder=" " required/>
                        <span>Building Name</span>
                    </div>
                </div>

                <div class="double-field">
                    <div class="input-box">
                        <input class="style1" type="number" name="floorNumber" id="floorNumber" placeholder=" " required/>
                        <span>Floor Number</span>
                    </div>

                    <div class="input-box">
                        <input class="style1" type="text" name="roomNumber" id="roomNumber" placeholder=" "/>
                        <span>Room Number</span>
                    </div>
                </div>

                <div class="double-field">
                    <div class="input-box">
                        <input class="style1" type="text" name="landmark" id="landmark" placeholder=" "/>
                        <span>Landmark</span>
                    </div>

                    <div class="input-box">
                        <input class="style1" type="text" name="companyName" id="companyName" placeholder=" "/>
                        <span>Company Name</span>
                    </div>
                </div>

                <div class="input-box">
                    <textarea class="style1" type="text" name="additionalInfo" id="additionalInfo" placeholder=" "></textarea>
                    <span>Additional Information</span>
                </div>

                <input type="submit" class="type1 full submit" value="Submit Address">
            </form>  
    `;

    body.append(div);
    fetchDistricts();
}

function editAddressForm(address, id) {
    closeCreateAddress();
    const body = document.body;
    const div = document.createElement('div');
    div.classList.add('create-form');

    const oldFields = [
        address['name'], address['district'], address['city'], address['street_name'],
        address['building_name'], address['floor_number'], address['room_number'],
        address['landmark'], address['company_name'], address['additional_information']
    ];

    const fields = oldFields.map(f => {
        if (f == null) return '';
        return f;
    });

    div.innerHTML = `
            <form class="account-form" name="createAddress" onsubmit="editAddress(event, ${id})">
                <div class="shape1"></div>
                <div class="shape2"></div>
                <button class="exit" onclick="closeCreateAddress()"></button>
                <h2>Edit your Address</h2>

                <div class="input-box">
                    <input class="style1" type="text" name="name" id="name" placeholder=" " value="${fields[0]}"/>
                    <span>Address Name</span>
                </div>

                <div class="double-field">
                    <select name="district" id="district" required>
                        <option disabled>District</option>
                    </select>

                    <select name="city" id="city" required>
                        <option disabled>City</option>
                    </select>
                </div>

                <div class="double-field">
                    <div class="input-box">
                        <input class="style1" type="text" name="streetName" id="streetName" placeholder=" " value="${fields[3]}" required/>
                        <span>Street Name</span>
                    </div>

                    <div class="input-box">
                        <input class="style1" type="text" name="buildingName" id="buildingName" placeholder=" " value="${fields[4]}" required/>
                        <span>Building Name</span>
                    </div>
                </div>

                <div class="double-field">
                    <div class="input-box">
                        <input class="style1" type="number" name="floorNumber" id="floorNumber" placeholder=" " value="${fields[5]}" required/>
                        <span>Floor Number</span>
                    </div>

                    <div class="input-box">
                        <input class="style1" type="text" name="roomNumber" id="roomNumber" placeholder=" " value="${fields[6]}"/>
                        <span>Room Number</span>
                    </div>
                </div>

                <div class="double-field">
                    <div class="input-box">
                        <input class="style1" type="text" name="landmark" id="landmark" placeholder=" " value="${fields[7]}"/>
                        <span>Landmark</span>
                    </div>

                    <div class="input-box">
                        <input class="style1" type="text" name="companyName" id="companyName" placeholder=" " value="${fields[8]}"/>
                        <span>Company Name</span>
                    </div>
                </div>

                <div class="input-box">
                    <textarea class="style1" type="text" name="additionalInfo" id="additionalInfo" placeholder=" ">${fields[9]}</textarea>
                    <span>Additional Information</span>
                </div>

                <input type="submit" class="type1 full submit" value="Edit Address">
            </form>  
    `;

    body.append(div);
    fetchDistricts();
    setTimeout(() => {
        document.getElementById('district').value = fields[1];
        getDistrictCities(fields[1]);
        setTimeout(() => {
            document.getElementById('city').value = fields[2];
        }, 1000);
    }, 1000);
}