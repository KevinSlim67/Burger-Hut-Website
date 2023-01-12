class Spinner extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const width = this.getAttribute('width') || '4em';
        const height = this.getAttribute('height') || '4em';

        this.classList.add('spinner');
        this.style.width = width;
        this.style.height = height;
        this.style.display = 'none';

        this.innerHTML = `<img src="/./../assets/icons/spinner.svg">`;
    }

    setDisplayBlock() {
        this.style.display = "block";
    }

    setDisplayNone() {
        this.style.display = "none";
    }
}

customElements.define('spinner-component', Spinner);