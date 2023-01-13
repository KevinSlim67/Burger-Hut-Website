const url = '';

(function addFavicon() {
    let link = document.createElement("link");
    link.setAttribute("href", "/assets/logo_primary.png");
    link.setAttribute("rel", "icon");
    document.head.appendChild(link);
})();

function addScripts() {
    const scripts = [
        "/components/navbar.js",
        "/components/footer.js",
        "/components/popup.js",
    ];

    scripts.forEach(s => {
        const script = document.createElement('script');
        script.src = s;
        document.head.appendChild(script);
    })
};

addScripts();

let driverId = JSON.parse(sessionStorage.getItem('driverId'));
let userId = JSON.parse(sessionStorage.getItem('userId'));
let userEmail = JSON.stringify(sessionStorage.getItem('userEmail'));

if (userId === null) {
    userId = localStorage.getItem('userId');
    sessionStorage.setItem('userId', localStorage.getItem('userId'));
    sessionStorage.setItem('firstName', localStorage.getItem('firstName'));
    sessionStorage.setItem('userEmail', localStorage.getItem('userEmail'));
    rememberCart();
}

function rememberCart() {
    if (sessionStorage.getItem('cart') === null || sessionStorage.getItem('cart').charAt(0) !== '[') {
        sessionStorage.setItem('cart', '[]');
    } else {
        sessionStorage.setItem('cart', localStorage.getItem('cart'));
    }
}

const layout = document.getElementById('layout');

//create blank popup-component
let popupComponent = document.createElement('popup-component');
popupComponent.setAttribute('id', 'popup');
layout.appendChild(popupComponent);