# JGC Handwerk Website

**Prozess-Stufe: Produkt** — volles Programm (Version, CHANGELOG, Regressionscheck).

Neue Fassung der Website von JGC Handwerk (Johann Gabriel Chimento, Freiburg im Breisgau).
Übernimmt Inhalte, Logo und Farbwelt der bestehenden WordPress-Seite auf jgc-handwerk.de,
setzt sie aber in der Gestaltungs- und Bewegungssprache von fora.so um: grosse schlanke
Typografie, Kapsel-Etiketten, Glaskarten, Scroll-Einblendungen und ein Lichtfleck am Zeiger.

## Tech-Stack

- **Vanilla HTML/CSS/JS, kein Build-Schritt** (Standard fuer statische Seiten laut
  `C:\Projekte\Claude-Skills\grundlagen\TECH-STACK.md`).
- **GSAP 3.12.5 + ScrollTrigger**, lokal unter `assets/vendor/gsap/`.
- **Schriften lokal**: Raleway und Open Sans als Variable Fonts in `assets/fonts/`.
- **Node 24** nur fuer die Werkzeuge in `tools/`, nicht fuer die Seite selbst.

**Nichts wird von einem fremden Server nachgeladen.** Kein CDN, kein Google Fonts, keine
Analyse. `tools/pruefen.mjs` bricht ab, wenn doch ein externer Verweis hineingerät.

## Befehle

- Vorschau: `node tools/server.mjs` → http://localhost:4173
- Pruefen: `node tools/pruefen.mjs` (fehlende Dateien, fremde Server, Versionsabgleich)
- Sichtkontrolle: `node tools/screenshots.mjs <ordner> [breite] [hoehe]` — steuert das
  installierte Chrome fern und legt Bilder aller Abschnitte ab. Server muss laufen.
- Schriften erneuern: `node tools/fonts-holen.mjs` (nur bei Schriftwechsel noetig)

## Konventionen

- Sprache der Oberflaeche: Deutsch, mit echten Umlauten. Code und Kommentare ebenfalls
  deutsch, Kommentare aber ASCII (`ae/oe/ue`).
- Version = Single Source of Truth in `assets/js/config.js` (`JGC.version`), sichtbar in der
  Fusszeile. `tools/pruefen.mjs` vergleicht sie mit dem obersten Eintrag in `CHANGELOG.md`.
- Farben und Abstaende ausschliesslich ueber die CSS-Variablen in `:root` (Abschnitt 1 von
  `style.css`). Keine Farbwerte direkt in Regeln schreiben.
- Sandgold `#d1b280` ist Dekorfarbe, nie Textfarbe — der Kontrast auf hellem Grund reicht
  nicht. Fuer goldenen Text `--gold-600` (`#8c6d42`) verwenden.
- Bilder als WebP in `assets/img/`; die unbearbeiteten Vorlagen liegen daneben in
  `_original/` und bleiben ausserhalb des Repos.

## Stolperfallen

- **Ohne JavaScript muss alles sichtbar bleiben.** Die Startwerte der Einblendungen haengen
  an `.js` am `<html>`, gesetzt von einem Inline-Script im `<head>`. Wer eine neue
  `.reveal`-Regel schreibt, muss sie ebenfalls unter `.js` haengen — sonst ist die Seite bei
  einem Script-Fehler leer.
- **Screenshots aus der Browser-Pane sind unbrauchbar**, sobald die Pane ausgeblendet ist:
  der Bereich ausserhalb des zuletzt gezeichneten Ausschnitts kommt weiss zurueck. Fuer
  Sichtkontrollen `tools/screenshots.mjs` nehmen.
- `scroll-behavior: smooth` verschluckt `window.scrollTo(0, y)` in ferngesteuerten Browsern.
  Beim Testen immer `scrollTo({ top: y, behavior: "instant" })`.
- Bash-Heredocs fressen doppelte Backslashes — regulaere Ausdruecke in `tools/*.mjs` nie per
  Heredoc schreiben, sondern mit dem Edit-Werkzeug.
- Die Projektbahn (`#rail`) wird von ScrollTrigger angeheftet. Aendert sich die Kartenzahl
  oder -breite, aendert sich die Scrollstrecke der ganzen Seite mit.
- **Formular und Datenschutztext haengen zusammen.** `JGC.formularEndpunkt` in
  `assets/js/config.js` steuert den Versand: bei `null` prueft das Formular nur und sagt dem
  Besucher offen, dass nichts verschickt wird. Wer dort einen Dienst eintraegt, muss ihn im
  selben Zug in `datenschutz.html` aufnehmen — sonst nennt die Erklaerung einen
  Datenempfaenger nicht.
- **Der Hoster steht in `datenschutz.html`.** Zieht die Seite von GitHub Pages auf einen
  anderen Server um, muss Abschnitt 2 dort mitgezogen werden.
- **Vorschau-Sperre an zwei Stellen.** Solange die Seite auf der GitHub-Adresse liegt, halten
  ein `noindex`-Tag in `index.html` und `robots.txt` sie aus den Suchmaschinen heraus — sonst
  taucht sie neben der echten Seite auf jgc-handwerk.de auf und nimmt ihr Sichtbarkeit. Beim
  Umzug auf die eigene Domain **beide** entfernen.
