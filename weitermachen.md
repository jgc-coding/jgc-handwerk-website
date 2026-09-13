# Weitermachen

Stand: 13.09.2026 · Version 0.2.0 auf dem Branch, noch nicht veröffentlicht · letzter Tag `v0.1.0`

- **Vorschau:** https://jgc-coding.github.io/jgc-handwerk-website/ (zeigt noch 0.1.0)
- **Repo:** https://github.com/jgc-coding/jgc-handwerk-website
- **Branch:** `claude/jgc-handwerk-website-feedback-9766c5`, noch nicht in `main`
- **Lokal:** `node tools/server.mjs` → http://localhost:4173

## Stand

Gabriels Rückmeldungen zu V1 bis V4 und zum Logo sind eingearbeitet, Einzelheiten im
`CHANGELOG.md` unter 0.2.0. Kopf- und Fußzeile tragen wieder den Schriftzug der alten Seite,
der Startbereich das größere Kreis-Logo. Trockenbau steht ohne „Vorsatzschalen“, die
Dachdecker stehen bei Dach- und Gaubenbau. Das Kontaktformular schickt an das eigene
PHP-Skript `formular/senden.php`; es soll bei All-Inkl auf der Subdomain
`formular.jgc-handwerk.de` laufen (Gabriels Entscheidung, gleiches Muster wie JGC Lumen). Die
Datenschutzerklärung nennt All-Inkl samt AVV.

Geprüft: `node tools/pruefen.mjs` grün. `node tools/formular-test.mjs` 13 von 13 grün mit
PHP 8.3 und 8.5. Formular im Browser gegen lokales PHP: Erfolg, Feldfehler vom Server und
Verbindungsabbruch. Die abgefangene Mail stimmt samt Umlauten. Screenshots 1440×900 und
390×844.

**Nicht geprüft:** Mailzustellung bei All-Inkl und die PHP-Version, die All-Inkl für die neue
Subdomain einstellt.

## Offen

- **V3 wartet auf Gabriel**, alles im KAS: Subdomain `formular.jgc-handwerk.de` mit SSL anlegen,
  FTP-Nutzer nur für ihren Ordner anlegen, `senden.php` direkt in diesen Ordner laden, AVV
  bestätigen (MembersArea → Stammdaten → Auftragsverarbeitung).
- **Erst danach veröffentlichen.** 0.2.0 schickt an
  `https://formular.jgc-handwerk.de/senden.php`; fehlt die Datei, bekommt jeder Besucher beim
  Absenden eine Fehlermeldung.

## Nächste Schritte (Claude)

1. Selbsttest ohne Mail: `https://formular.jgc-handwerk.de/senden.php` im Browser muss
   `{"ok":false,"grund":"methode"}` zeigen. Ein Zertifikatsfehler heißt, SSL ist für die
   Subdomain noch nicht aktiv.
2. Mit Gabriels OK eine echte Test-Anfrage schicken: lokale Seite (`localhost:4173` ist als
   Herkunft erlaubt) mit dem echten Endpunkt; Gabriel bestätigt den Eingang. Scheitert es,
   Status und Kennung aus der Antwort nehmen und das PHP-Fehlerlog im KAS ansehen.
3. Mit Gabriels OK den Branch in `main` mergen und pushen, auf der Vorschau Version 0.2.0 und
   einen Formularversand prüfen, Tag `v0.2.0` setzen.
4. V4: Gabriel lässt die Datenschutzerklärung prüfen, sinnvoll nach Schritt 3.
5. Umzug auf die eigene Domain (V6): Hosting wählen, `noindex` und `robots.txt` entfernen,
   Datenschutz Abschnitt 2 anpassen, `og:image` auf die gültige Adresse.
6. Porträtfoto entfernen, falls Gabriel es nicht veröffentlicht haben will (offen seit 0.1.0).

## Aktuelle Stolperfallen/Workarounds

Dauerhafte Regeln stehen in der `CLAUDE.md`; hier nur, was beim Weitermachen sofort greift:

- **Sichtkontrollen nie über die Browser-Pane**, sondern mit
  `node tools/screenshots.mjs <ordner> [breite] [hoehe]`; mit `BASIS=<url>` auch gegen die
  veröffentlichte Seite.
- **Umlaute aus Python erscheinen in Git Bash als Ersatzzeichen.** Vor dem Verdacht auf einen
  Kodierungsfehler `PYTHONIOENCODING=utf-8` setzen — die Test-Mail selbst war korrekt.
- **Für die Stilprobe-Seite von JGC Lumen liegen Zugangsdaten und ein Hochlade-Skript** im
  privaten Repo `C:\Projekte\Stilprobe-Automatik`. Nur lesen, nichts daraus übernehmen: dieses
  Repo hier ist öffentlich.
