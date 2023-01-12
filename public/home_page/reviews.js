function notImplemented() {
    popup.setAttribute('status', 'error');
    popup.setAttribute('text', `Sorry, this feature was not implemented !`);
}

const reviewList = [
    {
        text: "This place is great! Atmosphere is chill and cool but the staff is also really friendly. They know what they're doing and what they're talking about, and you can tell making the customer happy is their main priority",
        author: "John Doe",
        stars: 5,
        image: "/./../assets/home/man.jpg"
    },
    {
        text: "This place is great! Atmosphere is chill and cool but the staff is also really friendly. They know what they're doing and what they're talking about, and you can tell making the customer happy is their main priority",
        author: "John Doe",
        stars: 4,
        image: "/./../assets/home/man.jpg"
    },
    {
        text: "This place is great! Atmosphere is chill and cool but the staff is also really friendly. They know what they're doing and what they're talking about, and you can tell making the customer happy is their main priority",
        author: "John Doe",
        stars: 5,
        image: "/./../assets/home/man.jpg"
    },
    {
        text: "This place is great! Atmosphere is chill and cool but the staff is also really friendly. They know what they're doing and what they're talking about, and you can tell making the customer happy is their main priority",
        author: "John Doe",
        stars: 5,
        image: "/./../assets/home/man.jpg"
    },
    {
        text: "This place is great! Atmosphere is chill and cool but the staff is also really friendly. They know what they're doing and what they're talking about, and you can tell making the customer happy is their main priority",
        author: "John Doe",
        stars: 4,
        image: "/./../assets/home/man.jpg"
    }
];

const reviews = document.querySelector(".reviews-list");
const scrollLeftBtn = document.querySelector("#scroll-left");
const scrollRightBtn = document.querySelector("#scroll-right");

fillReviews(reviewList);

scrollLeftBtn.addEventListener("mousedown", () => {
    const interval = setInterval(() => {
        reviews.scrollLeft -= 10;
    }, 10);

    // Stop scrolling when the mouse is released or leaves the button
    scrollLeftBtn.addEventListener("mouseup", () => {
        clearInterval(interval);
    });
    scrollLeftBtn.addEventListener("mouseleave", () => {
        clearInterval(interval);
    });
});

// Scroll to the right when the right scroll button is clicked and held
scrollRightBtn.addEventListener("mousedown", () => {
    const interval = setInterval(() => {
        reviews.scrollLeft += 10;
    }, 10);

    // Stop scrolling when the mouse is released or leaves the button
    scrollRightBtn.addEventListener("mouseup", () => {
        clearInterval(interval);
    });
    scrollRightBtn.addEventListener("mouseleave", () => {
        clearInterval(interval);
    });
});

// Show or hide the scroll buttons based on the scroll position
function updateScrollButtons() {
    if (reviews.scrollLeft > 0) {
      scrollLeftBtn.style.display = "block";
      scrollLeftBtn.style.opacity = "1";
    } else {
      scrollLeftBtn.style.opacity = "0";
      setTimeout(() => {
        scrollLeftBtn.style.display = "none";
      }, 200);
    }
  
    if (reviews.scrollLeft < reviews.scrollWidth - reviews.offsetWidth) {
      scrollRightBtn.style.display = "block";
      scrollRightBtn.style.opacity = "1";
    } else {
      scrollRightBtn.style.opacity = "0";
      setTimeout(() => {
        scrollRightBtn.style.display = "none";
      }, 200);
    }
  }
  

// Initialize the scroll buttons
updateScrollButtons();

// Update the scroll buttons when the scroll position changes
reviews.addEventListener("scroll", updateScrollButtons);

function createReview(review) {
    const { text, author, stars, image } = review;

    let starsField = '';
    for (let i = 0; i < stars; i++) {
        starsField += '<img class="star" src="/./../assets/icons/star.png">'
    }

    const box = document.createElement('div');
    box.classList.add('review-card');
    box.innerHTML = `
    <div class="content">
        <p>"${text}"</p>
        <div class="bottom">
            <div class="user">
                <div class="img-container"><img src=${image}></div>
                <span>${author}</span>
            </div>
            <div class="stars">${starsField}</div>
        </div>
    </div>
    `
    return box;
}

function fillReviews(reviewsList) {
    reviewsList.forEach(r => {
        reviews.appendChild(createReview(r));
    })
}