/* ============================================================
   Hero-Variante 2 — "Bretterwand"
   Heftet die Buehne beim Scrollen an und oeffnet die Bretterwand:
   die Bretter gleiten abwechselnd nach links und rechts weg, das
   Logo reist an seinen Platz, der Inhalt blendet ein.
   Braucht GSAP + ScrollTrigger (lokal unter assets/vendor/gsap).
   ============================================================ */

(function () {
  "use strict";

  var LOG = "[JGC Website]";
  var wurzel = document.documentElement;
  var hero = document.querySelector(".v2-hero");
  if (!hero) return;

  var buehne = hero.querySelector(".v2-buehne");
  var logo = hero.querySelector(".v2-logo");
  var platz = hero.querySelector(".v2-logoplatz");
  var leitsatz = hero.querySelector(".v2-leitsatz");
  var hinweis = hero.querySelector(".v2-hinweis");
  var bretter = Array.prototype.slice.call(hero.querySelectorAll(".v2-brett"));
  var inhalte = Array.prototype.slice.call(hero.querySelectorAll(".v2-inhalt [data-v2]"));

  /** Zurueck ins Ruhe-Layout: die Wand wird zum Band, der Inhalt steht sichtbar da. */
  function ruheLayout(grund) {
    console.warn(LOG + " [WARN] Hero-Variante 2 laeuft im Ruhe-Layout: " + grund);
    wurzel.classList.remove("bewegt");
  }

  /* ---------- Masse der Wand -------------------------------- */

  // Breite und Hoehe der Buehne in Pixeln an das CSS melden. Vor dem Messen
  // den alten Wert loeschen, sonst haelt er die Buehne auf der alten Hoehe fest.
  function messeWand() {
    buehne.style.removeProperty("--wand-h");
    buehne.style.setProperty("--wand-b", buehne.clientWidth + "px");
    if (wurzel.classList.contains("bewegt")) {
      buehne.style.setProperty("--wand-h", buehne.offsetHeight + "px");
    }
  }

  messeWand();

  var bewegt = wurzel.classList.contains("bewegt");
  var gsapDa = typeof window.gsap !== "undefined" && typeof window.ScrollTrigger !== "undefined";

  if (bewegt && !gsapDa) {
    ruheLayout("GSAP wurde nicht geladen.");
    bewegt = false;
    messeWand();
  }

  if (!bewegt) {
    window.addEventListener("resize", messeWand);
    return;
  }

  /* ---------- Scroll-Szene ---------------------------------- */

  /** Lage eines Elements innerhalb der Buehne, ohne Transforms mitzumessen. */
  function lage(el) {
    var x = 0, y = 0;
    while (el && el !== buehne) {
      x += el.offsetLeft;
      y += el.offsetTop;
      el = el.offsetParent;
    }
    return { x: x, y: y };
  }

  /** Weg und Verkleinerung des Logos von der Wandmitte zu seinem Platz. */
  function logoWeg() {
    var p = lage(platz), l = lage(logo);
    return {
      x: p.x + platz.offsetWidth / 2 - (l.x + logo.offsetWidth / 2),
      y: p.y + platz.offsetHeight / 2 - (l.y + logo.offsetHeight / 2),
      s: platz.offsetWidth / Math.max(1, logo.offsetWidth),
    };
  }

  try {
    var gsap = window.gsap;
    var ScrollTrigger = window.ScrollTrigger;
    gsap.registerPlugin(ScrollTrigger);
    // Die Adressleiste am Handy aendert die Hoehe staendig — nicht jedes Mal neu messen
    ScrollTrigger.config({ ignoreMobileResize: true });

    // Die Wand oeffnet sich von der Mitte her, dort wo das Logo sitzt
    var rang = [3, 2, 1, 0, 0, 1, 2, 3];

    var zeitplan = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: hero,
        start: "top top",
        end: function () {
          return "+=" + Math.round(window.innerHeight * 1.6);
        },
        pin: buehne,
        scrub: 0.7,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: function (self) {
          buehne.style.setProperty("--p", self.progress.toFixed(3));
        },
      },
    });

    // 1. Leitsatz und Hinweis gehen, sobald gescrollt wird. Startwerte
    //    ausdruecklich angeben: beim Aufbau laeuft noch ihr Lade-Auftritt mit
    //    Deckkraft 0 — GSAP wuerde sonst diese 0 als Startwert festschreiben
    //    und beide blieben fuer immer unsichtbar.
    zeitplan.fromTo(
      [leitsatz, hinweis],
      { autoAlpha: 1, y: 0 },
      { autoAlpha: 0, y: -18, duration: 0.09 },
      0
    );

    // 2. Bretter gleiten weg: abwechselnd links/rechts, leicht verkantet
    bretter.forEach(function (brett, i) {
      var seite = i % 2 === 0 ? -1 : 1;
      zeitplan.to(
        brett,
        {
          xPercent: seite * 108,
          rotation: seite * (1.2 + rang[i] * 0.55),
          y: (i - 3.5) * 9,
          ease: "power2.inOut",
          duration: 0.46,
        },
        0.05 + rang[i] * 0.05
      );
    });

    // 3. Logo reist an seinen Platz und legt sich ab (Schatten wird flacher)
    zeitplan.to(
      logo,
      {
        x: function () { return logoWeg().x; },
        y: function () { return logoWeg().y; },
        scale: function () { return logoWeg().s; },
        "--hoehe": 0,
        ease: "power2.inOut",
        duration: 0.42,
      },
      0.27
    );

    // 4. Inhalt blendet gestaffelt ein
    inhalte.forEach(function (el, i) {
      zeitplan.fromTo(
        el,
        { opacity: 0, y: 46, filter: "blur(8px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", ease: "power2.out", duration: 0.22 },
        0.4 + i * 0.055
      );
    });

    // 5. Halt: der weiche Nachlauf des Scrubs schwingt aus, bevor sich die
    //    Anheftung loest (Lehre aus dem Sprung der Projektbahn in 0.2.0).
    zeitplan.to({}, { duration: 0.16 });

    // Schriften und Bilder verschieben die Masse nach dem Laden
    window.addEventListener("load", function () {
      messeWand();
      ScrollTrigger.refresh();
    });

    var wecker = 0;
    window.addEventListener("resize", function () {
      clearTimeout(wecker);
      wecker = setTimeout(function () {
        messeWand();
        ScrollTrigger.refresh();
      }, 180);
    });
  } catch (fehler) {
    console.error(LOG + " [ERROR] Hero-Variante 2: Scroll-Szene fehlgeschlagen:", fehler);
    ruheLayout("Fehler beim Aufbau der Scroll-Szene.");
    messeWand();
    return;
  }

  /* ---------- Zeiger ---------------------------------------- */

  // Nur mit echter Maus: die Bretter verschieben sich leicht gegeneinander,
  // das Logo schwebt davor. Geglaettet, damit nichts am Zeiger klebt.
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

  var zielX = 0, zielY = 0, mx = 0, my = 0, laeuft = false;

  function takt() {
    mx += (zielX - mx) * 0.075;
    my += (zielY - my) * 0.075;
    buehne.style.setProperty("--mx", mx.toFixed(4));
    buehne.style.setProperty("--my", my.toFixed(4));
    if (Math.abs(zielX - mx) + Math.abs(zielY - my) > 0.002) requestAnimationFrame(takt);
    else laeuft = false;
  }

  function stosseAn() {
    if (!laeuft) {
      laeuft = true;
      requestAnimationFrame(takt);
    }
  }

  window.addEventListener(
    "pointermove",
    function (e) {
      if (e.pointerType && e.pointerType !== "mouse") return;
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

  console.info(LOG + " [INFO] Hero-Variante 2 bereit.");
})();
