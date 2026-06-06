(function () {
  var WHATSAPP_NUMBER = document.body.getAttribute("data-whatsapp") || "6587675510";

  // Touch-friendly hover effects for mobile
  var touchElements = [
    ".btn",
    ".bento__item",
    ".card",
    ".pt-intro-card",
    ".pt-session-card",
    ".class-tile",
    ".gallery-carousel__item",
    ".nav__links a",
    ".testimonial-card__tags a",
    ".carousel-btn"
  ];

  var isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;

  if (isTouchDevice) {
    document.querySelectorAll(touchElements.join(", ")).forEach(function (el) {
      el.addEventListener("touchstart", function () {
        this.classList.add("touch-active");
      }, { passive: true });

      el.addEventListener("touchend", function () {
        var element = this;
        setTimeout(function () {
          element.classList.remove("touch-active");
        }, 500);
      }, { passive: true });

      el.addEventListener("touchcancel", function () {
        this.classList.remove("touch-active");
      }, { passive: true });
    });
  }

  function buildWhatsAppMessage(form) {
    var data = new FormData(form);
    var parts = [
      "Name: " + (data.get("first_name") || "") + " " + (data.get("last_name") || ""),
      "Email: " + (data.get("email") || ""),
      "Phone: " + (data.get("phone") || ""),
    ];
    var topic = data.get("topic");
    if (topic) parts.push("Topic: " + topic);
    var msg = data.get("message");
    if (msg) parts.push("\nMessage: " + msg);
    return "Hello! I'm interested in getting in touch.\n\n" + parts.join("\n");
  }

  document.querySelectorAll(".contact-form").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var text = encodeURIComponent(buildWhatsAppMessage(form));
      window.open("https://wa.me/" + WHATSAPP_NUMBER + "?text=" + text, "_blank");
    });
  });

  document.querySelectorAll("[data-autofill-form]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var prefix = this.getAttribute("data-autofill-form");
      var topic = this.getAttribute("data-autofill-topic") || "";
      var message = this.getAttribute("data-autofill-message") || "";
      setTimeout(function () {
        var topicEl = document.getElementById(prefix + "-topic");
        var msgEl = document.getElementById(prefix + "-message");
        if (topicEl && topic) topicEl.value = topic;
        if (msgEl && message) msgEl.value = message;
      }, 100);
    });
  });

  var toggle = document.getElementById("nav-toggle");
  var links = document.getElementById("nav-links");
  var overlay = document.getElementById("nav-overlay");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", !open);
      if (links) links.setAttribute("data-open", !open);
      if (overlay) overlay.setAttribute("data-open", !open);
    });
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        toggle.setAttribute("aria-expanded", "false");
        links.setAttribute("data-open", "false");
        if (overlay) overlay.setAttribute("data-open", "false");
      });
    });
    if (overlay) {
      overlay.addEventListener("click", function () {
        toggle.setAttribute("aria-expanded", "false");
        links.setAttribute("data-open", "false");
        overlay.setAttribute("data-open", "false");
      });
    }
  }

  var galleryModal = document.getElementById("gallery-modal");
  var galleryModalImg = galleryModal ? galleryModal.querySelector(".gallery-modal__img") : null;
  var galleryModalClose = galleryModal ? galleryModal.querySelector(".gallery-modal__close") : null;

  if (galleryModal && galleryModalImg) {
    document.querySelectorAll(".gallery-carousel__item").forEach(function (item) {
      item.addEventListener("click", function () {
        var src = this.getAttribute("data-src");
        galleryModalImg.src = src;
        galleryModal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
      });
    });

    function closeGalleryModal() {
      galleryModal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      galleryModalImg.src = "";
    }

    if (galleryModalClose) {
      galleryModalClose.addEventListener("click", closeGalleryModal);
    }

    galleryModal.addEventListener("click", function (e) {
      if (e.target === galleryModal) {
        closeGalleryModal();
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && galleryModal.getAttribute("aria-hidden") === "false") {
        closeGalleryModal();
      }
    });
  }

  var galleryTrack = document.getElementById("gallery-track");
  var galleryScrollbar = document.getElementById("gallery-scrollbar");
  var galleryThumb = document.getElementById("gallery-scrollbar-thumb");

  if (galleryTrack && galleryScrollbar && galleryThumb) {
    var scrollTicking = false;

    function updateScrollbar() {
      var scrollWidth = galleryTrack.scrollWidth;
      var clientWidth = galleryTrack.clientWidth;
      var scrollLeft = galleryTrack.scrollLeft;
      var thumbWidth = Math.max((clientWidth / scrollWidth) * 100, 20);
      var maxScroll = scrollWidth - clientWidth;
      var thumbLeft = maxScroll > 0 ? (scrollLeft / maxScroll) * (100 - thumbWidth) : 0;
      galleryThumb.style.width = thumbWidth + "%";
      galleryThumb.style.left = thumbLeft + "%";
      scrollTicking = false;
    }

    function onScroll() {
      if (!scrollTicking) {
        requestAnimationFrame(updateScrollbar);
        scrollTicking = true;
      }
    }

    updateScrollbar();
    galleryTrack.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", updateScrollbar);
  }

  // Mobile-only merry-go-round carousel on the testimonials page
  function initTestimonialCarousel() {
    var root = document.querySelector("[data-testimonial-carousel]");
    if (!root) return;

    var viewport = root.querySelector("[data-carousel-viewport]");
    var grid = root.querySelector(".testimonial-grid");
    if (!viewport || !grid) return;

    var cards = Array.prototype.slice.call(grid.querySelectorAll(".testimonial-card"));
    if (cards.length < 2) return;

    var prevBtn = root.querySelector("[data-carousel-prev]");
    var nextBtn = root.querySelector("[data-carousel-next]");
    var dotsWrap = root.querySelector("[data-carousel-dots]");

    var mql = window.matchMedia("(max-width: 760px)");
    var activeIndex = 0;
    var startX = 0;
    var startY = 0;
    var isPointerDown = false;
    var dots = [];

    function clampIndex(i) {
      var n = cards.length;
      return ((i % n) + n) % n;
    }

    function circularOffset(i) {
      var n = cards.length;
      var diff = i - activeIndex;
      if (diff > n / 2) diff -= n;
      if (diff < -n / 2) diff += n;
      return diff;
    }

    function setTabbable(card, enable) {
      card.querySelectorAll("a, button").forEach(function (el) {
        if (enable) {
          var prev = el.getAttribute("data-prev-tabindex");
          if (prev !== null) {
            if (prev === "") el.removeAttribute("tabindex");
            else el.setAttribute("tabindex", prev);
            el.removeAttribute("data-prev-tabindex");
          } else {
            el.removeAttribute("tabindex");
          }
        } else {
          if (!el.hasAttribute("data-prev-tabindex")) {
            el.setAttribute("data-prev-tabindex", el.getAttribute("tabindex") || "");
          }
          el.setAttribute("tabindex", "-1");
        }
      });
    }

    function updateDots() {
      dots.forEach(function (b, i) {
        b.setAttribute("aria-current", i === activeIndex ? "true" : "false");
      });
    }

    function updateHeight() {
      if (!mql.matches) {
        viewport.style.height = "";
        return;
      }
      var active = cards[activeIndex];
      if (!active) return;
      // Cards are absolutely positioned on mobile; set viewport height explicitly.
      viewport.style.height = (active.offsetHeight + 28) + "px";
    }

    function update() {
      var n = cards.length;

      if (!mql.matches) {
        for (var j = 0; j < n; j++) {
          var c = cards[j];
          c.style.removeProperty("--offset");
          c.style.removeProperty("--abs");
          c.removeAttribute("data-active");
          c.removeAttribute("data-hidden");
          c.style.zIndex = "";
          setTabbable(c, true);
        }
        updateDots();
        requestAnimationFrame(updateHeight);
        return;
      }

      for (var i = 0; i < n; i++) {
        var card = cards[i];
        var offset = circularOffset(i);
        var abs = Math.abs(offset);
        var hidden = abs > 2;

        card.style.setProperty("--offset", String(offset));
        card.style.setProperty("--abs", String(abs));
        card.setAttribute("data-active", offset === 0 ? "true" : "false");
        card.setAttribute("data-hidden", hidden ? "true" : "false");
        card.style.zIndex = String(100 - abs);
        setTabbable(card, offset === 0);
      }

      updateDots();
      requestAnimationFrame(updateHeight);
    }

    function go(delta) {
      activeIndex = clampIndex(activeIndex + delta);
      update();
    }

    function goTo(i) {
      activeIndex = clampIndex(i);
      update();
    }

    function ensureDots() {
      if (!dotsWrap) return;
      dotsWrap.innerHTML = "";
      dots = [];
      for (var i = 0; i < cards.length; i++) {
        var b = document.createElement("button");
        b.type = "button";
        b.setAttribute("aria-label", "Go to testimonial " + (i + 1));
        b.addEventListener("click", (function (idx) {
          return function () { goTo(idx); };
        })(i));
        dotsWrap.appendChild(b);
        dots.push(b);
      }
    }

    function onPointerDown(e) {
      if (!mql.matches) return;
      if (e.target && e.target.closest && e.target.closest("a, button")) return;
      if (e.pointerType === "mouse" && e.button !== 0) return;
      isPointerDown = true;
      startX = e.clientX;
      startY = e.clientY;
      if (viewport.setPointerCapture) {
        try { viewport.setPointerCapture(e.pointerId); } catch (err) {}
      }
    }

    function onPointerUp(e) {
      if (!mql.matches) return;
      if (!isPointerDown) return;
      isPointerDown = false;
      if (viewport.releasePointerCapture) {
        try { viewport.releasePointerCapture(e.pointerId); } catch (err) {}
      }

      var dx = e.clientX - startX;
      var dy = e.clientY - startY;
      if (Math.abs(dx) < 35 || Math.abs(dx) < Math.abs(dy)) return;
      go(dx < 0 ? 1 : -1);
    }

    viewport.addEventListener("pointerdown", onPointerDown);
    viewport.addEventListener("pointerup", onPointerUp);
    viewport.addEventListener("pointercancel", function () { isPointerDown = false; });

    viewport.addEventListener("keydown", function (e) {
      if (!mql.matches) return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        go(-1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        go(1);
      }
    });

    if (prevBtn) prevBtn.addEventListener("click", function () { go(-1); });
    if (nextBtn) nextBtn.addEventListener("click", function () { go(1); });

    window.addEventListener("resize", function () {
      update();
    });

    ensureDots();
    update();

    // Recompute after images load.
    window.addEventListener("load", updateHeight);
  }

  initTestimonialCarousel();
})();
