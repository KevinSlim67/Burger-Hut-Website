const currentDate = new Date();
const currentTime = currentDate.getHours();
const welcome = document.getElementsByClassName('welcome')[0];
let username = sessionStorage.getItem('firstName');
if (username === 'null') {
    username = 'User';
}


let image, greeting;

if (currentTime >= 18 || currentTime < 5) {
    image = './../assets/icons/moon.png';
    greeting = 'Good Evening';
} else if (currentTime >= 12 && currentTime < 18) {
    image = './../assets/icons/sun.png';
    greeting = 'Good Afternoon';
} else if (currentTime >= 5 && currentTime < 12) {
    image = './../assets/icons/sun.png';
    greeting = 'Good Morning';
}

welcome.innerHTML = `
<img src="${image}">
<h2>${greeting}, ${username}!</h2>
<p>What are you craving today ?</p>
`;