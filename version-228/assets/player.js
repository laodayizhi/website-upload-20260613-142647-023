(function () {
  var configNode = document.getElementById('stream-config');
  var video = document.querySelector('[data-player-video]');
  var overlay = document.querySelector('[data-player-overlay]');
  var button = document.querySelector('[data-play-button]');

  if (!configNode || !video || !overlay || !button) {
    return;
  }

  var config = JSON.parse(configNode.textContent || '{}');
  var mediaUrl = config.src || '';
  var prepared = false;
  var hls = null;

  function prepare() {
    if (prepared || !mediaUrl) {
      return;
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = mediaUrl;
    } else if (window.Hls && window.Hls.isSupported()) {
      hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: false
      });
      hls.loadSource(mediaUrl);
      hls.attachMedia(video);
    } else {
      video.src = mediaUrl;
    }

    prepared = true;
  }

  function begin() {
    prepare();
    overlay.classList.add('is-hidden');
    video.setAttribute('controls', 'controls');
    var playing = video.play();

    if (playing && typeof playing.catch === 'function') {
      playing.catch(function () {});
    }
  }

  overlay.addEventListener('click', begin);
  button.addEventListener('click', begin);
  video.addEventListener('click', function () {
    if (!prepared || video.paused) {
      begin();
    }
  });

  window.addEventListener('beforeunload', function () {
    if (hls && typeof hls.destroy === 'function') {
      hls.destroy();
    }
  });
})();
