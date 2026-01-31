(function () {
  var WHATSAPP_NUMBER = "6587675510";

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
})();
