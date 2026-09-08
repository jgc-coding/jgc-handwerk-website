# Changelog

Alle nennenswerten Änderungen an dieser Website. Format nach SemVer (MAJOR.MINOR.PATCH).
Die Version steht als Single Source of Truth in `assets/js/config.js` und erscheint in der
Fußzeile.

## 0.1.0 — 2026-09-08

Erste Fassung: Inhalte der bestehenden WordPress-Seite in neuer Gestaltung.

**Aufbau**

- Einseitige Startseite mit Hero, Willkommen, Leistungen, Über mich, Projekte und Kontakt.
- Impressum und Datenschutzerklärung als eigene Seiten.
- Alle Texte, das Logo, die 13 Projektfotos und die Farbwelt von jgc-handwerk.de übernommen.

**Gestaltung** — Bewegungs- und Layoutsprache nach dem Vorbild fora.so, umgesetzt in der
bestehenden Farbwelt aus Sand, Holz und Taupe:

- Warmer Lichtschein im Hero, der langsam wandert.
- Kapsel-Etiketten über jeder Überschrift, große schlanke Raleway-Typografie.
- Karten aus mattiertem Glas mit einem Lichtfleck, der dem Mauszeiger folgt.
- Inhalte fahren beim Scrollen sanft herein.
- Leistungen als Reiter mit Bildtafel, per Tastatur bedienbar.
- Projektgalerie als Bahn, die beim Scrollen seitwärts läuft; auf schmalen Bildschirmen
  stattdessen zum Wischen.
- Zwei Vorher/Nachher-Regler, bedienbar mit Maus, Finger und Tastatur.

**Technik**

- Vanilla HTML/CSS/JS ohne Build-Schritt.
- Schriften und GSAP lokal eingebunden; die Seite lädt nichts von fremden Servern.
- Bilder als WebP, von 2,5 MB auf 1,2 MB verkleinert.
- Telefonnummer erstmals sichtbar in Kopf- und Fußzeile sowie im Kontaktbereich.
- Strukturierte Daten (schema.org) für die lokale Auffindbarkeit.
- Werkzeuge: lokaler Vorschau-Server, Schnellprüfung, ferngesteuerte Screenshots.

**Bewusst noch nicht angeschlossen**

- Das Kontaktformular prüft alle Eingaben, versendet aber nicht. `JGC.formularEndpunkt` in
  `assets/js/config.js` ist `null`; Besucher werden im Formular offen darauf hingewiesen und
  auf Telefon und E-Mail verwiesen.
