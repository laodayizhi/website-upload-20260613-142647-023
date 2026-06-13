(function () {
    var menuButton = document.querySelector('[data-menu-toggle]');
    var mobileNav = document.querySelector('[data-mobile-nav]');

    if (menuButton && mobileNav) {
        menuButton.addEventListener('click', function () {
            mobileNav.classList.toggle('is-open');
        });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
    var slideIndex = 0;

    function showSlide(nextIndex) {
        if (!slides.length) {
            return;
        }

        slideIndex = (nextIndex + slides.length) % slides.length;

        slides.forEach(function (slide, index) {
            slide.classList.toggle('is-active', index === slideIndex);
        });

        dots.forEach(function (dot, index) {
            dot.classList.toggle('is-active', index === slideIndex);
        });
    }

    dots.forEach(function (dot) {
        dot.addEventListener('click', function () {
            var target = parseInt(dot.getAttribute('data-hero-dot'), 10);
            showSlide(target);
        });
    });

    if (slides.length > 1) {
        window.setInterval(function () {
            showSlide(slideIndex + 1);
        }, 5200);
    }

    var searchInput = document.querySelector('[data-search-input]');
    var selects = Array.prototype.slice.call(document.querySelectorAll('[data-filter-select]'));
    var cards = Array.prototype.slice.call(document.querySelectorAll('.movie-card'));
    var empty = document.querySelector('[data-empty-state]');

    function cardContains(card, query) {
        if (!query) {
            return true;
        }

        var text = [
            card.getAttribute('data-title'),
            card.getAttribute('data-region'),
            card.getAttribute('data-type'),
            card.getAttribute('data-year'),
            card.getAttribute('data-genre'),
            card.getAttribute('data-tags'),
            card.textContent
        ].join(' ').toLowerCase();

        return text.indexOf(query) !== -1;
    }

    function applyFilters() {
        if (!cards.length) {
            return;
        }

        var query = searchInput ? searchInput.value.trim().toLowerCase() : '';
        var activeFilters = {};

        selects.forEach(function (select) {
            var key = select.getAttribute('data-filter-select');
            activeFilters[key] = select.value;
        });

        var visibleCount = 0;

        cards.forEach(function (card) {
            var visible = cardContains(card, query);

            Object.keys(activeFilters).forEach(function (key) {
                var selected = activeFilters[key];
                if (selected && card.getAttribute('data-' + key) !== selected) {
                    visible = false;
                }
            });

            card.style.display = visible ? '' : 'none';

            if (visible) {
                visibleCount += 1;
            }
        });

        if (empty) {
            empty.classList.toggle('is-visible', visibleCount === 0);
        }
    }

    if (searchInput) {
        searchInput.addEventListener('input', applyFilters);
    }

    selects.forEach(function (select) {
        select.addEventListener('change', applyFilters);
    });
})();
