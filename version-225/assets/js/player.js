import { H as Hls } from './hls-dru42stk.js';

function attachHls(video) {
    var streamUrl = video.getAttribute('data-hls');
    if (!streamUrl) {
        return null;
    }

    if (Hls.isSupported()) {
        var hls = new Hls({
            enableWorker: true,
            lowLatencyMode: false
        });

        hls.loadSource(streamUrl);
        hls.attachMedia(video);

        hls.on(Hls.Events.ERROR, function (_, data) {
            if (!data || !data.fatal) {
                return;
            }

            if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
                hls.startLoad();
                return;
            }

            if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
                hls.recoverMediaError();
                return;
            }

            hls.destroy();
        });

        return hls;
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = streamUrl;
    }

    return null;
}

function setupPlayer() {
    var video = document.getElementById('video-player');
    var startButton = document.querySelector('[data-player-start]');

    if (!video) {
        return;
    }

    attachHls(video);

    function hideStartButton() {
        if (startButton) {
            startButton.classList.add('is-hidden');
        }
    }

    if (startButton) {
        startButton.addEventListener('click', function () {
            hideStartButton();
            video.play().catch(function () {
                startButton.classList.remove('is-hidden');
            });
        });
    }

    video.addEventListener('play', hideStartButton);
    video.addEventListener('click', function () {
        if (video.paused) {
            video.play();
        }
    });
}

document.addEventListener('DOMContentLoaded', setupPlayer);
