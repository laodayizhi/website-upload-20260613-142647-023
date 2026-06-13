(() => {
  const ready = (callback) => {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  };

  ready(() => {
    const menuButton = document.querySelector("[data-menu-toggle]");
    const mobilePanel = document.querySelector("[data-mobile-panel]");

    if (menuButton && mobilePanel) {
      menuButton.addEventListener("click", () => {
        mobilePanel.classList.toggle("open");
      });
    }

    const slider = document.querySelector("[data-hero-slider]");

    if (slider) {
      const slides = Array.from(slider.querySelectorAll(".hero-slide"));
      const dots = Array.from(slider.querySelectorAll(".hero-dot"));
      const prev = slider.querySelector("[data-hero-prev]");
      const next = slider.querySelector("[data-hero-next]");
      let current = 0;
      let timer = null;

      const show = (index) => {
        current = (index + slides.length) % slides.length;
        slides.forEach((slide, slideIndex) => {
          slide.classList.toggle("active", slideIndex === current);
        });
        dots.forEach((dot, dotIndex) => {
          dot.classList.toggle("active", dotIndex === current);
        });
      };

      const start = () => {
        stop();
        timer = window.setInterval(() => show(current + 1), 5200);
      };

      const stop = () => {
        if (timer) {
          window.clearInterval(timer);
          timer = null;
        }
      };

      dots.forEach((dot, dotIndex) => {
        dot.addEventListener("click", () => {
          show(dotIndex);
          start();
        });
      });

      if (prev) {
        prev.addEventListener("click", () => {
          show(current - 1);
          start();
        });
      }

      if (next) {
        next.addEventListener("click", () => {
          show(current + 1);
          start();
        });
      }

      slider.addEventListener("mouseenter", stop);
      slider.addEventListener("mouseleave", start);
      show(0);
      start();
    }

    const normalize = (value) => (value || "").toString().trim().toLowerCase();

    const applyFilter = (form, value) => {
      const scope = form.closest("main") || document;
      const cards = Array.from(scope.querySelectorAll(".movie-card"));
      const query = normalize(value);
      let visible = 0;

      cards.forEach((card) => {
        const text = normalize(card.getAttribute("data-search-text") || card.textContent);
        const matched = !query || text.includes(query);
        card.classList.toggle("hidden", !matched);
        if (matched) {
          visible += 1;
        }
      });

      const count = scope.querySelector("[data-filter-count]");
      if (count) {
        count.textContent = `${visible} 部`;
      }
    };

    document.querySelectorAll("[data-local-filter]").forEach((form) => {
      const input = form.querySelector("[data-filter-input]");
      const parameters = new URLSearchParams(window.location.search);
      const query = parameters.get("q") || "";

      if (input && query) {
        input.value = query;
        applyFilter(form, query);
      }

      if (input) {
        input.addEventListener("input", () => applyFilter(form, input.value));
      }

      form.addEventListener("submit", (event) => {
        event.preventDefault();
        applyFilter(form, input ? input.value : "");
      });
    });
  });
})();
