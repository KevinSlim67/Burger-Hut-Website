getFavoriteItems(userId);

//get list of user's favorite food items 
function getFavoriteItems(id) {
    fetch(`${url}/users-favorites/${id}`, {
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

