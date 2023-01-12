getOrders();

//Get the 10 latest user's orders
function getOrders() {
    fetch(`${url}/orders/${userId}`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
    })
        .then((res) => res.json())
        .then((res) => {
            fillOrderList(res);
        })
        .catch((err) => console.error(err));
}

//fill order list with orders from user
function fillOrderList(arr) {
    //empties current food list
    const list = document.getElementById('order-list');
    list.innerHTML = '';

    if (arr.length === 0) {
        list.innerHTML = `
        <p class="title"> There doesn't seem to be any orders at the present time</p>
        `;
    }

    arr.forEach(e => {
        list.appendChild(createOrderBox(e));
    });
}

//create a box where you can see a user's previous or ongoing order
function createOrderBox(order) {
    const { id, status, ordered_date, total_price, phone_number, driver_id, first_name, last_name, delivered_date, city } = order;

    const deliveredDateField = formatDate(delivered_date);
    const orderedDateField = formatDate(ordered_date);

    let driverField = '';
    if (driver_id !== null) {
        driverField = `<li><img src="./../assets/icons/order_person.png" alt="">${first_name + ' ' + last_name}</li>`;
    }

    const orderBox = document.createElement('div');
    orderBox.classList.add('order');
    orderBox.setAttribute('id', id);
    orderBox.innerHTML = `
    <div>
        <h2>Order ID: ${id}</h2>
        <span class="status ${status}">${status}</span>
    </div>
    <div class="info">
        <ul>
            ${orderedDateField}
            ${deliveredDateField}
            <li><img src="./../assets/icons/order_address.png" alt="">Home</li>
        </ul>
        <ul>
            <li><img src="./../assets/icons/order_phone.png" alt="">${phone_number}</li>
            <li><img src="./../assets/icons/order_branch.png" alt="">${city}</li>
            ${driverField}
        </ul>
    </div>
    <hr />
    <p id=${`${id}-food`}>${getFood(id)}</p>
    <div>
        <span class="price">$${total_price}</span>
        <button class="re-order" onclick="reorder()">
            <img src="./../assets/icons/refresh.png" />Re-Order
        </button>
    </div>
    `;

    return orderBox;
}

function getFood(orderId) {
    fetch(`${url}/orders/food/${orderId}`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
    })
        .then((res) => res.json())
        .then((res) => {
            const list = res.map(e => `${e.amount} ${e.name}`).join(' - ');
            const order = document.getElementById(`${orderId}-food`);
            order.innerText = list;
        })
        .catch((err) => console.error(err));
}

function formatDate(date) {
    let dateHTML = '';
    if (date !== null) {
        const newDate = date.substring(0, date.indexOf('.')).replace('T', ' ');
        dateHTML = `<li><img src="./../assets/icons/order_date.png" alt="">${newDate}</li>`;
    }
    return dateHTML;
}

function reorder() {
    popup.setAttribute('status', 'error');
    popup.setAttribute('text', `Sorry, this feature has not been implemented yet!`);
}