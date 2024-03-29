class Footer extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
        <footer>
            <div class="wrapper">
                <div class="newsletter">
                    <h4 class="title">Subscribe To<br>Our Newsletter<h4>
                    <div class="field">
                        <input type="email" id="newsletter" placeholder="Enter your email">
                        <input type="submit" id="newsletter-submit" value="" class="news">
                    </div>
                    <div class="social-media">
                        <a href="https://www.facebook.com/" target="_blank"><img src="/./../assets/icons/facebook.svg"></a>
                        <a href="https://twitter.com/" target="_blank"><img src="/./../assets/icons/twitter.svg"></a>
                        <a href="https://www.instagram.com/" target="_blank"><img src="/./../assets/icons/instagram.svg"></a>
                        <a href="https://www.youtube.com/" target="_blank"><img src="/./../assets/icons/youtube.svg"></a>
                    </div>
                </div>

                <ul>
                    <h4 class="title">Service</h4>
                    <li><a href="/order">Online Order</a></li>
                    <li><a href="/order">Pre-Reservation</a></li>
                    <li><a href="/order">24/7 Services</a></li>
                </ul>

                <ul>
                    <h4 class="title">Quick Links</h4>
                    <li><a href="/order">Menu</a></li>
                    <li><a href="/home#reviews">Reviews</a></li>
                    <li><a href="/order">Reserve Table</a></li>
                    <li><a href="/order">Order Food</a></li>
                </ul>

                <ul>
                    <h4 class="title">About</h4>
                    <li><a href="/home#about-us">Our Story</a></li>
                    <li><a href="/home#hiring">Career</a></li>
                </ul>

                <ul>
                    <h4 class="title">Help</h4>
                    <li><a href="/contact#contact">Contact Us</a></li>
                    <li><a href="/contact#faq">FAQ</a></li>
                </ul>
            </div>
            <div class="copyright">© 2023 Kevin Slim. All Rights Reserved.</div>
        </footer>
        `;
    }
}

customElements.define('footer-component', Footer);