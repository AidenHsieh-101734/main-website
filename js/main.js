// [ AUTOSCROLL AND PAGE TRANSITION WITH CONFIGURABLE DURATIONS ] \\
let scrollCycleCount = 0;
let isScrolling = false;

const scrollConfig = {
    "main.html": { downDuration: 13000, upDuration: 13000, delay: 10000, nextPage: "./pages/halo.html" },
    "halo.html": { downDuration: 17000, upDuration: 17000, delay: 15000, nextPage: "./halo2.html" },
    "halo2.html": { downDuration: 12000, upDuration: 12000, delay: 10000, nextPage: "./pacman1.html" },
    "pacman1.html": { downDuration: 5000, upDuration: 5000, delay: 7000, nextPage: "./pacman2.html" },
    "pacman2.html": { downDuration: 7000, upDuration: 7000, delay: 5000, nextPage: "../main.html" },
    "default": { downDuration: 17000, upDuration: 17000, delay: 15000, nextPage: "./pages/halo.html" }
};

function smoothScrollTo(endPosition, duration, callback) {
    const startPosition = window.scrollY || window.pageYOffset;
    const distance = endPosition - startPosition;
    let startTime = null;

    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);

        const easeInOut = progress < 0.5 
            ? 2 * progress * progress 
            : -1 + (4 - 2 * progress) * progress;

        window.scrollTo(0, startPosition + distance * easeInOut);

        if (timeElapsed < duration) {
            requestAnimationFrame(animation);
        } else if (typeof callback === 'function') {
            callback();
        }
    }

    requestAnimationFrame(animation);
}

function initiatePageTransition(nextPage) {
    const loadingScreen = document.querySelector('.loading-screen');
    loadingScreen.classList.add('active');
    document.body.classList.add("fade-out");

    setTimeout(() => {
        window.location.href = nextPage;
    }, 3000);
}

function autoScroll(config) {
    if (isScrolling) return;
    isScrolling = true;

    const scrollHeight = document.documentElement.scrollHeight;
    const viewportHeight = window.innerHeight;

    smoothScrollTo(scrollHeight - viewportHeight, config.downDuration, () => {
        setTimeout(() => {
            smoothScrollTo(0, config.upDuration, () => {
                isScrolling = false;
                scrollCycleCount++;
                if (scrollCycleCount >= 1) {
                    initiatePageTransition(config.nextPage);
                }
            });
        }, config.delay);
    });
}

function fadeInPage() {
    document.body.classList.add("fade-in");
}

window.onload = function () {
    fadeInPage();

    let currentPage = window.location.pathname.split("/").pop();

    let config = scrollConfig[currentPage] || scrollConfig["default"];

    setInterval(() => autoScroll(config), 15000);
};

// [ MEDIA PLAYER CONTROLS ] \\
function playPause(videoId) {
    const video = document.getElementById(videoId);
    const playPauseIcon = document.querySelector(`#playPauseIcon${videoId.slice(-1)}`);

    if (video.paused) {
        video.play();
        playPauseIcon.classList.remove('fa-play');
        playPauseIcon.classList.add('fa-pause');
    } else {
        video.pause();
        playPauseIcon.classList.remove('fa-pause');
        playPauseIcon.classList.add('fa-play');
    }
}

function muteUnmute(videoId) {
    const video = document.getElementById(videoId);
    const muteIcon = document.querySelector(`#muteIcon${videoId.slice(-1)}`);
    const volumeSlider = document.getElementById(`volumeSlider${videoId.slice(-1)}`);

    video.muted = !video.muted;
    if (video.muted) {
        muteIcon.classList.remove('fa-volume-up');
        muteIcon.classList.add('fa-volume-mute');
        volumeSlider.value = 0;
    } else {
        muteIcon.classList.remove('fa-volume-mute');
        muteIcon.classList.add('fa-volume-up');
        volumeSlider.value = video.volume;
    }
}

function setVolume(videoId) {
    const video = document.getElementById(videoId);
    const volumeSlider = document.getElementById(`volumeSlider${videoId.slice(-1)}`);

    video.volume = volumeSlider.value;
    video.muted = volumeSlider.value == 0;

    const muteIcon = document.querySelector(`#muteIcon${videoId.slice(-1)}`);
    if (video.muted || video.volume == 0) {
        muteIcon.classList.remove('fa-volume-up');
        muteIcon.classList.add('fa-volume-mute');
    } else {
        muteIcon.classList.remove('fa-volume-mute');
        muteIcon.classList.add('fa-volume-up');
    }
}
