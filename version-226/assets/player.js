import { H as Hls } from "./hls-dru42stk.js";

const ready = (callback) => {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", callback);
  } else {
    callback();
  }
};

ready(() => {
  const video = document.querySelector("[data-player]");
  const layer = document.querySelector("[data-play-layer]");

  if (!video) {
    return;
  }

  const stream = video.getAttribute("data-stream");

  if (!stream) {
    return;
  }

  let hls = null;

  if (video.canPlayType("application/vnd.apple.mpegurl")) {
    video.src = stream;
  } else if (Hls.isSupported()) {
    hls = new Hls({
      enableWorker: true,
      lowLatencyMode: false
    });
    hls.loadSource(stream);
    hls.attachMedia(video);
  }

  const begin = () => {
    if (layer) {
      layer.classList.add("is-hidden");
    }
    const result = video.play();
    if (result && typeof result.catch === "function") {
      result.catch(() => {
        if (layer) {
          layer.classList.remove("is-hidden");
        }
      });
    }
  };

  if (layer) {
    layer.addEventListener("click", begin);
  }

  video.addEventListener("play", () => {
    if (layer) {
      layer.classList.add("is-hidden");
    }
  });

  video.addEventListener("click", () => {
    if (video.paused) {
      begin();
    } else {
      video.pause();
    }
  });

  window.addEventListener("pagehide", () => {
    if (hls) {
      hls.destroy();
      hls = null;
    }
  });
});
