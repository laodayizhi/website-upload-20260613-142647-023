(function () {
    function setupMobileNav() {
        var toggle = document.querySelector('[data-nav-toggle]');
        var nav = document.querySelector('[data-main-nav]');
        if (!toggle || !nav) {
            return;
        }

        toggle.addEventListener('click', function () {
            nav.classList.toggle('is-open');
        });
    }

    function setupHero() {
        var hero = document.querySelector('[data-hero]');
        if (!hero) {
            return;
        }

        var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
        var prev = hero.querySelector('[data-hero-prev]');
        var next = hero.querySelector('[data-hero-next]');
        var current = 0;
        var timer = null;

        function show(index) {
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === current);
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
                timer = null;
            }
        }

        if (prev) {
            prev.addEventListener('click', function () {
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

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                show(Number(dot.getAttribute('data-hero-dot')) || 0);
                start();
            });
        });

        hero.addEventListener('mouseenter', stop);
        hero.addEventListener('mouseleave', start);
        show(0);
        start();
    }

    function setupFilters() {
        var scopes = Array.prototype.slice.call(document.querySelectorAll('[data-filter-scope]'));
        scopes.forEach(function (scope) {
            var input = scope.querySelector('[data-filter-input]');
            var cards = Array.prototype.slice.call(scope.querySelectorAll('.movie-card'));
            var chips = Array.prototype.slice.call(scope.querySelectorAll('[data-filter-chip]'));
            var state = scope.querySelector('[data-filter-state]');
            var empty = scope.querySelector('[data-filter-empty]');
            var activeChip = '全部';

            if (!cards.length) {
                return;
            }

            var params = new URLSearchParams(window.location.search);
            var query = params.get('q') || '';
            if (input && query) {
                input.value = query;
            }

            function apply() {
                var keyword = input ? input.value.trim().toLowerCase() : '';
                var visible = 0;

                cards.forEach(function (card) {
                    var text = (card.getAttribute('data-search') || '').toLowerCase();
                    var chip = card.getAttribute('data-chip') || '';
                    var matchesKeyword = !keyword || text.indexOf(keyword) !== -1;
                    var matchesChip = activeChip === '全部' || chip === activeChip;
                    var shouldShow = matchesKeyword && matchesChip;

                    card.hidden = !shouldShow;
                    if (shouldShow) {
                        visible += 1;
                    }
                });

                if (state) {
                    state.textContent = keyword || activeChip !== '全部'
                        ? '搜索结果已更新，可继续调整关键词或分类。'
                        : '可按片名、地区、类型、年份与标签快速定位。';
                }

                if (empty) {
                    empty.hidden = visible !== 0;
                }
            }

            if (input) {
                input.addEventListener('input', apply);
            }

            chips.forEach(function (chipButton) {
                chipButton.addEventListener('click', function () {
                    activeChip = chipButton.getAttribute('data-filter-chip') || '全部';
                    chips.forEach(function (button) {
                        button.classList.toggle('is-active', button === chipButton);
                    });
                    apply();
                });
            });

            if (chips.length && !scope.querySelector('[data-filter-chip].is-active')) {
                chips[0].classList.add('is-active');
            }

            apply();
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        setupMobileNav();
        setupHero();
        setupFilters();
    });
})();
