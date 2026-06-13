(function () {
  window.startPlayer = function (options) {
    var video = document.getElementById(options.videoId);
    var button = document.getElementById(options.buttonId);
    var url = options.url;
    var started = false;
    var hlsInstance = null;

    if (!video || !button || !url) {
      return;
    }

    function attachStream() {
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = url;
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hlsInstance.loadSource(url);
        hlsInstance.attachMedia(video);
        return;
      }

      video.src = url;
    }

    function begin() {
      if (!started) {
        started = true;
        attachStream();
        video.controls = true;
        button.classList.add('is-hidden');
      }

      var playPromise = video.play();

      if (playPromise && playPromise.catch) {
        playPromise.catch(function () {
          video.controls = true;
        });
      }
    }

    button.addEventListener('click', begin);
    video.addEventListener('click', function () {
      if (!started) {
        begin();
      }
    });

    window.addEventListener('pagehide', function () {
      if (hlsInstance) {
        hlsInstance.destroy();
        hlsInstance = null;
      }
    });
  };
})();
