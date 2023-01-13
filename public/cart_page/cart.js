let avgCookTime = 0;

getCartItems();
getAddresses();

//fetches food items in user's cart
function getCartItems() {
    const cart = JSON.parse(sessionStorage.getItem('cart'));
    fillCartItems(cart);
}

//fill items that user has in their cart
function fillCartItems(items) {
    const list = document.getElementById('cart-items');
    list.innerHTML = '';

    const total = document.getElementById('totalCost');
    const afterTax = document.getElementById('afterTax');
    const deliveryCharge = parseInt(document.getElementById('deliveryCharge').innerText.replace('$', ''));
    const totalSum = document.getElementById('totalSum')

    totalPrice = items.reduce((acc, current) => acc + current.price * current.amount, 0);
    total.innerText = `$${totalPrice}`;
    const totalAfterTax = totalPrice + (totalPrice * 0.1);
    afterTax.innerText = `$${totalAfterTax}`;
    totalSum.innerText = `$${totalAfterTax + deliveryCharge}`;

    const totalTime = items.reduce((acc, current) => acc + current.cooktime, 0);
    const amount = items.reduce((acc, current) => acc + current.amount, 0);
    avgCookTime = (totalTime / amount) + 15;

    const header = document.createElement('div');
    header.classList.add('header');
    header.innerHTML = `
    <span>${amount} item(s)</span>
    <span class="price"">$${totalPrice}</span>
    `

    list.appendChild(header);
    items.map(e => {
        list.appendChild(createItem(e));
    });
}

//create cart item
function createItem(item) {
    const { id, name, image, price, amount, cooktime } = item;
    const container = document.createElement('div');
    container.classList.add('item');
    container.setAttribute('id', id);

    let cookSpan = '';
    if (cooktime !== null) cookSpan = `<span class="cooktime">${cooktime}m <img src="./../assets/icons/clock.png" alt=""></span>`;


    container.innerHTML = `
        <div class="img-container"><img src="data:image/png;base64, ${image}"></div>
        <div class="info">
            <h3>${name} (x${amount})</h3>
            <div id="${id}-ingredients"</div>
            <span class="price">$${price * amount}</span>
            ${cookSpan}
            <div class="delete">
                <button onclick="removeOne(${id})" class="remove-one" title="Remove One"></button>
                <button onclick="removeAll(${id})" class="remove-all" title="Remove All"></button>
            </div>
        </div>
    `;
    fillIngredients(id);
    return container;
}

//get ingredients of food, and fill a list of them
function fillIngredients(foodId) {
    fetch(`${url}/foods/${foodId}/ingredients`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
    })
        .then((res) => res.json())
        .then((res) => {
            //create ul element, then fill it with li's containing every ingredient
            const ul = document.createElement('ul');
            res.map(i => {
                i = i[0].toUpperCase() + i.substring(1); //capitalize first letter
                const li = document.createElement('li');
                li.textContent = i;
                ul.appendChild(li);
            })
            const item = document.getElementById(`${foodId}-ingredients`);
            item.appendChild(ul);
        })
        .catch((err) => console.error(err));
}


function removeOne(foodId) {
    const cart = JSON.parse(sessionStorage.getItem('cart'));
    let below0 = false;
    cart.forEach(i => {
        if (i.id === foodId) {
            i.amount = i.amount - 1;
            if (i.amount <= 0) {
                removeAll(foodId);
                below0 = true;
                return;
            }
        }
    });
    if (!below0) {
        sessionStorage.setItem('cart', JSON.stringify(cart));
        fillCartItems(cart);
    }
}

function removeAll(foodId) {
    const cart = JSON.parse(sessionStorage.getItem('cart'));
    const newCart = cart.filter(i => i.id !== foodId);
    sessionStorage.setItem('cart', JSON.stringify(newCart));
    fillCartItems(newCart);
}

function getAddresses() {
    const list = document.getElementById('address-list');
    list.innerHTML = '<spinner-component></spinner-component>';

    const spinner = document.querySelector('spinner-component');
    spinner.setDisplayBlock();

    fetch(`${url}/addresses/${userId}`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
    })
        .then((res) => res.json())
        .then((res) => {
            fillAddressList(res);
        })
        .catch((err) => console.error(err));
}

function createAddressBox(address) {
    const { name, district, city, street_name, id } = address;
    const box = document.createElement('div');
    box.classList.add('address');
    box.innerHTML = `
        <h3>${name}</h3>
        <p> ${district} District, ${city}, ${street_name} </p>
        <input type="radio" name="address" value="${id}">
    `;
    return box;
}

function fillAddressList(addresses) {
    const list = document.getElementById('address-list');
    list.innerHTML = '';
    addresses.forEach(e => {
        list.appendChild(createAddressBox(e));
    })
}

//create order containing all user's info
function order(e) {
    e.preventDefault();

    let address = document.querySelector('input[name="address"]:checked');
    if (address !== null) address = parseInt(address.value);

    let branch = document.getElementById('branch').value;
    if (branch !== 'null') branch = parseInt(branch);

    const code = document.getElementById('country-code').value;
    const phone = document.getElementById('phone').value;
    const phoneNumber = `${code}-${phone}`;
    let specialInstructions = document.getElementById('specialInstructions').value;
    if (specialInstructions === '') specialInstructions = null;

    const date = new Date();
    const od = getSeparatedDate(date);
    const orderId = `${userId}${od.year}${od.month}${od.day}${od.hour}${od.minute}`;

    const totalPrice = parseFloat(document.getElementById('totalSum').innerText.replace('$', ''));
    const captcha = document.getElementById('g-recaptcha-response').value;

    if (!validateOrder(address, phone, branch)) return false;

    fetch(`${url}/orders/add`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            id: orderId,
            userId: userId,
            branchId: branch,
            addressId: address,
            phoneNumber: phoneNumber,
            totalPrice: totalPrice,
            estimatedTime: avgCookTime,
            orderedDate: `${od.year}-${od.month}-${od.day} ${od.hour}:${od.minute}:${od.second}`,
            specialInstructions: specialInstructions,
            captcha: captcha
        })
    })
        .then((res) => res.json())
        .then((res) => {
            if (res.status === 'FAILED') {
                popup.setAttribute('status', 'error');
                popup.setAttribute('text', `Uh oh, it seems the captcha verification wasn't completed.`);
            } else {
                addItemsToOrder({
                    orderId: orderId,
                    firstName: sessionStorage.getItem('firstName'),
                    phone: phoneNumber,
                    price: totalPrice
                });
            }
        })
        .catch((err) => {
            console.error(err);
            popup.setAttribute('status', 'error');
            popup.setAttribute('text', `Uh oh, there appears to have been a problem. If the issue persists, try again later.`);
        });

    return false;
}

//add food items to the order that was just sent
function addItemsToOrder(orderDetails) {
    const { orderId, firstName, phone, price } = orderDetails;
    const cart = JSON.parse(sessionStorage.getItem('cart')).map(e => {
        return { id: e.id, amount: e.amount };
    });

    fetch(`${url}/orders/add-food`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            orderId: orderId,
            cart: cart,
            email: sessionStorage.getItem('userEmail')
        })
    })
        .then((res) => res.json())
        .then((res) => {
            popup.setAttribute('status', 'success');
            popup.setAttribute('text', `Order successfully sent ! Go to order history section to track your order.`);
            sessionStorage.setItem('cart', '[]');
            window.location.href = '/order-history';
        })
        .catch((err) => {
            popup.setAttribute('status', 'error');
            popup.setAttribute('text', `Uh oh, there appears to have been a problem. If the issue persists, try again later.`);
            console.error(err);
            return false;
        });
}

function validateOrder(address, phone, branch) {
    let field = '';
    if (!address) field = 'address'
    else if (!phone) field = 'phone'
    else if (!branch || branch === 'null') field = 'branch'
    else return true;

    popup.setAttribute('status', 'error');
    popup.setAttribute('text', `You need to fill in the ${field} field`);
    return false;
}

function getSeparatedDate(date) {
    return {
        day: date.getDate(),
        month: date.getMonth() + 1,
        year: date.getFullYear(),
        hour: date.getHours(),
        minute: date.getMinutes(),
        second: date.getSeconds()
    }
}