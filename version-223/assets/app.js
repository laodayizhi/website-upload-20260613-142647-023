(function () {
    function ready(callback) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', callback);
        } else {
            callback();
        }
    }

    function setupNavigation() {
        var toggle = document.querySelector('.nav-toggle');
        var mobileNav = document.querySelector('.mobile-nav');
        if (!toggle || !mobileNav) {
            return;
        }
        toggle.addEventListener('click', function () {
            mobileNav.classList.toggle('is-open');
        });
    }

    function setupHero() {
        var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
        var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dot'));
        if (slides.length < 2) {
            return;
        }
        var index = 0;
        var timer = null;
        function activate(nextIndex) {
            slides[index].classList.remove('is-active');
            if (dots[index]) {
                dots[index].classList.remove('is-active');
            }
            index = nextIndex;
            slides[index].classList.add('is-active');
            if (dots[index]) {
                dots[index].classList.add('is-active');
            }
        }
        function next() {
            activate((index + 1) % slides.length);
        }
        function start() {
            timer = window.setInterval(next, 5200);
        }
        function stop() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }
        dots.forEach(function (dot, dotIndex) {
            dot.addEventListener('click', function () {
                stop();
                activate(dotIndex);
                start();
            });
        });
        start();
    }

    function setupFilters() {
        var inputs = Array.prototype.slice.call(document.querySelectorAll('.page-filter'));
        if (!inputs.length) {
            return;
        }
        var params = new URLSearchParams(window.location.search);
        var query = params.get('q') || '';
        inputs.forEach(function (input) {
            if (query && input.classList.contains('search-input-main')) {
                input.value = query;
            }
            var apply = function () {
                var value = input.value.trim().toLowerCase();
                var cards = Array.prototype.slice.call(document.querySelectorAll('.movie-card'));
                cards.forEach(function (card) {
                    var haystack = (card.getAttribute('data-search') || card.textContent || '').toLowerCase();
                    if (!value || haystack.indexOf(value) !== -1) {
                        card.classList.remove('is-hidden');
                    } else {
                        card.classList.add('is-hidden');
                    }
                });
            };
            input.addEventListener('input', apply);
            apply();
        });
    }

    function setupForms() {
        Array.prototype.slice.call(document.querySelectorAll('.site-search-form')).forEach(function (form) {
            form.addEventListener('submit', function (event) {
                var input = form.querySelector('input[name="q"]');
                if (!input || !input.value.trim()) {
                    event.preventDefault();
                }
            });
        });
    }

    window.initMoviePlayer = function (source) {
        ready(function () {
            var block = document.querySelector('.player-block');
            if (!block) {
                return;
            }
            var video = block.querySelector('video');
            var cover = block.querySelector('.player-cover');
            var loaded = false;
            var hls = null;
            function bindSource() {
                if (loaded || !video) {
                    return;
                }
                if (video.canPlayType('application/vnd.apple.mpegurl')) {
                    video.src = source;
                } else if (window.Hls && window.Hls.isSupported()) {
                    hls = new window.Hls({
                        enableWorker: true,
                        lowLatencyMode: true
                    });
                    hls.loadSource(source);
                    hls.attachMedia(video);
                } else {
                    video.src = source;
                }
                loaded = true;
            }
            function play() {
                bindSource();
                if (cover) {
                    cover.classList.add('is-hidden');
                }
                video.controls = true;
                var result = video.play();
                if (result && typeof result.catch === 'function') {
                    result.catch(function () {});
                }
            }
            if (cover) {
                cover.addEventListener('click', play);
            }
            block.addEventListener('click', function (event) {
                if (event.target === video && (!loaded || video.paused)) {
                    play();
                }
            });
            window.addEventListener('pagehide', function () {
                if (hls && typeof hls.destroy === 'function') {
                    hls.destroy();
                }
            });
        });
    };

    ready(function () {
        setupNavigation();
        setupHero();
        setupFilters();
        setupForms();
    });
})();
