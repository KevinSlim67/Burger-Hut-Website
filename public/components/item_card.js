const popup = document.getElementById('popup');
let temporaryTotalAmount = 0; //stores total amount of items added, it resets to 0 when popup setTimeout() is done
let temporaryFoodId = null;
let timerId = null; //stores the current popup timer, useful to terminate it in case another one is triggered before this one is finished


//hides cart button if user isn't logged in
if (sessionStorage.getItem('userId') === 'null') {
    const btn = document.querySelector('#cart-btn');
    btn.style.display = 'none';
} else updateCartBtnAmount();


//fill food list with item cards with the present data
function fillItemsList(arr) {
    const list = document.getElementById('food-list');
    list.innerHTML = '';
    arr.forEach(e => {
        list.appendChild(createItem(e));
    });
}


//create item card
function createItem(item) {
    const { id, name, price, image, category, ingredients, favorite } = item;
    let isFavorite = JSON.parse(favorite);
    const itemCard = document.createElement('div');
    itemCard.classList.add('food-card');

    itemCard.setAttribute('id', id);
    itemCard.setAttribute('category', category);


    if (isFavorite) {
        itemCard.classList.add('favorite');
    }
    itemCard.setAttribute('favorite', isFavorite);

    itemCard.innerHTML =
        `
        <img class="picture" src="data:image/png;base64, ${image}" alt="${name}" loading="lazy" />
        <div class="content">
            <h3>${name}</h3>
            <h4>${price}</h4>
            <button class="view">View</button>
        </div>
        <button id="${id}-favorite" class="add" onclick="toggleFavorite(this); event.stopPropagation();"></button>
        `;

    //get ingredients, capitalize them, then add them to item object

    item.ingredients = ingredients.map(i => {
        return i.charAt(0).toUpperCase() + i.slice(1).toLowerCase();
    });

    itemCard.addEventListener('click', () => showItemDetails(item), false);

    return itemCard;
}

//get a food item's ingredients
const getIngredients = async (id) => {
    try {
        const response = await fetch(`${url}/foods/${id}/ingredients`, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            }
        });
        const data = await response.json();
        return data;
    } catch (err) {
        return [];
    }
}

function toggleFavorite(element) {
    const id = element.id.split('-')[0];
    const itemCard = document.getElementById(id);
    const isFavorite = JSON.parse(itemCard.getAttribute('favorite'));
    if (isFavorite) {
        removeFromFavorites(itemCard);
        itemCard.classList.remove('favorite');
        itemCard.setAttribute('favorite', false);
    } else {
        if (addToFavorite(itemCard)) {
            itemCard.classList.add('favorite');
            itemCard.setAttribute('favorite', true);
        }
    }
}

function removeFromFavorites(itemCard) {
    fetch(`${url}/users-favorites/delete`, {
        method: "DELETE",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            userId: userId,
            foodId: itemCard.id,
        })
    })
        .then((res) => res.json())
        .then((res) => {
            const url = window.location.href;
            if (url.includes('favorite')) itemCard.remove();
        })
        .catch((err) => {
            popup.setAttribute("status", "error");
            popup.setAttribute("text", `Uh oh, we couldn't remove the item from your favorites.`);
            console.error(err);
        });
}

function addToFavorite(itemCard) {
    if (!userId) {
        popup.setAttribute("status", "error");
        popup.setAttribute("text", `You need to be logged in to perform this action.`);
        return false;
    }

    fetch(`${url}/users-favorites/add`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            userId: userId,
            foodId: itemCard.id,
        })
    })
        .then((res) => { return true; })
        .catch((err) => {
            popup.setAttribute("status", "error");
            popup.setAttribute("text", `Uh oh, we couldn't add the item from your favorites.`);
            console.error(err);
        });

}


//updates the cart button amount that is on the bottom right of the screen
function updateCartBtnAmount() {
    const cart = JSON.parse(sessionStorage.getItem('cart'));
    const total = cart.reduce((total, item) => total + item.amount, 0);
    const btn = document.getElementById('cart-btn-amount');
    btn.innerText = total;
}
