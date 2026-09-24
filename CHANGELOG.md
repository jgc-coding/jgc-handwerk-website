# Changelog

Alle nennenswerten Änderungen an dieser Website. Format nach SemVer (MAJOR.MINOR.PATCH).
Die Version steht als Single Source of Truth in `assets/js/config.js` und erscheint in der
Fußzeile.

## 0.5.0 — 2026-09-24

Gabriels Rückmeldungen zu 0.4.0.

- **Leistungen am Handy und Tablet:** Statt der Reiterleiste mit einem einzigen Bild darunter
  steht jetzt jede Leistung als eigene Karte da — Nummer, Titel und Kurztext, darunter ihr
  Bild mit der ausführlichen Beschreibung. Am PC bleiben die Reiter mit dem Bild daneben.
  Die Karten entstehen aus den Reitern selbst, die Texte stehen weiterhin nur einmal im HTML.
- **„bewusst-werken“ entfernt:** die Kachel „Gründungsmitglied“ im Abschnitt „Über mich“ und
  der Link in der Fußzeile.

## 0.4.0 — 2026-09-24

Neuer Startbereich: die Bretterwand aus Hero-Entwurf 2, von Gabriel ausgewählt und für bessere
Lesbarkeit überarbeitet.

**Hero „Bretterwand“**

- Beim Laden steht eine Wand aus acht Holzbrettern mit dem Kreis-Logo davor; die Teilung folgt
  den echten Fugen im Holzfoto. Beim Scrollen bleibt der Bereich stehen, die Bretter gleiten
  abwechselnd nach links und rechts weg, das Logo wandert an seinen Platz über der Überschrift,
  und Überschrift, Text, Knöpfe und Vertrauensleiste blenden ein. Mit der Maus verschieben sich
  die Bretter leicht gegeneinander.
- Lesbarkeit des ersten Bildes: hinter dem Leitsatz „ressourcen- und zeiteffizient“ liegt eine
  halb deckende, leicht weichgezeichnete helle Kapsel, hinter den Buchstaben des Logos eine
  ebensolche helle Ebene, hinter „Scrollen“ eine dunkle. Gemessener Kontrast an den dunkelsten
  Stellen: Leitsatz 2,5 → 8,1, Logo-Buchstaben 1,8 → 4,5 (Median 2,3 → 5,1), Hinweis 2,2 → 6,0.
  Der Schatten des Logos schien vorher durch die durchsichtigen Buchstaben und machte sie trüb.
- Tastatur: springt der Fokus in den noch verdeckten Inhalt, öffnet sich die Wand sofort.
  Klicks auf die geschlossene Wand lösen keine unsichtbaren Links mehr aus.
- Am Handy reicht die Wand bis zur vollen Bildschirmhöhe, damit beim Einklappen der
  Adressleiste unten kein heller Streifen entsteht; Größenwechsel durch die Adressleiste lösen
  keine Neuberechnung mitten im Scrollen aus.
- Ohne JavaScript und bei ruhiger Darstellung steht die Wand als ruhiges Holzband über dem
  sichtbaren Inhalt.

**Aufgeräumt**

- Die drei Entwürfe (`hero-varianten/`) samt Werkzeug für die Holzebenen sind aus dem Repo
  entfernt. Eine startbare Kopie liegt bei Gabriel lokal; im Repo stecken sie im Commit ef41e2e.
- Neues Werkzeug `tools/regression.mjs`: prüft Hero, Projektbahn, Reiter, Formular, Regler,
  Menü, Lesbarkeit, ohne JavaScript und ruhige Darstellung im Chrome ohne Fenster.

## 0.3.0 — 2026-09-13

Feinschliff an Bewegung und Übergängen nach dem Vorbild fora.so und der Midsummer-Seite,
dazu der Fehlerfix an der Projektbahn.

**Projektbahn (Fehlerfix)**

- Die Bildleiste springt nicht mehr, wenn der Seitwärtslauf endet und man weiterscrollt.
  Ursache: Bahn und Gleis trugen als `reveal`-Elemente eine CSS-Transition auf `transform`;
  ScrollTrigger setzt beim Lösen der Anheftung aber Positionen sofort, und die Transition
  ließ die Leiste sichtbar nachschwingen. Die Einblendung übernehmen jetzt die einzelnen
  Karten, gestaffelt und ohne Wirkung auf die Bahn selbst.
- Die Bahn fährt nur noch über die ersten 82 Prozent der angehefteten Strecke und steht
  die letzten 18 Prozent still — das letzte Bild ist jetzt wirklich in Ruhe zu sehen,
  bevor die Seite weiterscrollt.

**Hero**

- Gestaffelter Auftritt beim Laden: Logo mit Goldschein, Kapsel-Etikett, Überschrift
  Wort für Wort, dann Text, Knöpfe und die Vertrauensleiste Eintrag für Eintrag.
- Die drei Gewerke in der Überschrift stehen jetzt in Goldbraun.
- Zeiger-Parallaxe: Lichtschein, Holztextur und zwei neue feine Ringe (einer dreht
  gestrichelt wie eine technische Zeichnung) weichen der Maus weich aus.
- Beim Herausscrollen verlässt der Inhalt den Hero langsamer als die Seite und
  verblasst — der Übergang zum ersten Abschnitt bekommt Tiefe.
- Scroll-Hinweis am unteren Rand mit ablaufendem Lichtpunkt; verblasst beim ersten
  Scrollen, auf schmalen Bildschirmen aus.

**Übergänge der ganzen Seite**

- Alle Abschnittsüberschriften und das Zitat im Über-mich-Bereich bauen sich beim
  Eintreten Wort für Wort auf (mit Klartext-Absicherung für Vorleseprogramme).
- Lesefaden: eine dünne Goldlinie am oberen Rand zeigt den Scroll-Fortschritt.
- Leistungs-Reiter: das Bild des aktiven Panels setzt sich langsam zurecht, die
  Beschriftung steigt nach.

Alles respektiert weiterhin die ruhige Darstellung (`prefers-reduced-motion`) und
funktioniert ohne JavaScript: dann steht die Seite einfach vollständig da.

## 0.2.0 — 2026-09-13

Gabriels Rückmeldungen eingearbeitet: das Logo wie auf der alten Seite, ein Kontaktformular,
das wirklich versendet, und korrigierte Texte.

**Logo**

- Kopf- und Fußzeile zeigen wieder den Schriftzug der alten Seite, in der Fußzeile hell auf
  dunklem Grund. Der zusätzlich getippte Name daneben entfällt.
- Das Kreis-Logo bleibt im Startbereich und ist dort größer.

**Kontaktformular**

- Anfragen gehen an ein eigenes PHP-Skript (`formular/senden.php`) bei All-Inkl auf der
  Subdomain formular.jgc-handwerk.de und von dort als E-Mail an kontakt@jgc-handwerk.de. Es gibt
  keinen Formulardienst, und gespeichert wird nichts. Gleiches Muster wie bei JGC Lumen.
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
