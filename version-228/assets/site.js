(function () {
  var toggle = document.querySelector('[data-menu-toggle]');
  var panel = document.querySelector('[data-mobile-panel]');

  if (toggle && panel) {
    toggle.addEventListener('click', function () {
      panel.classList.toggle('is-open');
    });
  }

  var hero = document.querySelector('[data-hero]');

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var previous = hero.querySelector('[data-hero-prev]');
    var next = hero.querySelector('[data-hero-next]');
    var current = 0;
    var timer = null;

    function show(index) {
      if (!slides.length) {
        return;
      }

      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === current);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(current + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
      }
    }

    if (previous) {
      previous.addEventListener('click', function () {
        show(current - 1);
        start();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(current + 1);
        start();
      });
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        show(index);
        start();
      });
    });

    hero.addEventListener('mouseenter', stop);
    hero.addEventListener('mouseleave', start);
    show(0);
    start();
  }

  var filterInput = document.querySelector('[data-page-filter]');
  var filterList = document.querySelector('[data-filter-list]');
  var emptyResult = document.querySelector('[data-empty-result]');
  var searchInput = document.querySelector('[data-search-input]');
  var params = new URLSearchParams(window.location.search);
  var query = params.get('q') || '';

  if (searchInput && query) {
    searchInput.value = query;
  }

  if (filterInput && query) {
    filterInput.value = query;
  }

  function applyFilter(value) {
    if (!filterList) {
      return;
    }

    var keyword = (value || '').trim().toLowerCase();
    var cards = Array.prototype.slice.call(filterList.querySelectorAll('.movie-card'));
    var visible = 0;

    cards.forEach(function (card) {
      var haystack = (card.getAttribute('data-search') || card.textContent || '').toLowerCase();
      var matched = !keyword || haystack.indexOf(keyword) !== -1;
      card.style.display = matched ? '' : 'none';
      if (matched) {
        visible += 1;
      }
    });

    if (emptyResult) {
      emptyResult.classList.toggle('is-visible', visible === 0);
    }
  }

  if (filterInput) {
    filterInput.addEventListener('input', function () {
      applyFilter(filterInput.value);
    });
    applyFilter(filterInput.value);
  } else if (searchInput) {
    searchInput.addEventListener('input', function () {
      applyFilter(searchInput.value);
    });
    applyFilter(searchInput.value);
  } else if (query) {
    applyFilter(query);
  }
})();
