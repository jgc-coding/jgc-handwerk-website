# Changelog

Alle nennenswerten Änderungen an dieser Website. Format nach SemVer (MAJOR.MINOR.PATCH).
Die Version steht als Single Source of Truth in `assets/js/config.js` und erscheint in der
Fußzeile.

## 0.2.0 — 2026-09-13

Gabriels Rückmeldungen eingearbeitet: das Logo wie auf der alten Seite, ein Kontaktformular,
das wirklich versendet, und korrigierte Texte.

**Logo**

- Kopf- und Fußzeile zeigen wieder den Schriftzug der alten Seite, in der Fußzeile hell auf
  dunklem Grund. Der zusätzlich getippte Name daneben entfällt.
- Das Kreis-Logo bleibt im Startbereich und ist dort größer.

**Kontaktformular**

- Anfragen gehen an ein eigenes PHP-Skript (`formular/senden.php`) auf dem Webspace bei All-Inkl
  und von dort als E-Mail an kontakt@jgc-handwerk.de. Es gibt keinen Formulardienst, und
  gespeichert wird nichts.
- Das Skript prüft alle Eingaben ein zweites Mal, nimmt nur Einsendungen von der eigenen Website
  an und hält Automaten über Köderfeld und Zeitprüfung fern.
- Fehler zeigen einen verständlichen Satz und darunter eine Diagnose-Zeile mit Kennung. Bleibt die
  Antwort 20 Sekunden aus, bricht der Versand sichtbar ab.
- Der Senden-Knopf behält nach dem Versand sein Pfeil-Symbol.
- Neues Werkzeug `tools/formular-test.mjs`: prüft das Skript lokal mit PHP in Docker in 13 Fällen.

**Texte**

- Trockenbau ohne „Vorsatzschalen“. Dachdecker stehen jetzt bei „Zuarbeit Dach- und Gaubenbau“.
- Prüf-Markierungen aus den Leistungstexten entfernt.
- Der Zustimmungstext am Formular passt jetzt zur Datenschutzerklärung.
- Datenschutzerklärung: All-Inkl für Formular und E-Mail samt Auftragsverarbeitung, neu gefasster
  Abschnitt zum Kontaktformular.
- Gesetzesnamen aktualisiert: DDG statt TMG im Impressum, TDDDG statt TTDSG in der
  Datenschutzerklärung.

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
