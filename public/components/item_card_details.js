function showItemDetails(item) {
    hideItemDetails(); //if another details pane is shown, delete it before displaying new one
    const body = document.body;
    const div = createItemDetails(item);
    body.appendChild(div);
}



function incrementCounter() {
    const counter = document.getElementsByClassName('number')[0];
    let num = parseInt(counter.textContent);
    if (num + 1 < 100) counter.textContent = ++num;
}

function decrementCounter() {
    const counter = document.getElementsByClassName('number')[0];
    let num = parseInt(counter.textContent);
    if (num - 1 >= 0) counter.textContent = --num;
}

function hideItemDetails() {
    const body = document.body;
    const itemDetails = document.getElementsByClassName('food-details')[0];
    if (itemDetails !== undefined) {
      const details = itemDetails.getElementsByClassName('details')[0];
      details.classList.add('slide-out'); // add 'slide-out' class to 'details' div
      setTimeout(() => {
        body.removeChild(itemDetails);
      }, 150); // remove element after 0.5 seconds (to give the animation time to finish)
    }
  }

//add food item to cart, and specifies the amount added
function addToCart(foodId) {
    const amount = parseInt(document.getElementById('amount').textContent);

    //if user isn't logged in, display a warning popup and exit out of function
    if (sessionStorage.getItem('userId') === 'null') {
        popup.setAttribute('status', 'error');
        popup.setAttribute('text', `You need to login in order to add an item to your cart !`);
        return false;
    };

    //if the amount set is 0, display a warning popup and exit out of function
    if (amount === 0) {
        popup.setAttribute('status', 'error');
        popup.setAttribute('text', `You need to specify an amount !`);
        return false;
    };

    //adds food item to cart
    fetch(`${url}/foods/id/${foodId}`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
    })
        .then((res) => res.json())
        .then((res) => {
            //if item already present in cart, just increment amount instead of adding the item again
            const cart = JSON.parse(sessionStorage.getItem('cart'));

            //checks if item is already in cart, if it is, increment its amount instead of adding it again
            let exists = false;
            cart.forEach(i => {
                if (i.id === foodId) {
                    i.amount = i.amount + amount;
                    exists = true;
                }
            });
            if (!exists) cart.push({ ...res, amount: amount });

            sessionStorage.setItem('cart', JSON.stringify(cart));
            updateCartBtnAmount();
            handleSuccessPopup(amount, res);
        })
        .catch((err) => {
            popup.setAttribute('status', 'error');
            popup.setAttribute('text', `Uh oh, there appears to have been a problem. If the issue persists, try again later.`);
            console.error(err)
        });
}

//handles the success popup that appear if addToCart() is successful
function handleSuccessPopup(amount, res) {
    popup.setAttribute('status', 'success');
    if (!(temporaryFoodId === res.id || temporaryFoodId === null)) {
        temporaryTotalAmount = 0;
    }

    popup.setAttribute('text', `${amount + temporaryTotalAmount} ${res.name}(s) added to cart`);

    //if the timer of the first timer isn't done, then cancel it, and start a new timer
    //with the amount updated
    if (timerId !== null) {
        clearTimeout(timerId);
        timerId = setTimeout(() => {
            temporaryTotalAmount = 0;
        }, 5000);
    } else {
        timerId = setTimeout(() => {
            temporaryTotalAmount = 0;
        }, 5000);
    }
    temporaryTotalAmount += amount;
    temporaryFoodId = res.id;
}

//displays a box that displays all details about item such as ingredients and cooktime 
function createItemDetails(item) {
    const { id, name, price, image, rating, cooktime, ingredients } = item;

    const ratingDiv = (rating !== null) ? `<h5 class="rating">${rating}</h5>` : '';
    const cookTimeDiv = (cooktime !== null) ? `<h5 class="cook-time">${cooktime} min</h5>` : '';

    const ingredientDiv = (ingredients.length > 0) ? ` 
    <div>
        <h5>Ingredients</h5>
        <p>${ingredients.join(' - ')}<p/>
    </div>` : '';

    const itemDetails = document.createElement('div');
    itemDetails.classList.add('food-details'); 
    itemDetails.innerHTML = `
    <img src="data:image/png;base64, ${image}">
    <div class="details slide-in">
        <div class="info">
            <div>
                <div class="split-container">
                    <div class="left">
                        <h3>${name}</h3>
                        ${ratingDiv}
                        ${cookTimeDiv}
                    </div>
                    <div class="right"> 
                        <h4>${price}</h4>
                        <div class="counter">
                        <button onclick="decrementCounter(this)">-</button>
                        <span id="amount" class="number">0</span>
                        <button onclick="incrementCounter(this)">+</button>
                        </div>
                    </div>
                </div>
                <hr>
                ${ingredientDiv}
            </div>
            <button class="type1 full cart" onclick="addToCart(${id})">
                <img src="./../assets/icons/cart.png" alt="" />
                Add To Cart
            </button>
        </div>
        <div class="image">
            <img src="data:image/png;base64, ${image}" alt="${name}">
        </div>
    </div>
    <button class="back" onclick="hideItemDetails()"></button>
    `;
    return itemDetails;
}