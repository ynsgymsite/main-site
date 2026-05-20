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

  function renderNav(navCtaHref, activeUrl, siteData) {
    siteData = siteData || site;
    var links = list(siteData.navLinks).map(function (link) {
      var active = link.url === activeUrl ? ' class="active"' : "";
      return '<a href="' + attr(link.url) + '"' + active + ">" + escapeHtml(link.label) + "</a>";
    }).join("");

    return [
      '<header class="nav">',
      '<div class="nav__inner">',
      '<a href="/" class="nav__logo">' + escapeHtml(text(siteData.logo, site.logo)) + "</a>",
      '<nav id="nav-links" class="nav__links" data-open="false">',
      links,
      '<a href="' + attr(navCtaHref) + '" class="btn btn--primary nav__cta--mobile">' + escapeHtml(text(siteData.navCtaLabel, site.navCtaLabel)) + "</a>",
      "</nav>",
      '<a href="' + attr(navCtaHref) + '" class="btn btn--primary nav__cta">' + escapeHtml(text(siteData.navCtaLabel, site.navCtaLabel)) + "</a>",
      '<button type="button" id="nav-toggle" class="nav__toggle" aria-label="Toggle menu" aria-expanded="false"><span></span><span></span><span></span></button>',
      "</div>",
      "</header>",
      '<div id="nav-overlay" class="nav__overlay" data-open="false" aria-hidden="true"></div>'
    ].join("");
  }

  function renderOptions(selected, siteData) {
    siteData = siteData || site;
    return ['<option value="">Choose an option</option>'].concat(list(siteData.contactTopics).map(function (topic) {
      var selectedAttr = topic === selected ? " selected" : "";
      return '<option value="' + attr(topic) + '"' + selectedAttr + ">" + escapeHtml(topic) + "</option>";
    })).join("");
  }

  function renderShell(options) {
    var siteData = options.siteData || site;
    return [
      "<!DOCTYPE html>",
      '<html lang="en">',
      "<head>",
      '<meta charset="UTF-8">',
      '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
      "<title>" + escapeHtml(options.title) + "</title>",
      '<meta name="description" content="' + attr(text(siteData.description, site.description)) + '">',
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
      '<body class="' + attr(options.bodyClass) + '" data-whatsapp="' + attr(text(siteData.whatsappNumber, site.whatsappNumber)) + '">',
      renderNav(options.navCtaHref, options.activeUrl, siteData),
      "<main>",
      options.content,
      "</main>",
      '<footer class="site-footer"><p>' + escapeHtml(text(siteData.footerCopyright, site.footerCopyright)) + "</p></footer>",
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

  function scriptJson(value) {
    return JSON.stringify(value || {})
      .replace(/<\//g, "<\\/")
      .replace(/</g, "\\u003c");
  }

  function siteSettingsPageHtml(data) {
    var siteData = {
      logo: text(data.logo, site.logo),
      description: text(data.description, site.description),
      navCtaLabel: text(data.navCtaLabel, site.navCtaLabel),
      whatsappNumber: text(data.whatsappNumber, site.whatsappNumber),
      footerCopyright: text(data.footerCopyright, site.footerCopyright),
      navLinks: list(data.navLinks).length ? list(data.navLinks) : site.navLinks,
      contactTopics: list(data.contactTopics).length ? list(data.contactTopics) : site.contactTopics
    };

    var content = [
      '<section class="hero-full">',
      '<h1 class="hero-full__title heading-hero">Ready to <span class="accent italic">SNAP?</span></h1>',
      '<p class="hero-full__tagline">The biggest 24/7 gym in the West - Hyrox, HIIT, Yoga, Pilates and more.</p>',
      '<div class="hero-full__actions">',
      '<a href="/classes/" class="btn btn--primary">Group Classes</a>',
      '<a href="/membership/" class="btn btn--outline">Membership</a>',
      '<a href="#contact" class="btn btn--outline">Get in Touch</a>',
      "</div>",
      "</section>",
      '<section id="contact" class="section">',
      '<div class="l-wrap">',
      '<div class="contact-block">',
      '<div class="contact-block__grid">',
      '<div class="contact-block__copy">',
      '<h2 class="heading-lg">Site settings <span class="accent">preview</span></h2>',
      '<p>This preview shows the edited logo, navigation, CTA label, contact topics, WhatsApp number, meta description, and footer.</p>',
      '<p><strong>WhatsApp:</strong> ' + escapeHtml(siteData.whatsappNumber) + "</p>",
      "</div>",
      '<form class="contact-form" action="#" method="post">',
      '<div class="form-grid">',
      '<div class="form-group"><label for="site-first">First Name</label><input type="text" id="site-first" name="first_name" required></div>',
      '<div class="form-group"><label for="site-last">Last Name</label><input type="text" id="site-last" name="last_name" required></div>',
      '<div class="form-group"><label for="site-email">Email</label><input type="email" id="site-email" name="email" required></div>',
      '<div class="form-group"><label for="site-phone">Phone</label><input type="tel" id="site-phone" name="phone" required></div>',
      '<div class="form-group full"><label for="site-topic">Topic</label><select id="site-topic" name="topic" required>' + renderOptions("", siteData) + "</select></div>",
      '<div class="form-group full"><label for="site-message">Message</label><textarea id="site-message" name="message" rows="4" placeholder="Tell us what you need..."></textarea></div>',
      "</div>",
      '<button type="submit" class="btn btn--primary btn--block">Send Message</button>',
      "</form>",
      "</div>",
      "</div>",
      "</div>",
      "</section>"
    ].join("");

    return renderShell({
      title: "YNSGYM - Site Settings",
      bodyClass: "page-home",
      navCtaHref: "#contact",
      activeUrl: "/",
      siteData: siteData,
      content: content
    });
  }

  function renderClassTile(cls, index) {
    cls = cls || {};
    var key = text(cls.key, "class-" + index);
    return [
      '<button type="button" class="class-tile" data-class="' + attr(key) + '">',
      '<span style="background-image: url(\'' + attr(text(cls.image, "/public/classes.jpeg")) + '\');"></span>',
      "<h3>" + escapeHtml(text(cls.name, "Class")) + "</h3>",
      cls.isFree ? '<span class="class-tile__badge class-tile__badge--free">Free</span>' : "",
      "</button>"
    ].join("");
  }

  function classesPageHtml(data) {
    var classes = list(data.classes);
    var classData = {};
    classes.forEach(function (cls, index) {
      cls = cls || {};
      classData[text(cls.key, "class-" + index)] = {
        title: text(cls.name, "Class"),
        image: text(cls.image, "/public/classes.jpeg"),
        price: text(cls.price, "Free with Membership"),
        isFree: !!cls.isFree,
        desc: text(cls.desc, ""),
        features: list(cls.features)
      };
    });

    var content = [
      '<section class="page-hero">',
      '<p class="eyebrow">Group Classes</p>',
      '<h1 class="heading-xl">Classes that make you <span class="accent" style="white-space: nowrap;">show up</span></h1>',
      "</section>",
      '<section class="section">',
      '<div class="l-wrap">',
      '<div class="section-header"><h2 class="heading-lg">Explore our <span class="accent">classes</span></h2><p>Train together, push each other, get better together.</p></div>',
      '<div class="class-tiles class-tiles--centered">' + classes.map(renderClassTile).join("") + "</div>",
      "</div>",
      "</section>",
      '<section id="classes-contact" class="section">',
      '<div class="l-wrap"><div class="contact-block"><div class="contact-block__grid">',
      '<div class="contact-block__copy"><h2 class="heading-lg">Plan your <span class="accent">class schedule</span></h2><p>Share a few details and which classes you are interested in. We will get in touch to help you build your weekly routine.</p></div>',
      '<form class="contact-form" action="#" method="post"><div class="form-grid">',
      '<div class="form-group"><label for="cls-first">First Name</label><input type="text" id="cls-first" name="first_name" required></div>',
      '<div class="form-group"><label for="cls-last">Last Name</label><input type="text" id="cls-last" name="last_name" required></div>',
      '<div class="form-group"><label for="cls-email">Email</label><input type="email" id="cls-email" name="email" required></div>',
      '<div class="form-group"><label for="cls-phone">Phone</label><input type="tel" id="cls-phone" name="phone" required></div>',
      '<div class="form-group full"><label for="cls-topic">Topic</label><select id="cls-topic" name="topic" required>' + renderOptions("") + "</select></div>",
      '<div class="form-group full"><label for="cls-message">Message</label><textarea id="cls-message" name="message" rows="4" placeholder="Tell us what you need..."></textarea></div>',
      '</div><button type="submit" class="btn btn--primary btn--block">Send Message</button></form>',
      "</div></div></div>",
      "</section>",
      '<div id="class-modal" class="class-modal" aria-hidden="true"><div class="class-modal__overlay"></div><div class="class-modal__content"><button type="button" class="class-modal__close" aria-label="Close modal">&times;</button><div class="class-modal__image" id="modal-image"></div><div class="class-modal__body"><h3 class="heading-lg" id="modal-title"></h3><p class="class-modal__price" id="modal-price"></p><p class="class-modal__desc" id="modal-desc"></p><ul class="class-modal__features" id="modal-features"></ul><a href="#classes-contact" class="btn btn--primary btn--block class-modal__cta" id="modal-cta">Book This Class</a></div></div></div>'
    ].join("");

    return renderShell({
      title: "YNSGYM - Classes",
      bodyClass: "page-classes",
      navCtaHref: "#classes-contact",
      activeUrl: "/classes/",
      content: content,
      extraScripts: '<script>var classData=' + scriptJson(classData) + ';var modal=document.getElementById("class-modal");var currentClass=null;function openModal(classKey){var data=classData[classKey];if(!data)return;currentClass=data;document.getElementById("modal-image").style.backgroundImage="url("+data.image+")";document.getElementById("modal-title").textContent=data.title;document.getElementById("modal-price").textContent=data.price;document.getElementById("modal-price").className="class-modal__price"+(data.isFree?" class-modal__price--free":"");document.getElementById("modal-desc").textContent=data.desc;document.getElementById("modal-features").innerHTML=(data.features||[]).map(function(f){return "<li>"+f+"</li>";}).join("");modal.setAttribute("aria-hidden","false");document.body.style.overflow="hidden";}function closeModal(){modal.setAttribute("aria-hidden","true");document.body.style.overflow="";currentClass=null;}document.querySelectorAll(".class-tile[data-class]").forEach(function(tile){tile.addEventListener("click",function(){openModal(this.getAttribute("data-class"));});});modal.querySelector(".class-modal__close").addEventListener("click",closeModal);modal.querySelector(".class-modal__overlay").addEventListener("click",closeModal);document.getElementById("modal-cta").addEventListener("click",function(){var className=currentClass?currentClass.title:"Group Classes";closeModal();setTimeout(function(){var topicSelect=document.getElementById("cls-topic");var messageField=document.getElementById("cls-message");if(topicSelect){topicSelect.value="Group Classes";}if(messageField){messageField.value="I\\\'m interested in the "+className+" class. Please send me more information about schedules and availability.";}} ,100);});</script>'
    });
  }

  function renderTestimonial(t, index) {
    t = t || {};
    var tags = list(t.tags).map(function (tag) {
      tag = tag || {};
      return '<a href="' + attr(text(tag.url, "#")) + '">' + escapeHtml(text(tag.label, "Tag")) + "</a>";
    }).join("");
    var stats = list(t.stats).map(function (stat) {
      stat = stat || {};
      return '<li><span>' + escapeHtml(text(stat.label, "Stat")) + '</span><strong>' + escapeHtml(text(stat.value, "")) + "</strong></li>";
    }).join("");

    return [
      '<article class="testimonial-card" key="testimonial-' + index + '">',
      '<div class="testimonial-card__top">',
      '<div class="testimonial-card__avatar"><img src="' + attr(text(t.avatar, "/public/avatar-1.png")) + '" alt="Portrait for ' + attr(text(t.name, "Member")) + '" onerror="this.style.display=\'none\'"></div>',
      '<div class="testimonial-card__identity"><p class="testimonial-card__name">' + escapeHtml(text(t.name, "Member")) + '</p><p class="testimonial-card__role"><span>' + escapeHtml(text(t.role, "")) + '</span><span>' + escapeHtml(text(t.duration, "")) + '</span></p><div class="testimonial-card__tags">' + tags + "</div></div>",
      "</div>",
      '<div class="testimonial-card__stats"><p class="testimonial-card__stats-title">Big Wins</p><ul class="testimonial-card__stats-list">' + stats + "</ul></div>",
      '<div class="testimonial-card__quote">"' + escapeHtml(text(t.quote, "")) + '"</div>',
      "</article>"
    ].join("");
  }

  function testimonialsPageHtml(data) {
    var testimonials = list(data.testimonials);
    var content = [
      '<section class="page-hero"><p class="eyebrow">Testimonials</p><h1 class="heading-xl">Meet the crew who <span class="accent">train here</span></h1></section>',
      '<section class="section"><div class="l-wrap">',
      '<div class="section-header"><p class="eyebrow">Member Results</p><h2 class="heading-lg">Proof that <span class="accent">consistency wins</span></h2><p>Real members, real numbers, and stories from the community that trains here every week.</p></div>',
      '<div class="testimonial-carousel" data-testimonial-carousel><div class="testimonial-carousel__viewport" data-carousel-viewport tabindex="0" aria-label="Testimonials carousel"><div class="testimonial-grid">' + testimonials.map(renderTestimonial).join("") + '</div></div><div class="testimonial-carousel__controls" aria-hidden="true"><button type="button" class="carousel-btn" data-carousel-prev aria-label="Previous testimonial">Prev</button><div class="testimonial-carousel__dots" data-carousel-dots aria-hidden="true"></div><button type="button" class="carousel-btn" data-carousel-next aria-label="Next testimonial">Next</button></div><p class="testimonial-carousel__hint" aria-hidden="true">Swipe to shuffle</p></div>',
      "</div></section>",
      '<section id="testimonials-contact" class="section"><div class="l-wrap"><div class="contact-block"><div class="contact-block__grid">',
      '<div class="contact-block__copy"><h2 class="heading-lg">Let\'s talk <span class="accent">goals</span></h2><p>Share a few details and what you are looking for. We will get in touch to help you get started.</p></div>',
      '<form class="contact-form" action="#" method="post"><div class="form-grid">',
      '<div class="form-group"><label for="test-first">First Name</label><input type="text" id="test-first" name="first_name" required></div>',
      '<div class="form-group"><label for="test-last">Last Name</label><input type="text" id="test-last" name="last_name" required></div>',
      '<div class="form-group"><label for="test-email">Email</label><input type="email" id="test-email" name="email" required></div>',
      '<div class="form-group"><label for="test-phone">Phone</label><input type="tel" id="test-phone" name="phone" required></div>',
      '<div class="form-group full"><label for="test-topic">Topic</label><select id="test-topic" name="topic" required>' + renderOptions("") + "</select></div>",
      '<div class="form-group full"><label for="test-message">Message</label><textarea id="test-message" name="message" rows="4" placeholder="Tell us what you need..."></textarea></div>',
      '</div><button type="submit" class="btn btn--primary btn--block">Send Message</button></form>',
      "</div></div></div></section>"
    ].join("");

    return renderShell({
      title: "YNSGYM - Testimonials",
      bodyClass: "page-testimonials",
      navCtaHref: "#testimonials-contact",
      activeUrl: "/testimonials/",
      content: content
    });
  }

  function gymsPageHtml(data) {
    var locations = list(data.locations);
    var location = locations[0] || {};
    var name = text(location.name, "Snap Fitness West Mall");
    var address = text(location.address, "1 Bukit Batok Central Link, Level 5, West Mall, Singapore 658713");
    var phone = text(location.phone, "+65 8767 5510");
    var lat = text(location.lat, "1.3499944");
    var lng = text(location.lng, "103.7490556");
    var gallery = ["/public/landing-1.jpeg", "/public/landing-2.jpeg", "/public/landing-3.jpeg", "/public/pt-1.jpeg", "/public/pt-2.jpeg", "/public/gyms.jpeg"];

    var content = [
      '<section class="page-hero"><p class="eyebrow">Our Gyms</p><h1 class="heading-xl">Find your <span class="accent" style="white-space: nowrap;">home base</span></h1></section>',
      '<section class="section"><div class="l-wrap"><div class="map-block"><div class="map-block__map">',
      '<iframe title="' + attr(name) + '" src="https://www.google.com/maps?q=' + attr(lat) + ',' + attr(lng) + '&output=embed" width="100%" height="100%" style="border:0;" allowfullscreen loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
      '</div><div class="map-block__info"><h2 class="heading-lg">' + escapeHtml(name) + "</h2><p>" + escapeHtml(address) + '</p><p><a href="tel:' + attr(phone.replace(/\s+/g, "")) + '" class="link-phone">' + escapeHtml(phone) + "</a></p></div></div></div></section>",
      '<section class="section section--sm"><div class="l-wrap"><h2 class="heading-lg" style="text-align: center; margin-bottom: var(--space-xl);">Take a <span class="accent">look around</span></h2><div class="gallery-carousel" id="gym-gallery"><div class="gallery-carousel__track" id="gallery-track">',
      gallery.map(function (src, index) {
        return '<button class="gallery-carousel__item" data-src="' + attr(src) + '"><img src="' + attr(src) + '" alt="Gym photo ' + (index + 1) + '"></button>';
      }).join(""),
      '</div><div class="gallery-scrollbar" id="gallery-scrollbar"><div class="gallery-scrollbar__thumb" id="gallery-scrollbar-thumb"></div></div></div></div></section>',
      '<div id="gallery-modal" class="gallery-modal" aria-hidden="true"><button class="gallery-modal__close" aria-label="Close">&times;</button><img class="gallery-modal__img" src="" alt="Full size image"></div>',
      '<section id="gyms-contact" class="section"><div class="l-wrap"><div class="contact-block"><div class="contact-block__grid">',
      '<div class="contact-block__copy"><h2 class="heading-lg">Plan your <span class="accent">visit</span></h2><p>Share a few details and when you would like to come. We will get in touch to schedule your tour or trial.</p></div>',
      '<form class="contact-form" action="#" method="post"><div class="form-grid">',
      '<div class="form-group"><label for="gyms-first">First Name</label><input type="text" id="gyms-first" name="first_name" required></div>',
      '<div class="form-group"><label for="gyms-last">Last Name</label><input type="text" id="gyms-last" name="last_name" required></div>',
      '<div class="form-group"><label for="gyms-email">Email</label><input type="email" id="gyms-email" name="email" required></div>',
      '<div class="form-group"><label for="gyms-phone">Phone</label><input type="tel" id="gyms-phone" name="phone" required></div>',
      '<div class="form-group full"><label for="gyms-topic">Topic</label><select id="gyms-topic" name="topic" required>' + renderOptions("") + "</select></div>",
      '<div class="form-group full"><label for="gyms-message">Message</label><textarea id="gyms-message" name="message" rows="4" placeholder="Tell us what you need..."></textarea></div>',
      '</div><button type="submit" class="btn btn--primary btn--block">Send Message</button></form>',
      "</div></div></div></section>"
    ].join("");

    return renderShell({
      title: "YNSGYM - Our Gyms",
      bodyClass: "page-gyms",
      navCtaHref: "#gyms-contact",
      activeUrl: "/gyms/",
      content: content
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

  function SiteSettingsPreview(props) {
    return SitePreviewFrame({ title: "Site settings preview" }, siteSettingsPageHtml(getData(props.entry)));
  }

  function ClassesPreview(props) {
    return SitePreviewFrame({ title: "Classes preview" }, classesPageHtml(getData(props.entry)));
  }

  function TestimonialsPreview(props) {
    return SitePreviewFrame({ title: "Testimonials preview" }, testimonialsPageHtml(getData(props.entry)));
  }

  function ListPreview(props) {
    var data = getData(props.entry);
    if (data.testimonials) return TestimonialsPreview(props);
    return ClassesPreview(props);
  }

  function GymsPreview(props) {
    return SitePreviewFrame({ title: "Gyms preview" }, gymsPageHtml(getData(props.entry)));
  }

  var didInit = false;

  function registerPreviews() {
    if (!window.CMS || !getH()) return false;
    window.CMS.registerPreviewTemplate("membership", MembershipPreview);
    window.CMS.registerPreviewTemplate("plans", MembershipPreview);
    window.CMS.registerPreviewTemplate("pt", PersonalTrainingPreview);
    window.CMS.registerPreviewTemplate("content", PersonalTrainingPreview);
    window.CMS.registerPreviewTemplate("site", SiteSettingsPreview);
    window.CMS.registerPreviewTemplate("global", SiteSettingsPreview);
    window.CMS.registerPreviewTemplate("classes", ClassesPreview);
    window.CMS.registerPreviewTemplate("list", ListPreview);
    window.CMS.registerPreviewTemplate("testimonials", TestimonialsPreview);
    window.CMS.registerPreviewTemplate("gyms", GymsPreview);
    window.CMS.registerPreviewTemplate("locations", GymsPreview);
    if (!didInit && window.CMS.init) {
      didInit = true;
      window.CMS.init();
    }
    if (window.console && window.console.info) {
      window.console.info("YNSGYM CMS previews registered: site, membership, pt, classes, testimonials, gyms");
    }
    return true;
  }

  if (!registerPreviews()) {
    window.addEventListener("load", registerPreviews);
  }
})();
