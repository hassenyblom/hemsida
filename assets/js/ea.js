/* Undersidan /ea: skyddad mejladress och kopieringsknappar. Inga kakor, ingen spårning. */
(function () {
  "use strict";

  document.querySelectorAll(".js-mail").forEach(function (a) {
    var addr = a.getAttribute("data-u") + "@" + a.getAttribute("data-d");
    var href = "mailto:" + addr;
    var q = [];
    if (a.hasAttribute("data-subject")) { q.push("subject=" + encodeURIComponent(a.getAttribute("data-subject"))); }
    if (a.hasAttribute("data-body")) { q.push("body=" + encodeURIComponent(decodeURIComponent(a.getAttribute("data-body")).replace(/%0A/g, "\n"))); }
    if (q.length) { href += "?" + q.join("&"); }
    a.setAttribute("href", href);
    if (a.hasAttribute("data-show")) { a.textContent = addr; }
    if (a.hasAttribute("aria-label")) { a.setAttribute("aria-label", "Mejla Hans, " + addr); }
  });

  function done(btn, ok) {
    var label = btn.getAttribute("data-label") || btn.textContent;
    btn.setAttribute("data-label", label);
    btn.textContent = ok ? "Kopierad" : "Markera och kopiera själv";
    btn.classList.toggle("is-done", ok);
    var msg = btn.parentNode.querySelector(".copy-msg");
    if (msg) { msg.textContent = ok ? "Prompten är kopierad. Klistra in den i Copilot Chat." : "Det gick inte att kopiera. Markera texten och kopiera själv."; }
    setTimeout(function () { btn.textContent = label; btn.classList.remove("is-done"); }, 2500);
  }

  document.querySelectorAll(".js-copy").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var el = document.getElementById(btn.getAttribute("data-copy"));
      if (!el) { return; }
      var text = el.textContent;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () { done(btn, true); }, function () { done(btn, false); });
      } else {
        done(btn, false);
      }
    });
  });
})();
