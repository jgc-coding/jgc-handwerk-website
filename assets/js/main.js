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

    function waehle(index, fokussieren) {
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

    /** Wie weit die Bahn seitlich laufen muss, damit die letzte Karte sichtbar wird. */
    function ueberstand() {
      return Math.max(0, gleis.scrollWidth - window.innerWidth + 32);
    }

    /** Scrollstrecke: kuerzer als der Weg, damit die Bahn nicht die halbe Seite frisst.
     *  Gedeckelt auf anderthalb Bildschirmhoehen. */
    function strecke() {
      return Math.min(ueberstand() * 0.75, window.innerHeight * 1.5);
    }

    window.gsap.to(gleis, {
      x: function () {
        return -ueberstand();
      },
      ease: "none",
      scrollTrigger: {
        trigger: bahn,
        start: "top 14%",
        end: function () {
          return "+=" + strecke();
        },
        pin: true,
        scrub: 0.8,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

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
        return feld.checked ? "" : "Ohne diese Zustimmung darf ich Ihre Anfrage nicht speichern.";
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

      versende(form, konfig.formularEndpunkt, zeige);
    });
  }

  /** Versand an einen Formulardienst — erst aktiv, wenn ein Endpunkt hinterlegt ist. */
  function versende(form, endpunkt, zeige) {
    var knopf = form.querySelector('button[type="submit"]');
    var beschriftung = knopf ? knopf.textContent : "";
    if (knopf) {
      knopf.disabled = true;
      knopf.textContent = "Wird gesendet …";
    }

    var kennung = Math.random().toString(36).slice(2, 8);

    fetch(endpunkt, {
      method: "POST",
      headers: { Accept: "application/json" },
      body: new FormData(form),
    })
      .then(function (antwort) {
        if (!antwort.ok) throw new Error("HTTP " + antwort.status);
        form.reset();
        zeige("info", "Vielen Dank für Ihre Anfrage. Ich melde mich zeitnah bei Ihnen.");
      })
      .catch(function (fehler) {
        console.error(LOG + " [ERROR] Versand fehlgeschlagen (ID " + kennung + "):", fehler);
        zeige(
          "error",
          "Ihre Anfrage konnte gerade nicht gesendet werden. Bitte versuchen Sie es in einer Minute erneut " +
            "oder rufen Sie mich an unter 0176 43407143.",
          "Technische Ursache: " + fehler.message + " · ID " + kennung
        );
      })
      .finally(function () {
        if (knopf) {
          knopf.disabled = false;
          knopf.textContent = beschriftung;
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
    starte("Einblenden", einblenden);
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
