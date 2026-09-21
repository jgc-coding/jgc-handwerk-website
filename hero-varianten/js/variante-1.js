/* ============================================================
   Hero-Variante 1 — "Schichtholz"
   Meldet Zeiger und Scrollweg als Zahlen an den Hero. Das CSS
   (variante-1.css) rechnet daraus die Verschiebung jeder Ebene.
   Keine Bibliothek noetig.
   ============================================================ */

(function () {
  "use strict";

  var LOG = "[JGC Website]";
  var hero = document.querySelector(".v1-hero");
  if (!hero) return;

  var ruhig = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Auftritt ausloesen: zwei Frames warten, damit die Startwerte sicher
  // gemalt sind, bevor die Uebergaenge loslaufen.
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      hero.classList.add("ist-bereit");
    });
  });

  if (ruhig) return;

  /* ---------- Scrollweg ------------------------------------- */

  // Gebuendelt auf einen Frame und nur am Hero geschrieben — nie an :root,
  // das wuerde die ganze Seite neu berechnen lassen.
  var scrollAngefragt = false;
  var letzterWeg = -1;

  function missScroll() {
    scrollAngefragt = false;
    var weg = Math.max(0, Math.min(window.scrollY, hero.offsetHeight + 120));
    if (weg !== letzterWeg) {
      letzterWeg = weg;
      hero.style.setProperty("--sy", String(weg));
    }
  }

  window.addEventListener(
    "scroll",
    function () {
      if (!scrollAngefragt) {
        scrollAngefragt = true;
        requestAnimationFrame(missScroll);
      }
    },
    { passive: true }
  );
  missScroll();

  /* ---------- Zeiger ---------------------------------------- */

  // Nur mit echter Maus. Die Werte laufen dem Zeiger geglaettet hinterher,
  // damit die Ebenen weich nachschwingen statt am Zeiger zu kleben.
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

  var zielX = 0, zielY = 0, mx = 0, my = 0, laeuft = false;

  function takt() {
    mx += (zielX - mx) * 0.075;
    my += (zielY - my) * 0.075;
    hero.style.setProperty("--mx", mx.toFixed(4));
    hero.style.setProperty("--my", my.toFixed(4));
    if (Math.abs(zielX - mx) + Math.abs(zielY - my) > 0.002) requestAnimationFrame(takt);
    else laeuft = false;
  }

  function stosseAn() {
    if (!laeuft) {
      laeuft = true;
      requestAnimationFrame(takt);
    }
  }

  // Am Fenster statt am Hero: die feste Kopfzeile liegt ueber dem Hero und
  // wuerde die Bewegung sonst in ihrem Streifen verschlucken.
  window.addEventListener(
    "pointermove",
    function (e) {
      if (e.pointerType && e.pointerType !== "mouse") return;
      if (window.scrollY > hero.offsetHeight) return;
      zielX = (e.clientX / Math.max(1, window.innerWidth)) * 2 - 1;
      zielY = (e.clientY / Math.max(1, window.innerHeight)) * 2 - 1;
      stosseAn();
    },
    { passive: true }
  );

  document.documentElement.addEventListener("pointerleave", function () {
    zielX = 0;
    zielY = 0;
    stosseAn();
  });

  console.info(LOG + " [INFO] Hero-Variante 1 bereit.");
})();
