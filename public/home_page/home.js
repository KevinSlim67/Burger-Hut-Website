const spinner = document.querySelector('spinner-component');
const video = document.querySelector('.video');

videoNotLoaded();

function videoLoaded() {
  spinner.setDisplayNone();
  video.style.backgroundColor = 'transparent';
}

function videoNotLoaded() {
    spinner.setDisplayBlock();
    video.style.backgroundColor = 'var(--gray-100)';
}
