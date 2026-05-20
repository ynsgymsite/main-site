(function () {
  var site = {
    logo: "YNSGYM",
    description: "The biggest 24/7 gym in the West - Hyrox, HIIT, Yoga, Pilates and more. Get in touch for a free trial today.",
    navCtaLabel: "Free Trial",
    whatsappNumber: "6587675510",
    footerCopyright: "2025 YNSGYM. All rights reserved.",
    navLinks: [
      { label: "Our Gyms", url: "/gyms/" },
      { label: "Membership", url: "/membership/" },
      { label: "Personal Training", url: "/personal-training/" },
      { label: "Classes", url: "/classes/" },
      { label: "Testimonials", url: "/testimonials/" }
    ],
    contactTopics: [
      "Gym Tour",
      "Gym Trial",
      "Personal Training",
      "Group Classes",
      "Current Promotions",
      "Others"
    ]
  };

  function toJS(value, fallback) {
    if (!value) return fallback;
    if (typeof value.toJS === "function") return value.toJS();
    return value;
  }

  function getData(entry) {
    return toJS(entry && entry.getIn && entry.getIn(["data"]), {});
  }

  function list(items) {
    return Array.isArray(items) ? items : [];
  }

  function text(value, fallback) {
    return value === undefined || value === null || value === "" ? fallback : value;
  }

  function escapeHtml(value) {
    return String(value === undefined || value === null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function attr(value) {
    return escapeHtml(value);
  }

  function getH() {
    if (window.h) return window.h;
    if (window.React && window.React.createElement) return window.React.createElement;
    return null;
  }

  function el(tag, props) {
    var children = Array.prototype.slice.call(arguments, 2);
    return getH().apply(null, [tag, props || {}].concat(children));
  }

  function renderNav(navCtaHref, activeUrl) {
    var links = site.navLinks.map(function (link) {
      var active = link.url === activeUrl ? ' class="active"' : "";
      return '<a href="' + attr(link.url) + '"' + active + ">" + escapeHtml(link.label) + "</a>";
    }).join("");

    return [
      '<header class="nav">',
      '<div class="nav__inner">',
      '<a href="/" class="nav__logo">' + escapeHtml(site.logo) + "</a>",
      '<nav id="nav-links" class="nav__links" data-open="false">',
      links,
      '<a href="' + attr(navCtaHref) + '" class="btn btn--primary nav__cta--mobile">' + escapeHtml(site.navCtaLabel) + "</a>",
      "</nav>",
      '<a href="' + attr(navCtaHref) + '" class="btn btn--primary nav__cta">' + escapeHtml(site.navCtaLabel) + "</a>",
      '<button type="button" id="nav-toggle" class="nav__toggle" aria-label="Toggle menu" aria-expanded="false"><span></span><span></span><span></span></button>',
      "</div>",
      "</header>",
      '<div id="nav-overlay" class="nav__overlay" data-open="false" aria-hidden="true"></div>'
    ].join("");
  }

  function renderOptions(selected) {
    return ['<option value="">Choose an option</option>'].concat(site.contactTopics.map(function (topic) {
      var selectedAttr = topic === selected ? " selected" : "";
      return '<option value="' + attr(topic) + '"' + selectedAttr + ">" + escapeHtml(topic) + "</option>";
    })).join("");
  }

  function renderShell(options) {
    return [
      "<!DOCTYPE html>",
      '<html lang="en">',
      "<head>",
      '<meta charset="UTF-8">',
      '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
      "<title>" + escapeHtml(options.title) + "</title>",
      '<meta name="description" content="' + attr(site.description) + '">',
      '<link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png">',
      '<link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png">',
      '<link rel="shortcut icon" href="/favicon/favicon.ico">',
      '<link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png">',
      '<link rel="manifest" href="/favicon/site.webmanifest">',
      '<link rel="preconnect" href="https://fonts.googleapis.com">',
      '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>',
      '<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=Syne:wght@600;700;800&display=swap" rel="stylesheet">',
      '<link rel="stylesheet" href="/styles.css">',
      '<style>html,body{min-height:100%;} body{margin:0;} .nav{position:sticky;} .cms-preview-note{position:fixed;right:16px;bottom:16px;z-index:50;border:1px solid rgba(255,255,255,.16);border-radius:999px;background:rgba(12,12,13,.78);color:#f8fafc;padding:8px 12px;font:600 12px/1.2 DM Sans,sans-serif;backdrop-filter:blur(12px);}</style>',
      "</head>",
      '<body class="' + attr(options.bodyClass) + '" data-whatsapp="' + attr(site.whatsappNumber) + '">',
      renderNav(options.navCtaHref, options.activeUrl),
      "<main>",
      options.content,
      "</main>",
      '<footer class="site-footer"><p>&copy; ' + escapeHtml(site.footerCopyright) + "</p></footer>",
      '<div class="cms-preview-note">CMS live preview</div>',
      '<script src="/js/main.js"></script>',
      options.extraScripts || "",
      "</body>",
      "</html>"
    ].join("");
  }

  function renderFeatureList(features) {
    return list(features).map(function (feature) {
      return "<li>" + escapeHtml(feature) + "</li>";
    }).join("");
  }

  function renderMembershipPlan(plan, isFounding) {
    plan = plan || {};
    var badge = text(plan.badge, "");
    var ctaStyle = text(plan.ctaStyle, "btn--outline");
    var highlight = !isFounding && ctaStyle === "btn--primary" ? " card--highlight" : "";

    if (isFounding) {
      return [
        '<article class="card card--plan card--founding">',
        '<div class="founding-glow"></div>',
        badge ? '<span class="badge badge--founding">' + escapeHtml(badge) + "</span>" : "",
        '<p class="plan-name">' + escapeHtml(text(plan.name, "Membership Plan")) + "</p>",
        '<p class="plan-price"><span class="accent">' + escapeHtml(text(plan.price, "$0")) + '</span> <span class="unit">' + escapeHtml(text(plan.unit, "/month")) + "</span></p>",
        '<ul class="plan-features">' + renderFeatureList(plan.features) + "</ul>",
        '<a href="#membership-contact" class="btn ' + attr(ctaStyle) + ' btn--block plan-cta" data-plan="' + attr(text(plan.dataPlan, "")) + '">' + escapeHtml(text(plan.ctaLabel, "Get Started")) + "</a>",
        "</article>"
      ].join("");
    }

    return [
      '<article class="card card--plan card--tall' + highlight + '">',
      badge ? '<span class="badge">' + escapeHtml(badge) + "</span>" : "",
      '<p class="plan-name">' + escapeHtml(text(plan.name, "Membership Plan")) + "</p>",
      '<p class="plan-price"><span class="accent">' + escapeHtml(text(plan.price, "$0")) + '</span> <span class="unit">' + escapeHtml(text(plan.unit, "/month")) + "</span></p>",
      '<ul class="plan-features">' + renderFeatureList(plan.features) + "</ul>",
      '<a href="#membership-contact" class="btn ' + attr(ctaStyle) + ' plan-cta" data-plan="' + attr(text(plan.dataPlan, "")) + '">' + escapeHtml(text(plan.ctaLabel, "Get Started")) + "</a>",
      "</article>"
    ].join("");
  }

  function membershipPageHtml(data) {
    var hero = data.hero || {};
    var plans = list(data.plans);
    var foundingPlans = plans.filter(function (plan) { return plan && plan.isFounding; });
    var standardPlans = plans.filter(function (plan) { return !plan || !plan.isFounding; });

    var content = [
      '<section class="page-hero">',
      '<p class="eyebrow">' + escapeHtml(text(hero.eyebrow, "Membership")) + "</p>",
      '<h1 class="heading-xl">' + escapeHtml(text(hero.heading, "Plan your")) + ' <span class="accent">' + escapeHtml(text(hero.accent, "comeback")) + "</span></h1>",
      "</section>",
      '<section class="section">',
      '<div class="l-wrap">',
      '<div class="contact-block__copy" style="text-align: center; margin-bottom: var(--space-2xl);">',
      '<h2 class="heading-lg">Membership Plans</h2>',
      "<p>All tiers include 24/7 access, full gym floor, and community events.</p>",
      "</div>",
      foundingPlans.map(function (plan) { return renderMembershipPlan(plan, true); }).join(""),
      '<div class="card-grid card-grid--plans" style="max-width: 1000px; margin-inline: auto; margin-top: var(--space-xl);">',
      standardPlans.map(function (plan) { return renderMembershipPlan(plan, false); }).join(""),
      "</div>",
      "</div>",
      "</section>",
      '<section class="strip-cta">',
      '<div class="l-wrap">',
      '<h2 class="heading-lg">Want results <span class="accent">faster</span>?</h2>',
      "<p>Add 1:1 personal training for tailored programming, accountability, and technique coaching.</p>",
      '<a href="/personal-training/" class="btn btn--primary">View Personal Training</a>',
      "</div>",
      "</section>",
      '<section id="membership-contact" class="section">',
      '<div class="l-wrap">',
      '<div class="contact-block">',
      '<div class="contact-block__grid">',
      '<div class="contact-block__copy">',
      '<h2 class="heading-lg">Let\'s talk <span class="accent">membership</span></h2>',
      "<p>Share a few details and the tier you're interested in. We'll get in touch to walk you through availability and next steps.</p>",
      "</div>",
      '<form class="contact-form" action="#" method="post">',
      '<div class="form-grid">',
      '<div class="form-group"><label for="mem-first">First Name</label><input type="text" id="mem-first" name="first_name" required></div>',
      '<div class="form-group"><label for="mem-last">Last Name</label><input type="text" id="mem-last" name="last_name" required></div>',
      '<div class="form-group"><label for="mem-email">Email</label><input type="email" id="mem-email" name="email" required></div>',
      '<div class="form-group"><label for="mem-phone">Phone</label><input type="tel" id="mem-phone" name="phone" required></div>',
      '<div class="form-group full"><label for="mem-topic">Topic</label><select id="mem-topic" name="topic" required>' + renderOptions("") + "</select></div>",
      '<div class="form-group full"><label for="mem-message">Message</label><textarea id="mem-message" name="message" rows="4" placeholder="Tell us what you need..."></textarea></div>',
      "</div>",
      '<button type="submit" class="btn btn--primary btn--block">Send Message</button>',
      "</form>",
      "</div>",
      "</div>",
      "</div>",
      "</section>"
    ].join("");

    return renderShell({
      title: "YNSGYM - Membership",
      bodyClass: "page-membership",
      navCtaHref: "#membership-contact",
      activeUrl: "/membership/",
      content: content,
      extraScripts: '<script>document.querySelectorAll(".plan-cta").forEach(function(btn){btn.addEventListener("click",function(){var plan=this.getAttribute("data-plan");if(plan){setTimeout(function(){var topicSelect=document.getElementById("mem-topic");var messageField=document.getElementById("mem-message");if(topicSelect){topicSelect.value="Others";}if(messageField){messageField.value="I\\\'m interested in the "+plan+" membership plan.";}} ,100);}});});</script>'
    });
  }

  function renderSessionPack(pack) {
    pack = pack || {};
    return [
      '<a href="#pt-contact" class="pt-session-card pt-pack-cta" data-pack="' + attr(text(pack.sessions, "Session Pack") + " (" + text(pack.pricePerSession, "$0") + "/session)") + '" data-shopify-product="' + attr(text(pack.shopifyProduct, "")) + '">',
      '<p class="pt-session-card__sessions">' + escapeHtml(text(pack.sessions, "Session Pack")) + "</p>",
      '<p class="pt-session-card__price"><span class="pt-session-card__amount">' + escapeHtml(text(pack.pricePerSession, "$0")) + '</span><span class="pt-session-card__unit">/session</span></p>',
      "</a>"
    ].join("");
  }

  function personalTrainingPageHtml(data) {
    var intro = data.introPack || {};
    var sessionPacks = list(data.sessionPacks);

    var content = [
      '<section class="page-hero">',
      '<p class="eyebrow">Personal Training</p>',
      '<h1 class="heading-xl">Workouts built <span class="accent" style="white-space: nowrap;">just for you</span></h1>',
      "</section>",
      '<section class="section">',
      '<div class="l-wrap">',
      '<h2 class="heading-lg" style="text-align: center; margin-bottom: var(--space-2xl);">Why train <span class="accent">1:1</span> with us?</h2>',
      '<div class="card-grid">',
      '<article class="card card--feature"><div class="card__num">01</div><h3 class="heading-md">Tailored to your goals</h3><p>Whether you\'re starting out, coming back, or chasing a target - every session is built around you.</p></article>',
      '<article class="card card--feature"><div class="card__num">02</div><h3 class="heading-md">Trainers you vibe with</h3><p>Work with male or female coaches who match your style, schedule, and confidence level.</p></article>',
      '<article class="card card--feature"><div class="card__num">03</div><h3 class="heading-md">Real coaching, not guessing</h3><p>Technique check, progression, and accountability so you see actual progress.</p></article>',
      "</div>",
      "</div>",
      "</section>",
      '<section class="section section--lg" style="background: var(--color-surface);">',
      '<div class="l-wrap">',
      '<div class="pt-pricing-layout">',
      '<div class="pt-pricing-layout__copy">',
      '<h2 class="heading-xl">train with <span class="accent italic">PURPOSE</span></h2>',
      '<p class="pt-pricing-layout__desc">Get expert guidance with one-on-one coaching designed around your body, your schedule, and the results you want to achieve.</p>',
      '<div class="pt-pricing-layout__perk">',
      '<p class="pt-pricing-layout__perk-title">FREE ADVANCED BODY COMPOSITION SCAN</p>',
      '<ul class="pt-pricing-layout__perk-list"><li>Evolt 360 body scan</li><li>Body fat and muscle Percentage</li><li>Data-based workout plans</li></ul>',
      "</div>",
      "</div>",
      '<div class="pt-pricing-layout__cards">',
      '<a href="#pt-contact" class="pt-intro-card pt-pack-cta" data-pack="' + attr(text(intro.label, "INTRO PACK") + " - " + text(intro.sessionsText, "3 SESSIONS FOR") + " " + text(intro.price, "$180")) + '">',
      '<p class="pt-intro-card__label">' + escapeHtml(text(intro.label, "INTRO PACK")) + "</p>",
      '<p class="pt-intro-card__price">' + escapeHtml(text(intro.sessionsText, "3 SESSIONS FOR")) + ' <span class="pt-intro-card__amount">' + escapeHtml(text(intro.price, "$180")) + "</span></p>",
      '<p class="pt-intro-card__note">' + escapeHtml(text(intro.note, "*valid for first PT purchase only")) + "</p>",
      "</a>",
      '<div class="pt-session-grid">' + sessionPacks.map(renderSessionPack).join("") + "</div>",
      "</div>",
      "</div>",
      "</div>",
      "</section>",
      '<section class="section">',
      '<div class="l-wrap">',
      '<h2 class="heading-lg" style="text-align: center; margin-bottom: var(--space-2xl);">Is personal training <span class="accent">right for you</span>?</h2>',
      '<div class="card-grid">',
      '<article class="card card--feature"><div class="card__media"><img src="/public/pt-1.jpeg" alt=""></div><h3 class="heading-md">You\'re new or restarting</h3><p>Get a safe, confidence-building plan instead of wandering the gym floor.</p></article>',
      '<article class="card card--feature"><div class="card__media"><img src="/public/pt-2.jpeg" alt=""></div><h3 class="heading-md">You want faster results</h3><p>Dial in your training with a coach who tracks your reps and tweaks your form.</p></article>',
      '<article class="card card--feature"><div class="card__media"><img src="/public/pt-3.jpeg" alt=""></div><h3 class="heading-md">You\'re chasing something big</h3><p>Prep for Hyrox, a shoot, a comeback, or to feel stronger every day.</p></article>',
      "</div>",
      "</div>",
      "</section>",
      '<section id="pt-contact" class="section">',
      '<div class="l-wrap">',
      '<div class="contact-block">',
      '<div class="contact-block__grid">',
      '<div class="contact-block__copy">',
      '<h2 class="heading-lg">Let\'s plan your <span class="accent">PT sessions</span></h2>',
      "<p>Share a few details and when you'd like to train. We'll match you with a coach and lock in your 3-session starter pack.</p>",
      "</div>",
      '<form class="contact-form" action="#" method="post">',
      '<div class="form-grid">',
      '<div class="form-group"><label for="pt-first">First Name</label><input type="text" id="pt-first" name="first_name" required></div>',
      '<div class="form-group"><label for="pt-last">Last Name</label><input type="text" id="pt-last" name="last_name" required></div>',
      '<div class="form-group"><label for="pt-email">Email</label><input type="email" id="pt-email" name="email" required></div>',
      '<div class="form-group"><label for="pt-phone">Phone</label><input type="tel" id="pt-phone" name="phone" required></div>',
      '<div class="form-group full"><label for="pt-topic">Topic</label><select id="pt-topic" name="topic" required>' + renderOptions("") + "</select></div>",
      '<div class="form-group full"><label for="pt-message">Message</label><textarea id="pt-message" name="message" rows="4" placeholder="Tell us what you need..."></textarea></div>',
      "</div>",
      '<button type="submit" class="btn btn--primary btn--block">Send Message</button>',
      "</form>",
      "</div>",
      "</div>",
      "</div>",
      "</section>"
    ].join("");

    return renderShell({
      title: "YNSGYM - Personal Training",
      bodyClass: "page-pt",
      navCtaHref: "#pt-contact",
      activeUrl: "/personal-training/",
      content: content,
      extraScripts: '<script>document.querySelectorAll(".pt-pack-cta").forEach(function(card){card.addEventListener("click",function(){var pack=this.getAttribute("data-pack");if(pack){setTimeout(function(){var topicSelect=document.getElementById("pt-topic");var messageField=document.getElementById("pt-message");if(topicSelect){topicSelect.value="Personal Training";}if(messageField){messageField.value="I\\\'m interested in the "+pack+" package.";}} ,100);}});});</script>'
    });
  }

  function SitePreviewFrame(props, pageHtml) {
    return el("iframe", {
      title: props.title,
      srcDoc: pageHtml,
      style: {
        width: "100%",
        minHeight: "100vh",
        height: "100vh",
        border: "0",
        display: "block",
        background: "#0c0c0d"
      }
    });
  }

  function MembershipPreview(props) {
    return SitePreviewFrame({ title: "Membership preview" }, membershipPageHtml(getData(props.entry)));
  }

  function PersonalTrainingPreview(props) {
    return SitePreviewFrame({ title: "Personal Training preview" }, personalTrainingPageHtml(getData(props.entry)));
  }

  var didInit = false;

  function registerPreviews() {
    if (!window.CMS || !getH()) return false;
    window.CMS.registerPreviewTemplate("membership", MembershipPreview);
    window.CMS.registerPreviewTemplate("plans", MembershipPreview);
    window.CMS.registerPreviewTemplate("pt", PersonalTrainingPreview);
    window.CMS.registerPreviewTemplate("content", PersonalTrainingPreview);
    if (!didInit && window.CMS.init) {
      didInit = true;
      window.CMS.init();
    }
    if (window.console && window.console.info) {
      window.console.info("YNSGYM CMS previews registered: membership, plans, pt, content");
    }
    return true;
  }

  if (!registerPreviews()) {
    window.addEventListener("load", registerPreviews);
  }
})();
