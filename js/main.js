(function () {
  var WHATSAPP_NUMBER = "6587675510";

  // Touch-friendly hover effects for mobile
  var touchElements = [
    ".btn",
    ".bento__item",
    ".card",
    ".pt-intro-card",
    ".pt-session-card",
    ".class-tile",
    ".gallery-carousel__item",
    ".nav__links a"
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
})();
