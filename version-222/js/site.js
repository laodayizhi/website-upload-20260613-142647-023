(function () {
  var menuButton = document.querySelector('[data-menu-toggle]');
  var mobileNav = document.querySelector('[data-mobile-nav]');

  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function () {
      mobileNav.classList.toggle('is-open');
    });
  }

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

    if (slides.length > 1) {
      window.setInterval(function () {
        showSlide(current + 1);
      }, 6500);
    }
  }

  var localFilter = document.querySelector('[data-filter-input]');

  if (localFilter) {
    var filterCards = Array.prototype.slice.call(document.querySelectorAll('[data-filter-card]'));
    var emptyState = document.querySelector('[data-empty-state]');

    localFilter.addEventListener('input', function () {
      var keyword = localFilter.value.trim().toLowerCase();
      var visible = 0;

      filterCards.forEach(function (card) {
        var haystack = (card.getAttribute('data-search') || '').toLowerCase();
        var matched = !keyword || haystack.indexOf(keyword) !== -1;
        card.style.display = matched ? '' : 'none';
        if (matched) {
          visible += 1;
        }
      });

      if (emptyState) {
        emptyState.classList.toggle('is-visible', visible === 0);
      }
    });
  }

  var searchPage = document.querySelector('[data-search-page]');

  if (searchPage) {
    var params = new URLSearchParams(window.location.search);
    var query = (params.get('q') || '').trim();
    var input = searchPage.querySelector('[data-search-input]');
    var cards = Array.prototype.slice.call(searchPage.querySelectorAll('[data-filter-card]'));
    var status = searchPage.querySelector('[data-search-status]');
    var empty = searchPage.querySelector('[data-empty-state]');

    if (input) {
      input.value = query;
    }

    function applySearch(value) {
      var keyword = value.trim().toLowerCase();
      var visible = 0;

      cards.forEach(function (card) {
        var haystack = (card.getAttribute('data-search') || '').toLowerCase();
        var matched = !keyword || haystack.indexOf(keyword) !== -1;
        card.style.display = matched ? '' : 'none';
        if (matched) {
          visible += 1;
        }
      });

      if (status) {
        status.textContent = keyword ? '已为你筛选相关作品' : '全部影视作品';
      }

      if (empty) {
        empty.classList.toggle('is-visible', visible === 0);
      }
    }

    applySearch(query);

    if (input) {
      input.addEventListener('input', function () {
        applySearch(input.value);
      });
    }
  }
})();
