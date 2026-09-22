/* ============================================================
   Hero-Variante 3 — "Schicht fuer Schicht"
   Heftet die Buehne beim Scrollen an und fuegt das Wandmodell
   zusammen: die vier Ebenen ruecken aus der Explosionsansicht an
   ihren Platz, das Modell dreht sich dabei nach vorn, die Legende
   hakt jede Schicht ab. Der Zeiger neigt das Modell.
   Braucht GSAP + ScrollTrigger (lokal unter assets/vendor/gsap).
   ============================================================ */

(function () {
  "use strict";

  var LOG = "[JGC Website]";
  var wurzel = document.documentElement;
  var hero = document.querySelector(".v3-hero");
  if (!hero) return;

  var buehne = hero.querySelector(".v3-buehne");
  var modell = hero.querySelector(".v3-modell");
  var logo = hero.querySelector(".v3-logo");
  var hinweis = hero.querySelector(".v3-hinweis");
  var schichten = Array.prototype.slice.call(hero.querySelectorAll(".v3-schicht"));
  var zeilen = Array.prototype.slice.call(hero.querySelectorAll(".v3-legende__zeile"));

  // Auftritt des Textes ausloesen: zwei Frames warten, damit die Startwerte
  // sicher gemalt sind, bevor die Uebergaenge loslaufen.
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      hero.classList.add("ist-bereit");
    });
  });

  /** Zurueck ins Ruhe-Layout: Modell halb geoeffnet, Text sichtbar, nichts angeheftet. */
  function ruheLayout(grund) {
    console.warn(LOG + " [WARN] Hero-Variante 3 laeuft im Ruhe-Layout: " + grund);
    wurzel.classList.remove("bewegt");
  }

  var bewegt = wurzel.classList.contains("bewegt");
  var gsapDa = typeof window.gsap !== "undefined" && typeof window.ScrollTrigger !== "undefined";

  if (bewegt && !gsapDa) {
    ruheLayout("GSAP wurde nicht geladen.");
    return;
  }
  if (!bewegt) return;

  /* ---------- Scroll-Szene ---------------------------------- */

  // Alle Wege sind fuer ein 470 px hohes Wandelement gedacht und werden mit
  // seiner tatsaechlichen Hoehe skaliert — so bleibt die Explosionsansicht
  // am Handy im Bild.
  function mass() {
    return Math.max(0.3, modell.offsetHeight / 470);
  }

  // Auf schmalen Schirmen faechert das Modell weniger schraeg auf, sonst
  // ragt das Staenderwerk links aus dem Bild.
  var schmal = window.matchMedia("(max-width: 900px)");
  function startDrehung() {
    return schmal.matches ? 28 : 40;
  }

  // Explosionsansicht (Start) und fertige Wand (Ziel) je Ebene.
  // z: Abstand zur Wandmitte, y: Versatz nach oben/unten (hintere Ebenen hoeher).
  // Fertig liegt die Daemmung leicht HINTER dem Staenderwerk — sie faehrt beim
  // Zusammenbau zwischen die Staender, wie auf der Baustelle gestopft.
  var START = [
    { z: -225, y: -84 },
    { z: -75, y: -28 },
    { z: 75, y: 28 },
    { z: 225, y: 84 },
  ];
  var ZIEL = [
    { z: 0, y: 0 },
    { z: -6, y: 0 },
    { z: 14, y: 0 },
    { z: 18, y: 0 },
  ];
  // Wann jede Ebene losfaehrt (Anteil der Strecke); Fahrtdauer je 0,42
  var ABFAHRT = [0.06, 0.06, 0.2, 0.34];
  // Ab welchem Fortschritt die Legendenzeile als gesetzt gilt
  var GESETZT = [0.1, 0.46, 0.6, 0.74];

  try {
    var gsap = window.gsap;
    var ScrollTrigger = window.ScrollTrigger;
    gsap.registerPlugin(ScrollTrigger);
    // Die Adressleiste am Handy aendert die Hoehe staendig — nicht jedes Mal neu messen
    ScrollTrigger.config({ ignoreMobileResize: true });

    var zeitplan = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: hero,
        start: "top top",
        end: function () {
          return "+=" + Math.round(window.innerHeight * 1.5);
        },
        pin: buehne,
        scrub: 0.7,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: function (self) {
          var p = self.progress;
          zeilen.forEach(function (zeile, i) {
            zeile.classList.toggle("ist-dran", p >= GESETZT[i]);
          });
        },
      },
    });

    // 1. Hinweis geht, sobald gescrollt wird. Startwert ausdruecklich setzen:
    //    beim Aufbau laeuft noch sein Lade-Auftritt mit Deckkraft 0.
    zeitplan.fromTo(hinweis, { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.08 }, 0);

    // 2. Das Modell dreht sich aus der Schraegansicht nach vorn
    zeitplan.fromTo(
      modell,
      {
        rotationY: startDrehung,
        rotationX: 6,
        x: function () { return -40 * mass(); },
      },
      { rotationY: 18, rotationX: 4, x: 0, ease: "power1.inOut", duration: 0.74 },
      0.02
    );

    // 3. Die Ebenen ruecken zusammen — Staenderwerk und Daemmung zuerst,
    //    dann Beplankung, zuletzt die Oberflaeche
    schichten.forEach(function (schicht, i) {
      zeitplan.fromTo(
        schicht,
        {
          z: function () { return START[i].z * mass(); },
          y: function () { return START[i].y * mass(); },
        },
        {
          z: function () { return ZIEL[i].z * mass(); },
          y: function () { return ZIEL[i].y * mass(); },
          ease: "power2.inOut",
          duration: 0.42,
        },
        ABFAHRT[i]
      );
    });

    // 4. Das Logo legt sich an die fertige Wand: Schatten wird flacher
    zeitplan.fromTo(
      logo,
      { "--hoehe": 1, scale: 1.06 },
      { "--hoehe": 0, scale: 1, ease: "power2.out", duration: 0.12 },
      0.74
    );

    // 5. Halt: der weiche Nachlauf des Scrubs schwingt aus, bevor sich die
    //    Anheftung loest (Lehre aus dem Sprung der Projektbahn in 0.2.0).
    zeitplan.to({}, { duration: 0.14 });

    // Schriften und Bilder verschieben die Masse nach dem Laden
    window.addEventListener("load", function () {
      ScrollTrigger.refresh();
    });

    var wecker = 0;
    window.addEventListener("resize", function () {
      clearTimeout(wecker);
      wecker = setTimeout(function () {
        ScrollTrigger.refresh();
      }, 180);
    });
  } catch (fehler) {
    console.error(LOG + " [ERROR] Hero-Variante 3: Scroll-Szene fehlgeschlagen:", fehler);
    ruheLayout("Fehler beim Aufbau der Scroll-Szene.");
    return;
  }

  /* ---------- Zeiger ---------------------------------------- */

  // Nur mit echter Maus: das Modell neigt sich zum Zeiger, der Lichtstreifen
  // wandert ueber die Oberflaeche. Geglaettet, damit nichts am Zeiger klebt.
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

  var zielX = 0, zielY = 0, mx = 0, my = 0, laeuft = false;

  function takt() {
    mx += (zielX - mx) * 0.07;
    my += (zielY - my) * 0.07;
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

  console.info(LOG + " [INFO] Hero-Variante 3 bereit.");
})();
