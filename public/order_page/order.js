getCategoryItems('Beef'); //by default display beef category

//get all buttons that are supposed to switch the category of items displayed
const buttons = (() => {
    const container = document.getElementById('category-list');
    return container.getElementsByTagName('button');
})();

//assign every category button the function that lets them retrieve data from server
for (let i = 0; i < buttons.length; i++) {
    const category = buttons[i].textContent;
    buttons[i].onclick = () => getCategoryItems(category);
}

//remove all items from current list, then get list of food items with specific category from server
function getCategoryItems(cat) {
    const list = document.getElementById('food-list');
    list.innerHTML = '<spinner-component></spinner-component>';

    const spinner = document.querySelector('spinner-component');
    spinner.setDisplayBlock();
    
    highlightSelectedItem(cat);

    fetch(`${url}/foods/${cat}`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        }
    })
        .then((res) => res.json())
        .then((res) => {
            fillItemsList(res);
        })
        .catch((err) => {
            popup.setAttribute('status', 'error');
            popup.setAttribute('text', `Uh oh, we couldn't get the items. If the issue persists, try again later.`);
            console.error(err);
        });
}


//highlights category button selected and unhighlights the rest
function highlightSelectedItem(cat) {
    const container = document.getElementById('category-list');
    const buttons = container.getElementsByTagName('button');

    for (let i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove('selected'); //remove select effect from old selected button
        const text = buttons[i].textContent;
        if (text === cat) {
            buttons[i].classList.add('selected'); //add select effect to clicked button
        }
    }
}

//compares the string inputted in the search bar with all the food items in the DB, then returns the results
function search() {
    const input = document.getElementById('search-bar').value;
    if (input === '') return;

    fetch(`${url}/foods/search/${input}`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        }
    })
        .then((res) => res.json())
        .then((res) => {
            for (let i = 0; i < buttons.length; i++) {
                buttons[i].classList.remove('selected'); //remove select effect from old selected button
            }
            fillItemsList(res);
        })
        .catch((err) => console.error(err));
}