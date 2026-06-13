(function () {
  var menuButton = document.querySelector('[data-menu-button]');
  var mobileMenu = document.querySelector('[data-mobile-menu]');

  if (menuButton && mobileMenu) {
    menuButton.addEventListener('click', function () {
      mobileMenu.classList.toggle('is-open');
    });
  }

  var forms = document.querySelectorAll('[data-search-form]');
  forms.forEach(function (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var input = form.querySelector('input[name="q"]');
      var keyword = input ? input.value.trim() : '';
      var target = './search.html';
      if (keyword) {
        target += '?q=' + encodeURIComponent(keyword);
      }
      window.location.href = target;
    });
  });

  var hero = document.querySelector('[data-hero]');
  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var current = 0;

    function showSlide(index) {
      if (!slides.length) {
        return;
      }
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === current);
      });
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        showSlide(index);
      });
    });

    showSlide(0);
    if (slides.length > 1) {
      window.setInterval(function () {
        showSlide(current + 1);
      }, 5200);
    }
  }

  var liveSearch = document.querySelector('[data-live-search]');
  var typeFilter = document.querySelector('[data-type-filter]');
  var yearFilter = document.querySelector('[data-year-filter]');
  var cards = Array.prototype.slice.call(document.querySelectorAll('[data-filter-card]'));
  var empty = document.querySelector('[data-empty-state]');

  function getSearchValue() {
    return liveSearch ? liveSearch.value.trim().toLowerCase() : '';
  }

  function applyFilters() {
    if (!cards.length) {
      return;
    }

    var keyword = getSearchValue();
    var typeValue = typeFilter ? typeFilter.value : '';
    var yearValue = yearFilter ? yearFilter.value : '';
    var visible = 0;

    cards.forEach(function (card) {
      var haystack = [
        card.getAttribute('data-title') || '',
        card.getAttribute('data-tags') || '',
        card.getAttribute('data-region') || '',
        card.getAttribute('data-type') || '',
        card.getAttribute('data-year') || ''
      ].join(' ').toLowerCase();
      var matchesKeyword = !keyword || haystack.indexOf(keyword) !== -1;
      var matchesType = !typeValue || (card.getAttribute('data-type') || '') === typeValue;
      var matchesYear = !yearValue || (card.getAttribute('data-year') || '') === yearValue;
      var shouldShow = matchesKeyword && matchesType && matchesYear;

      card.style.display = shouldShow ? '' : 'none';
      if (shouldShow) {
        visible += 1;
      }
    });

    if (empty) {
      empty.classList.toggle('is-visible', visible === 0);
    }
  }

  if (liveSearch) {
    var params = new URLSearchParams(window.location.search);
    var initialKeyword = params.get('q') || '';
    if (initialKeyword) {
      liveSearch.value = initialKeyword;
    }
    liveSearch.addEventListener('input', applyFilters);
  }

  if (typeFilter) {
    typeFilter.addEventListener('change', applyFilters);
  }

  if (yearFilter) {
    yearFilter.addEventListener('change', applyFilters);
  }

  applyFilters();

  var player = document.querySelector('[data-player]');
  if (player) {
    var video = player.querySelector('video');
    var playButton = player.querySelector('[data-play-button]');
    var streamUrl = player.getAttribute('data-stream');
    var prepared = false;
    var preparing = null;
    var hlsInstance = null;

    function prepareVideo() {
      if (prepared) {
        return Promise.resolve();
      }

      if (preparing) {
        return preparing;
      }

      preparing = new Promise(function (resolve) {
        if (!video || !streamUrl) {
          resolve();
          return;
        }

        if (window.Hls && window.Hls.isSupported()) {
          hlsInstance = new window.Hls({
            enableWorker: true,
            lowLatencyMode: false
          });
          hlsInstance.attachMedia(video);
          hlsInstance.on(window.Hls.Events.MEDIA_ATTACHED, function () {
            hlsInstance.loadSource(streamUrl);
          });
          hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, function () {
            prepared = true;
            resolve();
          });
          hlsInstance.on(window.Hls.Events.ERROR, function () {
            if (!prepared) {
              video.src = streamUrl;
              prepared = true;
              resolve();
            }
          });
        } else {
          video.src = streamUrl;
          prepared = true;
          resolve();
        }
      });

      return preparing;
    }

    function startPlayback() {
      prepareVideo().then(function () {
        if (playButton) {
          playButton.classList.add('is-hidden');
        }
        video.controls = true;
        var playResult = video.play();
        if (playResult && typeof playResult.catch === 'function') {
          playResult.catch(function () {
            if (playButton) {
              playButton.classList.remove('is-hidden');
            }
          });
        }
      });
    }

    if (playButton) {
      playButton.addEventListener('click', startPlayback);
    }

    if (video) {
      video.addEventListener('click', function () {
        if (video.paused) {
          startPlayback();
        }
      });
    }
  }
})();
