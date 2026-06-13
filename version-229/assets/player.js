(function () {
    var video = document.getElementById('movie-player');
    var button = document.getElementById('play-layer');

    if (!video || !button) {
        return;
    }

    var stream = video.getAttribute('data-stream');
    var hls = null;
    var attached = false;

    function attachStream() {
        if (attached || !stream) {
            return;
        }

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = stream;
            attached = true;
            return;
        }

        if (window.Hls && window.Hls.isSupported()) {
            hls = new window.Hls({
                enableWorker: true,
                lowLatencyMode: true,
                backBufferLength: 90
            });
            hls.loadSource(stream);
            hls.attachMedia(video);
            attached = true;
            return;
        }

        video.src = stream;
        attached = true;
    }

    function startPlayback() {
        attachStream();
        button.classList.add('is-hidden');
        video.controls = true;

        var playPromise = video.play();

        if (playPromise && typeof playPromise.catch === 'function') {
            playPromise.catch(function () {
                button.classList.remove('is-hidden');
            });
        }
    }

    button.addEventListener('click', startPlayback);

    video.addEventListener('click', function () {
        if (video.paused) {
            startPlayback();
        }
    });

    window.addEventListener('pagehide', function () {
        if (hls && typeof hls.destroy === 'function') {
            hls.destroy();
        }
    });
})();
