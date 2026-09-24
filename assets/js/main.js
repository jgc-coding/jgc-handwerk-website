/* ============================================================
   JGC Handwerk — Verhalten der Seite
   Aufbau: jeder Baustein ist eine eigene Funktion und laeuft
   unabhaengig. Faellt einer aus, laeuft der Rest weiter.
   ============================================================ */

(function () {
  "use strict";

  var LOG = "[JGC Website]";
  var ruhig = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /** Startet einen Baustein und laesst einen Fehler den Rest nicht mitreissen. */
  function starte(name, fn) {
    try {
      fn();
    } catch (fehler) {
      console.error(LOG + " [ERROR] Baustein '" + name + "' fehlgeschlagen:", fehler);
    }
  }

  /* ---------- Kopfzeile: Glas ab dem ersten Scrollen -------- */

  function kopfzeile() {
    var header = document.getElementById("header");
    if (!header) return;

    var gesetzt = false;
    function pruefe() {
      var soll = window.scrollY > 12;
      if (soll !== gesetzt) {
        header.classList.toggle("is-stuck", soll);
        gesetzt = soll;
      }
    }
    pruefe();
    window.addEventListener("scroll", pruefe, { passive: true });
  }

  /* ---------- Menue auf schmalen Bildschirmen ---------------- */

  function menue() {
    var knopf = document.getElementById("navToggle");
    var nav = document.getElementById("nav");
    if (!knopf || !nav) return;

    function schliesse() {
      knopf.setAttribute("aria-expanded", "false");
      knopf.setAttribute("aria-label", "Menü öffnen");
      nav.classList.remove("is-open");
    }

    knopf.addEventListener("click", function () {
      var offen = knopf.getAttribute("aria-expanded") === "true";
      knopf.setAttribute("aria-expanded", String(!offen));
      knopf.setAttribute("aria-label", offen ? "Menü öffnen" : "Menü schließen");
      nav.classList.toggle("is-open", !offen);
    });

    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) schliesse();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") schliesse();
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 760) schliesse();
    });
  }

  /* ---------- Hero: Bretterwand ----------------------------- */

  // Die Buehne bleibt beim Scrollen stehen (ScrollTrigger heftet sie an), die
  // Bretter gleiten abwechselnd nach links und rechts weg, das Logo reist an
  // seinen Platz ueber der Ueberschrift, der Inhalt blendet ein. Ob sich die
  // Wand bewegt, entscheidet die Klasse .bewegt, die der Kopf der Seite setzt
  // (nicht bei ruhiger Darstellung). Faellt etwas aus, nimmt der Baustein sie
  // wieder weg: dann steht die Wand als Band oben und der Inhalt sichtbar da.
  function bretterwand() {
    var hero = document.querySelector(".hero");
    var buehne = hero && hero.querySelector(".hero__buehne");
    if (!buehne) return;

    var wurzel = document.documentElement;
    var wand = buehne.querySelector(".hero__wand");
    var logo = buehne.querySelector(".hero__logo");
    var platz = buehne.querySelector(".hero__logoplatz");
    var inhalt = buehne.querySelector(".hero__inhalt");
    var bretter = Array.prototype.slice.call(buehne.querySelectorAll(".hero__brett"));
    var freigaben = Array.prototype.slice.call(buehne.querySelectorAll(".hero__inhalt [data-freigabe]"));
    // Leitsatz und Hinweis blenden an den Kindern aus, nicht am Rahmen (style.css, 8b)
    var wandtexte = Array.prototype.slice.call(buehne.querySelectorAll(".hero__leitsatz span, .hero__hinweis > span"));

    if (!wand || !logo || !platz || !inhalt) {
      console.warn(LOG + " [WARN] Bretterwand unvollstaendig im HTML — Ruhe-Layout.");
      wurzel.classList.remove("bewegt");
      return;
    }

    // Breite und Hoehe der Wand in Pixeln an das CSS melden. Die Hoehe nur in
    // der bewegten Fassung: dort reicht die Wand bis zur grossen Bildschirmhoehe.
    function messeWand() {
      buehne.style.removeProperty("--wand-h");
      buehne.style.setProperty("--wand-b", buehne.clientWidth + "px");
      if (wurzel.classList.contains("bewegt")) {
        buehne.style.setProperty("--wand-h", wand.offsetHeight + "px");
      }
    }

    /** Zurueck ins Ruhe-Layout: die Wand wird zum Band, der Inhalt steht sichtbar da. */
    function ruheLayout(grund) {
      console.warn(LOG + " [WARN] Bretterwand im Ruhe-Layout: " + grund);
      wurzel.classList.remove("bewegt");
      messeWand();
    }

    messeWand();

    var bewegt = wurzel.classList.contains("bewegt");
    if (bewegt && (typeof window.gsap === "undefined" || typeof window.ScrollTrigger === "undefined")) {
      ruheLayout("GSAP wurde nicht geladen.");
      bewegt = false;
    }

    // Am Handy aendert die Adressleiste beim Scrollen laufend die Fensterhoehe.
    // Die Wand haengt dort nur an der Breite (die Hoehen rechnet das CSS mit
    // svh/lvh), darum auf Touch-Geraeten nur bei neuer Breite neu messen.
    var nurTouch = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
    var letzteBreite = window.innerWidth;
    var wecker = 0;
    window.addEventListener("resize", function () {
      if (nurTouch && window.innerWidth === letzteBreite) return;
      letzteBreite = window.innerWidth;
      clearTimeout(wecker);
      wecker = setTimeout(function () {
        messeWand();
        if (bewegt) window.ScrollTrigger.refresh();
      }, 180);
    });

    if (!bewegt) return;

    var gsap = window.gsap;
    var ScrollTrigger = window.ScrollTrigger;

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

    var zeitplan = null;
    try {
      gsap.registerPlugin(ScrollTrigger);
      // Die Adressleiste am Handy aendert die Hoehe staendig — nicht jedes Mal neu messen
      ScrollTrigger.config({ ignoreMobileResize: true });

      // Die Wand oeffnet sich von der Mitte her, dort wo das Logo sitzt
      var rang = [3, 2, 1, 0, 0, 1, 2, 3];

      zeitplan = gsap.timeline({
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
            // Hinter der geschlossenen Wand ist der Inhalt unsichtbar — dort
            // soll ihn auch kein Mausklick durch die Bretter hindurch treffen.
            buehne.classList.toggle("ist-offen", self.progress > 0.7);
          },
        },
      });

      // 1. Leitsatz und Hinweis gehen, sobald gescrollt wird. Startwerte
      //    ausdruecklich angeben: beim Aufbau laeuft noch ihr Lade-Auftritt mit
      //    Deckkraft 0 — GSAP wuerde sonst diese 0 als Startwert festschreiben
      //    und beide blieben fuer immer unsichtbar.
      zeitplan.fromTo(wandtexte, { autoAlpha: 1, y: 0 }, { autoAlpha: 0, y: -18, duration: 0.09 }, 0);

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
      freigaben.forEach(function (el, i) {
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
    } catch (fehler) {
      console.error(LOG + " [ERROR] Bretterwand: Scroll-Szene fehlgeschlagen:", fehler);
      // Angefangene Anheftung und gesetzte Inline-Werte zuruecknehmen
      try {
        if (zeitplan) zeitplan.revert();
      } catch (e) {
        /* nichts mehr zu retten — das Ruhe-Layout greift trotzdem */
      }
      ruheLayout("Fehler beim Aufbau der Scroll-Szene.");
      return;
    }

    // Tastatur: springt der Fokus in den Inhalt hinter der geschlossenen Wand
    // (Tab auf "Anfrage senden"), die Wand ganz oeffnen — sonst laege der
    // fokussierte Knopf unsichtbar hinter den Brettern.
    inhalt.addEventListener("focusin", function () {
      var st = zeitplan.scrollTrigger;
      if (st && st.progress < 1) window.scrollTo({ top: Math.ceil(st.end), behavior: "instant" });
    });

    /* Zeiger: nur mit echter Maus. Die Bretter verschieben sich leicht
       gegeneinander, das Logo schwebt davor; geglaettet, damit nichts am
       Zeiger klebt. Unterhalb des Heros ruht die Rechnung. */
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
        if (window.scrollY > zeitplan.scrollTrigger.end) return;
        zielX = (e.clientX / Math.max(1, window.innerWidth)) * 2 - 1;
        zielY = (e.clientY / Math.max(1, window.innerHeight)) * 2 - 1;
        stosseAn();
      },
      { passive: true }
    );

    wurzel.addEventListener("pointerleave", function () {
      zielX = 0;
      zielY = 0;
      stosseAn();
    });
  }

  /* ---------- Ueberschriften Wort fuer Wort ----------------- */

  /** Zerlegt den Text eines Elements in .wort-Spannen; Leerraum bleibt als
   *  normaler Text stehen, verschachtelte Elemente (Akzent-Spannen) werden
   *  durchlaufen. Jedes Wort bekommt seine Verzoegerung als --wd. */
  function zerlegeInWorte(el) {
    var nummer = 0;
    (function gehe(knoten) {
      Array.prototype.slice.call(knoten.childNodes).forEach(function (kind) {
        if (kind.nodeType === 3) {
          var stueck = document.createDocumentFragment();
          kind.textContent.split(/(\s+)/).forEach(function (teil) {
            if (!teil) return;
            if (/^\s+$/.test(teil)) {
              stueck.appendChild(document.createTextNode(" "));
              return;
            }
            var wort = document.createElement("span");
            wort.className = "wort";
            wort.textContent = teil;
            wort.style.setProperty("--wd", Math.min(nummer * 60, 1100) + "ms");
            nummer++;
            stueck.appendChild(wort);
          });
          kind.replaceWith(stueck);
        } else if (kind.nodeType === 1 && kind.tagName !== "BR") {
          gehe(kind);
        }
      });
    })(el);
  }

  function worte() {
    var koepfe = Array.prototype.slice.call(document.querySelectorAll("[data-worte]"));
    if (!koepfe.length) return;

    // Ruhige Darstellung oder kein Beobachter: Text unangetastet lassen —
    // ohne Spannen gibt es nichts einzublenden, alles bleibt sichtbar.
    if (ruhig || !("IntersectionObserver" in window)) return;

    koepfe.forEach(function (kopf) {
      // Klartext fuer Vorleseprogramme festhalten, bevor der Satz zerfaellt
      kopf.setAttribute("aria-label", kopf.textContent.replace(/\s+/g, " ").trim());
      zerlegeInWorte(kopf);
    });

    var beobachter = new IntersectionObserver(
      function (eintraege) {
        eintraege.forEach(function (eintrag) {
          if (!eintrag.isIntersecting) return;
          eintrag.target.classList.add("ist-da");
          beobachter.unobserve(eintrag.target);
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -8% 0px" }
    );

    koepfe.forEach(function (kopf) {
      beobachter.observe(kopf);
    });
  }

  /* ---------- Lesefaden am oberen Rand ---------------------- */

  function scrollspur() {
    var balken = document.getElementById("scrollspurBalken");
    if (!balken) return;

    var strecke = 1;
    function missStrecke() {
      strecke = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    }

    var angefragt = false;
    function male() {
      angefragt = false;
      var p = Math.max(0, Math.min(1, window.scrollY / strecke));
      balken.style.transform = "scaleX(" + p.toFixed(4) + ")";
    }

    missStrecke();
    male();
    window.addEventListener(
      "scroll",
      function () {
        if (!angefragt) {
          angefragt = true;
          requestAnimationFrame(male);
        }
      },
      { passive: true }
    );
    // Die Seitenhoehe aendert sich durch Bilder und die angeheftete Bahn
    window.addEventListener("resize", function () { missStrecke(); male(); });
    window.addEventListener("load", function () { missStrecke(); male(); });
  }

  /* ---------- Einblenden beim Scrollen ---------------------- */

  function einblenden() {
    var ziele = document.querySelectorAll(".reveal, .reveal-group");
    if (!ziele.length) return;

    if (ruhig || !("IntersectionObserver" in window)) {
      ziele.forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }

    // Reihenfolge fuer das gestaffelte Einblenden der Kinder
    document.querySelectorAll(".reveal-group").forEach(function (gruppe) {
      Array.prototype.forEach.call(gruppe.children, function (kind, i) {
        if (!kind.style.getPropertyValue("--i")) kind.style.setProperty("--i", String(i));
      });
    });

    var beobachter = new IntersectionObserver(
      function (eintraege) {
        eintraege.forEach(function (eintrag) {
          if (!eintrag.isIntersecting) return;
          eintrag.target.classList.add("is-visible");
          beobachter.unobserve(eintrag.target);
        });
      },
      { rootMargin: "0px 0px -5% 0px", threshold: 0.05 }
    );

    ziele.forEach(function (el) {
      beobachter.observe(el);
    });

    // Sicherheitsnetz: Was beim Laden schon im Bild steht, wird sofort gezeigt —
    // der Beobachter meldet sich erst im naechsten Frame, und ein Element genau
    // an der Kante faellt sonst durch.
    function zeigeWasImBildIst() {
      ziele.forEach(function (el) {
        if (el.classList.contains("is-visible")) return;
        var b = el.getBoundingClientRect();
        if (b.top < window.innerHeight && b.bottom > 0) {
          el.classList.add("is-visible");
          beobachter.unobserve(el);
        }
      });
    }
    zeigeWasImBildIst();
    window.addEventListener("load", zeigeWasImBildIst);
  }

  /* ---------- Aktiver Punkt in der Navigation --------------- */

  function navMarkierung() {
    var links = Array.prototype.slice.call(document.querySelectorAll(".nav__link"));
    if (!links.length || !("IntersectionObserver" in window)) return;

    var abschnitte = links
      .map(function (a) {
        var id = a.getAttribute("href");
        return id && id.charAt(0) === "#" ? document.querySelector(id) : null;
      })
      .filter(Boolean);
    if (!abschnitte.length) return;

    var beobachter = new IntersectionObserver(
      function (eintraege) {
        eintraege.forEach(function (e) {
          if (!e.isIntersecting) return;
          links.forEach(function (a) {
            a.classList.toggle("is-active", a.getAttribute("href") === "#" + e.target.id);
          });
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );

    abschnitte.forEach(function (s) {
      beobachter.observe(s);
    });
  }

  /* ---------- Reiter der Leistungen ------------------------- */

  function reiter() {
    var liste = document.querySelector(".tabs__list");
    if (!liste) return;

    var tabs = Array.prototype.slice.call(liste.querySelectorAll('[role="tab"]'));
    if (!tabs.length) return;
    var gewaehlt = 0;

    function waehle(index, fokussieren) {
      gewaehlt = index;
      tabs.forEach(function (tab, i) {
        var aktiv = i === index;
        tab.setAttribute("aria-selected", String(aktiv));
        tab.setAttribute("tabindex", aktiv ? "0" : "-1");

        var panel = document.getElementById(tab.getAttribute("aria-controls"));
        if (!panel) {
          console.warn(LOG + " [WARN] Kein Panel zu Reiter", tab.id);
          return;
        }
        panel.classList.toggle("is-active", aktiv);
        if (aktiv) panel.removeAttribute("hidden");
        else panel.setAttribute("hidden", "");
      });
      if (fokussieren) tabs[index].focus();
    }

    tabs.forEach(function (tab, i) {
      tab.addEventListener("click", function () {
        waehle(i, false);
      });

      tab.addEventListener("keydown", function (e) {
        var ziel = null;
        if (e.key === "ArrowDown" || e.key === "ArrowRight") ziel = (i + 1) % tabs.length;
        else if (e.key === "ArrowUp" || e.key === "ArrowLeft") ziel = (i - 1 + tabs.length) % tabs.length;
        else if (e.key === "Home") ziel = 0;
        else if (e.key === "End") ziel = tabs.length - 1;
        if (ziel === null) return;
        e.preventDefault();
        waehle(ziel, true);
      });
    });

    waehle(0, false);

    /* Schmale Bildschirme (einspaltig, wie im CSS ab 980 px): Liste statt Reiter.
       Jede Leistung steht als Karte mit Nummer, Titel, Kurztext und ihrem Bild
       untereinander, die Reiterleiste ist ausgeblendet. Den Kopf jeder Karte
       baut das Skript aus dem Reiter — so stehen die Texte nur einmal im HTML. */
    var box = liste.parentElement;
    var schmal = window.matchMedia("(max-width: 980px)");

    function setzeAnsicht() {
      var alsListe = schmal.matches;
      box.classList.toggle("tabs--liste", alsListe);

      tabs.forEach(function (tab) {
        var panel = document.getElementById(tab.getAttribute("aria-controls"));
        if (!panel) return;

        if (!alsListe) {
          panel.setAttribute("role", "tabpanel");
          panel.setAttribute("aria-labelledby", tab.id);
          return;
        }

        if (!panel.querySelector(".panel__kopf")) {
          // Nur fuers Auge: Vorleseprogramme bekommen Titel und Text aus der Bildunterschrift
          var kopf = document.createElement("div");
          kopf.className = "panel__kopf";
          kopf.setAttribute("aria-hidden", "true");
          Array.prototype.forEach.call(tab.childNodes, function (kind) {
            kopf.appendChild(kind.cloneNode(true));
          });
          panel.insertBefore(kopf, panel.firstChild);
        }
        // Ohne Reiterleiste ist das Panel ein gewoehnlicher Abschnitt der Liste
        panel.removeAttribute("hidden");
        panel.removeAttribute("role");
        panel.removeAttribute("aria-labelledby");
      });

      if (!alsListe) waehle(gewaehlt, false);
    }

    setzeAnsicht();
    if (typeof schmal.addEventListener === "function") schmal.addEventListener("change", setzeAnsicht);
    else if (typeof schmal.addListener === "function") schmal.addListener(setzeAnsicht);
  }

  /* ---------- Lichtfleck folgt dem Zeiger ------------------- */

  function lichtfleck() {
    if (ruhig || !window.matchMedia("(hover: hover)").matches) return;

    document.querySelectorAll(".card").forEach(function (karte) {
      karte.addEventListener(
        "pointermove",
        function (e) {
          var r = karte.getBoundingClientRect();
          karte.style.setProperty("--mx", (e.clientX - r.left) + "px");
          karte.style.setProperty("--my", (e.clientY - r.top) + "px");
        },
        { passive: true }
      );
    });
  }

  /* ---------- Projektbahn laeuft seitwaerts ----------------- */

  function projektbahn() {
    var bahn = document.getElementById("rail");
    var gleis = document.getElementById("railTrack");
    if (!bahn || !gleis) return;

    // Die Karten blenden gestaffelt ein, sobald die Bahn in die Naehe kommt —
    // in beiden Betriebsarten. Bewusst NICHT ueber die reveal-Klassen: Bahn
    // und Gleis werden von ScrollTrigger transformiert, eine CSS-Transition
    // auf ihnen liess die Leiste beim Loesen der Anheftung springen.
    var karten = Array.prototype.slice.call(gleis.querySelectorAll(".shot"));

    function zeigeKarten() {
      karten.forEach(function (karte, i) {
        karte.style.setProperty("--sd", Math.min(i * 80, 640) + "ms");
        karte.classList.add("ist-da");
      });
    }

    if (ruhig || !("IntersectionObserver" in window)) {
      zeigeKarten();
    } else {
      var waechter = new IntersectionObserver(
        function (eintraege) {
          if (!eintraege.some(function (e) { return e.isIntersecting; })) return;
          zeigeKarten();
          waechter.disconnect();
        },
        { rootMargin: "0px 0px 10% 0px", threshold: 0.05 }
      );
      waechter.observe(bahn);
    }

    // Schmale Bildschirme und ruhige Darstellung: normal wischen statt scrollen
    var schmal = window.matchMedia("(max-width: 979px)");
    var gsapDa = typeof window.gsap !== "undefined" && typeof window.ScrollTrigger !== "undefined";

    if (ruhig || schmal.matches || !gsapDa) {
      bahn.classList.add("rail--swipe");
      if (!gsapDa && !ruhig && !schmal.matches) {
        console.warn(LOG + " [WARN] GSAP nicht geladen — Projektbahn zum Wischen statt zum Scrollen.");
      }
      return;
    }

    window.gsap.registerPlugin(window.ScrollTrigger);

    /** Wie weit die Bahn seitlich laufen muss, damit die letzte Karte ganz im Bild steht. */
    function ueberstand() {
      return Math.max(0, gleis.scrollWidth - window.innerWidth + 32);
    }

    /** Scrollstrecke der Fahrt: kuerzer als der Weg, damit die Bahn nicht die
     *  halbe Seite frisst. Gedeckelt auf 1,4 Bildschirmhoehen. */
    function fahrt() {
      return Math.min(ueberstand() * 0.85, window.innerHeight * 1.4);
    }

    // Die Bahn faehrt in den ersten 82 Prozent der angehefteten Strecke und
    // STEHT die letzten 18 Prozent. Der Halt hat zwei Aufgaben: die letzte
    // Karte ist wirklich in Ruhe zu sehen, und der weiche Nachlauf des Scrubs
    // ist ausgeschwungen, bevor sich die Anheftung loest — genau an dieser
    // Kante sprang die Leiste frueher.
    var zeitplan = window.gsap.timeline({
      scrollTrigger: {
        trigger: bahn,
        start: "top 14%",
        end: function () {
          return "+=" + Math.round(fahrt() / 0.82);
        },
        pin: true,
        scrub: 0.6,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    zeitplan
      .to(gleis, {
        x: function () {
          return -ueberstand();
        },
        ease: "none",
        duration: 0.82,
      })
      .to({}, { duration: 0.18 });

    // Bilder aendern die Hoehe nach dem Laden — Messpunkte neu berechnen
    window.addEventListener("load", function () {
      window.ScrollTrigger.refresh();
    });
  }

  /* ---------- Vorher/Nachher-Regler ------------------------- */

  function vergleich() {
    document.querySelectorAll("[data-compare]").forEach(function (box) {
      var aktiv = false;

      function setze(prozent) {
        var p = Math.max(0, Math.min(100, prozent));
        box.style.setProperty("--pos", p + "%");
        box.setAttribute("aria-valuenow", String(Math.round(p)));
      }

      function ausPunkt(clientX) {
        var r = box.getBoundingClientRect();
        setze(((clientX - r.left) / r.width) * 100);
      }

      box.addEventListener("pointerdown", function (e) {
        aktiv = true;
        box.setPointerCapture(e.pointerId);
        ausPunkt(e.clientX);
      });

      box.addEventListener("pointermove", function (e) {
        if (!aktiv) return;
        ausPunkt(e.clientX);
      });

      ["pointerup", "pointercancel"].forEach(function (typ) {
        box.addEventListener(typ, function () {
          aktiv = false;
        });
      });

      box.addEventListener("keydown", function (e) {
        var jetzt = parseFloat(box.getAttribute("aria-valuenow")) || 50;
        var schritt = e.shiftKey ? 10 : 3;
        if (e.key === "ArrowLeft") setze(jetzt - schritt);
        else if (e.key === "ArrowRight") setze(jetzt + schritt);
        else if (e.key === "Home") setze(0);
        else if (e.key === "End") setze(100);
        else return;
        e.preventDefault();
      });

      setze(50);
    });
  }

  /* ---------- Kontaktformular ------------------------------- */

  function formular() {
    var form = document.getElementById("kontaktFormular");
    if (!form) return;

    var status = document.getElementById("formStatus");
    var konfig = window.JGC || {};

    // Ab jetzt steht das Formular bereit. Das Skript auf dem Server lehnt Einsendungen ab,
    // die schneller kommen, als ein Mensch tippen kann.
    var bereitSeit = Date.now();

    var regeln = {
      nachname: function (w) {
        return w.trim().length >= 2 ? "" : "Bitte tragen Sie Ihren Nachnamen ein.";
      },
      email: function (w) {
        if (!w.trim()) return "Bitte tragen Sie Ihre E-Mail-Adresse ein.";
        return /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(w.trim()) ? "" : "Diese E-Mail-Adresse sieht nicht vollständig aus.";
      },
      telefon: function (w) {
        if (!w.trim()) return "";
        return /^[\d\s+()/.-]{5,}$/.test(w.trim()) ? "" : "Bitte nur Ziffern und die Zeichen + ( ) / - verwenden.";
      },
      anfrage: function (w) {
        return w.trim().length >= 10 ? "" : "Bitte beschreiben Sie Ihre Anfrage in ein paar Worten.";
      },
      datenschutz: function (_, feld) {
        return feld.checked ? "" : "Ohne diese Zustimmung kann ich Ihre Anfrage nicht bearbeiten.";
      },
    };

    function pruefeFeld(name) {
      var feld = form.elements[name];
      var anzeige = document.getElementById("err-" + name);
      if (!feld || !regeln[name]) return true;

      var meldung = regeln[name](feld.value || "", feld);
      if (anzeige) anzeige.textContent = meldung;
      feld.setAttribute("aria-invalid", meldung ? "true" : "false");
      return !meldung;
    }

    Object.keys(regeln).forEach(function (name) {
      var feld = form.elements[name];
      if (!feld) return;
      var ereignis = feld.type === "checkbox" ? "change" : "blur";
      feld.addEventListener(ereignis, function () {
        pruefeFeld(name);
      });
      feld.addEventListener("input", function () {
        if (feld.getAttribute("aria-invalid") === "true") pruefeFeld(name);
      });
    });

    function zeige(art, text, diagnose) {
      if (!status) return;
      status.className = "form__status form__status--" + art;
      status.textContent = text;
      if (diagnose) {
        var klein = document.createElement("span");
        klein.className = "form__diag";
        klein.textContent = diagnose;
        status.appendChild(klein);
      }
      status.hidden = false;
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var alleOk = Object.keys(regeln)
        .map(pruefeFeld)
        .every(Boolean);

      if (!alleOk) {
        zeige("error", "Bitte prüfen Sie die rot markierten Felder.");
        var erstesFehlerfeld = form.querySelector('[aria-invalid="true"]');
        if (erstesFehlerfeld) erstesFehlerfeld.focus();
        return;
      }

      // Koederfeld ausgefuellt: mit hoher Wahrscheinlichkeit ein Automat.
      if (form.elements.webseite && form.elements.webseite.value) {
        console.warn(LOG + " [WARN] Koederfeld ausgefuellt — Absenden abgebrochen.");
        zeige("error", "Ihre Anfrage konnte nicht gesendet werden. Bitte rufen Sie mich kurz an.");
        return;
      }

      if (!konfig.formularEndpunkt) {
        // Ehrlich statt still: hier wuerde nichts versendet.
        console.warn(LOG + " [WARN] Kein Formular-Endpunkt gesetzt (assets/js/config.js).");
        zeige(
          "info",
          "Der Versand ist auf dieser Vorschau-Seite noch nicht eingerichtet. Schreiben Sie mir bitte direkt an " +
            "kontakt@jgc-handwerk.de oder rufen Sie an unter 0176 43407143.",
          "Hinweis für den Betreiber: JGC.formularEndpunkt in assets/js/config.js ist noch leer."
        );
        return;
      }

      versende(form, konfig.formularEndpunkt, Math.round((Date.now() - bereitSeit) / 1000), zeige);
    });
  }

  /** Zeigt die Meldungen, die das Skript auf dem Server zu einzelnen Feldern schickt. */
  function zeigeFeldfehler(form, felder) {
    var erstes = null;
    Object.keys(felder).forEach(function (name) {
      var feld = form.elements[name];
      var anzeige = document.getElementById("err-" + name);
      if (anzeige) anzeige.textContent = String(felder[name]);
      if (!feld) return;
      feld.setAttribute("aria-invalid", "true");
      if (!erstes) erstes = feld;
    });
    if (erstes) erstes.focus();
  }

  /** Versand an das Formular-Skript bei All-Inkl (formular/senden.php).
   *  sekunden = Dauer des Ausfuellens; das Skript lehnt Automaten-Tempo ab. */
  function versende(form, endpunkt, sekunden, zeige) {
    var knopf = form.querySelector('button[type="submit"]');
    // innerHTML statt textContent: sonst verliert der Knopf nach dem Senden sein Pfeil-Symbol
    var beschriftung = knopf ? knopf.innerHTML : "";
    if (knopf) {
      knopf.disabled = true;
      knopf.textContent = "Wird gesendet …";
    }

    var daten = new FormData(form);
    daten.append("dauer", String(sekunden));

    // Bleibt die Antwort aus, sichtbar abbrechen statt den Knopf ewig haengen zu lassen.
    var abbruch = typeof AbortController === "function" ? new AbortController() : null;
    var wecker = abbruch
      ? setTimeout(function () {
          abbruch.abort();
        }, 20000)
      : null;
    var kennung = Math.random().toString(36).slice(2, 8);

    fetch(endpunkt, {
      method: "POST",
      headers: { Accept: "application/json" },
      body: daten,
      signal: abbruch ? abbruch.signal : undefined,
    })
      .then(function (antwort) {
        return antwort
          .json()
          .catch(function () {
            return {};
          })
          .then(function (inhalt) {
            if (inhalt.id) kennung = String(inhalt.id);

            if (antwort.ok && inhalt.ok) {
              form.reset();
              zeige("info", "Vielen Dank für Ihre Anfrage. Ich melde mich zeitnah bei Ihnen.");
              return;
            }

            if (antwort.status === 422 && inhalt.felder) {
              zeigeFeldfehler(form, inhalt.felder);
              zeige("error", "Bitte prüfen Sie die rot markierten Felder.");
              return;
            }

            throw new Error("HTTP " + antwort.status + (inhalt.grund ? " " + inhalt.grund : ""));
          });
      })
      .catch(function (fehler) {
        var ursache = fehler && fehler.name === "AbortError" ? "keine Antwort nach 20 s" : fehler.message;
        console.error(LOG + " [ERROR] Versand fehlgeschlagen (ID " + kennung + "):", fehler);
        zeige(
          "error",
          "Ihre Anfrage konnte gerade nicht gesendet werden. Bitte versuchen Sie es in einer Minute erneut " +
            "oder rufen Sie mich an unter 0176 43407143.",
          "Technische Ursache: " + ursache + " · ID " + kennung
        );
      })
      .finally(function () {
        if (wecker) clearTimeout(wecker);
        if (knopf) {
          knopf.disabled = false;
          knopf.innerHTML = beschriftung;
        }
      });
  }

  /* ---------- Kleinigkeiten in der Fusszeile ---------------- */

  function fusszeile() {
    var jahr = document.getElementById("jahr");
    if (jahr) jahr.textContent = String(new Date().getFullYear());

    var version = document.getElementById("version");
    if (version) {
      var v = (window.JGC || {}).version;
      // Lieber sichtbar unbekannt als eine erfundene Nummer.
      version.textContent = v || "unbekannt";
      if (!v) console.warn(LOG + " [WARN] Keine Version in assets/js/config.js gefunden.");
    }
  }

  /* ---------- Start ---------------------------------------- */

  function los() {
    starte("Kopfzeile", kopfzeile);
    starte("Menue", menue);
    // Die Bretterwand vor der Projektbahn: ScrollTrigger rechnet Anheftungen in
    // der Reihenfolge ihres Aufbaus, sie muss der Reihenfolge auf der Seite folgen.
    starte("Bretterwand", bretterwand);
    starte("Einblenden", einblenden);
    starte("Worte", worte);
    starte("Scrollspur", scrollspur);
    starte("Navigation", navMarkierung);
    starte("Reiter", reiter);
    starte("Lichtfleck", lichtfleck);
    starte("Projektbahn", projektbahn);
    starte("Vergleich", vergleich);
    starte("Formular", formular);
    starte("Fusszeile", fusszeile);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", los);
  else los();
})();
