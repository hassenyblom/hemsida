/* Proximus: vägval, mejlskydd, formulär och lugn rörelse. Inga cookies, ingen spårning. */
(function () {
  "use strict";
  var KEY = "proximus-vag";
  var body = document.body;

  /* 1. Vägval. Sparas bara i besökarens egen webbläsare. */
  function setPath(path, save) {
    if (path === "kontor" || path === "falt") {
      body.setAttribute("data-path", path);
    } else {
      body.removeAttribute("data-path");
      path = "";
    }
    document.querySelectorAll(".choice").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.getAttribute("data-choose") === path));
    });
    if (save) {
      try { path ? localStorage.setItem(KEY, path) : localStorage.removeItem(KEY); } catch (e) {}
    }
    if (window.ScrollTrigger) { window.ScrollTrigger.refresh(); }
  }
  var saved = "";
  try { saved = localStorage.getItem(KEY) || ""; } catch (e) {}
  if (saved) { setPath(saved, false); }

  document.addEventListener("click", function (ev) {
    var b = ev.target.closest("[data-choose]");
    if (!b) { return; }
    var want = b.getAttribute("data-choose");
    var isToggle = b.classList.contains("choice");
    var same = body.getAttribute("data-path") === want;
    var off = isToggle && same;
    setPath(off ? "" : want, true);
    if (!off) {
      var target = document.getElementById("vagen");
      if (target) { target.scrollIntoView({ block: "start" }); }
    }
  });

  /* 2. Mejladressen sätts ihop här, så att spamrobotar inte hittar den i koden. */
  document.querySelectorAll(".js-mail").forEach(function (a) {
    var addr = a.getAttribute("data-u") + "@" + a.getAttribute("data-d");
    a.setAttribute("href", "mailto:" + addr);
    if (a.hasAttribute("data-label")) { a.textContent = a.getAttribute("data-label") + addr; }
    if (a.hasAttribute("data-show")) { a.textContent = addr; }
    if (a.hasAttribute("aria-label")) { a.setAttribute("aria-label", "Mejla Hans, " + addr); }
  });

  /* 3. Formulär som väntar på Tally. Inget skickas ännu. */
  document.querySelectorAll(".js-soon").forEach(function (f) {
    f.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var msg = f.querySelector(".form-msg");
      if (msg) { msg.textContent = "Formuläret kopplas in snart. Inget har skickats."; }
    });
  });

  /* 4. Rörelse. Lugn, och bara om besökaren inte har bett om mindre rörelse. */
  if (!window.gsap || !window.ScrollTrigger) { return; }
  var gsap = window.gsap;
  gsap.registerPlugin(window.ScrollTrigger);
  var mm = gsap.matchMedia();

  mm.add("(prefers-reduced-motion: no-preference)", function () {
    gsap.from(".js-rise", { y: 28, autoAlpha: 0, duration: 1.1, ease: "power3.out", stagger: 0.12 });

    gsap.utils.toArray(".scene .layer").forEach(function (layer) {
      var depth = parseFloat(layer.getAttribute("data-depth")) || 0.1;
      gsap.to(layer, {
        y: function () { return -depth * 260; },
        ease: "none",
        scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 0.6 }
      });
    });

    gsap.fromTo(".js-tilt",
      { rotationY: -22, rotationX: 10 },
      { rotationY: 18, rotationX: 4, ease: "none",
        scrollTrigger: { trigger: ".model", start: "top bottom", end: "bottom top", scrub: 0.8 } });

    gsap.fromTo(".js-pan",
      { xPercent: 9 },
      { xPercent: -9, ease: "none",
        scrollTrigger: { trigger: ".hook", start: "top bottom", end: "bottom top", scrub: 0.8 } });
  });
})();
