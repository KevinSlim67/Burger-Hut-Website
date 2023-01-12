getOrders(driverId);

//Get the latest non-delivered orders
function getOrders(driverId) {
    fetch(`${url}/orders/${driverId}/InTransit`, {
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
    const list = document.getElementById('orders-list');
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

//create a box where you can see an order that is not yet delivered
function createOrderBox(order) {
    const { id, ordered_date, total_price, phone_number, branch, first_name, last_name } = order;
    let additionalInformation = '';
    let additional_information = order.additional_information;
    if (additional_information !== null) additionalInformation = `<p class="address-extra">${additional_information}</p>`;
    const orderedDate = ordered_date.substring(0, ordered_date.indexOf('.')).replace('T', ' ');
    const address = returnAddress(order);

    const orderBox = document.createElement('div');
    orderBox.classList.add('order');
    orderBox.setAttribute('id', id);
    orderBox.innerHTML = `
    <div>
        <h3>Order ID: ${id}</h3>
    </div>
    <div class="info">
        <ul>
            <li><img src="./../../assets/icons/order_person.png" alt="">${first_name} ${last_name}</li>
            <li><img src="./../../assets/icons/order_date.png" alt="">${orderedDate}</li>
        </ul>
        <ul>
            <li><img src="./../../assets/icons/order_phone.png" alt="">${phone_number}</li>
            <li><img src="./../../assets/icons/order_branch.png" alt="">${branch}</li>
        </ul>
    </div>
    <hr class="address-line" />
    <p class="address">${address}</p>
    ${additionalInformation}

    <hr />
    <p id=${`${id}-food`}>${getFood(id)}</p>
    <div>
        <span class="price">$${total_price}</span>
        <div class="buttons">
            <button id="cancel-${id}" onclick="updateOrderCancelled(this)">Cancel Delivery</button>
            <button id="delivered-${id}" onclick="updateOrderDelivered(this)">Delivered</button>
        </div>
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

//gets all the fields in order related to address, and groups them in a single string
function returnAddress(order) {
    const address = {
        district: `${order.district} District`,
        city: order.city,
        streetName: order.street_name,
        buildingName: `${order.building_name} Building`,
        floorNumber: `Floor ${order.floor_number}`,
        roomNumber: `Room ${order.room_number}`,
        landmark: order.landmark ? `Near ${order.landmark}` : '',
        companyName: order.companyName ? `At ${order.companyName} Company` : ''
    }

    let newAddress = ``
    for (const key in address) {
        if (address[key] !== '') newAddress += `${address[key]} - `;
    }
    newAddress = newAddress.slice(0, -3);

    return newAddress;
}

//sets the order as 'Cancelled' and updates it with the id of the driver who decided to deliver
function updateOrderCancelled(element) {
    const orderId = element.getAttribute('id').split('-')[1];
    fetch(`${url}/orders/status`, {
        method: "PATCH",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            orderId: orderId,
            status: 'Cancelled',
            driverId: driverId,
            email: sessionStorage.getItem('userEmail')
        })
    })
        .then((res) => res.json())
        .then((res) => {
            popup.setAttribute('status', 'success');
            popup.setAttribute('text', `Order successfully cancelled.`);
            getOrders(driverId);
        })
        .catch((err) => {
            popup.setAttribute('status', 'error');
            popup.setAttribute('text', `Order could not be cancelled.`);
            console.error(err)
        });
}

//sets the order as 'Delivered' and updates it with the id of the driver who decided to deliver
function updateOrderDelivered(element) {
    const date = new Date();
    const od = getSeparatedDate(date);
    const deliveredDate = `${od.year}-${od.month}-${od.day} ${od.hour}:${od.minute}:${od.second}`;

    const orderId = element.getAttribute('id').split('-')[1];
    fetch(`${url}/orders/status`, {
        method: "PATCH",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            orderId: orderId,
            status: 'Delivered',
            driverId: driverId,
            deliveredDate: deliveredDate,
            email: sessionStorage.getItem('userEmail')
        })
    })
        .then((res) => res.json())
        .then((res) => {
            popup.setAttribute('status', 'success');
            popup.setAttribute('text', `Order successfully set as 'Delivered'.`);
            getOrders(driverId);
        })
        .catch((err) => {
            popup.setAttribute('status', 'error');
            popup.setAttribute('text', `Order could not be set as 'Delivered'.`);
            console.error(err)
        });
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